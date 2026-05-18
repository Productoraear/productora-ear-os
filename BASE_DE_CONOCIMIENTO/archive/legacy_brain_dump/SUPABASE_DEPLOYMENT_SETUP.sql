-- ============================================================================
-- 🌌 S-CLASS SYSTEM LOGS & SECURITY SETUP
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create system_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,           -- 'INIT', 'INFO', 'WARNING', 'ERROR'
    message TEXT NOT NULL,
    status TEXT,                 -- 'SOVEREIGN', 'IDLE', 'ERROR'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- 3. Policies for system_logs
DROP POLICY IF EXISTS "Allow system log insertion" ON public.system_logs;
CREATE POLICY "Allow system log insertion" 
ON public.system_logs FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Restrict log reading to admin" ON public.system_logs;
CREATE POLICY "Restrict log reading to admin" 
ON public.system_logs FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'role' IN ('admin', 's-class', 'system'));

-- 4. Ensure other tables from migrations are secured
-- (Assuming they were created by hunter_rag_schema.sql)
ALTER TABLE IF EXISTS public.hunter_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rag_knowledge_vault ENABLE ROW LEVEL SECURITY;

-- Fallback for anon access if role based auth is not yet configured for service-to-service
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public reading for intel' AND tablename = 'hunter_intel') THEN
        CREATE POLICY "Public reading for intel" ON public.hunter_intel FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
