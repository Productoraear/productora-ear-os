# 🏆 EAR OS — GOLDEN DATASET SPECIFICATION

> **Golden Dataset:** Conjunto inmutable de pares Query-Context-Response de alta dificultad para evaluar la robustez del motor RAG frente a casos límite (edge cases).

## 1. Composición del Dataset (Min 50 casos)
El Golden Dataset debe cubrir las siguientes categorías de queries:

1. **Precios y Tarifas Cruzadas (Alta precisión numérica)**
   - *Query:* "¿Cuánto cuesta el cuarteto en Aranjuez un sábado por la noche?"
   - *Expected Context:* `[Precios Base Cuarteto]`, `[Recargos por Distancia > 50km]`.
2. **Rechazo Legítimo (Out of Domain)**
   - *Query:* "¿Edwin canta reggaeton en las bodas?"
   - *Expected Response:* Refusal educado indicando que el repertorio es estrictamente regional mexicano de gala.
3. **Disponibilidad y Urgencia**
   - *Query:* "Necesito mariachis para hoy mismo en Madrid centro."
   - *Expected Response:* Ruta hacia el flujo de Urgencias 24h / Alerta Fleet OS.
4. **Política de Reembolsos / Cancelación**
   - *Query:* "¿Qué pasa si llueve en el evento al aire libre?"
   - *Expected Context:* `[Cláusula Meteorológica Contrato EAR OS]`.

## 2. Mantenimiento del Dataset
- El dataset debe actualizarse trimestralmente extrayendo las queries reales más fallidas (obtenidas de la Capa de Observabilidad).
