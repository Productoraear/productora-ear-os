---
paths:
  - "src/data/**"
  - "scripts/**"
  - "docs/**"
---
# REGLAS RAG & ZTM (ZERO-TOKEN MEMORY)
- La base cognitiva SSOT es `src/data/ear-rag-database.json`.
- Para procesar o minar archivos masivos (.pdf, .docx, .json grandes), escribe un script temporal en /scripts.
- Devuelve únicamente el resumen JSON comprimido (< 300 tokens) a la conversación.
