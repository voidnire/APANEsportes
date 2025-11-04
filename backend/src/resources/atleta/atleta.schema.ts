import Joi from "joi";

// Schema para validar o ':id' do atleta na URL (ex: /atletas/uuid-aqui)
export const atletaIdParamSchema = Joi.object().keys({
  id: Joi.string().uuid().required().messages({
    "string.base": "ID do atleta deve ser um texto",
    "string.guid": "ID do atleta inválido (UUID esperado)",
    "any.required": "ID do atleta é obrigatório",
  }),
});

// Schema para validar o body ao CRIAR (POST /atletas)
export const createAtletaSchema = Joi.object().keys({
  nomeCompleto: Joi.string().trim().min(3).max(255).required().messages({
    "string.min": "Nome completo deve ter no mínimo 3 caracteres",
    "string.max": "Nome completo deve ter no máximo 255 caracteres",
    "string.empty": "Nome completo é obrigatório",
    "any.required": "Nome completo é obrigatório",
  }),
  dataNascimento: Joi.date().required().messages({
    "date.base": "Data de nascimento inválida (use o formato YYYY-MM-DD)",
    "any.required": "Data de nascimento é obrigatória",
  }),
});

// Schema para validar o body ao ATUALIZAR (PUT /atletas/:id)
export const updateAtletaSchema = Joi.object().keys({
  // Todos os campos são opcionais na atualização
  nomeCompleto: Joi.string().trim().min(3).max(255).optional().messages({
    "string.min": "Nome completo deve ter no mínimo 3 caracteres",
    "string.max": "Nome completo deve ter no máximo 255 caracteres",
  }),
  dataNascimento: Joi.date().optional().messages({
    "date.base": "Data de nascimento inválida (use o formato YYYY-MM-DD)",
  }),
});

// Schema para ASSOCIAR uma classificação (POST /atletas/:id/classificacoes)
export const associateClassificacaoSchema = Joi.object().keys({
  classificacaoId: Joi.string().uuid().required().messages({
    "string.guid": "ID da classificação inválido (UUID esperado)",
    "any.required": "ID da classificação é obrigatório",
  }),
});

// Schema para validar os params ao DESASSOCIAR (DELETE /atletas/:id/classificacoes/:classificacaoId)
export const disassociateClassificacaoParamsSchema = Joi.object().keys({
  id: Joi.string().uuid().required().messages({
    "string.guid": "ID do atleta inválido (UUID esperado)",
    "any.required": "ID do atleta é obrigatório",
  }),
  classificacaoId: Joi.string().uuid().required().messages({
    "string.guid": "ID da classificação inválido (UUID esperado)",
    "any.required": "ID da classificação é obrigatório",
  }),
});