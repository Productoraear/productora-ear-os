---
name: wcag-accessibility
description: Garantiza accesibilidad WCAG 2.2 AA/AAA en la paleta OLED de EAR OS. Exige contraste mínimo 4.5 a 1 sobre #030305, aria-label en docks y controles móviles y objetivos táctiles de 44x44 px como requisito de licitaciones B2G.
lifecycle_phase: VERIFY (Test | Debug)
command: /test
framework: WCAG 2.2 · EN 301 549 · Ley 9/2017 LCSP
governance: ANTIGRAVITY OMEGA v11.0 (S-CLASS)
---

# WCAG Accessibility · Contraste OLED y Operabilidad Táctil (EAR OS)

## Misión
Que la administración pública (B2G), el jurado de una licitación y cualquier cliente con baja visión puedan operar el sitio real: contraste medido, nombres accesibles en cada control y objetivos táctiles que un dedo acierta a la primera.

## Reglas de Oro

### 1. Contraste cromático sobre paleta OLED
- Fondo maestro `#030305` / `#050507`; superficies `#0a0a0c`.
- **Mínimo 4,5:1** para texto normal y **3:1** para texto grande (≥ 24 px o ≥ 19 px en negrita) — WCAG 2.2 · 1.4.3 / 1.4.11.
- Paleta de acento autorizada (fuente única: `.agents/skills/unslop/SKILL.md`): Oro `#ecb613`, Rubí `#FF2B44`, Cyan `#00E5FF`.
- Prohibido delegar el contraste a un gradiente: el auditor compone todas las capas de fondo y evalúa el **peor caso** bajo el texto.

### 2. Nombres accesibles en docks y controles móviles
- Todo botón que solo lleva icono (dock inferior, HUD, drawer de carrito, concierge) exige `aria-label` explícito y descriptivo, no decorativo.
- Iconos puramente ornamentales: `aria-hidden="true"`.
- Estados de expansión con `aria-expanded` y paneles con `aria-controls`.

### 3. Objetivos táctiles (requisito de licitación)
- Mínimo **44x44 px** de área interactiva en móvil (WCAG 2.5.5 AAA), con separación suficiente para evitar pulsaciones cruzadas.
- El dock móvil reserva su zona segura inferior con el token único `--ear-dock-h`; ningún elemento interactivo queda bajo el `env(safe-area-inset-bottom)`.

### 4. Foco visible y teclado
- Anillo de foco visible en todos los controles (WCAG 2.4.7), sin `outline: none` sin sustituto.
- Orden de tabulación coherente con el orden visual; ningún modal atrapa el foco sin salida.

## Protocolo de ejecución
```powershell
npm run audit:contrast        # Chrome headless real · peor caso por ruta
npm run audit:contrast:core   # rutas que venden: / /proveedores /otzarreta /encargos /reservar/solista /vimume /fincas /directorio /calculadora /artistas
npm run audit:contrast:hallmark
```
Informe en disco: `reports/contrast/wcag_report.json` (detalle por ruta) + capturas reales `reports/contrast/<ruta>/shot-*.png`.

Un informe de contraste sin servidor vivo es `SIN_EVIDENCIA`, nunca verde (AF-1 · AF-5): el auditor arranca el servidor si el objetivo no responde y lo apaga al terminar.

## Tabla Anti-Racionalización
| Excusa común del agente | Réplica de ingeniería senior |
| :--- | :--- |
| *"El texto blanco sobre negro ya contrasta, no hace falta medir."* | Blanco al 60% de opacidad sobre `#030305` cae por debajo de 4,5:1. Se mide, no se estima. |
| *"El icono se entiende, no necesita aria-label."* | Un lector de pantalla anuncia "botón" y nada más: el control es inoperable. |
| *"44 px es mucho para un dock con 6 iconos."* | Es el mínimo exigido en contratación pública; si no cabe, se reduce el número de iconos, no el área. |

## Criterios de salida (Done)
1. `npm run audit:contrast:core` → 0 rutas por debajo de 4,5:1.
2. 0 controles interactivos sin nombre accesible en dock, HUD, drawer y concierge.
3. 0 objetivos táctiles < 44x44 px en las rutas que venden.
