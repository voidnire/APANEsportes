import { PrismaClient, Prisma } from '@prisma/client';

// Instancia o Prisma Client
const prisma = new PrismaClient();


const classificacoesData: Prisma.ClassificacaoCreateInput[] = [
  // --- ATLETISMO: DEFICIÊNCIA VISUAL (T/F11-13) ---
  { codigo: 'T11', descricao: 'Atletismo Pista - Deficiência visual total' },
  { codigo: 'F11', descricao: 'Atletismo Campo - Deficiência visual total' },
  { codigo: 'T12', descricao: 'Atletismo Pista - Deficiência visual severa' },
  { codigo: 'F12', descricao: 'Atletismo Campo - Deficiência visual severa' },
  { codigo: 'T13', descricao: 'Atletismo Pista - Deficiência visual moderada' },
  { codigo: 'F13', descricao: 'Atletismo Campo - Deficiência visual moderada' },

  // --- ATLETISMO: DEFICIÊNCIA INTELECTUAL (T/F20) ---
  { codigo: 'T20', descricao: 'Atletismo Pista - Deficiência intelectual' },
  { codigo: 'F20', descricao: 'Atletismo Campo - Deficiência intelectual' },

  // --- ATLETISMO: PARALISIA CEREBRAL (T/F31-38) ---
  { codigo: 'T32', descricao: 'Atletismo Pista - PC Cadeira de Rodas (tetraplegia severa)' },
  { codigo: 'F32', descricao: 'Atletismo Campo - PC Cadeira de Rodas (tetraplegia severa)' },
  { codigo: 'T33', descricao: 'Atletismo Pista - PC Cadeira de Rodas (tetra/triplegia moderada)' },
  { codigo: 'F33', descricao: 'Atletismo Campo - PC Cadeira de Rodas (tetra/triplegia moderada)' },
  { codigo: 'T34', descricao: 'Atletismo Pista - PC Cadeira de Rodas (diplegia)' },
  { codigo: 'F34', descricao: 'Atletismo Campo - PC Cadeira de Rodas (diplegia)' },
  { codigo: 'T35', descricao: 'Atletismo Pista - PC Ambulante (diplegia moderada)' },
  { codigo: 'F35', descricao: 'Atletismo Campo - PC Ambulante (diplegia moderada)' },
  { codigo: 'T36', descricao: 'Atletismo Pista - PC Ambulante (atetose/ataxia)' },
  { codigo: 'F36', descricao: 'Atletismo Campo - PC Ambulante (atetose/ataxia)' },
  { codigo: 'T37', descricao: 'Atletismo Pista - PC Ambulante (hemiplegia)' },
  { codigo: 'F37', descricao: 'Atletismo Campo - PC Ambulante (hemiplegia)' },
  { codigo: 'T38', descricao: 'Atletismo Pista - PC Ambulante (hemiplegia leve)' },
  { codigo: 'F38', descricao: 'Atletismo Campo - PC Ambulante (hemiplegia leve)' },

  // --- ATLETISMO: BAIXA ESTATURA (T/F40-41) ---
  { codigo: 'T40', descricao: 'Atletismo Pista - Baixa estatura (<125cm F, <130cm M)' },
  { codigo: 'F40', descricao: 'Atletismo Campo - Baixa estatura (<125cm F, <130cm M)' },
  { codigo: 'T41', descricao: 'Atletismo Pista - Baixa estatura (<140cm F, <145cm M)' },
  { codigo: 'F41', descricao: 'Atletismo Campo - Baixa estatura (<140cm F, <145cm M)' },

  // --- ATLETISMO: DEFICIÊNCIA MEMBROS (T/F42-46) ---
  { codigo: 'T42', descricao: 'Atletismo Pista - Def. membros inferiores (sem prótese, acima joelho)' },
  { codigo: 'F42', descricao: 'Atletismo Campo - Def. membros inferiores (sem prótese, acima joelho)' },
  { codigo: 'T44', descricao: 'Atletismo Pista - Def. membros inferiores (sem prótese, abaixo joelho)' },
  { codigo: 'F44', descricao: 'Atletismo Campo - Def. membros inferiores (sem prótese, abaixo joelho)' },
  { codigo: 'T45', descricao: 'Atletismo Pista - Def. membros superiores (ambos acima/abaixo cotovelo)' },
  { codigo: 'F45', descricao: 'Atletismo Campo - Def. membros superiores (ambos acima/abaixo cotovelo)' },
  { codigo: 'T46', descricao: 'Atletismo Pista - Def. membros superiores (um lado)' },
  { codigo: 'F46', descricao: 'Atletismo Campo - Def. membros superiores (um lado)' },

  // --- ATLETISMO: CADEIRA DE RODAS (T/F51-57) ---
  { codigo: 'T51', descricao: 'Atletismo Pista - Cadeira (tetraplegia leve, sem tronco)' },
  { codigo: 'F51', descricao: 'Atletismo Campo - Cadeira (tetraplegia leve, sem tronco)' },
  { codigo: 'T52', descricao: 'Atletismo Pista - Cadeira (tetraplegia, mov. dedos)' },
  { codigo: 'F52', descricao: 'Atletismo Campo - Cadeira (tetraplegia, mov. dedos)' },
  { codigo: 'T53', descricao: 'Atletismo Pista - Cadeira (paraplegia, sem tronco)' },
  { codigo: 'F53', descricao: 'Atletismo Campo - Cadeira (paraplegia, sem tronco)' },
  { codigo: 'T54', descricao: 'Atletismo Pista - Cadeira (paraplegia, com tronco)' },
  { codigo: 'F54', descricao: 'Atletismo Campo - Cadeira (paraplegia, com tronco)' },
  { codigo: 'F55', descricao: 'Atletismo Campo - Cadeira (paraplegia, tronco parcial)' },
  { codigo: 'F56', descricao: 'Atletismo Campo - Cadeira (paraplegia, tronco e quadris)' },
  { codigo: 'F57', descricao: 'Atletismo Campo - Cadeira (paraplegia, pernas funcionais)' },

  // --- ATLETISMO: PRÓTESES (T/F61-64) ---
  { codigo: 'T61', descricao: 'Atletismo Pista - Prótese (bi-amputado acima do joelho)' },
  { codigo: 'T62', descricao: 'Atletismo Pista - Prótese (bi-amputado abaixo do joelho)' },
  { codigo: 'T63', descricao: 'Atletismo Pista - Prótese (amputado acima do joelho)' },
  { codigo: 'T64', descricao: 'Atletismo Pista - Prótese (amputado abaixo do joelho)' },
  { codigo: 'F63', descricao: 'Atletismo Campo - Prótese (amputado acima do joelho)' },
  { codigo: 'F64', descricao: 'Atletismo Campo - Prótese (amputado abaixo do joelho)' },

  // --- NATAÇÃO (S=Livre/Costas/Borboleta, SB=Peito, SM=Medley) ---
  { codigo: 'S1', descricao: 'Natação - Def. físico-motora severa' },
  { codigo: 'SB1', descricao: 'Natação Peito - Def. físico-motora severa' },
  { codigo: 'SM1', descricao: 'Natação Medley - Def. físico-motora severa' },
  { codigo: 'S5', descricao: 'Natação - Def. físico-motora (ex: nanismo, hemiplegia)' },
  { codigo: 'SB4', descricao: 'Natação Peito - Def. físico-motora (ex: nanismo)' },
  { codigo: 'SM5', descricao: 'Natação Medley - Def. físico-motora (ex: nanismo)' },
  { codigo: 'S7', descricao: 'Natação - Def. físico-motora (ex: amputação braço/perna)' },
  { codigo: 'SB6', descricao: 'Natação Peito - Def. físico-motora (ex: amputação braço)' },
  { codigo: 'SM7', descricao: 'Natação Medley - Def. físico-motora (ex: amputação braço/perna)' },
  { codigo: 'S10', descricao: 'Natação - Def. físico-motora leve' },
  { codigo: 'SB9', descricao: 'Natação Peito - Def. físico-motora leve' },
  { codigo: 'SM10', descricao: 'Natação Medley - Def. físico-motora leve' },
  { codigo: 'S11', descricao: 'Natação - Deficiência visual total' },
  { codigo: 'SB11', descricao: 'Natação Peito - Deficiência visual total' },
  { codigo: 'SM11', descricao: 'Natação Medley - Deficiência visual total' },
  { codigo: 'S13', descricao: 'Natação - Deficiência visual moderada' },
  { codigo: 'SB13', descricao: 'Natação Peito - Deficiência visual moderada' },
  { codigo: 'SM13', descricao: 'Natação Medley - Deficiência visual moderada' },
  { codigo: 'S14', descricao: 'Natação - Deficiência intelectual' },
  { codigo: 'SB14', descricao: 'Natação Peito - Deficiência intelectual' },
  { codigo: 'SM14', descricao: 'Natação Medley - Deficiência intelectual' },
];


const tipoMetricaData: Prisma.TipoMetricaCreateInput[] = [
  { nome: 'Tempo', unidadeMedida: 's' },
  { nome: 'Distância', unidadeMedida: 'm' },
  { nome: 'Altura', unidadeMedida: 'm' },
  { nome: 'Peso', unidadeMedida: 'kg' }, // Para Halterofilismo
  { nome: 'Velocidade do Vento', unidadeMedida: 'm/s' }, // Para Saltos/Corridas
];

const modalidadeData: Prisma.ModalidadeCreateInput[] = [
  // Corridas de Pista
  { nome: '100m Rasos', categoria: 'Corrida' },
  { nome: '200m Rasos', categoria: 'Corrida' },
  { nome: '400m Rasos', categoria: 'Corrida' },
  { nome: '800m Rasos', categoria: 'Corrida' },
  { nome: '1500m Rasos', categoria: 'Corrida' },
  { nome: '5000m Rasos', categoria: 'Corrida' },
  { nome: 'Maratona', categoria: 'Corrida' },
  // Saltos
  { nome: 'Salto em Distância', categoria: 'Salto' },
  { nome: 'Salto Triplo', categoria: 'Salto' },
  { nome: 'Salto em Altura', categoria: 'Salto' },
  // Lançamentos
  { nome: 'Arremesso de Peso', categoria: 'Lançamento' },
  { nome: 'Lançamento de Dardo', categoria: 'Lançamento' },
  { nome: 'Lançamento de Disco', categoria: 'Lançamento' },
  { nome: 'Lançamento de Club', categoria: 'Lançamento' }, // Específico para F31/32/51
  // Natação
  { nome: '50m Nado Livre', categoria: 'Natação' },
  { nome: '100m Nado Livre', categoria: 'Natação' },
  { nome: '400m Nado Livre', categoria: 'Natação' },
  { nome: '50m Nado Costas', categoria: 'Natação' },
  { nome: '100m Nado Costas', categoria: 'Natação' },
  { nome: '50m Nado Peito', categoria: 'Natação' },
  { nome: '100m Nado Peito', categoria: 'Natação' },
  { nome: '50m Nado Borboleta', categoria: 'Natação' },
  { nome: '100m Nado Borboleta', categoria: 'Natação' },
  { nome: '150m Nado Medley', categoria: 'Natação' },
  { nome: '200m Nado Medley', categoria: 'Natação' },
  // Outros
  { nome: 'Halterofilismo Supino', categoria: 'Força' },
];


async function main() {
  console.log('Iniciando o processo de "seeding"...');

  // --- PASSO 1: Semear Classificações ---
  console.log(`Semeando ${classificacoesData.length} Classificações...`);
  for (const data of classificacoesData) {
    await prisma.classificacao.upsert({
      where: { codigo: data.codigo }, // Usa campo @unique
      update: {}, // Não faz nada se já existir
      create: data, // Cria se não existir
    });
  }

  // --- PASSO 2: Semear Tipos de Métrica ---
  console.log(`Semeando ${tipoMetricaData.length} Tipos de Métrica...`);
  for (const data of tipoMetricaData) {
    await prisma.tipoMetrica.upsert({
      where: { nome: data.nome }, // Usa campo @unique
      update: {},
      create: data,
    });
  }

  // --- PASSO 3: Semear Modalidades e CONECTAR suas Métricas ---
  // Esta é a lógica central que alimenta a Tela 2.
  console.log(`Semeando ${modalidadeData.length} Modalidades e suas Relações (N:M)...`);

  // Agrupa modalidades por métrica para eficiência
  const metricasConectadas = {
    tempo: [
      '100m Rasos', '200m Rasos', '400m Rasos', '800m Rasos', '1500m Rasos', '5000m Rasos', 'Maratona',
      '50m Nado Livre', '100m Nado Livre', '400m Nado Livre', '50m Nado Costas', '100m Nado Costas',
      '50m Nado Peito', '100m Nado Peito', '50m Nado Borboleta', '100m Nado Borboleta',
      '150m Nado Medley', '200m Nado Medley'
    ],
    distancia: [
      'Arremesso de Peso', 'Lançamento de Dardo', 'Lançamento de Disco', 'Lançamento de Club'
    ],
    altura: [
      'Salto em Altura'
    ],
    peso: [
      'Halterofilismo Supino'
    ]
  };

  // Processa corridas e natação (Métrica: Tempo)
  for (const nome of metricasConectadas.tempo) {
    const categoria = nome.includes('Nado') ? 'Natação' : 'Corrida';
    await prisma.modalidade.upsert({
      where: { nome: nome },
      update: {},
      create: {
        nome: nome,
        categoria: categoria,
        metricasPermitidas: {
          create: [{ tipoMetrica: { connect: { nome: 'Tempo' } } }],
        },
      },
    });
  }
  
  // Processa lançamentos (Métrica: Distância)
  for (const nome of metricasConectadas.distancia) {
    await prisma.modalidade.upsert({
      where: { nome: nome },
      update: {},
      create: {
        nome: nome,
        categoria: 'Lançamento',
        metricasPermitidas: {
          create: [{ tipoMetrica: { connect: { nome: 'Distância' } } }],
        },
      },
    });
  }
  
  // Processa Salto em Altura (Métrica: Altura)
  await prisma.modalidade.upsert({
    where: { nome: 'Salto em Altura' },
    update: {},
    create: {
      nome: 'Salto em Altura',
      categoria: 'Salto',
      metricasPermitidas: {
        create: [{ tipoMetrica: { connect: { nome: 'Altura' } } }],
      },
    },
  });
  
  // Processa Halterofilismo (Métrica: Peso)
  await prisma.modalidade.upsert({
    where: { nome: 'Halterofilismo Supino' },
    update: {},
    create: {
      nome: 'Halterofilismo Supino',
      categoria: 'Força',
      metricasPermitidas: {
        create: [{ tipoMetrica: { connect: { nome: 'Peso' } } }],
      },
    },
  });

  // --- Casos Especiais (Múltiplas Métricas) ---

  // Salto em Distância -> Distância + Vento
  await prisma.modalidade.upsert({
    where: { nome: 'Salto em Distância' },
    update: {},
    create: {
      nome: 'Salto em Distância',
      categoria: 'Salto',
      metricasPermitidas: {
        create: [
          { tipoMetrica: { connect: { nome: 'Distância' } } },
          { tipoMetrica: { connect: { nome: 'Velocidade do Vento' } } },
        ],
      },
    },
  });

  // Salto Triplo -> Distância + Vento
  await prisma.modalidade.upsert({
    where: { nome: 'Salto Triplo' },
    update: {},
    create: {
      nome: 'Salto Triplo',
      categoria: 'Salto',
      metricasPermitidas: {
        create: [
          { tipoMetrica: { connect: { nome: 'Distância' } } },
          { tipoMetrica: { connect: { nome: 'Velocidade do Vento' } } },
        ],
      },
    },
  });

  console.log('Seeding concluído com sucesso.');
}


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