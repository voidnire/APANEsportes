// (Arquivo: services/atletaService.ts)
import apiClient from './index';
// Importamos os tipos que definimos
import { AtletaDetalhado, AtletaResumido, RegistroAvaliacaoCompleto
  , Classificacao
 } from '../models/atletas';


// 1. Interface para os dados de criação (baseado no Swagger)
export interface CreateAtletaDto {
  nomeCompleto: string;
  dataNascimento: string;
}

export interface ClassificacaoDto {
  classificacaoId: string;
}

export interface EditAtletaDto {
  nomeCompleto: string;
  dataNascimento: string;
}

interface AvaliacaoFiltros {
  modalidadeId?: string; // Filtrar por ID da modalidade
  tipo?: string;         // Filtrar por tipo de sessão
  dataInicio?: string;   // Data inicial (YYYY-MM-DD)
  dataFim?: string;      // Data final (YYYY-MM-DD)
}

class AtletaService {
  
  // --- ADICIONE ESTA FUNÇÃO ---
  // (Rota GET /v1/atletas)
  async getAtletas(): Promise<AtletaResumido[]> {
    try {
      const response = await apiClient.get<AtletaResumido[]>('/atletas');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar lista de atletas:", error);
      throw error;
    }
  }
  
  // (Esta função já definimos no plano anterior)
  // (Rota GET /v1/atletas/{id})
  async getAtletaById(id: string): Promise<AtletaDetalhado> {
    try {
      const response = await apiClient.get<AtletaDetalhado>(`/atletas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar atleta:", error);
      throw error;
    }
  }

  // (Rota GET /v1/avaliacoes/)
  // Lista o histórico de avaliações de um atleta, com filtros opcionais
  async getAvaliacoesByAtletaId(atletaId: string, filtros?: AvaliacaoFiltros): Promise<RegistroAvaliacaoCompleto[]> {
    try {

      const params = {
        atletaId,
        ...filtros
      };

      const searchParams = new URLSearchParams();

      for (const key in params) {
          const value = params[key as keyof typeof params];
          // Adiciona o par chave=valor se o valor existir (não for null, undefined ou string vazia)
          if (value) {
            searchParams.append(key, value);
          }
      }

      const queryString = searchParams.toString();

      console.log("");
      console.log("Query String:", queryString); // Log para depuração
      console.log("");

      const response = await apiClient.get<RegistroAvaliacaoCompleto[]>(
        `/avaliacoes?${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
      throw error;
    }
  }

  

  async createAtleta(data: CreateAtletaDto): Promise<AtletaResumido> {
    try {
      const response = await apiClient.post<AtletaResumido>('/atletas', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atleta:", error);
      throw error;
    }
  }

  async editAtleta(id: string,data: EditAtletaDto): Promise<AtletaResumido> {
    try {
      const response = await apiClient.put<AtletaResumido>(`/atletas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Erro ao editar atleta:", error);
      throw error;
    }
  }

  async deleteAtleta(id: string): Promise<AtletaResumido> {
    try {
      const response = await apiClient.delete<AtletaResumido>(`/atletas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao excluir atleta:", error);
      throw error;
    }
  }

  async getAllAvaliacoes(): Promise<RegistroAvaliacaoCompleto[]> {
    try {
      // Esta rota (sem query) retorna todas as avaliações
      const response = await apiClient.get<RegistroAvaliacaoCompleto[]>('/avaliacoes');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar todas as avaliações:", error);
      throw error;
    }
  }

  async createAtletaClassicacao(id: string,classificacao:ClassificacaoDto): Promise<void> {
    try {
      await apiClient.post<AtletaResumido>(`/atletas/${id}/classificacoes`, classificacao);
    } catch (error) {
      console.error("Erro ao associar classificação ao atleta:", error);
      throw error;
    }
  }
  
}

export default new AtletaService();