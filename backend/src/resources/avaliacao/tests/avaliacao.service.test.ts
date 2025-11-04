import { jest, describe, it, expect, beforeEach } from "@jest/globals";
// (CORREÇÃO TS2694) Importa 'PrismaClient' (o tipo) diretamente
import { Atleta, RegistroAvaliacao, TipoSessao, Prisma, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

// Importa o mock do Prisma do seu arquivo de setup
import { prismaMock } from "../../../tests/mocks/databaseMock"; // Ajuste o caminho se necessário
import * as avaliacaoService from "../avaliacao.service";
import { CreateAvaliacaoDTO, GetAvaliacoesQueryDTO } from "../avaliacao.types";

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

const mockCreateDTO: CreateAvaliacaoDTO = {
  atletaId: "uuid-atleta-1",
  modalidadeId: "uuid-modalidade-1",
  tipo: TipoSessao.PRE_TREINO,
  observacoes: "Teste",
  resultados: [
    { tipoMetricaId: "uuid-metrica-1", valor: 12.5 }, // 12.5 segundos
  ],
};

const mockRegistroCompleto = {
  id: "uuid-registro-1",
  atletaId: "uuid-atleta-1",
  modalidadeId: "uuid-modalidade-1",
  tipo: TipoSessao.PRE_TREINO,
  observacoes: "Teste",
  dataHora: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  // ... (inclui resultados e tipoMetrica)
};
// --- Fim dos Dados de Mock ---

// (CORREÇÃO TS2694)
// O tipo 'TransactionClient' usa 'PrismaClient' (importado)
// e não 'Prisma.PrismaClient'
type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

describe("Avaliacao Service (Unit)", () => {
  
  beforeEach(() => {
    // O prismaMock é resetado globalmente pelo seu setup
    (prismaMock.$transaction as jest.Mock).mockClear();
  });

  // Testes para createAvaliacao
  describe("createAvaliacao", () => {
    
    it("deve criar uma avaliação e seus resultados (em transação)", async () => {
      // 1. Mock da Checagem de Segurança (checkAtletaOwnership)
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtleta);
      
      // 2. Mocks de dentro da transação
      prismaMock.registroAvaliacao.create.mockResolvedValue(mockRegistroCompleto as any);
      prismaMock.resultadoMetrica.createMany.mockResolvedValue({ count: 1 });
      prismaMock.registroAvaliacao.findUnique.mockResolvedValue(mockRegistroCompleto as any);

      // (CORREÇÃO TS2345)
      // Aplicamos o 'as never' no mockImplementation da transação,
      // seguindo o padrão que você aprovou para o 'bcrypt'
      (prismaMock.$transaction as jest.Mock).mockImplementation(
        (async (callback: (tx: TransactionClient) => Promise<any>) => {
          return callback(prismaMock);
        }) as never // <-- Hack 'as never' para resolver o TS2345
      );

      // Executa o service
      const result = await avaliacaoService.createAvaliacao(mockCreateDTO, mockUsuarioId);

      // Assert: Checagem de segurança foi chamada
      expect(prismaMock.atleta.findFirst).toHaveBeenCalledWith({
        where: { id: mockCreateDTO.atletaId, usuarioId: mockUsuarioId },
        select: { id: true },
      });
      
      // Assert: Transação foi chamada
      expect(prismaMock.$transaction).toHaveBeenCalled();
      
      // Assert: createMany foi chamado com o Decimal correto
      expect(prismaMock.resultadoMetrica.createMany).toHaveBeenCalledWith({
        data: [
          {
            registroId: mockRegistroCompleto.id,
            tipoMetricaId: "uuid-metrica-1",
            valor: new Prisma.Decimal(12.5),
          },
        ],
      });
      
      expect(result).toEqual(mockRegistroCompleto);
    });

    it("deve lançar erro se o atleta não pertencer ao usuário", async () => {
      // 1. Mock da Checagem de Segurança (FALHA)
      prismaMock.atleta.findFirst.mockResolvedValue(null);

      // Executa e espera o erro
      await expect(
        avaliacaoService.createAvaliacao(mockCreateDTO, mockUsuarioId)
      ).rejects.toThrow("Atleta não encontrado ou não pertence a este treinador.");
      
      // Garante que a transação nunca foi iniciada
      expect(prismaMock.$transaction).not.toHaveBeenCalled();
    });
  });

  // Testes para getAvaliacoesByAtleta
  describe("getAvaliacoesByAtleta", () => {
    
    it("deve lançar erro se o atleta não pertencer ao usuário", async () => {
      const query: GetAvaliacoesQueryDTO = { atletaId: "id-falso" };
      // 1. Mock da Checagem de Segurança (FALHA)
      prismaMock.atleta.findFirst.mockResolvedValue(null);

      // Executa e espera o erro
      await expect(
        avaliacaoService.getAvaliacoesByAtleta(query, mockUsuarioId)
      ).rejects.toThrow("Atleta não encontrado ou não pertence a este treinador.");
      
      // Garante que a busca nunca foi feita
      expect(prismaMock.registroAvaliacao.findMany).not.toHaveBeenCalled();
    });

    it("deve buscar avaliações (filtro simples, só atletaId)", async () => {
      const query: GetAvaliacoesQueryDTO = { atletaId: mockAtleta.id };
      
      // 1. Mock da Checagem de Segurança (OK)
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtleta);
      // 2. Mock da busca
      prismaMock.registroAvaliacao.findMany.mockResolvedValue([mockRegistroCompleto as any]);

      const result = await avaliacaoService.getAvaliacoesByAtleta(query, mockUsuarioId);

      // Assert: A busca foi feita com o WHERE correto
      expect(prismaMock.registroAvaliacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            atletaId: mockAtleta.id, // Filtro base
          },
          orderBy: { dataHora: "desc" },
        })
      );
      expect(result).toEqual([mockRegistroCompleto]);
    });

    it("deve buscar avaliações (filtros complexos)", async () => {
      const query: GetAvaliacoesQueryDTO = {
        atletaId: mockAtleta.id,
        modalidadeId: "uuid-modalidade-1",
        tipo: TipoSessao.POS_TREINO,
        dataInicio: new Date("2024-01-01T00:00:00.000Z"),
        dataFim: new Date("2024-01-31T00:00:00.000Z"),
      };
      
      // 1. Mock da Checagem de Segurança (OK)
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtleta);
      // 2. Mock da busca
      prismaMock.registroAvaliacao.findMany.mockResolvedValue([]); // Retorno não importa

      await avaliacaoService.getAvaliacoesByAtleta(query, mockUsuarioId);

      // Assert: O 'where' foi construído corretamente
      expect(prismaMock.registroAvaliacao.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            atletaId: mockAtleta.id,
            modalidadeId: "uuid-modalidade-1",
            tipo: "POS_TREINO",
            dataHora: {
              gte: new Date("2024-01-01T00:00:00.000Z"),
              lte: new Date("2024-01-31T23:59:59.999Z"), // Verifica o ajuste de dataFim
            },
          },
        })
      );
    });
  });
});