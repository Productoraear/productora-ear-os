# WAVE 50 · SOBERANÍA DE VERTICALES — PLAN MAESTRO PARA EL OBRERO

> Destinatario: agente ejecutor (Cline / obrero bare-metal).
> Autor: arquitectura (esta sesión). Fecha: 2026-11-04.
> Regla: **el razonamiento ya está hecho**. El obrero NO decide arquitectura, NO explora el repo,
> NO reordena prioridades. Lee su `MISSION_ACTIVE.json`, edita los `files` y devuelve Exit Code.

---

## 1 · ROL QUE DEBE ADOPTAR EL OBRERO

**OBRERO EJECUTOR FORENSE S-CLASS** (no arquitecto, no consultor, no explorador).

| # | Regla | Consecuencia de incumplirla |
|---|---|---|
| R1 | Ejecuta **una sola tarea** por sesión y se detiene (Pacto ZTM) | Inflación de tokens y cola desordenada |
| R2 | Edita **solo** los archivos de `files` | Diff incontrolable, gates imposibles de medir |
| R3 | Antes de escribir, lee el archivo que va a tocar | Fachada silenciosa |
| R4 | Devuelve **Exit Code real** de `tsc` y `eslint`; si no lo ve, escribe `SIN_EVIDENCIA` | Reporte sin valor legal |
| R5 | Si el `test` de la tarea falla, **corrige el código, no el test** | Se destruye el antifachada |
| R6 | Si el contrato es imposible (falta una dependencia real), **para y reporta** con la ruta:línea que lo impide | Retrabajo y mentira de cierre |
| R7 | Prohibido `git add -A`, prohibido tocar Zona Cero, prohibido inventar comandos | ABORTA (INV-05, CHG-6) |

**Comando único de arranque (una sola vez, en sesión limpia):**

```powershell
node .antigravity/omega.js next
```

Eso escribe `.antigravity/MISSION_ACTIVE.json` con la primera tarea `QUEUED` y su prompt atómico.

---

## 2 · ORDEN DE EJECUCIÓN (dependencias reales, no estético)

| # | ID | Prioridad | Por qué en esta posición |
|---|---|---|---|
| 1 | `W50_T01_COMPILER_ABSOLUTE_CONTROL` | P0 | Es la fábrica de prompts del CEO. Sin esto, cada orden futura nace coja |
| 2 | `W50_T02_VERTICAL_RESILIENCE_BREAKER` | P0 | Es el seguro contra la caída total del negocio |
| 3 | `W50_T07_EVIDENCE_LEDGER_INTEGRITY` | P0 | Barato y desbloquea la credibilidad de todos los demás cierres |
| 4 | `W50_T03_MARKETPLACE_PARITY_MATRIX` | P1 | Convierte «lo que tiene el líder» en contrato ejecutable |
| 5 | `W50_T04_VERTICAL_CATALOG_SEO_ENGINE` | P1 | Dominancia de categoría por vertical (sin canibalización) |
| 6 | `W50_T05_CLINICAL_CLAIMS_EVIDENCE_DISCIPLINE` | P1 | Escudo jurídico del vertical sanitario |
| 7 | `W50_T08_ECOSYSTEM_TRUTH_HARNESS` | P1 | Un comando que dice la verdad del ecosistema entero |
| 8 | `W50_T06_ORPHAN_ROUTE_LEVELING` | P2 | Nivela las rutas menos favorecidas al estándar del resto |

**Dependencia dura:** T08 depende de que existan los verificadores de T01–T07. Ejecutar T08 el último.
**Las 7 tareas anteriores** (`W47_T04`, `W49_T02/T03/T04`, `W48_T03/T04/T05`) quedan detrás: no se borran,
no se reordenan a mano; el inyector las desplaza sin tocarlas.

---

## 3 · CÓMO SE INYECTA EN LA COLA (sin editar JSON a mano — WF-1)

```powershell
node .antigravity/inject_wave_w50.cjs --dry-run   # simulación: no escribe nada
node .antigravity/inject_wave_w50.cjs             # inyección real + backup automático
```

O doble clic en `INYECTAR_WAVE_50.bat`.

El inyector valida: id, `status=QUEUED`, rutas relativas, Zona Cero prohibida,
`action ≤ 1800`, `scaffold ≤ 7800`, `done_when ≤ 480`, `test ≤ 400`, ≥2 invariantes y ≥2 prohibiciones.
Si algo no cumple: **Exit 1 y no escribe nada**. Si ya está inyectado: no duplica.

---

## 4 · PREMORTEM (G-8) — cinco respuestas concretas

1. **¿Cumple el `done_when`?** Cada tarjeta exige un comando que devuelve Exit Code, no una descripción.
2. **¿Qué asunción es frágil?** Que `tsx` resuelva el alias `@/lib/...` en los verificadores: T01 y T02 deben
   usar imports **relativos** en los scripts (como ya hace `scripts/verify_master_guide.ts`).
3. **¿Qué alternativa descarté?** Editar `tasks_queue.json` a mano (más rápido, corrompe la cola y viola WF-1).
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** Un `action` > 1800 haría que el endpoint de
   inyección devolviera 400 sin escribir: lo detecta el validador del inyector, no el usuario.
5. **¿Qué firmo al aceptar esto?** Que la cola queda priorizada por dinero y verdad, no por comodidad: si el
   compilador sale falso, el CEO planificará con datos falsos durante semanas.

---

## 5 · DEFECTO DEL ORQUESTADOR CORREGIDO EN ESTA SESIÓN (ω)

`.antigravity/omega.js` ejecutaba `task.test` **solo si la tarea tenía archivos `.ts`/`.tsx`** (el bloque
estaba dentro de `if (hasTypeScript)`). Consecuencia medida por lectura: una tarea cuyos `files` son
`.cjs` + `.md` + `package.json` (T03, T06, T07, T08 de esta wave) habría cerrado con Exit Code 0
**sin ejecutar su verificador** y con el mensaje «validación de schema/JSON superada».

Corrección aplicada: `const root` se eleva fuera de la rama y la ejecución de `task.test` sale del `if`,
de modo que **toda tarea con `test` lo ejecuta siempre**. Si una tarea no declara `test`, el cierre
imprime `SIN_EVIDENCIA` en lugar de dar verde.

## 6 · DERIVA DOCTRINA ↔ CÓDIGO DETECTADA (declarada, no silenciada)

| Documento | Dice | Disco dice | Resolución |
|---|---|---|---|
| `.clinerules` §4 (U13) | `/confianza` = ❌ **NO_EXISTE** | `src/app/(public)/confianza/page.tsx` existe y consume `@/lib/evidence/evidence-ledger` | El contrato está desfasado. Se mantiene la página; se corrige el contrato cuando exista sonda G-6 en producción |
| `.clinerules` §4 (U1) | hash `8705d4…` de `/` | ledger tiene filas 47-49 con **el mismo** `87abf3…` para tres URLs | W50_T07 lo convierte en gate ejecutable |
