# ORDER Ω-001 · «Devolver la verdad a `/confianza` en producción»

```
EMISOR      : Arquitecto IA (Antigravity · S-Class)
RECEPTOR    : Cline ("El Obrero")
PRIORIDAD   : P0 — superficie pública de verdad (U13, .clinerules §4)
FECHA       : 2026-11-04
ESTADO      : EMITIDA · no ejecutada
BLOQUEA     : todo reporte al CEO (etiqueta vigente `⚠️ SIN_URL_PUBLICA`)
ANEXO       : CLINE_EXECUTION_LOG.md · entrada GOV-LOG-V13-001
```

## 1 · Contexto medido (no supuesto)

| Hecho | Evidencia |
|---|---|
| La página U13 **existe** y es un Server Component estático | `src/app/(public)/confianza/page.tsx` · 336 líneas · `dynamic = 'force-static'` (línea 22) · `readEvidenceLedger()` (línea 43) |
| En producción **responde 200 pero publica 0 filas** | `GET https://www.productoraear.com/confianza` → 200, 90.861 B · cuerpo: `Modo SIMULADO · probed=false · source=missing` · `Ledger no leído (missing): la página no puede afirmar nada` · `0 fila(s) vigente(s)` |
| En local el mismo dato **sí existe** | `npm run verify:confianza` → 17 filas · VERIFICADO=1 · SOSPECHOSO=12 · FACHADA=0 · SIN_EVIDENCIA=4 · `EXIT_CODE=0` |
| **Causa raíz (3 lecturas de disco)** | `.dockerignore:4` → `.antigravity` · `Dockerfile:21` → `COPY . .` · `src/lib/evidence/evidence-ledger.ts:34` → `LEDGER_RELATIVE_PATH = '.antigravity/evidence/ledger.jsonl'` · `:312-320` → `readFileSync(process.cwd() + path)` → `ENOENT` → `source:'missing'` → `deployBlocked:true` |
| Consecuencia de gobierno | La propia página declara `deployBlocked:true` (`evidence-ledger.ts:280-282`) **y está desplegada**. El gate dice «bloquea el deploy» y el deploy ocurrió: el candado no está cableado. |

## 2 · Objetivo (done_when, una sola frase)

`GET https://www.productoraear.com/confianza` devuelve **200** y su HTML contiene `source=live`, `Modo REAL`, `probed=true` y **al menos 1 fila** de promesa con su URL de prueba — verificado por sonda HTTP ejecutada desde un script en disco, no por lectura manual.

## 3 · Diagnóstico obligatorio antes de tocar nada (3 comandos)

```powershell
# D1 · ¿El ledger está versionado? (si no, el build remoto de Coolify jamás lo verá)
git ls-files --error-unmatch .antigravity/evidence/ledger.jsonl

# D2 · ¿Qué reglas lo excluyen hoy?
Select-String -Path .dockerignore,.gitignore -Pattern 'antigravity' -SimpleMatch

# D3 · Simulación exacta del contexto de build SIN construir la imagen
docker build --target builder -t earos-ctx-probe . 2>&1 | Select-String 'antigravity'
# (si Docker no está disponible en local, se ejecuta en el VPS: ssh root@82.29.179.172)
```

**Regla:** si D1 falla (fichero no versionado), se detiene el bloque y se resuelve primero el versionado con `git add -f .antigravity/evidence/ledger.jsonl`. Un `EXIT ≠ 0` en D1 con el paso 4 ya aplicado es un falso verde: la imagen local tendría el ledger y la de Coolify no.

## 4 · Cambio quirúrgico (2 ficheros, 0 líneas en `src/**`)

**A) `.dockerignore`** — sustituir la exclusión de directorio por exclusión de hijos + excepción quirúrgica:

```diff
-.antigravity
+# El ledger de evidencias ES la prueba pública de /confianza (U13, EP-4).
+# Se excluyen los hijos y se re-incluye SOLO el ledger: nada de bóvedas ni
+# volcados de .antigravity viajan a la imagen.
+.antigravity/*
+!.antigravity/evidence
+!.antigravity/evidence/ledger.jsonl
```

**B)** Nada más. **Prohibido** tocar `src/**`, `evidence-ledger.ts`, el SSOT, `package.json` (salvo el script del paso 5) o `verify:confianza` local.

**Por qué `*` y no borrar la línea:** un `.antigravity` abierto de par en par mete en la imagen bóvedas y volcados > 1 MB (INV-15). La excepción debe ser nominal, no de directorio.

**Reto espejo obligatorio (el obrero debe responder por escrito antes de aplicar):** ¿por qué no materializar el ledger en build desde git (`RUN git show …`) en vez de ampliar el contexto? Criterio de decisión: la opción elegida debe dejar `source:'live'` **y** no aumentar el contexto de build en más de 1 fichero. Si el obrero encuentra una tercera vía más estricta, la propone y se adopta la más exigente (Cláusula del Consenso Antagónico).

## 5 · Cerrojo anti-regresión (la orden no se cierra sin puerta que la vigile)

Añadir al script que ya ejecuta `npm run verify:confianza` un modo `--prod` (localizar el fichero real con `npm pkg get scripts."verify:confianza"`; **no** inventar ruta) y registrarlo en `package.json`:

```json
"verify:confianza:prod": "<mismo runtime que verify:confianza> <script> --prod"
```

Comportamiento exigido de `--prod`:

1. `GET https://www.productoraear.com/confianza` (host `www`, nunca el apex: 308).
2. Fallar con `EXIT 1` si el cuerpo contiene cualquiera de: `source=missing`, `probed=false`, `Modo SIMULADO`, `0 fila(s) vigente(s)`.
3. Pasar con `EXIT 0` solo si contiene `source=live` **y** `Modo REAL` **y** ≥ 1 fila.
4. Imprimir siempre: `HTTP_STATUS`, `BYTES`, `SHA256` del cuerpo, `ROWS`, `SOURCE`, `TS`.

Sin `SHA256` calculado en el propio script, el claim nace `SOSPECHOSO` (EP-1): el script es la pieza que convierte esta promesa en `VERIFICADO`.

## 6 · Secuencia de ejecución (atómica, en este orden)

1. D1, D2, D3 del §3. Si D1 ≠ 0 → arreglar versionado y repetir.
2. Aplicar §4-A. Releer el fichero completo para confirmar que no quedó ninguna regla `.antigravity` suelta.
3. Implementar §5. `npm run typecheck` y `npm run lint` → ambos `EXIT 0`.
4. `docker build -t earos-confianza-probe .` → `EXIT 0`. **Anotar el tamaño de la imagen** (dato previo obligatorio: si no hay imagen previa local, se anota el `docker images` del VPS antes del deploy).
5. `docker run --rm earos-confianza-probe sh -lc "ls -la .antigravity/evidence && wc -c .antigravity/evidence/ledger.jsonl && ls -la .antigravity"` → debe listar `ledger.jsonl` y **nada más** dentro de `.antigravity` (si aparece `reports/`, `ev/` o bóvedas: la excepción está mal escrita, se corrige antes de seguir).
6. Si 4 y 5 pasan: commit (`git status` + tamaño del diff revisados antes, CHG-6), push a `origin` (`productora-ear-os`) → Coolify despliega.
7. `npm run deploy:freshness` → `VERDICT=FRESH` (G-7). Si no es FRESH, no se sondea nada: el commit desplegado no es el tuyo.
8. `npm run verify:confianza:prod` → `EXIT 0` con `source=live`, `Modo REAL`, `SHA256` impreso.
9. Append al ledger (EP-4) + entrada nueva en `CLINE_EXECUTION_LOG.md` (nunca editar GOV-LOG-V13-001).

## 7 · Prohibiciones expresas (violarlas aborta el bloque)

- ❌ Tocar `src/app/(public)/confianza/page.tsx` o `evidence-ledger.ts` para «que funcione». El motor está bien; el dato no llega. **La página no se relaja.**
- ❌ Copiar el ledger a `public/` o a `src/data/` para «que viaje»: duplicaría la fuente de verdad y una de las dos mentiría con el tiempo.
- ❌ Añadir `.antigravity/evidence/ledger.jsonl` al `.gitignore` o crear un segundo ledger.
- ❌ Meter `.antigravity` completo en la imagen (bloat > 1 MB, INV-15) o desplegar sin medir el tamaño.
- ❌ Escribir `VERIFICADO` en el ledger sin la quíntupla: el propio `evidence-ledger.ts` lo degradaría a `SOSPECHOSO` en lectura y el gate `verify:confianza` saldría ≠ 0.
- ❌ Declarar cerrado el bloque con un `<iframe>`/captura de pantalla como prueba.

## 8 · DoD — aceptación binaria (8/8 para cerrar)

| # | Criterio | Comando | Evidencia exigida |
|---|---|---|---|
| 1 | `tsc` limpio | `npm run typecheck` | `EXIT_CODE=0` |
| 2 | `lint` limpio | `npm run lint` | `EXIT_CODE=0`, 0 errors |
| 3 | Contexto de build correcto | `docker run … ls -la .antigravity` | solo `evidence/ledger.jsonl` |
| 4 | Imagen sin bloat | `docker images` antes/después | incremento ≤ 1 MB |
| 5 | Deploy es el mío | `npm run deploy:freshness` | `VERDICT=FRESH` |
| 6 | Producción sirve la verdad | `npm run verify:confianza:prod` | `EXIT 0` · `source=live` · `Modo REAL` · `ROWS ≥ 1` · `SHA256` |
| 7 | Registro append-only | `read_files .antigravity/evidence/ledger.jsonl` | fila nueva con quíntupla, sin reescribir anteriores |
| 8 | Sin regresión en dinero | `npm run verify:pricing` + `npm run audit:ssot` | ambos `EXIT 0` (INV-01…INV-05 intactos) |

**Cierre:** `node .antigravity/omega.js complete <ID>` + entrada en `CLINE_EXECUTION_LOG.md`. Si 3, 5, 6 o 8 fallan → `SOSPECHOSO` y no se cierra (SIG-1).

## 9 · Rollback (< 5 min, ensayado no teórico)

1. `git revert <commit>` **solo** de `.dockerignore` y el script de §5 → push → Coolify reconstruye.
2. Verificar con `GET /confianza` que vuelve al estado anterior (`source=missing`) — es decir, al fallo conocido, nunca a un 500.
3. La página **no puede** romperse por este cambio: si tras el deploy devuelve 5xx, el fallo está en el patrón de `.dockerignore` (contexto roto), no en la página. Rollback inmediato y se reabre el bloque.

## 10 · Aprendizaje para el CEO (clase de 60 segundos)

**`source: 'missing'`** → qué es: la página dice que no encontró el registro de pruebas y por eso no afirma nada · por qué le importa: es su página de confianza pública, la que un cliente debe leer para creer en el depósito de 100 € · qué costaría ignorarlo: un cliente que entra en `/confianza` hoy ve «0 evidencias» y concluye que el sistema no prueba nada, justo lo contrario de lo que vende. Se arregla metiendo un fichero en la imagen, no reescribiendo la página.

---

**FIN ORDER Ω-001** · Emitida 2026-11-04 · No ejecutada. Al ejecutarse, se anota en el historial del log como `ORDER-OMEGA-001` con su `EXIT_CODE` por criterio.
