# 🚦 EAR OS — AI & COMMERCE RELEASE POLICY

> **Disciplina de Release (Despliegue):** Protocolo estricto para proteger la estabilidad operacional. Ninguna mejora estética o técnica debe comprometer el flujo de caja ni la integridad del RAG.

## 1. Criterios Mínimos de Aceptación (Gates)
Antes de fusionar código a `main` o desplegar a Producción, DEBEN cumplirse:
- **Build Pass:** `npx tsc --noEmit` y `npm run build` limpios.
- **Eval RAG Pass:** Groundedness > 95% sobre el Golden Dataset (No regresión).
- **Checkout Pass:** Webhooks idempotentes de Stripe probados localmente/preview.
- **Rollback Listo:** Identificar el commit estable anterior en Git.

## 2. Estrategia de Feature Flags y Rollout
- Lanzamientos críticos (ej. nuevo flujo de pago, nuevo modelo LLM) salen apagados (`isEnabled: false`) en producción.
- Activación parcial (Staged Rollout) solo para el Tenant base (`productora_ear`) antes de abrir a otros Tenants o marcas blancas.
