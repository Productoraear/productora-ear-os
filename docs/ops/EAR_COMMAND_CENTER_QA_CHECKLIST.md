# 📋 EAR OS — COMMAND CENTER QA CHECKLIST

> **Lista de Verificación de Calidad Operacional (QA):** Pruebas obligatorias para certificar la fiabilidad del centro de mando antes de cada despliegue.

---

## 1. Pruebas de Carga y Rendimiento
- [x] **Renderizado de Mapa:** Carga del dashboard sin congelamiento de UI en < 1.5 segundos.
- [x] **Gestión de Carga:** Manejo eficiente de +45.000 activos en la vista `/command-center`.
- [x] **Latencia de Red:** Monitoreo constante de latencia pings < 50ms.

## 2. Pruebas de Resiliencia y Fallback
- [x] **Desconexión Simulada:** Pérdida de señal GPS cambia la UI a `MODO DEGRADADO` sin errores de pantalla en blanco (0 React Crash).
- [x] **Datos Obsoletos:** Transcurridos 180s sin datos, el vehículo pasa automáticamente a `STALE`.
- [x] **Reconexión:** Al restablecer conexión, la UI reconcilia el historial de puntos sin duplicar waybills.

## 3. Pruebas de Seguridad y RBAC
- [x] **Verificación JWT:** Acceso bloqueado a endpoints privilegiados sin token válido.
- [x] **Aislamiento por Rol:** El perfil de cliente no puede visualizar datos financieros ni la ubicación de otras unidades.
