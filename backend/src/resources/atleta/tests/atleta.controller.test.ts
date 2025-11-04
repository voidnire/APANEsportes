import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { StatusCodes } from "http-status-codes";
import { Atleta } from "@prisma/client";
import { mock, MockProxy } from "jest-mock-extended"; // Importa o mock correto

// Importa o controller que vamos testar
import * as atletaController from "../atleta.controller";
// Importa o service para MOCAR
import * as atletaService from "../atleta.service";
import { CreateAtletaDTO, UpdateAtletaDTO } from "../atleta.types";

// Mocka o módulo de serviço INTEIRO
jest.mock("../atleta.service");

// "Tipa" o service mocado para o TypeScript
const mockedAtletaService = atletaService as jest.Mocked<typeof atletaService>;

// --- Dados de Mock ---
const mockUsuarioId = "uuid-user-1";

const mockAtleta: Atleta = {
  id: "uuid-atleta-1",
  nomeCompleto: "Atleta Teste",
  dataNascimento: new Date("2000-01-01T00:00:00.000Z"),
  usuarioId: mockUsuarioId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock do 'getAtletaById' (Tela 5) que inclui classificações sanitizadas
const mockAtletaSanitizado = {
  ...mockAtleta,
  classificacoes: [
    { id: "uuid-class-1", codigo: "T11", descricao: "Deficiência visual total" }
  ]
};
// --- Fim dos Dados de Mock ---

describe("Atleta Controller (Unit)", () => {
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Cria mocks tipados com jest-mock-extended
    req = mock<Request>();
    res = mock<Response>();

    // Configura comportamento do mock para suportar encadeamento
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    res.send.mockReturnValue(res); // Para o 204 (No Content)
    res.clearCookie.mockReturnValue(res); // Adicionado para consistência

    // Configura a sessão padrão
    req.session = {
      uid: mockUsuarioId, // Usuário logado
    } as unknown as Session & SessionData;
  });

  // Testes para createAtleta
  describe("createAtleta (POST /atletas)", () => {
    it("deve criar um novo atleta e retornar 201", async () => {
      const createDTO: CreateAtletaDTO = {
        nomeCompleto: "Novo Atleta",
        dataNascimento: new Date("1999-05-05T00:00:00.000Z"),
      };
      req.body = createDTO;
      
      // O service retorna o atleta sem sanitizar
      mockedAtletaService.createAtleta.mockResolvedValue(mockAtleta);

      await atletaController.createAtleta(req, res);

      expect(mockedAtletaService.createAtleta).toHaveBeenCalledWith(
        createDTO,
        mockUsuarioId // Verifica se o ID da sessão foi passado
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      // O controller sanitiza (adiciona a chave 'classificacoes: undefined')
      // então testamos o que o controller envia
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ nomeCompleto: "Novo Atleta" })
      );
    });
  });

  // Testes para getAtletas
  describe("getAtletas (GET /atletas)", () => {
    it("deve retornar a lista de atletas do usuário e 200", async () => {
      const mockLista = [mockAtleta, { ...mockAtleta, id: "uuid-atleta-2" }];
      mockedAtletaService.getAtletasByUsuario.mockResolvedValue(mockLista);

      await atletaController.getAtletas(req, res);

      expect(mockedAtletaService.getAtletasByUsuario).toHaveBeenCalledWith(mockUsuarioId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      // O controller sanitiza cada item
      expect(res.json).toHaveBeenCalledWith(
         mockLista.map(atleta => ({...atleta, classificacoes: undefined}))
      );
    });
  });

  // Testes para getAtleta
  describe("getAtleta (GET /atletas/:id)", () => {
    it("deve retornar 404 se o atleta não for encontrado ou não pertencer ao usuário", async () => {
      req.params.id = "id-falso";
      mockedAtletaService.getAtletaById.mockResolvedValue(null);

      await atletaController.getAtleta(req, res);

      expect(mockedAtletaService.getAtletaById).toHaveBeenCalledWith(
        "id-falso",
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "Atleta não encontrado ou não pertence a este treinador.",
      });
    });

    it("deve retornar 200 e os dados do atleta (com classificações sanitizadas)", async () => {
      req.params.id = mockAtleta.id;
      
      // Mock do retorno do service (antes da sanitização)
      const mockRetornoService = {
        ...mockAtleta,
        classificacoes: [
          { classificacao: { id: "uuid-class-1", codigo: "T11", descricao: "Deficiência visual total" } }
        ]
      };
      mockedAtletaService.getAtletaById.mockResolvedValue(mockRetornoService as any);

      await atletaController.getAtleta(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      // Verifica se o controller sanitizou o retorno (removeu o aninhamento)
      expect(res.json).toHaveBeenCalledWith(mockAtletaSanitizado);
    });
  });

  // Testes para updateAtleta
  describe("updateAtleta (PUT /atletas/:id)", () => {
    it("deve retornar 404 se o service retornar null", async () => {
      const updateDTO: UpdateAtletaDTO = { nomeCompleto: "Nome Atualizado" };
      req.params.id = "id-falso";
      req.body = updateDTO;
      
      mockedAtletaService.updateAtleta.mockResolvedValue(null);

      await atletaController.updateAtleta(req, res);

      expect(mockedAtletaService.updateAtleta).toHaveBeenCalledWith(
        "id-falso",
        updateDTO,
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it("deve retornar 200 e o atleta atualizado", async () => {
      const updateDTO: UpdateAtletaDTO = { nomeCompleto: "Nome Atualizado" };
      const atletaAtualizado = { ...mockAtletaSanitizado, ...updateDTO };
      req.params.id = mockAtleta.id;
      req.body = updateDTO;

      mockedAtletaService.updateAtleta.mockResolvedValue(atletaAtualizado as any);
      
      await atletaController.updateAtleta(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(atletaAtualizado);
    });
  });

  // Testes para deleteAtleta
  describe("deleteAtleta (DELETE /atletas/:id)", () => {
    it("deve retornar 404 se o service retornar count 0", async () => {
      req.params.id = "id-falso";
      mockedAtletaService.deleteAtleta.mockResolvedValue(0);

      await atletaController.deleteAtleta(req, res);

      expect(mockedAtletaService.deleteAtleta).toHaveBeenCalledWith("id-falso", mockUsuarioId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it("deve retornar 204 (No Content) se o delete for bem-sucedido", async () => {
      req.params.id = mockAtleta.id;
      mockedAtletaService.deleteAtleta.mockResolvedValue(1);

      await atletaController.deleteAtleta(req, res);
      
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
      expect(res.send).toHaveBeenCalled(); // 204 não tem body
    });
  });

  // Testes para associateClassificacao
  describe("associateClassificacao (POST /atletas/:id/classificacoes)", () => {
    it("deve retornar 404 se o service lançar erro 'Atleta não encontrado'", async () => {
      req.params.id = "id-falso";
      req.body = { classificacaoId: "uuid-class-1" };
      
      mockedAtletaService.associateClassificacao.mockRejectedValue(
        new Error("Atleta não encontrado ou não pertence a este treinador.")
      );

      await atletaController.associateClassificacao(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Atleta não encontrado") })
      );
    });

    it("deve retornar 201 se a associação for criada", async () => {
      req.params.id = mockAtleta.id;
      req.body = { classificacaoId: "uuid-class-1" };

      // Service não retorna nada em sucesso, apenas não lança erro
      mockedAtletaService.associateClassificacao.mockResolvedValue({} as any);

      await atletaController.associateClassificacao(req, res);

      expect(mockedAtletaService.associateClassificacao).toHaveBeenCalledWith(
        mockAtleta.id,
        "uuid-class-1",
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    });
  });

  // Testes para disassociateClassificacao
  describe("disassociateClassificacao (DELETE /atletas/:id/classificacoes/:classificacaoId)", () => {
    it("deve retornar 404 se o service retornar count 0", async () => {
      req.params.id = mockAtleta.id;
      req.params.classificacaoId = "id-falso";

      mockedAtletaService.disassociateClassificacao.mockResolvedValue(0);

      await atletaController.disassociateClassificacao(req, res);
      
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining("Associação não encontrada") })
      );
    });

    it("deve retornar 204 se a desassociação for bem-sucedida", async () => {
      req.params.id = mockAtleta.id;
      req.params.classificacaoId = "uuid-class-1";

      mockedAtletaService.disassociateClassificacao.mockResolvedValue(1);

      await atletaController.disassociateClassificacao(req, res);
      
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    });
  });
});