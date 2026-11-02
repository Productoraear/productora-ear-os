o procede de ---

## 5. 🔬 VERIFICACIÓN MÁQUINA (LEY DEL AUDITOR REAL · AF-5)

Un patrón de esta lista sin comando en disco vale **0 puntos**, no "pendiente". Comandos reales:

| Comando | Qué mide |
|---|---|
| `npm run audit:slop` | Deuda de slop **nueva** vs baseline (Exit 1 si aparece deuda no declarada) |
| `npm run audit:slop:strict` | Toda la deuda actual (auditoría completa) |
| `npm run seal:slop` | Sella la deuda actual en `.antigravity/slop_matrix_baseline.json` (solo con sanción del CEO: el baseline **nunca crece** sin ella) |
| `npm run audit:webgl` | R01–R06: DPR, rAF sin guarda, WebGL sin `prefers-reduced-motion`, `dispose()`, `w-screen` espacial, canvas sin reserva |
| `npm run audit:contrast:core` | Contraste WCAG 2.2 medido en Chrome real sobre las 10 rutas comerciales |

**Cobertura declarada, no fingida:** el auditor cubre **18 de los 46** patrones por análisis
estático. Los **28 restantes** no se pueden probar leyendo código y se publican como
`NO_MACHINE_CHECKABLE`: 22 exigen render real (jerarquía visual, ritmo vertical, cajas
anidadas, alturas de viewport), 4 exigen medición de navegador (curvas, iconos sin
`aria-label`, densidad de párrafo, mitigadores bajo el CTA) y 2 ya tienen comando externo
(S27 y S37 → `audit:webgl`). Ningún patrón se cuenta como verde sin comando.

**Regla de cierre de bloque UI:** ningún bloque que toque `src/**` se cierra sin
`npm run audit:slop` con Exit Code 0 (deuda nueva = 0) y sin declarar en el reporte qué
patrones quedaron `NO_MACHINE_CHECKABLE`.

4. **Paso 4: Micro-ajustes**: Ajustar tipografía, espaciado y física de animación sin alterar la estructura.
