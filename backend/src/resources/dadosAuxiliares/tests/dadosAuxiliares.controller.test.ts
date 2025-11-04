import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { StatusCodes } from "http-status-codes";
import { mock, MockProxy } from "jest-mock-extended";

// Importa o controller que vamos testar
import * as dadosController from "../dadosAuxiliares.controller";
// Importa o service para MOCAR
import * as dadosService from "../dadosAuxiliares.service";

// Mocka o módulo de serviço INTEIRO
jest.mock("../dadosAuxiliares.service");

// "Tipa" o service mocado para o TypeScript
const mockedDadosService = dadosService as jest.Mocked<typeof dadosService>;

// --- Dados de Mock ---
const mockUsuarioId = "uuid-user-1";
const mockClassificacoes = [
  { id: "uuid-class-1", codigo: "T11", descricao: "..." }
];
const mockModalidades = [
  { id: "uuid-modalidade-1", nome: "100m Rasos", categoria: "Corrida" }
];
const mockMetricas = [
  { id: "uuid-metrica-1", nome: "Tempo", unidadeMedida: "s" }
];
// --- Fim dos Dados de Mock ---

describe("Dados Auxiliares Controller (Unit)", () => {
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

    // Configura a sessão padrão (necessário por causa do middleware 'isAuth')
    req.session = {
      uid: mockUsuarioId, // Usuário logado
    } as unknown as Session & SessionData;
  });

  // Testes para getClassificacoes
  describe("getClassificacoes (GET /dados-auxiliares/classificacoes)", () => {
    it("deve retornar 200 e a lista de classificações", async () => {
      mockedDadosService.getClassificacoes.mockResolvedValue(mockClassificacoes as any);

      await dadosController.getClassificacoes(req, res);

      expect(mockedDadosService.getClassificacoes).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockClassificacoes);
    });
  });

  // Testes para getModalidades
  describe("getModalidades (GET /dados-auxiliares/modalidades)", () => {
    it("deve retornar 200 e a lista de modalidades", async () => {
      mockedDadosService.getModalidades.mockResolvedValue(mockModalidades as any);

      await dadosController.getModalidades(req, res);

      expect(mockedDadosService.getModalidades).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockModalidades);
    });
  });

  // Testes para getMetricasByModalidade
  describe("getMetricasByModalidade (GET /dados-auxiliares/modalidades/:id/metricas)", () => {
    
    it("deve retornar 404 se o service retornar null (modalidade não encontrada)", async () => {
      req.params.id = "id-falso";
      mockedDadosService.getMetricasByModalidade.mockResolvedValue(null);

      await dadosController.getMetricasByModalidade(req, res);

      expect(mockedDadosService.getMetricasByModalidade).toHaveBeenCalledWith("id-falso");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        message: "Modalidade não encontrada.",
      });
    });
    
    it("deve retornar 200 e a lista de métricas da modalidade", async () => {
      const modalidadeId = "uuid-modalidade-1";
      req.params.id = modalidadeId;
      mockedDadosService.getMetricasByModalidade.mockResolvedValue(mockMetricas as any);

      await dadosController.getMetricasByModalidade(req, res);

      expect(mockedDadosService.getMetricasByModalidade).toHaveBeenCalledWith(modalidadeId);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockMetricas);
    });
  });
});