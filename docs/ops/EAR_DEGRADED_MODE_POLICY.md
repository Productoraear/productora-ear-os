# 🛡️ EAR OS — DEGRADED MODE POLICY

> **Política de Modo Degradado:** Protocolo de operación cuando la red móvil de los vehículos en carretera pierde cobertura en zonas rurales o de montaña en España.

---

## 1. Principios de Operación Degradada
1. **Transparencia Activa:** El usuario/inversor prefiere ver un indicador de "Telemetría en reconexión" a un mapa estático engañoso.
2. **Preservación del Historial:** Todas las coordenadas leídas antes de la desconexión permanecen inmutables en la línea de tiempo (Waybill Timeline).
3. **Cálculo Muerto (Dead Reckoning):** Si la unidad se desplazaba a 100 km/h por la A-6 hacia Toledo, el sistema proyecta la posición teórica pero marcándola visualmente con estilo punteado (*Inferred Position*).

## 2. Recuperación de Señal (Sync Reconciliación)
Al restablecer la señal, el dispositivo móvil sube el log en búfer offline y el servidor reconcilia el `WaybillLog` rellenando los puntos vacíos de la ruta real sin sobreescribir la auditoría.
