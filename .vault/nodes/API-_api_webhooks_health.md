---
id: "API-/api/webhooks/health"
name: "/api/webhooks/health"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/webhooks/health/route.ts"
integrityHash: "f89e675c01cf14c1"
---

# /api/webhooks/health

- **ID**: `API-/api/webhooks/health`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/webhooks/health/route.ts`
- **Hash de Integridad**: `f89e675c01cf14c1`

## Metadatos
```json
{
  "endpoint": "/api/webhooks/health",
  "verbs": [
    "GET"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
