---
id: "API-/api/admin/dispatch/lock"
name: "/api/admin/dispatch/lock"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/admin/dispatch/lock/route.ts"
integrityHash: "9e7280d57179353a"
---

# /api/admin/dispatch/lock

- **ID**: `API-/api/admin/dispatch/lock`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/admin/dispatch/lock/route.ts`
- **Hash de Integridad**: `9e7280d57179353a`

## Metadatos
```json
{
  "endpoint": "/api/admin/dispatch/lock",
  "verbs": [
    "POST",
    "DELETE"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
