---
id: "API-/api/providers/opt-out"
name: "/api/providers/opt-out"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/providers/opt-out/route.ts"
integrityHash: "977c6a30dca474f9"
---

# /api/providers/opt-out

- **ID**: `API-/api/providers/opt-out`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/providers/opt-out/route.ts`
- **Hash de Integridad**: `977c6a30dca474f9`

## Metadatos
```json
{
  "endpoint": "/api/providers/opt-out",
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
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
