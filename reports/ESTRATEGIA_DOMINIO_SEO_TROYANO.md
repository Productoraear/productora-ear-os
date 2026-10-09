# 🐴 VEREDICTO ESTRATÉGICO — CABALLO DE TROYA SEO & ARQUITECTURA DE DOMINIOS
> Fecha: 2026-10-03 · Decisión sellada por Antigravity con evidencia forense del PC (no opinión).
> Fuentes: `reports/gsc_trojan_horse_forensics.md`, `reports/bodas_net_intel_brief.md`, inventario en disco, `scripts/absorb_bodasnet_providers.cjs`.

---

## 1. LA DECISIÓN DE DOMINIOS: UNIFICAR, NO DISPERSAR

**Veredicto definitivo: UN DOMINIO DE AUTORIDAD (`productoraear.com`) + CLÚSTERES VERTICALES EN SUBCARPETAS + 301 DE SATÉLITES.**

| Dominio | Destino final |
|---|---|
| `productoraear.com` | **Cuartel general de autoridad** (dominio único vivo, todo el crawl budget y link equity aquí). |
| `fincasparaboda.com` | `301 → /fincas` (o dominio espejo 301 si ya posee backlinks reales). |
| `artistaseuropa.com` | `301 → /artistas` (vertical Europa). |
| `viajemusicalporlamemoria.com` | `301 → /vimume` (obra social / clínica, misma entidad legal, comparte autoridad sin diluir marca). |

**Por qué NO dispersar (la clave del posicionamiento):**
1. **Crawl budget único.** Varios dominios raíz compiten entre sí ante Google: dividen el presupuesto de rastreo, la autoridad de enlaces y el PageRank se reparte. Un solo dominio lo concentra todo.
2. **Link equity no se reparte.** Los backlinks que lleguen a 4 dominios valen 0,25x cada uno; en 1 dominio valen 1x.
3. **Cero canibalización.** `fincasparaboda.com` y `productoraear.com/fincas` atacando la misma keyword pelean entre sí y ambos pierden posiciones.
4. **Coste de mantenimiento 4x menor.** Un solo build, un solo SSOT, un solo `ssotIntegrityGuard`.
5. **Subcarpetas > subdominios.** `/fincas`, `/artistas`, `/vimume` heredan la autoridad del raíz; `fincas.productoraear.com` sería tratado como sitio nuevo sin autoridad.

**Única excepción táctica:** si `viajemusicalporlamemoria.com` tuviera que operar como entidad jurídica/fiscal separada con certificados clínicos propios, entonces se mantiene como dominio vivo pero **solo** alimentado por `/vimume` como origen canónico (nunca contenido duplicado). En el estado actual no hay razón para separarlo.

---

## 2. EL DIAGNÓSTICO QUE CAMBIA TODO (LA VERDAD, NO LA EXPECTATIVA)

**El caballo de troya de "miles de URL" ya se ejecutó — y Google lo penalizó.** El forense de Search Console lo demuestra:

| Incidencia | URLs | Significado |
|---|---|---|
| Página con redirección | **1.331** | Doorways `DOORWAY_BODAS_3L` (1.150) redirigiendo en bucle → Google las entierra. |
| Duplicada sin canónica | **1.124** | Contenido repetido sin autor canónico → no indexa. |
| Página con canónica correcta | 1.074 | Doorways que apuntan a otra → no posicionan. |
| `noindex` | **1.054** | Páginas excluidas a propósito → no compiten. |
| Bloqueadas 4xx | **746** | Puertas rotas → derroche de crawl. |
| Bloqueadas robots.txt | 25 | Media proxy de bodas.net expuesto. |
| `api/media?url=https://cdn0.bodas.net/...` | 70+ | **Hotlinking del CDN de bodas.net** — delata el troyano y diluye rastreo. |

**Conclusión: más URL NO es la respuesta. La respuesta es URL con entidad real verificada y contenido único.** Hoy el sistema produce fachadas (doorway) que Google ignora. El troyano correcto es **responder la intención mejor que bodas.net**, no superarles en volumen de spam.

---

## 3. EL CABALLO DE TROYA CORRECTO (ENTIDAD-FIRST, NO DOORWAY-FIRST)

Los **2.150 HTML** en `vault/proveedores_html_indexados` son materia prima cruda extraída de bodas.net. Su uso correcto es **extracción de entidades → registro canónico → landing transaccional con valor diferencial**, no pegar el HTML.

**Qué ofrece bodas.net que NO empataremos: volumen de catálogo.**
**Qué ofrecerá EAR OS que bodas.net NO tiene (la grieta letal):**
1. **Precio real y cerrado (SSOT):** solista 350 €, logística 1,50 €/km >50 km, depósito 100 € Stripe Price-Lock. bodas.net solo da "desde 1.200 €".
2. **Teléfono real verificable** para cerrar por WhatsApp directo (no formulario ciego). `+34 693 693 048` como centralita válida, pero **solo con `verified:true` si hay teléfono real del proveedor**.
3. **Capa transaccional:** depósito 100 € en 1 clic (`atomicDateLockEngine`) — la pareja puede BLOQUEAR la fecha, no solo "pedir presupuesto".
4. **Rider acústico legal** (Ley 37/2003) y **split soberano 80/10/10** con SROI 4.85x — contenido único que jamás tendrá un escaparate genérico.

Esas 4 capas son el contenido sustancial que convierte a cada URL en un activo indexable (E-E-A-T), no en doorway.

---

## 4. PLAN TÁCTICO SECUENCIADO (ONDAS — sin saltarse pasos)

### 🛑 ONDA 0 — SELLAR LA HEMORRAGIA (antes de escalar)
1. **Corregir `verified:true` fraudulento** en `scripts/absorb_bodasnet_providers.cjs`: centralita/vacío ⇒ `verified:false`; solo teléfono real ⇒ `verified:true`. Sin esto, todo el marketplace es fachada y Google lo huele.
2. **Auto-hospedar imágenes**: eliminar `api/media` como proxy de `cdn0.bodas.net` (7 hotlinking delatado + rastreo diluido). Descargar y servir desde `public/media/providers/`.
3. **Matar doorways** `DOORWAY_BODAS_3L` y `DOORWAY_SERVICIOS`: los 1.331 redireccionados + 1.124 duplicados se consolidan en una sola URL canónica por entidad.
4. **Limpiar 404s y noindex huérfanos**: las URLs sin entidad real detrás se eliminan del sitemap (no se "indexan a la fuerza").

### 🧬 ONDA 1 — REGISTRO DE ENTIDADES VERIFICADAS
5. Pasar de `src/data/all_providers_database.json` (92.539 registros crudos) y `bodas-vendors-harvested.json` (46.477) a **un solo registro canónico curado** (objetivo 500–1.000 por gremio, 0 placeholders, teléfono real).
6. Regenerar `providers_canonical.json` con la doctrina purista: `< 1 MB`, solo `verified:true` real, sin marcas de terceros (bodas.net despersonalizado como "fuente B2B").

### 🎯 ONDA 2 — LANDINGS TRANSACCIONALES (programático, NO doorway)
7. Plantilla única de landing que combine `entidad real` × `provincia/municipio` × `intención` con:
   - Datos estructurados JSON-LD (`LocalBusiness`, `Offer`, `AggregateRating`).
   - Contenido generado con datos reales del proveedor (descripción, servicios, geografía), jamás texto duplicado.
   - CTA real de reserva (depósito 100 €) disparando a `/webhook/stripe-price-lock` y `/webhook/b2b-quote`.
8. Reutilizar la matriz de intención de 23k (`build_sitemap_23k_intent_matrix.cjs`) pero **el filtro es la entidad real**: solo se genera URL si hay proveedor verificado detrás. Sin entidad ⇒ sin URL.

### 🔗 ONDA 3 — CLÚSTER + AUTORIDAD
9. Arquitectura de clústeres: `hub` (página de provincia/categoría) → `spoke` (landing de entidad) con breadcrumbs e interlinking semántico.
10. Un solo `sitemap.xml` por dominio, particiones < 1 MB, 0 placeholders.

### 📈 ONDA 4 — TELEMETRÍA Y CIERRE
11. Medir `€ verificado` (no impresiones): consulta → reserva con depósito 100 € → split 80/10/10 liquidado. Ese es el único KPI de dominancia.
12. Disparar `executive-kpi-radar` a n8n diariamente.

---

## 5. MÉTRICA DE VICTORIA (CERO FACHADAS)

- [ ] 0 placeholders: `git grep -c "verified: true"` solo coincide con teléfonos reales.
- [ ] 0 doorways: GSC deja de reportar `DOORWAY_*` y redirecciones.
- [ ] Cada URL del sitemap resuelve a un `LocalBusiness` real con `Offer` y CTA de depósito funcionando.
- [ ] `npx tsc --noEmit` = Exit Code 0 en cada onda.
- [ ] Primer **1 € verificado** trazable: depósito 100 € → webhook n8n → split 80/10/10.

**Regla soberana:** la dominancia se mide en **reservas con depósito cerrado**, no en número de URLs. URL sin entidad verificada es una fachada más que alimenta la penalización, no la victoria.