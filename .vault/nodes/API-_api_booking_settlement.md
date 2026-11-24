---
id: "API-/api/booking/settlement"
name: "/api/booking/settlement"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/booking/settlement/route.ts"
integrityHash: "1163ac7d58e13ddd"
---

# /api/booking/settlement

- **ID**: `API-/api/booking/settlement`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/booking/settlement/route.ts`
- **Hash de Integridad**: `1163ac7d58e13ddd`

## Metadatos
```json
{
  "endpoint": "/api/booking/settlement",
  "verbs": [
    "POST"
  ],
  "isProtected": false,
  "isStripe": true
}
```

## Dependencias Salientes (Outgoing)
- **reads->writes** -> [[DATA-MODEL-commissionLedger]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
