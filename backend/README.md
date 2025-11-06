# API do Projeto APAN (Backend)

Este documento descreve a API RESTful do backend do projeto APAN. Ele é focado em guiar a equipe de frontend sobre como consumir os *endpoints* de forma lógica e sequencial.

## URL Base da API

A API está hospedada e pode ser acessada através da seguinte URL base. Todos os *endpoints* descritos abaixo são relativos a esta URL.

**URL Base:** `https://backapan.zeabur.app/v1` (ou a URL do seu serviço de *hosting*)

---

## Documentação da API (Swagger)

A documentação completa, interativa e detalhada de todos os *endpoints*, incluindo os *schemas* de *request* e *response*, está disponível via **Swagger**.

**Acesse a documentação em:**
**[https://backapan.zeabur.app/api](https://backapan.zeabur.app/api)**

---

## Autenticação (O Conceito Mais Importante!)

A API **não usa JWT**. Ela usa um sistema de **Sessões com Cookies `httpOnly`**.

Isso torna a vida do frontend **muito mais fácil**, mas requer uma configuração inicial.

### Como Funciona
1.  O frontend envia uma requisição `POST /v1/auth/login`.
2.  O servidor valida as credenciais.
3.  O servidor responde com `200 OK` e, o mais importante, envia um *header* `Set-Cookie` que salva um *cookie* chamado `connect.sid` no navegador.
4.  A partir desse momento, **o navegador irá anexar este *cookie* automaticamente a todas as futuras requisições** (ex: `GET /v1/atletas`).
5.  O servidor lê o *cookie* e identifica o usuário (Treinador).

### Ação Requerida no Frontend

Para que o navegador envie os *cookies* para a API (que está em outro domínio), o seu cliente HTTP (Axios, Fetch, etc.) **DEVE** ser configurado para incluir credenciais.

**Exemplo com Axios:**
```javascript
// Em algum arquivo central do Axios (axios.js)
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '[https://backapan.zeabur.app/v1](https://backapan.zeabur.app/v1)', // Base da nossa API
  withCredentials: true // <-- ISTO É OBRIGATÓRIO!
});

export default apiClient;
```

**Exemplo com Fetch:**
```javascript
fetch('[https://backapan.zeabur.app/v1/auth/me](https://backapan.zeabur.app/v1/auth/me)', {
  credentials: 'include' // <-- ISTO É OBRIGATÓRIO!
});
```

---

## Fluxos da API (Como usar os Endpoints)

Aqui está o "passo a passo" de como o frontend deve chamar a API para construir as telas.

Presume-se que o usuário já está logado.

### Fluxo 1: Gerenciamento de Atletas

**Cenário:** O treinador quer ver sua lista de atletas e adicionar um novo.

#### Carregar a Lista (Página de Atletas)
O frontend chama `GET /v1/atletas`. A API retorna um array de atletas que apenas este treinador cadastrou.

#### Popular Dropdown (Formulário)
Para o formulário de "Novo Atleta", o frontend precisa do dropdown de classificações.

```
GET /v1/dados-auxiliares/classificacoes
```

#### Criar Novo Atleta (Formulário)
O usuário preenche o nome e a data.

```
POST /v1/atletas
```

**Body (JSON):**
```json
{
  "nomeCompleto": "João Silva",
  "dataNascimento": "2002-05-10"
}
```

O servidor retorna o novo atleta criado (com seu ID).

#### Ver Detalhes (Página de Detalhes do Atleta)
O usuário clica em "João Silva".

```
GET /v1/atletas/[ID_DO_JOAO]
```

A API retorna os dados completos do João, incluindo um array `classificacoes` (inicialmente vazio).

#### Associar Classificação (Página de Detalhes do Atleta)
O usuário seleciona "T11" (ID: [ID_DA_T11]) do dropdown (que veio do Passo 2) e salva.

```
POST /v1/atletas/[ID_DO_JOAO]/classificacoes
```

**Body (JSON):**
```json
{
  "classificacaoId": "[ID_DA_T11]"
}
```

#### Deletar Atleta (Página de Atletas)
```
DELETE /v1/atletas/[ID_DO_JOAO]
```

---

### Fluxo 2: Registro de Desempenho (O Fluxo Complexo)

**Cenário:** O treinador quer registrar um novo treino para um atleta.

#### Carregar Dropdown 1 (Atleta)
O frontend precisa da lista de atletas do treinador.

```
GET /v1/atletas
```

O usuário seleciona "João Silva" (ID: [ID_ATLETA_JOAO]).

#### Carregar Dropdown 2 (Modalidade)
O frontend precisa da lista de esportes.

```
GET /v1/dados-auxiliares/modalidades
```

O usuário seleciona "100m Rasos" (ID: [ID_MODALIDADE_100M]).

#### Carregar Métricas (Lógica Dinâmica)
Imediatamente após o usuário selecionar "100m Rasos", o frontend deve fazer uma chamada para saber quais inputs de métrica deve desenhar na tela.

```
GET /v1/dados-auxiliares/modalidades/[ID_MODALIDADE_100M]/metricas
```

**A API retorna:**
```json
[
  { "id": "[ID_METRICA_TEMPO]", "nome": "Tempo", "unidadeMedida": "s" },
  { "id": "[ID_METRICA_VENTO]", "nome": "Velocidade do Vento", "unidadeMedida": "m/s" }
]
```

#### Renderizar Inputs
O frontend agora desenha dois inputs: "Tempo (s)" e "Velocidade do Vento (m/s)".

#### Salvar Avaliação
O usuário preenche tudo (ex: PRE-TREINO, Observações, e os valores 11.45s e 0.5m/s).

```
POST /v1/avaliacoes
```

**Body (JSON):**
```json
{
  "atletaId": "[ID_ATLETA_JOAO]",
  "modalidadeId": "[ID_MODALIDADE_100M]",
  "tipo": "PRE_TREINO",
  "observacoes": "Pista molhada, início de treino.",
  "resultados": [
    {
      "tipoMetricaId": "[ID_METRICA_TEMPO]",
      "valor": 11.45
    },
    {
      "tipoMetricaId": "[ID_METRICA_VENTO]",
      "valor": 0.5
    }
  ]
}
```

A API cuida da transação e salva tudo.

---

### Fluxo 3: Consulta de Histórico (Dashboard de Desempenho)

**Cenário:** O treinador quer ver os gráficos de desempenho do "João Silva".

#### Carregar Dropdowns de Filtro

```
GET /v1/atletas
GET /v1/dados-auxiliares/modalidades
```

#### Buscar Dados (Gráfico)
O usuário selecionou "João Silva" ([ID_ATLETA_JOAO]).

```
GET /v1/avaliacoes?atletaId=[ID_ATLETA_JOAO]
```

#### Filtrar Dados (Gráfico)
```
GET /v1/avaliacoes?atletaId=[ID_ATLETA_JOAO]&modalidadeId=[ID_MODALIDADE_100M]&tipo=POS_TREINO&dataInicio=2025-01-01&dataFim=2025-01-31
```

A API retorna o array de avaliações já filtrado, pronto para o frontend plotar no gráfico.

---

## Referência Rápida de Módulos

**Base URL:** `/v1` (relativo à URL de hosting)  
**Documentação Swagger:** `/api`

### /auth
- `POST /signup` — Cria Treinador  
- `POST /login` — Inicia Sessão, retorna cookie  
- `POST /logout` — Destrói Sessão, limpa cookie  
- `GET /me` — Retorna quem está logado

### /atletas (Protegido)
- `POST /` — Cria Atleta  
- `GET /` — Lista meus Atletas  
- `GET /:id` — Vê detalhes de um Atleta  
- `PUT /:id` — Atualiza um Atleta  
- `DELETE /:id` — Deleta um Atleta  
- `POST /:id/classificacoes` — Associa Classificação  
- `DELETE /:id/classificacoes/:classificacaoId` — Desassocia Classificação

### /avaliacoes (Protegido)
- `POST /` — Registra um novo desempenho  
- `GET /` — Busca o histórico de desempenho com filtros

### /dados-auxiliares (Protegido)
- `GET /classificacoes` — Alimenta dropdown do formulário de atletas  
- `GET /modalidades` — Alimenta dropdown do registro de desempenho  
- `GET /modalidades/:id/metricas` — Lógica dinâmica do formulário de registro