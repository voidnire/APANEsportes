import apiClient from './index';
// Importamos os tipos que definimos
import { 
    Classificacao, Modalidade, TipoMetrica, ResultadoMetrica
} from '../models/atletas';

interface ResultadoMetricaDTO{
    tipoMetrica: string;
    valor: number;
}

interface RegistroTreinoCompleto{
    atletaId: string;
    modalidadeId: string;
    tipo: 'PRE_TREINO' | 'POS_TREINO';
    observacoes: string;
    dataHora: string; 
    resultados: ResultadoMetricaDTO[];
}

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

  async registrarTreino(treino:RegistroTreinoCompleto): Promise<RegistroTreinoCompleto>{
    try {
        console.log("Registrando treino:", treino);

        const response = await apiClient.post<RegistroTreinoCompleto>('/avaliacoes',treino);
        return response.data;
    } catch (error) {
        console.error("Erro ao registrar o treino:", error);
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

  //Lista quais métricas (Tempo,Distancia, etc) estão associadas a uma modalidade
  async getMetricas(id: string): Promise<TipoMetrica[]> { // id da modalidade
        try {
        // Esta rota (sem query) retorna todas as avaliações
        const response = await apiClient.get<TipoMetrica[]>(`/dados-auxiliares/modalidades/${id}/metricas`); // id da modalidade
        return response.data;
        } catch (error) {
        console.error("Erro ao buscar as métricas:", error);
        throw error;
        }
    }
}

export default new DadosAuxiliaresService();