import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente (HOST, PORT) do seu .env
dotenv.config();

const doc = {
  info: {
    title: "APAN API",
    description: "Documentação da API de backend do projeto APAN (para treinadores e atletas).",
  },
  // Define o host base. O Swagger UI usará isso para os "Try it out".
  // (Puxado do seu .env, ex: localhost:3001)
  host: `${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}`,
  // Define o prefixo base para todas as rotas (nosso v1Router)
  basePath: "/v1",
  schemes: ['http', 'https'],
  
  // Definições dos Schemas (DTOs) que usamos no projeto.
  definitions: {
    // --- AUTH ---
    SignUpDTO: {
      nomeCompleto: "Treinador Teste",
      email: "treinador@teste.com",
      password: "Password@123"
    },
    LoginDTO: {
      email: "treinador@teste.com",
      password: "Password@123"
    },
    SanitizedUser: { // Resposta do Login e /auth/me
      id: "uuid-user-1",
      nomeCompleto: "Treinador Teste",
      email: "treinador@teste.com",
      createdAt: "2025-11-04T10:00:00.000Z",
      updatedAt: "2025-11-04T10:00:00.000Z"
    },

    // --- ATLETAS ---
    CreateAtletaDTO: {
      nomeCompleto: "João Silva",
      dataNascimento: "2000-01-10" // (string YYYY-MM-DD)
    },
    UpdateAtletaDTO: {
      nomeCompleto: "João Silva Atualizado",
      dataNascimento: "2000-01-10"
    },
    AssociateClassificacaoDTO: {
      classificacaoId: "uuid-classificacao-t11"
    },
    AtletaDetalhado: { // Resposta do GET /atletas/:id
      id: "uuid-atleta-1",
      nomeCompleto: "João Silva",
      dataNascimento: "2000-01-10T00:00:00.000Z",
      usuarioId: "uuid-user-1",
      createdAt: "2025-11-04T10:00:00.000Z",
      updatedAt: "2025-11-04T10:00:00.000Z",
      classificacoes: [
        {
          id: "uuid-class-1",
          codigo: "T11",
          descricao: "Deficiência visual total"
        }
      ]
    },

    // --- AVALIAÇÕES ---
    ResultadoMetricaDTO: { // Sub-objeto usado na criação
      tipoMetricaId: "uuid-metrica-tempo",
      valor: 12.5
    },
    CreateAvaliacaoDTO: { // Body do POST /avaliacoes
      atletaId: "uuid-atleta-1",
      modalidadeId: "uuid-modalidade-100m",
      tipo: "PRE_TREINO",
      observacoes: "Pista molhada",
      dataHora: "2025-11-04T10:00:00.000Z",
      resultados: [
        { $ref: "#/definitions/ResultadoMetricaDTO" }
      ]
    },
    RegistroAvaliacaoCompleto: { // Resposta do POST /avaliacoes e GET /avaliacoes
       id: "uuid-registro-1",
       atletaId: "uuid-atleta-1",
       modalidadeId: "uuid-modalidade-100m",
       tipo: "PRE_TREINO",
       observacoes: "Pista molhada",
       dataHora: "2025-11-04T10:00:00.000Z",
       createdAt: "2025-11-04T10:00:00.000Z",
       updatedAt: "2025-11-04T10:00:00.000Z",
       modalidade: {
         nome: "100m Rasos",
         categoria: "Corrida"
       },
       resultados: [
         {
           id: "uuid-resultado-1",
           tipoMetricaId: "uuid-metrica-tempo",
           valor: 12.5,
           createdAt: "2025-11-04T10:00:00.000Z",
           updatedAt: "2025-11-04T10:00:00.000Z",
           tipoMetrica: {
             nome: "Tempo",
             unidadeMedida: "s"
           }
         }
       ]
    },

    // --- DADOS AUXILIARES (Modelos de resposta) ---
    Classificacao: {
      id: "uuid-class-1",
      codigo: "T11",
      descricao: "Deficiência visual total"
    },
    Modalidade: {
      id: "uuid-modalidade-100m",
      nome: "100m Rasos",
      categoria: "Corrida"
    },
    TipoMetrica: {
      id: "uuid-metrica-tempo",
      nome: "Tempo",
      unidadeMedida: "s"
    },

    // --- ERROS ---
    ErrorAuth: {
      message: "E-mail ou senha inválidos."
    },
    ErrorValidation: {
      fieldErrors: {
        email: "E-mail já cadastrado."
      }
    }
  },
  // Adiciona segurança para os endpoints protegidos
  // (Isso informa ao Swagger que usamos cookies)
  securityDefinitions: {
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "connect.sid" // O nome do cookie de sessão
    }
  }
};

const outputFile = "./swagger-output.json";

// (A CORREÇÃO)
// Só precisamos apontar para o arquivo de entrada (entrypoint) da sua API.
// O swagger-autogen vai ler este arquivo e seguir os 'imports'
// para encontrar o 'v1Router' e todas as outras rotas.
const routes = [
  "./src/index.ts" 
];

// Gera o arquivo
swaggerAutogen()(outputFile, routes, doc);