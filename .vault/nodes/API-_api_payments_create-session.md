---
id: "API-/api/payments/create-session"
name: "/api/payments/create-session"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/payments/create-session/route.ts"
integrityHash: "00eecdaeffb0f7e9"
---

# /api/payments/create-session

- **ID**: `API-/api/payments/create-session`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/payments/create-session/route.ts`
- **Hash de Integridad**: `00eecdaeffb0f7e9`

## Metadatos
```json
{
  "endpoint": "/api/payments/create-session",
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
