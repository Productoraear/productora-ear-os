---
id: "API-/api/villas/villa-escorial/availability"
name: "/api/villas/villa-escorial/availability"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/villas/villa-escorial/availability/route.ts"
integrityHash: "2f755593d3db919b"
---

# /api/villas/villa-escorial/availability

- **ID**: `API-/api/villas/villa-escorial/availability`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/villas/villa-escorial/availability/route.ts`
- **Hash de Integridad**: `2f755593d3db919b`

## Metadatos
```json
{
  "endpoint": "/api/villas/villa-escorial/availability",
  "verbs": [
    "GET",
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
