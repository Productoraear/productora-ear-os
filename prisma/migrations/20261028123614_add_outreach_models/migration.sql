-- W42_MAR_NET_03 / OUTREACH OMEGA
-- Delta puramente aditivo generado con:\n-- prisma migrate diff --from-schema-datamodel <schema HEAD> --to-schema-datamodel prisma/schema.prisma --script
-- Motivo: el puente Harvey -> EAR OS (src/app/api/outreach/intake/route.ts) escribe en
-- OutreachProspect/OutreachThread; sin esta migracion aplicada la ruta responde 500.

-- CreateEnum
CREATE TYPE "OutreachStatus" AS ENUM ('NEW', 'CONTACTED', 'REPLIED', 'MEETING', 'WON', 'LOST', 'OPTED_OUT');

-- CreateTable
CREATE TABLE "OutreachProspect" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "domain" TEXT,
    "contactName" TEXT,
    "contactRole" TEXT,
    "email" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'ES',
    "source" TEXT NOT NULL DEFAULT 'harvey',
    "campaign" TEXT,
    "status" "OutreachStatus" NOT NULL DEFAULT 'NEW',
    "score" INTEGER NOT NULL DEFAULT 0,
    "lastReplyAt" TIMESTAMP(3),
    "meetingAt" TIMESTAMP(3),
    "rawSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachProspect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutreachThread" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "classification" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachThread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutreachProspect_externalId_key" ON "OutreachProspect"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "OutreachProspect_email_key" ON "OutreachProspect"("email");

-- CreateIndex
CREATE INDEX "idx_outreach_prospect_status" ON "OutreachProspect"("status");

-- CreateIndex
CREATE INDEX "idx_outreach_prospect_domain" ON "OutreachProspect"("domain");

-- CreateIndex
CREATE INDEX "idx_outreach_prospect_campaign" ON "OutreachProspect"("campaign");

-- CreateIndex
CREATE UNIQUE INDEX "OutreachThread_externalId_key" ON "OutreachThread"("externalId");

-- CreateIndex
CREATE INDEX "idx_outreach_thread_prospect" ON "OutreachThread"("prospectId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_outreach_thread_direction" ON "OutreachThread"("direction");

-- AddForeignKey
ALTER TABLE "OutreachThread" ADD CONSTRAINT "OutreachThread_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "OutreachProspect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

