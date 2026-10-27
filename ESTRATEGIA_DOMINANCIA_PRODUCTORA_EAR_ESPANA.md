# ESTRATEGIA DE DOMINANCIA NACIONAL — PRODUCTORA EAR · BODAS Y EVENTOS (ESPAÑA)

> **Operador:** Productora EAR · Edwin Agudelo.
> **Entidad:** `src/lib/constants/ear-eventos-entity.ts`.
> **Motor:** `src/lib/seo/ear-eventos-dominance-engine.ts`.
> **Fecha de cierre:** 2026-10-26 · **Depósito:** 100,00 € deducible (SSOT).
> **Doctrina:** entidad-first, 52 provincias del SSOT geográfico, cero fachadas.

---

## 1. QUÉ SE MONTA

Una malla nacional para que **Productora EAR** compita por bodas y eventos en
las **52 provincias españolas** sin depender de portales: hub propio, landings
provinciales y consultas transaccionales, todas con salida real al checkout.

**Malla:** 268 URLs.

| Familia | Cantidad | Composición |
|---|---|---|
| Provinciales | 208 | 52 provincias × 4 verticales |
| Intención | 60 | 52 provinciales (patrón rotado) + 8 nacionales |
| **Total** | **268** | + 1 hub |

**Verticales:** bodas de gala · boda en finca y ceremonia civil · eventos de
empresa y presentaciones · comuniones, bautizos y cumpleaños.

**Fuente geográfica:** `PROVINCIAS_52_GRAPH` (`seo-data-hydrated.ts`). El motor
solo consume `slug`, `name`, `capital`, `community`, `region` y
`distanceFromHubKm`; **no** reutiliza recuentos de locales ni cifras no
auditadas.

---

## 2. FICHA VERIFICADA DEL OPERADOR (CERO FACHADAS)

| Campo | Valor | Fuente |
|---|---|---|
| Marca | Productora EAR | dominio propio |
| Operador | Edwin Agudelo · CEO | dominio propio |
| Línea oficial | +34 693 693 048 | `ear-os-ssot.ts` |
| Email | productoraear@gmail.com | dominio propio |
| Base logística | Méntrida (Toledo), España | SSOT |
| Cobertura | 52 provincias · península, Baleares y Canarias | SSOT geográfico |
| Tarifa base | 350,00 € | `ear-os-ssot.ts` |
| Depósito | 100,00 € deducible | `ear-os-ssot.ts` |
| `verified` | **true** (regla `platform-operator-line`) | titularidad declarada |
| Dirección postal / geo | **null** (no publicada) | — |

---

## 3. MATRIZ DE TRAZABILIDAD (BOTÓN → MOTOR → ESCRITURA)

| Superficie | Endpoint | Motor / dato | Escritura real |
|---|---|---|---|
| Bloquear fecha | `/reservar/solista?formato={id}&landing={slug}` | `MARIACHI_FORMATS` + depósito SSOT | Lead + intención de pago Stripe |
| WhatsApp | `wa.me/34693693048` | `officialLine` | Conversación directa |
| Llamar | `tel:+34693693048` | `officialLineRaw` | Llamada al operador |
| Consultas de la malla | `/productora-ear/{slug}` (268) | `EVENT_LANDINGS` | Navegación + crawl budget |
| Sitemap | `/sitemap.xml` | `src/app/sitemap.ts` | 269 URLs declaradas |
| Sellos | JSON-LD + manifiesto | SHA-256 determinista | `provenance`, `stripeSessionId`, `priceLock` |

---

## 4. PRECIOS Y LOGÍSTICA (SSOT, CERO HARDCODE)

- Catálogo musical: solista 350 € · cuarteto 600 € · gala 900 € · monumental
  1.300 € (`MARIACHI_FORMATS`), depósito de 100 € en todos.
- Kilometraje: **50 km exentos** y **1,50 €/km** después, por GPS desde la
  dirección fiscal del proveedor (regla de red nacional, no Hub Méntrida).
- Suplemento hotelero: **120,00 €** si > 200 km o fin ≥ 3:00.
- Rider acústico: Ley 37/2003 · 12 W/pax · salud pública < 75 dB SPL.
- B2G: techo preventivo **14.250,00 €** (Art. 118 LCSP) para actos
  institucionales; no se usa en bodas privadas.

---

## 5. ANTI-CANIBALIZACIÓN: MEDICIÓN REAL

Guardián: `node scripts/audit_ear_eventos_landings.cjs`.

| Métrica | Máximo medido | Umbral doctrinal | Estado |
|---|---|---|---|
| Jaccard 5 palabras | **0,540670** | ≤ 0,10 | ⚠️ OLA 2 |
| Coseno TF-IDF | **0,763437** | ≤ 0,10 | ⚠️ OLA 2 |
| Jaccard 5 caracteres | **0,824818** | ≤ 0,10 | ⚠️ OLA 2 |
| Clones / slugs / titles / H1 duplicados | **0** | 0 | ✅ |
| Depósito, split, sellos, placeholders, teléfonos | **0 desviaciones** | 0 | ✅ |

**Diagnóstico honesto:** los bancos de intención están separados de los
provinciales y cada intención añade su hook y su ficha provincial. Bajar de
0,10 exige 268 textos editoriales únicos (OLA 2), no un truco combinatorio.

---

## 6. EJECUCIÓN

```powershell
npx tsx scripts/build_ear_eventos_landings.ts
node scripts/audit_ear_eventos_landings.cjs
npx tsc -p tsconfig.landings-dominance.json --noEmit
```

Artefacto auditable: `public/landings/productora-ear/manifest.json`.

---

## 7. CRITERIOS DE CIERRE

- [x] Operador verificado con titular de línea declarado.
- [x] 268 URLs (208 provinciales + 60 intención) con slugs, titles y H1 únicos.
- [x] 52 provincias validadas contra el SSOT (el build aborta si no son 52).
- [x] Depósito, formatos, kilómetros y rider importados del SSOT.
- [x] JSON-LD por URL: `Organization` + `Service` + `Offer` + `FAQPage` + `BreadcrumbList`.
- [x] Hub con la malla completa y sitemap con las 269 URLs.
- [x] Guardián ejecutable y manifiesto determinístico.
- [ ] **OLA 2**: copy editorial único por URL para alcanzar Jaccard/coseno ≤ 0,10.
- [ ] **OLA 3**: depósitos cerrados por provincia y liquidación 80/10/10.

> Regla soberana: la dominancia se mide en **reservas con depósito cerrado**,
> no en número de URLs.
