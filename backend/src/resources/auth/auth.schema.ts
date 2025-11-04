import Joi from "joi";

// Regex forte para senhas (o mesmo do seu exemplo)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Schema para a rota: POST /auth/signup
export const authSignUpSchema = Joi.object().keys({
  nomeCompleto: Joi.string().trim().min(3).max(255).required().messages({
    "string.min": "Nome completo deve ter no mínimo 3 caracteres",
    "string.max": "Nome completo deve ter no máximo 255 caracteres",
    "string.empty": "Nome completo é obrigatório",
    "any.required": "Nome completo é obrigatório",
  }),

  email: Joi.string()
    .trim()
    .lowercase()
    .max(255)
    .email({ tlds: { allow: false } }) // proíbe "email@localhost"
    .required()
    .messages({
      "string.max": "E-mail deve ter no máximo 255 caracteres",
      "string.email": "E-mail inválido",
      "string.empty": "E-mail é obrigatório",
      "any.required": "E-mail é obrigatório",
    }),

  password: Joi.string().trim().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "A senha deve ter pelo menos 8 caracteres, incluindo 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial.",
    "string.empty": "Senha é obrigatória",
    "any.required": "Senha é obrigatória",
  }),
});

// Schema para a rota: POST /auth/login
export const authLoginSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .lowercase()
    .max(255)
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "E-mail inválido",
      "string.empty": "E-mail é obrigatório",
      "any.required": "E-mail é obrigatório",
    }),

  password: Joi.string().trim().required().messages({
    "string.empty": "Senha é obrigatória",
    "any.required": "Senha é obrigatória",
  }),
});