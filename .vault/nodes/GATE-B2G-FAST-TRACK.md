---
id: "GATE-B2G-FAST-TRACK"
name: "Gate B2G Fast-Track & SLA"
type: "constitutional"
criticality: "CRITICAL"
path: "scripts/verify_municipal_fast_track.ts"
integrityHash: "6b3b457a75f3f5b7"
---

# Gate B2G Fast-Track & SLA

- **ID**: `GATE-B2G-FAST-TRACK`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `scripts/verify_municipal_fast_track.ts`
- **Hash de Integridad**: `6b3b457a75f3f5b7`

## Metadatos
```json
{
  "command": "npm run verify:b2g-fast-track",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DATASET-B2G-OPPORTUNITIES]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-62]] -> **governs->executes**
