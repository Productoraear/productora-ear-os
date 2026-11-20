-- CONVERSIÓN CONCÉNTRICA (S-CLASS) · CATÁLOGO POLIMÓRFICO + DEMANDA DIFERIDA
-- ============================================================================
-- Fuente del DDL: `prisma/schema.prisma` (modelos `ServiceOffer` y
-- `LeadDeferredDemand` + dos campos de relación inversa en `providerProfile`).
-- No hay reescritura a mano de tipos: los tipos son los que Prisma 6 deriva
-- para `int`, `text`, `timestamptz(3)` y `jsonb`.
--
-- POR QUÉ NO HAY DROP NI BACKFILL:
--   · Se crean DOS tablas nuevas. Cero columnas eliminadas de tablas vivas.
--   · `providerProfile` no recibe columnas físicas: las relaciones inversas son
--     virtuales en Prisma (la FK vive en las tablas nuevas).
--   · `providerProfile.slug` (clave natural del multi-tenant) queda intacto.
--
-- Idempotencia (Coolify recrea contenedores y reejecuta migraciones):
--   CREATE TABLE/INDEX → IF NOT EXISTS · FK → DO $$ EXCEPTION duplicate_object.
--
-- Dinero = INTEGER en céntimos (35000 = 350,00 €). Cero `float` para precios.

-- CreateTable
CREATE TABLE IF NOT EXISTS "ServiceOffer" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "depositInCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "unitLabel" TEXT,
    "isAnchor" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "LeadDeferredDemand" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rawPrompt" TEXT NOT NULL,
    "promptFingerprint" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'STASHED',
    "anchorSessionId" TEXT,
    "presentedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadDeferredDemand_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_service_offer_code" ON "ServiceOffer"("providerId", "code");
CREATE INDEX IF NOT EXISTS "idx_service_offer_provider" ON "ServiceOffer"("providerId");
CREATE INDEX IF NOT EXISTS "idx_service_offer_category" ON "ServiceOffer"("category");

-- CreateIndex (idempotencia de turno: N repeticiones del mismo deseo = 1 fila)
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_deferred_demand_turn" ON "LeadDeferredDemand"("sessionId", "providerId", "category", "promptFingerprint");
CREATE INDEX IF NOT EXISTS "idx_deferred_demand_session" ON "LeadDeferredDemand"("sessionId");
CREATE INDEX IF NOT EXISTS "idx_deferred_demand_provider" ON "LeadDeferredDemand"("providerId");
CREATE INDEX IF NOT EXISTS "idx_deferred_demand_status" ON "LeadDeferredDemand"("status");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "ServiceOffer" ADD CONSTRAINT "ServiceOffer_providerId_fkey"
        FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "LeadDeferredDemand" ADD CONSTRAINT "LeadDeferredDemand_providerId_fkey"
        FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
