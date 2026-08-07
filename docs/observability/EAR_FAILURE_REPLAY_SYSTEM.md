# ⏪ EAR OS — FAILURE REPLAY SYSTEM

> **Sistema de Replay de Fallos:** Plataforma interna para visualizar y corregir interacciones fallidas del usuario con el RAG y el Checkout.

## 1. Workflow Operativo de Mejora Continua
1. **Detección Automática:** Cada 24h, el sistema agrupa los eventos `rag_generation_failed` y los abandonos de carrito de Leads > 50 pts (P1/P0).
2. **Replay Interface:** El dashboard carga el `session_id`, mostrando qué vio el usuario, qué buscó y qué contexto recuperó el sistema.
3. **Corrección Activa (RAG):** Si el fallo fue porque el RAG no tenía el precio actualizado de Toledo, el operador actualiza la base de conocimiento y dispara una reinyección.
4. **Validación:** El mismo caso que falló se corre contra el LLM de evaluación para confirmar que ahora es exitoso.
