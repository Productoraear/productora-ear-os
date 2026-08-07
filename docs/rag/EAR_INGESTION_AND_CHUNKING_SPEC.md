# 🔪 EAR OS — INGESTION & CHUNKING SPECIFICATION

> **Especificación de Ingestión Documental:** Reglas para procesar, limpiar y fragmentar el conocimiento no estructurado (Riders, FAQs, Historias de Éxito) en vectores de alta fidelidad.

## 1. Normalización Documental
- Todos los documentos se convierten a Markdown limpio antes del embedding.
- Eliminación de HTML, saltos de línea múltiples y caracteres especiales no semánticos.

## 2. Estrategia de Chunking (Semantic Chunking)
- **Tamaño de Chunk:** 512 tokens.
- **Overlap:** 50 tokens (para mantener contexto entre fronteras).
- **Regla de Frontera:** Respetar headers Markdown (`##`, `###`) como límites duros de chunking para no mezclar conceptos distintos (ej. no mezclar precios de solista con rider de cuarteto).
- **Header Injection:** Cada chunk debe heredar recursivamente los títulos de sus padres para mantener el contexto absoluto (ej. `[Tarifas Madrid > Cuarteto] El precio base es...`).

## 3. Control de Versiones
- Cada documento ingerido se asocia a un `document_hash` (SHA-256).
- Si el hash cambia, se invalidan y regeneran los chunks asociados.
