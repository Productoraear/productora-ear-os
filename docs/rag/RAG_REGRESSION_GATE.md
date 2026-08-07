# 🚦 EAR OS — RAG REGRESSION GATE SPECIFICATION

> **Especificación del Gate de Regresión RAG (CI/CD):** Protocolo de bloqueo automático para impedir fusiones de código o despliegues si la calidad de recuperación del RAG decae.

---

## 1. Reglas del Gate de Regresión

En cada pipeline de CI/CD o build de Vercel, se ejecuta la suite de evaluación sobre `RAG_GOLDEN_DATASET.md`.

```
IF Recall@5 < 95.0% OR Groundedness < 95.0% OR HallucinationRate > 5.0%:
    FAIL BUILD
    EMIT ALERT "❌ RAG REGRESSION DETECTED: Groundedness threshold breached."
    BLOCK MERGE TO MAIN
```

## 2. Thresholds Inmutables

- `RECALL_MIN_THRESHOLD = 0.95`
- `PRECISION_MIN_THRESHOLD = 0.95`
- `GROUNDEDNESS_MIN_THRESHOLD = 0.95`
- `CITATION_COVERAGE_MIN_THRESHOLD = 0.95`
- `MAX_HALLUCINATION_RATE = 0.05`
