<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\security-smoke-test.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 9D6255C1E3E9DE137C9E4DBBA0161A927308485BD707CA9E712A14EC16B0A141
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🛡️ SECURITY SMOKE TEST: AISLAMIENTO MULTI-TENANT
**Versión**: 158.7 (S-CLASS)
**Estado**: LISTO PARA EJECUCIÓN

## 📋 PROPÓSITO
Validar que las políticas de **Row Level Security (RLS)** en Supabase garantizan el aislamiento absoluto de datos entre diferentes Workspaces y respetan la jerarquía de roles (`owner`, `admin`, `editor`, `viewer`).

---

## 🚀 PRERREQUISITOS
1. Haber ejecutado la migración `supabase/migrations/20260513194500_planner_os_sovereignty.sql`.
2. Acceso al SQL Editor de Supabase o cliente Postgres con privilegios de superusuario para simular JWT.

---

## 🛠️ ORDEN DE EJECUCIÓN

### 1. Preparación del Escenario
Ejecutar el bloque `DO $$ ... $$` del archivo [scripts/security-smoke-test.sql](../scripts/security-smoke-test.sql).
*   **Resultado esperado**: "Entorno de prueba creado" en la consola de avisos.

### 2. Prueba de Aislamiento Transversal (Tenant A vs B)
Simular sesión como `User A` (`00000000-0000-0000-0000-000000000001`).
*   **Comando**: `SELECT * FROM events;`
*   **Esperado**: Solo debe aparecer el evento del `Workspace A`. El evento del `Workspace B` debe ser invisible.

### 3. Prueba de Restricción de Rol (Viewer)
Simular sesión como `User C` (`00000000-0000-0000-0000-000000000003`).
*   **Comando**: `INSERT INTO events (...) VALUES (...)`
*   **Esperado**: Error de violación de RLS (`42501: permission denied for table events`).

### 4. Prueba de Suspensión
Simular sesión como `User D` (`00000000-0000-0000-0000-000000000004`).
*   **Comando**: `SELECT * FROM events;`
*   **Esperado**: 0 filas devueltas (aunque sea `editor`, su membresía está `suspended`).

### 5. Prueba de Borrado Lógico
Actualizar un evento con `deleted_at = NOW()`.
*   **Comando**: `SELECT * FROM events;`
*   **Esperado**: El evento debe desaparecer de la vista del usuario, cumpliendo la política de soberanía forense.

---

## 📊 CRITERIO DE APROBACIÓN FINAL
*   **PASS**: Si el 100% de los casos devuelven el comportamiento esperado.
*   **FAIL**: Si cualquier consulta de un usuario devuelve datos de un workspace ajeno o permite una mutación no autorizada.

---

## ⚠️ INTERPRETACIÓN DE FALLO
Si un test falla, revisar:
1. ¿Está activado el RLS en la tabla? (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`)
2. ¿La política filtra correctamente por `workspace_id` usando la subquery en `memberships`?
3. ¿Se está simulando el `auth.uid()` correctamente en la sesión SQL?
