---
id: "API-/api/astra/payment-intent"
name: "/api/astra/payment-intent"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/astra/payment-intent/route.ts"
integrityHash: "03e69cbc69aa5ad9"
---

# /api/astra/payment-intent

- **ID**: `API-/api/astra/payment-intent`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/astra/payment-intent/route.ts`
- **Hash de Integridad**: `03e69cbc69aa5ad9`

## Metadatos
```json
{
  "endpoint": "/api/astra/payment-intent",
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
