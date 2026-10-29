# W46_T01 — Gate de TypeScript en CI (evidencia máquina)

**Fecha**: 2026-10-29 · **Bloque**: P0-CI (gobierno de publicación de imagen) · **Estado**: VERIFICADO
**Misión**: cerrar el agujero por el que el CI podía publicar en GHCR una imagen con TypeScript roto.

## 1. El agujero (por qué existía)

`next.config.ts:37` → `typescript.ignoreBuildErrors: true` (se mantiene: voltearlo exige medir memoria en el VPS de 4 GB).
Consecuencia: `docker build` **no typechequea**. El único `tsc --noEmit` real era el que lanzaba un humano en local.
`deploy-ghcr.yml` iba de `contract-gate` (auditor de fachadas) directo a construir y publicar la imagen.
⇒ Un error de tipos entraba en `main` y se publicaba como imagen de producción con el run en verde.

## 2. La corrección

`deploy-ghcr.yml` gana el job `typecheck-gate`:

| Elemento | Valor verificado |
|---|---|
| `needs` del job | `contract-gate` |
| Runtime | Node `22` (el mismo del `Dockerfile`: `node:22-alpine`; Node 20 está EOL) |
| Instalación | `npm ci --include=dev --legacy-peer-deps --no-audit --no-fund` (lock exacto, lock en sync verificado con `--dry-run` → Exit 0) |
| Prisma | `node ./node_modules/prisma/build/index.js generate` con `POSTGRES_PRISMA_URL` ficticia (valida schema, no conecta) |
| Typecheck | `node ./node_modules/typescript/bin/tsc --noEmit` (binario real del repo, no un `npx` a ciegas) |
| Presupuesto | `timeout-minutes: 20` (medido en local: 23,5 s) |
| Bloqueo | `build-and-push` → `needs: [contract-gate, typecheck-gate]` |

## 3. Evidencia (comandos → Exit Code real)

| Comando | Resultado |
|---|---|
| `tsc --noEmit` (binario del repo, cronometrado) | **Exit 0** · **23,5 s** · **0 bytes** de diagnóstico |
| Assert del workflow (YAML 1.2) | **Exit 0** → `JOBS=contract-gate,typecheck-gate,build-and-push,production-smoke` · `TYPECHECK_NEEDS="contract-gate"` · `TYPECHECK_NODE=22` · `BUILD_NEEDS=["contract-gate","typecheck-gate"]` · `SMOKE_IF=always()` |
| Guardián de cableado — workflow real | **Exit 0** · 16 aserciones OK |
| Guardián — mutante A: `needs` sin `typecheck-gate` | **Exit 1** (aborta) |
| Guardián — mutante B: sin el `run:` de `tsc` | **Exit 1** (aborta) |
| Guardián — mutante C: `tsc --noEmit \|\| true` | **Exit 1** (aborta) |

Los tres mutantes se ejecutan en cada `gate:prepush` y en el propio job `contract-gate` de CI: el cableado no puede
degradarse en silencio.

## 4. Hallazgo forense: el auditor también tenía una fachada

La primera versión del guardián comprobaba que el job **contuviera** el texto `tsc --noEmit`. El test negativo B
(borrar la línea `run:`) **pasó en verde**, porque el *nombre* del step también contiene ese texto.
Un gate satisfecho por su propia etiqueta es exactamente la fachada que este bloque persigue.
Corregido: el guardián extrae **solo líneas `run:`** (`runCommands()`), nunca `name:` ni comentarios.
Y se añadió el cerrojo que faltaba: `|| true`, `|| exit 0`, `set +e` y `continue-on-error: true` también se detectan.

## 5. Límites honestos (lo que esto NO prueba)

- No se ha ejecutado todavía en GitHub Actions: la evidencia es local. El primer run real es el juez definitivo.
- Node local = `v26.12.1`; CI = `22`. TypeScript es agnóstico al runtime, pero no es la misma máquina.
- `ignoreBuildErrors: true` sigue activo: la imagen se construye igual, lo que cambia es que **no se publica** si los tipos fallan.

## 6. Premortem

Si el guardián diera un falso positivo, `build-and-push` quedaría saltado y no habría imagen nueva en GHCR; el deploy
de Coolify entra por webhook git, así que no hay caída de producción, solo imagen obsoleta. Detección antes que el
cliente: el guardián imprime cada aserción con su nombre y `--strict`-style `[FAIL]`, y `tsc` imprime `archivo:línea`.
