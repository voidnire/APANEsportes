export const atletas = [
  {
    id: "m1",
    name: "Ana Silva",
    age: 28,
    modality: "Salto em altura",
    disability: "Visual",
    avatar: "", // URL ou require('../assets/ana.jpg')
    bestMark: "1.92 m",
    avgMark: "1.86 m",
    bio: "Atleta amadora apaixonada por saltos."
  },
  {
    id: "m2",
    name: "Carlos Pereira",
    age: 35,
    modality: "Corrida 5k",
    disability: "Amputação membro inferior",
    avatar: "",
    bestMark: "15:32",
    avgMark: "16:10",
    bio: "Treinador e corredor de rua."
  },
  {
    id: "m3",
    name: "Beatriz Alves",
    age: 22,
    modality: "Salto com vara",
    disability: "Visual",
    avatar: "",
    bestMark: "4,10 m",
    avgMark: "3,95 m",
    bio: "Competidora universitária."
  },
  {
    id: "m4",
    name: "Diego Rocha",
    age: 30,
    modality: "Fisioterapia / Apoio",
    disability: "Paralisia cerebral",
    avatar: "",
    bestMark: "",
    avgMark: "",
    bio: "Fisioterapeuta que acompanha a equipe."
  },
  {
    id: "m5",
    name: "Ezequiel",
    age: 19,
    modality: "Meio-fundo",
    disability: "Amputação membro superior",
    avatar: "",
    bestMark: "2:03",
    avgMark: "2:10",
    bio: "Jovem promissor do meio-fundo."
  },
  {
    id: "m6",
    name: "Tim Wright",
    age: 26,
    modality: "Corrida de resistência",
    disability: "Psicossocial",
    avatar: "",
    bestMark: "35:45",
    avgMark: "37:20",
    bio: "Corredora com foco em trail e resistência."
  },
  {
    id: "m7",
    name: "Brian Thomas",
    age: 33,
    modality: "Técnico",
    disability: "Psicossocial e Visual",
    avatar: "",
    bestMark: "",
    avgMark: "",
    bio: "Técnico responsável por planejamento."
  },
    {
    id: "m8",
    name: "Tobias E. Rogers",
    age: 33,
    modality: "Técnico",
    disability: "Tourettes",
    avatar: "",
    bestMark: "",
    avgMark: "",
    bio: "Técnico responsável por planejamento."
  },
];

// Mapa para lookup rápido por id
const athleteMap = atletas.reduce((acc, a) => {
  acc[a.id] = a;
  return acc;
}, {});

/**
 * Retorna um atleta pelo id (string). Retorna undefined se não existir.
 * @param {string} id
 */
export function getAthleteById(id) {
  return athleteMap[id];
}

/**
 * Retorna um array de atletas a partir de um array de ids.
 * Mantém a ordem dos ids e ignora ids inexistentes.
 * @param {string[]} ids
 */
export function getAthletesByIds(ids = []) {
  return ids.map((id) => athleteMap[id]).filter(Boolean);
}

export const atletasMUDARTODOSDPS = [
  {
    id: "961006c7-b971-4928-9790-61ccba75f346",
    nomeCompleto: "João Silva (Atleta 1)", 
    dataNascimento: "2002-05-10",
    createdAt: "2025-11-04 04:10:54.359",
    updatedAt: "2025-11-04 04:10:54.359",
    usuarioId: "8cde7eca-b452-45b2-b0e5-77a46a90fe7c"
  }
];