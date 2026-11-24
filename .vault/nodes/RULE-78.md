---
id: "RULE-78"
name: "Regla 78: Horas Extra Tarificadas por Bloques de 60 Minutos con Firma In Situ"
type: "constitutional"
criticality: "HIGH"
path: "src/lib/oraculo/oraculo-canonical-rules-71-80.ts"
integrityHash: "83d7ea32bcbd2a66"
---

# Regla 78: Horas Extra Tarificadas por Bloques de 60 Minutos con Firma In Situ

- **ID**: `RULE-78`
- **Tipo**: `constitutional`
- **Criticidad**: `HIGH`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-71-80.ts`
- **Hash de Integridad**: `83d7ea32bcbd2a66`

## Metadatos
```json
{
  "ruleId": 78,
  "block": 8,
  "blockTitle": "Seguridad Operativa, Cumplimiento Normativo & Arbitraje Soberano",
  "title": "Horas Extra Tarificadas por Bloques de 60 Minutos con Firma In Situ",
  "directive": "Toda extensión horaria sobre el horario pactado en contrato se liquida por tramos indivisibles de 60 minutos según tarifa canónica vigente, requiriendo la firma presencial o confirmación digital fehaciente del contratante antes de iniciar la prórroga de la actuación."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-OTZARRETA]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
