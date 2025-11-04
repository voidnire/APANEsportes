import Joi from "joi";
import { TipoSessao } from "@prisma/client"; // Importa o Enum do Prisma

// Schema para o sub-objeto de resultados (o array)
const resultadoMetricaSchema = Joi.object().keys({
  tipoMetricaId: Joi.string().uuid().required().messages({
    "string.guid": "ID da métrica (tipoMetricaId) inválido",
    "any.required": "ID da métrica é obrigatório",
    "string.empty": "ID da métrica é obrigatório",
  }),
  valor: Joi.number().positive().required().messages({
    "number.base": "O 'valor' da métrica deve ser um número",
    "number.positive": "O 'valor' da métrica deve ser um número positivo",
    "any.required": "O 'valor' da métrica é obrigatório",
  }),
});

// Schema para o body de: POST /v1/avaliacoes (Tela 2)
export const createAvaliacaoSchema = Joi.object().keys({
  atletaId: Joi.string().uuid().required().messages({
    "string.guid": "ID do atleta (atletaId) inválido",
    "any.required": "ID do atleta é obrigatório",
    "string.empty": "ID do atleta é obrigatório",
  }),
  modalidadeId: Joi.string().uuid().required().messages({
    "string.guid": "ID da modalidade (modalidadeId) inválido",
    "any.required": "ID da modalidade é obrigatório",
    "string.empty": "ID da modalidade é obrigatório",
  }),
  tipo: Joi.string()
    .valid(TipoSessao.PRE_TREINO, TipoSessao.POS_TREINO) // Valida contra o Enum
    .required()
    .messages({
      "any.only": "O 'tipo' deve ser 'PRE_TREINO' ou 'POS_TREINO'",
      "any.required": "O 'tipo' é obrigatório",
    }),
  observacoes: Joi.string().trim().allow("").optional(),
  dataHora: Joi.date().optional().messages({
    "date.base": "Data/Hora inválida (use o formato ISO YYYY-MM-DDTHH:MM:SSZ)",
  }),
  resultados: Joi.array()
    .items(resultadoMetricaSchema)
    .min(1) // Deve enviar pelo menos UM resultado
    .required()
    .messages({
      "array.base": "O campo 'resultados' deve ser um array",
      "array.min": "Pelo menos um 'resultado' de métrica é obrigatório",
      "any.required": "O campo 'resultados' é obrigatório",
    }),
});

// Schema para os query params de: GET /v1/avaliacoes (Tela 3)
export const getAvaliacoesSchema = Joi.object().keys({
  atletaId: Joi.string().uuid().required().messages({
    "string.guid": "O query param 'atletaId' é inválido (UUID esperado)",
    "any.required": "O query param 'atletaId' é obrigatório",
    "string.empty": "O query param 'atletaId' é obrigatório",
  }),
  modalidadeId: Joi.string().uuid().optional().messages({
    "string.guid": "O query param 'modalidadeId' é inválido (UUID esperado)",
  }),
  tipo: Joi.string()
    .valid(TipoSessao.PRE_TREINO, TipoSessao.POS_TREINO)
    .optional()
    .messages({
      "any.only": "O query param 'tipo' deve ser 'PRE_TREINO' ou 'POS_TREINO'",
    }),
  dataInicio: Joi.date().optional().messages({
    "date.base": "Query param 'dataInicio' inválido (use o formato YYYY-MM-DD)",
  }),
  dataFim: Joi.date().optional().messages({
    "date.base": "Query param 'dataFim' inválido (use o formato YYYY-MM-DD)",
  }),
});