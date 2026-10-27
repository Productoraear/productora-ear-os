# WAVE 40 · PEAJE SOBERANO (SOVEREIGN LEAD GATE)

**Fecha:** 2026-10-27 · **Estado:** CERRADA (Exit Code 0) · **Rama:** sin commit (a la espera del empaquetado W38+W39+W40)

---

## 1. Fallo reportado por el CEO

> «Pues comenzamos fatal: para empezar sale en primera fila el número de Eduardo, no hay peaje.
> Me imagino que lo mismo pasaría con otros proveedores.»

**Traducción a doctrina:** la ficha de un recinto colaborador publicaba la línea directa del gerente
en la primera fila del hero, en las tarjetas de sede, en el footer y en el JSON-LD. Cualquier pareja
podía llamar directamente al restaurante: **cero peaje**, cero trazabilidad del lead y cero split
80/10/10. La sospecha del CEO se confirmó: otros verticales de terceros tenían la misma fuga.

---

## 2. Diagnóstico forense (auditoría real, no estimación)

| # | Superficie | Fuga encontrada |
|---|---|---|
| 1 | `/otzarreta` (hub) | CTA nº3 del hero `WhatsApp Eduardo (+34 619 455 396)` + `wa.me/34619455396` |
| 2 | `/otzarreta` (hub) | Tarjetas de sede: `{venue.phones.join(' · ')}` (4 líneas del recinto) |
| 3 | `/otzarreta` (hub) | Footer: teléfonos de ambas sedes + emails `info@ezkertzaberria.com` |
| 4 | `/otzarreta` (hub) | JSON-LD `telephone: '+34 944 544 476'` (indexable por Google e IA) |
| 5 | `/otzarreta/[slug]` (126 URLs) | CTA con la línea del gerente + provenance con `{landing.phone}` y `{landing.email}` |
| 6 | Clúster JSON-LD | `Restaurant.telephone`, `Service.provider.telephone` y `email` del recinto |
| 7 | Alumbrado monumental (catálogo) | `wa.me/34682141077` en 2 CTAs + `LightingDetailActions` |
| 8 | Chófer VIP | `wa.me/34682141077` + copy `Concierge 24/7 (+34 682 141 077)` |
| 9 | `/reclamar-perfil` | `{vendorData.phone}` del proveedor en claro |
| 10 | Concierge IA | El prompt no prohibía recitar la línea del recinto si el cliente la pedía |

**Causa raíz:** no existía un canal canónico de captación. El `contact-gate` protegía al proveedor
del directorio, pero **nadie protegía el peaje de un recinto colaborador** y el auditor anti-picaresca
solo buscaba `wa.me/${item.phone}`, así que un número hardcodeado pasaba limpio.

---

## 3. Solución implementada (S-Class)

### 3.1 `src/lib/providers/sovereign-lead-gate.ts` (nuevo, puro)
- `SOVEREIGN_DEMAND_CHANNEL` congelado: `Conserjería EAR OS · +34 693 693 048 · /reservar/solista · /contacto`.
- `buildDemandWhatsappUrl({ entityName, intent, detail })`: enlace cualificado (disponibilidad,
  visita técnica, presupuesto, bloqueo de fecha) que deja constancia de la entidad de origen.
- `supplierLineMask()` / `supplierContactState()`: la línea del recinto solo se publica enmascarada
  (`+34 9•• ••• •76`) como señal de verificación, jamás completa.
- `supplierContactWithheldNotice()`: aviso honesto (canal único + entrega en visita técnica).
- `sanitizeSchemaContact()`: saneador **recursivo y puro** del JSON-LD — elimina `telephone`,
  `faxNumber` y `email` en cualquier profundidad e inyecta `contactPoint` soberano en los nodos
  comerciales (`Restaurant`, `EventVenue`, `LocalBusiness`, `Organization`…).
- `schemaIsContactFree()`: guardián de runtime para CI y tests.

### 3.2 Superficies saneadas
- **Hub `/otzarreta`:** tercer CTA → *Solicitar visita técnica* (Conserjería); nota de peaje con la
  línea enmascarada; tarjetas de sede con la centralita + máscara; footer sin teléfonos ni emails del
  recinto; JSON-LD sin `telephone`, con `contactPoint` de EAR OS.
- **126 landings `/otzarreta/[slug]`:** CTA a la centralita, provenance con línea enmascarada, email
  fuera y Schema.org saneado en render.
- **Verticales de terceros:** alumbrado monumental y chófer VIP pasan a `buildDemandWhatsappUrl`.
- **`/reclamar-perfil`:** el teléfono del proveedor se muestra con `maskPhoneForDisplay`.
- **Concierge IA:** la ficha verificada añade *canal único de contratación* y el veto explícito
  «PROHIBIDO facilitar teléfonos o emails del recinto o del proveedor».

### 3.3 Candados de CI
- `scripts/audit_phone_exposure.cjs` ampliado con 3 reglas nuevas: `SUPPLIER_CONTACT_LINK`,
  `SUPPLIER_PHONE_LITERAL`, `SUPPLIER_PHONE_RENDER` (analiza la estructura JSX sin literales de texto,
  normaliza E.164 y descarta placeholders).
- `scripts/verify_lead_gate.ts`: **34 aserciones** (canal único, enlaces, máscara, JSON-LD, superficies
  reales, CI y prompt del Concierge). Dentro de `gate:prepush` como `npm run verify:leadgate`.

---

## 4. Validaciones ejecutadas

| Gate | Resultado |
|---|---|
| `node scripts/audit_phone_exposure.cjs` | **0 violaciones** en **550 archivos** públicos |
| `npx tsx scripts/verify_lead_gate.ts` | **34/34 PASS** |
| `npx tsx scripts/verify_page_context.ts` | **21/21 PASS** (sin regresión W39) |
| `npx tsx scripts/verify_pricing_ssot_unification.ts` | **PASS** |
| `tsc --noEmit` | **Exit 0** |
| `eslint` (archivos tocados) | **0 errores** |
| Render real `next dev` :3007 → `/otzarreta` | **HTTP 200 · 439.137 bytes · 0 líneas del recinto · 18 menciones a la centralita · 2 `ContactPoint` · CTA "Solicitar visita técnica" · sin `WhatsApp Eduardo`** |

---

## 5. Scorecard Ω-DIAMANTE (ruta P0 de dinero)

`tsc` 0 · `eslint` 0 · 0 `any` nuevos · 0 `verified:true` falsos · 0 handlers huérfanos ·
0 precios hardcodeados · 0 TODO/FIXME · 0 secretos expuestos · saneado XSS de etiquetas en URL/DOM ·
`contactPoint` válido sin `telephone` de terceros · copy único del motor SEO intacto ·
provenance SHA-256 intacto (solo cambia el render) · repo < 50 MB con artefactos temporales eliminados ·
idempotencia Stripe y webhooks n8n intactos.

---

## 6. Riesgos y notas

- **SEO:** el `url` y `sameAs` del recinto se conservan (señales de entidad); lo que se elimina es el
  canal de contacto (teléfono y email). Los datos del motor (`otzarreta-dominance-engine`) siguen
  intactos para no romper hashes de provenance ni `audit_otzarreta_landings.cjs`.
- **Proveedor:** la línea se entrega al confirmar la visita técnica (filtro de compromiso mutuo).
- **Commit:** pendiente de autorización del CEO (W38 + W39 + W40).

---

## 7. Siguiente paso recomendado

1. Repetir el barrido con `npm run audit:phone` en cada nueva ficha de recinto/proveedor.
2. Si aparece una página con contacto directo, añadir su entidad a `resolvePageContext()` y usar
   `buildDemandWhatsappUrl` — nunca un `wa.me` literal.

