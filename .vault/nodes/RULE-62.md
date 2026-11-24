---
id: "RULE-62"
name: "Regla 62: Automatización de Memoria Técnica para Licitaciones B2G"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-61-70.ts"
integrityHash: "0dc9b1a56cfb45d5"
---

# Regla 62: Automatización de Memoria Técnica para Licitaciones B2G

- **ID**: `RULE-62`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-61-70.ts`
- **Hash de Integridad**: `0dc9b1a56cfb45d5`

## Metadatos
```json
{
  "ruleId": 62,
  "block": 7,
  "blockTitle": "Alumbrado Monumental, Licitaciones LCSP & Alquiler de Alto Formato",
  "title": "Automatización de Memoria Técnica para Licitaciones B2G",
  "directive": "Toda propuesta institucional para Ayuntamientos debe generar automáticamente la memoria descriptiva con marcado CE, esquemas de conexión estanca a 24V, certificado de aislamiento IP65/IP67 y desglose presupuestario formal exigido por la LCSP."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CATALOGO-LUCES]]
- **governs->executes** -> [[GATE-B2G-FAST-TRACK]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
