-- W46 - FICHA EDITABLE POR PROVEEDOR (380 campos/categoria) - PostgreSQL 16
-- DDL EMITIDO POR MAQUINA, no transcrito a mano:
--   node ./node_modules/prisma/build/index.js migrate diff \
--     --from-empty --to-schema-datamodel prisma/_tmp_provider_profile.prisma --script
-- El schema temporal replicaba EXACTAMENTE los modelos ProviderProfileField,
-- ProviderPaymentMethod y ProviderPaymentRequestLog de prisma/schema.prisma,
-- de modo que este SQL es el que Prisma emitiria para ellos (idempotencia ACID
-- via UNIQUE [providerSlug, fieldKey] y [providerSlug, kind]).

-- CreateTable
CREATE TABLE "ProviderProfileField" (
    "id" TEXT NOT NULL,
    "providerSlug" TEXT NOT NULL,
    "fieldKey" TEXT NOT NULL,
    "valueText" TEXT NOT NULL,
    "category" TEXT,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderProfileField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPaymentMethod" (
    "id" TEXT NOT NULL,
    "providerSlug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "holder" TEXT,
    "reference" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "requiresLeadCapture" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPaymentRequestLog" (
    "id" TEXT NOT NULL,
    "providerSlug" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "methodKinds" TEXT NOT NULL,
    "eventDate" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'ficha',
    "deliveredN8n" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderPaymentRequestLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_provider_field_slug" ON "ProviderProfileField"("providerSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfileField_providerSlug_fieldKey_key" ON "ProviderProfileField"("providerSlug", "fieldKey");

-- CreateIndex
CREATE INDEX "idx_provider_payment_slug" ON "ProviderPaymentMethod"("providerSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderPaymentMethod_providerSlug_kind_key" ON "ProviderPaymentMethod"("providerSlug", "kind");

-- CreateIndex
CREATE INDEX "idx_payment_request_slug" ON "ProviderPaymentRequestLog"("providerSlug");

-- CreateIndex
CREATE INDEX "idx_payment_request_created" ON "ProviderPaymentRequestLog"("createdAt");

