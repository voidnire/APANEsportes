import { Router } from "express";
import * as atletaController from "./atleta.controller";
import { isAuth } from "../../middlewares/isAuth"; // Importa seu middleware
import validate from "../../middlewares/validate"; // Importa seu middleware
import {
  atletaIdParamSchema,
  createAtletaSchema,
  updateAtletaSchema,
  associateClassificacaoSchema,
  disassociateClassificacaoParamsSchema,
} from "./atleta.schema";

const router = Router();

// ====================================================================
// APLICA 'isAuth' A TODAS AS ROTAS DESTE MÓDULO
// Nenhuma rota de atleta pode ser acessada sem login
router.use(isAuth);
// ====================================================================

// --- CRUD Básico do Atleta (Telas 4 e 5) ---

// POST /v1/atletas
router.post(
  "/",
  validate(createAtletaSchema, "body"),
  atletaController.createAtleta
);

// GET /v1/atletas
router.get("/", atletaController.getAtletas);

// GET /v1/atletas/:id
router.get(
  "/:id",
  validate(atletaIdParamSchema, "params"),
  atletaController.getAtleta
);

// PUT /v1/atletas/:id
router.put(
  "/:id",
  validate(atletaIdParamSchema, "params"),
  validate(updateAtletaSchema, "body"),
  atletaController.updateAtleta
);

// DELETE /v1/atletas/:id
router.delete(
  "/:id",
  validate(atletaIdParamSchema, "params"),
  atletaController.deleteAtleta
);

// --- Gerenciamento da Relação N:M (Classificações) ---

// POST /v1/atletas/:id/classificacoes
router.post(
  "/:id/classificacoes",
  validate(atletaIdParamSchema, "params"),
  validate(associateClassificacaoSchema, "body"),
  atletaController.associateClassificacao
);

// DELETE /v1/atletas/:id/classificacoes/:classificacaoId
router.delete(
  "/:id/classificacoes/:classificacaoId",
  validate(disassociateClassificacaoParamsSchema, "params"),
  atletaController.disassociateClassificacao
);

export default router;