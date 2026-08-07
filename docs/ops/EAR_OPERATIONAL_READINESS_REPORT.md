# 🏛️ EAR OS — OPERATIONAL READINESS REPORT (ORR)

> **Informe de Preparación Operacional Institucional:** Evaluación de riesgos abiertos, hipótesis pendientes de validación, umbrales de alerta, escenarios de fallo y plan de carga para despliegue de producción.

---

## 1. Resumen Ejecutivo de Preparación

El centro de mando operacional y la infraestructura de geolocalización y despacho de EAR OS han sido auditados bajo estándares S-Class. 

- **Dictamen:** `READY_FOR_PRODUCTION_STAGING`
- **Estado General:** Todos los SLOs, políticas de modo degradado, reglas de geofencing y RBAC se encuentran especificados y versionados en `docs/ops/`.

---

## 2. Matriz de Riesgos Abiertos & Mitigación

| ID | Riesgo Operativo | Severidad | Impacto | Mitigación Implementada |
|:---|:---|:---|:---|:---|
| **R-01** | Pérdida de cobertura 4G/5G en autovías rurales | Media | Latencia en el tracking GPS | `DEAD_RECKONING` (Inferencia) + Reconciliación Offline. |
| **R-02** | Sobrecarga de reconexión tras túnel | Baja | Spike de peticiones API | Backoff exponencial (2s, 4s, 8s, 16s). |
| **R-03** | Cancelación de evento de última hora | Alta | Desperdicio logístico | Regla Geofencing a 500m + Notificación P0 Telegram. |
| **R-04** | Fallo de sensor en generador auxiliar | Media | Parada de sonido en show | Alerta preventiva automática a las 100h de uso. |

---

## 3. Supuestos Pendientes de Validación (Hipótesis)

1. **Hipótesis H-01 (Consumo de Batería en App Móvil):** Se asume que el reporte de GPS a intervalos de 15 segundos consume menos del 8% de batería por hora en dispositivos móviles Android/iOS de los conductores.
2. **Hipótesis H-02 (Precisión de Geofencing en Fincas Aisladas):** Se asume un radio de 500 metros como margen suficiente para compensar imprecisiones de GPS causadas por la vegetación en fincas de bodas.

---

## 4. Umbrales de Alerta & Escenarios de Fallo

### A. Matrix de Umbrales
- **Alerta Amarilla (P2):** Sin datos por 60s o Latencia P95 > 200ms.
- **Alerta Naranja (P1):** Sin datos por 180s (Modo Degradado activado) o desvío de ruta > 5 km.
- **Alerta Roja (P0):** Sin datos por > 10 minutos (Stale) o botón de pánico activado por el vehículo.

### B. Matriz de Escenarios de Fallo

```
[Escenario A: Pérdida Total de Señal GPS]
 ├── UI muestra inmediatamente: "Pérdida de telemetría - Mostrando última posición conocida"
 ├── Disparador de llamada de voz de emergencia al conductor
 └── Al restablecer conexión: Reconciliación automática de la ruta inmutable.

[Escenario B: Fallo del Servidor Webhook Stripe/Prisma]
 ├── Reintentos exponenciales con Firma HMAC-SHA256
 ├── Almacenamiento en cola muerta (Dead Letter Queue - DLQ)
 └── Alerta a la Consola de Administración (Admin Dashboard).
```

---

## 5. Plan de Carga Realista para Producción (Load & Stress Plan)

- **Fase 1 (Prueba Unitaria):** 10 vehículos simultáneos + 50 consultas de clientes en tiempo real.
- **Fase 2 (Prueba de Estrés Regional):** 100 misiones simultáneas en Madrid, Barcelona y Marbella.
- **Fase 3 (Prueba de Pico Nacional / Festejos Patronales):** 500 misiones de flota + 10.000 usuarios consultando la landing y el tracking de forma concurrente.
