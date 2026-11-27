---
name: hallmark
description: Skill de diseño Hallmark que hace que cada pantalla parezca diseñada y no generada por IA, imponiendo un suelo de tokens, dirección estética asignada y un único concepto por pantalla. Implementación canónica en .claude/skills/hallmark/.
---

# Hallmark · Diseño que parece hecho, no generado (EAR OS)

Skill de diseño S-Class (proyecto Hallmark v2.0.0 · MIT) **indexada** en el registro agéntico local de EAR OS. Su implementación canónica —referencias, temas, macrostructure, fixtures y gates— vive en `.claude/skills/hallmark/`; este índice es deliberadamente delgado para no duplicar 175 ficheros (Doctrina Ponytail, peldaño 2: reutilizar, no copiar).

## Misión

Elevar cualquier interfaz generada por un modelo por encima del "suelo" de diseño por defecto: un único concepto por pantalla, dirección estética asignada (para que dos builds consecutivos no converjan) y cero decisiones de color o tipografía fuera del sistema de tokens.

## Cuándo usarla

- Crear una página o componente nuevo desde cero.
- Rediseño explícito: `hallmark redesign <ruta>`.
- Auditoría visual de una ruta: `hallmark audit <ruta>`.
- NUNCA sobre un diseño existente salvo que se invoque Hallmark por su nombre.

## El Suelo (no negociable · resumen)

1. Todo color y toda fuente pasa por un token declarado en `:root`. Prohibido color o `font-family` literal.
2. Nunca `transition: all`. Nunca animar `width`, `height`, `top` ni `left`.
3. `overflow-x: clip` en `html` y `body`. Nunca `hidden`, nunca `100vw`.
4. Tracks de grid con imagen en `minmax(0, 1fr)`; cabeceras con `overflow-wrap: break-word; min-width: 0`.
5. Todo elemento interactivo declara `:focus-visible` inmediato (sin retardo).

## Frontera con la doctrina EAR OS

- El **Taste Engine OLED** y el protocolo UNSLOP (`.agents/skills/unslop/`) gobiernan la paleta soberana (`#030305`), la iconografía `lucide-react` y la tipografía Syne/Inter/JetBrains Mono. Hallmark aporta la capa de dirección, macrostructure y gates de diseño por encima de esa base.
- Todo resultado debe seguir pasando `npm run lint`, `tsc --noEmit` y `npm run audit:contrast`.

## Referencias canónicas (en `.claude/skills/hallmark/`)

`references/anatomy.md` · `references/direction.md` · `references/craft.md` · `references/gates.md` · `references/themes/` (50+ temas) · `references/macrostructures/` · `scripts/fixtures/`.

## Done

1. 0 colores ni fuentes literales fuera del bloque de tokens.
2. 0 `transition: all` y 0 animación de propiedades de layout.
3. `:focus-visible` presente en todo control interactivo.
4. `npm run lint` y `npm run typecheck` con Exit Code 0.
