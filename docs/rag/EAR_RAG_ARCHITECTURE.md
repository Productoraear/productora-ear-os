# 🧠 EAR OS — RAG CORE ARCHITECTURE

> **Arquitectura de Recuperación Aumentada por Generación (RAG):** Motor de inteligencia central para resolver dudas de clientes, extraer datos de disponibilidad y orquestar cierres basados en conocimiento institucional.

## 1. Topología del Sistema RAG
- **Ingestion Engine:** Crawlers de PDFs (riders, contratos), Notion (SOPs), y BD Prisma (disponibilidad, tarifas).
- **Vector Database:** Pinecone / Qdrant con separación estricta por Tenant (Namespace).
- **Retrieval System:** Búsqueda híbrida (Dense Vector + BM25 Sparse Keyword).
- **Reranker Engine:** Cohere Rerank o BGE-Reranker para elevar precisión de top-K.
- **Generation:** GPT-4o / Claude 3.5 Sonnet con Prompt Inmutable y Citas Obligatorias.

## 2. Flujo de Consulta (Query Flow)
1. **Query Input:** "¿Tienen disponibilidad para el 15 de Mayo en Madrid para 50 personas?"
2. **Intent Classification & Routing:** Determina si es una consulta de FAQ (Vector) o Transaccional (SQL/Prisma).
3. **Hybrid Retrieval:** Recupera chunks de *Rider Técnico*, *Precios Madrid*, y *Condiciones*.
4. **Context Assembly & Prompt:** Inyecta chunks ordenados + metadatos + reglas de tono.
5. **Generation & Guardrails Check:** Genera respuesta, verifica PII y alucinaciones.
6. **Output:** Respuesta al usuario con enlace directo a Checkout o Agente.
