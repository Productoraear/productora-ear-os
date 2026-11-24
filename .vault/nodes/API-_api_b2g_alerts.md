---
id: "API-/api/b2g/alerts"
name: "/api/b2g/alerts"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/b2g/alerts/route.ts"
integrityHash: "d50b4cff71dc2164"
---

# /api/b2g/alerts

- **ID**: `API-/api/b2g/alerts`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/b2g/alerts/route.ts`
- **Hash de Integridad**: `d50b4cff71dc2164`

## Metadatos
```json
{
  "endpoint": "/api/b2g/alerts",
  "verbs": [
    "GET"
  ],
  "isProtected": false,
  "isStripe": false
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
