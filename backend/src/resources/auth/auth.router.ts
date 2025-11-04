import { Router } from "express";
import * as authController from "./auth.controller"; // Importa como 'authController'
import { isAuth } from "../../middlewares/isAuth";
import validate from "../../middlewares/validate"; // Seu middleware de validação
import {
  authLoginSchema,
  authSignUpSchema,
} from "./auth.schema";

const router = Router();

// Rota de Cadastro (Pública)
router.post(
  "/signup",
  validate(authSignUpSchema, "body"), // Valida o body
  authController.signup
);

// Rota de Login (Pública)
router.post(
  "/login",
  validate(authLoginSchema, "body"), // Valida o body
  authController.login
);

// Rota de Logout (Protegida)
router.post("/logout", isAuth, authController.logout);

// Rota "Me" (Protegida)
router.get("/me", isAuth, authController.me);

export default router;