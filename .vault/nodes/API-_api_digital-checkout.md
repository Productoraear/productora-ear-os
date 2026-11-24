---
id: "API-/api/digital-checkout"
name: "/api/digital-checkout"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/digital-checkout/route.ts"
integrityHash: "4ba322a4507b2566"
---

# /api/digital-checkout

- **ID**: `API-/api/digital-checkout`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/digital-checkout/route.ts`
- **Hash de Integridad**: `4ba322a4507b2566`

## Metadatos
```json
{
  "endpoint": "/api/digital-checkout",
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
