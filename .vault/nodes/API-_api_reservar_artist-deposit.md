---
id: "API-/api/reservar/artist-deposit"
name: "/api/reservar/artist-deposit"
type: "api"
criticality: "CRITICAL"
path: "src/app/api/reservar/artist-deposit/route.ts"
integrityHash: "35c600b1297e7f5b"
---

# /api/reservar/artist-deposit

- **ID**: `API-/api/reservar/artist-deposit`
- **Tipo**: `api`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/api/reservar/artist-deposit/route.ts`
- **Hash de Integridad**: `35c600b1297e7f5b`

## Metadatos
```json
{
  "endpoint": "/api/reservar/artist-deposit",
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
- [[RULE-51]] -> **governs->executes**
- [[RULE-64]] -> **governs->executes**
- [[RULE-85]] -> **governs->executes**
