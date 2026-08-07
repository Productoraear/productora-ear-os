# 👁️ EAR OS — OBSERVABILITY & TRACING SPECIFICATION

> **Observabilidad Total:** Telemetría integral de la cadena RAG y conversiones comerciales para entender el porqué de cada fallo o acierto.

## 1. Trazabilidad del Pipeline RAG (Langfuse / Phoenix)
Cada interacción del usuario debe trazar:
- `trace_id` & `session_id`
- `original_query` (lo que el usuario escribió).
- `rewritten_query` (si el RAG la optimizó).
- `retrieved_chunks` (IDs y scores de similitud).
- `prompt_tokens` & `completion_tokens` (para control de costes).
- `latency_ms` (Tiempo total de respuesta).
- `generation_output` (Respuesta final).

## 2. Failure Replay System
- Cualquier interacción marcada como "Thumbs Down" por el usuario o que dispare un Fallback, se envía al dashboard de *Failure Replay*.
- El equipo operativo puede revisar el Trace, ver por qué falló el Retrieval (ej. documento faltante) y añadir el conocimiento faltante al RAG.
