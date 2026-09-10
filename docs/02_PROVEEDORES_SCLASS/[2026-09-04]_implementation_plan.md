# Plan de Implementación: Absorción 100% de la Red Territorial de Cobertura de España (52 Provincias & Nodos Municipales)

El usuario ha solicitado absorber la totalidad de la red territorial española en el footer y en el ecosistema (`"AQUI SOLO HAY UNAS CUANTAS PODRIAS ABORBER EL RESTO?"`), ya que actualmente solo se mostraban 24 ciudades/provincias arbitrarias y la matriz `PROVINCIAS_52_GRAPH` únicamente contenía 7 provincias.

---

## Revisión del Usuario Requerida

> [!IMPORTANT]
> **Alcance Territorial Soberano**: Se absorberán las **50 provincias oficiales de España + las 2 ciudades autónomas (Ceuta y Melilla) = 52 entidades territoriales**, agrupadas bajo sus **17 Comunidades Autónomas** con distancias kilométricas reales calculadas desde el Hub Central en Méntrida (Toledo, Km 0).

---

## Cambios Propuestos

### 1. Núcleo Semántico y Grafo SEO pSEO

#### [src/lib/constants/seo-data-hydrated.ts](file:///h:/EAR_OS_V2/EAR_OS_V2/src/lib/constants/seo-data-hydrated.ts)
- Hidratar las 52 provincias/ciudades autónomas en `PROVINCIAS_52_GRAPH` (actualmente solo tiene 7).
- Cada entidad contendrá:
  - `slug`, `name`, `capital`, `region` (`CENTRO` | `SUR` | `ESTE` | `NORTE` | `INSULAR`).
  - Distancia real desde Méntrida (`distanceFromHubKm`).
  - Tarifa base de transporte calculada (`deliveryCostBase` = 1,50 €/km a partir de km 50).
  - Contador de fincas y espacios homologados (`featuredVenuesCount`).
  - Palabras clave locales y entidades semánticas (`mariachi`, `sonido`, `brasas`, `ayuntamientos`).
  - Especificaciones logísticas: SLA de sonido, 12 W/pax inmutable y tipo de garantía.

### 2. Dataset Municipal Nacional

#### [src/lib/constants/spanish-municipalities.ts](file:///h:/EAR_OS_V2/EAR_OS_V2/src/lib/constants/spanish-municipalities.ts)
- Ampliar `MUNICIPALITIES_DATASET` (que antes solo tenía `madrid` y `toledo`) para mapear los 257 municipios existentes en `spanish-municipalities.ts` a sus 52 provincias correspondientes, permitiendo que las rutas `/bodas/[provincia]/[servicio]` y `/bodas/[provincia]/[servicio]/[municipio]` resuelvan municipios reales para toda España.

### 3. Footer Universal S-Class

#### [src/app/components/layout/SovereignFooter.tsx](file:///h:/EAR_OS_V2/EAR_OS_V2/src/app/components/layout/SovereignFooter.tsx)
- Transformar la sección *"Red Territorial de Cobertura"* en una **Matriz Territorial S-Class**:
  - **Selector por Comunidades Autónomas** (Andalucía, Madrid, Cataluña, Comunidad Valenciana, Castilla-La Mancha, Castilla y León, Galicia, País Vasco, Canarias, Baleares, Aragón, Asturias, Cantabria, Extremadura, Murcia, Navarra, La Rioja, Ceuta y Melilla).
  - Visualización completa de las 52 provincias con enlaces crawlables tanto a la sede provincial (`/bodas/[provincia]`) como a producción de eventos (`/bodas/[provincia]/eventos`).
  - Filtro o buscador dinámico de provincias y municipios para clientes en frío.
  - Indicador de autoridad logística: *"Hub Central de Operaciones: Méntrida (Toledo) · Despliegue Nacional 12 W/pax · Plan B Redundante"*.
  - Totalmente responsive con acordeón / tabs para dispositivos móviles sin saturar el scroll.

---

## Plan de Verificación

### Pruebas Automatizadas
- `npx tsc --noEmit` para garantizar cero errores de TypeScript (Exit Code 0).
- Verificación de renderizado de las 52 rutas en el servidor local.

### Verificación Manual con Navegador
- Navegar con el subagente de navegador a la home (`http://localhost:3007/`) y al pie de página (`http://localhost:3007/academia#campus-lms`).
- Validar que las 52 provincias estén accesibles, conmutables por Comunidad Autónoma y que los enlaces apunten a rutas funcionales.
