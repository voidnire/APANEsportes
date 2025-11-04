import { prisma } from "../../database/prismaSingleton"; // Ajuste o caminho se necessário

/**
 * Busca todas as Classificações (do seed).
 * Ordenadas por código para o dropdown.
 * (Usado na Tela 4/5 - CRUD de Atletas)
 */
export const getClassificacoes = () => {
  return prisma.classificacao.findMany({
    orderBy: {
      codigo: "asc", // Garante ordem alfabética no dropdown
    },
    select: {
      id: true,
      codigo: true,
      descricao: true,
    },
  });
};

/**
 * Busca todas as Modalidades (do seed).
 * Ordenadas por nome para o dropdown.
 * (Usado na Tela 2 - Registrar Dados)
 */
export const getModalidades = () => {
  return prisma.modalidade.findMany({
    orderBy: {
      nome: "asc", // Garante ordem alfabética no dropdown
    },
    select: {
      id: true,
      nome: true,
      categoria: true,
    },
  });
};

/**
 * Busca os Tipos de Métrica permitidos para uma Modalidade específica.
 * Esta é a lógica "mágica" da Tela 2.
 *
 * @param modalidadeId O ID da modalidade selecionada (ex: "Salto em Distância")
 * @returns Um array de objetos TipoMetrica (ex: [ { nome: "Distância" }, { nome: "Velocidade do Vento" } ])
 * ou 'null' se a modalidade não for encontrada.
 */
export const getMetricasByModalidade = async (modalidadeId: string) => {
  // 1. Busca a modalidade e suas relações N:M
  const modalidadeComMetricas = await prisma.modalidade.findUnique({
    where: {
      id: modalidadeId,
    },
    include: {
      // Puxa os registros da tabela associativa 'ModalidadeTipoMetrica'
      metricasPermitidas: {
        include: {
          // Puxa os dados da tabela 'TipoMetrica' relacionada
          tipoMetrica: true,
        },
        orderBy: {
          tipoMetrica: {
             nome: 'asc' // Ordena as métricas (ex: Altura, Distância, Tempo)
          }
        }
      },
    },
  });

  // 2. Se a modalidade não existir, retorna null
  if (!modalidadeComMetricas) {
    return null;
  }

  // 3. Mapeia o resultado para retornar apenas a lista limpa de TipoMetrica
  // (O frontend não precisa saber sobre a tabela associativa)
  const metricas = modalidadeComMetricas.metricasPermitidas.map(
    (rel) => rel.tipoMetrica
  );

  return metricas;
};