# 📊 EAR OS — ANALYTICS, DISPATCH & ALERTING SPECIFICATION

> **SSOT de Orquestación de Alertas & Telemetría:** Conexión del sistema de analítica y mensajería con Google Search Console, Microsoft Clarity, Trello, Telegram, WhatsApp y Stripe.

---

## 1. Naming & Convención de Eventos Telemétricos

| Canal / Plataforma | Evento / Disparador | Propósito | Naming del Evento |
|---|---|---|---|
| **Microsoft Clarity** | Click en "Reservar Fecha" | Medir intent de contratación | `click_reserve_date` |
| **Microsoft Clarity** | Abandono en Paso 2 Formulario | Detectar fricción en campos | `dropoff_step2_homage` |
| **Google Search Console** | Impresión/CTR en Landings Geo | Optimización de snippets SEO | `gsc_impression_geo` |
| **Stripe Webhooks** | PaymentIntent Succeeded | Trigger de recibo & orden | `payment_intent.succeeded` |
| **Telegram Bot** | Nueva Reserva o Cambio de Status | Alerta interna operadora | `tg_alert_booking_created` |
| **WhatsApp Client API** | Status "En Camino" Fleet OS | Notificación con Tracking URL | `wa_msg_dispatch_en_camino` |
| **Trello Board API** | Nueva Reserva Confirmada | Creación automática de Card | `trello_card_create_booking` |
