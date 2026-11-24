---
id: "RULE-28"
name: "Regla 28: Mamparo de Sobrecontratación (Overbooking P0-3)"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 28: Mamparo de Sobrecontratación (Overbooking P0-3)

- **ID**: `RULE-28`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 28,
  "block": 3,
  "blockTitle": "Riesgo Invertido, Fianza & Filtro de Reputación",
  "title": "Mamparo de Sobrecontratación (Overbooking P0-3)",
  "directive": "Bloquear el calendario a nivel atómico en base de datos: 1 único ganador HTTP 200, N-1 concurrentes rechazados con HTTP 409."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
