import { jest, describe, it, expect } from "@jest/globals";
import { Modalidade, Classificacao, TipoMetrica } from "@prisma/client";

// Importa o mock do Prisma do seu arquivo de setup
import { prismaMock } from "../../../tests/mocks/databaseMock"; // Ajuste o caminho se necessário
import * as dadosService from "../dadosAuxiliares.service";

// --- Dados de Mock ---
const mockClassificacao: Classificacao = {
  id: "uuid-class-1",
  codigo: "T11",
  descricao: "Deficiência visual total",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockModalidade: Modalidade = {
  id: "uuid-modalidade-1",
  nome: "100m Rasos",
  categoria: "Corrida",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMetrica: TipoMetrica = {
  id: "uuid-metrica-1",
  nome: "Tempo",
  unidadeMedida: "s",
  createdAt: new Date(),
  updatedAt: new Date(),
};
// --- Fim dos Dados de Mock ---

describe("Dados Auxiliares Service (Unit)", () => {
  
  // Testes para getClassificacoes
  describe("getClassificacoes", () => {
    it("deve retornar a lista de classificações ordenada por código", async () => {
      const mockLista = [mockClassificacao, { ...mockClassificacao, id: "uuid-class-2", codigo: "T12" }];
      prismaMock.classificacao.findMany.mockResolvedValue(mockLista);

      const result = await dadosService.getClassificacoes();

      expect(prismaMock.classificacao.findMany).toHaveBeenCalledWith({
        orderBy: {
          codigo: "asc", // Verifica a ordenação
        },
        select: {
          id: true,
          codigo: true,
          descricao: true,
        },
      });
      expect(result).toEqual(mockLista);
    });
  });

  // Testes para getModalidades
  describe("getModalidades", () => {
    it("deve retornar a lista de modalidades ordenada por nome", async () => {
      const mockLista = [mockModalidade, { ...mockModalidade, id: "uuid-modalidade-2", nome: "Salto em Distância" }];
      prismaMock.modalidade.findMany.mockResolvedValue(mockLista);

      const result = await dadosService.getModalidades();

      expect(prismaMock.modalidade.findMany).toHaveBeenCalledWith({
        orderBy: {
          nome: "asc", // Verifica a ordenação
        },
        select: {
          id: true,
          nome: true,
          categoria: true,
        },
      });
      expect(result).toEqual(mockLista);
    });
  });

  // Testes para getMetricasByModalidade
  describe("getMetricasByModalidade (Lógica da Tela 2)", () => {
    it("deve retornar a lista de métricas para uma modalidade", async () => {
      // Mock do retorno complexo do Prisma
      const mockRetornoPrisma = {
        ...mockModalidade,
        metricasPermitidas: [
          { tipoMetrica: mockMetrica },
          { tipoMetrica: { ...mockMetrica, id: "uuid-metrica-2", nome: "Velocidade do Vento" } }
        ],
      };
      
      prismaMock.modalidade.findUnique.mockResolvedValue(mockRetornoPrisma as any);

      const result = await dadosService.getMetricasByModalidade(mockModalidade.id);

      expect(prismaMock.modalidade.findUnique).toHaveBeenCalledWith({
        where: { id: mockModalidade.id },
        include: {
          metricasPermitidas: {
            include: {
              tipoMetrica: true,
            },
            orderBy: {
              tipoMetrica: {
                 nome: 'asc'
              }
            }
          },
        },
      });
      
      // Verifica se o service sanitizou o retorno (mapeou)
      expect(result).toEqual([
        mockMetrica,
        { ...mockMetrica, id: "uuid-metrica-2", nome: "Velocidade do Vento" }
      ]);
    });

    it("deve retornar null se a modalidade não for encontrada", async () => {
      prismaMock.modalidade.findUnique.mockResolvedValue(null);
      
      const result = await dadosService.getMetricasByModalidade("id-falso");
      
      expect(result).toBeNull();
    });
  });
});