---
id: "API-/api/calendar/[kind]/[slug]/deposit"
name: "/api/calendar/[kind]/[slug]/deposit"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/calendar/[kind]/[slug]/deposit/route.ts"
integrityHash: "ab304bceebed02c6"
---

# /api/calendar/[kind]/[slug]/deposit

- **ID**: `API-/api/calendar/[kind]/[slug]/deposit`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/calendar/[kind]/[slug]/deposit/route.ts`
- **Hash de Integridad**: `ab304bceebed02c6`

## Metadatos
```json
{
  "endpoint": "/api/calendar/[kind]/[slug]/deposit",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
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
