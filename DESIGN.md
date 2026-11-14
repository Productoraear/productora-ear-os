# ════════════════════════════════════════════════════════════════════════════════
# DESIGN.md — EAR OS v14.0 · CAPA 3: ESTÁNDAR DE DISEÑO, TASTE ENGINE & CANVAS
# GOBERNANZA VISUAL · RENDIMIENTO OFF-MAIN-THREAD · CONVERSIÓN S-CLASS
# NORMA VIVA: Vinculada a AGENTS.md v12.0 y .clinerules V12_OMEGA_DIAMANTE
# FASE: REFINAMIENTO — Solo se documenta lo que el código renderiza con solvencia.
# ════════════════════════════════════════════════════════════════════════════════

## 1. PROPÓSITO SUPREMO: CONVERSIÓN & JUSTIFICACIÓN DE PRECIO
Todo fotograma renderizado en EAR OS cumple una única función de negocio: **cerrar ventas, eliminar fricción visual y justificar el pricing soberano**.
- Prohibido el 3D o diseño puramente decorativo sin impacto en la conversión (AF-4: cifra o elemento sin fuente se retira).
- Objetivo de telemetría: Reducir el rebote transformando el recorrido del usuario en una experiencia institucional fluida, accesible y de alta confianza.
- **Principio de Fase de Refinamiento:** Se documenta únicamente lo que el código implementa en disco con solvencia y verifica Exit 0. Las aspiraciones arquitectónicas pendientes van a `.antigravity/specs/`, no a esta norma viva.

---

## 2. PALETA OLED PURA (TASTE ENGINE S-CLASS)
Fondos ultra-profundos optimizados para displays OLED y contraste absoluto:

| Token | Código HEX | Rol y Significado Semántico |
|---|---|---|
| `bg-void` | `#030305` | Fondo primario ultra profundo (inmersión total) |
| `bg-deep` | `#050507` | Fondo secundario / elevación de paneles y tarjetas |
| `bg-surface` | `#09090d` | Fondo de contenedores con transparencia al 80% (`bg-[#09090d]/80`) |
| `accent-gold` | `#ecb613` | Acento Primario: Dinero, depósitos Stripe, gala solista, contratos B2G |
| `accent-ruby` | `#FF2B44` | Acento Alerta: Urgencia, fechas bloqueadas, bypass crítico |
| `accent-cyan` | `#00E5FF` | Acento Técnico: Telemetría en tiempo real, ISRC, protocolo 40 Hz VIMUME |

**Reglas Inmutables de Color:**
1. Prohibidos terminantemente los grises lavados y degradados pastel violeta/azul (AI Slop).
2. Protocolo UNSLOP (9 Pases de Redlining):
   - Prohibido el uso de emojis (🚀, 🔥, etc.) como iconografía de interfaz. Uso exclusivo de `lucide-react`.
   - Cero gradientes genéricos morado/azul (`from-purple-600 to-indigo-600`) ni halos borrosos `blur-3xl`.
   - Cero Slop Copy: sustituir adjetivos hinchados por datos de ingeniería, céntimos y plazos reales.
   - Secuencia de entrega obligatoria: Espaciado -> Color -> Iconos -> Copy -> Tipografía -> Topología fija -> Micro-bordes -> Visuales de producto -> Movimiento sutil.
3. Un solo color de acento por vista o sección: la dispersión cromática destruye la jerarquía visual.
4. Prohibido el uso de `w-screen` (genera scrollbar horizontal parásito); usar siempre `w-full overflow-x-hidden`.

---

## 3. JERARQUÍA TIPOGRÁFICA & RENDIMIENTO ZERO-CLS
Uso obligatorio de `next/font` para garantizar carga asíncrona optimizada y **CLS ≤ 0,05**:

- **Syne (`font-syne`):** Tipografía Display para títulos de gran impacto, titulares de gala y nombres de artistas.
- **Inter (`font-sans`):** Tipografía de lectura para cuerpos de texto, descripciones y navegación (padding vertical generoso `py-16+`).
- **JetBrains Mono (`font-mono`):** Tipografía técnica obligatoria para cifras monetarias en céntimos, telemetría, ISRC, códigos CPV y hashes SHA-256.

**Protocolo Anti-FOUT / Anti-CLS:**
- Toda fuente se precarga en el layout raíz con swap controlado.
- Cero saltos de línea al hidratar: contenedores de texto con altura de línea fija (`leading-tight`, `leading-relaxed`).

---

## 4. TOPOLOGÍA DE COMPONENTES & MICRO-INTERACCIONES
- **Estructura Base:** `rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md`.
- **Transiciones:** `transition-all duration-300 ease-out`.
- **Regla Estricta de Animación GPU:** Animaciones exclusivamente basadas en `transform` y `opacity`.
  * Prohibido animar `height`, `width`, `top`, `left`, `margin` o `padding` (causantes de reflow y layout shift).
- **Reserva Geométrica:** Todo elemento multimedia, iframe o banner dinámico debe reservar su caja geométrica de antemano mediante `aspect-ratio` o `min-h-[xxx]`.

---

## 5. PROTOCOLO GRÁFICO (THREE.JS + CANVAS SVG/2D — STACK VERIFICADO EN DISCO)
- **Stack Técnico Verificado:** `three@^0.186.0` + `@react-three/fiber@^9.7.0` + `@react-three/drei@^10.7.9`.
  Estos paquetes existen en `package.json` y son los únicos autorizados para efectos 3D.
- **Uso de GPU Declarado como Aspiracional (Pendiente RUM):**
  * Los componentes `AuraMatrixCanvas.tsx`, `prismaDiamondScene.worker.ts` y `LatticeColibriHero3D.tsx`
    implementan Three.js con canvas DOM estándar (`WebGLRenderer`).
  * La arquitectura `OffscreenCanvas + Worker` está especificada en
    `.antigravity/specs/ARCHITECT_DIRECTIVE_SOTA_2026_v6.md` como objetivo de Fase 3.
    **No se documenta aquí como estándar de producción hasta que el RUM de campo valide INP < 50 ms.**
  * Prohibido referenciar `navigator.gpu`, `WebGPU` o `GPUAdapter` en código de producción
    hasta que el hito esté cerrado con evidencia de arnés ejecutable (Exit 0).
- **Lienzos SVG/Canvas Puros (Nube de Boda / Seating Planner):**
  * El Seating Planner (`/seating-planner`) y la "Nube de Boda" usan canvas 2D con
    `requestAnimationFrame` nativo. Sin dependencias externas de animación.
  * Prohibido saturar el hilo principal con `setInterval` o bloqueos síncronos en canvas.
  * Presupuesto de interactividad: INP < 100 ms objetivo; < 50 ms meta.
- **Fallback Accesible:** Alternativa estática 2D obligatoria para usuarios con
  `prefers-reduced-motion` o sin GPU compatible.
- **Carga On-Demand:** Todo componente con Three.js usa `next/dynamic(..., { ssr: false })`.
- **Pausa Inteligente:** `IntersectionObserver` pausa la animación cuando el canvas sale del viewport.

---

## 6. LOS 4 MOMENTOS WOW DE CONVERSIÓN S-CLASS

| # | Ruta Canónica | Experiencia Visual S-Class | Retorno de Negocio / Marco Legal |
|---|---|---|---|
| **1** | `/experiencia` | Simulador Acústico 2D/SVG con tabla de presión SPL por formato y aforo. | Herramienta técnica voluntaria. Referencia Ley 37/2003 (< 75 dB SPL, 12 W/pax) sin promesas contractuales de indemnidad legal. |
| **2** | `/reservar/solista` | CTA primario con precio desglosado en JetBrains Mono (350 € suelo / 550 € tarifa estándar) + depósito Stripe. | Cierre de reserva solista Edwin Agudelo con depósito 100 € Price-Lock SHA-256, deducible del total. |
| **3** | `/licitaciones` | Tablero territorial de municipios B2G con CPVs canónicos y ficha de SROI. | Contratos menores Art. 118 LCSP (< 14.250 € techo preventivo) + SROI 4.85x + sesión VIMUME incluida. |
| **4** | `/seating-planner` | Lienzo canvas 2D de disposición de mesas (Nube de Boda) con geometría fija y skeleton anti-CLS. | Venta cruzada de servicios de coordinación y catering Eduardo Martínez (Ezkertza Berria / Otzarreta). |

---

## 7. PROTOCOLO DE VISUALIZACIÓN DE DATOS (ZERO VANITY METRICS)
- **Prohibición de Cifras Falsas:** Prohibido mostrar contadores simulados o números de fantasía sin procedencia real (AF-1 / AF-5).
- **Badge de Procedencia Obligatorio:** Toda métrica del panel de control o escaparates utiliza el componente `MetricProvenanceBadge`:
  * `LIVE` (verde): Dato en vivo de base de datos o webhook real.
  * `STATIC` (amarillo): Dato documentado en SSOT o registro canónico.
  * `EMPTY` (zinc): Estado sin actividad reciente (0 contratos, 0 solicitudes).
  * `SIMULATED` (naranja): Declarado con transparencia en entornos de test o demostración.

---

## 8. LEY DEL CONTACT-GATE & ANTI-PICARESCA (AUDIT:PHONE)
- Los números directos de proveedores y artistas **jamás se pintan en el DOM público** sin haber completado el flujo de pago/reserva.
- En la interfaz pública se muestra únicamente la **Centralita Oficial EAR OS (+34 693 693 048)** o máscaras seguras (`maskedPhone`).
- Verificado y protegido de forma automatizada por `npm run audit:phone`.

---

## 9. ACCESIBILIDAD & WCAG 2.2 AA / AAA
- Todo texto sobre fondo oscuro debe cumplir un ratio de contraste mínimo de **4.5:1** (AA) y preferiblemente **7:1** (AAA) en textos clave.
- Medición automatizada en CI vía `npm run audit:contrast:core`.
- Navegación completa por teclado accesible en modales, cajones y el Command Palette (Ctrl+K).

---

## 10. PRESUPUESTO DE RENDIMIENTO (CORE WEB VITALS)
- **CLS (Cumulative Layout Shift):** Objetivo 0,000 en rutas de pago y conversión. Máximo absoluto 0,05 (auditable vía `scripts/audit_cls_budget.cjs`).
  * **Ley del Skeleton Anti-CLS:** Todo card, catálogo, lista o canvas asíncrono reserva geometría exacta (ancho/alto fijo) con skeletons pulsantes durante la carga. Prohibidos spinners vacíos que provoquen salto de layout.
  * Lenis (`@studio-freight/react-lenis@^0.0.47`) está en `package.json` con clases CSS en `globals.css`. Su uso es opcional y cosmético; no afecta al CLS si se inicializa post-hidratación.
- **INP (Interaction to Next Paint):** ≤ 100 ms objetivo; ≤ 50 ms meta en dispositivos con GPU compatible.
- **LCP (Largest Contentful Paint):** ≤ 2,5 s en redes 4G estándar.
- **0 Clics Muertos:** Todo botón, selector o enlace interactivo ejecuta una acción real (href, Server Action, modal enlazado o llamada a centralita).
- **Ley del Debounce Reactivo:** Inputs de búsqueda, autocompletado y sliders continuos (pax, km, precio) deben filtrar con debounce de 200-300 ms.
