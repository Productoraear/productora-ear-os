-- 🏺 MIGRACIÓN: MARKETPLACE TELEMETRY - S-CLASS SIGNAL STORAGE
-- Propósito: Almacenar señales de intención para el feedback loop del marketplace.

CREATE TABLE IF NOT EXISTS marketplace_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- search_submitted, card_impression, etc.
    session_id TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    path TEXT,
    occasion TEXT,
    province TEXT,
    event_date TEXT, -- Se guarda como texto para preservar la intención original del usuario
    service_id TEXT,
    card_position INTEGER,
    badge_id TEXT,
    query TEXT,
    price_snapshot NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para optimización de Dashboard
CREATE INDEX IF NOT EXISTS idx_market_events_type ON marketplace_events(type);
CREATE INDEX IF NOT EXISTS idx_market_events_session ON marketplace_events(session_id);
CREATE INDEX IF NOT EXISTS idx_market_events_timestamp ON marketplace_events(timestamp);

-- RLS: Solo lectura para roles autorizados (Admin/Analyst)
ALTER TABLE marketplace_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous ingestion" ON marketplace_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin only read" ON marketplace_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM memberships 
            WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
        )
    );

-- VISTA DE ANALÍTICA AGREGADA
CREATE OR REPLACE VIEW marketplace_analytics_summary AS
SELECT 
    type,
    occasion,
    province,
    service_id,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as unique_sessions
FROM marketplace_events
GROUP BY type, occasion, province, service_id;
