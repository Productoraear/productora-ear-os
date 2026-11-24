---
id: "RULE-73"
name: "Regla 73: Cumplimiento Estricto Ley del Ruido & Sonometría Preventiva"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-71-80.ts"
integrityHash: "83d7ea32bcbd2a66"
---

# Regla 73: Cumplimiento Estricto Ley del Ruido & Sonometría Preventiva

- **ID**: `RULE-73`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-71-80.ts`
- **Hash de Integridad**: `83d7ea32bcbd2a66`

## Metadatos
```json
{
  "ruleId": 73,
  "block": 8,
  "blockTitle": "Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano",
  "title": "Cumplimiento Estricto Ley del Ruido & Sonometría Preventiva",
  "directive": "Todo evento se dimensiona bajo la ratio de 10-12 W/pax y se calibra estrictamente por debajo de los 75 dB SPL ponderados conforme a la Ley 37/2003 del Ruido; se aplica monitorización sonométrica en tiempo real y queda prohibida cualquier promesa de inmunidad legal o elusión de sonómetros municipales."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-OTZARRETA]]
- **governs->executes** -> [[GATE-SONOMETRO]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
