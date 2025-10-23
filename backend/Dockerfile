# --------------------------
# Stage 1: Build
# --------------------------
FROM node:lts AS builder
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala TODAS as dependências (prod + dev)
RUN npm ci

# Copia todo o código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila TypeScript
RUN npm run build

# --------------------------
# Stage 2: Runtime / produção
# --------------------------
FROM node:lts
WORKDIR /app

# Copia apenas package.json e package-lock.json
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Copia build e Prisma Client do stage anterior
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma

# Expõe porta
EXPOSE 3001

# Comando de execução ajustado
CMD ["sh", "-c", "\
  npx prisma generate && \
  if npx prisma migrate status >/dev/null 2>&1; then \
    npx prisma migrate deploy; \
  else \
    npx prisma db push; \
  fi && \
  node build/index.js \
"]
