# W46_T04 - PUERTA DE FRESCURA DEL DESPLIEGUE (correccion de un reporte falso)

**Fecha**: 2026-10-30 · **Severidad**: P0 (el arreglo de voz NO estaba en produccion)
**Estado_Bloque**: VERIFICADO (la medicion) / el despliegue sigue **BLOQUEADO por credencial**

---

## 1. Lo que yo afirme y era FALSO

En el cierre anterior firme: "`build-and-push` OK, imagen en GHCR + webhook Coolify disparado -> el arreglo va camino de produccion".
La captura del CEO desmintio el matiz clave: la anotacion real del run es

> `Coolify devuelve 401 (No autenticado) ... El despliegue NO esta en marcha.`

Por que mi lectura fallo: el paso `Trigger Coolify Webhook Deployment` tiene
`continue-on-error: true`. En la API de GitHub, un paso con `continue-on-error`
normaliza `conclusion = success` aunque su `outcome` sea `failure`; el 401 aparece
solo como **anotacion** y el job queda verde. Mi consulta (`--json jobs`) no expone
`outcome`, asi que lei "success" y cante un despliegue inexistente.

## 2. Verdad medida contra produccion (no supuesta)

Sonda sobre el grafo de chunks vivo (`/_next/static/chunks/*.js`, 2 niveles, HOME):

| Medicion | Valor |
|---|---|
| `HOME_HTTP` | 200 (139.197 bytes) |
| `CHUNKS_FETCHED` | 19 |
| Aguja de CONTROL `Omni-Supervisor coordinando` (existia ANTES del fix) | **1 acierto** -> `/_next/static/chunks/3ipane50c-3ff.js` |
| Agujas NUEVAS `earPrimer` / `primeSpeechSynthesis` (solo existen POST-fix) | **0 aciertos** |
| Veredicto | **STALE**: el chunk del modal es alcanzable pero NO contiene el fix |

Conclusion: **produccion sirve una imagen vieja. El deploy nunca se ejecuto.**

## 3. Causa raiz exacta (configuracion, no codigo)

- Secrets del repo (`gh secret list`): `COOLIFY_WEBHOOK_URL` (2026-10-24) y `CRON_SECRET` (2026-10-28).
- **NO existe `COOLIFY_API_TOKEN`** -> el workflow llama a `/api/v1/deploy` sin cabecera
  `Authorization: Bearer` (`COOLIFY_AUTH=none`) -> Coolify v4 (Sanctum) responde **401**.
- El comentario del workflow decia que el deploy real entraba "por el webhook git de
  Coolify al hacer push". **Medido: falso** — ningun push de hoy ha actualizado el bundle.

## 4. Lo que SI se ha blindado (codigo, dentro de mi mandato)

El fallo real no fue el 401: fue que **el pipeline no medía el despliegue**. Tres piezas:

1. `src/app/api/health/route.ts` publica `buildSha` y `buildTime` (antes solo `status`/`timestamp`).
2. `Dockerfile` (stage `runner`) acepta `ARG EAR_BUILD_SHA` / `ARG EAR_BUILD_TIME` y los
   expone como `ENV`; `.github/workflows/deploy-ghcr.yml` los inyecta con
   `build-args: EAR_BUILD_SHA=${{ github.sha }}`. **El SHA viaja dentro de la imagen.**
3. `scripts/prod_deploy_freshness.cjs` (nuevo, 0 dependencias) compara el SHA vivo con el
   construido y **falla** si no coinciden. Cableado como paso propio en `production-smoke`
   (`EAR_EXPECTED_SHA: ${{ github.sha }}`, `--wait=120`).

Exit codes: `0` FRESH · `4` STALE (sirve otro SHA) · `5` UNVERIFIABLE (imagen anterior al
sello) · `1` red. Los modos 4 y 5 imprimen la receta exacta de remediacion en Coolify.

## 5. Validaciones ejecutadas (comandos reales)

| Comando | Resultado |
|---|---|
| `node ./node_modules/typescript/bin/tsc --noEmit` | **Exit 0** |
| `node ./node_modules/eslint/bin/eslint.js src/app/api/health/route.ts` | **Exit 0** (0 errores, 0 warnings) |
| `node ./node_modules/eslint/bin/eslint.js scripts/prod_deploy_freshness.cjs` | Exit 0 pero **IGNORADO** por patron (mismo limite ya declarado en el commit 0206ece: `.eslintignore` cubre `scripts/`) |
| `node scripts/prod_deploy_freshness.cjs` (diagnostico) | **Exit 0** · `buildSha=<ausente>` · "produccion NO publica buildSha" |
| `node scripts/prod_deploy_freshness.cjs --expect=4a7c11ebe` (simula CI) | **Exit 5** `VERDICT=UNVERIFIABLE` + receta Coolify |
| `npm run audit:ci-gate` | **Exit 0** · 4 jobs · 2 gates bloqueantes · 0 fugas |

## 6. Limites declarados (sin maquillaje)

- **El despliegue sigue sin ejecutarse.** No puedo crearlo: el token de Coolify exige
  acceso al panel del VPS (82.29.179.172:8000) y no existe en este entorno. Todo lo
  anterior detecta y prueba; no despliega.
- `scripts/prod_deploy_freshness.cjs` no pasa por lint (`.cjs` en `.eslintignore`). Su
  garantia es el propio harness: 2 ejecuciones medidas arriba con exits 0 y 5.
- La puerta nueva pondra el run en **ROJO** hasta que exista un despliegue real. Eso es
  intencionado: rojo honesto > verde falso.
- La audibilidad en iPhone sigue **SOSPECHOSO** (sin dispositivo real aqui).

## 7. Accion que desbloquea todo (2 minutos, requiere al CEO)

En Coolify (`http://82.29.179.172:8000`):
1. `Settings > Advanced > API access = Enabled`.
2. `Keys & Tokens > Create` con permiso **Deploy** -> copiar el token.
3. En GitHub: `Settings > Secrets and variables > Actions > New secret` -> nombre
   **`COOLIFY_API_TOKEN`**, valor el token. (Opcional: confirmar que `COOLIFY_WEBHOOK_URL`
   apunta al endpoint de deploy de la app correcta.)
4. Re-ejecutar el workflow (o `gh workflow run`). Al terminar, `npm run deploy:freshness`
   debe imprimir `buildSha=<sha del commit>` y el step de frescura pasara a VERDE.

Alternativa sin token: activar el **webhook git de la app** en Coolify para que despliegue
al recibir push.

Complementario (`W46_T02_P0_CRON_SECRET_INTAKE`): definir `CRON_SECRET` **tambien en el
entorno de la app en Coolify** (hoy solo existe como secret de GitHub) para que
`POST /api/...` deje de devolver 503 y los leads no se rechacen.

## 8. Premortem

Si el SHA no llega al contenedor, la puerta de frescura acusara STALE para siempre y el
equipo podria "aprender" a ignorarla. Mitigacion: el mensaje de fallo imprime la causa y
la remediacion, y el modo diagnostico (`npm run deploy:freshness`) permite distinguir
"no desplegado" de "desplegado mal" en 5 segundos.

---

## 9. Evidencia medida EN CI (run 41022160443, commit 996e0e9c0)

La puerta nueva **no quedo SKIPPED pese al fallo del smoke** (`if: always()`), y su
veredicto es exactamente el hecho real:

| Job / paso | Resultado |
|---|---|
| `contract-gate` | OK 7s |
| `typecheck-gate` (incluye `verify:voice` 5/5) | OK 1m55s |
| `build-and-push` (imagen con `EAR_BUILD_SHA=996e0e9c0`) | OK 5m20s |
| `Smoke de produccion` | **X** `SMOKE_POST=POST_HTTP_503` · `SMOKE_LANDING=HTTP_200` · `SMOKE_RESULT=FAILED EXIT=3` |
| `Frescura del despliegue` | **X** `HEALTH intento 1..8 http=200 buildSha=<ausente> esperado=996e0e9` -> `VERDICT=UNVERIFIABLE` |

Prueba adicional de que no hubo redeploy: `SMOKE_IMAGE_BUILD_ID=30e6yKASYBBg4vbXA-1Hn` es
**identico** al medido 17 minutos antes (07:37 y 07:54). Un despliegue real habria cambiado
el build id de Next. **Produccion no se ha movido.**

Lectura correcta del estado del pipeline: hay 2 rojos y los 2 son verdaderos —
(1) el despliegue no se ejecuta (falta `COOLIFY_API_TOKEN`), (2) `CRON_SECRET` no existe en
el entorno de la app en Coolify. Ninguno de los dos se puede cerrar desde este repositorio.

