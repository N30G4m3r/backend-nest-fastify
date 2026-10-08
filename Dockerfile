# Base Stage: Configura Node 24 alpine y pnpm
FROM node:24-alpine AS base
WORKDIR /app

# Instalar pnpm habilitando corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar manifiestos de dependencias
COPY package.json pnpm-lock.yaml ./

# -------------------------------------------------------------
# Development Stage: Instala todas las dependencias para hot-reload
# -------------------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile

# Copiar el resto del código
COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "start:dev"]

# -------------------------------------------------------------
# Builder Stage: Compila TypeScript a JavaScript (dist/)
# -------------------------------------------------------------
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# -------------------------------------------------------------
# Production Stage: Imagen final limpia y ligera
# -------------------------------------------------------------
FROM node:24-alpine AS production
WORKDIR /app

# Instalar wget/curl si no estuvieran disponibles para el healthcheck (alpine incluye wget por defecto)
RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
# Instalar únicamente dependencias de producción
RUN pnpm install --prod --frozen-lockfile

# Copiar los artefactos compilados desde la etapa builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
