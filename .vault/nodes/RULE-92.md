---
id: "RULE-92"
name: "Regla 92: Centralita de Voz Híbrida 24/7 con Despacho Express en < 60 Segundos"
type: "constitutional"
criticality: "CRITICAL"
path: "src/lib/oraculo/oraculo-canonical-rules-91-100.ts"
integrityHash: "ef635b4695f238ce"
---

# Regla 92: Centralita de Voz Híbrida 24/7 con Despacho Express en < 60 Segundos

- **ID**: `RULE-92`
- **Tipo**: `constitutional`
- **Criticidad**: `CRITICAL`
- **Ruta en Disco**: `src/lib/oraculo/oraculo-canonical-rules-91-100.ts`
- **Hash de Integridad**: `ef635b4695f238ce`

## Metadatos
```json
{
  "ruleId": 92,
  "block": 10,
  "blockTitle": "Gobernanza Máxima, Constitución Tripartita & Juramento de Soberanía",
  "title": "Centralita de Voz Híbrida 24/7 con Despacho Express en < 60 Segundos",
  "directive": "La centralita telefónica y de mensajería (+34 693 693 048) opera con asistencia de voz contextualizada que informa menús, aforos y disponibilidad técnica; ante eventos cualificados de alto impacto (> 5.000 € o > 100 pax), transfiere la llamada o el chat al Director Generalista / Maître en menos de 60 segundos con enlace directo a fianza Stripe."
}
```

## Dependencias Salientes (Outgoing)
- **governs->executes** -> [[DOMAIN-CALL-CENTER]]

## Dependencias Entrantes (Incoming / Governed by)
- [[SSOT-EAR-OS]] -> **governs->executes**
