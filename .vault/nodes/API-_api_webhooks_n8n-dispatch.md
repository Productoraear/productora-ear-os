---
id: "API-/api/webhooks/n8n-dispatch"
name: "/api/webhooks/n8n-dispatch"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/webhooks/n8n-dispatch/route.ts"
integrityHash: "ef2af3ce43df8dca"
---

# /api/webhooks/n8n-dispatch

- **ID**: `API-/api/webhooks/n8n-dispatch`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/webhooks/n8n-dispatch/route.ts`
- **Hash de Integridad**: `ef2af3ce43df8dca`

## Metadatos
```json
{
  "endpoint": "/api/webhooks/n8n-dispatch",
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
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
