---
id: "API-/api/agents/chat"
name: "/api/agents/chat"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/agents/chat/route.ts"
integrityHash: "3a5b18ad886f15c1"
---

# /api/agents/chat

- **ID**: `API-/api/agents/chat`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/agents/chat/route.ts`
- **Hash de Integridad**: `3a5b18ad886f15c1`

## Metadatos
```json
{
  "endpoint": "/api/agents/chat",
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
