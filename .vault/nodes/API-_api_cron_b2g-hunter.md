---
id: "API-/api/cron/b2g-hunter"
name: "/api/cron/b2g-hunter"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/cron/b2g-hunter/route.ts"
integrityHash: "17bb997e8934970d"
---

# /api/cron/b2g-hunter

- **ID**: `API-/api/cron/b2g-hunter`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/cron/b2g-hunter/route.ts`
- **Hash de Integridad**: `17bb997e8934970d`

## Metadatos
```json
{
  "endpoint": "/api/cron/b2g-hunter",
  "verbs": [
    "GET"
  ],
  "isProtected": true,
  "isStripe": false
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
