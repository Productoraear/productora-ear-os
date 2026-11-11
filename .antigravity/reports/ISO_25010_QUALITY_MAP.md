# ISO/IEC 25010 · MAPA DE CALIDAD MEDIDO — EAR OS v14.0

**Generado**: 2026-11-11 · **Ítem Ω-09** del Scorecard Ω-Diamante
**Regla rectora**: `.clinerules` AF-4/AF-5 — toda cifra de este documento se rastrea a un
comando ejecutable en disco. Una característica sin comando se declara `SIN_EVIDENCIA`, no
se maquilla con adjetivos.

> **Qué es y qué NO es este documento.** Es un mapa de trazabilidad entre las ocho
> características de calidad de ISO/IEC 25010 y los auditores que hoy las miden en este
> repositorio. **No** es una certificación: nadie ha auditado el sistema contra la norma
> completa y el documento lo dice en cada fila donde falta evidencia.

---

## 1 · Trazabilidad característica → comando → último resultado medido

| # | Característica (ISO 25010) | Comando de medición | Resultado medido |
|---|---|---|---|
| 1 | **Adecuación funcional** | `npm run verify:seating-planner` · `node scripts/verify_price_lock_flow.cjs` · `npm run verify:pricing` | 29/29 aserciones PASS · flujo Price-Lock Exit 0 · 350/100/1,50 invariantes OK |
| 2 | **Eficiencia de desempeño** | `node scripts/audit_cls_budget.cjs` · `npm run audit:webgl` · `node scripts/audit_lighthouse_x4.cjs` | 8 reglas de layout-shift sin violación · `lighthouse` **ausente del árbol**: Ω-12 = `SIN_EVIDENCIA` |
| 3 | **Compatibilidad** | `npm run audit:contrast:core` · `npm run typecheck` | contraste WCAG medido en Chrome headless · `tsc --noEmit` Exit 0 |
| 4 | **Usabilidad** | `node scripts/audit_offscreen_hero.cjs` (anti-CLS del hero) · `node scripts/audit_cls_budget.cjs` | hero con geometría fija `h-[clamp(580px,100svh,760px)]` + `contain` · 0 spinners huérfanos en las rutas auditadas |
| 5 | **Fiabilidad** | `npm run sim:event` · `node scripts/verify_sonometro_pwa.cjs` | 1 fila por `stripeSessionId` (INV-08) · rider acústico Exit 0 |
| 6 | **Seguridad** | `node scripts/audit_asvs_l3_payloads.cjs` (17 comprobaciones) · `npm run audit:public-secrets` · `npm run audit:phone` | ASVS L3 `PASS` 17/17 · 0 secretos de servidor en 830 ficheros `"use client"` (Ω-08) · 0 teléfono fuera de gate |
| 7 | **Mantenibilidad** | `node scripts/audit_cisq_structural.cjs` | 593 ficheros · 2.209 funciones · CC máx 206 · **195 violaciones** (ver §2) |
| 8 | **Portabilidad** | `npm run verify:domains` · `npm run verify:build-memory` | aislamiento de dominio Exit 0 · presupuesto de memoria de build respetado |

## 2 · Deuda declarada (no se esconde)

- **Mantenibilidad (característica 7)**: 195 funciones superan CC 15; la peor es
  `POST` en `src/app/api/agents/chat/route.ts` (611 líneas). Deuda **preexistente**: el
  código escrito en la sesión del 2026-11-11 (módulos `seating`, hero OffscreenCanvas)
  entra con CC ≤ 15 verificado por el mismo auditor.
- **Eficiencia (característica 2)**: sin `lighthouse` instalado, la nota Lighthouse 100×4
  no es demostrable en este repo. El CLS se mide hoy de forma **estática** (`mode:
  SIMULADO`): el p75 de campo exige RUM/CrUX y no existe todavía.
- **Usabilidad (característica 4)**: la medición es estática (reglas sobre el código). No
  hay sesiones reales instrumentadas; el rebote del 99,95 % sigue sin causa medida con
  grabaciones.

## 3 · Cómo se regenera

```bash
node scripts/audit_cisq_structural.cjs      # característica 7 → .antigravity/reports/cisq_structural.json
node scripts/audit_asvs_l3_payloads.cjs     # característica 6 → .antigravity/reports/asvs_l3_payloads.json
node scripts/audit_rich_results.cjs         # SEO/estructura  → .antigravity/reports/rich_results.json
node scripts/audit_similarity_corpus.cjs    # unicidad        → .antigravity/reports/similarity_corpus.json
npm run audit:omega-rojo                    # cobertura de los 20 ítems del scorecard
```

Cada uno escribe `probed`, `source`, `mode`, `checkedAt` y `disclaimer` en su JSON: el
sistema no puede declarar «verde» sin decir cómo lo midió.
