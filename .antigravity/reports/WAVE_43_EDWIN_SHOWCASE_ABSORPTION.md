# WAVE 43 — ABSORCIÓN DEL ESCAPARATE DE EDWIN AGUDELO (LEGADO 2009-2024)

**Fecha:** 2026-10-27
**Ruta objetivo:** `/artistas/edwin-agudelo`
**Fuente vampirizada:** `https://edwinagudelo.es/` · snapshot Wayback `20230512110955`
**Naturaleza jurídica:** propiedad del propio artista / CEO. **Cero marcas de terceros.**
**Estado:** ✅ DESPLEGADO EN DISCO · ✅ VERIFICADO EN VIVO (:3007) · ✅ `tsc --noEmit` Exit 0

---

## 1. HALLAZGO FORENSE PREVIO (lo que NO era como parecía)

| # | Hallazgo | Evidencia | Severidad |
|---|---|---|---|
| H1 | El escaparate **ya existía pero estaba huérfano**: `EdwinServicesGrid` (7 servicios) solo lo importaba `EdwinArtistVault`, y **ninguna ruta montaba `EdwinArtistVault`** | `Select-String 'EdwinArtistVault'` → única coincidencia en sus 2 copias (`src/adn_vault/...` + `src/features/artists/ui/...`); ninguna `page.tsx` | **P0 · FACHADA** |
| H2 | **Dos precios distintos para el mismo producto**: grid legacy publicaba canción personalizada a **150 €**; el configurador vivo `/canciones-personalizadas` cobra **99 €** por Stripe | `EdwinServicesGrid.tsx` L69/L154 vs `page.tsx` L77 `basePriceEur = 99` | **P0 · DINERO** |
| H3 | **Dos pólizas RC distintas** en el mismo escaparate: **300.000 €** (grid) vs **1.000.000 €** (ficha + `EdwinDossierHero`) | L210 vs `SEGURO_RC_EUR` de la ficha | **P0 · JURÍDICO** |
| H4 | Claim no verificable **«4.9★ · La opción mejor valorada de España»** sin fuente | `VALUE_PROPOSITIONS[2]` | P1 · CERO INVENCIÓN |
| H5 | `quoteSlug` (cumpleanos / show-caballo / serenata-virtual…) era **dato muerto**: ningún enlace lo consumía. Si alguien lo hubiera cableado, `show-caballo` y `serenata-virtual` daban 404 | render L304-323 no usa `quoteSlug` | P1 |
| H6 | **Tres catálogos de formatos coexisten** en el repo | `TARIFAS_MARIACHI` (350/480/600/750/900/1400) · `MARIACHI_FORMATS` (350/600/900/1300) · `ACG_ARTIST_OFFERS` (350/480/750) | **P0 · ABIERTO** |

---

## 2. QUÉ SE HA CONSTRUIDO

### 2.1 `src/lib/artists/edwin-showcase-catalog.ts` (NUEVO · 451 líneas)
Fuente única del escaparate. **Cero precios literales**, todo derivado:
- `TARIFA_BASE_SOLISTA_EUR` (350) y `DEPOSITO_STRIPE_EUR` (100) → `ear-os-ssot.ts` (**ZONA CERO intacta, no se ha tocado**).
- `LOGISTICA_EUR_PER_KM`, `LOGISTICA_KM_EXENTOS`, `LOGISTICA_KM_HOTEL`, `SUPLEMENTO_HOTEL_EUR`, `WATTS_PER_PAX`, `SPLIT_SOBERANO` → condiciones publicadas.
- Escalones ← `MARIACHI_FORMATS` (catálogo client-safe del funnel `/reservar/solista`).
- `formatEur` / `formatEurDecimal` **deterministas** (sin ICU → cero riesgo de mismatch de hidratación).

Contenido absorbido **sin excepción** del archivo:
- **9 verticales**: cumpleaños · boda · quince años · día de la madre y del padre · show cantando a caballo · serenata virtual · vídeo personalizado 4K · canción personalizada · solista premium.
- **4 ventajas** (empatía, exclusividad de fecha, contenido sobre vuestra historia, sinceridad).
- **2 packs «¿Qué incluye?»** (solista con ramo/sombreros/2×30 min · grupo de mariachis).
- **Oficina de representación**: Manager General (Adriana Lenis) y Jefa de Prensa (Eliana Tovar), con `provenanceDate` + `provenanceUrl` auditables.

**Decisión de blindaje:** los teléfonos y correos del snapshot 2023 (`+34 659 116 376`, `+34 679 286 157`, `@edwinagudelo.es`) **NO se publican**. Todo lead entra por la centralita SSOT `+34 693 693 048`. Absorber la estructura sin crear leads huérfanos.

### 2.2 `src/features/artists/ui/EdwinEscaparateSClass.tsx` (NUEVO · 414 líneas)
**Server Component puro** (sin `"use client"` → 0 bytes de JS al navegador). 7 bloques: cabecera · 9 verticales con destino real · 4 ventajas · 2 packs · escalones · condiciones verificadas · oficina de representación. OLED `#030305`/`#09090d`, oro `#ecb613`, `rounded-3xl`, `backdrop-blur-md`, `transition-all duration-300 ease-out`, hovers expansivos, `focus-visible` rings, `aria-hidden` en iconos, **sin `w-screen`**.

### 2.3 Montaje real
`/artistas/edwin-agudelo/page.tsx`: import + `<EdwinEscaparateSClass />` entre el hero y la bóveda multimedia, más un nodo **`ItemList`** con los 9 `Service` en el JSON-LD (Rich Results válidos, `provider` → `#artist`).

### 2.4 Sanidad del legacy
`EdwinServicesGrid.tsx`: 8 derivas corregidas (150→99 canónico, 300.000→1.000.000, 750→catálogo real, 350 hardcodeado→SSOT, claim 4.9★ eliminado). `canciones-personalizadas/page.tsx`: `basePriceEur` ahora importa la constante canónica.

---

## 3. CONFLICTO DETECTADO AL MONTAR (y neutralizado en el acto)

Al renderizar el escaparate junto al terminal de precios ya existente, la misma página mostraba:

| Concepto | Terminal (`TARIFAS_MARIACHI`) | Escaparate (`MARIACHI_FORMATS`) |
|---|---|---|
| Cuarteto | **750 €** | **600 €** |
| Formación máxima | Imperial **1.400 €** | Monumental **1.300 €** |

**Dos catálogos, mismo nombre comercial, distinto precio, misma página.** Es exactamente el tipo de grieta que rompe la confianza y el SEO.

**Acción (sin tocar ningún motor de dinero):** el bloque «Escalones de formato» ya **no publica euros por formación**. Muestra músicos, nombre y recomendación, con CTA «Ver precio certificado» → `/reservar/solista` (Price-Lock SHA-256) y una nota que fija únicamente la base indiscutida (`350 €`) ya sellada en el SSOT. Verificado en vivo: `Cuarteto Clásico Ranchero … Ver precio certificado` (sin importe).

> **No se ha unificado el catálogo**: hacerlo alteraría precios reales sin sanción del CEO. Queda como decisión P0 abierta (§5).

---

## 4. VALIDACIONES EJECUTADAS

| Validación | Comando / método | Resultado |
|---|---|---|
| Tipos (puerta real, no vacua) | `npx tsc --version` → `6.0.3` | ✅ activo |
| Prueba de inyección | sonda `const probeGate: number = 'x'` → `tsc` | ✅ `error TS2322` + `EXITCODE=2` (la puerta detecta) |
| Sonda eliminada | `Remove-Item` + re-check | ✅ sin residuos |
| **Type-check final** | `npx tsc --noEmit --pretty false` | ✅ **EXITCODE=0**, 0 diagnósticos |
| Render en vivo | `GET http://localhost:3007/artistas/edwin-agudelo` (378 KB) | ✅ «Escaparate oficial · 9 verticales» presente |
| Condiciones en vivo | idem | ✅ `100 €` · `1,50 €/km desde el km 50` · `+120 €` · `12 W/pax` · `RC 1.000.000 €` · `80/10/10` |
| Oficina en vivo | idem | ✅ Manager General / Jefa de Prensa + centralita única |
| Sin overlay de error | idem | ✅ 0 «Application error», 0 stack trace |
| Árbol de trabajo | `git status --porcelain` | ✅ 3 M + 2 ?? — **0 temporales** |

### SCORECARD (bloque P0/P1)
1. `tsc` Exit 0 ✅ · 2. 0 `any` en el diff ✅ · 3. 0 precios literales en el escaparate nuevo ✅ · 4. 0 `verified:true` falso ✅ (sin cambios en marketplaces) · 5. 0 handlers huérfanos ✅ (9/9 tarjetas con `href` real) · 6. 0 secrets expuestos ✅ · 7. 0 TODO/placeholder ✅ · 8. ZONA CERO intacta ✅ (`ear-os-ssot.ts` y `ssotIntegrityGuard.ts` sin tocar) · 9. `w-screen` ✗ ausente ✅ · 10. Server Component por defecto ✅ (0 JS cliente en el escaparate).

---

## 5. PENDIENTE DE DECISIÓN DEL CEO (no técnica, no la tomo yo)

1. **Catálogo oficial de formatos (P0).** Hoy conviven tres:
   - `TARIFAS_MARIACHI`: Solista 350 · Dúo 480 · Trío 600 · Cuarteto 750 · Quinteto 900 · Imperial 1.400
   - `MARIACHI_FORMATS` (funnel `/reservar/solista`): Solista 350 · Cuarteto 600 · Gala 900 · Monumental 1.300
   - `ACG_ARTIST_OFFERS` (`/api/quote/generate-lock`): 350 · 480 · 750

   **Coinciden todos en la base 350 €** (el 80 % del volumen). La divergencia empieza en el segundo músico. Decisión requerida: ¿el **Dúo oficial es 480 € o 600 €**? Con esa respuesta se canoniza en el SSOT (vía `npm run seal:ssot`, jamás a mano), se colapsan los tres catálogos en uno y se vuelve a publicar la escalera con precios.
2. **Cargos de representación.** Adriana Lenis / Eliana Tovar vienen del snapshot **2023-05-12**. Si alguno ya no está vigente, se retira el cargo en un solo punto del catálogo.

---

## 6. RIESGOS RESIDUALES

- `EdwinArtistVault` (+ su copia en `src/adn_vault/`) sigue **sin montar**: 11 bloques con prensa, métricas y manifiesto. No se ha montado porque incluye claims no auditados; **no es un fallo del escaparate**, es la siguiente pieza a auditar si se desea ampliar.
- `src/adn_vault/testimonials/` queda fuera de `tsconfig` (`exclude`), pero sigue en el bundle si alguna ruta lo importa.
- No se ha ejecutado `next build` ni `eslint` completo (el `next dev` de :3007 ocupa el shell). **Antes de push a Coolify**: `npm run lint` + `npm run build`.

---

## SIGUIENTE PASO SUGERIDO
1. CEO responde Dúo 480 € / 600 €.
2. Canonizar → `npm run seal:ssot` → colapsar catálogos → republicar escalera con precios.
3. `npm run lint` + `npm run build` antes de `git push origin` (Coolify `82.29.179.172:8000`).

