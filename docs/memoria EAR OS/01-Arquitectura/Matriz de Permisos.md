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
