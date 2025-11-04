import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { StatusCodes } from "http-status-codes";
import { mock, MockProxy } from "jest-mock-extended";
import { TipoSessao } from "@prisma/client";

// Importa o controller que vamos testar
import * as avaliacaoController from "../avaliacao.controller";
// Importa o service para MOCAR
import * as avaliacaoService from "../avaliacao.service";
import { CreateAvaliacaoDTO, GetAvaliacoesQueryDTO } from "../avaliacao.types";

// Mocka o módulo de serviço INTEIRO
jest.mock("../avaliacao.service");

// "Tipa" o service mocado para o TypeScript
const mockedAvaliacaoService = avaliacaoService as jest.Mocked<typeof avaliacaoService>;

// --- Dados de Mock ---
const mockUsuarioId = "uuid-user-1";

const mockCreateDTO: CreateAvaliacaoDTO = {
  atletaId: "uuid-atleta-1",
  modalidadeId: "uuid-modalidade-1",
  tipo: TipoSessao.PRE_TREINO,
  resultados: [{ tipoMetricaId: "uuid-metrica-1", valor: 12.5 }],
};

const mockRegistroCompleto = {
  id: "uuid-registro-1",
  atletaId: "uuid-atleta-1",
  tipo: TipoSessao.PRE_TREINO,
  // ...outros dados
};
// --- Fim dos Dados de Mock ---

describe("Avaliacao Controller (Unit)", () => {
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

    // Configura a sessão padrão
    req.session = {
      uid: mockUsuarioId, // Usuário logado
    } as unknown as Session & SessionData;
  });

  // Testes para createAvaliacao
  describe("createAvaliacao (POST /avaliacoes)", () => {
    it("deve retornar 201 e a avaliação criada", async () => {
      req.body = mockCreateDTO;
      mockedAvaliacaoService.createAvaliacao.mockResolvedValue(mockRegistroCompleto as any);

      await avaliacaoController.createAvaliacao(req, res);

      expect(mockedAvaliacaoService.createAvaliacao).toHaveBeenCalledWith(
        mockCreateDTO,
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockRegistroCompleto);
    });

    it("deve retornar 403 (Forbidden) se o service lançar erro de 'dono'", async () => {
      req.body = mockCreateDTO;
      const errorMsg = "Atleta não encontrado ou não pertence a este treinador.";
      
      mockedAvaliacaoService.createAvaliacao.mockRejectedValue(new Error(errorMsg));

      await avaliacaoController.createAvaliacao(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
      // Verifica se o erro é retornado no formato 'fieldErrors'
      expect(res.json).toHaveBeenCalledWith({
        fieldErrors: {
          atletaId: errorMsg,
        },
      });
    });
  });

  // Testes para getAvaliacoes
  describe("getAvaliacoes (GET /avaliacoes)", () => {
    it("deve retornar 200 e a lista de avaliações", async () => {
      // O 'validate' middleware já converteu os tipos
      const mockQuery: GetAvaliacoesQueryDTO = { atletaId: "uuid-atleta-1" };
      req.query = mockQuery as any;
      
      const mockLista = [mockRegistroCompleto];
      mockedAvaliacaoService.getAvaliacoesByAtleta.mockResolvedValue(mockLista as any);

      await avaliacaoController.getAvaliacoes(req, res);

      expect(mockedAvaliacaoService.getAvaliacoesByAtleta).toHaveBeenCalledWith(
        mockQuery,
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockLista);
    });

    it("deve retornar 403 (Forbidden) se o service lançar erro de 'dono'", async () => {
      const mockQuery: GetAvaliacoesQueryDTO = { atletaId: "id-falso" };
      req.query = mockQuery as any;
      const errorMsg = "Atleta não encontrado ou não pertence a este treinador.";
      
      mockedAvaliacaoService.getAvaliacoesByAtleta.mockRejectedValue(new Error(errorMsg));

      await avaliacaoController.getAvaliacoes(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
      expect(res.json).toHaveBeenCalledWith({
        fieldErrors: {
          atletaId: errorMsg,
        },
      });
    });

    it("deve passar todos os filtros de query para o service", async () => {
      const mockQuery = {
        atletaId: "uuid-atleta-1",
        modalidadeId: "uuid-modalidade-1",
        tipo: TipoSessao.POS_TREINO,
        dataInicio: new Date("2024-01-01T00:00:00.000Z"),
        dataFim: new Date("2024-01-31T00:00:00.000Z"),
      };
      req.query = mockQuery as any; // (O 'validate' já teria convertido as strings de data)
      
      mockedAvaliacaoService.getAvaliacoesByAtleta.mockResolvedValue([]);

      await avaliacaoController.getAvaliacoes(req, res);

      // Apenas verifica se todos os filtros foram passados corretamente
      expect(mockedAvaliacaoService.getAvaliacoesByAtleta).toHaveBeenCalledWith(
        mockQuery,
        mockUsuarioId
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    });
  });
});