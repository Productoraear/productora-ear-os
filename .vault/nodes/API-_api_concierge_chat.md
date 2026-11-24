---
id: "API-/api/concierge/chat"
name: "/api/concierge/chat"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/concierge/chat/route.ts"
integrityHash: "ffb8b534b938923d"
---

# /api/concierge/chat

- **ID**: `API-/api/concierge/chat`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/concierge/chat/route.ts`
- **Hash de Integridad**: `ffb8b534b938923d`

## Metadatos
```json
{
  "endpoint": "/api/concierge/chat",
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
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
