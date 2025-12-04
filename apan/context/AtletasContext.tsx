// contexts/AtletasContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AtletaService from '@/services/atleta';
import { useUser } from '@/hooks/useUser'; // ajuste se seu hook estiver em outro caminho
import { AtletaResumido } from '@/models/atletas';

type AtletasContextShape = {
  atletas: AtletaResumido[];
  loading: boolean;
  refreshAtletas: () => Promise<void>;
  invalidateAtletasCache: () => Promise<void>;
};

const AtletasContext = createContext<AtletasContextShape | undefined>(undefined);

const STORAGE_PREFIX = 'atletas';

async function saveAtletasToStorage(userId: string, atletas: AtletaResumido[] | null) {
  try {
    const key = `${STORAGE_PREFIX}:${userId}`;
    if (!atletas || atletas.length === 0) {
      await AsyncStorage.removeItem(key);
      return;
    }
    await AsyncStorage.setItem(key, JSON.stringify(atletas));
  } catch (err) {
    console.warn('Erro salvando atletas no AsyncStorage', err);
  }
}

async function loadAtletasFromStorage(userId: string): Promise<AtletaResumido[] | null> {
  try {
    const key = `${STORAGE_PREFIX}:${userId}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AtletaResumido[];
    return parsed;
  } catch (err) {
    console.warn('Erro lendo atletas do AsyncStorage', err);
    return null;
  }
}

async function removeAtletasStorageForUser(userId: string) {
  try {
    const key = `${STORAGE_PREFIX}:${userId}`;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.warn('Erro removendo atletas do AsyncStorage', err);
  }
}

export function AtletasProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser(); // espera que useUser retorne { user } com user.id
  const [atletas, setAtletas] = useState<AtletaResumido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // refs para evitar reentrância
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ao mudar de usuário, restaura do storage e revalida em background
  useEffect(() => {
    let isActive = true;
    const init = async () => {
      setLoading(true);

      // se não tem usuário logado -> limpa estado e retorna
      if (!user?.id) {
        setAtletas([]);
        setLoading(false);
        return;
      }

      // tentar restaurar do AsyncStorage
      const fromStorage = await loadAtletasFromStorage(user.id);
      if (isActive && fromStorage && fromStorage.length > 0) {
        setAtletas(fromStorage);
        // não setLoading(false) ainda — vamos revalidar em background
      }

      // fetch em background para garantir dados frescos
      try {
        const fresh = await AtletaService.getAtletas();
        const sorted = (fresh || []).slice().sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
        if (!isActive) return;
        setAtletas(sorted);
        await saveAtletasToStorage(user.id, sorted);
      } catch (err) {
        console.error('Erro buscando atletas', err);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    init();

    return () => {
      isActive = false;
    };
  }, [user?.id]);

  // limpa storage quando o usuário faz logout (user vira null)
  useEffect(() => {
    if (!user) {
      // opcional: remover todas as chaves com prefixo STORAGE_PREFIX
      (async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const atletasKeys = keys.filter((k) => k.startsWith(`${STORAGE_PREFIX}:`));
          if (atletasKeys.length) await AsyncStorage.multiRemove(atletasKeys);
        } catch (err) {
          console.warn('Erro limpando atletas do AsyncStorage no logout', err);
        }
      })();
    }
  }, [user]);

  // exposto: força refresh e salva no storage
  const refreshAtletas = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const fresh = await AtletaService.getAtletas();
      const sorted = (fresh || []).slice().sort((a, b) => a.nomeCompleto.localeCompare(b.nomeCompleto));
      setAtletas(sorted);
      await saveAtletasToStorage(user.id, sorted);
    } catch (err) {
      console.error('Erro no refreshAtletas', err);
    } finally {
      setLoading(false);
    }
  };

  const invalidateAtletasCache = async () => {
    if (!user?.id) {
      setAtletas([]);
      return;
    }
    await removeAtletasStorageForUser(user.id);
    setAtletas([]);
  };

  const value: AtletasContextShape = {
    atletas,
    loading,
    refreshAtletas,
    invalidateAtletasCache,
  };

  return <AtletasContext.Provider value={value}>{children}</AtletasContext.Provider>;
}

// consumer hook
export function useAtletasContext(): AtletasContextShape {
  const ctx = useContext(AtletasContext);
  if (!ctx) throw new Error('useAtletasContext must be used within AtletasProvider');
  return ctx;
}
