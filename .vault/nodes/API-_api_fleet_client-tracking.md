---
id: "API-/api/fleet/client-tracking"
name: "/api/fleet/client-tracking"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/fleet/client-tracking/route.ts"
integrityHash: "563029fae98b6286"
---

# /api/fleet/client-tracking

- **ID**: `API-/api/fleet/client-tracking`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/fleet/client-tracking/route.ts`
- **Hash de Integridad**: `563029fae98b6286`

## Metadatos
```json
{
  "endpoint": "/api/fleet/client-tracking",
  "verbs": [
    "GET"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-FleetPosition]]
- **reads->writes** -> [[DATA-MODEL-ProductionEvent]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
