---
description: "PROTOCOLO IMPECABLE & TASTE ENGINE — DIRECTIVAS ANTI-SLOP Y DISEÑO S-CLASS PARA QWEN / CLINE LOCAL"
globs: ["src/**/*", "content/**/*", "public/**/*"]
---

# 👑 PROTOCOLO IMPECABLE & TASTE ENGINE (LOCAL QWEN / CLINE)
Este protocolo dota a **Cline + Qwen 3.8 / LLMs locales** de un vocabulario de diseño prescriptivo y filtros anti-slop equivalentes a las mejores herramientas de diseño del mercado, sin requerir suscripciones a Claude ni dependencias externas.

---

## 1. 🛑 LOS 46 PATRONES DE SLOP (LISTA DE PROHIBICIONES ESTRICTAS)
Todo código generado por Qwen o Cline debe pasar este filtro antes de considerarse terminado:

### A. Dimensión Tipográfica (Slop 1-7)
- ❌ **Slop 1**: Jerarquías de texto planas donde el `h1`, `h2` y `h3` parecen tener el mismo peso visual.
- ❌ **Slop 2**: Uso de tipografías genéricas del sistema sin intención (usar siempre `Syne` para display, `Inter` para cuerpo, `JetBrains Mono` para telemetría).
- ❌ **Slop 3**: Tamaños tímidos en titulares. Si es el héroe, debe ser monumental (`text-4xl` a `text-6xl+`).
- ❌ **Slop 4**: Textos largos no justificados o sin ancho máximo legible (`max-w-prose` o `max-w-2xl`).
- ❌ **Slop 5**: Interlineado apretado en cuerpos de texto (usar siempre `leading-relaxed` o `leading-loose`).
- ❌ **Slop 6**: Mayúsculas sostenidas sin espaciado tipográfico (usar siempre `tracking-widest` o `tracking-wider` con `uppercase text-xs`).
- ❌ **Slop 7**: Contraste insuficiente entre texto secundario y fondo (nunca menos de 4.5:1; usar `text-zinc-300` o `text-zinc-400`, jamás `text-zinc-600` sobre negro).

### B. Dimensión Cromática y Sombras (Slop 8-14)
- ❌ **Slop 8**: **El degradado púrpura/azul cliché de IA** (`from-purple-600 to-blue-500`). Terminantemente PROHIBIDO.
- ❌ **Slop 9**: Fondos grises lavados (`bg-gray-800` o `bg-slate-900`). Usar siempre negros profundos OLED (`#030305`, `#050507`, `#08090d`).
- ❌ **Slop 10**: Más de un color de acento compitiendo por atención. Definir UN solo acento primario por vista (`#ecb613` Oro, `#FF2B44` Rubí, o `#00E5FF` Cyan).
- ❌ **Slop 11**: Sombras difusas grises sin dirección (`shadow-lg` por defecto). Usar sombras coloreadas sutiles (`shadow-[0_0_25px_rgba(236,182,19,0.2)]`).
- ❌ **Slop 12**: Bordes blancos sólidos opacos. Usar siempre bordes translúcidos (`border-white/10` o `border-white/15`).
- ❌ **Slop 13**: Colores primarios puros sin modular (rojo `#FF0000`, verde `#00FF00`). Usar paleta S-Class calibrada.
- ❌ **Slop 14**: Fondos planos sin textura ni atmósfera. Aplicar grano, radiales sutiles o niebla lumínica.

### C. Dimensión Espacial y Composición (Slop 15-21)
- ❌ **Slop 15**: Márgenes y paddings tacaños. Usar espacios generosos (`py-16`, `py-24`, `gap-6`, `gap-8`).
- ❌ **Slop 16**: "Cajas dentro de cajas dentro de cajas" innecesarias. Reducir contenedores a lo esencial.
- ❌ **Slop 17**: Desalineación entre elementos hermanos en grids. Usar `items-stretch` o `flex-col justify-between`.
- ❌ **Slop 18**: Falta de ritmo vertical (mismo espaciado entre secciones pequeñas y grandes).
- ❌ **Slop 19**: Elementos flotantes sin anclaje visual ni referencia estructural.
- ❌ **Slop 20**: Tarjetas de bordes rectos anticuados sin consistencia de radio (usar `rounded-2xl` o `rounded-3xl`).
- ❌ **Slop 21**: Ausencia de espacio negativo intencional para descanso visual.

### D. Dimensión Responsiva (Slop 22-27)
- ❌ **Slop 22**: **Desbordamiento horizontal con `w-screen` o `100vw`** en Windows. Usar SIEMPRE `w-full max-w-full overflow-x-hidden`.
- ❌ **Slop 23**: Botones o tarjetas que se rompen en 2 líneas incómodas en mobile.
- ❌ **Slop 24**: Targets táctiles menores a 44x44px en pantallas táctiles (`min-h-[44px]`).
- ❌ **Slop 25**: Modales o drawers que se salen de la altura del viewport móvil (`max-h-[85vh] overflow-y-auto`).
- ❌ **Slop 26**: Ocultar información crítica en móvil en lugar de adaptarla con scroll horizontal o acordeón.
- ❌ **Slop 27**: Canvas Three.js con ancho o alto fijo sin `ResizeObserver` reactivo.

### E. Dimensión de Interacción y Feedback (Slop 28-33)
- ❌ **Slop 28**: Botones sin estado `:hover`, `:active` o `:focus-visible`.
- ❌ **Slop 29**: Transiciones lentas o gelatinosas (usar `duration-200` o `duration-300`, curvas `ease-out`).
- ❌ **Slop 30**: Falta de cursor interactivo (`cursor-pointer`) en elementos clicables.
- ❌ **Slop 31**: Iconos desnudos sin etiquetas o sin accesibilidad descriptiva (`title` / `aria-label`).
- ❌ **Slop 32**: Animación de elementos interactivos que altera el layout de los elementos vecinos (layout shift).
- ❌ **Slop 33**: Spinners de carga genéricos sin contexto o sin skeleton loaders adaptados.

### F. Dimensión de Movimiento y Animación (Slop 34-39)
- ❌ **Slop 34**: Animaciones flotantes lentas continuas que marean al usuario ("floating bobbing slop").
- ❌ **Slop 35**: Parallax excesivo que desincroniza el scroll natural.
- ❌ **Slop 36**: Animación que no respeta `prefers-reduced-motion`.
- ❌ **Slop 37**: Render loops de WebGL o Canvas que siguen consumiendo GPU cuando la pestaña no está visible.
- ❌ **Slop 38**: Múltiples elementos animados a la vez compitiendo por atención visual.
- ❌ **Slop 39**: Falta de micro-interacciones al hacer click (e.g. escala sutil `active:scale-95`).

### G. Dimensión de Redacción UX / Copywriting (Slop 40-46)
- ❌ **Slop 40**: Frases cliché de IA: *"Revoluciona tu experiencia"*, *"El poder de la innovación"*, *"Solución integral"*.
- ❌ **Slop 41**: Textos de botón vacíos: *"Haz clic aquí"*, *"Empezar"*. Usar verbos de valor: *"Solicitar Auditoría B2G"*, *"Reservar Fecha con Price-Lock"*.
- ❌ **Slop 42**: Falta de telemetría y datos concretos (sustituir *"Música de calidad"* por *"Rider 12 W/pax Bose F1"*).
- ❌ **Slop 43**: Párrafos largos monolíticos sin negritas ni datos destacados.
- ❌ **Slop 44**: Ausencia de garantía o mitigador de riesgo bajo los llamados a la acción (ej. *"Sin compromiso · 24h a 72h Price-Lock"*).
- ❌ **Slop 45**: Lenguaje pasivo o dubitativo (*"Podríamos ayudarte a..."* -> *"Garantizamos el split 80% neto"*).
- ❌ **Slop 46**: Mencionar nombres de diseñadores del manual en copy público (confinar a registros técnicos internos).

---

## 2. ⚡ EL COMANDO `/BOLDER` (DIRECTIVA DE IMPACTO)
Cuando se pida o se ejecute `/bolder`:
1. **Aumentar el contraste tipográfico**: Títulos display con `font-black` o `font-syne`, con tracking ajustado.
2. **Escalar el Héroe**: Pasar de layouts tímidos a canvas WebGL 3D monumental o tipografía gigante de impacto.
3. **Reducir el Ruido**: Eliminar bordes y fondos secundarios para que solo resalten el elemento activo y el núcleo gravitacional.
4. **Acero Monocromático**: Fondo True Black `#030305` + acento puntual electrizante (Oro `#ecb613` o Rubí `#FF2B44`).

---

## 3. 🎯 EL FRAMEWORK DE PROMPT DE 4 PARTES
Al diseñar o pedir una nueva pantalla o componente, estructurar SIEMPRE el prompt bajo estos 4 pilares:
1. **ESTÉTICA**: Seleccionar la familia de diseño de la biblioteca (ej. *Cinematic Monocromo S-Class*, *Editorial Impresión Técnica*, *Glassmorphism Cyber-Acústico*).
2. **REFERENCIA**: Mencionar la sensación exacta (ej. *Sensación de instrumentación analógica de cabina Bang & Olufsen / Interfaz Linear*).
3. **INTENCIÓN**: Para quién es, qué problema resuelve y cuál es la conversión esperada (ej. *Para alcaldes y concejales B2G; contratar show Art. 118 LCSP < 15.000 € en 2 clics*).
4. **GUÍAS (SIEMPRE / NUNCA)**:
   - *SIEMPRE*: Datos reales auditados, split 80/10/10, Rider 12 W/pax, Three.js reactivo, 100% responsive sin desbordamientos.
   - *NUNCA*: AI slop, gradientes violetas, `w-screen`, fuentes por defecto, fotos de stock genéricas sin procesar.

---

## 4. 🎨 EL PROTOCOLO "NUNCA EN UNA TOMA" (PROYECCIÓN EN GRANDE)
Para decisiones críticas de arquitectura visual:
1. **Paso 1: 5 Estilos en Pantalla**: Ofrecer o previsualizar 5 familias estéticas antes de casarse con una.
2. **Paso 2: 3 Variantes**: Seleccionado el estilo ganador, iterar 3 variantes de color/composición.
3. **Paso 3: 1 Ganador**: Escalar a producción el estilo ganador.
4. **Paso 4: Micro-ajustes**: Ajustar tipografía, espaciado y física de animación sin alterar la estructura.
