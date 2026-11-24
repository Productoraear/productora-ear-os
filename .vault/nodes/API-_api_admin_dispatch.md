---
id: "API-/api/admin/dispatch"
name: "/api/admin/dispatch"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/admin/dispatch/route.ts"
integrityHash: "0969934abb15b6bc"
---

# /api/admin/dispatch

- **ID**: `API-/api/admin/dispatch`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/admin/dispatch/route.ts`
- **Hash de Integridad**: `0969934abb15b6bc`

## Metadatos
```json
{
  "endpoint": "/api/admin/dispatch",
  "verbs": [
    "GET"
  ],
  "isProtected": true,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-ProductionEvent]]
- **reads->writes** -> [[DATA-MODEL-VendorBooking]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
