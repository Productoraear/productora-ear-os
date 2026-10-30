# W42_T02 · G-3 blindaje del preflight de contraste (append-only, ciclo 2026-10-30)

Fichero nuevo: no se reescribe `W42_T02_CONFIANZA_WIRING_AND_CONTRAST_HONESTY.md`.

## 1. Hallazgo: el gate se puso rojo por el ARRANQUE, no por el contraste

`npm run gate:prepush` (corrida de las ~15:0xZ) terminó con `GATE_EXIT=1` en la puerta 13:

```
[PREFLIGHT] http://localhost:3007 NO responde (TCP cerrado o timeout) · probed=false
[PREFLIGHT] Auto-arranque: node .next/standalone/server.js · PORT=3007 · static=PRESENT
[PREFLIGHT] El servidor propio no respondió en 15 s: SIN_EVIDENCIA
ROUTES_SIN_EVIDENCIA=10
VERDICT=BLOCKED
```

El guard fail-closed hizo lo correcto (no declaró verde sin medir), pero la causa era otra:
el servidor standalone, lanzado por el propio audit, no abrió TCP en el presupuesto de 15 s.
**Ese mismo hijo, en la misma máquina y con el mismo build, abre TCP en ~1 s.** Evidencia:

```
node .antigravity/diag_standalone_boot.cjs 3099 90000
BOOT_MS=1030
HTTP_STATUS=200
STDOUT_TAIL=▲ Next.js 16.3.5 … ✓ Ready in 0ms
```

Y la invocación EXACTA del gate, repetida a mano, salió verde:

```
npm run audit:contrast:core        # 10 rutas, shots=1
PREFLIGHT … probed=true · source=live · mode=REAL   (autoStarted=true)
TOTAL_FALLOS=0
ROUTES_SIN_EVIDENCIA=0
VERDICT=PASS
EXIT=0
```

Conclusión honesta: **intermitencia de arranque** (una vez rojo, una vez verde con el mismo comando).
Un gate intermitente no es un gate: es una lotería con formato de autoridad.

## 2. Lo que se cambió (solo en `scripts/audit_wcag_contrast_live.cjs`)

1. `PREFLIGHT_TIMEOUT_MS` 15 000 → **30 000**.
2. `PREFLIGHT_ATTEMPTS = 2`: primer intento en el puerto pedido; si no abre TCP, **reintento en
   puerto efímero** (esquiva un socket en estado raro del puerto original) y el hijo fallido se
   mata antes de reintentar (nada de huérfanos escuchando).
3. Diagnóstico mudo → diagnóstico siempre: se loguea `childExit` y el stderr del hijo en cada
   intento fallido, incluido el caso "proceso vivo sin escuchar".
4. **Integridad de evidencia**: si `preflight.probed === false`, el script **aborta antes de lanzar
   Chrome y no escribe** `reports/contrast/wcag_report.json`. Antes, la corrida rota sobrescribió
   la última medición real (10 rutas a `scan 0`), que es una forma silenciosa de destruir prueba.
5. `--autostart=0`: flag **solo de diagnóstico** para reproducir el caso sin servidor y demostrar
   que el guard falla cerrado. En el gate vale 1 por defecto.

Ninguna aserción se relajó: sigue exigiendo `probed=true`, `routesWithZeroScan===0` y `failures===0`.

## 3. Verificación del cambio (medida, no opinada)

Camino negativo (`--autostart=0`, sin servidor):

```
node --check scripts/audit_wcag_contrast_live.cjs      → CHECK_EXIT=0
node scripts/audit_wcag_contrast_live.cjs --routes=/ --shots=0 --autostart=0
  [PREFLIGHT] autostart desactivado (--autostart=0): no se arranca servidor
  SIN_EVIDENCIA: preflight probed=false; no se lanza Chrome ni se escribe informe
  VERDICT=BLOCKED                                       → NEG_EXIT=1
  wcag_report.json.generatedAt sigue siendo 2026-10-30T15:09:47.015Z   (intacto)
```

Camino positivo tras el refactor (autostart real, 6 rutas):

```
node scripts/audit_wcag_contrast_live.cjs --routes=/,/proveedores,/reservar/solista,/vimume,/calculadora,/confianza --shots=0
preflight={"probed":true,"source":"live","mode":"REAL","autoStarted":true}
route=/               status=200 scanned=96   failures=0
route=/proveedores    status=200 scanned=157  failures=0
route=/reservar/solista status=200 scanned=268 failures=0
route=/vimume         status=200 scanned=222  failures=0
route=/calculadora    status=200 scanned=271  failures=0
route=/confianza      status=200 scanned=168  failures=41
TOTAL_FAILURES=41
```

## 4. Deuda P2 medida en `/confianza` (fuera del alcance de T02)

`/confianza` no está en la lista de 4 ficheros de T02, así que **no se toca color aquí**.
Causa única, agrupada por token (no por elemento):

| Token | Fondo | Ratio | Tamaño/peso | Casos |
|---|---|---|---|---|
| `rgb(113,113,122)` = `#71717a` | `rgb(8,8,11)` = `#08080b` | **4.14:1 < 4.5:1** | 12px/400 | 16 |
| `#71717a` | `#08080b` | 4.14:1 | 10px/400 | 5 |
| `#71717a` | `#08080b` | 4.14:1 | 10px/500 | 4 |
| `#71717a` | `#08080b` | 4.14:1 | 11px/400 | 16 |

Arreglo propuesto (una sola pasada de token en `src/app/(public)/confianza/page.tsx`):
`#71717a` → `#a1a1aa` (ya usado en la misma página y **no** marcado por el medidor).
Comando que lo cierra: `npm run audit:contrast -- --routes=/confianza --shots=0` con
`TOTAL_FALLOS=0`.

## 5. Herramientas de diagnóstico añadidas (`.antigravity/`)

- `diag_standalone_boot.cjs` — mide `BOOT_MS` y `HTTP_STATUS` del standalone. Read-only.
- `summarize_contrast_report.cjs` — resume `wcag_report.json` por ruta **y por token**. Read-only.

Ambas son de solo lectura: no escriben ledger ni tocan producción.

## 6. Cierre del riesgo abierto en R2 («no se ha medido cuántas rutas arrastran el token»)

Medido, y con la lista de 10 rutas del gate (`audit:contrast:core`), corrida de las 15:09:47Z:

```
/ status=200 scanned=96  failures=0      /vimume     status=200 scanned=222 failures=0
/proveedores 157 failures=0              /fincas     status=200 scanned=243 failures=0
/otzarreta   369 failures=0              /directorio status=200 scanned=352 failures=0
/encargos    152 failures=0              /calculadora status=200 scanned=271 failures=0
/reservar/solista 268 failures=0         /artistas   status=200 scanned=221 failures=0
TOTAL_FAILURES=0 · TOTAL_INDETERMINATE=0
```

**El token `#71717a` sólo falla en `/confianza`**: la deuda P2 queda acotada a 1 fichero
(`src/app/(public)/confianza/page.tsx`), no a la superficie comercial. La home, el flujo que
cobra (`/reservar/solista`), proveedores y VIMUME están limpios.

## 7. G-3 medida tras el blindaje: `gate:prepush` VERDE (21 comandos encadenados)

Ejecución desacoplada (el gate dura >10 min y el terminal de Cline es de un solo hilo; ver §8):

```
.antigravity/run_gate_bg.cmd  →  npm run gate:prepush > %TEMP%\ear_gate4.log
GATE_EXIT=0            (marcador %TEMP%\ear_gate_exit.txt = 0)
logLines=5086
```

Evidencia de la puerta 13 (`audit:contrast:core`), la que estaba roja:

```
[PREFLIGHT] http://localhost:3007 NO responde (TCP cerrado o timeout) · probed=false
[PREFLIGHT] Auto-arranque 1/2: node .next/standalone/server.js · PORT=3007 · static=PRESENT
[PREFLIGHT] Servidor propio vivo en http://127.0.0.1:3007 (TCP abierto) · probed=true · source=live · mode=REAL
ROUTES_SIN_EVIDENCIA=0
VERDICT=PASS
```

Evidencia de la puerta 20 (`verify:confianza`), la que estaba roja por AF-1:

```
[OK] FOOTER_LINK: 2 enlaces a /confianza (funnel limpio + footer completo)
[OK] CACHE_HEADER: /confianza declara s-maxage=300 (declarativo: G-6 debe confirmarlo en produccion)
[OK] LEDGER_READ: .antigravity/evidence/ledger.jsonl · 6426 B · sha256=b262a80b0aa882e2d5fedaa3ac86167b4dc7f72e0d124a1ed07ce018f6a68ac9
[OK] NO_FACADE: 0 fachadas activas
SUMMARY {"exit_code":0,"rows":7,"facades":0,"degraded":0,"anomalies":0,"checks":10,"failed":[]}
```

`NO_FACADE` pasa porque la fila más reciente de `AF-1` es `SOSPECHOSO` (supersede), no porque
se haya retirado el hallazgo: la deuda sigue en el ledger y se cierra con G-6 en producción.

## 8. Dry-run de G-6 antes del deploy (la sonda debe fallar cerrada)

```
node --check .antigravity/probe_af1_g6.cjs            → CHECK_EXIT=0
node .antigravity/probe_af1_g6.cjs                    → PROBE_EXIT=1  (sin --append: no escribe ledger)
[G-6] AF-1 · HTTP 200 · 1463 B · sha256=19defb632cd7bfdb58ef8dc0e0c1d2663ec7cafa589b51918a750e58a4c23690
      instance.checkedAt=2026-10-30T15:54:58.030Z · webhooks=7 · dlqCount=0
[FAIL] AF-1: probed!==true · [FAIL] AF-1: source distinto de "live" · [FAIL] AF-1: mode distinto de "REAL"
[G-6] U13  · HTTP 404 · cache-control="private, no-cache, no-store, max-age=0, must-revalidate" · markers=[]
[FAIL] U13: HTTP 404 · [FAIL] U13: Cache-Control sin s-maxage=300 · [FAIL] U13: HTML sin marcadores del ledger
SUMMARY {"exit_code":1,"verdict":"SIN_EVIDENCIA","failures":6}
```

Lectura honesta de ese rojo: producción **sirve todavía el build anterior**. El cuerpo de
`/api/webhooks/health` tiene `instance.checkedAt` y `dlqCount:0` (los 7 webhooks están
registrados), pero **no** emite `probed`/`source`/`mode`, y `/confianza` responde 404.
Nada de esto se arregla en local: se arregla desplegando. La sonda está calibrada para no
poder firmar `VERIFICADO` contra un build viejo.

## 9. Nota operativa (aprendizaje para futuras sesiones)

`gate:prepush` tarda >10 min aquí: `audit_orphan_imports` resuelve imports contra el árbol de
git con un `git show` por import (minutos en Windows con disco cargado). Lanzarlo en primer
plano en el terminal de Cline provoca que cualquier comando posterior lo mate a mitad. Se
resuelve con `.antigravity/run_gate_bg.cmd` (proceso desacoplado + marcador de Exit en disco).
Segundo modo de fallo detectado hoy: **dos gates simultáneos** (uno huérfano de un intento
matado) duplican el trabajo de git y pueden escribir el mismo `wcag_report.json`; antes de
lanzar el gate hay que verificar que no quede cadena viva.

Contenido del lanzador (el fichero no se versiona: `.gitignore:201` ignora `.antigravity/*.cmd`,
regla preexistente que NO se toca):

```bat
@echo off
setlocal
set "REPO=%~dp0.."
cd /d "%REPO%"
set NEXT_TELEMETRY_DISABLED=1
if exist "%TEMP%\ear_gate_exit.txt" del /q "%TEMP%\ear_gate_exit.txt"
call npm run gate:prepush > "%TEMP%\ear_gate4.log" 2>&1
set RC=%ERRORLEVEL%
echo %RC% > "%TEMP%\ear_gate_exit.txt"
endlocal
```



