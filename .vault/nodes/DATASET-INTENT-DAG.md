---
id: "DATASET-INTENT-DAG"
name: "DAG de Intenciones del Oráculo CEO"
type: "dataset"
criticality: "CRITICAL"
path: "src/data/intent-dag.json"
integrityHash: "5770c7f4199fb560"
---

# DAG de Intenciones del Oráculo CEO

- **ID**: `DATASET-INTENT-DAG`
- **Tipo**: `dataset`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/data/intent-dag.json`
- **Hash de Integridad**: `5770c7f4199fb560`

## Metadatos
```json
{
  "itemCount": 1,
  "schemaContract": "src/types/transductive-schemas.ts",
  "validatedZod": true,
  "transductiveElevation": "TIER-1"
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
- [[RULE-1]] -> **governs->executes**
