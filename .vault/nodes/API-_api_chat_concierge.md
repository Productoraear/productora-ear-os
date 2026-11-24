---
id: "API-/api/chat/concierge"
name: "/api/chat/concierge"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/chat/concierge/route.ts"
integrityHash: "76703b62e61400a7"
---

# /api/chat/concierge

- **ID**: `API-/api/chat/concierge`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/chat/concierge/route.ts`
- **Hash de Integridad**: `76703b62e61400a7`

## Metadatos
```json
{
  "endpoint": "/api/chat/concierge",
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
