---
id: "ROUTE-/reservar/solista"
name: "/reservar/solista"
type: "route"
criticality: "CRITICAL"
path: "src/app/reservar/solista/page.tsx"
integrityHash: "7892692bac2379f3"
---

# /reservar/solista

- **ID**: `ROUTE-/reservar/solista`
- **Tipo**: `route`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/app/reservar/solista/page.tsx`
- **Hash de Integridad**: `7892692bac2379f3`

## Metadatos
```json
{
  "pathname": "/reservar/solista",
  "isDynamic": false,
  "isClient": true,
  "category": "MONEY"
}
```

## Dependencias Salientes (Outgoing)
- **caller->callee** -> [[API-/api/geo/acoustic-calculate]]
- **caller->callee** -> [[API-/api/reservar/solista/deposit]]
- **depends_on** -> [[DOMAIN-EDWIN-AGUDELO]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
