---
id: "API-/api/booking/accept"
name: "/api/booking/accept"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/booking/accept/route.ts"
integrityHash: "b5ce9b93b3b7da5b"
---

# /api/booking/accept

- **ID**: `API-/api/booking/accept`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/booking/accept/route.ts`
- **Hash de Integridad**: `b5ce9b93b3b7da5b`

## Metadatos
```json
{
  "endpoint": "/api/booking/accept",
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
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
