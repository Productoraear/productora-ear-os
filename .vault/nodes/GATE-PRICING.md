---
id: "GATE-PRICING"
name: "Gate Pricing Unification"
type: "constitutional"
criticality: "CRITICAL"
path: "scripts/verify_pricing_ssot_unification.ts"
integrityHash: "aa8fd7070325db81"
---

# Gate Pricing Unification

- **ID**: `GATE-PRICING`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `scripts/verify_pricing_ssot_unification.ts`
- **Hash de Integridad**: `aa8fd7070325db81`

## Metadatos
```json
{
  "command": "npm run verify:pricing",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
