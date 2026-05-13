-- 🤖 MIGRACIÓN: OPERATIONAL AUTO-HEALING - S-CLASS EXPIRATION JOB
-- Propósito: Saneamiento automático de reservas caducadas y consistencia de estados.

-- 1. HABILITAR EXTENSIÓN PG_CRON (Si está disponible en el entorno)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. FUNCIÓN DE LIMPIEZA QUIRÚRGICA
CREATE OR REPLACE FUNCTION expire_outdated_reservations()
RETURNS void AS $$
BEGIN
    -- Marcar como EXPIRED los dossiers pre-cerrados cuya reserva ha vencido
    UPDATE dossier_proposals
    SET status = 'expired'
    WHERE status = 'pre-closed'
      AND reservation_expires_at < NOW();

    -- También limpiar propuestas SENT que hayan superado su expires_at general
    UPDATE dossier_proposals
    SET status = 'expired'
    WHERE status IN ('draft', 'sent')
      AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 3. PROGRAMAR EL JOB (Cada 5 minutos)
-- SELECT cron.schedule('*/5 * * * *', 'SELECT expire_outdated_reservations();');

-- 4. VISTA SEGURA DE DISPONIBILIDAD (Solo muestra lo que no está reservado ni expirado)
CREATE OR REPLACE VIEW active_dossier_reservations AS
SELECT 
    id, 
    selected_assets, 
    reservation_expires_at
FROM dossier_proposals
WHERE status = 'pre-closed'
  AND reservation_expires_at > NOW();

-- 5. POLÍTICA DE SEGURIDAD ADICIONAL
-- Garantizar que nadie pueda leer propuestas expiradas vía API anónima
CREATE OR REPLACE POLICY "Hide expired dossiers" ON dossier_proposals
    FOR SELECT USING (
        (expires_at > NOW()) AND 
        (reservation_expires_at IS NULL OR reservation_expires_at > NOW())
    );
