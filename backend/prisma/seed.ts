import { PrismaClient } from '@prisma/client';

// Instancia o Prisma Client
const prisma = new PrismaClient();

/**
 * Função principal que executa o "seeding" (semeadura) do banco.
 * * Por que 'upsert'?
 * 'upsert' é a melhor prática para seeds de produção.
 * Ele tenta ENCONTRAR um registro (pelo 'where') e, se não achar,
 * ele CRIA ('create'). Se achar, ele ATUALIZA ('update').
 * * Como usamos 'update: {}' (vazio), ele simplesmente não faz nada se
 * o registro já existir. Isso torna o script "idempotente",
 * ou seja, você pode rodá-lo 1000 vezes sem criar duplicatas.
 */
async function main() {
  console.log('Iniciando o processo de "seeding"...');

  // ====================================================================
  // PASSO 1: Semear entidades que não dependem de outras
  // ====================================================================

  console.log('Semeando: Classificacao');
  await prisma.classificacao.upsert({
    where: { codigo: 'T11' },
    update: {},
    create: { codigo: 'T11', descricao: 'Atletas com deficiência visual total (pista)' },
  });
  await prisma.classificacao.upsert({
    where: { codigo: 'T12' },
    update: {},
    create: { codigo: 'T12', descricao: 'Atletas com deficiência visual severa (pista)' },
  });
  await prisma.classificacao.upsert({
    where: { codigo: 'F40' },
    update: {},
    create: { codigo: 'F40', descricao: 'Atletas com baixa estatura (campo)' },
  });
  await prisma.classificacao.upsert({
    where: { codigo: 'S7' },
    update: {},
    create: { codigo: 'S7', descricao: 'Deficiência físico-motora (natação)' },
  });
  // ... adicione outras classificações aqui

  console.log('Semeando: TipoMetrica');
  await prisma.tipoMetrica.upsert({
    where: { nome: 'Tempo' },
    update: {},
    create: { nome: 'Tempo', unidadeMedida: 's' },
  });
  await prisma.tipoMetrica.upsert({
    where: { nome: 'Distância' },
    update: {},
    create: { nome: 'Distância', unidadeMedida: 'm' },
  });
  await prisma.tipoMetrica.upsert({
    where: { nome: 'Altura' },
    update: {},
    create: { nome: 'Altura', unidadeMedida: 'm' },
  });
  await prisma.tipoMetrica.upsert({
    where: { nome: 'Peso' },
    update: {},
    create: { nome: 'Peso', unidadeMedida: 'kg' },
  });
  // ... adicione outros tipos de métrica aqui

  // ====================================================================
  // PASSO 2: Semear Modalidades e CONECTAR suas métricas
  // Esta é a forma mais clara de lidar com a relação N:M.
  // ====================================================================

  console.log('Semeando: Modalidades e suas Relações (N:M)');

  await prisma.modalidade.upsert({
    where: { nome: '100m Rasos' },
    update: {}, // Não faz nada se a modalidade já existir
    create: {
      nome: '100m Rasos',
      categoria: 'Corrida',
      metricasPermitidas: { // <-- Aqui está a "mágica" do Prisma
        create: [
          {
            // Conecta à métrica que JÁ EXISTE (criada no Passo 1)
            tipoMetrica: { connect: { nome: 'Tempo' } },
          },
        ],
      },
    },
  });

  await prisma.modalidade.upsert({
    where: { nome: 'Salto em Distância' },
    update: {},
    create: {
      nome: 'Salto em Distância',
      categoria: 'Salto',
      metricasPermitidas: {
        create: [
          {
            tipoMetrica: { connect: { nome: 'Distância' } },
          },
          // Esta modalidade tem uma segunda métrica opcional, por ex.
          // {
          //   tipoMetrica: { connect: { nome: 'Velocidade do Vento' } } 
          //   // (Você precisaria adicionar 'Velocidade do Vento' no Passo 1)
          // },
        ],
      },
    },
  });

  await prisma.modalidade.upsert({
    where: { nome: 'Arremesso de Peso' },
    update: {},
    create: {
      nome: 'Arremesso de Peso',
      categoria: 'Lançamento',
      metricasPermitidas: {
        create: [
          {
            tipoMetrica: { connect: { nome: 'Distância' } },
          },
          {
            // Esta modalidade usa duas métricas
            tipoMetrica: { connect: { nome: 'Peso' } }, // (Ex: Peso do implemento)
          },
        ],
      },
    },
  });

  await prisma.modalidade.upsert({
    where: { nome: '50m Nado Livre' },
    update: {},
    create: {
      nome: '50m Nado Livre',
      categoria: 'Natação',
      metricasPermitidas: {
        create: [
          {
            tipoMetrica: { connect: { nome: 'Tempo' } },
          },
        ],
      },
    },
  });

  console.log('Seeding concluído com sucesso.');
}

// ====================================================================
// Execução Padrão do Script
// ====================================================================

main()
  .catch((e) => {
    // Captura qualquer erro durante o seeding
    console.error('Erro durante o processo de seeding:', e);
    process.exit(1); // Encerra o processo com status de erro
  })
  .finally(async () => {
    // Garante que a conexão com o banco seja sempre fechada
    console.log('Desconectando do banco de dados...');
    await prisma.$disconnect();
  });