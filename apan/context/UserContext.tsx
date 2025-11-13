import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
// 1. AJUSTE: Importar AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// 2. AJUSTE: Importar 'setAuthToken' do 'index.ts'
import apiClient, { setAuthToken } from "../services/index";
import { User } from "../services/auth"; // A interface 'User' já está correta

export interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (nomeCompleto: string, email: string, senha: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthChecked] = useState(false)

  useEffect(() => {
    checkAuth();
  }, []);

  // 3. AJUSTE: checkAuth agora verifica o AsyncStorage
  async function checkAuth() {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        // Define o token no Axios ANTES de chamar a API
        setAuthToken(token);
        const response = await apiClient.get<User>("/auth/me");
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.log("ERRO checkAuth: ", error.message);
      setUser(null);
      setAuthToken(null); // Limpa token inválido
    } finally {
      setAuthChecked(true)
      setLoading(false);
    }
  }

  // 4. AJUSTE CRÍTICO: A função 'login'
  async function login(email: string, senha: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      setLoading(true);
      
      // 1. Chama o login E CAPTURA a resposta
      const response = await apiClient.post("/auth/login", {
        email,
        password: senha,
      });

      // 2. Extrai o 'user' e o 'token' da resposta (como o backend envia)
      const { user, token } = response.data;

      if (!user || !token) {
        throw new Error("Resposta de login inválida do servidor.");
      }
      
      // 3. Define o token para o Axios (e salva no AsyncStorage)
      setAuthToken(token);
      
      // 4. Define o usuário no estado
      setUser(user);

      return { success: true, user: user };

    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao fazer login";
      Alert.alert("Erro", message);
      setAuthToken(null); // Limpa o token em caso de erro
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  // (A função 'register' continua correta)
  async function register(nomeCompleto: string, email: string, senha: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      setLoading(true);
      
      await apiClient.post("auth/signup", {
        nomeCompleto: nomeCompleto,
        email: email,
        password: senha,
      });

      // login automático após registrar (esta função agora funciona)
      const loginResult = await login(email, senha);
      return loginResult;
      
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Erro ao criar conta";
      Alert.alert("Erro no Cadastro", message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  // 5. AJUSTE: 'logout' agora limpa o token
  async function logout() {
    try {
      // Tenta fazer o logout no servidor
      await apiClient.post("/auth/logout");
    } catch (error: any) {
      console.log("Erro no logout (será deslogado localmente):", error.message);
    } finally {
      // Limpa o estado e o token (local, do Axios e do AsyncStorage)
      setUser(null);
      setAuthToken(null); 
    }
  }

  useEffect(()=>{
    checkAuth()
  },[isAuthenticated])
  // antigo = isAuthenticated: !!user
  return (
    <UserContext.Provider value={{ user, login, register, logout, loading, isAuthenticated }}> 
      {children}
    </UserContext.Provider>
  );
}