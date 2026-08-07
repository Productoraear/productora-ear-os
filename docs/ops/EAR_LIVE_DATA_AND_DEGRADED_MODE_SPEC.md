# ⚡ EAR OS — LIVE DATA & DEGRADED MODE SPECIFICATION

> **Especificación de Datos en Vivo y Modo Degradado:** Tratamiento de la falta de conectividad o telemetría incompleta en la flota de vehículos y equipos.

---

## 1. Estados de Conectividad de la Telemetría

- **LIVE (Verde):** Telemetría recibida en los últimos 30 segundos. Latencia < 50ms.
- **ESTIMATED (Amarillo):** Sin reporte GPS en los últimos 30-180 segundos. Posición calculada por velocidad media e itinerario teórico (Extrapolación).
- **DEGRADED (Naranja):** Sin reporte por > 3 minutos. Se muestra el aviso visible *"Pérdida temporal de telemetría - Mostrando última posición conocida"*.
- **STALE (Rojo):** Sin reporte por > 10 minutos. Pasa a estado crítico de incidencias.

## 2. Reglas del Modo Degradado (Fallback Determinista)
1. **No Ocultar la Falla:** Jamás inventar coordenadas ni silenciar un fallo de señal.
2. **Notificación Directa al Cliente:** Si el cliente consulta la URL de tracking durante un estado DEGRADED/STALE, el mapa muestra *"En trayecto según itinerario - Conexión GPS reestableciéndose"*.
3. **Alerta a Operaciones:** El dispatcher recibe una tarea prioritaria para contactar por voz/radio con el conductor del vehículo.
