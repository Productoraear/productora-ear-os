---
id: "GATE-SONOMETRO"
name: "Gate Sonómetro PWA Ley 37/2003"
type: "constitutional"
criticality: "HIGH"
path: "scripts/verify_sonometro_pwa.cjs"
integrityHash: "0413b6e6b3a1de68"
---

# Gate Sonómetro PWA Ley 37/2003

- **ID**: `GATE-SONOMETRO`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `scripts/verify_sonometro_pwa.cjs`
- **Hash de Integridad**: `0413b6e6b3a1de68`

## Metadatos
```json
{
  "command": "node scripts/verify_sonometro_pwa.cjs",
  "isMechanicalGate": true
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-73]] -> **governs->executes**
