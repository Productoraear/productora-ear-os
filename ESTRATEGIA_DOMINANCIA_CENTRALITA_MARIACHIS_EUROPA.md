# ESTRATEGIA DE DOMINANCIA EUROPEA — CENTRALITA DE MARIACHIS

> **Operador:** Productora EAR · Edwin Agudelo (CEO y artista residente).
> **Entidad:** `src/lib/constants/centralita-mariachis-entity.ts`.
> **Motor:** `src/lib/seo/centralita-mariachis-dominance-engine.ts`.
> **Fecha de cierre:** 2026-10-26 · **Depósito:** 100,00 € deducible (SSOT).
> **Doctrina:** Motor Génesis + Dato Verificado (cero fachadas).

---

## 1. QUÉ SE MONTA

Una centralita propia —no un mercado de terceros— para contratar mariachi en
**España y Europa** con un solo número, precio por escrito y fecha bloqueada.
Se evita cualquier marca de intermediación ajena: la marca es
**Centralita de Mariachis**, operada por Productora EAR.

**Malla:** 220 URLs.

| Familia | Cantidad | Composición |
|---|---|---|
| Geográficas | 160 | 40 mercados × 4 verticales |
| Intención | 60 | 15 por vertical (14 de mercado + 1 paneuropea) |
| **Total** | **220** | + 1 hub |

**Verticales:** serenata sorpresa · mariachi para bodas · XV años · fiestas
patronales y eventos de empresa.

**Mercados:** 24 españoles (Madrid, Barcelona, Valencia, Sevilla, Málaga,
Bilbao, Zaragoza, Murcia, Alicante, Palma, Las Palmas, Tenerife, Granada,
Córdoba, Toledo, Valladolid, Pamplona, San Sebastián, Santander, Oviedo,
A Coruña, Vigo, Salamanca, Cádiz) y 16 europeos (París, Lisboa, Oporto,
Berlín, Múnich, Roma, Milán, Ámsterdam, Bruselas, Ginebra, Zúrich, Londres,
Viena, Praga, Copenhague, Estocolmo).

---

## 2. FICHA VERIFICADA DEL OPERADOR (CERO FACHADAS)

| Campo | Valor | Fuente |
|---|---|---|
| Marca | Centralita de Mariachis | dominio propio |
| Operador | Edwin Agudelo · CEO de Productora EAR | dominio propio |
| Línea oficial | +34 693 693 048 | `ear-os-ssot.ts` |
| Email | productoraear@gmail.com | dominio propio |
| Base logística | Méntrida (Toledo), España | SSOT |
| Cobertura | España + 13 países europeos | catálogo del motor |
| Tarifa base solista | 350,00 € | `ear-os-ssot.ts` |
| Formatos | 350 / 600 / 900 / 1.300 € | `MARIACHI_FORMATS` |
| Depósito | 100,00 € deducible | `ear-os-ssot.ts` |
| `verified` | **true** (regla `platform-operator-line`) | titularidad declarada |
| Dirección postal / geo | **null** (no publicada) | — |

**Regla anti-huérfanos:** un proveedor de la RED nunca se marca verificado con
la centralita; exige teléfono propio y distinto (`isNetworkProviderVerified`).

**Lo que el copy NUNCA afirma:** aforos, cachés por ciudad, tiempos de trayecto
ni disponibilidad no confirmada. Los kilómetros se miden por GPS.

---

## 3. MATRIZ DE TRAZABILIDAD (BOTÓN → MOTOR → ESCRITURA)

| Superficie | Endpoint | Motor / dato | Escritura real |
|---|---|---|---|
| Bloquear fecha | `/reservar/solista?formato={id}&landing={slug}` | precio de `MARIACHI_FORMATS` + depósito SSOT | Lead + intención de pago Stripe |
| WhatsApp | `wa.me/34693693048` | `officialLine` de la entidad | Conversación directa |
| Llamar | `tel:+34693693048` | `officialLineRaw` | Llamada al operador |
| Consultas de la malla | `/centralita-mariachis/{slug}` (220) | `MARIACHI_LANDINGS` | Navegación + crawl budget |
| Sitemap | `/sitemap.xml` | `src/app/sitemap.ts` | 221 URLs declaradas |
| Sellos | JSON-LD + manifiesto | SHA-256 determinista | `provenance`, `stripeSessionId`, `priceLock` |

---

## 4. PRECIOS Y LOGÍSTICA (SSOT, CERO HARDCODE)

- Tarifa base solista: **350,00 €** (`TARIFA_BASE_SOLISTA_EUR`).
- Catálogo de formatos: solista 350 € · cuarteto 600 € · gala 900 € ·
  monumental 1.300 € (`MARIACHI_FORMATS`), con depósito de 100 € en todos.
- Kilometraje: **50 km exentos** y **1,50 €/km** después, medidos por GPS desde
  la dirección fiscal del proveedor.
- Suplemento hotelero: **120,00 €** si la distancia supera 200 km o el evento
  termina después de las 3:00.
- Rider acústico: Ley 37/2003 del Ruido · **12 W/pax** · salud pública
  **< 75 dB SPL**.

---

## 5. ANTI-CANIBALIZACIÓN: MEDICIÓN REAL

Guardián: `node scripts/audit_centralita_mariachis_landings.cjs`.

| Métrica | Máximo medido | Umbral doctrinal | Estado |
|---|---|---|---|
| Jaccard 5 palabras | **0,543860** | ≤ 0,10 | ⚠️ OLA 2 |
| Coseno TF-IDF | **0,820452** | ≤ 0,10 | ⚠️ OLA 2 |
| Jaccard 5 caracteres | **0,762850** | ≤ 0,10 | ⚠️ OLA 2 |
| Clones / slugs / titles / H1 duplicados | **0** | 0 | ✅ |
| Depósito, split, sellos, placeholders, teléfonos | **0 desviaciones** | 0 | ✅ |

**Diagnóstico honesto:** geo e intención usan **bancos de copy disjuntos**, lo
que eliminó los clones exactos que la primera pasada detectó (coseno 1,000).
Bajar de 0,10 exige redacción editorial única por URL (220 textos): esa es la
OLA 2, registrada —no maquillada—.

---

## 6. EJECUCIÓN

```powershell
npx tsx scripts/build_centralita_mariachis_landings.ts
node scripts/audit_centralita_mariachis_landings.cjs
npx tsc -p tsconfig.landings-dominance.json --noEmit
```

Artefacto auditable: `public/landings/centralita-mariachis/manifest.json`
(sin timestamps: N ejecuciones = los mismos bytes).

---

## 7. CRITERIOS DE CIERRE

- [x] Operador verificado con titular de línea declarado.
- [x] 220 URLs (160 geo + 60 intención) con slugs, titles y H1 únicos.
- [x] Depósito, formatos, kilómetros y rider importados del SSOT.
- [x] JSON-LD por URL: `MusicGroup` + `Service` + `Offer` + `FAQPage` + `BreadcrumbList`.
- [x] Hub con la malla completa y sitemap con las 221 URLs.
- [x] Guardián ejecutable y manifiesto determinístico.
- [ ] **OLA 2**: copy editorial único por URL para alcanzar Jaccard/coseno ≤ 0,10.
- [ ] **OLA 3**: depósitos cerrados por landing y liquidación 80/10/10.

> Regla soberana: la dominancia se mide en **reservas con depósito cerrado**,
> no en número de URLs.
