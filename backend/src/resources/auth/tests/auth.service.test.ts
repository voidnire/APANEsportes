import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Usuario } from "@prisma/client";
import bcrypt from "bcryptjs";

// Importa o mock do Prisma do seu arquivo de setup
// **Ajuste este caminho se o seu setup estiver em outro lugar**
import { prismaMock } from "../../../tests/mocks/databaseMock"; 
import * as authService from "../auth.service";
import { LoginDTO, SignUpDTO } from "../auth.types";

// Mocka a biblioteca bcryptjs
// Isso intercepta 'import bcrypt from "bcryptjs"'
jest.mock("bcryptjs");

// Criamos mocks tipados para as funções do bcrypt
const mockedHash = bcrypt.hash as jest.Mock;
const mockedCompare = bcrypt.compare as jest.Mock;

// --- Dados de Mock ---
const mockUser: Usuario = {
  id: "uuid-user-1",
  nomeCompleto: "Treinador Teste",
  email: "teste@treinador.com",
  senhaHash: "$2a$10$abcdef...hash...xyz",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockSignUpDTO: SignUpDTO = {
  nomeCompleto: "Treinador Teste",
  email: "teste@treinador.com",
  password: "Password@123",
};

const mockLoginDTO: LoginDTO = {
  email: "teste@treinador.com",
  password: "Password@123",
};
// --- Fim dos Dados de Mock ---

describe("Auth Service (Unit)", () => {
  
  beforeEach(() => {
    // Limpa os mocks do bcrypt
    mockedHash.mockClear();
    mockedCompare.mockClear();
    // O prismaMock é resetado globalmente pelo seu 'prismaMockSetup.ts'
  });

  // Testes para getUsuarioByEmail
  describe("getUsuarioByEmail", () => {
    it("deve retornar um usuário se o e-mail existir", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(mockUser);

      const user = await authService.getUsuarioByEmail(mockUser.email);

      expect(user).toEqual(mockUser);
      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email.toLowerCase() },
      });
    });

    it("deve retornar null se o e-mail não existir", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      const user = await authService.getUsuarioByEmail("naoexiste@email.com");
      expect(user).toBeNull();
    });
  });

  // Testes para getUsuarioById
  describe("getUsuarioById", () => {
    it("deve retornar um usuário se o ID existir", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(mockUser);
      const user = await authService.getUsuarioById(mockUser.id);
      expect(user).toEqual(mockUser);
      expect(prismaMock.usuario.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
    });
  });

  // Testes para createUsuario
  describe("createUsuario", () => {
    it("deve fazer o hash da senha e criar um novo usuário", async () => {
      const hashedPassword = "hashed_password_mock";
      
      // Configura mock do bcrypt
      // Corrigido: .mockResolvedValue(hashedPassword)
      mockedHash.mockResolvedValue(hashedPassword as never); // 'as never' é um truque para o TS2345
      
      // Configura mock do Prisma
      const createdUserMock = { ...mockUser, senhaHash: hashedPassword };
      prismaMock.usuario.create.mockResolvedValue(createdUserMock);

      // Executa o service
      const user = await authService.createUsuario(mockSignUpDTO);

      // Assert (Bcrypt)
      expect(mockedHash).toHaveBeenCalledWith(mockSignUpDTO.password, 10);
      
      // Assert (Prisma)
      expect(prismaMock.usuario.create).toHaveBeenCalledWith({
        data: {
          nomeCompleto: mockSignUpDTO.nomeCompleto,
          email: mockSignUpDTO.email.toLowerCase(),
          senhaHash: hashedPassword,
        },
      });
      expect(user).toEqual(createdUserMock);
    });
  });

  // Testes para checkCredentials
  describe("checkCredentials", () => {
    it("deve retornar null se o usuário não for encontrado", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(null);
      const user = await authService.checkCredentials(mockLoginDTO);
      expect(user).toBeNull();
      expect(mockedCompare).not.toHaveBeenCalled();
    });

    it("deve retornar null se a senha estiver incorreta", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(mockUser);
      // Corrigido: .mockResolvedValue(false)
      mockedCompare.mockResolvedValue(false as never); // 'as never' para o TS2345

      const user = await authService.checkCredentials(mockLoginDTO);

      expect(user).toBeNull();
      expect(mockedCompare).toHaveBeenCalledWith(
        mockLoginDTO.password,
        mockUser.senhaHash
      );
    });

    it("deve retornar o usuário se as credenciais estiverem corretas", async () => {
      prismaMock.usuario.findUnique.mockResolvedValue(mockUser);
      // Corrigido: .mockResolvedValue(true)
      mockedCompare.mockResolvedValue(true as never); // 'as never' para o TS2345

      const user = await authService.checkCredentials(mockLoginDTO);

      expect(user).toEqual(mockUser);
      expect(mockedCompare).toHaveBeenCalledWith(
        mockLoginDTO.password,
        mockUser.senhaHash
      );
    });
  });
});