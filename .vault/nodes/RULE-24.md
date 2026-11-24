---
id: "RULE-24"
name: "Regla 24: Reembolsabilidad Transparente del Price-Lock"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 24: Reembolsabilidad Transparente del Price-Lock

- **ID**: `RULE-24`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 24,
  "block": 3,
  "blockTitle": "Riesgo Invertido, Fianza & Filtro de Reputación",
  "title": "Reembolsabilidad Transparente del Price-Lock",
  "directive": "Si la fecha está ocupada por concurrencia atómica, el depósito se desbloquea o devuelve inmediatamente sin fricción bancaria."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
