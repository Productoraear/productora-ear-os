-- OUTREACH Ω — tablas del puente Harvey → EAR OS.
--
-- Aditivo puro: crea un enum y dos tablas nuevas. No toca ninguna tabla
-- existente ni ningún dato.
--
-- Dos formas de aplicarlo, elige UNA:
--   1) `npx prisma db push` (lo deduce de prisma/schema.prisma; es lo que ya
--      usa el proyecto, no hay carpeta prisma/migrations).
--   2) Pegar este SQL en el editor SQL de Supabase/Coolify.
--
-- Sin esto, POST /api/outreach/intake responde 500 (la tabla no existe) y el
-- puente no puede entregar ni un prospecto.

CREATE TYPE "OutreachStatus" AS ENUM (
    'NEW', 'CONTACTED', 'REPLIED', 'MEETING', 'WON', 'LOST', 'OPTED_OUT'
);

CREATE TABLE "OutreachProspect" (
    "id"          TEXT NOT NULL,
    "externalId"  TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "domain"      TEXT,
    "contactName" TEXT,
    "contactRole" TEXT,
    "email"       TEXT NOT NULL,
    "city"        TEXT,
    "country"     TEXT NOT NULL DEFAULT 'ES',
    "source"      TEXT NOT NULL DEFAULT 'harvey',
    "campaign"    TEXT,
    "status"      "OutreachStatus" NOT NULL DEFAULT 'NEW',
    "score"       INTEGER NOT NULL DEFAULT 0,
    "lastReplyAt" TIMESTAMP(3),
    "meetingAt"   TIMESTAMP(3),
    "rawSnapshot" JSONB,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OutreachProspect_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutreachThread" (
    "id"             TEXT NOT NULL,
    "prospectId"     TEXT NOT NULL,
    "externalId"     TEXT NOT NULL,
    "direction"      TEXT NOT NULL,
    "subject"        TEXT,
    "body"           TEXT NOT NULL,
    "classification" TEXT,
    "sentAt"         TIMESTAMP(3),
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutreachThread_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OutreachProspect_externalId_key" ON "OutreachProspect"("externalId");
CREATE UNIQUE INDEX "OutreachProspect_email_key"      ON "OutreachProspect"("email");
CREATE INDEX "idx_outreach_prospect_status"           ON "OutreachProspect"("status");
CREATE INDEX "idx_outreach_prospect_domain"           ON "OutreachProspect"("domain");
CREATE INDEX "idx_outreach_prospect_campaign"         ON "OutreachProspect"("campaign");

CREATE UNIQUE INDEX "OutreachThread_externalId_key" ON "OutreachThread"("externalId");
CREATE INDEX "idx_outreach_thread_prospect"  ON "OutreachThread"("prospectId", "createdAt");
CREATE INDEX "idx_outreach_thread_direction" ON "OutreachThread"("direction");

ALTER TABLE "OutreachThread"
    ADD CONSTRAINT "OutreachThread_prospectId_fkey"
    FOREIGN KEY ("prospectId") REFERENCES "OutreachProspect"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
