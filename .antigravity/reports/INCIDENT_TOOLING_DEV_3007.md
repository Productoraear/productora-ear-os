# INCIDENTE `TOOLING-DEV-3007` — Canal de ejecución del agente sin salida

**Abierto:** 2026-11-05 · **Dueño:** sesión Cline (obrero) · **Escalado a:** CEO / Arquitectura
**Severidad:** `SEV-2` — no degrada producción, pero **anula toda verificación máquina** del bloque en curso.
**Etiqueta pública:** ⚠️ `SIN_URL_PUBLICA`

---

## 1 · Síntoma medido

`run_commands` devuelve **exit 1 con stdout vacío** para cualquier comando, incluido `node --version`.
Sondeos en esta sesión: ≥5 variantes previas + `node -e "JSON.parse(tasks_queue)"` + `node --version` = **7 intentos**, 7 fallos.
Ninguno produjo Exit Code fiable: el mensaje del runner es «Command completion could not be observed», no una salida de programa.

## 2 · Causa raíz

**SIN_EVIDENCIA.** Sin stdout ni stderr no hay diagnóstico posible; toda hipótesis (capa PTY del host, proceso hijo zombi del dev server en el puerto 3007, política de ejecución) es **no verificable** y por tanto no se escribe como causa.

## 3 · Impacto en el contrato

- Ningún bloque puede sellarse `VERIFICADO` (§15 SELLO CONDICIONADO, SIG-1): el techo es `SOSPECHOSO`.
- `npm run typecheck` · `npm run lint` · `npm run audit:omega-rojo` · `verify:budget` · las 17 puertas: **escritas pero no ejecutadas** en esta sesión.
- G-6 (sonda HTTP + `sha256`) y G-7 (`deploy:freshness`): **FAIL por imposibilidad**, no por defecto del código.
- Producción: **no sondeada hoy** → su estado es `SIN_EVIDENCIA`, no «sana» ni «caída».

## 4 · Mitigación aplicada (sin terminal)

1. Todo entregable se escribió en disco y se volvió a leer con `read_files` para confirmar contenido y número de línea (G-0 por lectura, no por ejecución).
2. Los tres ficheros del bloque (columna `cambios[]`) quedaron verificados línea a línea tras la edición: cola JSON con 3 tareas, auditor de 353 líneas con `INLINE_PROBES` cableado a los ítems #3/#7/#8, orden ejecutiva §1-§9 cerrada.
3. Se prohíbe expresamente firmar 20/20 en estas condiciones (SIG-2).

## 5 · Acción de desbloqueo (dueño y fecha)

| # | Acción | Dueño | Fecha | Verificación (Exit Code real) |
|---|---|---|---|---|
| 1 | Reiniciar la ventana de terminal / la extensión en VS Code y abrir **una** sesión nueva de Cline | CEO | 2026-11-05 | `node --version` → exit 0 con versión impresa |
| 2 | Si sigue muerto: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\ear_dev_reset.ps1 -NoProbe` desde una consola del CEO (mata zombis del puerto 3007 y relanza el dev server) | CEO | 2026-11-05 | el script escribe `.antigravity/dev_status_live.txt`; se busca `RESULT=OK` |
| 3 | Cerrar el incidente sólo con evidencia | Cline | tras 1-2 | `npm run audit:omega-rojo` imprime las 20 líneas y `.antigravity/reports/omega_rojo_scorecard.json` existe con `items.length === 20` |

## 6 · Comunicación al CEO (3 líneas)

1. El terminal del agente no devuelve ni una línea: por eso no puedo firmar nada como «verificado» hoy.
2. No afecta a la web ni a los cobros; afecta a mi capacidad de demostrar que el código nuevo funciona.
3. Necesito 30 segundos tuyos: cerrar y reabrir la ventana de terminal (o reiniciar VS Code) antes de lanzar la tarea T01.

## 7 · Post-mortem sin culpables

La causa no es una persona ni un comando concreto: es un canal que dejó de reportar y un sistema que, correctamente, se negó a fingir que reportaba. El daño real habría sido el contrario: sellar `20/20` con el canal muerto.
