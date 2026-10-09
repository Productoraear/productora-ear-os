-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ARTIST', 'USER', 'COMMANDER', 'ARQUITECTO', 'FLEET_OPERATOR', 'OPERADOR', 'PROVIDER', 'EXPLORADOR', 'CLIENT', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "WaybillStatus" AS ENUM ('PENDING', 'QUEUED', 'DISPATCHED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WaybillParticipantRole" AS ENUM ('DRIVER', 'ARTIST', 'CLIENT', 'MANAGER');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'APPROVED');

-- CreateEnum
CREATE TYPE "AffiliateTier" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('GHOST_UNCLAIMED', 'CLAIMED_PENDING_VERIFICATION', 'VERIFIED_ACTIVE');

-- CreateEnum
CREATE TYPE "VendorCategory" AS ENUM ('FINCA_ALQUILER', 'CATERING', 'DJ_DISCOMOVIL', 'BARRA_LIBRE', 'FOTOGRAFIA_VIDEO', 'FLORISTERIA', 'TRANSPORTE_AUTOBUS', 'DECORACION_ILUMINACION');

-- CreateEnum
CREATE TYPE "SmartLockStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE_LOCKED', 'EXPIRED_WALLET', 'EXPIRED_EXTENDED', 'CONVERTED_CONTRACT', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "displayName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "rank" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "artistProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slug" TEXT,
    "stageName" TEXT,
    "displayName" TEXT,
    "bio" TEXT,
    "status" TEXT DEFAULT 'PUBLISHED',
    "genres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artistProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicalRider" (
    "id" TEXT NOT NULL,
    "artistProfileId" TEXT,
    "artistId" TEXT,
    "title" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technicalRider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auraWallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "walletAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auraWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissionLedger" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "sourceEvent" TEXT,
    "description" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "affiliateId" TEXT,

    CONSTRAINT "commissionLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "smartContract" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "artistId" TEXT,
    "userId" TEXT,
    "clientProfileId" TEXT,
    "workspaceId" TEXT,
    "stripeSessionId" TEXT,
    "deposit" DOUBLE PRECISION,
    "contractTerms" TEXT,
    "signedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "smartContract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waybill" (
    "id" TEXT NOT NULL,
    "referenceCode" TEXT,
    "bookingId" TEXT,
    "status" "WaybillStatus" NOT NULL DEFAULT 'PENDING',
    "originLabel" TEXT,
    "originLat" DOUBLE PRECISION,
    "originLng" DOUBLE PRECISION,
    "destinationLabel" TEXT,
    "destination" TEXT,
    "destinationLat" DOUBLE PRECISION,
    "destinationLng" DOUBLE PRECISION,
    "distanceMeters" DOUBLE PRECISION,
    "startsAt" TIMESTAMP(3),
    "notes" TEXT,
    "artistProfileId" TEXT,
    "providerProfileId" TEXT,
    "clientProfileId" TEXT,
    "unitId" TEXT,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waybill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaybillItem" (
    "id" TEXT NOT NULL,
    "waybillId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WaybillItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "providerProfile" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT,
    "companyName" TEXT DEFAULT '',
    "category" "VendorCategory" NOT NULL DEFAULT 'FINCA_ALQUILER',
    "city" TEXT,
    "location" TEXT,
    "province" TEXT DEFAULT 'Madrid / Toledo',
    "phone" TEXT,
    "email" TEXT,
    "userId" TEXT,
    "stripeAccountId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "roiGuaranteeScore" DOUBLE PRECISION DEFAULT 0.0,
    "roiProjected" DOUBLE PRECISION DEFAULT 0.0,
    "technicalReliability" DOUBLE PRECISION DEFAULT 0.0,
    "auraLevel" DOUBLE PRECISION DEFAULT 0.0,
    "claimStatus" "ClaimStatus" NOT NULL DEFAULT 'GHOST_UNCLAIMED',
    "claimToken" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 500.0,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCalibration" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "presetSlug" TEXT NOT NULL DEFAULT 'cortijo-rural',
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "completionPercent" INTEGER NOT NULL DEFAULT 0,
    "calibratedBy" TEXT NOT NULL DEFAULT 'self',
    "lastModifiedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderCalibration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sizeBytes" DOUBLE PRECISION NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderQuota" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'FREE',
    "maxStorageMB" INTEGER NOT NULL DEFAULT 15,
    "currentStorageBytes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxPhotos" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "ProviderQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechnicalRider" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "powerRequirementWatts" INTEGER NOT NULL DEFAULT 3000,
    "mixerModel" TEXT NOT NULL DEFAULT 'Behringer XR18',
    "micSystem" TEXT NOT NULL DEFAULT 'Shure Axient Digital',
    "paSpeakers" TEXT NOT NULL DEFAULT 'Bose F1 Model 812',

    CONSTRAINT "TechnicalRider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPackage" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "servicesIncluded" TEXT NOT NULL,

    CONSTRAINT "ProviderPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderAuditLog" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "snapshotHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fleetUnit" (
    "id" TEXT NOT NULL,
    "unitCode" TEXT,
    "code" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDLE',
    "currentLocation" TEXT,
    "workspaceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fleetUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fleetTelemetryEvent" (
    "id" TEXT NOT NULL,
    "unitId" TEXT,
    "eventData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fleetTelemetryEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetPosition" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventType" TEXT NOT NULL DEFAULT 'WEDDING',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "totalBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "clientEmail" TEXT,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "location" TEXT,
    "guestCount" INTEGER NOT NULL DEFAULT 100,
    "serviceLines" JSONB NOT NULL DEFAULT '[]',
    "stakeholders" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendarBlock" (
    "id" TEXT NOT NULL,
    "artistProfileId" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendarBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorShadowProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "claimToken" TEXT NOT NULL,
    "claimedById" TEXT,
    "description" TEXT,
    "imageUrls" TEXT[],
    "municipality" TEXT,
    "priceRange" TEXT,
    "province" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviewsCount" INTEGER,
    "shaHash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'GHOST_UNCLAIMED',
    "telephone" TEXT,

    CONSTRAINT "VendorShadowProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentInventory" (
    "id" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "suitableForPax" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentInventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SmartLock" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ipAddress" TEXT,
    "vertical" TEXT NOT NULL,
    "intentSlug" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripePaymentIntent" TEXT,
    "amountCents" INTEGER NOT NULL DEFAULT 1000,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "SmartLockStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "lockedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "walletBalance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "walletExpiresAt" TIMESTAMP(3),
    "urgencyBypassed" BOOLEAN NOT NULL DEFAULT false,
    "recoveryEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "contractConverted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmartLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadMagnetLog" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "vertical" TEXT,
    "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMagnetLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "totalBudget" DOUBLE PRECISION NOT NULL DEFAULT 250000,
    "finalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budget_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimatedCost" DOUBLE PRECISION NOT NULL,
    "finalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL,
    "icon" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "budgetId" TEXT NOT NULL,

    CONSTRAINT "budget_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "vendorId" TEXT,
    "notes" TEXT,
    "budgetId" TEXT NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "expenseId" TEXT,
    "categoryId" TEXT,
    "budgetId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "category" TEXT,
    "notes" TEXT,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalRequest" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "aiConcepts" TEXT NOT NULL,
    "origin" TEXT NOT NULL DEFAULT 'manolo',
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "proposalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "clientProfileId" TEXT,
    "location" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'borrador',
    "taxPct" DOUBLE PRECISION NOT NULL,
    "discountPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "baseCents" INTEGER NOT NULL DEFAULT 0,
    "taxCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "costCents" INTEGER NOT NULL DEFAULT 0,
    "marginPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "validDays" INTEGER NOT NULL,
    "validUntil" TIMESTAMP(3),
    "eventDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "lostReason" TEXT,
    "repliedAt" TIMESTAMP(3),
    "replyText" TEXT,
    "signaturePng" TEXT,
    "signedAt" TIMESTAMP(3),
    "signatureIp" TEXT,
    "signatureDevice" TEXT,
    "lastAlertAt" TIMESTAMP(3),
    "templateId" TEXT,

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalLineItem" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "catalogItemId" TEXT,
    "providerId" TEXT,
    "chapter" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "manualPrice" BOOLEAN NOT NULL DEFAULT false,
    "marginPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "aiConfidence" DOUBLE PRECISION,
    "isYellow" BOOLEAN NOT NULL DEFAULT false,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isSelected" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "aiReason" TEXT,

    CONSTRAINT "ProposalLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalReadTelemetry" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitNumber" INTEGER NOT NULL DEFAULT 1,
    "section" TEXT,
    "durationSeconds" INTEGER,
    "ip" TEXT,
    "city" TEXT,
    "country" TEXT,
    "device" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalReadTelemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMTask" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "executeAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "subject" TEXT NOT NULL,
    "bodyText" TEXT NOT NULL,
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "CRMTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProposalActivityTimeline" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT,
    "type" TEXT NOT NULL,
    "metaJson" TEXT NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProposalActivityTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNotification" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPulse" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "version" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminPulse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "affiliateCode" TEXT NOT NULL,
    "companyName" TEXT,
    "cifNif" TEXT,
    "phone" TEXT,
    "category" TEXT NOT NULL DEFAULT 'PRESCRIPTOR',
    "payoutMethod" TEXT NOT NULL DEFAULT 'IBAN',
    "payoutDetails" TEXT,
    "tier" "AffiliateTier" NOT NULL DEFAULT 'BRONZE',
    "commissionRate" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "isHomologated" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "totalSalesGenerated" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffiliateReferral" (
    "id" TEXT NOT NULL,
    "affiliateId" TEXT,
    "referrerId" TEXT,
    "referralCode" TEXT NOT NULL,
    "landingUrl" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "source" TEXT NOT NULL DEFAULT 'ORGANIC',
    "status" TEXT NOT NULL DEFAULT 'REGISTERED',
    "attributedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "convertedAt" TIMESTAMP(3),
    "conversionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commissionDue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bookingReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AffiliateReferral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "affiliateId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "payoutMethod" TEXT NOT NULL DEFAULT 'IBAN',
    "payoutDetails" TEXT,
    "kycRequired" BOOLEAN NOT NULL DEFAULT false,
    "scheduledFor" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "artistProfile_userId_key" ON "artistProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "artistProfile_slug_key" ON "artistProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technicalRider_artistProfileId_version_key" ON "technicalRider"("artistProfileId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "technicalRider_artistId_version_key" ON "technicalRider"("artistId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "clientProfile_userId_key" ON "clientProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "auraWallet_userId_key" ON "auraWallet"("userId");

-- CreateIndex
CREATE INDEX "idx_wallet_user" ON "auraWallet"("userId");

-- CreateIndex
CREATE INDEX "idx_transaction_wallet" ON "Transaction"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "commissionLedger_reference_key" ON "commissionLedger"("reference");

-- CreateIndex
CREATE INDEX "idx_ledger_user" ON "commissionLedger"("userId");

-- CreateIndex
CREATE INDEX "idx_ledger_affiliate" ON "commissionLedger"("affiliateId");

-- CreateIndex
CREATE INDEX "idx_ledger_status" ON "commissionLedger"("status");

-- CreateIndex
CREATE UNIQUE INDEX "waybill_referenceCode_key" ON "waybill"("referenceCode");

-- CreateIndex
CREATE INDEX "idx_waybill_item" ON "WaybillItem"("waybillId");

-- CreateIndex
CREATE UNIQUE INDEX "providerProfile_slug_key" ON "providerProfile"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "providerProfile_name_key" ON "providerProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "providerProfile_userId_key" ON "providerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "providerProfile_claimToken_key" ON "providerProfile"("claimToken");

-- CreateIndex
CREATE INDEX "idx_provider_category" ON "providerProfile"("category");

-- CreateIndex
CREATE INDEX "idx_provider_cat_rating" ON "providerProfile"("category", "rating" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderCalibration_providerId_key" ON "ProviderCalibration"("providerId");

-- CreateIndex
CREATE INDEX "idx_calibrator_provider" ON "ProviderCalibration"("providerId");

-- CreateIndex
CREATE INDEX "idx_media_provider" ON "MediaAsset"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderQuota_providerId_key" ON "ProviderQuota"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "TechnicalRider_providerId_key" ON "TechnicalRider"("providerId");

-- CreateIndex
CREATE INDEX "idx_package_provider" ON "ProviderPackage"("providerId");

-- CreateIndex
CREATE INDEX "idx_audit_provider" ON "ProviderAuditLog"("providerId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_slug_key" ON "workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "fleetUnit_unitCode_key" ON "fleetUnit"("unitCode");

-- CreateIndex
CREATE UNIQUE INDEX "fleetUnit_code_key" ON "fleetUnit"("code");

-- CreateIndex
CREATE INDEX "FleetPosition_unitId_timestamp_idx" ON "FleetPosition"("unitId", "timestamp" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "VendorShadowProfile_claimToken_key" ON "VendorShadowProfile"("claimToken");

-- CreateIndex
CREATE UNIQUE INDEX "VendorShadowProfile_shaHash_key" ON "VendorShadowProfile"("shaHash");

-- CreateIndex
CREATE INDEX "idx_vendor_shadow_prov_cat" ON "VendorShadowProfile"("province", "category");

-- CreateIndex
CREATE INDEX "idx_vendor_shadow_claim_token" ON "VendorShadowProfile"("claimToken");

-- CreateIndex
CREATE INDEX "idx_vendor_shadow_telephone" ON "VendorShadowProfile"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "EquipmentInventory_serialNumber_key" ON "EquipmentInventory"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SmartLock_stripeSessionId_key" ON "SmartLock"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "SmartLock_stripePaymentIntent_key" ON "SmartLock"("stripePaymentIntent");

-- CreateIndex
CREATE INDEX "idx_smartlock_email" ON "SmartLock"("email");

-- CreateIndex
CREATE INDEX "idx_smartlock_status" ON "SmartLock"("status");

-- CreateIndex
CREATE INDEX "idx_smartlock_stripe" ON "SmartLock"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LeadMagnetLog_email_key" ON "LeadMagnetLog"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeadMagnetLog_ipAddress_key" ON "LeadMagnetLog"("ipAddress");

-- CreateIndex
CREATE INDEX "budget_categories_budgetId_idx" ON "budget_categories"("budgetId");

-- CreateIndex
CREATE INDEX "expenses_categoryId_idx" ON "expenses"("categoryId");

-- CreateIndex
CREATE INDEX "expenses_budgetId_idx" ON "expenses"("budgetId");

-- CreateIndex
CREATE INDEX "payments_expenseId_idx" ON "payments"("expenseId");

-- CreateIndex
CREATE INDEX "payments_budgetId_idx" ON "payments"("budgetId");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_number_key" ON "Proposal"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Proposal_token_key" ON "Proposal"("token");

-- CreateIndex
CREATE INDEX "ProposalLineItem_proposalId_idx" ON "ProposalLineItem"("proposalId");

-- CreateIndex
CREATE INDEX "ProposalReadTelemetry_proposalId_idx" ON "ProposalReadTelemetry"("proposalId");

-- CreateIndex
CREATE INDEX "CRMTask_proposalId_idx" ON "CRMTask"("proposalId");

-- CreateIndex
CREATE INDEX "CRMTask_status_executeAt_idx" ON "CRMTask"("status", "executeAt");

-- CreateIndex
CREATE INDEX "ProposalActivityTimeline_proposalId_idx" ON "ProposalActivityTimeline"("proposalId");

-- CreateIndex
CREATE INDEX "AdminNotification_isRead_idx" ON "AdminNotification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProfile_userId_key" ON "AffiliateProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AffiliateProfile_affiliateCode_key" ON "AffiliateProfile"("affiliateCode");

-- CreateIndex
CREATE INDEX "idx_aff_code" ON "AffiliateProfile"("affiliateCode");

-- CreateIndex
CREATE INDEX "idx_aff_tier" ON "AffiliateProfile"("tier");

-- CreateIndex
CREATE INDEX "idx_ref_affiliate" ON "AffiliateReferral"("affiliateId");

-- CreateIndex
CREATE INDEX "idx_ref_referrer" ON "AffiliateReferral"("referrerId");

-- CreateIndex
CREATE INDEX "idx_ref_status" ON "AffiliateReferral"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_reference_key" ON "Payout"("reference");

-- CreateIndex
CREATE INDEX "idx_payout_user" ON "Payout"("userId");

-- CreateIndex
CREATE INDEX "idx_payout_affiliate" ON "Payout"("affiliateId");

-- CreateIndex
CREATE INDEX "idx_payout_status" ON "Payout"("status");

-- AddForeignKey
ALTER TABLE "artistProfile" ADD CONSTRAINT "artistProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicalRider" ADD CONSTRAINT "technicalRider_artistProfileId_fkey" FOREIGN KEY ("artistProfileId") REFERENCES "artistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientProfile" ADD CONSTRAINT "clientProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auraWallet" ADD CONSTRAINT "auraWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "auraWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissionLedger" ADD CONSTRAINT "commissionLedger_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissionLedger" ADD CONSTRAINT "commissionLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smartContract" ADD CONSTRAINT "smartContract_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "clientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "smartContract" ADD CONSTRAINT "smartContract_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waybill" ADD CONSTRAINT "waybill_artistProfileId_fkey" FOREIGN KEY ("artistProfileId") REFERENCES "artistProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waybill" ADD CONSTRAINT "waybill_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "clientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waybill" ADD CONSTRAINT "waybill_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "providerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waybill" ADD CONSTRAINT "waybill_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "fleetUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waybill" ADD CONSTRAINT "waybill_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaybillItem" ADD CONSTRAINT "WaybillItem_waybillId_fkey" FOREIGN KEY ("waybillId") REFERENCES "waybill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "providerProfile" ADD CONSTRAINT "providerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCalibration" ADD CONSTRAINT "ProviderCalibration_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderQuota" ADD CONSTRAINT "ProviderQuota_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechnicalRider" ADD CONSTRAINT "TechnicalRider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPackage" ADD CONSTRAINT "ProviderPackage_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderAuditLog" ADD CONSTRAINT "ProviderAuditLog_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fleetUnit" ADD CONSTRAINT "fleetUnit_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetPosition" ADD CONSTRAINT "FleetPosition_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "fleetUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_categories" ADD CONSTRAINT "budget_categories_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "budget_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalRequest" ADD CONSTRAINT "ProposalRequest_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "clientProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalLineItem" ADD CONSTRAINT "ProposalLineItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalReadTelemetry" ADD CONSTRAINT "ProposalReadTelemetry_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMTask" ADD CONSTRAINT "CRMTask_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalActivityTimeline" ADD CONSTRAINT "ProposalActivityTimeline_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNotification" ADD CONSTRAINT "AdminNotification_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateProfile" ADD CONSTRAINT "AffiliateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateReferral" ADD CONSTRAINT "AffiliateReferral_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffiliateReferral" ADD CONSTRAINT "AffiliateReferral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "AffiliateProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

