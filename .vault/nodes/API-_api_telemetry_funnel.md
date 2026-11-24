---
id: "API-/api/telemetry/funnel"
name: "/api/telemetry/funnel"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/telemetry/funnel/route.ts"
integrityHash: "ccb449c963f2fb44"
---

# /api/telemetry/funnel

- **ID**: `API-/api/telemetry/funnel`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/telemetry/funnel/route.ts`
- **Hash de Integridad**: `ccb449c963f2fb44`

## Metadatos
```json
{
  "endpoint": "/api/telemetry/funnel",
  "verbs": [
    "GET",
    "POST"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-FunnelEvent]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
