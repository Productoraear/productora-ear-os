-- 🏛️ EAR OS - SECURITY SMOKE TEST (MULTI-TENANCY RLS)
-- --------------------------------------------------------
-- PROPÓSITO: Validar aislamiento entre Workspaces y RLS por Rol.
-- EJECUCIÓN: Copiar y pegar en el SQL Editor de Supabase.

-- 1. LIMPIEZA DE ENTORNO DE PRUEBA (Opcional - Usar con precaución)
-- DELETE FROM events WHERE title LIKE 'TEST_%';
-- DELETE FROM memberships WHERE metadata->>'is_test' = 'true';
-- DELETE FROM workspaces WHERE name LIKE 'TEST_%';

DO $$
DECLARE
    -- PLACEHOLDERS: Reemplazar con UUIDs reales de auth.users si se desea probar con JWTs reales
    user_a_id UUID := '00000000-0000-0000-0000-000000000001'; -- Owner/Editor A
    user_b_id UUID := '00000000-0000-0000-0000-000000000002'; -- Owner B
    user_c_id UUID := '00000000-0000-0000-0000-000000000003'; -- Viewer A
    user_d_id UUID := '00000000-0000-0000-0000-000000000004'; -- Suspended A
    
    workspace_a_id UUID;
    workspace_b_id UUID;
BEGIN
    -- 2. CREACIÓN DE TENANTS (WORKSPACES)
    INSERT INTO workspaces (name, slug, owner_id, metadata)
    VALUES ('TEST_Workspace_A', 'test-workspace-a', user_a_id, '{"is_test": true}')
    RETURNING id INTO workspace_a_id;

    INSERT INTO workspaces (name, slug, owner_id, metadata)
    VALUES ('TEST_Workspace_B', 'test-workspace-b', user_b_id, '{"is_test": true}')
    RETURNING id INTO workspace_b_id;

    -- 3. CREACIÓN DE MEMBRESÍAS
    -- User A: Owner en A
    INSERT INTO memberships (workspace_id, user_id, role, status, metadata)
    VALUES (workspace_a_id, user_a_id, 'owner', 'active', '{"is_test": true}');

    -- User C: Viewer en A
    INSERT INTO memberships (workspace_id, user_id, role, status, metadata)
    VALUES (workspace_a_id, user_c_id, 'viewer', 'active', '{"is_test": true}');

    -- User D: Suspended en A
    INSERT INTO memberships (workspace_id, user_id, role, status, metadata)
    VALUES (workspace_a_id, user_d_id, 'editor', 'suspended', '{"is_test": true}');

    -- User B: Owner en B
    INSERT INTO memberships (workspace_id, user_id, role, status, metadata)
    VALUES (workspace_b_id, user_b_id, 'owner', 'active', '{"is_test": true}');

    -- 4. INSERCIÓN DE EVENTOS
    INSERT INTO events (workspace_id, title, event_date, created_by)
    VALUES (workspace_a_id, 'TEST_Evento_Privado_A', NOW(), user_a_id);

    INSERT INTO events (workspace_id, title, event_date, created_by)
    VALUES (workspace_b_id, 'TEST_Evento_Privado_B', NOW(), user_b_id);

    RAISE NOTICE 'Entorno de prueba creado. WS_A: %, WS_B: %', workspace_a_id, workspace_b_id;
END $$;

-- --------------------------------------------------------
-- BATERÍA DE TESTS (Simulando auth.uid())
-- --------------------------------------------------------

-- NOTA: Para ejecutar estas pruebas, se debe usar la función 'set_config' de Postgres 
-- para simular el JWT de Supabase en una sesión de SQL.

-- CASO 1: Usuario A puede leer Eventos de A (PASS esperado)
-- set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);
-- SELECT * FROM events WHERE workspace_id = (SELECT id FROM workspaces WHERE slug = 'test-workspace-a');

-- CASO 2: Usuario A NO puede leer Eventos de B (FAIL esperado - debe devolver 0 filas)
-- set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);
-- SELECT * FROM events WHERE workspace_id = (SELECT id FROM workspaces WHERE slug = 'test-workspace-b');

-- CASO 3: Usuario Viewer (C) NO puede insertar eventos (FAIL esperado - RLS Violation)
-- set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000003"}', true);
-- INSERT INTO events (workspace_id, title, event_date, created_by) 
-- VALUES ((SELECT id FROM workspaces WHERE slug = 'test-workspace-a'), 'HACK', NOW(), '00000000-0000-0000-0000-000000000003');

-- CASO 4: Usuario Suspended (D) NO puede leer nada (FAIL esperado - 0 filas)
-- set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000004"}', true);
-- SELECT * FROM events;

-- CASO 5: Borrado Lógico (deleted_at) oculta datos
-- UPDATE events SET deleted_at = NOW() WHERE title = 'TEST_Evento_Privado_A';
-- SELECT * FROM events WHERE title = 'TEST_Evento_Privado_A'; -- Debe devolver 0 filas por la política 'deleted_at is null'
