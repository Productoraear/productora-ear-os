# VEREDICTO · 10 Diagnósticos vs. realidad en disco — 2026-11-02

**Método de prueba:** lectura directa de disco (`read_files`) sobre los ficheros citados.
**Límite declarado:** la terminal del entorno devuelve `Command completion could not be
observed` / `Exit 1` incluso para `node -v`, `Write-Output ok` y `cmd /c echo`. Por tanto
**G-1, G-2, G-3, G-5, G-6 y G-7 = SIN_EVIDENCIA en esta sesión**: no se firma ningún verde
de ejecución. Todo lo que sigue es auditoría estática con `ruta:línea`.

---

## 0. El plan propuesto depende de comandos que NO existen aquí

Skills invocables en este entorno (4, verificadas contra la herramienta `skills`):

| Disponible | No disponible (citado en la guía) |
| :--- | :--- |
| `planning-and-task-breakdown` | `/goal` |
| `spec-driven-development` | `/boost` |
| `test-driven-development` | `/teamwork` |
| `verification-and-testing` | `/grill-me`, `/compact`, `/schedule`, `/browser`, `/btw`, `/learn` |

Conclusión: los pasos 3, 4, 5 y 7 del «orden de batalla» no tienen motor en este entorno.
Lo que sí existe y sí ejecuta: los **~100 alias npm** de `package.json` y la cadena
`gate:prepush` de **21 puertas** (`package.json:74`).

---

## 1. Veredicto de los 10 diagnósticos

| # | Diagnóstico | Comando real | Estado | Evidencia |
| :-- | :--- | :--- | :--- | :--- |
| 1 | Jaccard ≤ 0,10 / anti-doorway | `landings:all` | **SOSPECHOSO** | Métrica real (Jaccard 5 palabras + TF-IDF coseno ≤ 0,10) en `scripts/audit_otzarreta_landings.cjs:8-13,38-40`, pero acotada a 126/220/268 landings de clúster. La matriz municipal de `src/app/sitemap.ts:217-230` (5 servicios × municipios) no tiene auditor de similitud. `audit:pseo` = `scripts/audit_pseo_coverage.cjs` mide **cobertura**, no duplicidad (:7-17). |
| 2 | Idempotencia Stripe | `sim:event` ✗ | **SOSPECHOSO** | Idempotencia real por `upsert` con clave de sesión: `src/app/api/stripe/webhook/route.ts:108-109` (`where: { stripeSessionId }`) y `:149-150` (`where: { reference: session.id }`). **No existe test** de N reintentos → 1 fila. `simulate_100_services_event.mjs:6-19` simula 122 servicios por HTTP, no reenvíos de webhook. INV-08 está mal mapeado. |
| 3 | Centinela SSOT 80/10/10 | `audit:ssot` | **SOSPECHOSO** | `scripts/baseline_ssot_integrity.ts:5-15` calcula SHA-256 e invariantes; está en `gate:prepush`. No ejecutado hoy (terminal caída). |
| 4 | Anti-bypass de contacto | `audit:phone` | **SOSPECHOSO** | `scripts/audit_phone_exposure.cjs:10-16` bloquea `tel:`/`wa.me` construidos con `phone`/`telephone` sin gate. Es análisis **de fuente**, no barrido del HTML servido de 29.165 URLs. |
| 5 | Rider acústico Ley 37/2003 | `verify:sonometro` ✗ | **SOSPECHOSO** | Constantes en `src/lib/constants/ear-os-ssot.ts:52-55` (`LIMITE_SPL_DB = 75`, `WATTS_PER_PAX = 12`). `scripts/verify_sonometro_pwa.cjs` existe pero **no tiene alias npm ni puerta**: nunca se ejecuta. No hay prueba de que cada cotización calcule dBA por contexto. |
| 6 | Core Web Vitals (LCP/CLS/INP) | — | **SIN_EVIDENCIA** | `scripts/visual_prototype_audit.cjs:14-22` mide layout (V01-V09); `scripts/audit_webgl_friction.cjs:9-15` mide patrones WebGL. Ningún script mide LCP/CLS/INP. |
| 7 | Clics muertos | `audit:cta-matrix` + `verify:provider-ctas` | **SOSPECHOSO** | Ambos en `gate:prepush` (`package.json:74`). No ejecutados hoy. |
| 8 | Sitemap + canónico | `verify:sitemap` ✗ | **SOSPECHOSO** | `scripts/verify_sitemap_integrity.ts:5-11` valida origen `https://www.productoraear.com`, duplicados, 1.500-50.000 y rutas críticas. **No está en `gate:prepush`** y no comprueba HTTP 200 en vivo. |
| 9 | OWASP ASVS L3 / secretos en bundle | — | **SIN_EVIDENCIA** | Ninguno de los ~100 alias de `package.json` escanea secretos (`STRIPE_SECRET_KEY`, service-role) en `.next/static` ni en el cliente. |
| 10 | n8n DLQ | — | **SOSPECHOSO** | Despacho no bloqueante `fireAndForgetN8n` en `route.ts:92-99`; `dlqCount` expuesto en `/api/webhooks/health`. **Sin alerta ni gate** que falle si la DLQ crece. |

**Recuento:** 0 `VERIFICADO` con Exit Code (terminal caída) · 7 `SOSPECHOSO` ·
2 `SIN_EVIDENCIA` · 1 métrica estrella (Jaccard nacional) declarada en el plan pero
inexistente para la matriz municipal.

> ⚠️ La cifra «29.165 URLs» **no se ha medido en esta sesión**. El sitemap se construye
> en `src/app/sitemap.ts:117-235` (52 provincias + 614 landings de clúster + matriz
> 5 servicios × municipios) y su tamaño real solo lo dice
> `node scripts/audit_pseo_coverage.cjs --json`. Hasta entonces: `SIN_EVIDENCIA`.

---

## 2. Auditores que existen y NUNCA se ejecutan (fachada de papel, §15)

`gate:prepush` (`package.json:74`) encadena 21 puertas. Estas quedan **fuera**:

| Alias / fichero | Invariante que dice proteger | Estado |
| :--- | :--- | :--- |
| `verify:sitemap` | Canónico + sitemap (diagnóstico 8) | ORPHAN |
| `audit:pseo` | Cobertura pSEO 29k | ORPHAN |
| `audit:tariff-copy` | INV-10 (0 precio fuera del SSOT) | ORPHAN |
| `audit:residues` | INV-14 / INV-15 (repo y residuos) | ORPHAN |
| `verify:git-pack` | INV-15 (repo < 50 MB) | ORPHAN |
| `scripts/verify_sonometro_pwa.cjs` | INV-13 (rider acústico) | ORPHAN sin alias |
| `audit:webgl`, `audit:slop`, `audit:fichas`, `audit:form-bridge` | Fricción, diseño, grounding | ORPHAN |
| `sim:event` | INV-03 / INV-08 | MANUAL (exige `npm run dev`) |

Un auditor huérfano no protege: solo decora el `package.json`.

---

## 3. Deriva doctrina ↔ repositorio (la doctrina está desactualizada, no el código)

1. **U13 `/confianza`**: `.clinerules §4` la declara `❌ NO_EXISTE`. En disco existe:
   `src/app/(public)/confianza/page.tsx:22` (`force-static`) y su puerta
   `scripts/verify_trust_ledger.ts:6-18`, **ya cableada** en `gate:prepush`.
   → La etiqueta `⚠️ SIN_URL_PUBLICA` que la doctrina obliga a arrastrar es hoy falsa.
2. **INV-08**: la prueba citada (`sim:event`) no prueba idempotencia de Stripe.
3. **INV-13**: la prueba citada existe pero no está cableada → invariante sin puerta.

---

## 4. Orden de batalla corregido (solo comandos que existen hoy)

| Paso | Sustituto real de `/plan`, `/boost`, `/goal`… | Comando |
| :-- | :--- | :--- |
| 1 | Estrategia y contrato | `skills: spec-driven-development` |
| 2 | Alineación CEO | preguntas concretas (yo las hago, no hay `/grill-me`) |
| 3 | Autopista en cola | `node .antigravity/omega.js next` |
| 4 | Máximo rigor (no hay `/boost`) | revisión cruzada + `skills: planning-and-task-breakdown` |
| 5 | Modo desatendido (no hay `/goal`) | `npm run gate:prepush` (21 puertas) |
| 6 | Verificación | `npm run audit:gates` (nuevo) + `npm run typecheck` + `npm run lint` |
| 7 | Blindaje (no hay `/learn`) | append a `CLINE_EXECUTION_LOG.md` + `.clinerules` vía AMD-2 |

Regla ZTM igual de válida: al cerrar con Exit 0, parar sesión y abrir una nueva (+).

---

## 5. Instrumento nuevo entregado (cierra el agujero estructural)

`scripts/audit_gate_coverage.cjs` + alias `npm run audit:gates` (`package.json:66`).

Qué hace, sin red y sin dependencias:
1. Lee las filas `| INV-n |` de `.clinerules` (la norma viva, no una lista hardcodeada).
2. Extrae los comandos citados (`npm run X`, `node scripts/Y.cjs`, `tsc`).
3. Comprueba si existen en `package.json` / en disco.
4. Expande `gate:prepush` transitivamente y verifica si **de verdad se ejecutan**.

Veredictos: `WIRED` · `MANUAL` · `ORPHAN` · `MISSING` · `SIN_COMANDO`.
Exit 1 si hay `ORPHAN` o `MISSING` (con `--strict`, también `SIN_COMANDO`).

**No se ha cableado a `gate:prepush` a propósito:** primero hay que medirlo
(`npm run audit:gates`) y ver la lista real de huérfanos. Cablear a ciegas un gate
que aún no se ha ejecutado sería exactamente la fachada que el propio script denuncia.

Estado de este instrumento: **SOSPECHOSO** (escrito y revisado línea a línea, no
ejecutado: terminal del entorno caída).

---

## 6. Próxima acción atómica

```
npm run audit:gates
```

Con esa salida: cablear los ORPHAN de P0 (`verify:sitemap`, `audit:tariff-copy`,
`verify_sonometro_pwa`) a `gate:prepush`, añadir el escáner de secretos (día 9) y el
auditor Jaccard de la matriz municipal (día 1), cada uno con su Exit Code medido.

