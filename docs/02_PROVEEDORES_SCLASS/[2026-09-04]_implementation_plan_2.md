# Plan de Restauración Integral del Comportamiento Interactivo y Deslizadores S-Class (99%+)

## Resumen de la Tarea

El usuario ha solicitado de forma expresa e inequívoca:
> *"No queremos solo las herramientas queremos el comportamiento anterior Todo lo que había en Navegación Inteligente Comportamientos Deslizadores lógicas Flujos Características Adaptadas al nuevo mapa mental Pero sobre todo Necesito que recuperes el 99% como mínimo de la herramienta que había antes de esta actualización Estamos limpiando y organizando la estructura no cambiando el comportamiento de lo anterior... Hazme las preguntas necesarias antes de proceder"*

Tras la consulta interactiva previa, hemos alineado los tres pilares de ejecución:
1. **Integración Unificada**: Recuperar y conectar el **MultiPricer S-Class** (estilo Airbnb con catálogo de ocasiones, ensambles, arsenal de pantallas/sonido y multiplicador provincial) junto al **Tinder Matcher de Artistas** y el **Discovery Search predictivo**.
2. **Experiencia Híbrida en la Home**: Conservar los 5 accesos soberanos del mapa mental y desplegar inmediatamente debajo la consola interactiva con deslizadores y filtros.
3. **Flujo Transaccional Automatizado**: Cálculo en tiempo real según aforo/provincia/equipamiento + Congelador de Tarifa SHA-256 (Price-Lock 72h) + depósito de reserva de 100 € con Stripe + generación automática de Dossier.

---

## Hallazgos de la Investigación Forense

1. **MultiPricer S-Class (1.093 líneas):**
   - Localizado en [`MultiPricer.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/personal-y-artista/edwin-agudelo/repertorio-y-ip/MultiPricer.tsx).
   - Depende de módulos específicos que estaban huérfanos o en rutas históricas:
     - Catálogo maestro de precios: [`pricing-catalog.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/personal-y-artista/edwin-agudelo/repertorio-y-ip/pricing-catalog.ts).
     - Motor de cálculo y split 80/10/10: [`pricing-engine.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/personal-y-artista/edwin-agudelo/repertorio-y-ip/pricing-engine.ts).
     - Algoritmo de asignación óptima: [`hungarianAlgorithm.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/empresa/productora-ear-core/hungarianAlgorithm.ts).
     - Filtros ultra-detallados tipo Airbnb: [`filters.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/personal-y-artista/edwin-agudelo/repertorio-y-ip/filters.ts) y [`AirbnbUltraFiltersModal.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/personal-y-artista/edwin-agudelo/repertorio-y-ip/AirbnbUltraFiltersModal.tsx).
     - Badge criptográfico de congelación de tarifa: [`PriceLockBadge.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/empresa/productora-ear-core/PriceLockBadge.tsx).

2. **Tinder Matcher de Formatos Artísticos (551 líneas):**
   - Localizado en [`TinderMatcherClient.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/components/public/TinderMatcherClient.tsx).
   - Contiene la interacción táctil y con deslizador para tarjetas de solistas, mariachis y ensambles, cálculo de aforo (20 a 1.200 pax), outdoor/indoor y llamada a `createEliteCheckout`.

3. **Discovery Search Predictivo:**
   - Localizado en [`DiscoverySearch.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/components/public/DiscoverySearch.tsx).
   - Búsqueda en vivo con autocompletado y deep linking directo a municipios, artistas y servicios técnicos.

4. **Contexto Compartido (`SharedContext`):**
   - Localizado en [`SharedContext.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/context/SharedContext.tsx).
   - Gestiona `isSearchOpen`, `isPricerOpen`, `pricerData` y `role`.

---

## User Review Required

> [!IMPORTANT]
> Se mantendrán intactas las 51 rutas que ya compilan a la perfección (`npm run build`), asegurando que la reactivación del MultiPricer y del Tinder Matcher no introduzca ningún error de compilación ni colisión de nombres.

---

## Cambios Propuestos

### Fase 1: Consolidación de Bibliotecas y Dependencias Canónicas

#### [NEW] [`src/lib/constants/pricing-catalog.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/lib/constants/pricing-catalog.ts)
- Copiar y tipar canónicamente el catálogo de formatos y precios base desde `repertorio-y-ip/pricing-catalog.ts`.

#### [NEW] [`src/lib/pricing-engine.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/lib/pricing-engine.ts)
- Copiar y adaptar `SClassPricingEngine` con regla de 12 W/pax, cálculo por km (1.5 €/km), split 80/10/10 y generación de SHA-256 token.

#### [NEW] [`src/lib/matchmaker/hungarianAlgorithm.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/lib/matchmaker/hungarianAlgorithm.ts)
- Enlazar la implementación de resolución de costes mínimos para emparejamiento de artistas y proveedores.

#### [NEW] [`src/features/finance/types/filters.ts`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/features/finance/types/filters.ts)
- Exportar `SClassUltraFilters`, `DEFAULT_ULTRA_FILTERS` y `calculateFilterSurcharges`.

#### [NEW] [`src/features/finance/ui/PriceLockBadge.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/features/finance/ui/PriceLockBadge.tsx)
- Renderizador visual del sello dorado de Price-Lock 72h.

#### [NEW] [`src/features/finance/ui/AirbnbUltraFiltersModal.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/features/finance/ui/AirbnbUltraFiltersModal.tsx)
- Modal flotante con filtros avanzados (estilo de música, requerimientos de sala, microfonía, exteriores y extras).

---

### Fase 2: Componente Central `MultiPricer` y Rutas de Acceso

#### [NEW] [`src/components/pricing/MultiPricer.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/components/pricing/MultiPricer.tsx)
- Versión canónica y 100% blindada de `MultiPricer.tsx` que reúne:
  - Calculadora de ocasión (Bodas, Fiestas Patronales, Corporativo, Serenatas).
  - Selector de ensambles de gala y solistas (Edwin Agudelo).
  - Arsenal de equipamiento audiovisual (pantallas LED P2.6, monitores 85"-98", fotomatón 360, karaoke, sonido Line Array).
  - Multiplicador de provincia con recargo logístico real.
  - Sidebar interactivo de inversión total, desglose de depósito y checkout Stripe / Dossier.

#### [NEW] [`src/app/(public)/cotizador/page.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/(public)/cotizador/page.tsx)
- Portal a pantalla completa del MultiPricer S-Class para acceso directo y enlaces compartibles.

#### [NEW] [`src/app/(public)/matcher/page.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/(public)/matcher/page.tsx)
- Portal a pantalla completa del Tinder Matcher interactivo con deslizadores de aforo y filtros de formato.

---

### Fase 3: Integración en `RootLayout` y Home Page Híbrida

#### [MODIFY] [`src/app/layout.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/layout.tsx)
- Envolver `children` con `SharedProvider` de `@/app/context/SharedContext`.
- Montar `DiscoverySearch` para que el atajo de búsqueda y los botones de lupa abran el buscador predictivo global.

#### [MODIFY] [`src/app/page.tsx`](file:///H:/EAR_OS_V2/EAR_OS_V2/src/app/page.tsx)
- Integrar la consola interactiva con tabs:
  - **Tab 1: Cotizador & MultiPricer S-Class** (la calculadora completa con ocasiones, sliders de aforo y arsenal).
  - **Tab 2: Tinder Matcher de Artistas** (deslizador táctil interactivo con scoring).
  - **Tab 3: The Oracle & Acústica** (el simulador predictivo ya construido).
- Vincular el buscador predictivo en la barra superior junto al botón de mapa mental y centralita.

---

## Plan de Verificación

### Pruebas Automatizadas
1. **Compilación de Producción:**
   ```bash
   npm run build
   ```
   Debe completar con éxito y generar las rutas `/cotizador`, `/matcher`, etc. sin ningún fallo de tipos ni de módulos.

2. **Auditoría de Códigos HTTP:**
   - Verificar `http://localhost:3007/` -> 200 OK.
   - Verificar `http://localhost:3007/cotizador` -> 200 OK.
   - Verificar `http://localhost:3007/matcher` -> 200 OK.

### Verificación Visual en Navegador Real (Browser Subagent)
1. Navegar a `http://localhost:3007/`.
2. Probar los deslizadores del MultiPricer (cambiar provincia, seleccionar ocasión, añadir pantalla LED o fotomatón 360, ver actualización inmediata del precio).
3. Abrir el modal de filtros ultra-detallados tipo Airbnb y cerrarlo.
4. Cambiar al tab del Tinder Matcher y probar el deslizamiento y filtro de formatos.
5. Probar el buscador Discovery Search introduciendo un término de búsqueda.
