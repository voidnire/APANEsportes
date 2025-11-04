import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Atleta, Classificacao } from "@prisma/client";

// Importa o mock do Prisma do seu arquivo de setup
import { prismaMock } from "../../../tests/mocks/databaseMock"; // Ajuste o caminho se necessário
import * as atletaService from "../atleta.service";
import { CreateAtletaDTO, UpdateAtletaDTO } from "../atleta.types";

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

const mockClassificacao: Classificacao = {
  id: "uuid-class-1",
  codigo: "T11",
  descricao: "Deficiência visual total",
  createdAt: new Date(),
  updatedAt: new Date(),
};
// --- Fim dos Dados de Mock ---

describe("Atleta Service (Unit)", () => {
  
  // (O prismaMock é resetado globalmente pelo seu setup)
  beforeEach(() => {
    // N/A - Este service não usa 'bcrypt'
  });

  // Testes para createAtleta
  describe("createAtleta", () => {
    it("deve criar um novo atleta associado ao usuário", async () => {
      const createDTO: CreateAtletaDTO = {
        nomeCompleto: "Novo Atleta",
        dataNascimento: new Date("1999-05-05T00:00:00.000Z"),
      };
      const expectedAtleta = { ...mockAtleta, ...createDTO };
      
      prismaMock.atleta.create.mockResolvedValue(expectedAtleta);

      const result = await atletaService.createAtleta(createDTO, mockUsuarioId);

      expect(prismaMock.atleta.create).toHaveBeenCalledWith({
        data: {
          ...createDTO,
          usuarioId: mockUsuarioId, // Garante que a segurança foi aplicada
        },
      });
      expect(result).toEqual(expectedAtleta);
    });
  });

  // Testes para getAtletasByUsuario
  describe("getAtletasByUsuario", () => {
    it("deve retornar uma lista de atletas do usuário", async () => {
      const mockLista = [mockAtleta, { ...mockAtleta, id: "uuid-atleta-2" }];
      prismaMock.atleta.findMany.mockResolvedValue(mockLista);

      const result = await atletaService.getAtletasByUsuario(mockUsuarioId);

      expect(prismaMock.atleta.findMany).toHaveBeenCalledWith({
        where: {
          usuarioId: mockUsuarioId, // Garante filtro de segurança
        },
        orderBy: {
          nomeCompleto: "asc",
        },
      });
      expect(result).toEqual(mockLista);
    });
  });

  // Testes para getAtletaById
  describe("getAtletaById", () => {
    it("deve retornar um atleta se ele pertencer ao usuário", async () => {
      const mockAtletaComClassificacoes = {
        ...mockAtleta,
        classificacoes: [{ classificacao: mockClassificacao }],
      };
      
      // Tipamos o mock de retorno para bater com o 'include'
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtletaComClassificacoes as any);

      const result = await atletaService.getAtletaById(mockAtleta.id, mockUsuarioId);

      expect(prismaMock.atleta.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAtleta.id,
          usuarioId: mockUsuarioId, // Filtro de segurança
        },
        include: {
          classificacoes: {
            select: {
              classificacao: {
                select: {
                  id: true,
                  codigo: true,
                  descricao: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockAtletaComClassificacoes);
    });

    it("deve retornar null se o atleta não for encontrado ou não pertencer ao usuário", async () => {
      prismaMock.atleta.findFirst.mockResolvedValue(null);
      const result = await atletaService.getAtletaById("id-falso", mockUsuarioId);
      expect(result).toBeNull();
    });
  });

  // Testes para updateAtleta
  describe("updateAtleta", () => {
    const updateDTO: UpdateAtletaDTO = { nomeCompleto: "Nome Atualizado" };

    it("deve atualizar um atleta e retornar os dados atualizados", async () => {
      const atletaAtualizado = { ...mockAtleta, ...updateDTO };
      
      // 1. Mock do updateMany (confirma que 1 registro foi afetado)
      prismaMock.atleta.updateMany.mockResolvedValue({ count: 1 });
      // 2. Mock do getAtletaById (que é chamado em seguida)
      prismaMock.atleta.findFirst.mockResolvedValue(atletaAtualizado as any);

      const result = await atletaService.updateAtleta(mockAtleta.id, updateDTO, mockUsuarioId);

      expect(prismaMock.atleta.updateMany).toHaveBeenCalledWith({
        where: {
          id: mockAtleta.id,
          usuarioId: mockUsuarioId, // Filtro de segurança
        },
        data: updateDTO,
      });
      expect(prismaMock.atleta.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(atletaAtualizado);
    });

    it("deve retornar null se o atleta não for encontrado ou não pertencer ao usuário", async () => {
      // updateMany não afeta nenhum registro
      prismaMock.atleta.updateMany.mockResolvedValue({ count: 0 });

      const result = await atletaService.updateAtleta("id-falso", updateDTO, mockUsuarioId);

      expect(result).toBeNull();
      // Garante que o getAtletaById não foi chamado se o update falhou
      expect(prismaMock.atleta.findFirst).not.toHaveBeenCalled();
    });
  });

  // Testes para deleteAtleta
  describe("deleteAtleta", () => {
    it("deve deletar um atleta e retornar o count (1)", async () => {
      prismaMock.atleta.deleteMany.mockResolvedValue({ count: 1 });

      const result = await atletaService.deleteAtleta(mockAtleta.id, mockUsuarioId);

      expect(prismaMock.atleta.deleteMany).toHaveBeenCalledWith({
        where: {
          id: mockAtleta.id,
          usuarioId: mockUsuarioId, // Filtro de segurança
        },
      });
      expect(result).toBe(1);
    });

    it("deve retornar 0 se o atleta não for encontrado ou não pertencer ao usuário", async () => {
      prismaMock.atleta.deleteMany.mockResolvedValue({ count: 0 });
      const result = await atletaService.deleteAtleta("id-falso", mockUsuarioId);
      expect(result).toBe(0);
    });
  });

  // Testes para associateClassificacao
  describe("associateClassificacao", () => {
    it("deve associar uma classificação a um atleta", async () => {
      // 1. Mock do getAtletaById (verificação de dono)
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtleta as any);
      // 2. Mock do findUnique (verificação se classificação existe)
      prismaMock.classificacao.findUnique.mockResolvedValue(mockClassificacao);
      // 3. Mock do upsert (criação da associação)
      prismaMock.atletaClassificacao.upsert.mockResolvedValue({} as any);

      await atletaService.associateClassificacao(mockAtleta.id, mockClassificacao.id, mockUsuarioId);

      expect(prismaMock.atleta.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: mockAtleta.id, usuarioId: mockUsuarioId } })
      );
      expect(prismaMock.classificacao.findUnique).toHaveBeenCalledWith({ where: { id: mockClassificacao.id } });
      expect(prismaMock.atletaClassificacao.upsert).toHaveBeenCalled();
    });

    it("deve lançar erro se o atleta não pertencer ao usuário", async () => {
      prismaMock.atleta.findFirst.mockResolvedValue(null); // Atleta não encontrado

      await expect(
        atletaService.associateClassificacao(mockAtleta.id, mockClassificacao.id, mockUsuarioId)
      ).rejects.toThrow("Atleta não encontrado ou não pertence a este treinador.");
    });

     it("deve lançar erro se a classificação não existir", async () => {
      prismaMock.atleta.findFirst.mockResolvedValue(mockAtleta as any);
      prismaMock.classificacao.findUnique.mockResolvedValue(null); // Classificação não existe

      await expect(
        atletaService.associateClassificacao(mockAtleta.id, "id-falso", mockUsuarioId)
      ).rejects.toThrow("Classificação não encontrada.");
    });
  });

  // Testes para disassociateClassificacao
  describe("disassociateClassificacao", () => {
    it("deve desassociar uma classificação e retornar 1", async () => {
      prismaMock.atletaClassificacao.deleteMany.mockResolvedValue({ count: 1 });

      const result = await atletaService.disassociateClassificacao(mockAtleta.id, mockClassificacao.id, mockUsuarioId);

      expect(prismaMock.atletaClassificacao.deleteMany).toHaveBeenCalledWith({
        where: {
          atletaId: mockAtleta.id,
          classificacaoId: mockClassificacao.id,
          atleta: { // Checagem de segurança aninhada
            usuarioId: mockUsuarioId,
          },
        },
      });
      expect(result).toBe(1);
    });
  });
});