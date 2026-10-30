# U13 `/confianza` · AF-1 · inestabilidad de hashes — 2026-10-30

**Tarea:** construir la Superficie de Verdad Pública (`.clinerules` §4 · U13) que faltaba,
y decidir AF-1 con evidencia medida, no con opinión.

## Reporte CEO (5 líneas, CEO-1)

1. **Qué cambió:** existe ya `/confianza`, una página estática que lista cada promesa con su
   estado (`VERIFICADO`/`SOSPECHOSO`/`FACHADA`/`SIN_EVIDENCIA`), su URL de prueba y su fecha,
   generada en build desde `.antigravity/evidence/ledger.jsonl`.
2. **Qué riesgo desaparece:** el de publicar promesas sin respaldo. Si una fila no tiene
   evidencia, la página no la muestra como verificada, y una `FACHADA` bloquea el deploy.
3. **URL que lo prueba:** todavía **ninguna**: `https://www.productoraear.com/confianza`
   respondió **404** el 2026-10-30T10:24:43Z. La página existe en disco y compila; no está
   desplegada. Etiqueta obligatoria: `⚠️ SIN_URL_PUBLICA`.
4. **Qué NO está probado:** que producción sirva esta página (falta deploy + sonda G-6), que
   n8n tenga los 7 workflows registrados de verdad (el `7` era un array de configuración) y
   que el motor de IA local esté vivo (`SIN_CONFIRMAR`). Añadido hoy: la puerta de contraste
   WCAG devuelve verde **sin medir nada** (Hallazgo 6) — no la use como aval de accesibilidad.
5. **Qué decisión necesito:** dos. (a) Autorizar el commit explícito y el deploy del parche
   `AF-1` + `/confianza` a Coolify, y decir si el bloque previo de `cronSecretGuard` viaja en
   el mismo deploy o en otro. (b) Ordenar cuándo se enciende `audit:contrast:core` honesto
   (scan 0 ⇒ Exit 1), porque al encenderlo el gate se pondrá rojo por un motivo ajeno a U13.
   Hasta ese deploy, `npm run verify:confianza` sale **1** a propósito.

## Estado por bloque (vocabulario cerrado, EP-2)

| Bloque | Estado | Evidencia |
|---|---|---|
| Página `/confianza` en disco | `VERIFICADO` | `src/app/(public)/confianza/page.tsx` · 15 340 B · `tsc --noEmit` exit 0 · `next build` exit 0 · `/confianza` prerenderizada `○ Static` |
| Gate `verify:confianza` | `VERIFICADO` | `scripts/verify_trust_ledger.ts` · 8 checks · `SUMMARY {"exit_code":1,"rows":7,"facades":1,"degraded":0,"anomalies":0,"checks":8,"failed":["NO_FACADE"]}` — el rojo es la señal correcta |
| Ledger | `VERIFICADO` | 5 710 B · 12 líneas · 7 filas vigentes · 0 anomalías · sha256 `a240186cb5a254a5a6c787c7590d810a3738decc147832387344f7093a76b704` |
| Gate completo `gate:prepush` | `VERIFICADO` | 19 puertas · `GATE_EXIT=1` · único fallo `NO_FACADE` (AF-1) · resto Exit 0 (Hallazgo 6) |
| Servicio local de `/confianza` | `VERIFICADO` | standalone :3999 · `HTTP/1.1 200 OK` · `Content-Length: 133044` · `x-nextjs-prerender: 1` |
| Puerta de contraste WCAG | `SOSPECHOSO` | Exit 0 con `scan 0` en las 10 landings (Hallazgo 6) |
| Producción con `/confianza` | `SIN_EVIDENCIA` | 404 medido 2026-10-30T10:24:43Z · falta redeploy + G-6 |
| Telemetría `/api/webhooks/health` | `FACHADA` | ver Hallazgo 1 · el parche está en código, no en producción |

## Hallazgo 1 — AF-1 reproducido y parcheado (sin desplegar)

Antes (`src/app/api/webhooks/health/route.ts:50-55`): se devolvía
`alive:true, status:200, latencyMs:12` con un `checkedAt: new Date()` recién fabricado, sin
tocar n8n. Un monitor que consultaba la URL sin `?ping=true` recibía verde permanente.

Ahora (`route.ts:50-57` y cuerpo `69-86`): `pingN8nInstance()` se ejecuta **siempre**
(timeout 4 s, nunca lanza), y el cuerpo declara `probed:true`, `source:"live"`,
`mode:"REAL"`, `checkedAt` real, `webhookSource:"canonical-config"` y
`dlqScope:"process-local"`. `?ping=true` se conserva por compatibilidad.

Por qué sigue en `FACHADA`: **producción no está redeployada**. El cuerpo sondeado a las
10:24:43Z aún no lleva esos campos. Declarar el arreglo sin sonda sería exactamente el
fraude que AF-1 prohíbe.

## Hallazgo 2 — un hash de cuerpo dinámico no es evidencia estable

Medido en dos sondeos separados ~32 min sobre el host final:

| Recurso | Sondeo A | Sondeo B | ¿Estable? |
|---|---|---|---|
| `/` | 139 618 B · `8705d435…9fbb96` | 139 618 B · `8705d435…9fbb96` | ✅ |
| `/api/webhooks/health` | 1 463 B · `35df1de9…614892` | 1 463 B · `d41be4c4…` | ❌ cambia |
| `/api/omega/heartbeat` | 2 240 B · `587dcd1d…c04270` | 2 241 B · `93237543…0a0c87` | ❌ cambia |

Causa: los cuerpos embeben `checkedAt`, `generatedAt`, `latencyMs`, `rateLimit.remaining`.
La tabla de hashes de `.clinerules` §4 es válida para `/` y **no aplicable tal cual** a esos
dos endpoints: un hash que cambia en cada petición no distingue un cambio de código de un
cambio de reloj.

## Hallazgo 3 — build limpio: la causa del `ENOENT … .nft.json` era concurrencia

Medido con `next build` en solitario (`.antigravity/out_clean.txt`):

| Métrica | Valor |
|---|---|
| `BUILD_EXIT` | **0** |
| Ventana | `2026-10-30T12:04:59` → `12:21:08` (16 min 9 s) |
| `Compiled successfully` | 9,5 min |
| `BUILD_ID` | `5AMx0boObM813XNjaqx_7` |
| `Failed to copy traced files` | **0** (antes: `ENOENT .nft.json` en bucle) |
| `.next/standalone/server.js` | `True` |
| `/confianza` en la tabla de rutas | `○ /confianza` → **prerender estática** |
| `.next/server/app/confianza.html` | 132 694 caracteres · banner «Deploy bloqueado por el ledger» presente · `AF-1` y `U13` presentes |
| Chunks de página en `.next/static/chunks/app/**confianza**` | **0** → la página no aporta componente cliente propio |

Causa raíz confirmada: el fallo anterior no era del código ni de la configuración de tracing
sino de **dos builds escribiendo el mismo `.next`** (build huérfano previo + build nuevo). Con
un solo proceso, la fase de trace/standalone termina sin error.

Precisión obligatoria (EP-5): el HTML de una página estática de App Router **sí** incluye los
`<script>` del runtime y de los layouts compartidos (20 referencias). La afirmación correcta es
«0 chunks de cliente propios de `/confianza`», **no** «0 JavaScript en la página».

## Hallazgo 4 — el árbol tiene trabajo previo sin commitear (CHG-6)

`git status --porcelain` (16 ficheros modificados, 526 inserciones, 237 borrados, 26 líneas de
untracked). **No todo es de este bloque.** Sin commitear y ajeno a U13/AF-1:

- `src/lib/security/cronSecretGuard.ts`, `scripts/verify_cron_secret_guard.ts`,
  `scripts/cron_secret_probe.cjs`, `verify:cron-secret` del gate.
- `src/app/api/cron/*/route.ts` (6 rutas), `src/app/api/health/route.ts`,
  `src/app/api/outreach/intake/route.ts`, `src/app/api/support/health-check/route.ts`,
  `src/app/api/telemetry/funnel/route.ts`.
- `.github/workflows/deploy-ghcr.yml`, `.gitignore`, `.clinerules`, `CLINE_EXECUTION_LOG.md`.

Consecuencia: un `git add -A` (prohibido por CHG-6) mezclaría dos bloques en un commit y haría
imposible un rollback < 5 min (CHG-3). El commit debe llevar lista de ficheros explícita, y el
CEO debe decidir si el bloque de `cronSecretGuard` viaja en el mismo deploy o en otro.

## Hallazgo 5 — `gate:prepush` completo: 19 puertas, un solo rojo (el que debe estar rojo)

`GATE_START 2026-10-30T12:21:50` · `GATE_END 12:35:30` · **`GATE_EXIT=1`**.

La cadena `gate:prepush` es `A && B && … && verify:confianza`: llegar a la última puerta es prueba
de que todas las anteriores devolvieron Exit 0. Orden ejecutado (19 pasos):

| # | Puerta | Resultado |
|---|---|---|
| 1 | `audit:http` | Exit 0 · 184 handlers, 418 literales, 0 huérfanos |
| 2 | `audit:routes` | Exit 0 · 473 rutas (287 páginas + 186 handlers), **0 conflictos** |
| 3 | `audit:cta-matrix` | Exit 0 |
| 4 | `verify:provider-ctas` | Exit 0 |
| 5 | `audit:phone` | Exit 0 |
| 6 | `audit:edge` | Exit 0 · 0 fachadas, 0 placeholders, 0 teléfonos duplicados, 1 aviso (`catering.json#v-32714`) |
| 7 | `verify:pricing` | Exit 0 |
| 8 | `verify:context` | Exit 0 |
| 9 | `verify:leadgate` | Exit 0 |
| 10 | `audit:ssot` | Exit 0 · hash `ebc011a0…` coincide con `KNOWN_GOOD` (ZONA CERO intacta) |
| 11 | `lint` | Exit 0 (solo warnings preexistentes de `no-unused-vars`) |
| 12 | `audit:contrast:core` | **Exit 0 sin medir nada** → Hallazgo 6 |
| 13 | `typecheck:landings` | Exit 0 |
| 14 | `tsc --noEmit` | Exit 0 |
| 15 | `audit:admin` | Exit 0 |
| 16 | `audit:ci-gate` | Exit 0 · 22 OK, 0 ERROR (4 jobs, 2 gates bloqueantes, 0 fugas) |
| 17 | `verify:voice` | Exit 0 |
| 18 | `verify:cron-secret` | Exit 0 |
| 19 | `verify:confianza` | **Exit 1** · `SUMMARY {"exit_code":1,"rows":6,"facades":1,"degraded":0,"anomalies":0,"checks":8,"failed":["NO_FACADE"]}` |

Única línea crítica del log completo: `[FAIL] NO_FACADE: FACHADA activa: AF-1`.

Es el rojo correcto y está donde debe: la puerta se niega a dar verde mientras el ledger declare una
fachada, y AF-1 seguirá en `FACHADA` hasta que el parche esté en producción y la sonda G-6 lo mida.

## Hallazgo 6 — `audit:contrast:core` da verde sin haber medido (AF-5)

En la misma ejecución, la puerta de accesibilidad devolvió **Exit 0** con este rastro:

```
! ERROR: net::ERR_CONNECTION_REFUSED at http://localhost:3007/          (… y las 9 restantes)
FALLOS AA REALES: 0 · SOBRE IMAGEN/BLEND (dudoso): 0
/ -> fallos: 0 (scan 0)
TOTAL_FALLOS=0 · TOTAL_INDETERMINATE=0
```

Traducido: el auditor intentó abrir las 10 landings en un servidor que no estaba levantado, no midió
**ni un elemento** (`scan 0`) y aun así escribió «0 fallos». Es exactamente el «verde por defecto» que
AF-5 prohíbe y el mismo patrón que AF-1 en telemetría: **la puerta existe, la medición no**.

Cierre propuesto (una sola condición, quirúrgica):

```
if (scan === 0 || errConnRefused > 0) { console.error('SIN_EVIDENCIA: 0 elementos medidos'); process.exit(1); }
```

más arrancar el servidor objetivo desde `.next/standalone` antes de medir (el mismo que ya se usó para
la sonda local de `/confianza`). **No se aplica en este bloque**: encenderlo deja `gate:prepush` en rojo
por un motivo ajeno a U13 y bloquearía el deploy de la página que da la cara. Necesita decisión de
secuencia del CEO (§9 · un cambio por deploy).

Fila añadida al ledger: `CI-CONTRAST` → `SOSPECHOSO` (no bloquea deploy; `FACHADA` sí lo bloquearía).

## Hallazgo 7 — `/confianza` existe, pero todavía no está enlazada desde el sitio

Búsqueda sobre todo `src/` (`out_links.txt`): las únicas 3 apariciones de «/confianza» son la propia
página, `sitemap.ts` y `evidence-ledger.ts`. **Ningún footer, ninguna nav, ningún enlace interno.**

Consecuencia: la página es indexable pero no *clicable* desde el producto — y su destinatario natural
(usted, el CEO, y un cliente que duda) no la encuentra. No es `FACHADA` (la URL responde y el HTML es
real), es una promesa con mala puerta de entrada. Parche propuesto para el siguiente bloque, un enlace
en el pie: `<Link href="/confianza">Registro público de pruebas</Link>`. No se aplica aquí para no
invalidar el build ya verificado con un cambio en un layout compartido.


## Hallazgo 8 — cabeceras reales servidas por el runtime standalone (lo que ejecuta Coolify)

Sonda local con `node .next/standalone/server.js` en `127.0.0.1:3999` y `curl.exe --noproxy '*'`:

| Cabecera | Valor medido |
|---|---|
| Estado | `HTTP/1.1 200 OK` |
| `Content-Length` | `133044` (idéntico al HTML prerenderizado) |
| `x-nextjs-prerender` | `1` |
| `x-nextjs-cache` | `HIT` |
| `Cache-Control` | `s-maxage=31536000` |
| Seguridad | HSTS, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` presentes |

Dos lecturas honestas:

1. **«Cache-Control público» del §4 se cumple en el sentido RFC 9111**: `s-maxage` autoriza caché
   compartida aunque no aparezca la palabra `public`. La página no lleva `no-store` ni `private`.
2. **El horizonte es un año (`s-maxage=31536000`) y eso choca con JUR-5** (todo claim retirable en
   < 10 minutos). Hoy no hay CDN delante de Traefik, así que el riesgo es **latente, no activo**;
   el día que se ponga Cloudflare u otro edge, `/confianza` podría congelarse hasta 12 meses
   mostrando un estado que ya no es cierto. Es exactamente el fallo que esta página existe para
   impedir.

Parche propuesto (NO aplicado, requiere rebuild para poder medirlo — G-6):

```ts
// next.config.ts > headers()
{ source: '/confianza', headers: [{ key: 'Cache-Control',
  value: 'public, max-age=0, s-maxage=300, stale-while-revalidate=60' }] }
```

Verificación: reconstruir, `curl -D -` contra el standalone y comprobar `s-maxage=300`. No se
aplica sin rebuild porque **una cabecera sin medir es una promesa sin URL** (EP-3), y sin rebuild
no puedo probar que `headers()` gana al valor por defecto del prerender.


## Propuesta de enmienda §4 — NO APLICADA (necesita sanción del CEO)

`.clinerules` §14 AMD-1/AMD-2 exigen evidencia + sanción explícita del CEO para endurecer o
enmendar el contrato. Esta IA no se autoconcede esa sanción, así que la enmienda queda
propuesta con su comando de verificación (reto_espejo, AMD-3):

> Sustitúyase la fila de hash por: **hash canónico = sha256 del cuerpo con los campos
> volátiles (`checkedAt`, `generatedAt`, `timestamp`, `latencyMs`, `rateLimit`) eliminados
> o fijados a `null`**, o bien **sha256 de la lista ordenada de claves** del JSON.
> Los campos volátiles se verifican por separado con su propio criterio (ventana de
> frescura ≤ 60 s sobre `checkedAt`), nunca por igualdad de hash.

Verificación propuesta (a construir antes de aprobar):
`node scripts/verify_response_hash_stability.cjs --url <U> --twice` debe dar el mismo
canónico en dos peticiones consecutivas y distinto `checkedAt`.

## Incidencia de ledger (EP-4) — append sin salto de línea final y reparación verificada

Al añadir la fila `CI-CONTRAST` encontré que `ledger.jsonl` **no terminaba en `\n`**: el append
concatenó la fila nueva a la última, el JSON de la fila 11 dejó de parsear y `verify:confianza` pasó a
`LEDGER_FORMAT: 1 anomalía (línea 11)`. El ledger avisó — que es exactamente su trabajo.

Reparación (con copia previa en `.antigravity/evidence/ledger.before_repair.jsonl`):

| Comprobación | Resultado |
|---|---|
| Filas 1–10 byte a byte idénticas al original | `FIRST_10_ROWS_IDENTICAL=true` |
| Fila 11 (AF-1) intacta: es prefijo exacto del fichero corrupto | `ROW11_IS_PREFIX_OF_CORRUPT=true` |
| Filas totales | `11 → 12` |
| Termina en `\n` | `true` |
| `sha256` del ledger | `a240186cb5a254a5a6c787c7590d810a3738decc147832387344f7093a76b704` |
| `verify:confianza --json` | 7 filas vigentes · `anomalías=0` · `failed=["NO_FACADE"]` · Exit 1 |

Ningún contenido previo se alteró: lo único que cambió es el salto de línea final y la fila 12. Queda
dicho aquí porque EP-4 prohíbe reescribir el pasado en silencio; una reparación documentada no es una
reescritura, una reparación oculta sí.

## Secuencia exacta hasta poner el gate en verde

```powershell
# 1. Revisar el diff (CHG-6) y desplegar a origin -> Coolify
#    Lista explícita de ESTE bloque (nada de `git add -A`):
#      src/lib/evidence/evidence-ledger.ts
#      src/app/(public)/confianza/page.tsx
#      scripts/verify_trust_ledger.ts
#      src/app/api/webhooks/health/route.ts
#      src/app/sitemap.ts
#      package.json                (verify:confianza + gate:prepush; incluye también verify:cron-secret ajeno)
#      .antigravity/evidence/ledger.jsonl
#      .antigravity/reports/2026-10-30_u13_confianza_af1_hash_instability.md
#      CLINE_EXECUTION_LOG.md      (append WF-3)
#    Decisión pendiente: qué hacer con el bloque previo (cronSecretGuard + rutas cron/health +
#    deploy-ghcr.yml). Si viaja en el mismo commit, el mensaje debe nombrarlo.

# 2. Sondear el host final (G-6)
$h = Invoke-WebRequest 'https://www.productoraear.com/api/webhooks/health' -UseBasicParsing
$h.Content   # debe contener "probed":true,"source":"live","mode":"REAL"
$c = Invoke-WebRequest 'https://www.productoraear.com/confianza' -UseBasicParsing
$c.StatusCode # debe ser 200
# 3. Anadir la fila de cierre (append-only, supersedes AF-1 y U13) y
npm run verify:confianza   # exit 0
```

## Premortem (INC-3 · G-8)

1. **¿Cumple el `done_when`?** La página y el gate existen y están probados en local; la
   sonda en producción **no** puede existir antes del deploy. Se entrega con `⚠️ SIN_URL_PUBLICA`.
2. **Asunciones frágiles:** que Coolify lea el ledger en el mismo commit desplegado; que
   `pingN8nInstance` responda en < 4 s (si no, el health tarda 4 s pero no miente); que el
   fichero del ledger termine en `\n` (hoy no lo hacía y el append rompió una fila: ver
   Incidencia EP-4); y que alguna otra puerta del gate esté midiendo de verdad — la de
   contraste no (Hallazgo 6), y eso solo se supo leyendo el log, no el Exit Code.
3. **Alternativa descartada:** marcar AF-1 como `VERIFICADO` al parchear el código. Descartada
   por técnico: sin deploy no hay sonda, y sin sonda no hay quíntupla (EP-1).
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** El health ahora hace una
   petición saliente por consulta: si n8n cae, `status:"degraded"` y HTTP 200 (los monitores
   por código HTTP no verán rojo). `verify:confianza` y la sonda `?ping=true` lo detectan.
5. **¿Qué acepto al firmar?** Que el gate queda en rojo hasta el deploy; asumir eso es más
   barato que un CEO confiando en un verde que no midió nada.

## Lección de 60 segundos (CEO-3)

**Fachada de telemetría** → un endpoint de salud que dice «todo bien» sin haber preguntado a
nadie → si algún día se cae n8n, el panel seguirá en verde y nadie se enterará hasta que un
cliente no reciba su confirmación → ignorarlo cuesta reservas perdidas sin traza, y convierte
cada informe en una suposición.

## Anexo — Mandato del CEO: multiplicación semántica de landings (medido 2026-10-30)

**Comando nuevo en disco:** `npm run audit:pseo` → `scripts/audit_pseo_coverage.cjs`
(medición sin red y sin build; `--json`, `--strict`, `--ine=N`). Con esto el mandato deja
de ser una intención y pasa a ser una cifra que se puede volver a medir mañana.

**Lo que hay hoy, medido (no estimado):**

| Métrica | Valor medido | Fuente |
|---|---|---|
| Municipios en el motor pSEO (`MUNICIPALITIES_DATABASE`) | **250** (T1=100 · T2=102 · T3=48) | `audit:pseo` |
| Municipios con datos diferenciadores (fincas/patronales/intención) | **98,93 %** | `audit:pseo` |
| Nodos provinciales (`MUNICIPALITIES_DATASET`) | 255 en 52 provincias | `audit:pseo` |
| Nodos con **distancia real** (diferencial logístico) | **53 de 255 → 20,78 %** | `audit:pseo` |
| Servicios/gremios cruzables (`SERVICES_PSEO_EXPANDED`) | 11 | `audit:pseo` |
| Matriz teórica hoy (municipio × servicio) | **2 750 URLs** | `audit:pseo` |
| Cobertura del universo municipal español (ref. 8 131) | **3,07 %** → faltan 7 881 | `audit:pseo` |
| URLs realmente publicadas en `/sitemap.xml` | **777** (200 OK · 145 730 B) | sonda HTTP 2026-10-30 |
| Particiones de sitemap declaradas | 6 (`SITEMAP_PARTITIONS`) | `audit:pseo` |

**El dato incómodo:** 202 de 255 municipios del dataset no tienen distancia real. Una página
de municipio sin distancia, sin finca y sin festivo propio es la misma página con otro nombre:
eso es lo que Google llama *doorway page* y sanciona con acción manual. Por eso el auditor
separa «URLs creadas» de «URLs defendibles» y marca `DATASET_DISTANCE_HEALTHY: FAIL`.
**No son 7 881 páginas lo que falta: son 7 881 municipios con datos reales detrás.**

**Restricciones duras que ordenan el plan (ninguna es opinable):**
- Sitemap: 50 000 URLs por fichero `sitemap`. 8 131 × 11 = 89 441 → hacen falta ≥ 2 particiones
  nuevas y un `sitemapindex` (hoy son 6 particiones y `/sitemap.xml` sirve 777 URLs planas).
- Build < 60 s (INV-15): 89 441 páginas prerenderizadas revientan el build. La cola larga debe
  ir en modo `dynamicParams` + ISR, no en `generateStaticParams`.
- Unicidad (scorecard 16): Jaccard 5-gram ≤ 0,10 y coseno TF-IDF ≤ 0,10 entre URLs. Hoy no
  existe el comando que lo mida sobre las landings generadas → `SIN_EVIDENCIA_MÁQUINA`.
- INV-06: cada landing que muestra proveedores exige teléfono real verificado, no centralita.

**Fases propuestas (cada una con su comando de cierre):**
1. **F1 · Datos antes que URLs.** Completar `distanceFromMentrideKm` y `hasFincas` para los
   7 881 municipios que faltan desde fuente oficial (INE/IGN), sin inventar un solo campo.
   Cierre: `audit:pseo` sin `DATASET_DISTANCE_HEALTHY` ni `COVERAGE_COMPLETE` en `failed`.
2. **F2 · Índice de sitemap real.** `/sitemap.xml` → `sitemapindex` con particiones nombradas
   por provincia (≤ 50 000 cada una) y `verify:sitemap` que cuente `<loc>` y falle si una
   partición supera el límite o si una URL publicada devuelve ≠ 200.
3. **F3 · Matriz completa en modo cola larga.** `dynamicParams = true` + `revalidate` por
   provincia, `verify:pseo-crawl` que sondee una muestra aleatoria de 200 URLs nuevas.
4. **F4 · Auditor de unicidad.** Jaccard/TF-IDF sobre el HTML renderizado de la muestra;
   sin este comando, el punto 16 del scorecard sigue valiendo 0 y así se declara.

Estado del anexo: `SIN_EVIDENCIA` para F1–F4 salvo la medición de la tabla (que sí es
`VERIFICADO` por `npm run audit:pseo` · Exit 0). ⚠️ SIN_URL_PUBLICA hasta que F2 publique
el índice en producción.

