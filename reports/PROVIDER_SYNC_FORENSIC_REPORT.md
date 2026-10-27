# DICTAMEN FORENSE — SINCRONIZACIÓN REAL DE PROVEEDORES (EAR OS)

**Fecha:** 2026-10-25 · **Motor:** `scripts/build_lean_verified_edge.cjs` (v2 TRUTH-EDGE)
**Doctrina aplicada:** CERO FACHADAS · `verified:true` solo con teléfono real atribuible · GPS solo con evidencia JSON-LD.

---

## 1. La cifra real (sin vanidad)

| Métrica | Valor real medido | Fuente |
|---|---:|---|
| Filas en el SSOT `all_providers_database.json` | **122.987** | censo streaming |
| Proveedores únicos (vendor id CDN / nombre+provincia) | **78.498** | `audit_provider_identity.cjs` |
| Filas con identidad CDN real (`/vendor/<id>/`) | 54.517 | idem |
| Filas con teléfono real (no centralita) | **17.821 (14,49%)** | idem |
| Teléfonos únicos tras normalizar | **1.783** | idem |
| Filas que repiten un teléfono ya usado | **16.038** | idem |
| Teléfonos compartidos por proveedores distintos | 126 | idem |
| Proveedores con teléfono **atribuible sin ambigüedad** | **195 (0,25%)** | idem |
| Proveedores con **GPS verificado por JSON-LD** | **2.142** | `extract_provider_intel_from_html.cjs` |
| Proveedores con redes sociales reales | 100 | idem |
| Proveedores con **web propia** | **0** | idem |
| Proveedores con **email** | **0** | idem |
| **Publicados en el escaparate (Edge CDN)** | **6.846** | `manifest.json` |
| Cifra que mostraba el frontend (hardcodeada) | 85.946 | eliminada |

> El escaparate ya no publica 85.946. Publica **6.846 fichas reales**: 6.739 del SSOT
> (teléfono real o GPS verificado) + 107 de VIMUME senior care con teléfono real.

### Distribución publicada

| Gremio | Fichas | Con teléfono | Verified blindados | Con GPS | Con redes | Chunks |
|---|---:|---:|---:|---:|---:|---:|
| finca | 1.104 | 48 | 48 | 54 | 3 | 3 |
| catering | 335 | 2 | 2 | 67 | 2 | 1 |
| musica | 803 | 17 | 17 | 501 | 46 | 2 |
| foto | 1.644 | 40 | 40 | 752 | 11 | 3 |
| decoracion | 472 | 4 | 4 | 273 | 5 | 1 |
| servicios | 641 | 26 | 26 | 297 | 27 | 1 |
| moda | 1.093 | 39 | 39 | 93 | 2 | 2 |
| transporte | 376 | 6 | 6 | 104 | 4 | 1 |
| sonido | 151 | 10 | 10 | 1 | 0 | 1 |
| wedding | 120 | 3 | 3 | 0 | 0 | 1 |
| senior_care | 107 | 107 | 0 | 0 | 0 | 1 |
| **TOTAL** | **6.846** | **302** | **195** | **2.142** | **100** | **17** |

> Lectura correcta de la tabla: «Con teléfono» incluye 107 fichas VIMUME con línea directa.
> «Verified blindados» exige teléfono **exclusivo**, numeración no premium y ausencia de
> relleno sintético; por eso las 107 fichas VIMUME (imágenes stock y descripciones genéricas)
> aparecen con teléfono pero **sin** sello verified.

---

## 2. Por qué NO se ha sincronizado el 100% (causas raíz, no excusas)

1. **El SSOT no tiene columnas de web, email, redes ni GPS.**
   De 122.987 filas, la cobertura de `web` es **0 (0,00%)**, `email` **0**, `instagram` **0**,
   `facebook` **0**, `whatsapp` **0** y `lat/lng` **0**. No hay nada que sincronizar:
   el dato nunca se capturó. Solo existen 20 campos (nombre, teléfono, categoría,
   provincia, imágenes, textos, precio/rating sintéticos).

2. **El 85,51% del catálogo solo tiene la centralita.**
   105.166 filas llevan `+34 693 693 048` (centralita del CEO) en el campo teléfono.
   Ese número **no es un contacto de proveedor** y por doctrina no se publica.

3. **El join de teléfonos está roto: 17.821 filas → 1.783 números.**
   16.038 filas comparten un teléfono ya asignado a otra empresa (ej. el mismo número
   en «12 Pulgadas», «2 Alianzas» y «24 Film Studio»). Se han **retenido 4.563 fichas**
   con teléfono ambiguo (`phone_disputed`) para no atribuir un contacto ajeno.
   Solo 195 proveedores tienen un teléfono exclusivo y verificable.

4. **La bóveda HTML cubre el 2,74% del catálogo.**
   Hay **2.150 fichas HTML** archivadas frente a **78.498 proveedores únicos**.
   De ellas, 2.144 tienen JSON-LD con GPS, dirección, rating y precio reales.
   Las 76.348 fichas restantes **no tienen página de origen descargada**.

5. **La fuente de origen oculta el contacto.**
   En las 2.144 fichas con JSON-LD: teléfono publicado **0**, web **0**, email **0**.
   Solo 119 Instagram y 47 Facebook reales (5,53%). Bodas.net no expone el teléfono
   del proveedor en el HTML: lo entrega tras formulario/registro.
   Sin una segunda fuente (Google Places, web propia del proveedor o claim), el
   teléfono/web no se puede extraer de ese HTML.

6. **El pipeline anterior truncaba e inventaba.**
   - `build_lean_verified_edge.cjs` (v1) cortaba por top-N (800/600/500) y escribía
     `verified:true` a toda fila publicada, además de `basePrice 350`, `rating 4.9`
     y `reviews 18` por defecto.
   - `providers-manifest.ts` y `SClassNexus.ts` hardcodeaban **85.946** (suma de
     conteos que no coincidían con el manifest real de 5.646).
   - `public/data/proveedores_index.json` asigna `whatsapp` = centralita a todos,
     `rating 4.9` / `reviews 18` / `S_CLASS_AUDITED` constantes y precios fijos.
   - `senior_care.json` usaba imágenes stock (`unsplash`), precio fijo 1.500 € y
     descripciones genéricas.

---

## 3. Qué se ha corregido en esta iteración

| Archivo | Cambio |
|---|---|
| `scripts/audit_provider_data_coverage.cjs` | Censo streaming campo a campo (0 RAM extra): teléfono, web, email, redes, GPS, duplicados, categorías, cobertura Edge. |
| `scripts/audit_provider_identity.cjs` | Identidad real por `vendor id` CDN, deduplicación, auditoría de autenticidad telefónica (móvil/fijo/premium) y mapa canónico. |
| `scripts/extract_provider_intel_from_html.cjs` | Minería de las 2.150 fichas con `provenance` SHA-256: GPS, dirección, rating, precio, galería y redes **reales**; descarta el chrome de la plataforma. |
| `scripts/build_lean_verified_edge.cjs` | Reescrito: sin `verified` fabricado, sin precios/ratings inventados, chunking < 900 KB, dedupe global de teléfonos, filtro GPS España, purga de relleno sintético. |
| `scripts/verify_provider_edge_truth.cjs` | Guardián CI: 0 fachadas, 0 placeholders, 0 teléfonos duplicados, GPS en España, counts = manifest. |
| `scripts/sync_providers_manifest.ps1` | Delegado al motor único JS (evita regenerar conteos truncados). |
| `src/lib/constants/providers-manifest.ts` | Contadores derivados del `manifest.json` real (adiós 85.946). |
| `src/lib/constants/SClassNexus.ts` | Métricas derivadas del manifest real. |
| `src/app/api/profiles/search/route.ts` | Carga la partición completa por chunks del manifest. |
| `src/app/(public)/proveedores/page.tsx` | Loader chunked, sin precio 350/rating 5.0/reseñas 12 por defecto, sin `has_real_phone` optimista, JSON-LD sin `AggregateOffer` inventado. |
| `package.json` | `preflight:edge` ahora genera + verifica; nuevos `audit:providers` y `verify:providers`. |

### Invariantes verificadas

```
node scripts/verify_provider_edge_truth.cjs
→ archivos: 17 · registros: 6.846 · 9,98 MB · ids únicos: 6.846
→ telefonosPublicados: 302 · errores: 0 · avisos: 0
✅ EDGE VERAZ: 0 fachadas, 0 placeholders, 0 teléfonos duplicados.
```

- Máximo por archivo: **900 KB** (17 chunks, ninguno > 1 MB).
- `verified:true` sin teléfono: **0**.
- Centralita publicada como teléfono de proveedor: **0**.
- Teléfonos duplicados entre proveedores: **0**.
- IDs/slugs duplicados: **0**.
- Coordenadas fuera de España: **0** (se descartó 1 registro con GPS en Angola).

---

## 4. Qué falta para llegar al 100% (requiere acción externa)

| Bloqueo | Acción necesaria | Impacto |
|---|---|---|
| 76.348 fichas sin HTML de origen | Crawl masivo de las páginas de proveedor (2.150/78.498 hechas) | Añade GPS/dirección/rating/precio reales por ficha |
| Teléfono oculto en origen | Enriquecimiento vía Google Places API (requiere key + presupuesto), web propia o claim del proveedor | Convierte fichas en contactables |
| Web/redes no capturadas | Crawl de la web propia y perfiles sociales del proveedor | Cobertura hoy: 100 redes / 0 web |
| 4.563 teléfonos ambiguos | Resolución de identidad contra la ficha de origen (1 teléfono = 1 vendor id) | Recupera contactos hoy retenidos |
| 107 fichas VIMUME sin datos fiables | Re-harvest real de residencias (nombre, dirección, teléfono directo, foto propia) | Elimina el último relleno sintético |

Sin esas fuentes externas, cualquier cifra superior a **6.846** sería inflación de vanidad,
no sincronización real. El sistema ahora **declara** `publishable` vs `published` vs `overflow`
en el manifest y falla en CI si aparece una fachada.

---

## 5. Comandos de operación

```bash
npm run audit:providers     # censo campo a campo + identidad + minería HTML
npm run preflight:edge      # regenera particiones chunked + verifica integridad
npm run verify:providers    # guardián: 0 fachadas o Exit Code 1
```

---

## 6. Adquisición masiva ejecutada — Overture Maps Places (2026-10-21.0)

Se localizó y ejecutó la única fuente abierta con cobertura nacional real y licencia comercial
(**CDLA-Permissive-2.0**): **2.576.045 POIs españoles**, de los cuales **2.398.342 tienen contacto**
(2.184.612 teléfono · 1.400.991 web · 583.501 email · 1.102.119 redes).

### Pipeline construido

| Script | Función |
|---|---|
| `scripts/overture_extract_es.sql` | Extrae los POIs españoles contactables a Parquet (194 MB) desde S3. |
| `scripts/overture_exact.sql` | Cruce exacto por nombre normalizado + provincia derivada por municipio. |
| `scripts/overture_fuzzy.sql` | Bloqueo por prefijo + Jaro-Winkler + categoría + dominio, por gremio. |
| `scripts/lib/provider_enrichment.cjs` | Reglas de atribución, dedupe telefónico global y evidencia. |
| `scripts/enrich_providers_overture.cjs` | Orquestador (extracción → exacto → fuzzy → consolidación → auditoría). |
| `scripts/build_enrichment_chunks.cjs` | Particiona el overlay en 7 ficheros < 850 KB versionables. |

### Resultado sobre el catálogo

| Métrica | Antes | Ahora |
|---|---:|---:|
| Proveedores con enriquecimiento real | 0 | **6.700** |
| Con teléfono real | 195 | **5.686** |
| Con web propia | 0 | **5.312** |
| Con email | 0 | **2.895** |
| Con redes sociales | 100 | **3.438** |
| Con GPS verificado | 2.142 | **5.913** |
| Fichas publicadas en el escaparate | 6.846 | **12.987** |
| Teléfonos publicados | 302 | **5.976** |
| Verified blindados | 195 | **5.761** |

### Reglas de verdad aplicadas

- **Exacto**: nombre normalizado idéntico + provincia coincidente. Si la provincia es desconocida,
  solo se acepta con candidato único, nombre distintivo y dominio/categoría como evidencia extra.
- **Fuzzy**: Jaro-Winkler ≥ 0,93 + provincia obligatoria + categoría compatible +
  (dominio propio o contención de tokens). Se descartaron 1.102 por nombre débil, 223 por
  provincia distinta y 147 por categoría incompatible.
- **Ambigüedad**: 787 proveedores con varias sedes posibles conservan la web de marca común pero
  **no publican teléfono ni email**.
- **Dedupe global**: 32 teléfonos compartidos entre proveedores fueron retirados de todos.
- Cada ficha publicada lleva `enrichment_evidence` con dataset, licencia, confianza, regla,
  `matched_id` del POI y campos aportados.

### Artefactos pesados fuera de Git

`.gitignore` excluye el Parquet (194 MB), los JSONL de pares fuzzy/exactos y el overlay completo
(6,2 MB). Lo versionable son las 7 particiones ligeras de `src/data/provider_enrichment/`
(5,15 MB total, ninguna > 850 KB) más la auditoría y el resumen.

### Lo que sigue sin ser recuperable con fuentes abiertas

- **26.843 proveedores sin candidato** en Overture: requieren crawl de su web propia o Google Places.
- **3.427 nombres coincidentes en otra provincia**: descartados por riesgo de atribución cruzada.
- **76.348 fichas sin HTML de origen**: el crawl masivo del marketplace sigue pendiente.
- **39.875 identidades sin vendor id**: en su mayoría artículos/SKUs, no empresas; se excluyen.

Para cerrar el resto con garantías hace falta una API de pago (Google Places / Foursquare) o el
crawl masivo de las webs propias. El pipeline ya está preparado para ingerir cualquier nueva
fuente con el mismo contrato de evidencia y las mismas reglas de dedupe.

### Comandos

```bash
npm run enrich:providers   # extracción + cruce + consolidación + particiones
npm run enrich:chunks      # solo regenerar las particiones del overlay
npm run preflight:edge     # regenerar escaparate + verificar 0 fachadas
```
