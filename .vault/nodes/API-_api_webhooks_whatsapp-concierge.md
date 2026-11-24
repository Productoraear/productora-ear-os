---
id: "API-/api/webhooks/whatsapp-concierge"
name: "/api/webhooks/whatsapp-concierge"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/webhooks/whatsapp-concierge/route.ts"
integrityHash: "65b2e15c1eaa562d"
---

# /api/webhooks/whatsapp-concierge

- **ID**: `API-/api/webhooks/whatsapp-concierge`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/webhooks/whatsapp-concierge/route.ts`
- **Hash de Integridad**: `65b2e15c1eaa562d`

## Metadatos
```json
{
  "endpoint": "/api/webhooks/whatsapp-concierge",
  "verbs": [
    "POST"
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
