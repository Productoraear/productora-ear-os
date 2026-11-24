---
id: "API-/api/cron/hold-timeout"
name: "/api/cron/hold-timeout"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/cron/hold-timeout/route.ts"
integrityHash: "2d07307a5a36c421"
---

# /api/cron/hold-timeout

- **ID**: `API-/api/cron/hold-timeout`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/cron/hold-timeout/route.ts`
- **Hash de Integridad**: `2d07307a5a36c421`

## Metadatos
```json
{
  "endpoint": "/api/cron/hold-timeout",
  "verbs": [
    "GET"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
