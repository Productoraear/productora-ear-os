
-- RLS POLICIES FOR EAR OS GOLD V2
-- Solo acepta lo que viene de nuestro sistema (autenticado)

-- 1. Habilitar RLS en tablas críticas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para 'leads' (Soberanos)
CREATE POLICY "Solo administradores pueden ver leads" 
ON leads FOR SELECT 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Cualquiera puede crear leads desde el sistema" 
ON leads FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 3. Políticas para 'transactions' (Bespoke/Payments)
CREATE POLICY "Solo dueños o admins ven transacciones" 
ON transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- 4. Políticas para 'fleet_status' (Telemetría)
CREATE POLICY "Lectura pública de disponibilidad" 
ON fleet_status FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Solo sistema puede actualizar flota" 
ON fleet_status FOR UPDATE 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin');

-- 5. Restricción de CORS (Supabase side)
-- Nota: Esto se configura en el dashboard de Supabase (Settings -> API -> CORS Allowed Origins)
-- Pero podemos reforzar con políticas de seguridad.

-- 6. Auditoría de Seguridad
COMMENT ON TABLE leads IS 'RLS Activo: Acceso restringido por rol.';
