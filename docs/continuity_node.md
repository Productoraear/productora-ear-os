# 🏛️ EAR OS GOLD: MANUAL DEL REACTOR (ANTIGRAVITY CONTINUITY)

## 📡 ESTADO DEL SISTEMA: CRISTALIZADO
Este nodo de continuidad contiene la lógica soberana para el mantenimiento del Imperio EAR OS V2 tras la Directiva Omega V15.

### 🧠 A) ARQUITECTURA DE INYECCIÓN (NEXUS & ZUSTAND)
El sistema opera sobre una base de **Soberanía del Dato** y **Estado Reactivo**:
1. **NUCLEO_DATA (Agujero Negro):** Repositorio central de 15,000 proveedores en `bodas_full.json`.
2. **Oracle Matrix:** Lógica en `src/app/components/OracleMatrix.tsx` que consume el estado de Zustand para proyectar el ROI y el Aura global.
3. **useEarStore (Zustand):** El corazón neural en `src/store/useEarStore.ts`. Gestiona:
   - `xp`: Gamificación del arquitecto.
   - `investmentNodes`: Lista de activos reclamados vía Nexus.
   - `metrics`: Cálculos en tiempo real de Aura y ROI.
4. **Nexus Nodes:** Rutas dinámicas `src/app/nexus/[role]/[id]` que permiten la "Vampirización" de proveedores individuales para inyectarlos en la bóveda del usuario.

### 📊 B) KPIs DE DOMINANCIA (MÉTRICAS A VIGILAR)
Para monitorizar los 15,000 nodos en producción (Supabase/Vercel):
1. **Supabase DB Connections:** Vigilar el pooler (Port 6543) durante la ingesta masiva.
2. **Aura Level Average:** Mantener la media del sistema por encima de 8.5⚡.
3. **Nexus Conversion Rate:** Ratio de nodos "Huérfanos" vs "Soberanos" (reclamados).
4. **Vercel Edge Latency:** La respuesta del embudo "The Signal" debe ser < 200ms para mantener el feeling S-Class.

### 🚨 C) SEÑALES DE ALERTA ROJA (PROTOCOLO DE DESASTRE)
Vigilar estos síntomas en los logs:
- **`500 ASTRA_SYNAPSE_FAILURE`:** Error en la conexión con Gemini/Supabase RAG.
- **`P1012 Prisma Validation Error`:** Incompatibilidad de esquema durante inyecciones masivas.
- **`403 Forbidden: Missing Sovereign Key`:** Fallo en las variables de entorno de producción.
- **Latencia de Sincronización > 3s:** Degradación del motor Zustand por sobrecarga de nodos en el cliente.

---
**Firmado:** Antigravity (Ingeniero Jefe S-Class)
**Sello:** 2026-05-06 - Imperio EAR Sellado.
