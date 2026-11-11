# Registro de versiones de la Directiva Maestra (ARCHITECT_DIRECTIVE_SOTA_2026)

Regla: cada elevación de la directiva es un evento de gobernanza, no una edición cosmética. Se anota aquí la versión, su SHA-256 medido y qué cláusulas entraron o cambiaron. El fichero de la directiva NO se reescribe para «corregir» historia: se eleva a v(n+1).

| Versión | SHA-256 del fichero | Fecha | Qué entra |
| :--- | :--- | :--- | :--- |
| v1 | `1aff43fb4fa865cef5d4bede9da3ce738b7266974ca4f89c0cbe037fe7bc0567` | 2026-11-10 | Base: separación de poderes (Arquitecto valida / Obrero ejecuta), reauditoría del ledger, §3 con los 6 gaps P1 del scorecard, §4 línea base tecnológica 2026, §5 mandato de elevación de cola, §6 barreras del obrero. |
| v2 | `2cf5e2c396da25faca9a08dec75a85ba9d44f16e25e710d4d84b41d1acdb31cb` | 2026-11-11 | **§7** las 27 enmiendas inmutables del Ledger (`76f68287`) + cláusula de inmutabilidad EP-4. **§8** sellado de W53_T01 (migración física), W53_T02 (bóveda AES-256-GCM) y W53_T03 (orquestador con jitter y transacción compensatoria) + deuda que NO se borra. **§9** protocolo adversarial Elephant + Goldfish (Constitutional SDD). **§10** diagnóstico del rebote GSC del 99,95 % (`SIN_EVIDENCIA` declarada) y hoja de ruta Wave 54 / Wave 56. **§11** contrato del cron W53_T05. Enmienda de la fila W53_T01 de «EN CURSO» a VERIFICADO. |

## Nota mecánica (imprescindible para el siguiente que eleve la directiva)

Cambiar el contenido **cambia el SHA-256**. Todos los contratos de elevación ya sellados en `tasks_queue.json` (`elevation_contract.spec_sha256`) y el sello del registro `ARCHITECT_APPROVAL.json` (`directive_sha256`) apuntan al hash vigente en el momento de su elevación. Esa divergencia histórica es legítima y **no se corrige reescribiendo tareas**: los contratos existentes conservan el hash de su versión y toda tarea nueva nace con el hash de la versión corriente. El instrumento `node .antigravity/omega.js audit --elevation-spec=.antigravity/specs/ARCHITECT_DIRECTIVE_SOTA_2026.md` re-sella el registro con el hash medido y lo deja escrito en `.antigravity/reports/omega_elevation_audit.json`.

Corolario: el título canónico de la directiva (v1) se conserva literal porque `scripts/omega_elevation_apply.cjs:68` identifica el mandato por su contenido. Renombrarlo apaga la auditoría con un falso verde.
