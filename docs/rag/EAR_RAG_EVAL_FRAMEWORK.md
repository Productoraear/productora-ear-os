# ⚖️ EAR OS — RAG EVALUATION FRAMEWORK

> **Framework de Evaluación Continua RAG:** Metodología cuantitativa para asegurar que EAR OS nunca miente, no inventa precios y recupera el contexto correcto.

## 1. Métricas de Evaluación Core
- **Recall@K (k=3):** ¿Está el documento correcto (ej. tarifa exacta) entre los top 3 resultados recuperados?
- **Precision@K:** De los top 3 recuperados, ¿cuántos son realmente relevantes para la query?
- **Groundedness (Fidelidad):** ¿La respuesta generada por el LLM se basa 100% en el contexto recuperado, sin alucinar? (Evaluado por un LLM-as-a-Judge, ej. GPT-4).
- **Citation Precision:** ¿El LLM cita correctamente el chunk exacto de donde sacó la información?

## 2. CI/CD Regression Testing
- Cada vez que se actualiza el prompt base, se cambian los embeddings (ej. pasando de `text-embedding-3-small` a `large`), o se altera la lógica de chunking, se debe correr un test sobre el **Golden Dataset**.
- **Gate:** Si la métrica de Groundedness cae por debajo del 95%, el build falla y no se despliega.
