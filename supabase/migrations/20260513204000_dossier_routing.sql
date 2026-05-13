-- 📂 MIGRACIÓN: DOSSIER PROPOSALS - S-CLASS LEAD CONVERSION
-- Propósito: Almacenar propuestas dinámicas y gestionar el ruteo de leads.

CREATE TABLE IF NOT EXISTS dossier_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- Contacto
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    organization_name TEXT,
    
    -- Contexto
    occasion_slug TEXT NOT NULL,
    province TEXT,
    
    -- Selección
    selected_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
    priority_score INTEGER DEFAULT 50,
    
    -- Ruteo
    channel TEXT NOT NULL, -- INSTITUTIONAL, B2B, OPERATIVE
    routing_reason TEXT,
    telegram_target TEXT
);

-- Índices de Auditoría y Rendimiento
CREATE INDEX IF NOT EXISTS idx_dossier_status ON dossier_proposals(status);
CREATE INDEX IF NOT EXISTS idx_dossier_email ON dossier_proposals(contact_email);
CREATE INDEX IF NOT EXISTS idx_dossier_channel ON dossier_proposals(channel);
CREATE INDEX IF NOT EXISTS idx_dossier_expires ON dossier_proposals(expires_at);

-- RLS: Solo Admin puede ver todas, Anon solo puede ver la suya con ID+Token
ALTER TABLE dossier_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read with token" ON dossier_proposals
    FOR SELECT USING (
        expires_at > NOW() AND status != 'expired'
    );

CREATE POLICY "Admin full access" ON dossier_proposals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM memberships 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );
