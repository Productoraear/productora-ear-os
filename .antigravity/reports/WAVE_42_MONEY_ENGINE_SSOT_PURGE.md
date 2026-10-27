# WAVE 42 — PURGA DE MOTORES DE DINERO PARALELOS Y RESTAURACIÓN DE LA TARIFA SANCIONADA

> Fecha: 2026-10-27 · Rama: `main` · Ámbito: P0 (dinero) · Estado: **cerrado con Exit Code 0 en todos los gates**
> Origen: informe forense de Wave 39 + orden del CEO («procede»).

---

## 0. HALLAZGO FORENSE DECISIVO (la contradicción 1,50 vs 0,50 €/km)

El informe de Wave 38 afirmaba que 0,50 €/km era «tarifa sancionada por el CEO». **Era falso.**
La evidencia en Git es incontestable:

| Fuente | Valor | Estado |
|---|---|---|
| `git show HEAD:src/lib/constants/ear-os-ssot.ts` | `LOGISTICA_EUR_PER_KM = 1.5` | Commiteado (baseline sancionado) |
| `git show HEAD:src/lib/security/ssotIntegrityGuard.ts` | `KNOWN_GOOD_SSOT_HASH = ebc011a0…29dd` · invariante `!== 1.5` | Commiteado (baseline sancionado) |
| `.clinerules` línea 37 · `AGENTS.md` línea 24 · `ANTIGRAVITY_OMEGA_ORDENES_SUPREMAS_v9.0.md` | «1,50 €/km a partir del km 50» | Doctrina escrita del CEO |
| **Árbol de trabajo (Wave 38, sin commitear)** | `1.5 → 0.5` + hash `0c2999…e3eb8` | **Drift no sancionado** |

Es decir: Wave 38 cambió la constante sellada, reescribió el invariante del guardián y **re-selló el hash
a mano** — el patrón que la Zona Cero prohíbe expresamente. El motor real pasó a facturar **un tercio**
de lo que dice la doctrina (100 km: 375 € facturados vs 425 € debidos).

**Resolución aplicada (Wave 42):** se restaura la tarifa y el hash sancionados. No se tocó ningún
documento de doctrina, porque la doctrina ya era correcta.

- `LOGISTICA_EUR_PER_KM = 1.5` (idéntico a HEAD → el diff de `ear-os-ssot.ts` queda en cero).
- Guardián: invariante `!== 1.5` y `KNOWN_GOOD_SSOT_HASH = ebc011a0…29dd` (hash de referencia commiteado).
- `npm run audit:ssot` → `hash calculado == hash referencia == ebc011a0…29dd` · `SÍ` · invariantes `OK`.
- Resto de constantes selladas intactas (350 €, 100 €, 80/10/10, 15.000/14.250 €, 75 dB/12 W-pax).

---

## 1. MOTORES PARALELOS DE DINERO PURGADOS

| Archivo | Antes | Después |
|---|---|---|
| `src/lib/services/pricing/geo-pricer.ts` | `costPerKm = 0.75`, `baseFee 350/750`, `+100 €/músico`, split `0.80/0.10/0.10`, depósito **30 %** | Todo derivado del SSOT: `LOGISTICA_EUR_PER_KM`, `TARIFA_BASE_SOLISTA_EUR`, `SUPLEMENTO_QUINTETO`, `GRUPO_MIN_MUSICOS`, `SPLIT_SOBERANO`, depósito **100 € fijos**; franquicia de 50 km aplicada (antes no existía) |
| `src/app/actions/checkoutActions.ts` | escalera `350/550/900/1800` + `depositValue: 150` + `costPerKm = 0.75` por defecto | `basePriceForFormat()` del SSOT, depósito `DEPOSITO_STRIPE` (100 €), `COSTE_KM`, franquicia 50 km e **invariantes fail-closed** antes de tocar Stripe (deriva de distancia > 0,1 km, depósito ≠ 100 € o total firmado ≠ recálculo soberano ⇒ `PRICE_LOCK_REJECTED`) |
| `src/lib/actions/stripe-checkout.ts` | `costPerKm: 0.75`, `baseFee: 0`, depósito 100 suelto | `COSTE_KM`, franquicia 50 km, `DEPOSITO_STRIPE`, `BASE_SOLISTA`; el importe firmado y la metadata (`totalAmountCalculated`, `priceLockHash`) salen del motor soberano |
| `src/config/stripe-products.ts` | copy «+0,75 €/km fuera de Madrid» | copy interpolado del SSOT (`LOGISTICA_EUR_PER_KM` + `LOGISTICA_KM_EXENTOS`) |
| `src/app/api/quote/generate-lock/route.ts` | `depositAmount: 100.0` hardcodeado en el payload n8n | `DEPOSITO_STRIPE` |
| `src/lib/agents/chatGuard.ts` | prompt del concierge con «50 km exentos + 0,50 €/km + 120 €» | prompt interpolado del SSOT (imposible que vuelva a divergir) |
| `src/app/actions/vendorActions.ts` | `calculateEdwinAgudeloQuoteAction` con `350` fijo, `(km-50) * 0.75` y `120` a mano | `BASE_SOLISTA`, `computeSovereignLogistics()` y `SPLIT_SOBERANO` (cero multiplicaciones manuales de km) |
| `src/lib/pricing/logistics.ts` | suplementos de grupo dispersos | `GRUPO_MIN_MUSICOS` y `SUPLEMENTO_MUSICO_ADICIONAL_EUR` centralizados en el núcleo tarifario |

**Bug de facturación real corregido:** la formación `gran_show` se enviaba al Price-Lock como
`solista` y se cobraba **350 €** en lugar de 750 €. Ahora el mapeo es un `Record` exhaustivo
(`formation → FormatType`) y `gran_show` aplica el suelo del quinteto + `logger.warn`
(`GRAN_SHOW_REQUIRES_MANUAL_QUOTE`): por encima de 5 músicos el SSOT no canoniza tarifa, así que se
exige cotización manual en vez de inventar un precio.


---

## 2. GATES (reproducidos hoy, no heredados de informes)

| Gate | Resultado | Evidencia |
|---|---|---|
| `npm run verify:pricing` | **31/31 PASS · Exit 0** (antes 24) | 7 comprobaciones nuevas: paridad geo-pricer/motor Edwin, depósito 100 €, split 80/10/10 + 5 reglas estáticas anti-tarifa-paralela |
| `npm run verify:context` | **21/21 PASS · Exit 0** | Wave 39 intacta |
| `npm run audit:ssot` | hash `ebc011a0…29dd` **coincide** · invariantes OK · Exit 0 | baseline sancionado restaurado |
| `tsc --noEmit` | **Exit 0** (0 errores, salida vacía) | `node ./node_modules/typescript/bin/tsc --noEmit` |
| `npm run lint` | **Exit 0** · 3.285 warnings, **0 errores** | preexistentes; ninguno nuevo del diff |
| **End-to-end real (:3007)** | `POST /api/quote/generate-lock` → `200 · {"calculatedBase":425,"priceLockHash":"SHA256-Ω-9581496935C4A9EA","status":"SECURE"}` | 350 € + 50 km × 1,50 € = **425 €** ✔ |
| Smoke rutas de venta (:3007) | `/`, `/checkout/presupuesto`, `/reservar/solista`, `/cotizador`, `/otzarreta`, `/soberania-tecnica` → **200** | 6/6 |

Antes de restaurar la tarifa, el mismo endpoint devolvía `calculatedBase: 375` (350 € + 50 km × 0,50 €):
la diferencia de **50 € por cada 100 km** es exactamente el dinero que se estaba dejando de facturar.

---

## 3. HERRAMIENTA NUEVA: `npm run audit:tariff-copy`

Auditor de deriva entre el copy comercial y la tarifa sellada (`scripts/audit_tariff_copy_drift.cjs`).
Modo informativo (Exit 0) y `--strict` (Exit 1) para convertirlo en gate duro.

Resultado con la tarifa en 0,50 (estado Wave 38): **99 menciones**, 19 alineadas y **80 en deriva en 58
archivos** (76 × 1,50 €/km y 4 × 0,75 €/km). Es decir: **el copy comercial ya decía la verdad; el motor
era el que mentía**.

Estado final tras esta ola: **95 menciones · 93 alineadas (1,50 €/km) · 2 en deriva**, ambas en
`scripts/omega_register_wave_38.cjs`, que es el registro histórico del propio error de Wave 38 y se
conserva deliberadamente como evidencia forense (no es copy de venta).


---

## 4. PENDIENTES / RIESGOS DECLARADOS

1. **`ACG_ARTIST_OFFERS`** (`src/lib/acg/acgDecisionEngine.ts`) mantiene su propia escalera de precios
   (solista 350 € / dúo 480 € / quinteto 750 €) que el Price-Lock usa. No se ha tocado: el dúo a 480 € no
   está canonizado en el SSOT y fusionarlo es decisión de negocio, no de código. **Es la última escalera
   de precios paralela que queda en la ruta de venta.**
2. **Copy con «depósito 0,50 €»** en `src/adn_vault/**` y `src/features/finance/**`
   (`depositVal ?? 0.50`): es un depósito simbólico de pruebas, no la tarifa €/km. Se deja intacto, pero
   aparece listado si el auditor se ejecuta en modo `--strict`.
3. **`next-env.d.ts`** lo reescribe `next dev` (bloque de reglas de agente): se commitea para no dejar
   ruido permanente en el árbol, según la nota del propio generador.
4. **Deploy**: nada se ha empujado a `origin`. Cualquier push dispara Coolify (`82.29.179.172:8000`).

---

## 5. ROLLBACK

- **Tarifa**: son tres líneas (`LOGISTICA_EUR_PER_KM`, invariante del guardián, `KNOWN_GOOD_SSOT_HASH`).
  Cualquier cambio futuro exige `npm run seal:ssot` **con sanción escrita del CEO**.
- **Motores**: `git revert <sha>` del commit de esta ola devuelve los cuatro motores a su estado anterior
  (no recomendado: reintroduce 0,75 €/km, depósito de 150 € y `gran_show` cobrado a 350 €).
