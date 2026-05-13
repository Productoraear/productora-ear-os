# 📜 DIRECTIVA DE DISEÑO S-CLASS: REACTOR VIMUME & ASTRA KPI (STITCH-002)

**DE:** Arquitecto Maestro (Antigravity)
**PARA:** Director de Arte Frontend (Stitch)
**ASUNTO:** Transmutación Visual de Motores Neurales y Clínicos.

---

## 🏛️ 1. REACTOR VIMUME: DASHBOARD DE IMPACTO
**Archivo:** `src/modules/SClassScreens/VimumeDashboard.tsx`
**Propósito:** Visualización del ROI Social y el progreso de estimulación 40Hz.

### 🎨 Especificaciones Estéticas:
- **Paleta:** Aura Onyx base (#050505).
- **Acento Primario:** Púrpura Profundo (`#7c3aed`) y Púrpura Eléctrico (`#a855f7`).
- **Layout:** Glass-cards con `backdrop-blur-3xl`.

### 🧠 Integración de Motor:
- **Import:** `import { VimumeEngine, VIMUME_PROTOCOLS } from '@/lib/engines/VimumeEngine';`
- **Componentes Requeridos:**
  1. **ICP Gauge:** Un medidor circular de Impacto Cognitivo Proyectado. Usa `VimumeEngine.calculateICP(age, sessions, engagement)`.
  2. **Session Timeline:** Una línea de tiempo vertical de las 10 sesiones usando `VIMUME_PROTOCOLS`.
  3. **Frequency Visualizer:** Animación de ondas (Framer Motion) que simule los **40Hz (Gamma)** cuando una sesión esté activa.

---

## 🧠 2. ASTRA KPI PANEL: MONITOR DE PROBABILIDAD
**Archivo:** `src/modules/SClassScreens/AstraKPIPanel.tsx`
**Propósito:** Panel de control de la IA para visualizar la probabilidad de cierre y storyselling.

### 🎨 Especificaciones Estéticas:
- **Paleta:** S-Class Gold (`#d4af37`).
- **Tono:** "The Great Divide" (Contraste extremo entre oscuridad y luz dorada).

### 🧠 Integración de Motor:
- **Import:** `import { generateAstraVerdict, calculateAlphaScore } from '@/lib/utils/AstraCore';`
- **Componentes Requeridos:**
  1. **Alpha Probability Display:** Un número grande, itálico y elegante que muestre el `%` de probabilidad usando `calculateAlphaScore(orders)`.
  2. **Neural Verdict Box:** Un cuadro de texto de alta densidad (Aura Onyx) que renderice el output de `generateAstraVerdict(...)`.
  3. **Storyselling Badges:** Etiquetas que indiquen el estado de las leyes: *Authority*, *The Great Divide*, *Midnight Luxury*.

---

## 🛡️ REGLAS DE ORO PARA STITCH:
1. **Framer Motion Obligatorio:** Todo cambio de estado (hover, click, data loading) debe ser fluido.
2. **Tipografía:** Usa `Inter` para datos técnicos y una variante itálica de peso fuerte para los KPIs.
3. **Soberanía del Build:** No rompas las interfaces definidas en `SClass.d.ts`.
4. **Validación:** Al terminar, ejecuta `npm run build`.

**IGNICIÓN VISUAL AUTORIZADA.** 🚀🔒
