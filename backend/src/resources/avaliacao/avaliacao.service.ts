import { Prisma, TipoSessao } from "@prisma/client";
import { prisma } from "../../database/prismaSingleton"; // Ajuste o caminho
import { CreateAvaliacaoDTO, GetAvaliacoesQueryDTO } from "./avaliacao.types";

/**
 * Função de segurança reutilizável.
 * Verifica se um atleta pertence ao usuário (treinador) logado.
 * Lança um erro se não pertencer, que será pego pelo controller.
 */
const checkAtletaOwnership = async (atletaId: string, usuarioId: string) => {
  const atleta = await prisma.atleta.findFirst({
    where: {
      id: atletaId,
      usuarioId: usuarioId, // <-- FILTRO DE SEGURANÇA
    },
    select: {
      id: true, // Apenas checa a existência
    },
  });

  if (!atleta) {
    // Erro específico que o controller pode tratar
    throw new Error(
      "Atleta não encontrado ou não pertence a este treinador."
    );
  }
};

/**
 * Cria uma nova avaliação (Tela 2).
 * Usa uma transação para garantir que o Registro e seus Resultados
 * sejam criados de forma atômica (ou tudo ou nada).
 */
export const createAvaliacao = async (
  data: CreateAvaliacaoDTO,
  usuarioId: string
) => {
  // 1. Checagem de Segurança: O treinador é dono deste atleta?
  // (Isso também valida se o 'atletaId' existe)
  await checkAtletaOwnership(data.atletaId, usuarioId);

  // 2. Extrair os dados do DTO
  const { resultados, ...avaliacaoData } = data;

  // 3. Executar a criação dentro de uma Transação
  return prisma.$transaction(async (tx) => {
    // 3a. Cria o Registro "pai" (RegistroAvaliacao)
    const novaAvaliacao = await tx.registroAvaliacao.create({
      data: {
        atletaId: avaliacaoData.atletaId,
        modalidadeId: avaliacaoData.modalidadeId,
        tipo: avaliacaoData.tipo,
        observacoes: avaliacaoData.observacoes,
        dataHora: avaliacaoData.dataHora, // Se for undefined, o banco usa default(now())
      },
    });

    // 3b. Prepara os dados dos "filhos" (ResultadoMetrica)
    const resultadosData = resultados.map((r) => ({
      registroId: novaAvaliacao.id, // Linka ao "pai"
      tipoMetricaId: r.tipoMetricaId,
      valor: new Prisma.Decimal(r.valor), // Converte o 'number' do JS para 'Decimal' do Prisma
    }));

    // 3c. Cria todos os "filhos" de uma vez (eficiente)
    await tx.resultadoMetrica.createMany({
      data: resultadosData,
    });

    // 3d. Retorna a avaliação completa que acabou de ser criada
    return tx.registroAvaliacao.findUnique({
      where: { id: novaAvaliacao.id },
      include: {
        modalidade: true, // Inclui dados da modalidade
        resultados: {
          // Inclui os resultados criados
          include: {
            tipoMetrica: true, // Inclui os nomes (Tempo, Distância) e unidades (s, m)
          },
        },
      },
    });
  });
};

/**
 * Busca o histórico de avaliações de um atleta (Telas 3 e 5).
 * Aplica os filtros de query params.
 */
export const getAvaliacoesByAtleta = async (
  query: GetAvaliacoesQueryDTO,
  usuarioId: string
) => {
  const { atletaId, modalidadeId, tipo, dataInicio, dataFim } = query;

  // 1. Checagem de Segurança
  await checkAtletaOwnership(atletaId, usuarioId);

  // 2. Monta a cláusula WHERE dinamicamente
  const whereClause: Prisma.RegistroAvaliacaoWhereInput = {
    atletaId: atletaId, // Filtro base obrigatório
  };

  if (modalidadeId) {
    whereClause.modalidadeId = modalidadeId;
  }
  if (tipo) {
    whereClause.tipo = tipo;
  }
  if (dataInicio || dataFim) {
    whereClause.dataHora = {};
    if (dataInicio) {
      whereClause.dataHora.gte = dataInicio; // gte = "greater than or equal"
    }
    if (dataFim) {
      // Adiciona 1 dia - 1ms para garantir que o dia final seja incluído
      const dataFimAjustada = new Date(dataFim);
      dataFimAjustada.setHours(23, 59, 59, 999);
      whereClause.dataHora.lte = dataFimAjustada; // lte = "less than or equal"
    }
  }

  // 3. Executa a busca
  return prisma.registroAvaliacao.findMany({
    where: whereClause,
    include: {
      modalidade: {
        select: { nome: true, categoria: true }, // Pega dados da modalidade
      },
      resultados: {
        include: {
          tipoMetrica: {
            select: { nome: true, unidadeMedida: true }, // Pega dados da métrica
          },
        },
      },
    },
    orderBy: {
      dataHora: "desc", // Essencial: mais recentes primeiro
    },
  });
};