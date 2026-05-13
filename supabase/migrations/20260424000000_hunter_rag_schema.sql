-- ============================================================================
-- 🌌 BÓVEDA DE CONOCIMIENTO Y RAG (CAZADOR FANTASMA)
-- ============================================================================

-- 1. EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA public;

-- 2. TABLA PRINCIPAL: hunter_intel (Resultados del Scraper)
CREATE TABLE IF NOT EXISTS public.hunter_intel (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_url TEXT NOT NULL,
    entity_name TEXT NOT NULL,
    extracted_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    confidence_score NUMERIC(4,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA VECTORIAL: rag_knowledge_vault (Bóveda de Conocimiento)
CREATE TABLE IF NOT EXISTS public.rag_knowledge_vault (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hunter_intel_id UUID REFERENCES public.hunter_intel(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768), -- Asumiendo embeddings de Gemini o similar
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ÍNDICES DE RENDIMIENTO (HNSW para búsquedas de similitud ultrarrápidas)
CREATE INDEX IF NOT EXISTS rag_knowledge_vault_embedding_idx ON public.rag_knowledge_vault USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_hunter_intel_entity ON public.hunter_intel(entity_name);

-- 5. RLS (Row Level Security) - SOVEREIGN PROTOCOL
ALTER TABLE public.hunter_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_knowledge_vault ENABLE ROW LEVEL SECURITY;

-- Solo usuarios con rol 'S-CLASS' o 'SYSTEM' pueden acceder a esta bóveda
CREATE POLICY "Acceso restringido a inteligencia S-CLASS" ON public.hunter_intel
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('s-class', 'system'));

CREATE POLICY "Acceso restringido a vectores S-CLASS" ON public.rag_knowledge_vault
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('s-class', 'system'));
