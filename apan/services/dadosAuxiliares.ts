import apiClient from './index';
// Importamos os tipos que definimos
import { 
    Classificacao, Modalidade, TipoMetrica, ResultadoMetrica
} from '../models/atletas';


//POST /v1/atletas/[ID_DO_JOAO]/classificacoes
class DadosAuxiliaresService {
    async getClassificacoes(): Promise<Classificacao[]> {
    try {
      // Esta rota (sem query) retorna todas as avaliações
      const response = await apiClient.get<Classificacao[]>('/dados-auxiliares/classificacoes');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar as classificações:", error);
      throw error;
    }
  }

  async getModalidades(): Promise<Modalidade[]> {
    try {
      // Esta rota (sem query) retorna todas as avaliações
      const response = await apiClient.get<Modalidade[]>('/dados-auxiliares/modalidades');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar as modalidades:", error);
      throw error;
    }
  }

  async getMetrica(id: string): Promise<TipoMetrica[]> { // id da modalidade
        try {
        // Esta rota (sem query) retorna todas as avaliações
        const response = await apiClient.get<TipoMetrica[]>(`/dados-auxiliares/${id}/modalidades`); // id da modalidade
        return response.data;
        } catch (error) {
        console.error("Erro ao buscar as métricas:", error);
        throw error;
        }
    }
}

export default new DadosAuxiliaresService();