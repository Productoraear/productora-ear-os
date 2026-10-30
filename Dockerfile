FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Desactivar telemetría y descargas pesadas innecesarias en CI (Puppeteer/Playwright Chromium)
ENV NEXT_TELEMETRY_DISABLED=1 \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    NEXT_CPU_COUNT=1 \
    NODE_OPTIONS="--max-old-space-size=2048"

# 1. Builder con dependencias completas para compilar Next.js y Tailwind
FROM base AS builder
ENV NODE_ENV=development \
    NEXT_CPU_COUNT=1 \
    NODE_OPTIONS="--max-old-space-size=2048"
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --include=dev --legacy-peer-deps --no-audit

COPY . .

ENV NODE_ENV=production
RUN ./node_modules/.bin/prisma generate || npx prisma generate || true
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# 2. Production runner ultraligero
FROM node:22-alpine AS runner
WORKDIR /app

# Sello de procedencia: el CI pasa el SHA del commit como build-arg y /api/health
# lo devuelve. Es el unico dato que permite probar que produccion sirve el commit
# construido (un deploy que no se ejecuta ya no puede pasar por verde).
ARG EAR_BUILD_SHA=unknown
ARG EAR_BUILD_TIME=unknown

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    EAR_BUILD_SHA=${EAR_BUILD_SHA} \
    EAR_BUILD_TIME=${EAR_BUILD_TIME}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ω MIGRACIONES EN ARRANQUE: schema + migraciones + CLI de Prisma.
# Sin esto el runner standalone no puede aplicar `_add_outreach_models` y el
# puente Harvey -> EAR OS devuelve 503 'table does not exist' para siempre.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --chown=nextjs:nodejs docker-entrypoint.cjs ./docker-entrypoint.cjs

USER nextjs

EXPOSE 3000

CMD ["node", "docker-entrypoint.cjs"]

