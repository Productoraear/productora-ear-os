# PREMORTEM — Bloque `ADMIN_DB_OFFLINE_DIAGNOSTIC` (G-8)

**Fecha:** 2026-11-04 · **Estado del sello:** `SOSPECHOSO` (0 gates de máquina ejecutados)
**Incidente asociado:** `TOOLING-CLINE-TERMINAL` — `run_commands` no devolvió Exit Code en toda la sesión (5/5 comandos, incluidos `Write-Output 'ALIVE'` y `node -e`).

---

## 1. ¿Cumple el `done_when` o he entregado un primo hermano?

**Cumple parcialmente, y lo digo sin adornos.** El encargo implícito al reportar el error era «quita este rojo». Mi entrega **no lo quita**: lo hace **legible**. El error sigue saliendo mientras PostgreSQL no arranque, y debe salir.

- Entregado: causa exacta + acción de remediación en el log del servidor **y** en el banner del panel.
- Entregado: gate `npm run verify:db-failure` (13 casos) para que la regresión no vuelva.
- **NO entregado:** la base de datos arriba. Exige `Start-Service postgresql*` + `npx prisma db push`, y sin terminal no puedo ejecutarlo ni probarlo.

Primo hermano descartado: silenciar el `console.error` o envolverlo en un `try` que no loguee. Habría dejado el panel bonito y al CEO ciego. Prohibido por AF-1/AF-5 y por INC-2.

## 2. ¿Qué asunciones frágiles sostienen esto?

| # | Asunción | Si es falsa… |
|---|---|---|
| A1 | El fallo es `P1001` (servidor caído) y no `P1000`/`P2021` | El clasificador seguiría acertando (cubre las 8 causas), pero el mensaje al CEO apuntaría a un comando inútil. Se autocorrige en cuanto el log muestre el `kind`. |
| A2 | Prisma 6.12 no rellena `.code` en los fallos de arranque | Si lo rellenara, el clasificador usa el mapa `P####` y sigue acertando. Sin riesgo. |
| A3 | El código nuevo compila | **No verificado.** `tsc --noEmit` no se ejecutó. Es la asunción más frágil del bloque. |
| A4 | `dbFailure` es serializable servidor→cliente (Next 16 RSC) | Es un objeto plano de strings creado por función pura: `{ kind, code, action }`. Sin `Date`, sin clase, sin función. |

## 3. ¿Qué alternativa descarté y por qué técnico (no por comodidad)?

**Descartada A — parchear el `if` dentro del `catch` de `page.tsx` (3 líneas: leer `errorCode ?? code`).**
*Motivo técnico:* el mismo patrón de «tragarse el error de Prisma» aparece en **12 puntos** del árbol (`.antigravity/dev_err.txt` lo repite en `/artistas/[slug]`, `PROFILES-SEARCH`, `VAMPIRE SERVICE`, `/api/...`). Un parche inline no es reutilizable, no es testeable y habría que repetirlo 12 veces con 12 criterios distintos.

**Descartada B — añadir `?connect_timeout=5` a la URL de `.env`.**
*Motivo técnico:* `.env` es un fichero compartido que contiene además claves `NEXT_PUBLIC_*`; tocarlo por un problema de disponibilidad local mezcla dos cambios (CHG-2: nunca migración y feature en el mismo deploy). Además el fallo actual es `ECONNREFUSED`, ya instantáneo: el timeout no habría cambiado nada.

**Descartada C — apuntar `.env.local` al PostgreSQL de producción en `82.29.179.172`.**
*Motivo técnico:* SEC-10 y CHG-5. Escrituras de desarrollo contra la base que factura.

## 4. ¿Qué se rompe y cómo lo detectamos ANTES que el cliente?

| Escenario | Detección preventiva |
|---|---|
| `tsc` falla por TS2869 en el `??` | **Anticipado y blindado**: anotación explícita `DbFailureKind \| undefined` (`dbFailureClassifier.ts:153-158`). Si aun así falla, es el primer sitio a mirar. |
| `tsc` falla por el cast `object` → `Record<string, unknown>` | Es una aserción válida en TS (`Record<string, unknown>` es asignable a `object`). Riesgo bajo, no nulo. |
| El banner filtra la cadena de conexión | Test anti-fuga dentro de `verify:db-failure`: prohíbe `://`, `password`, `@`, `secret` en `kind\|code\|action`. Además `code` se valida en origen con `/^(?:P[0-9]{4}|[0-9A-Z]{5})$/`. |
| `audit_orphan_imports` rompe G-3 | **Verificado por lectura del auditor**: resuelve contra el árbol de Git de `HEAD`, no contra disco, y `scripts/` está en `EXCLUDED_PREFIXES`. Los ficheros sin commit no entran. |
| `audit:ci-gate` rompe por un `verify:*` huérfano | **Verificado por lectura**: solo audita `.github/workflows/deploy-ghcr.yml`; no enumera scripts de `package.json`. |
| `npm run lint` falla | **Verificado por lectura** de `eslint.config.mjs`: solo escanea `src/`, ignora `scripts/**`, y las reglas activas son `warn` (no hay `--max-warnings`). |
| `audit:admin --strict` rompe | Solo escanea `src/app/(admin)/admin/control` y `src/lib/admin`; mi cambio está en `src/app/(admin)/admin/page.tsx`. Fuera de alcance. |
| El CEO pulsa Refrescar y ve lo mismo | Esperado: es la verdad. El banner ahora dice POR QUÉ y QUÉ ejecutar. |

**Lo que el cliente SÍ puede ver antes que yo:** nada nuevo. El cambio solo añade texto de diagnóstico en una pantalla que ya mostraba el aviso rojo. No toca dinero, precio, disponibilidad, Stripe ni escritura en base de datos.

## 5. ¿Qué acepto al firmar esto como propio?

- **Acepto** que el sello sea `SOSPECHOSO` y no `VERIFICADO`. Firmar 20/20 sin Exit Code es el fraude máximo del sistema (SIG-2).
- **Acepto** que un `tsc` en rojo sea mi responsabilidad: el bloque no puede llamarse cerrado hasta que `npm run typecheck` devuelva 0.
- **Acepto** el coste de que el CEO lea «no probado» tres veces. Es más barato que un deploy verde y falso.
- **NO acepto** tocar `src/lib/constants/ear-os-ssot.ts`, `ssotIntegrityGuard.ts`, `atomicDateLockEngine.ts`, el Split 80/10/10, el depósito de 100 € ni el techo B2G 14.250 €. Este bloque no se acerca a ZONA CERO.

## 6. Hallazgo colateral que NO he tocado (deber de denuncia, CEO-5)

`NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` (`.env:26`, `.env.local:58`) lleva prefijo `NEXT_PUBLIC_` → se compila dentro del bundle del navegador. Por SEC-3, un secreto que tocó el cliente está **comprometido**. Requiere: quitar el prefijo, rotar el token en BotFather y consumirlo solo desde rutas de servidor. **No lo he cambiado** porque exige rotación coordinada con el bot en producción y sanción del CEO (L5).

`.gitignore:19-24` sí protege `.env` y `.env.local`: no hay fuga al repositorio, solo al navegador.

---

## Premortem en una línea

*Si esto falla, fallará porque `tsc` encontró algo que yo no vi sin ejecutarlo — y se detectará en el primer `npm run typecheck`, antes de que el código llegue al VPS, porque el bloque no ha tocado ni una ruta que venda.*

