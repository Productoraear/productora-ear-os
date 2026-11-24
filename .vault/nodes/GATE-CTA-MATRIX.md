---
id: "GATE-CTA-MATRIX"
name: "Gate CTA Traceability Matrix"
type: "constitutional"
criticality: "HIGH"
path: "scripts/audit_cta_trace_matrix.ts"
integrityHash: "35dd72a594a0eeb6"
---

# Gate CTA Traceability Matrix

- **ID**: `GATE-CTA-MATRIX`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `scripts/audit_cta_trace_matrix.ts`
- **Hash de Integridad**: `35dd72a594a0eeb6`

## Metadatos
```json
{
  "command": "npm run audit:cta-matrix",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
