---
id: "API-/api/reservar/solista/confirm"
name: "/api/reservar/solista/confirm"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/reservar/solista/confirm/route.ts"
integrityHash: "0ceb308cc59c0e5d"
---

# /api/reservar/solista/confirm

- **ID**: `API-/api/reservar/solista/confirm`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/reservar/solista/confirm/route.ts`
- **Hash de Integridad**: `0ceb308cc59c0e5d`

## Metadatos
```json
{
  "endpoint": "/api/reservar/solista/confirm",
  "verbs": [
    "GET"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-ProductionEvent]]

## Dependencias Entrantes (Incoming / Governed by)
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
