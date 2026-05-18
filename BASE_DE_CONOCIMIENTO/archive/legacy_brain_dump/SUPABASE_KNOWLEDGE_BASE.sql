-- ============================================================================
-- 🧠 EAR OS GOLD V2: KNOWLEDGE BASE SCHEMA (ORÁCULO OMEGA)
-- ============================================================================

-- 1. Habilitar extensión para búsqueda semántica (vectorial)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Crear tabla de base de conocimiento (Asimilación Forense)
CREATE TABLE IF NOT EXISTS public.ear_knowledge_base (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_path TEXT NOT NULL,
    content TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Preparado para OpenAI Ada-002 o similares
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(file_path, chunk_index)
);

-- 3. Habilitar RLS (Seguridad Táctica)
ALTER TABLE public.ear_knowledge_base ENABLE ROW LEVEL SECURITY;

-- 4. Política de lectura (Pública para el Oráculo)
DROP POLICY IF EXISTS "Lectura pública del Oráculo" ON public.ear_knowledge_base;
CREATE POLICY "Lectura pública del Oráculo" 
ON public.ear_knowledge_base FOR SELECT 
TO anon, authenticated 
USING (true);

-- 5. Política de inserción (Solo Service Role / Admin)
DROP POLICY IF EXISTS "Solo sistema puede asimilar datos" ON public.ear_knowledge_base;
CREATE POLICY "Solo sistema puede asimilar datos" 
ON public.ear_knowledge_base FOR ALL 
TO service_role 
USING (true);

-- 6. Índices para velocidad de respuesta (ilike optimization)
CREATE INDEX IF NOT EXISTS idx_ear_kb_content ON public.ear_knowledge_base USING GIN (to_tsvector('spanish', content));
