---
id: "API-/api/checkout/digital"
name: "/api/checkout/digital"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/checkout/digital/route.ts"
integrityHash: "d9f2892ad3e1d656"
---

# /api/checkout/digital

- **ID**: `API-/api/checkout/digital`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/checkout/digital/route.ts`
- **Hash de Integridad**: `d9f2892ad3e1d656`

## Metadatos
```json
{
  "endpoint": "/api/checkout/digital",
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
