# DESIGN.md — EAR OS v14.2 · CAPA 3: ESTÁNDAR DE DISEÑO, TASTE ENGINE & CANVAS

Gobernanza visual orientada a conversión, cero fricción visual y justificación de pricing soberano.

> **Procedencia del material (Trazabilidad AF-4).** La capa S-Class de este documento
> no se escribe de memoria: se cosechó del paquete local `Nutlope/hallmark`
> (commit `04977e15f3dfd6ee4b74c887dac3eb52665d6c92`, instalado en
> `.claude/skills/hallmark/`, `skills-lock.json`) y del sitio `https://www.usehallmark.com/`
> mediante `scripts/vampirize_hallmark_engine.cjs` (Operación Vampirización
> HORIZONX / ZTLM). Cada token de geometría citado
> (`--rule-hair`, `--r`, `--r-pill`, `--ease`, `--ease-out`, `--shadow-card`,
> la escala `--s-1…--s-10`) y cada ratio de contraste se lee del artefacto
> `scratch/HALLMARK_HARVESTED_VAULT.json`. Sin ese fichero, la cifra no se cita.
>
> **Medición de la captura (2026-11-21, `VAMPIRE=VERIFICADO`, Exit 0).**
> Portada `200` · 63.267 B · sha256 `bf40f84d7529…`; hoja `style.css` `200` ·
> 45.612 B · sha256 `03677b0c2699…`; **40/40** rutas públicas sondeadas `200`;
> **13** páginas de tema con tokens propios; **128** variables CSS nativas;
> **12** temas de la casa (`--d-<slug>-p` / `--d-<slug>-a`); **51** temas del
> paquete local (13 oscuros); **12** glows perimetrales de 1 px (`0 0 0 1px`);
> **5** curvas de easing y **16** duraciones distintas.



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
`.glass-panel-sglass`, `.aura-glow`, `.hallmark-card`, `.hallmark-badge`,
`.hallmark-btn-primary`, `.hallmark-btn-secondary`, `.hallmark-bento`,
`.hallmark-blueprint`, `.hallmark-label`, `.hallmark-figure`, `.hallmark-rule`.
(El nombre real de la utilidad de cristal es `.glass-panel-sclass`; la siguiente
revisión de esta línea debe corregir la errata, no el CSS.)

---

## 7. CATÁLOGO COSECHADO · 12 TEMAS DE LA CASA (`usehallmark.com`)

Leído de `scratch/HALLMARK_HARVESTED_VAULT.json` → `phase2ExternalSite.themes`.
Cada fila es un par `--d-<slug>-p` (papel) / `--d-<slug>-a` (acento) declarado por
el sitio y resuelto a hexadecimal por el motor. **Un tema es un material, no un plan.**

| Tema | Papel | Acento | Luminancia del papel | Acento sobre papel |
|---|---|---|---|---|
| `bloom` | `#f9f4ee` | `#af4529` | 0,9119 | 5,17:1 |
| `carnival` | `#ffddca` | `#f6ce00` | 0,7701 | 1,19:1 |
| `cobalt` | `#f8fbfe` | `#0462d3` | 0,9590 | 5,44:1 |
| `garden` | `#f7f1df` | `#1f6a19` | 0,8799 | 5,97:1 |
| `halftone` | `#f9f3db` | `#d01a00` | 0,8919 | 4,95:1 |
| `hedgerow` | `#032615` | `#cae430` | 0,0149 | 11,27:1 |
| `kiln` | `#0b0605` | `#fe6a00` | 0,0021 | 6,99:1 |
| `manifesto` | `#0a0704` | `#db0310` | 0,0022 | 3,85:1 |
| `midnight` | `#02071d` | `#6bcbf7` | 0,0026 | 10,93:1 |
| `riso` | `#f8f5ed` | `#fe419d` | 0,9130 | 2,98:1 |
| `sport` | `#f6f9fc` | `#c8e928` | 0,9416 | 1,31:1 |
| `terminal` | `#040805` | `#7ef473` | 0,0020 | 14,49:1 |

**Lectura soberana del catálogo.** Cinco papeles oscuros (`hedgerow`, `kiln`,
`manifesto`, `midnight`, `terminal`) son los únicos compatibles con Aura Onyx.
Los acentos `carnival` (1,19:1), `sport` (1,31:1) y `riso` (2,98:1) **no se
adoptan jamás** en texto: incumplen WCAG 2.2 AA por debajo de 4,5:1. `terminal`
(14,49:1) y `hedgerow` (11,27:1) son las combinaciones de la casa que alcanzan
AAA sin retrabajo, y por eso alimentan la variante de datos densos.


---

## 8. TEMA INSIGNIA · «AURA ONYX HALLMARK S-CLASS»

Mapeo canónico del sistema cosechado sobre la identidad de la casa. Los valores
son los del artefacto (`phase3EarOsSynthesis.themes[0]`) y su contraste está
**medido, no afirmado**: 6/6 pares PASS.

| Ranura | Token | Valor | Uso |
|---|---|---|---|
| Fondo primario | `--bg-void` / `bg-void` | `#030305` | Lienzo de página, inmersión OLED |
| Superficie | `--bg-surface` / `bg-void-surface` | `#08080C` | Tarjetas, paneles, widget |
| Elevación | `--bg-elevated` / `bg-void-elevated` | `#0E0E14` | Módulos elevados, hover de tarjeta |
| Panel técnico | `--bg-panel` | `#0F0F16` | Lienzo del Seating Planner (blueprint) |
| Filo | `--border-hairline` | `#1E1E26` | Borde de 1 px de todo panel |
| Filo vítreo | `--border-glass` | `rgba(255,255,255,0.08)` | Insignias, cristal, separadores |
| Acento único | `--gold` / `gold` | `#ecb613` | Transacciones, fianza de 100 €, CTA |
| Tinta | `--ink` | `#F4F1EA` | Titulares display |
| Tinta 2 | `--ink-2` | `#C9C4B8` | Cuerpo de lectura |
| Tinta muda | `--ink-muted` | `#8E8A80` | Etiquetas y notas legales |

**Contraste medido (WCAG 2.2).** `ink/void` 18,27:1 (AAA) · `ink-2/void` 11,85:1
(AAA) · `ink-2/surface` 11,49:1 (AAA) · `ink-muted/surface` 5,80:1 (AA) ·
`gold/surface` 10,73:1 (AAA sobre 3:1) · `#120D00/gold` 10,40:1 (AAA).

**Elevación.** `shadow-elevation-1/2/3` = filo interior de 1 px + sombra
descendente. El resplandor es un **anillo de 1 px** (`0 0 0 1px
rgba(236,182,19,0.28)`), la firma que el motor extrajo 12 veces del sitio.
Prohibido el orbe difuso (`rounded-full blur-[120px]`): es fuga de estilo
genérico detectada y eliminada en `/otzarreta`.

**Tipografía.** Display `Syne` 700/800, tracking `-0.025em` en H2 y `-0.035em` en
H1 (rango cosechado de `craft.md`: `-0.02` a `-0.04em` en caras de ancho regular;
line-height `1.0`–`1.15`). Cuerpo `Inter`/`Montserrat` a 16 px con line-height
1.65 (rango cosechado: `1.5`–`1.65`). Datos `JetBrains Mono` tabular.

**Movimiento.** `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`; sólo `color`,
`box-shadow` y `transform`; `160 ms` en hover, `320 ms` en panel. Jamás
`transition: all` (suelo 2 de Hallmark).

**Pureza de capas.** `font-mono` con `tracking-wider` y `uppercase` es una
etiqueta versalita espaciada, prohibida por el suelo 9 de Hallmark: las etiquetas
van en la cara de cuerpo, un paso menor, sentence case, sin tracking.

---



