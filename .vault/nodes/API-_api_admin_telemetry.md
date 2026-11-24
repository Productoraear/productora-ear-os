---
id: "API-/api/admin/telemetry"
name: "/api/admin/telemetry"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/admin/telemetry/route.ts"
integrityHash: "59538bb8f2bc77d7"
---

# /api/admin/telemetry

- **ID**: `API-/api/admin/telemetry`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/admin/telemetry/route.ts`
- **Hash de Integridad**: `59538bb8f2bc77d7`

## Metadatos
```json
{
  "endpoint": "/api/admin/telemetry",
  "verbs": [
    "GET"
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
