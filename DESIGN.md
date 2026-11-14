# DESIGN.md — EAR OS v14.1 · CAPA 3: ESTÁNDAR DE DISEÑO, TASTE ENGINE & CANVAS

Gobernanza visual orientada a conversión, cero fricción visual y justificación de pricing soberano.

---

## 1. Filosofía Estética: OLED Pura & Lujo Silencioso
- **Fondo Primario (`bg-void`):** `#030305` (Inmersión OLED absoluta).
- **Fondo Secundario (`bg-deep`):** `#050507` (Elevación de paneles).
- **Superficie de Tarjetas (`bg-surface`):** `#09090D` con opacidad al 80%, micro-bordes `border-white/10` y `backdrop-blur-md`.
- **Acentos Funcionales Únicos:**
  - **Oro Soberano (`#ECB613`):** Transacciones, depósitos Stripe, gala solista, contratos B2G.
  - **Cyan Tecnológico (`#00E5FF`):** Telemetría en directo, GPS de flota, conectividad de agenda.
  - **Rubí de Alerta (`#FF2B44`):** Urgencia, fechas bloqueadas, avisos acústicos.
- **Regla Anti-Slop (9 Pases de Redlining):**
  - Prohibidos emojis como iconografía de interfaz (uso exclusivo de `lucide-react` con `strokeWidth={1.5}`).
  - Prohibidos degradados morado/azul (`from-purple-600 to-indigo-600`) y desenfoques decorativos abstractos (`blur-3xl`).
  - Prohibido el uso de `w-screen` (usar siempre `w-full overflow-x-hidden`).
  - Soporte de modo oscuro y modo claro global preservando ratios de contraste institucionales.

---

## 2. Jerarquía Tipográfica & Rendimiento Zero-CLS
Carga obligatoria mediante `next/font`:
- **Display / Títulos:** `Syne` (Pesos 600, 700, 800) para exclusividad e impacto.
- **Cuerpo de Lectura:** `Inter` (Pesos 400, 500) con espaciado amplio para lectura cómoda en móviles.
- **Datos y Céntimos:** `JetBrains Mono` para cotizaciones, céntimos enteros, CPVs y hashes SHA-256.
- **Presupuesto CLS:** `CLS = 0.000` en rutas de conversión (máximo absoluto 0.05). Skeletons geométricos obligatorios con reserva de altura (`min-h-[xxx]`).

---

## 3. Protocolo Gráfico y Canvas 2D
- **Three.js (WebGLRenderer):** Componentes 3D limitados a lo verificado en `package.json` (`three@^0.186.0`, `@react-three/fiber`, `@react-three/drei`). Carga diferida obligatoria con `next/dynamic(..., { ssr: false })` y pausa por `IntersectionObserver`.
- **Lienzos 2D Ligeros (Seating Planner & Nube de Boda):** Renderizado en Canvas 2D y SVG nativo para garantizar `INP < 50 ms` sin saturar el hilo principal.
- **Accesibilidad:** Alternativa estática inmediata cuando el sistema detecte `prefers-reduced-motion`.

---

## 4. Los 4 Momentos WOW de Conversión
1. **`/experiencia`:** Simulador Acústico 2D/SVG interactivo (referencia voluntaria Ley 37/2003, ≤75 dB SPL, 12 W/pax).
2. **`/reservar/solista`:** CTA de contratación directa con depósito Price-Lock SHA-256 (100 € deducibles).
3. **`/licitaciones`:** Tablero territorial B2G (<14.250 € Art. 118 LCSP), códigos DIR3 y sesión VIMUME incluida.
4. **`/seating-planner`:** Diseñador interactivo de mesas (estándar Pulpetti), aforo dinámico de 2 a 12 plazas, RSVP y exportación de listas de entrada en PDF A4 vía CSS Print.

---

## 5. Contact-Gate & Accesibilidad
- Los teléfonos directos de proveedores nunca se exponen en el DOM público; se protegen mediante `maskedPhone` o canalizan a la Centralita Oficial (+34 693 693 048).
- Ratios de contraste WCAG 2.2 AA (mínimo 4.5:1) y AAA (7:1) auditables mediante `npm run audit:contrast:core`.
