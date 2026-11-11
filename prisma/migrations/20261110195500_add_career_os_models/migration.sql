-- W53_T01 - CAREER MANIFEST (PostgreSQL 16) - DDL EMITIDO POR MAQUINA
--
-- Fuente del DDL (NO transcrito a mano):
--   node scripts/create_career_os_migration.cjs
--   -> node ./node_modules/prisma/build/index.js migrate diff \
--        --from-empty --to-schema-datamodel <tmp> --script
-- El datamodel temporal se ensambla del propio prisma/schema.prisma:
--   · bloque `// CAREER OS — W53_T01` (12 modelos + 10 enums),
--   · `model artistProfile` base + relacion inversa careerProfile,
--   · `model MediaAsset` base (destino de la FK de Track).
--
-- POR QUE NO HAY DROP: la identidad del artista sigue en `artistProfile`.
-- `ArtistProfile` es una extension 1:1 mapeada a `career_artist_profile`
-- (@@map) y su PK es el id de artistProfile (FK ON DELETE CASCADE).
-- `MediaAsset` solo recibe una columna nullable + indice: cero destruccion.
--
-- Idempotencia (Coolify reejecuta migraciones en contenedores recreados):
--   CREATE TABLE/INDEX -> IF NOT EXISTS · ADD CONSTRAINT -> DO $$ EXCEPTION
--   duplicate_object THEN NULL.
-- CreateEnum
CREATE TYPE "CareerMetricSource" AS ENUM ('api', 'csv', 'manual', 'demo');

-- CreateEnum
CREATE TYPE "CareerConnectionStatus" AS ENUM ('not_connected', 'pending_oauth', 'live', 'error');

-- CreateEnum
CREATE TYPE "CareerTeamRole" AS ENUM ('ARTIST', 'MANAGER', 'LABEL', 'BOOKER', 'PR', 'LEGAL', 'ACCOUNTANT');

-- CreateEnum
CREATE TYPE "CareerReleaseType" AS ENUM ('SINGLE', 'EP', 'ALBUM', 'MIXTAPE', 'LIVE', 'COMPILATION');

-- CreateEnum
CREATE TYPE "CareerGigStatus" AS ENUM ('DRAFT', 'HOLD', 'CONFIRMED', 'PLAYED', 'SETTLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CareerContractStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CareerCampaignChannel" AS ENUM ('ORGANIC', 'EMAIL', 'PAID_SOCIAL', 'RADIO', 'PRESS', 'TICKETING');

-- CreateEnum
CREATE TYPE "CareerCampaignStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'FINISHED');

-- CreateEnum
CREATE TYPE "CareerFanConsent" AS ENUM ('unknown', 'granted', 'revoked');

-- CreateEnum
CREATE TYPE "CareerPostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
-- "artistProfile" ya existe (0_baseline): sin CREATE en esta migración.

-- CreateTable
-- "MediaAsset" ya existe (0_baseline): sin CREATE en esta migración.

-- CreateTable
CREATE TABLE IF NOT EXISTS "career_artist_profile" (
    "id" TEXT NOT NULL,
    "territory" TEXT NOT NULL DEFAULT 'ES',
    "activeSince" INTEGER,
    "isni" TEXT,
    "proAffiliation" TEXT,
    "ipiCae" TEXT,
    "primaryGenre" TEXT,
    "baseFeeCents" INTEGER,
    "careerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "career_artist_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "PlatformConnection" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "platformId" TEXT NOT NULL,
    "status" "CareerConnectionStatus" NOT NULL DEFAULT 'not_connected',
    "encryptedToken" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "MetricSnapshot" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "connectionId" TEXT,
    "metric" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "source" "CareerMetricSource" NOT NULL DEFAULT 'demo',
    "provenanceHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Release" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "title" TEXT NOT NULL,
    "upc" TEXT,
    "type" "CareerReleaseType" NOT NULL DEFAULT 'SINGLE',
    "releaseDate" TIMESTAMP(3),
    "coverUrl" TEXT,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Release_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Track" (
    "id" TEXT NOT NULL,
    "releaseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isrc" TEXT,
    "iswc" TEXT,
    "trackNumber" INTEGER NOT NULL DEFAULT 1,
    "durationSec" INTEGER NOT NULL,
    "splitsJson" JSONB,
    "mediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "TeamMember" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "role" "CareerTeamRole" NOT NULL DEFAULT 'MANAGER',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "commissionBp" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Gig" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "venue" TEXT NOT NULL,
    "city" TEXT,
    "province" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "status" "CareerGigStatus" NOT NULL DEFAULT 'DRAFT',
    "feeCents" INTEGER NOT NULL DEFAULT 0,
    "kmRateCents" INTEGER,
    "distanceKm" INTEGER,
    "hotelCents" INTEGER NOT NULL DEFAULT 0,
    "depositCents" INTEGER NOT NULL DEFAULT 0,
    "stripeSessionId" TEXT,
    "pax" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Contract" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "gigId" TEXT,
    "title" TEXT NOT NULL,
    "counterparty" TEXT,
    "status" "CareerContractStatus" NOT NULL DEFAULT 'DRAFT',
    "amountCents" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "signedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "documentUrl" TEXT,
    "documentSha256" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "RoyaltyStatement" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "sourcePlatform" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "grossCents" INTEGER NOT NULL DEFAULT 0,
    "taxWithheldCents" INTEGER NOT NULL DEFAULT 0,
    "netCents" INTEGER NOT NULL DEFAULT 0,
    "artistShareCents" INTEGER NOT NULL DEFAULT 0,
    "platformShareCents" INTEGER NOT NULL DEFAULT 0,
    "vimumeShareCents" INTEGER NOT NULL DEFAULT 0,
    "statementSha256" TEXT,
    "statementUrl" TEXT,
    "receivedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoyaltyStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "Campaign" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "releaseId" TEXT,
    "name" TEXT NOT NULL,
    "channel" "CareerCampaignChannel" NOT NULL DEFAULT 'ORGANIC',
    "status" "CareerCampaignStatus" NOT NULL DEFAULT 'PLANNED',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "budgetCents" INTEGER NOT NULL DEFAULT 0,
    "spendCents" INTEGER NOT NULL DEFAULT 0,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "FanContact" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "displayName" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'ES',
    "consent" "CareerFanConsent" NOT NULL DEFAULT 'unknown',
    "consentAt" TIMESTAMP(3),
    "source" TEXT NOT NULL DEFAULT 'manual',
    "tags" JSONB,
    "lastSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FanContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ContentPost" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "careerProfileId" TEXT,
    "platformId" TEXT,
    "title" TEXT,
    "body" TEXT NOT NULL,
    "status" "CareerPostStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "publishedUrl" TEXT,
    "mediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"artistProfile_userId_key" ON "artistProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"artistProfile_slug_key" ON "artistProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"career_artist_profile_isni_key" ON "career_artist_profile"("isni");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_connection_career_profile" ON "PlatformConnection"("careerProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_connection_status" ON "PlatformConnection"("status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"PlatformConnection_artistId_platformId_key" ON "PlatformConnection"("artistId", "platformId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_metric_artist_platform_metric_at" ON "MetricSnapshot"("artistId", "platformId", "metric", "capturedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_metric_connection" ON "MetricSnapshot"("connectionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_metric_captured" ON "MetricSnapshot"("capturedAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_release_artist_date" ON "Release"("artistId", "releaseDate");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_release_career_profile" ON "Release"("careerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"Release_artistId_upc_key" ON "Release"("artistId", "upc");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_track_isrc" ON "Track"("isrc");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_track_iswc" ON "Track"("iswc");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_track_media" ON "Track"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"Track_releaseId_trackNumber_key" ON "Track"("releaseId", "trackNumber");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_team_artist_role" ON "TeamMember"("artistId", "role");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_team_career_profile" ON "TeamMember"("careerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"Gig_stripeSessionId_key" ON "Gig"("stripeSessionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_gig_artist_date" ON "Gig"("artistId", "eventDate");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_gig_status" ON "Gig"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_gig_career_profile" ON "Gig"("careerProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_contract_artist_status" ON "Contract"("artistId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_contract_gig" ON "Contract"("gigId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_contract_career_profile" ON "Contract"("careerProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_royalty_artist_period" ON "RoyaltyStatement"("artistId", "periodEnd");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_royalty_career_profile" ON "RoyaltyStatement"("careerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"RoyaltyStatement_artistId_sourcePlatform_periodStart_period_key" ON "RoyaltyStatement"("artistId", "sourcePlatform", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_campaign_artist_status" ON "Campaign"("artistId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_campaign_release" ON "Campaign"("releaseId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_campaign_career_profile" ON "Campaign"("careerProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_fan_artist_consent" ON "FanContact"("artistId", "consent");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_fan_career_profile" ON "FanContact"("careerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS"FanContact_artistId_email_key" ON "FanContact"("artistId", "email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_post_artist_status" ON "ContentPost"("artistId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_post_career_profile" ON "ContentPost"("careerProfileId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS"idx_post_media" ON "ContentPost"("mediaId");

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "career_artist_profile" ADD CONSTRAINT "career_artist_profile_id_fkey" FOREIGN KEY ("id") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "PlatformConnection" ADD CONSTRAINT "PlatformConnection_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "PlatformConnection" ADD CONSTRAINT "PlatformConnection_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "MetricSnapshot" ADD CONSTRAINT "MetricSnapshot_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "PlatformConnection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Release" ADD CONSTRAINT "Release_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Release" ADD CONSTRAINT "Release_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Track" ADD CONSTRAINT "Track_releaseId_fkey" FOREIGN KEY ("releaseId") REFERENCES "Release"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Track" ADD CONSTRAINT "Track_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Gig" ADD CONSTRAINT "Gig_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Gig" ADD CONSTRAINT "Gig_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Contract" ADD CONSTRAINT "Contract_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Contract" ADD CONSTRAINT "Contract_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "RoyaltyStatement" ADD CONSTRAINT "RoyaltyStatement_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "RoyaltyStatement" ADD CONSTRAINT "RoyaltyStatement_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "FanContact" ADD CONSTRAINT "FanContact_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "FanContact" ADD CONSTRAINT "FanContact_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_careerProfileId_fkey" FOREIGN KEY ("careerProfileId") REFERENCES "career_artist_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
