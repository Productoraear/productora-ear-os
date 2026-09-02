# 📲 EAR OS — WHATSAPP & TELEGRAM NOTIFICATION FLOW

> **SSOT de Comunicaciones & Alertas Operativas:** Protocolo de mensajes automáticos al cliente vía WhatsApp (Twilio/Meta API) y alertas internas al equipo vía Telegram Bot API.

---

## 1. Matriz de Mensajes Automáticos al Cliente (WhatsApp)

| Evento / Hito | Disparador (Trigger) | Mensaje Tipo (Plantilla WhatsApp) | Canal |
|---|---|---|---|
| **Reserva Confirmada** | PaymentIntent Webhook Success | *"¡Hola {Nombre}! Tu reserva con Edwin Agudelo para el {Fecha} está CONFIRMADA. Ver recibo y contrato: {ReciboURL}. Sigue el estado en vivo: {TrackingURL}"* | WhatsApp Client |
| **Equipo en Camino** | Fleet OS Check-in "Salida Base" | *"¡Hola {Nombre}! El equipo de Edwin Agudelo va de camino a {Poblacion}. ETA estimado: {ETA}. Sigue el vehículo en vivo: {TrackingURL}"* | WhatsApp Client |
| **Llegada a Ubicación** | GPS Radius <500m | *"¡Hola! El grupo ha llegado a las inmediaciones. Iniciando prueba de sonido discreta."* | WhatsApp Client |
| **Fin de Actuación** | Fleet OS Check-in "Finalizado" | *"¡Gracias por confiar en Productora EAR! Tu resguardo final y certificado VIMUME están disponibles aquí: {FacturaURL}"* | WhatsApp Client |

---

## 2. Matriz de Alertas Operativas Internas (Telegram Bot)
- **Canal Telegram:** `@EarOsOperationsBot`
- **Alerta 1 (Nueva Reserva):** 🚨 *¡NUEVA RESERVA COBRADA!* — `Edwin Agudelo - Boda Aranjuez (127.05€ Deposit Paid)`.
- **Alerta 2 (Aviso de Salida):** 🚚 *DESPACHO FLEET OS* — `Vehículo salió de Madrid Base rumbo a Toledo (ETA: 45 min)`.
- **Alerta 3 (Incidencia / Retraso):** ⚠️ *ALERTA DE TRÁFICO* — `Retraso de +15 min detectado en A-4. Recomputando ETA dinámico en Tracking URL`.
