---
id: "API-/api/reservar/solista/deposit"
name: "/api/reservar/solista/deposit"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/reservar/solista/deposit/route.ts"
integrityHash: "66b64bcac040be99"
---

# /api/reservar/solista/deposit

- **ID**: `API-/api/reservar/solista/deposit`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/reservar/solista/deposit/route.ts`
- **Hash de Integridad**: `66b64bcac040be99`

## Metadatos
```json
{
  "endpoint": "/api/reservar/solista/deposit",
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
- [[ROUTE-/reservar/solista]] -> **caller->callee**
