# 🛰️ EAR OS — COMMAND CENTER STATE AUDIT

> **Auditoría de Estado del Centro de Mando Logístico:** Clasificación rigurosa del origen de cada métrica y componente visual en el dashboard operacional (`/centro-mando` y `/command-center`).

---

## 1. Clasificación del Origen de Datos (Data Origin Matrix)

| Componente Visual | Métrica / Elemento | Origen del Dato | Tipo de Fuente | Nivel de Auditoría |
|:---|:---|:---|:---|:---|
| **Latencia de Red** | 12ms ESTABLE | Telemetría en Vivo | Server Health Ping (API) | ✅ Auditable |
| **GPS Core Status** | Active (Ibiza/Madrid/Barcelona) | Telemetría / Inferencia | Prisma Waybills & Drivers | ✅ Auditable |
| **Alertas Mantenimiento** | Generador 150KVA (Filtro Aceite) | Sensor / Log Manual | Asset Maintenance Register | ⚠️ Requiere Telemetría |
| **Próximos Despliegues** | Rigging Gala Arts (T-MINUS 14:00H) | Confirmado en BD | Prisma Bookings / Waybills | ✅ Auditable |
| **Arsenal Técnico** | 45.280 Activos Totales | Base de Datos | Prisma DB / Postgres | ✅ Auditable |
| **Fincas Auditas** | 1.927 Ubicaciones | Registro Interno | Database Verified | ✅ Auditable |

## 2. Eventos que Disparan Alertas Automáticas
1. **Pérdida de Señal GPS (> 120s):** Pasa la unidad a estado `DEGRADED_OFFLINE`.
2. **Retraso en ETA (> 15 mins):** Dispara alerta P0 Telegram al Stage Manager y al Cliente.
3. **Mantenimiento Preventivo Alncanzado:** Bloquea la reasignación de un generador o vehículo en el planificador de misiones.
