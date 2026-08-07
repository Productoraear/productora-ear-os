# 🚨 EAR OS — ALERT & DISPATCH RULES

> **Reglas de Alertas y Despacho:** Motor de reglas condicionales para transformar la visibilidad del panel en acciones operacionales automáticas.

---

## 1. Reglas de Despacho Automático

### A. Geofencing Entry (Llegada al Evento)
- **Trigger:** Vehículo entra en un radio de 500 metros del destino asignado en el `Waybill`.
- **Acción:** 
  1. Cambia el estado a `ARRIVED_ON_SITE`.
  2. Envía notificación WhatsApp al cliente: *"El equipo de Productora EAR ha llegado a las instalaciones."*
  3. Desbloquea la hoja de ruta de montaje en la app del artista.

### B. Mantenimiento Preventivo Alcanzado
- **Trigger:** Horas de uso de generador > 100 horas.
- **Acción:**
  1. Cambia el estado del activo a `NEEDS_MAINTENANCE`.
  2. Desactiva la disponibilidad del activo para nuevas misiones.
  3. Genera orden de servicio para el equipo de taller.

### C. Salida de Ruta / Inactividad Anómala
- **Trigger:** Unidad detenida en carretera no planificada por > 15 minutos.
- **Acción:** Dispara alerta sonora en la consola del Dispatcher y mensaje P0 Telegram.
