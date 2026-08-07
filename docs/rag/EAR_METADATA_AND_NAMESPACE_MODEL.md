# 🏷️ EAR OS — METADATA & NAMESPACE MODEL

> **Modelo de Metadatos RAG:** Estructura de tags que acompaña a cada vector para permitir filtrado híbrido preciso y control de acceso (RBAC) en el motor de recuperación.

## 1. Esquema de Metadatos Obligatorio por Chunk

```json
{
  "tenant_id": "productora_ear",
  "artist_id": "edwin_agudelo",
  "vertical": "bodas",
  "document_type": "rider_tecnico",
  "geo_region": "espana",
  "language": "es",
  "access_level": "public", 
  "last_updated": "2026-08-01T00:00:00Z",
  "confidence_score": 1.0,
  "chunk_index": 4
}
```

## 2. Reglas de Filtrado Pre-Retrieval (Metadata Filtering)
- Si un usuario pregunta sobre tarifas en Francia, el Retriever aplica un pre-filtro duro: `geo_region IN ['francia', 'global']`.
- Si el usuario no está logueado, `access_level` DEBE ser `public` (jamás `internal` o `confidential`).
- Esto evita matemáticamente que el LLM alucine usando precios de España para un cliente de París o revele márgenes de beneficio internos.
