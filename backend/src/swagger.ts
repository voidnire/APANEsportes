import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente (HOST, PORT) do seu .env
dotenv.config();

// Define as URLs base (RAIZ) da sua aplicação.
// O '/v1' NÃO deve ser incluído aqui.
const productionUrl = "https://backapan.zeabur.app"; 
const localUrl = `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3001}`;

const doc = {
  info: {
    title: "APAN API",
    description: "Documentação da API de backend do projeto APAN (para treinadores e atletas).",
  },
  
  // (IMPORTANTE)
  // O 'servers' permite ao Swagger UI ter um dropdown para alternar
  // entre o ambiente de Produção (Zeabur) e Desenvolvimento (Local).
  // As URLs aqui são a RAIZ. O swagger-autogen irá adicionar
  // o prefixo '/v1' automaticamente ao ler seu 'index.ts'.
  servers: [
    {
      url: productionUrl,
      description: 'Ambiente de Produção (Zeabur)'
    },
    {
      url: localUrl,
      description: 'Ambiente de Desenvolvimento (Local)'
    }
  ],

  // (IMPORTANTE)
  // Definições dos Schemas (DTOs e Modelos) que usamos no projeto.
  // Isso popula os exemplos de "Request Body" e "Response" no Swagger.
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
    // (FIX) Renomeado para 'User' para bater com o que o 'autogen' espera
    User: { 
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

// O(s) arquivo(s) de rota. Apenas o 'entrypoint' (index.ts) é necessário.
const routes = [
  "./src/index.ts" 
];

// (IMPORTANTE)
// Gera o arquivo
// Passamos a opção { openapi: '3.0.0' } para forçar a geração
// no padrão OpenAPI 3, o que habilita o 'servers' dropdown.
swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);