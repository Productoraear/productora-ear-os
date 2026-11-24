---
id: "API-/api/quote/smoke-test-lock"
name: "/api/quote/smoke-test-lock"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/quote/smoke-test-lock/route.ts"
integrityHash: "7fb61f091075fd6d"
---

# /api/quote/smoke-test-lock

- **ID**: `API-/api/quote/smoke-test-lock`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/quote/smoke-test-lock/route.ts`
- **Hash de Integridad**: `7fb61f091075fd6d`

## Metadatos
```json
{
  "endpoint": "/api/quote/smoke-test-lock",
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
