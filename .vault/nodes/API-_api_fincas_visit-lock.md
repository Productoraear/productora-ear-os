---
id: "API-/api/fincas/visit-lock"
name: "/api/fincas/visit-lock"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/fincas/visit-lock/route.ts"
integrityHash: "056cb6eb81c8d820"
---

# /api/fincas/visit-lock

- **ID**: `API-/api/fincas/visit-lock`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/fincas/visit-lock/route.ts`
- **Hash de Integridad**: `056cb6eb81c8d820`

## Metadatos
```json
{
  "endpoint": "/api/fincas/visit-lock",
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
