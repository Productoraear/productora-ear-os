# INC — Runner de shell inerte (sesión 2026-11-04)

**Sev**: SEV-3 (§10) — defecto de tooling, sin impacto económico directo, pero **bloquea G-1…G-8**.
**Estado**: ABIERTO · dueño: Arquitectura (Antigravity) · no es un defecto de producto.

## 1 · Hecho medido

Toda invocación de `run_commands` en esta sesión devuelve `exit=1` con **0 bytes de stdout** y
**cero efectos secundarios en disco**:

| # | cmd | resultado observado | efecto en disco |
|---|---|---|---|
| 1 | `Test-Path .antigravity/omega.js` | exit=1, sin stdout | n/a |
| 2 | `Test-Path '.antigravity/omega.js'` | exit=1, sin stdout | n/a |
| 3 | `node .antigravity/omega.js next` | exit=1, sin stdout | ninguno observado |
| 4 | `echo OMEGA_PROBE_OK` | exit=1, sin stdout | n/a |
| 5 | `node .antigravity/omega.js next *> .antigravity/.omega_next_probe.log` | exit=1, sin stdout | **fichero no creado** (ENOENT) |
| 6 | `Set-Content -LiteralPath '.antigravity/.shell_probe.txt' -Value 'SHELL_ALIVE'` | exit=1, sin stdout | **fichero no creado** (ENOENT) |

Prueba decisiva: la fila 6 usa un cmdlet nativo de PowerShell que **no depende de Node**.
Su no-ejecución demuestra que el problema no está en `omega.js` ni en el proyecto, sino en la
integración de terminal del agente (el proceso no llega a arrancar o su salida no se captura).

`search_codebase` falla de forma independiente: `timeout 30000ms` en 3 patrones triviales
(`audit:vanity`, `"id": "W48_`, `providers-manifest`) ⇒ el indexador también está caído.
**Solo `read_files` responde** (lectura directa de disco, sin proceso).

## 2 · Consecuencia sobre las puertas

- G-0 (Test-Path) → verificado por `read_files` (ENOENT = ausencia probada). Equivalente válido.
- G-1 `npm run typecheck` → **INALCANZABLE** (exit no observable).
- G-2 `npm run lint` → **INALCANZABLE**.
- G-3 `npm run gate:prepush` (18 puertas) → **INALCANZABLE**.
- G-6 sondeo HTTP + sha256 → **INALCANZABLE**.
- G-7 `deploy:freshness` → **INALCANZABLE**.

## 3 · Decisión

NO se implementa la misión `W48_T03_ADMIN_ZERO_VANITY_METRICS` en esta sesión. Motivo técnico,
no comodidad: un P0 de dinero/credibilidad de panel entregado **sin `tsc --noEmit` observable**
es exactamente el artefacto que §5 prohíbe cerrar, y barrer 4 vistas a ciegas produce el
"primo hermano de lo pedido" del premortem (INC-3.1): badge creado + vistas aún con cifras de
vanidad = peor que no tocarlo, porque parece hecho.

## 4 · Acción de reparación (una sola, atómica)

Reabrir terminal en Cline (matar la sesión de shell actual) y verificar con
`node .antigravity/omega.js next` que se obtiene stdout + `MISSION_ACTIVE.json` reescrito.
Si persiste: reiniciar la extensión. La misión ya está en disco (`.antigravity/MISSION_ACTIVE.json`),
por lo que **no se pierde trabajo**.

## 5 · Lo que este incidente NO es

No es un incidente de producción: `www.productoraear.com` no fue tocado, no se ejecutó ningún
deploy, no se escribió en PostgreSQL, no se modificó ningún fichero de `src/`.
