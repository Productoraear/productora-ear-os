---
id: "RULE-41"
name: "Regla 41: Verdad en Disco (Evidence-Only RAG)"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-1-50.ts"
integrityHash: "a01e6f33055d2a87"
---

# Regla 41: Verdad en Disco (Evidence-Only RAG)

- **ID**: `RULE-41`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-1-50.ts`
- **Hash de Integridad**: `a01e6f33055d2a87`

## Metadatos
```json
{
  "ruleId": 41,
  "block": 5,
  "blockTitle": "Verdad en Disco, Centralita & Licitación B2G",
  "title": "Verdad en Disco (Evidence-Only RAG)",
  "directive": "El Oráculo y el Concierge solo pueden afirmar lo que esté auditado y registrado en disco; si un dato no consta, se declara no disponible."
}
```

## Dependencias Salientes (Outgoing)
_Ninguna dependencia saliente directa._

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
