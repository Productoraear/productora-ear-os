# DESIGN.md — EAR OS v14.1 · CAPA 3: ESTÁNDAR DE DISEÑO, TASTE ENGINE & CANVAS

Gobernanza visual orientada a conversión, cero fricción visual y justificación de pricing soberano.

> **Procedencia del material (Trazabilidad AF-4).** La capa S-Class de este documento
> no se escribe de memoria: se cosechó del paquete local `Nutlope/hallmark`
> (commit `04977e15f3dfd6ee4b74c887dac3eb52665d6c92`, instalado en
> `.claude/skills/hallmark/`, `skills-lock.json`) y del sitio `https://www.usehallmark.com/`
> mediante `scripts/harvest_hallmark_dna.cjs`. Cada token de geometría citado
> (`--rule-hair`, `--r`, `--r-pill`, `--ease`, `--ease-out`, `--shadow-card`,
> la escala `--s-1…--s-10`) y cada ratio de contraste se lee del artefacto
> `scratch/HALLMARK_HARVESTED_DNA.json`. Sin ese fichero, la cifra no se cita.

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

---

## 6. TAXONOMÍA HALLMARK S-CLASS · TEMAS ADAPTADOS A HOSTELERÍA DE LUJO

Los tres temas siguientes se derivan del ADN cosechado (`scratch/HALLMARK_HARVESTED_DNA.json`,
clave `earOsSynthesis.themes`). Nacen del material de la casa —ya no son aproximaciones— y
sobreviven a la regla de que **un color es un token**: ningún tema introduce un hexadecimal
nuevo fuera de la tabla; todos caen sobre superficies Aura Onyx ya bendecidas.

### 6.1 Tema «Aura Onyx Hallmark» (por defecto · producción)
El tema insignia. Lujo silencioso con relieve por filo, no por halo.

| Ranura | Token | Valor | Uso |
|---|---|---|---|
| Void (lienzo) | `--paper` | `#030305` | Fondo de página, OLED absoluto |
| Surface (tarjeta) | `--paper-2` / `bg-[#0A0A0E]` | `#0A0A0E` | Tarjetas Bento, paneles de menú |
| Panel (blueprint) | `--paper-3` | `#0F0F16` | Lienzo del Seating Planner |
| Border (filo) | `--line` | `#1E1E26` | Filo de 1 px de todo panel |
| Border glass | `--line-2` | `rgba(255,255,255,.08)` | Insignias, cristal |
| Gold (acento único) | `#ecb613` | `#ecb613` | Transacciones, CTA, cifra insignia |
| Ink | `--on-ink` | `#F4F1EA` | Titulares display |
| Ink-2 | `--on-ink-2` | `#C9C4B8` | Cuerpo de lectura |
| Ink-muted | `--on-ink-muted` | `#8E8A80` | Etiquetas y notas legales |

**Tipografía.** Display `Syne` (700/800, tracking `--display-track-h1` = `-0.035em`
en el H1, `--display-track` = `-0.025em` en el resto). Cuerpo `Inter`/Montserrat a 16 px,
line-height 1.65. Datos `JetBrains Mono` tabular.
**Movimiento.** `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; sólo `color`, `box-shadow`
y `transform`. Jamás `transition: all`; jamás se anima `width`, `height`, `top` ni `left`.
**Elevación.** `shadow-elevation-1/2/3` (filo interior de 1 px + sombra descendente),
`shadow-inset-hairline`, `shadow-inset-hairline-gold`. El resplandor es un **anillo de
1 px** (`aura-glow`), nunca un orbe difuso.

### 6.2 Tema «Linear Dark Minimal» (tablas y datos densos)
Contrastes ultra-nítidos para tablas financieras, tableros B2G y comparativas.

| Ranura | Valor | Uso |
|---|---|---|
| canvas | `#0B0B0F` | Lienzo neutro, un punto más frío que Onyx |
| surface | `#111116` | Filas y celdas |
| border | `#20202A` | Rejilla de tabla |
| ink / ink-2 | `#EDEDF2` / `#A1A1AA` | Celda primaria / secundaria |
| signal | `#5B8CFF` | Selección y enlace |

**Reglas.** Una sola familia (`Inter`) con `JetBrains Mono` para cifras; radio `--r-in`
(8 px) en celdas; cero sombra, cero desenfoque; la tabla se separa con hairlines.
Se usa en `/dominancia`, `/b2g` y cualquier panel con más de ocho cifras por pantalla.

### 6.3 Tema «Editorial Gourmet» (jerarquía display en la carta)
Para las páginas donde el plato es el argumento: `/otzarreta`, `/arroces`, `/catering-de-brasas`.

| Ranura | Valor | Uso |
|---|---|---|
| paper / paper-2 | `#0A0A0E` / `#101014` | Superficie editorial |
| ink / ink-2 | `#F4F1EA` / `#C9C4B8` | Titular / lede |
| accent | `#ecb613` | Importe del menú, filete de oro |
| rule | `#1E1E26` | Filete de columna |

**Reglas.** Display `Syne` para cabeceras de sección, `Fraunces` como outlier único
(reservado al nombre del asador y a citas); el importe se fija grande y tabular,
en columna, porque el precio es la oferta; una fotografía a sangre por bloque,
jamás dos bloques fotográficos consecutivos.

### 6.4 Utilidades maestras (ya en `tailwind.config.cjs`)
`rounded-card` (14 px) · `rounded-panel` (20 px) · `rounded-well` (8 px) ·
`rounded-pill` (999 px) · `shadow-elevation-1/2/3` · `shadow-inset-hairline[-gold]` ·
`ease-hallmark` / `ease-hallmark-in` · `duration-160` / `duration-320` ·
`tracking-display` / `-tight` / `-tighter` · `bg-blueprint` + `bg-blueprint-major` ·
`gap-s-1…s-10`, `max-w-contour`, `max-w-measure`, `px-gutter`.

Y en `globals.css` (capa `@layer components`):
`.hallmark-canvas`, `.hallmark-lede`, `.subtle-border`, `.subtle-border-strong`,
`.glass-panel-sclass`, `.aura-glow`, `.hallmark-card`, `.hallmark-badge`,
`.hallmark-btn-primary`, `.hallmark-btn-secondary`, `.hallmark-bento`,
`.hallmark-blueprint`, `.hallmark-label`, `.hallmark-figure`, `.hallmark-rule`.

---

