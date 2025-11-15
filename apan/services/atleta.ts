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

export interface EditAtletaDto {
  nomeCompleto: string;
  dataNascimento: string;
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

  // (Esta função já definimos no plano anterior)
  // (Rota GET /v1/avaliacoes/)
  async getAvaliacoesByAtletaId(atletaId: string): Promise<RegistroAvaliacaoCompleto[]> {
    try {
      const response = await apiClient.get<RegistroAvaliacaoCompleto[]>(
        `/avaliacoes?atletaId=${atletaId}`
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

  async createAtletaClassicacao(data: CreateAtletaDto): Promise<AtletaResumido> {
    try {
      const response = await apiClient.post<AtletaResumido>('/atletas', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar atleta:", error);
      throw error;
    }
  }
  
}

export default new AtletaService();