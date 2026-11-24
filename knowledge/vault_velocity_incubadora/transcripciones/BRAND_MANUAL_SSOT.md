# MANUAL DE MARCA S-CLASS (SSOT)
**Productora EAR & Proyecto VIMUME**

Este documento define la identidad visual inmutable del ecosistema EAR OS V2. Ningún diseñador o ingeniero tiene autorización para desviarse de estos tokens.

## 1. PALETA DE COLORES (Design Tokens)

### Estado Default (EAR OS)
La estética base comunica autoridad, rigor corporativo y exclusividad aristocrática (S-Class).
- **True Black:** `#050507` (Background principal. No usar negros deslavados, solo vacío absoluto).
- **Ice Cyan:** `#AAD6CD` (Acentos secundarios, tipografía de sistema, identificadores institucionales B2G).
- **Noble Gold:** `#ecb613` (Call-to-actions transaccionales, badges de nivel élite, destacables premium).

### Estado VIMUME (Legado Sebastián Díaz)
Cuando un usuario ingresa al ecosistema neuroacústico y clínico (Rutas `/vimume/*`), el DOM debe mutar para reflejar la catarsis emocional y la evidencia médica.
- **Violeta Neón:** `#8b5cf6` (Color principal para bordes, glows y botones en VIMUME).
- **Ice Cyan & Noble Gold:** Se mantienen como soporte para no romper la cohesión estructural.
- **True Black:** `#050507` (Sigue siendo el fondo, pero iluminado sutilmente por gradientes violetas `rgba(139, 92, 246, 0.05)`).

## 2. TIPOGRAFÍA
- **Primaria (Sans-Serif):** `Inter` o `Syne`. Usada para toda la interfaz transaccional, botones, telemetría y dashboards.
- **Secundaria (Serif Aristocrático):** Reservada exclusivamente para Títulos de Páginas (H1), dictámenes o testimonios. Debe transmitir la elegancia de una multinacional discográfica o una entidad institucional.

## 3. EL ISOTIPO DEL COLIBRÍ (VIMUME)
El colibrí no es un simple logo, es el símbolo de la memoria de Sebastián Díaz.
- **Uso Estricto:** Solo debe aparecer en el portal VIMUME o en certificados fiscales del Modelo 182.
- **Estética:** Trazos finos, vector monocromático (Oro Noble o Violeta Neón), sin sombras artificiales.

## 4. MIMETISMO DE MARCA (FRONTEND IMPLEMENTATION)
El sistema utiliza una arquitectura CSS en `globals.css` que detecta la ruta (vía `usePathname` o context) y cambia las variables `:root` globales a `.theme-vimume`.
- `--bg-primary` se mantiene negro, pero `--accent-glow` pasa de dorado a violeta.
- Las animaciones con Framer Motion deben hacer una transición de `0.8s ease-in-out` al cruzar la frontera entre EAR OS y VIMUME.
