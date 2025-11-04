import { Router } from "express";
import authRouter from "../resources/auth/auth.router";
import atletaRouter from "../resources/atleta/atleta.router";
import avaliacaoRouter from "../resources/avaliacao/avaliacao.router";
import dadosAuxiliaresRouter from "../resources/dadosAuxiliares/dadosAuxiliares.router";



const router = Router();

// 2. Monte o router de autenticação
router.use(
  "/auth",
  // #swagger.tags = ['Autenticação'] // (Bom para o Swagger)
  authRouter
);

// Módulo de Atletas
router.use(
  "/atletas",
  // #swagger.tags = ['Atletas'] // 2. Adicionar Tag Swagger
  atletaRouter // 3. Usar o router
);

// Módulo de Avaliações
router.use(
  "/avaliacoes",
  // #swagger.tags = ['Avaliações'] // 2. Adicionar Tag
  avaliacaoRouter // 3. Usar o router
);


// Módulo de Dados Auxiliares
router.use(
  "/dados-auxiliares",
  // #swagger.tags = ['Dados Auxiliares'] // 2. Adicionar Tag
  dadosAuxiliaresRouter // 3. Usar o router
);

export default router;