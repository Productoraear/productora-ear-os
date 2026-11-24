---
id: "API-/api/mcp/concierge"
name: "/api/mcp/concierge"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/mcp/concierge/route.ts"
integrityHash: "d17e8f99195c8064"
---

# /api/mcp/concierge

- **ID**: `API-/api/mcp/concierge`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/mcp/concierge/route.ts`
- **Hash de Integridad**: `d17e8f99195c8064`

## Metadatos
```json
{
  "endpoint": "/api/mcp/concierge",
  "verbs": [
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
