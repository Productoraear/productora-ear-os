# SSOT: STITCH_DESIGN_SYSTEM.md

## Origen
- **Fuente:** Proyecto Stitch MCP (ID `574504229353510337`)
- **Pantalla Extraída:** FENIX v2.0 | S-CLASS SKILLS HUB (`aa21cfd6817643daa6d9a817e2b168bc`)
- **Tema Base:** DARK, Fonte MANROPE, Color Personalizado `#ecb613` (Oro Kinetic).

## Tokens de Color Semántico (Vampirizados de Stitch)
Los colores mantienen nomenclatura de variables, enriqueciendo el tema aditivo sin romper `globals.css`:
- `surface-bright`: `#3a3939`
- `surface-variant`: `#353534`
- `surface-container-lowest`: `#0e0e0e`
- `surface-container-low`: `#1c1b1b`
- `surface-container`: `#201f1f`
- `surface-container-high`: `#2a2a2a`
- `surface-container-highest`: `#353534`
- `on-surface`: `#e5e2e1`
- `on-surface-variant`: `#d0c5af`
- `primary-container`: `#d4af37`
- `on-primary-container`: `#554300`
- `secondary`: `#c6c6c6`
- `outline`: `#99907c`
- `outline-variant`: `#4d4635`

## Tipografía (Tokens de Fuentes)
- `headline`: `['Newsreader']`
- `body`: `['Inter']`
- `label`: `['Space Grotesk']`

## Arquitectura de CSS
- Se introducen clases semánticas mediante Tailwind en `tailwind.config.js`.
- Ningún color sobreescribe la paleta base de Vercel/NextJS preexistente, logrando compatibilidad de backward.

**Fijación:** Baseline de diseño extraído y mapeado el 2026-08-07T00:02:08.
