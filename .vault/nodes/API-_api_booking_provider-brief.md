---
id: "API-/api/booking/provider-brief"
name: "/api/booking/provider-brief"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/booking/provider-brief/route.ts"
integrityHash: "9901bfb4db7609a6"
---

# /api/booking/provider-brief

- **ID**: `API-/api/booking/provider-brief`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/booking/provider-brief/route.ts`
- **Hash de Integridad**: `9901bfb4db7609a6`

## Metadatos
```json
{
  "endpoint": "/api/booking/provider-brief",
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
