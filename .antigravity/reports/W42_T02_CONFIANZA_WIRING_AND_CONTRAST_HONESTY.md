# W42_T02 · U13 + Hallazgos 6, 7 y 8 — Enlace a /confianza, Cache-Control y guardia fail-closed

> Fecha: 2026-10-30 · Estado del bloque: **SOSPECHOSO** (2 rojos fuera de alcance, medidos)
> Ficheros autorizados: `SovereignFooter.tsx`, `next.config.ts`, `audit_wcag_contrast_live.cjs`, `verify_trust_ledger.ts`

## 1. Hecho verificado (medido en esta sesión)

| # | Claim | Evidencia |
|---|---|---|
| C1 | `/confianza` enlazada en las DOS variantes del footer | `src/app/components/layout/SovereignFooter.tsx:47` (funnel limpio) y `:299` (footer completo) · `verify:confianza` → `[OK] FOOTER_LINK: 2 enlaces` |
| C2 | `Cache-Control` propio para `/confianza` (JUR-5: retirada < 10 min) | `next.config.ts:74-85` (`source: "/confianza"` en `:80`, `value: "public, max-age=0, s-maxage=300, stale-while-revalidate=60"` en `:84`), insertada ANTES de `/:path*` · `[OK] CACHE_HEADER: /confianza declara s-maxage=300` |
| C3 | El audit de contraste ya NO puede fingir verde | `node scripts/audit_wcag_contrast_live.cjs --routes=/confianza --shots=0` → auto-arranque `source=live`, `mode=REAL`, `probed=true`, HTTP 200, **168 nodos escaneados** |
| C4 | Sin medición ⇒ Exit 1 (AF-5) | Run previo con servidor inalcanzable: `ROUTES_SIN_EVIDENCIA=1`, `SIN_EVIDENCIA: 1 ruta(s) con 0 elementos medidos`, `VERDICT=BLOCKED`, **Exit 1** |
| C5 | El servidor standalone ya se auto-arranca de verdad | `[PREFLIGHT] Servidor propio vivo en http://127.0.0.1:3007 (TCP abierto)` · pid hijo, `stopStandalone()` en éxito y en `catch` |
| C6 | `tsc` / `lint` / sintaxis | `npm run typecheck` → **Exit 0** · `npm run lint` → **Exit 0** (0 errores) · `node --check` → **Exit 0** |

## 2. Cambios (diff real: 4 ficheros, 264 inserciones)

- `src/app/components/layout/SovereignFooter.tsx:47,299` — 2 enlaces `<Link href="/confianza">`.
- `next.config.ts:74-85` — regla `Cache-Control` específica, declarada antes del comodín `/:path*`.
- `scripts/audit_wcag_contrast_live.cjs` — `BASE` mutable; `ensureTarget()` (sonda de liveness + auto-arranque + `syncStaticAssets`); `report.preflight {probed,source,mode,checkedAt,autoStarted}`; guardia `routesWithZeroScan`; `VERDICT` honesto + Exit 1; captura de `stderr` del hijo para que un fallo de arranque no sea mudo.
- `scripts/verify_trust_ledger.ts` — checks `FOOTER_LINK` (≥2 enlaces) y `CACHE_HEADER` (source + `s-maxage=300`).

## 3. Causa raíz investigada (por qué el auto-arranque no respondía)

El servidor arrancaba (`✓ Ready in 0ms`) pero el preflight lo declaraba muerto. Aislado con clientes
cruzados contra el mismo proceso: `Test-NetConnection 127.0.0.1:3999` → `True`, un cliente HTTP externo →
`HTTP 200 / 140 564 B`, y sin embargo `http.get()` de Node (v26.12.1, sin proxy declarado) no devolvía ni
respuesta ni error en 9 s. **El punto ciego era la sonda, no el servidor.** Corrección: la liveness se mide
con handshake TCP (`net.connect`), que no es interceptable y responde a la única pregunta del preflight:
¿hay alguien escuchando? Verificado: `TCP_OK`.

## 4. Premortem (G-8)

1. **¿Cumple el `done_when`?** Sí en sus tres cláusulas: `FOOTER_LINK`+`CACHE_HEADER` en verde, audit fail-closed con Exit 1 sin medición y `tsc`/`eslint` Exit 0. Lo que NO está en el `done_when` y ha aparecido al medir: 41 fallos AA reales en `/confianza`.
2. **Asunciones frágiles.** (a) Que `.next/standalone` se haya construido con el commit vigente — si está obsoleto, se mide una página antigua; (b) que exista `.next/static` para copiar (`syncStaticAssets` evita medir páginas sin CSS, que daría falsos fallos de contraste); (c) que nadie ocupe el puerto entre la comprobación y el `spawn` (mitigado con `pickPort`).
3. **Alternativa descartada.** Mantener la sonda HTTP y añadir más reintentos: descartada por diagnóstico, no por comodidad — el cuelgue no era lentitud, era ausencia de respuesta con el puerto demostradamente abierto. Reintentar habría multiplicado la espera sin cambiar el veredicto.
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** El `spawn` abre un servidor Node local escuchando SÓLO en `127.0.0.1` y se mata en éxito y en `catch`; si un `kill` fallara, el siguiente run usa otro puerto libre. El riesgo real: `gate:prepush` incluye `audit:contrast:core`, que ahora exige un objetivo medible — en CI sin build standalone la puerta se pondrá roja. Eso es el comportamiento pedido (mejor rojo honesto que verde ciego), pero bloquea pushes hasta que el pipeline arranque el servidor.
5. **¿Qué acepto al firmar esto?** Que la puerta de deploy queda ROJA por dos causas medidas y que una de ellas (AF-1) documenta una fachada de telemetría en producción que yo no puedo cerrar sin desplegar.

## 5. Rojos medidos (fuera de alcance, no los toco sin autorización)

- **R1 · Ledger `NO_FACADE: AF-1`** → `npm run verify:confianza` **Exit 1** (`failed:["NO_FACADE"]`, 9/10 checks OK). Fila pre-existente: `src/app/api/webhooks/health/route.ts` ya sonda de verdad (emite `probed/source/mode/checkedAt`), pero producción no está redesplegada. Se cierra con deploy + sonda G-6, NO editando el ledger.
- **R2 · 41 fallos AA en `/confianza`** (hallazgo NUEVO, P1, en `reports/contrast/wcag_report.json`): una sola causa raíz, el token `text-[#71717a]` → ratio **4.14** sobre fondo OLED (AA exige 4.5). Afecta a `p`, `dt`, `th`, `li` de la página. Arreglo propuesto: `#71717a` → `zinc-400` en `src/app/(public)/confianza/page.tsx` (fichero NO autorizado en esta tarea). Riesgo abierto: `audit:contrast:core` cubre 10 rutas y no se ha medido cuántas arrastran el mismo token → `SIN_EVIDENCIA`.

## 6. Decisión requerida (arquitecto/CEO)

El `done_when` está cumplido, pero G-3 (`gate:prepush`) y G-6 (sonda en producción) no pueden estar verdes hoy:
- (a) autorizar el deploy para que AF-1 se cierre con sonda real y G-7/G-6 se firmen, o
- (b) autorizar el cierre de W42_T02 con R1 documentado como deuda pre-existente y R2 encolado como tarea P1 de contraste.

**Siguiente paso atómico:** lanzar `npm run audit:contrast:core` completo (10 rutas) para cuantificar R2 antes de tocar `page.tsx`.
