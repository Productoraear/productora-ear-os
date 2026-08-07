# 🔗 EAR OS — ARTIST BOOKING URL ARCHITECTURE (DIRECT & OPERATIONAL)

> **SSOT de Rutas Operativas de Reserva & Cobro:** Definición de URLs directas para descubrir, configurar, pagar, confirmar y rastrear contrataciones de Edwin Agudelo.

---

## 1. Mapeo de URLs Directas del Journey Operativo

| Path URL Explicito | Propósito | Entradas | Salidas CTAs | Herramienta / API | Estado |
|---|---|---|---|---|---|
| `/artistas/edwin-agudelo` | Perfil Maestro & Showreel | Landings / SEO / Catálogo | `/reservar/edwin-agudelo` | Prisma / ARTIST_PROFILE | `Bloqueado (Step 1.3)` |
| `/reservar/edwin-agudelo` | Configuración & Formulario Homenajeado | Ficha Artista / Landings | `/pagar/[reservationId]` | Booking Form Engine | `MAPPED` |
| `/reservar/edwin-agudelo/[service]` | Reserva Directa por Formato (ej. serenata-gala) | Ads / QR Directo | `/pagar/[reservationId]` | Booking Form Engine | `MAPPED` |
| `/pagar/[reservationId]` | Checkout & Pasarela Depósito (30%) | Formulario Configurado | `/gracias/[reservationId]` | Stripe PaymentIntent / Bizum | `MAPPED` |
| `/gracias/[reservationId]` | Recibo Inmutable & Confirmación | Payment Webhook Success | `/track/[token]` | Webhook Engine / PDF Gen | `MAPPED` |
| `/track/[token]` | Tracking GPS en Vivo Sin Login (Uber-Style) | Email / WhatsApp / SMS | Chat WhatsApp / Soporte | Fleet OS Live Dispatch | `MAPPED` |
