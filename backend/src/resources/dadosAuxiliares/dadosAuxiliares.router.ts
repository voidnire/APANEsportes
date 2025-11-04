import { Router } from "express";
import * as dadosController from "./dadosAuxiliares.controller";
import { isAuth } from "../../middlewares/isAuth";
import validate from "../../middlewares/validate";
import { modalidadeIdParamSchema } from "./dadosAuxiliares.schema";

const router = Router();

// ====================================================================
// APLICA 'isAuth' A TODAS AS ROTAS DESTE MÓDULO
router.use(isAuth);
// ====================================================================

// GET /v1/dados-auxiliares/classificacoes
router.get("/classificacoes", dadosController.getClassificacoes);

// GET /v1/dados-auxiliares/modalidades
router.get("/modalidades", dadosController.getModalidades);

// GET /v1/dados-auxiliares/modalidades/:id/metricas
router.get(
  "/modalidades/:id/metricas",
  validate(modalidadeIdParamSchema, "params"), // Valida o :id na URL
  dadosController.getMetricasByModalidade
);

export default router;