-- ==========================================
-- 🛰️ FLEET & LOGISTICS OS — DATABASE SCHEMA
-- Standard: S-Class Silicon Valley MVP
-- ==========================================

-- 1. WAYBILLS (Hojas de Ruta Operativas)
CREATE TABLE IF NOT EXISTS public.waybills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.users(id), -- Vinculado al Talent OS
  driver_id UUID REFERENCES public.users(id), -- El técnico/conductor asignado
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, IN_TRANSIT, ARRIVED, COMPLETED
  start_location_name TEXT,
  end_location_name TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. FLEET TELEMETRY (Rastreo Espacial Real-Time)
CREATE TABLE IF NOT EXISTS public.fleet_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waybill_id UUID REFERENCES public.waybills(id) ON DELETE CASCADE,
  device_id TEXT, -- ID del dispositivo del técnico
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  altitude DOUBLE PRECISION,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  status_signal TEXT DEFAULT 'ACTIVE', -- ACTIVE, LOST, CRITICAL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for spatial performance
CREATE INDEX idx_fleet_telemetry_waybill_id ON public.fleet_telemetry(waybill_id);
CREATE INDEX idx_fleet_telemetry_created_at ON public.fleet_telemetry(created_at DESC);

-- ==========================================
-- 🛡️ ROW LEVEL SECURITY (RLS) — FLEET OS
-- ==========================================

ALTER TABLE public.waybills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_telemetry ENABLE ROW LEVEL SECURITY;

-- Policy: Drivers can read their own assigned waybills
CREATE POLICY "drivers_read_own_waybills" ON public.waybills
FOR SELECT TO authenticated
USING (driver_id = auth.uid());

-- Policy: Drivers can insert telemetry for their own assigned waybills
CREATE POLICY "drivers_insert_own_telemetry" ON public.fleet_telemetry
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.waybills
    WHERE id = waybill_id AND driver_id = auth.uid()
  )
);

-- Policy: Commander / Admin can read everything (God Mode)
-- Assuming a role-based check via JWT claims or a 'users' table
CREATE POLICY "commander_all_fleet" ON public.waybills
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('ADMIN', 'COMMANDER')
  )
);

CREATE POLICY "commander_all_telemetry" ON public.fleet_telemetry
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('ADMIN', 'COMMANDER')
  )
);

-- ==========================================
-- 🛡️ STORAGE RLS POLICIES (TALENT OS REMEDIATION)
-- ==========================================

-- Activa RLS sobre storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- TECHNICAL RIDERS BUCKET
CREATE POLICY "technical_riders_all_own_folder"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'technical-riders'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'technical-riders'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- MEDIA KITS BUCKET
CREATE POLICY "media_kits_all_own_folder"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'media-kits'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'media-kits'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
