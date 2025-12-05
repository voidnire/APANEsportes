import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_PREFIX = '@atleta_videos_';

export interface LocalAnalysis {
  id: string;
  atletaId: string;
  data: string; // Data ISO
  tipo: string; // ex: "Salto Vertical"
  videoUrl: string;
  resultData: any; // O JSON completo da IA
}

export const AnalysisStorage = {
  // Salvar uma análise na lista do atleta
  save: async (atletaId: string, analysis: Omit<LocalAnalysis, 'id' | 'atletaId'>) => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${atletaId}`;
      const existingData = await AsyncStorage.getItem(key);
      const history: LocalAnalysis[] = existingData ? JSON.parse(existingData) : [];

      const newItem: LocalAnalysis = {
        id: Date.now().toString(),
        atletaId,
        ...analysis
      };

      // Adiciona no começo da lista (mais recente primeiro)
      const newHistory = [newItem, ...history];
      await AsyncStorage.setItem(key, JSON.stringify(newHistory));
      console.log('Análise salva localmente para o atleta:', atletaId);
      return true;
    } catch (error) {
      console.error('Erro ao salvar localmente:', error);
      return false;
    }
  },

  // Recuperar lista do atleta
  getByAtleta: async (atletaId: string): Promise<LocalAnalysis[]> => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${atletaId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar localmente:', error);
      return [];
    }
  },

  // (Opcional) Limpar dados de um atleta
  clearAtleta: async (atletaId: string) => {
      try {
          await AsyncStorage.removeItem(`${STORAGE_KEY_PREFIX}${atletaId}`);
      } catch (e) { console.error(e); }
  }
};