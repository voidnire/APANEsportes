import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { StatusCodes } from "http-status-codes";
import { Usuario } from "@prisma/client";
// (A SOLUÇÃO CORRETA) Importa 'mock' e 'MockProxy'
import { mock, MockProxy } from "jest-mock-extended";

import * as authController from "../auth.controller";
import * as authService from "../auth.service";
import { LoginDTO, SignUpDTO } from "../auth.types";

// Mocka o módulo de serviço inteiro
jest.mock("../auth.service");

// "Tipa" o service mocado para o TypeScript
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// --- Dados de Mock ---
const mockUser: Usuario = {
  id: "uuid-user-1",
  nomeCompleto: "Treinador Teste",
  email: "teste@treinador.com",
  senhaHash: "hash_secreto",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sanitizedUser = {
  id: mockUser.id,
  nomeCompleto: mockUser.nomeCompleto,
  email: mockUser.email,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
};

const mockLoginDTO: LoginDTO = {
  email: "teste@treinador.com",
  password: "Password@123",
};
// --- Fim dos Dados de Mock ---

describe("Auth Controller (Unit)", () => {
  // (CORREÇÃO TS2322) Usa MockProxy para tipagem
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;
  let mockSessionDestroy: jest.Mock<(callback: (err: unknown) => void) => void>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock da função destroy da sessão
    // (Usando 'unknown' como no seu exemplo para máxima compatibilidade)
    mockSessionDestroy = jest.fn((callback: (err: unknown) => void) => callback(null));

    // (CORREÇÃO TS2322) Cria mocks tipados com jest-mock-extended
    req = mock<Request>();
    res = mock<Response>();

    // Configura comportamento do mock para suportar encadeamento
    // (Exatamente como no seu exemplo)
    res.status.mockReturnValue(res);
    res.clearCookie.mockReturnValue(res);
    res.json.mockReturnValue(res);
    res.send.mockReturnValue(res);

    // Sessão tipada corretamente (Exatamente como no seu exemplo)
    req.session = {
      destroy: mockSessionDestroy,
    } as unknown as Session & SessionData;
  });

  // --- signup ---
  describe("signup", () => {
    it("deve retornar 400 se o e-mail já existir", async () => {
      const signUpDTO: SignUpDTO = {
        nomeCompleto: "Teste",
        email: "existente@email.com",
        password: "Password@123",
      };

      // Atribui o body ao mock
      // (jest-mock-extended permite atribuição direta)
      req.body = signUpDTO; 
      mockedAuthService.getUsuarioByEmail.mockResolvedValue(mockUser);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        fieldErrors: { email: "E-mail já cadastrado." },
      });
    });

    it("deve retornar 201 e o usuário sanitizado", async () => {
      const signUpDTO: SignUpDTO = {
        nomeCompleto: "Novo User",
        email: "novo@email.com",
        password: "Password@123",
      };
      req.body = signUpDTO;
      mockedAuthService.getUsuarioByEmail.mockResolvedValue(null);
      mockedAuthService.createUsuario.mockResolvedValue(mockUser);

      await authController.signup(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(sanitizedUser);
    });
  });

  // --- login ---
  describe("login", () => {
    it("deve retornar 401 se credenciais inválidas", async () => {
      req.body = mockLoginDTO;
      mockedAuthService.checkCredentials.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
      expect(res.json).toHaveBeenCalledWith({
        message: "E-mail ou senha inválidos.",
      });
    });

    it("deve retornar 200 e definir sessão", async () => {
      req.body = mockLoginDTO;
      mockedAuthService.checkCredentials.mockResolvedValue(mockUser);

      await authController.login(req, res);

      expect(req.session!.uid).toBe(mockUser.id);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(sanitizedUser);
    });
  });

  // --- logout ---
  describe("logout", () => {
    it("deve retornar 401 se não houver sessão", async () => {
      req.session!.uid = undefined;
      await authController.logout(req, res);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.UNAUTHORIZED);
    });

    it("deve destruir sessão e retornar 200", async () => {
      req.session!.uid = mockUser.id;

      await authController.logout(req, res);

      expect(mockSessionDestroy).toHaveBeenCalledTimes(1);
      expect(res.clearCookie).toHaveBeenCalledWith("connect.sid");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logout realizado com sucesso",
      });
    });

    it("deve retornar 500 se destroy falhar", async () => {
      req.session!.uid = mockUser.id;
      // (CORREÇÃO TS2345)
      // O mockImplementationOnce funciona corretamente
      mockSessionDestroy.mockImplementationOnce((cb) =>
        cb(new Error("Erro no Redis"))
      );

      await authController.logout(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        message: "Erro ao encerrar sessão",
      });
    });
  });

  // --- me ---
  describe("me", () => {
    it("deve retornar 404 se usuário não existir", async () => {
      req.session!.uid = "uuid-invalido";
      mockedAuthService.getUsuarioById.mockResolvedValue(null);

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "Usuário não encontrado",
      });
    });

    it("deve retornar 200 e o usuário logado", async () => {
      req.session!.uid = mockUser.id;
      mockedAuthService.getUsuarioById.mockResolvedValue(mockUser);

      await authController.me(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(sanitizedUser);
    });
  });
});