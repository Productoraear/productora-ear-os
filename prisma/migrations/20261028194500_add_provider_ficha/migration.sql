-- ════════════════════════════════════════════════════════════════════════════
-- W44 · PERSISTENCIA ACID DE FICHAS DE PROVEEDOR (PostgreSQL 16)
-- ════════════════════════════════════════════════════════════════════════════
-- DDL emitido por:
--   node ./node_modules/prisma/build/index.js migrate diff \
--     --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- No es una transcripción a mano: es el SQL que Prisma genera para el modelo
-- `ProviderFicha`. La PK natural es `key`, de modo que N upserts de la misma
-- ficha colapsan en 1 fila exacta (idempotencia ACID, §19).
-- ════════════════════════════════════════════════════════════════════════════

-- CreateTable
CREATE TABLE "ProviderFicha" (
    "key" TEXT NOT NULL,
    "vendorId" TEXT,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "province" TEXT,
    "municipality" TEXT,
    "phone" TEXT,
    "priceEur" DOUBLE PRECISION,
    "rating" DOUBLE PRECISION,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "completeness" INTEGER NOT NULL DEFAULT 0,
    "provenanceHash" TEXT NOT NULL,
    "htmlSha256" TEXT,
    "sources" TEXT[],
    "matchMode" TEXT,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderFicha_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "idx_provider_ficha_vendor" ON "ProviderFicha"("vendorId");

-- CreateIndex
CREATE INDEX "idx_provider_ficha_verified" ON "ProviderFicha"("verified");

-- CreateIndex
CREATE INDEX "idx_provider_ficha_province" ON "ProviderFicha"("province");
