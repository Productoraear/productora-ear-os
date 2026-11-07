---
name: unslop
description: Transforma interfaces generadas por IA (vibe-coding, plantillas genéricas, gradientes morados, emojis como iconos, espaciados desiguales) en interfaces de nivel institucional de 9 cifras siguiendo el protocolo de redlining de 9 pases de diseño y Taste Engine OLED de EAR OS.
---

# Protocolo UNSLOP & Taste Engine de 9 Cifras (EAR OS v11.0)

Basado en la metodología de Damir Sokolovsky (`heydamir/unslop`) integrada orgánicamente con la Doctrina Soberana OLED de EAR OS.

## Objetivo
Eliminar cualquier rastro de "AI Slop" (código vibecodificado, apariencia de plantilla barata, degradados pastel, emojis en UI, textos hinchados) y convertir cada pantalla en una pieza de ingeniería visual y producto de alto standing digno de Silicon Valley.

---

## 1. Auditoría de Basura Visual (Slop Audit)

Antes de modificar código, identifica la presencia de cualquiera de estos 7 vicios de IA:
1. **Gradientes violetas / morados / azules genéricos** (`from-purple-600 to-indigo-600`).
2. **Brillos borrosos desmedidos** (*glows* con `blur-3xl`, halos difusos sin forma definida).
3. **Emojis utilizados como iconografía** (ej. 🚀, 💎, 🔥 en botones o badges en lugar de SVGs limpios de `lucide-react`).
4. **Espaciados irregulares** (cards infladas con márgenes arbitrarios `p-7`, `gap-5` inconexos).
5. **Textos hiperbólicos / Slop Copy** ("Revoluciona tu experiencia", "El futuro de la música hoy").
6. **Bordes brillantes de 1px a mansalva** (`border-gradient`, tarjetas sobrecargadas).
7. **Fondos grisáceos lavados** (`#1f2937`, `#111827`) en vez de negro puro OLED (`#030305`, `#050507`).

---

## 2. Los 9 Pases de Redlining (Secuencia Obligatoria)

Aplica las correcciones en este orden estricto:

### Pase 1: Espaciado y Ritmo Vertical
- Escala modular estricta de Tailwind: `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`, `gap-8`.
- Jerarquía de contención: el contenido determina el tamaño de la tarjeta, nunca cajas infladas vacías.

### Pase 2: Color y Contraste Soberano
- **Fondo maestro**: `#030305` y `#050507`.
- **Superficies secundarias**: `#0a0a0c`, `bg-white/[0.02]` o `bg-white/[0.04]` con bordes sutiles `border-white/10`.
- **Regla del Acento Único**: Un solo color de acento por pantalla:
  - Oro `#ecb613` (Dinero, transacciones, CTAs principales).
  - Rubí `#FF2B44` (Alertas críticas, urgencia real).
  - Cyan `#00E5FF` (Telemetría, bio-frecuencias, acústica).
- Prohibidos todos los degradados arcoíris o púrpuras.

### Pase 3: Iconografía Vectorial Limpia
- Erradicar el 100% de emojis de la UI interactiva.
- Utilizar exclusivamente `lucide-react` con `strokeWidth={1.5}` o `strokeWidth={1.75}`, tamaño proporcional (`size={16}`, `size={18}`).

### Pase 4: Redacción y Copy Sobrio
- Verbos de acción real y datos medibles:
  - *Mal*: "La solución definitiva con IA cuántica".
  - *Bien*: "Liquidación en céntimos enteros (80/10/10) · Despacho en < 5 min".
- Cero adjetivos vacíos.

### Pase 5: Jerarquía Tipográfica (`next/font`)
- **Titulares / Display**: `Syne` (pesos 700 / 800) con espaciado ajustado `tracking-tight`.
- **Cuerpos de texto**: `Inter` (pesos 400 / 500) en `text-sm` o `text-base` con `text-white/70` o `text-white/60`.
- **Datos / Precios / Telemetría**: `JetBrains Mono` (`font-mono`) en `text-xs` o `text-sm`, siempre en céntimos o unidades reales.

### Pase 6: Topología y Layout Estructurado
- Prohibido `w-screen` (usar `w-full overflow-x-hidden`).
- Cuadrículas bento calibradas y responsivas (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- Skeletons con geometría fija exacta (ancho/alto) durante estados de carga para garantizar CLS < 0.02.

### Pase 7: Micro-detalles y Bordes
- Divisores finos `border-white/5` o `border-white/10`.
- Hover interactivo refinado: `hover:border-white/20 transition-colors duration-200`.
- Cero sombras borrosas multicolores.

### Pase 8: Visuales Tangibles
- Mostrar el producto real, capturas de datos, esquemas de cableado/acústica o formas de onda, nunca "esferas brillantes flotantes" abstractas de IA.
- Imágenes en WebP/AVIF optimizadas.

### Pase 9: Movimiento Sutil
- Transiciones funcionales de estado (150ms a 300ms ease-out).
- Prohibidas animaciones infinitas que distraigan o degraden el INP / FPS.

---

## 3. Criterio de Verificación (Done)
Una pantalla está **des-eslopiada (unsloped)** cuando:
1. No contiene ningún emoji en botones, badges ni cabeceras.
2. No tiene ningún degradado violeta/azul ni halos fluorescentes.
3. El fondo es negro OLED puro y los datos usan `JetBrains Mono`.
4. El copy expresa sustancia técnica y de negocio verificable.
5. Pasa `tsc --noEmit` y `npm run lint` con Exit Code 0.

