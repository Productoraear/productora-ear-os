<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\memoria EAR OS\01-Arquitectura\Matriz de Permisos.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: F64ABB2DED4E78AE55C89AA252E03233B7F54C27D88E0646C1093C2E5A0B74C0
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🛡️ Matriz de Permisos y Control de Acceso (RBAC)

Esta nota detalla el modelo de control de acceso basado en roles (RBAC) implementado centralizadamente en `src/lib/auth/permissions.ts` para mitigar accesos no autorizados en Server Actions y endpoints de EAR OS.

---

## 🏛️ Estructura del Validador `userCan`

El validador de permisos actúa como un único punto de verdad, evitando que la lógica de verificación de roles se disperse por múltiples vistas de cliente o funciones de servidor vulnerables.

```ts
export type Role = 'EXPLORADOR' | 'CLIENT' | 'ARTIST' | 'PROVIDER' | 'FLEET_OPERATOR' | 'OPERADOR' | 'ADMIN' | 'COMMANDER' | 'ARQUITECTO';

export type Action = 
  | 'VIEW_DASHBOARD'
  | 'VIEW_LEDGER'
  | 'MANAGE_FLEET'
  | 'EDIT_ARTIST_PROFILE'
  | 'EDIT_SYSTEM_SETTINGS'
  | 'ACCESS_COMMAND_CENTER';
```

---

## 📊 Tabla de Cumplimiento de Roles

| Rol | VIEW_DASHBOARD | VIEW_LEDGER | MANAGE_FLEET | EDIT_ARTIST_PROFILE | EDIT_SYSTEM_SETTINGS | ACCESS_COMMAND_CENTER |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **EXPLORADOR** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **CLIENT** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **ARTIST** | ✔️ | ❌ | ❌ | ✔️ | ❌ | ❌ |
| **PROVIDER** | ✔️ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **FLEET_OPERATOR**| ✔️ | ❌ | ✔️ | ❌ | ❌ | ❌ |
| **OPERADOR** | ✔️ | ✔️ | ✔️ | ✔️ | ❌ | ❌ |
| **ADMIN** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **COMMANDER** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| **ARQUITECTO** | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |

*Nota: Los roles `ADMIN`, `COMMANDER` y `ARQUITECTO` gozan de bypass global automático (Clearance Total) para agilizar labores operativas y de soporte técnico.*

---

## 🔗 Notas Relacionadas
*   [[Esquema General]] - Flujos de arquitectura perimetral.
*   [[Checklist de Hardening]] - Sección 1 (Identidad y Acceso).
