---
id: "API-/api/oracle/chat"
name: "/api/oracle/chat"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/oracle/chat/route.ts"
integrityHash: "12ffe43f4879cf80"
---

# /api/oracle/chat

- **ID**: `API-/api/oracle/chat`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/oracle/chat/route.ts`
- **Hash de Integridad**: `12ffe43f4879cf80`

## Metadatos
```json
{
  "endpoint": "/api/oracle/chat",
  "verbs": [
    "GET",
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
