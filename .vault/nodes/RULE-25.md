---
id: "RULE-25"
name: "Regla 25: Filtro de Reputación Estricta (> 3.8 Estrellas)"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 25: Filtro de Reputación Estricta (> 3.8 Estrellas)

- **ID**: `RULE-25`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 25,
  "block": 3,
  "blockTitle": "Riesgo Invertido, Fianza & Filtro de Reputación",
  "title": "Filtro de Reputación Estricta (> 3.8 Estrellas)",
  "directive": "Prohibido incorporar o recomendar proveedores con valoración media auditada inferior a 3.8/5 estrellas en fuentes contrastadas."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
