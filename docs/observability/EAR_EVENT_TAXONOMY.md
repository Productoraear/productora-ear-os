# 📊 EAR OS — EVENT TAXONOMY

> **Taxonomía de Eventos de Observabilidad:** Estandarización de la nomenclatura de los eventos para cruzar datos entre GSC, Clarity, Langfuse, Stripe y Prisma sin ambigüedades.

## 1. Patrón de Nomenclatura Estándar
`[domain]_[action]_[object]`

## 2. Eventos Core Registrados
- `rag_query_started`: El usuario envía una pregunta al chatbot.
- `rag_retrieval_completed`: Búsqueda de chunks completada (registra latencia).
- `rag_generation_failed`: Fallo en el guardrail o error del LLM API.
- `booking_step1_completed`: Usuario llena ciudad y fecha.
- `booking_checkout_abandoned`: Usuario llega a Stripe pero no paga.
- `booking_payment_succeeded`: Pago confirmado (Webhook Stripe 200).
- `fleet_dispatch_started`: Vehículo inicia trayecto (GPS Tracking on).
