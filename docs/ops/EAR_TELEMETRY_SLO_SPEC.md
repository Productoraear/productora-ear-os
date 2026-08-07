# ⏱️ EAR OS — TELEMETRY SLO SPECIFICATION

> **Objetivos de Nivel de Servicio (SLO):** Métricas cuantitativas para garantizar la fiabilidad del centro de mando logístico y la red de tracking de artistas.

---

## 1. Métricas SLO Obligatorias

| Métrica SLO | Estándar Target | Umbral de Alerta | Acción Correctiva |
|:---|:---|:---|:---|
| **Frescura del GPS (GPS Freshness)** | < 15 segundos | > 60 segundos | Re-query ping a unidad Fleet OS |
| **Latencia API Dashboard** | < 100ms (P95) | > 500ms | Failover a réplica o caché Edge |
| **Disponibilidad del Panel (Uptime)** | 99.9% | < 99.5% | Auto-restart del servicio en Vercel |
| **Tiempo de Alerta de Incidencia** | < 30 segundos | > 2 minutos | Escalado P0 a canal Telegram Admin |
| **Timeout de Telemetría Obsoleta** | 180 segundos | > 300 segundos | Marca automática a `DEGRADED_MODE` |

## 2. Política de Reconexión de Datos
- **Exponential Backoff:** Intentos de reconexión a 2s, 4s, 8s, 16s hasta un máximo de 5 reintentos.
- **Circuit Breaker:** Si la API de mapas/geolocalización falla 3 veces seguidas, se desactiva temporalmente el re-renderizado 3D para evitar congelamiento de UI en el navegador.
