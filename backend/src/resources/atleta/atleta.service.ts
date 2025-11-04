import { prisma } from "../../database/prismaSingleton"; // Ajuste o caminho se necessário
import { CreateAtletaDTO, UpdateAtletaDTO } from "./atleta.types";

/**
 * Cria um novo atleta e o associa DIRETAMENTE ao treinador logado.
 */
export const createAtleta = (data: CreateAtletaDTO, usuarioId: string) => {
  return prisma.atleta.create({
    data: {
      ...data,
      usuarioId: usuarioId, // <-- Segurança: Vincula ao treinador da sessão
    },
  });
};

/**
 * Busca todos os atletas que pertencem a um treinador.
 * (Alimenta a lista da Tela 4)
 */
export const getAtletasByUsuario = (usuarioId: string) => {
  return prisma.atleta.findMany({
    where: {
      usuarioId: usuarioId, // <-- Segurança: Filtra apenas os do treinador
    },
    orderBy: {
      nomeCompleto: "asc",
    },
  });
};

/**
 * Busca um atleta específico pelo ID.
 * Garante que o atleta pertença ao treinador logado.
 * (Alimenta a Tela 5)
 */
export const getAtletaById = (id: string, usuarioId: string) => {
  return prisma.atleta.findFirst({
    where: {
      id: id,
      usuarioId: usuarioId, // <-- Segurança: Filtro composto
    },
    include: {
      // Inclui os dados das classificações associadas (N:M)
      classificacoes: {
        select: {
          classificacao: {
            // Seleciona os campos da classificação (do seed)
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
};

/**
 * Atualiza um atleta.
 * Retorna o atleta atualizado ou null se não for encontrado (ou não pertencer ao usuário).
 */
export const updateAtleta = async (
  id: string,
  data: UpdateAtletaDTO,
  usuarioId: string
) => {
  // Usamos updateMany para aplicar o filtro de segurança.
  // Isso previne que um usuário edite o atleta de outro.
  const result = await prisma.atleta.updateMany({
    where: {
      id: id,
      usuarioId: usuarioId, // <-- Segurança: Só atualiza se o ID e o Dono baterem
    },
    data: data,
  });

  // Se 'count' for 0, o atleta não foi encontrado ou não pertencia ao usuário
  if (result.count === 0) {
    return null;
  }

  // Retorna o atleta com os dados atualizados
  return getAtletaById(id, usuarioId);
};

/**
 * Deleta um atleta.
 * Retorna o número de registros deletados (0 ou 1).
 */
export const deleteAtleta = async (id: string, usuarioId: string) => {
  // Usamos deleteMany para aplicar o filtro de segurança.
  const result = await prisma.atleta.deleteMany({
    where: {
      id: id,
      usuarioId: usuarioId, // <-- Segurança: Só deleta se o ID e o Dono baterem
    },
  });
  
  // Nossas regras de 'onDelete: Cascade' no schema.prisma
  // irão deletar automaticamente todos os Registros de Avaliação
  // e Resultados de Métrica associados a este atleta.
  
  return result.count;
};

/**
 * Associa uma Classificação (do seed) a um Atleta.
 */
export const associateClassificacao = async (
  atletaId: string,
  classificacaoId: string,
  usuarioId: string
) => {
  // 1. Verifica se o atleta pertence ao usuário (Segurança)
  const atleta = await getAtletaById(atletaId, usuarioId);
  if (!atleta) {
    throw new Error("Atleta não encontrado ou não pertence a este treinador.");
  }

  // 2. Verifica se a classificação existe (Integridade)
  const classificacao = await prisma.classificacao.findUnique({
    where: { id: classificacaoId },
  });
  if (!classificacao) {
    throw new Error("Classificação não encontrada.");
  }

  // 3. Cria a associação (N:M)
  // Usamos 'upsert' para evitar erro se a associação já existir
  return prisma.atletaClassificacao.upsert({
    where: {
      // Chave única composta do schema.prisma
      atletaId_classificacaoId: {
        atletaId: atletaId,
        classificacaoId: classificacaoId,
      },
    },
    update: {}, // Não faz nada se já existir
    create: {
      atletaId: atletaId,
      classificacaoId: classificacaoId,
    },
  });
};

/**
 * Desassocia uma Classificação de um Atleta.
 */
export const disassociateClassificacao = async (
  atletaId: string,
  classificacaoId: string,
  usuarioId: string
) => {
  // A query de delete mais segura:
  // Deleta da tabela AtletaClassificacao ONDE
  // o atletaId e classificacaoId batem, E
  // o 'atleta' relacionado (pai) tem o usuarioId correto.
  const result = await prisma.atletaClassificacao.deleteMany({
    where: {
      atletaId: atletaId,
      classificacaoId: classificacaoId,
      atleta: {
        usuarioId: usuarioId, // <-- Segurança: Checagem aninhada
      },
    },
  });
  
  return result.count;
};