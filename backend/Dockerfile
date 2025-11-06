# --------------------------
# Stage 1: Build (builder)
# Usa a LTS (Node 24) e 'alpine' para uma imagem menor
# --------------------------
FROM node:24-alpine AS builder
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala TODAS as dependências (prod + dev)
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Gera o Prisma Client (necessário para o 'npm run build' se o build usar o Prisma)
RUN npx prisma generate

# Compila o TypeScript para JavaScript
RUN npm run build

# --------------------------
# Stage 2: Runtime / Produção
# --------------------------
FROM node:24-alpine
WORKDIR /app

# Copia apenas o package.json
COPY package*.json ./

# Instala APENAS dependências de produção
RUN npm ci --omit=dev

# --- (A MÁGICA DO PRISMA) ---
# Copia o Prisma CLI e suas 'engines' do 'builder',
# já que ele foi removido pelo '--omit=dev'.
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Também precisamos do 'ts-node' e 'tsx' que são devDeps, mas usados pelo script 'seed' e 'swagger'
# (Se o seu CMD usá-los. O CMD padrão 'node build/index.js' não precisa, mas é mais seguro ter)
COPY --from=builder /app/node_modules/ts-node ./node_modules/ts-node
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/typescript ./node_modules/typescript

# Copia a aplicação compilada (JavaScript)
COPY --from=builder /app/build ./build
        
# Copia o schema.prisma (necessário para 'generate' e 'migrate')
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
# Copia a pasta de migrações (necessário para 'migrate deploy')
COPY --from=builder /app/prisma/migrations ./prisma/migrations

# Expõe a porta que seu app usa (ajuste se for diferente)
EXPOSE 3001

# O seu CMD inteligente do exemplo anterior, mantido.
CMD ["sh", "-c", "\
  npx prisma generate && \
  if npx prisma migrate status >/dev/null 2>&1; then \
    npx prisma migrate deploy; \
  else \
    npx prisma db push; \
  fi && \
  node build/src/index.js \
"]