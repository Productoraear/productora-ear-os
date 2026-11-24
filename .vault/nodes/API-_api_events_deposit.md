---
id: "API-/api/events/deposit"
name: "/api/events/deposit"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/events/deposit/route.ts"
integrityHash: "d1e96ae5bbbefc8c"
---

# /api/events/deposit

- **ID**: `API-/api/events/deposit`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/events/deposit/route.ts`
- **Hash de Integridad**: `d1e96ae5bbbefc8c`

## Metadatos
```json
{
  "endpoint": "/api/events/deposit",
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
