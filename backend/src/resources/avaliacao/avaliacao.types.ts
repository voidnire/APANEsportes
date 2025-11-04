import { RegistroAvaliacao, TipoSessao } from "@prisma/client";

/**
 * DTO para um único resultado de métrica enviado no array
 * (Ex: { tipoMetricaId: "uuid-do-tempo", valor: 12.5 })
 */
export interface ResultadoMetricaDTO {
  tipoMetricaId: string;
  valor: number; // O Joi e o Service irão validar e converter para Decimal
}

/**
 * DTO para CRIAR uma nova avaliação (Payload da Tela 2)
 */
export interface CreateAvaliacaoDTO {
  atletaId: string;
  modalidadeId: string;
  tipo: TipoSessao; // Enum: "PRE_TREINO" ou "POS_TREINO"
  observacoes?: string;
  dataHora?: Date; // Opcional, o banco pode usar default(now())
  
  // Deve conter pelo menos um resultado
  resultados: ResultadoMetricaDTO[];
}

/**
 * DTO para os FILTROS de busca de avaliações
 * (Query Params da Tela 3)
 */
export interface GetAvaliacoesQueryDTO {
  atletaId: string; // Obrigatório para saber de quem buscar
  modalidadeId?: string;
  tipo?: TipoSessao;
  dataInicio?: Date;
  dataFim?: Date;
}