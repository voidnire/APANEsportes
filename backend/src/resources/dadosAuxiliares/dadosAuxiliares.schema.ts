import Joi from "joi";

// Schema para validar o ':id' da modalidade na URL
// Ex: GET /v1/dados-auxiliares/modalidades/uuid-aqui/metricas
export const modalidadeIdParamSchema = Joi.object().keys({
  id: Joi.string().uuid().required().messages({
    "string.base": "ID da modalidade deve ser um texto",
    "string.guid": "ID da modalidade inválido (UUID esperado)",
    "any.required": "ID da modalidade é obrigatório",
    "string.empty": "ID da modalidade é obrigatório",
  }),
});