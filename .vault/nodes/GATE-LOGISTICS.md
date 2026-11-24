---
id: "GATE-LOGISTICS"
name: "Gate Logistics Boundaries"
type: "constitutional"
criticality: "CRITICAL"
path: "scripts/verify_logistics.ts"
integrityHash: "546ffbb679dfd83f"
---

# Gate Logistics Boundaries

- **ID**: `GATE-LOGISTICS`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `scripts/verify_logistics.ts`
- **Hash de Integridad**: `546ffbb679dfd83f`

## Metadatos
```json
{
  "command": "npm run verify:logistics",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
