-- 🏛️ TALENT OS: DATABASE SCHEMA (V1.0.0)
-- Vertical Artistas: El Metal de la Soberanía
-- Project: Productora EAR / EAR OS V2

-- 1. EXTENSIONS (Ensure RLS and UUIDs are ready)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Table: artists_profiles
-- Heart of the Talent OS. Linked to ear_users for Auth/Sovereignty.
CREATE TABLE IF NOT EXISTS public.artists_profiles (
    id UUID PRIMARY KEY REFERENCES public.ear_users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    genres TEXT[] DEFAULT '{}',
    media_kit_url TEXT, -- Link to storage
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    social_links JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: technical_riders
-- Technical requirements and hospitality needs.
CREATE TABLE IF NOT EXISTS public.technical_riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES public.artists_profiles(id) ON DELETE CASCADE,
    version INT DEFAULT 1,
    content_url TEXT, -- Link to PDF/Asset in Storage
    requirements JSONB DEFAULT '{}', -- Structural requirements (Inputs, Monitors, etc.)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: smart_contracts (Booking Ledger)
-- High-fidelity record of every commercial agreement.
CREATE TABLE IF NOT EXISTS public.smart_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES public.artists_profiles(id),
    client_id UUID NOT NULL REFERENCES public.ear_users(id),
    event_date DATE NOT NULL,
    total_amount NUMERIC(10, 2),
    deposit_amount NUMERIC(10, 2) DEFAULT 1.00, -- The "1€ Trigger"
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RESERVED', 'SIGNED', 'PAID', 'CANCELLED', 'EXECUTED')),
    ledger_id TEXT, -- Reference to ear_commission_ledger
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: calendar_blocks
-- Real-time availability engine.
CREATE TABLE IF NOT EXISTS public.calendar_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID NOT NULL REFERENCES public.artists_profiles(id) ON DELETE CASCADE,
    block_date DATE NOT NULL,
    reason TEXT DEFAULT 'BOOKING' CHECK (reason IN ('BOOKING', 'PERSONAL', 'EXTERNAL', 'MAINTENANCE')),
    contract_id UUID REFERENCES public.smart_contracts(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(artist_id, block_date)
);

-- 3. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.artists_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_blocks ENABLE ROW LEVEL SECURITY;

-- 🛡️ Artists Profiles Policies
-- Public can view published artists.
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.artists_profiles FOR SELECT 
USING (status = 'PUBLISHED');

-- Artists can update their own profile.
CREATE POLICY "Artists can manage their own profile" 
ON public.artists_profiles FOR ALL 
USING (auth.uid() = id);

-- 🛡️ Technical Riders Policies
-- Artists can manage their own riders.
CREATE POLICY "Artists can manage their own riders" 
ON public.technical_riders FOR ALL 
USING (auth.uid() = artist_id);

-- 🛡️ Smart Contracts Policies
-- Artists can view their incoming contracts.
CREATE POLICY "Artists can view their contracts" 
ON public.smart_contracts FOR SELECT 
USING (auth.uid() = artist_id);

-- Clients can view their outgoing contracts.
CREATE POLICY "Clients can view their contracts" 
ON public.smart_contracts FOR SELECT 
USING (auth.uid() = client_id);

-- 🛡️ Calendar Blocks Policies
-- Public can view availability.
CREATE POLICY "Public can view availability" 
ON public.calendar_blocks FOR SELECT 
USING (true);

-- Artists can manage their own blocks.
CREATE POLICY "Artists can manage their own blocks" 
ON public.calendar_blocks FOR ALL 
USING (auth.uid() = artist_id);

-- 4. TRIGGERS (Auto-updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artists_profiles_modtime
    BEFORE UPDATE ON public.artists_profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_smart_contracts_modtime
    BEFORE UPDATE ON public.smart_contracts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
