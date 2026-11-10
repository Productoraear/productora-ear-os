-- F-6 - PERSISTENCIA DURADERA DE TELEMETRIA "DIA D" (PostgreSQL 16)
-- DDL EMITIDO POR MAQUINA, no transcrito a mano:
--   node ./node_modules/prisma/build/index.js migrate diff \
--     --from-empty --to-schema-datamodel prisma/_tmp_live_telemetry.prisma --script
-- El schema temporal replicaba EXACTAMENTE el modelo LiveTelemetryPing de
-- prisma/schema.prisma. Se anade IF NOT EXISTS para idempotencia del deploy
-- (Coolify reejecuta migraciones en contenedores recreados sin perder datos).
--
-- MOTIVO (INV-16 / AF-1): la ruta /api/telemetry/[id] almacenaba los pings en
-- globalThis.__earTelemetry (memoria del proceso). Un redeploy del contenedor
-- vaciaba el rastro GPS y /seguimiento/[id] mostraba "Sin senal aun" durante
-- una prueba de concepto comercial transaccional en vivo.

-- CreateTable
CREATE TABLE IF NOT EXISTS "LiveTelemetryPing" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'live',
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveTelemetryPing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LiveTelemetryPing_missionId_capturedAt_idx" ON "LiveTelemetryPing"("missionId", "capturedAt" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LiveTelemetryPing_createdAt_idx" ON "LiveTelemetryPing"("createdAt");
