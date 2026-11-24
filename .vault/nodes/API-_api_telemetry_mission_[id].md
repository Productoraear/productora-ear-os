---
id: "API-/api/telemetry/mission/[id]"
name: "/api/telemetry/mission/[id]"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/telemetry/mission/[id]/route.ts"
integrityHash: "cf892bfd88dc99ab"
---

# /api/telemetry/mission/[id]

- **ID**: `API-/api/telemetry/mission/[id]`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/telemetry/mission/[id]/route.ts`
- **Hash de Integridad**: `cf892bfd88dc99ab`

## Metadatos
```json
{
  "endpoint": "/api/telemetry/mission/[id]",
  "verbs": [
    "GET"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-smartContract]]
- **reads->writes** -> [[DATA-MODEL-waybill]]
- **reads->writes** -> [[DATA-MODEL-SmartLock]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
