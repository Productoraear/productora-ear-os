-- ====================================================================
-- EAR OS V2.4 // AFFILIATE CORE & CLEARING HOUSE SCHEMA (100% STABLE)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    partner_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    contact_email TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('S_CLASS', 'TIER_1', 'TIER_2', 'AMBASSADOR')) DEFAULT 'TIER_1',
    commission_rate NUMERIC(5,4) NOT NULL DEFAULT 0.0800,
    lifetime_enabled BOOLEAN NOT NULL DEFAULT true,
    stripe_account_id TEXT,
    status TEXT CHECK (status IN ('active', 'suspended', 'pending_review')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    client_identifier_hash TEXT NOT NULL,
    event_base_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    commission_earned NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    status TEXT CHECK (status IN ('pending', 'converted', 'settled', 'clawback')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reference_code TEXT UNIQUE NOT NULL,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payout_status TEXT CHECK (payout_status IN ('scheduled', 'processing', 'processed', 'failed')) DEFAULT 'scheduled',
    stripe_transfer_id TEXT,
    execution_deadline TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin All Access Affiliates" ON public.affiliates FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Access Referrals" ON public.affiliate_referrals FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Access Payouts" ON public.affiliate_payouts FOR ALL TO authenticated USING (true);
