import { Router } from "express";
import * as avaliacaoController from "./avaliacao.controller";
import { isAuth } from "../../middlewares/isAuth";
import validate from "../../middlewares/validate";
import {
  createAvaliacaoSchema,
  getAvaliacoesSchema,
} from "./avaliacao.schema";

const router = Router();

// ====================================================================
// APLICA 'isAuth' A TODAS AS ROTAS DESTE MÓDULO
router.use(isAuth);
// ====================================================================

// POST /v1/avaliacoes (Tela 2)
router.post(
  "/",
  validate(createAvaliacaoSchema, "body"),
  avaliacaoController.createAvaliacao
);

// GET /v1/avaliacoes (Tela 3 e 5)
router.get(
  "/",
  validate(getAvaliacoesSchema, "query"), // Valida os query params
  avaliacaoController.getAvaliacoes
);

export default router;