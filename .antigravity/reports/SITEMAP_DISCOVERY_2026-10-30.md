# BLOQUE · Descubrimiento de sitemaps (U6) — 2026-10-30

**Estado del bloque: SOSPECHOSO** (código completo; gates G-1/G-2/G-3/G-6/G-7 sin medir:
la terminal de la sesión no devolvió `Exit Code` en ningún intento → `SIN_EVIDENCIA`).

## 1. Diagnóstico forense (medido en producción, no inferido)

Tres defectos independientes, cada uno suficiente para ocultar las ~6.370 URLs del
catálogo masivo:

| # | Defecto | Evidencia |
|---|---|---|
| D1 | `robots.txt` declara UN solo sitemap | `GET https://www.productoraear.com/robots.txt` → 439 B, una única línea `Sitemap: .../sitemap.xml` |
| D2 | Los hijos del índice viven bajo `/api/`, que el propio robots.txt prohíbe | `GET .../api/sitemap-index` → 829 B, 6 hijos `https://productoraear.com/api/sitemap/N.xml` + `Disallow: /api/` |
| D3 | Todos los `<loc>` publicados usan el apex, que responde 308 → www | `GET .../sitemap.xml` → 145.890 B, `100%` de `<loc>` en `https://productoraear.com`; `next.config.ts:120-125` `permanent: true` |

Efecto neto: Google recibía el `<urlset>` curado, e **incluso ese** gastaba un salto 308
por URL. Las particiones eran doblemente invisibles (no declaradas + bajo `Disallow`).

## 2. Correcciones aplicadas

- `src/lib/seo/canonicalSite.ts` (nuevo) — `resolveCanonicalOrigin`,
  `resolveCanonicalOriginFromEnv`, `resolveSitemapOrigin` (producción ⇒ www;
  `SITEMAP_FORCE_ORIGIN` como escotilla) y `toCanonicalLoc` (normaliza el host de
  cada `<loc>`, incluidos los `canonicalUrl` de terceros de las particiones 0 y 5).
- `src/lib/seo/sitemapRegistry.ts` (nuevo) — SSOT de sitemaps: ids 0..5, base pública
  `/sitemaps`, lista de `urlset` individuales, `buildSitemapIndexEntries`,
  `renderSitemapIndexXml`, `renderUrlsetXml`. No importa `sitemapGenerator` (evita
  arrastrar la base municipal al índice).
- `src/app/sitemap-index.xml/route.ts` (nuevo) — índice maestro en la raíz, ISR 3600,
  cabeceras `X-Sitemap-Children` / `X-Sitemap-Origin` honestas (AF-1).
- `src/app/sitemaps/[partition]/route.ts` (nuevo) — espejo público de las particiones;
  id no canónico ⇒ 404 (SEC-1).
- `src/app/robots.ts` + `public/robots.txt` — declaran índice maestro + curado +
  predictivo y permiten `/sitemap*`; mismo contenido en ambos ficheros.
- `src/app/api/sitemap-index/route.ts` y `src/app/api/sitemap/[partition]/route.ts` —
  reducidos a espejos legacy de la MISMA fuente, con `Link: rel="canonical"`.
- `src/app/sitemap.ts` — origen canónico + `lastmod` resuelto una vez por build
  (`SITEMAP_LAST_MODIFIED` / `SOURCE_DATE_EPOCH`), no en cada request.
- `src/app/sitemap-predictivo.xml/route.ts` — usa `resolveSitemapOrigin()`.
- `src/lib/seo/sitemapGenerator.ts` — origen canónico y `/catering-brasas` → destino
  final `/catering-de-brasas` (el alias responde 308).
- `scripts/verify_sitemap_index_coverage.cjs` + `npm run verify:sitemap` — auditor real.

## 3. Qué queda sin probar (honestidad estructural)

- `npm run typecheck`, `npm run lint`, `npm run gate:prepush`: NO ejecutados (terminal muerta).
- `npm run verify:sitemap`: fallará hasta el deploy (hoy `/sitemap-index.xml` no existe).
- `/sitemaps/0.xml`: hoy devuelve **200 text/html** (catch-all), no 404 ni XML → la ruta
  nueva aún no está desplegada.
- Deuda P1: existe doble fuente `public/robots.txt` + `src/app/robots.ts`. Se mantienen
  sincronizadas; falta colapsar a una (`deploy:freshness` dirá si el servido es estático
  o un build viejo).

## 4. Premortem (G-8)

1. **¿Cumple el `done_when`?** El objetivo (Google descubre ~7.150 URLs) exige deploy +
   reenvío en GSC; el código está, la promesa pública todavía no.
2. **Asunciones frágiles:** que Next priorice `app/sitemaps/[partition]` sobre el
   catch-all (lo hace por especificidad), y que la partición 5 no rompa el build por
   memoria (lee telemetría GSC en cada request: `force-dynamic`).
3. **Alternativa descartada:** publicar los sitemaps como ficheros estáticos en `public/`
   generados en build. Descartada por peso (6 particiones regenerables) y porque un
   `public/` obsoleto es exactamente el fallo D1 sin resolver.
4. **¿Qué se rompe y cómo lo detectamos antes que el cliente?** Un `<loc>` con host
   equivocado o un hijo 404: lo detecta `npm run verify:sitemap` (exit 1 + JSON) antes
   de tocar Search Console.
5. **¿Qué firmo al aceptar esto?** Que si el deploy no se verifica con el auditor, el
   bloque queda en `SOSPECHOSO` y no se reporta al CEO como terminado (CEO-4).
