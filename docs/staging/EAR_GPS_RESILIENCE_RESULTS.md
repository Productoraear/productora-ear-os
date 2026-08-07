# 🛰️ EAR OS — GPS RESILIENCE & DEAD RECKONING TEST RESULTS

> **Pruebas de Resiliencia GPS:** Simulación de fallos de cobertura, desconexión brusca en carretera y reconciliación de datos offline en Fleet OS.

---

## 1. Escenarios de Prueba GPS Ejecutados

### Escenario 1: Pérdida Total de Señal GPS (> 180s)
- **Comportamiento:** La unidad pasa automáticamente de `LIVE` a `DEGRADED`.
- **UI:** La línea continua de ruta se vuelve punteada amarilla con la etiqueta visible *"Posición estimada - Pérdida de cobertura en A-6 km 45"*.
- **Resultado:** **PASS**. Cero fallos silenciosos ni congelamiento del mapa.

### Escenario 2: Reconexión Brusca tras Túnel
- **Comportamiento:** Al recibir el primer ping tras 4 minutos sin datos, el servidor ejecuta el algoritmo de reconciliación offline.
- **Resultado:** **PASS**. La ruta histórica se reescribe de forma continua sin saltos erráticos ni pérdida de waybills.

### Escenario 3: Data Stale (> 10 mins)
- **Comportamiento:** Se marca en rojo `STALE` y dispara alerta P0 al Dispatcher.
- **Resultado:** **PASS**. Registro inmutable en el Audit Log.
