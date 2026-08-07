# 🚀 EAR OS — AUTOMATION & FOLLOW-UP PLAYBOOK

> **Playbook de Automatización:** Tácticas CRM sin fricción para recuperar presupuestos no pagados y hacer upselling a clientes existentes.

## 1. Recuperación de Presupuesto Abandono (Cart Abandonment)
- **Trigger:** Presupuesto generado, pero Pago de Señal (Stripe/Bizum) == FALSE después de 2 horas.
- **Acción:** Mensaje WhatsApp Plantilla.
  - *"¡Hola {Nombre}! Tienes un presupuesto pendiente para {Ciudad}. ¿Puedo ayudarte a resolver alguna duda para asegurar la fecha de tu evento?"*

## 2. Recordatorio Pre-Evento (Operativo)
- **Trigger:** 48 horas antes de la fecha confirmada.
- **Acción:** Mensaje WhatsApp Plantilla.
  - *"¡Falta muy poco para el evento de {Homenajeado}! Te recordamos que nuestro equipo llegará aprox. 30 min antes. Si hay algún cambio de acceso, avísanos respondiendo a este mensaje."*

## 3. Post-Evento & Review Request (Crecimiento)
- **Trigger:** 24 horas después del Check-Out de Fleet OS.
- **Acción:** Correo / WhatsApp.
  - *"¡Esperamos que el evento haya sido un éxito total! ¿Nos regalarías 1 minuto para dejarnos una reseña? [Link a Google My Business / Bodas.net]. Esto nos ayuda inmensamente."*
