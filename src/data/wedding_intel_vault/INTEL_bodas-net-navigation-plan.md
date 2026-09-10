# Plan de Implementación: Sistema de Navegación Bodas.net → UNIO

## 🎯 Objetivo
Clonar al 90% el sistema de navegación de Bodas.net, aplicando sus mejores prácticas probadas para crear una UX premium de nivel top.

---

## 📊 Análisis de Bodas.net

### 1. **Estructura de URLs**
```
Homepage:           https://www.bodas.net
Categoría:          https://www.bodas.net/fotografos
                    https://www.bodas.net/banquetes  
Proveedor:          https://www.bodas.net/fotografos/nombre-empresa--e12345
Con filtros:        https://www.bodas.net/fotografos?provincia=madrid
```

**Patrones identificados:**
- URLs limpias y SEO-friendly
- Categorías en plural (fotografos, banquetes)
- IDs de proveedor con prefijo `e` + número
- Filtros via query params

### 2. **Sistema de Navegación Principal**

**Categorías principales** (observadas):
1. Banquetes / Espacios
2. Fotógrafos
3. Música
4. Flores
5. Vestidos / Moda
6. Coches
7. Belleza
8. Animación
9. Vídeo
10. Catering

**Navegación secundaria:**
- Por provincia/localización
- Por precio
- Por valoración
- Por disponibilidad

### 3. **Página de Resultados (Listado de Proveedores)**

**Elementos clave:**
- **Header sticky** con:
  - Contador de resultados ("9.960 resultados")
  - Barra de búsqueda persistente
  - Filtros rápidos (ubicación, precio, fecha)
  
- **Sidebar de filtros:**
  - Ubicación (provincias, ciudades)
  - Rango de precio
  - Valoración mínima
  - Servicios específicos
  - Disponibilidad

- **Grid de proveedores:**
  - Cards con imagen principal
  - Nombre del proveedor
  - Ubicación
  - Precio orientativo
  - Valoración (estrellas + número de opiniones)
  - Badge "Destacado" para premium
  - CTA "Solicitar información"

- **Paginación:**
  - Scroll infinito O paginación clásica
  - "Cargar más" button

### 4. **Página de Detalle de Proveedor**

**Estructura:**
1. **Hero Section:**
   - Galería de imágenes (slider principal)
   - Nombre del proveedor
   - Ubicación
   - Valoración destacada
   - CTA principal: "Solicitar presupuesto"

2. **Información principal:**
   - Descripción del servicio
   - Servicios incluidos
   - Rango de precios
   - Zona de cobertura

3. **Galería completa:**
   - Grid de fotos
   - Bodas reales
   - Lightbox para ampliar

4. **Opiniones:**
   - Listado de reseñas
   - Filtros por valoración
   - Respuestas del proveedor

5. **Información de contacto:**
   - Formulario de contacto
   - Teléfono
   - Email
   - Redes sociales

6. **Proveedores similares:**
   - Carrusel de recomendaciones

---

## 🚀 Plan de Implementación para UNIO

### **FASE 1: Arquitectura de URLs** ✅ CRÍTICO

**Objetivo:** URLs limpias y SEO-friendly como Bodas.net

**Cambios necesarios:**

1. **Estructura actual:**
   ```
   /search?category=Fotografía
   ```

2. **Nueva estructura (Bodas.net style):**
   ```
   /fotografos
   /banquetes
   /musica
   /flores
   /moda
   /coches
   /belleza
   /animacion
   ```

**Implementación:**
- Crear rutas dinámicas: `app/[category]/page.tsx`
- Mapeo de slugs a categorías Firestore
- Redirecciones desde URLs antiguas

---

### **FASE 2: Página de Resultados Premium** ✅ CRÍTICO

**Componentes a crear:**

1. **`ResultsHeader.tsx`**
   - Contador de resultados
   - Breadcrumbs
   - Opciones de ordenamiento

2. **`FilterSidebar.tsx`**
   - Filtro por ubicación
   - Filtro por precio
   - Filtro por valoración
   - Filtro por servicios

3. **`ProviderGrid.tsx`**
   - Grid responsive (3 cols desktop, 2 tablet, 1 mobile)
   - Cards optimizadas

4. **`ProviderCard.tsx` (MEJORADO)**
   - Imagen con aspect ratio 4:3
   - Badge "Destacado" si premium
   - Valoración prominente
   - Precio visible
   - CTA claro "Solicitar info"
   - Hover effects premium

5. **`LoadMoreButton.tsx`**
   - Paginación infinita
   - Loading states

**Layout:**
```
┌─────────────────────────────────────────┐
│  Header (sticky)                        │
├─────────────┬───────────────────────────┤
│             │  ResultsHeader            │
│  Filters    │  ┌─────┬─────┬─────┐     │
│  Sidebar    │  │ Card│ Card│ Card│     │
│             │  └─────┴─────┴─────┘     │
│  - Location │  ┌─────┬─────┬─────┐     │
│  - Price    │  │ Card│ Card│ Card│     │
│  - Rating   │  └─────┴─────┴─────┘     │
│  - Services │                           │
│             │  [Load More]              │
└─────────────┴───────────────────────────┘
```

---

### **FASE 3: Sistema de Filtros Avanzado** ✅ CRÍTICO

**Filtros a implementar:**

1. **Ubicación:**
   - Dropdown de provincias
   - Autocompletado de ciudades
   - Filtro por radio (km)

2. **Precio:**
   - Slider de rango
   - Inputs manuales min/max
   - Presets (económico, medio, premium)

3. **Valoración:**
   - Estrellas clicables (mínimo)
   - Solo con opiniones

4. **Disponibilidad:**
   - Selector de fecha de boda
   - Solo disponibles

5. **Servicios específicos:**
   - Checkboxes por categoría
   - Ej: Fotógrafos → "Álbum incluido", "Vídeo", "Drone"

**Estado de filtros:**
- URL params para compartir búsquedas
- LocalStorage para persistencia
- Reset filters button

---

### **FASE 4: Optimización de Queries Firestore** ✅ CRÍTICO

**Problema actual:**
- Queries lentas
- Sin índices compuestos
- Filtrado client-side

**Solución:**

1. **Índices compuestos en Firestore:**
   ```
   collection: providers
   fields: [category, location, pricing.min]
   ```

2. **Query optimization:**
   ```typescript
   // Antes (MAL)
   query(collection(db, 'providers'))
   
   // Después (BIEN)
   query(
     collection(db, 'providers'),
     where('category', '==', category),
     where('location', '==', location),
     where('pricing.min', '>=', minPrice),
     where('pricing.min', '<=', maxPrice),
     orderBy('rating', 'desc'),
     limit(20)
   )
   ```

3. **Caching:**
   - React Query para cache de resultados
   - Stale-while-revalidate strategy

---

### **FASE 5: Mejoras en Provider Card** ✅ ALTA PRIORIDAD

**Diseño Bodas.net:**
```
┌─────────────────────┐
│                     │
│    [IMAGEN]         │
│                     │
├─────────────────────┤
│ 🏷️ DESTACADO        │
│                     │
│ Nombre Proveedor    │
│ 📍 Madrid           │
│ ⭐ 4.8 (127)        │
│ 💰 Desde 1.200€     │
│                     │
│ [Solicitar Info]    │
└─────────────────────┘
```

**Implementación:**
- Lazy loading de imágenes
- Skeleton loaders
- Animaciones sutiles
- Favoritos (corazón)

---

### **FASE 6: Breadcrumbs y Navegación Contextual**

**Ejemplo:**
```
Inicio > Fotógrafos > Madrid > Fotógrafos de boda en Madrid
```

**Beneficios:**
- SEO
- UX (saber dónde estás)
- Navegación rápida

---

## 📋 Checklist de Implementación

### Sprint 1: Fundamentos (CRÍTICO)
- [ ] Crear rutas dinámicas `/[category]/page.tsx`
- [ ] Mapeo de categorías a slugs URL-friendly
- [ ] Actualizar `useProviders` hook con filtros avanzados
- [ ] Crear índices compuestos en Firestore

### Sprint 2: UI Components
- [ ] `ResultsHeader` component
- [ ] `FilterSidebar` component  
- [ ] `ProviderGrid` component
- [ ] Mejorar `ProviderCard` component
- [ ] `LoadMoreButton` component
- [ ] `Breadcrumbs` component

### Sprint 3: Filtros
- [ ] Filtro de ubicación
- [ ] Filtro de precio (slider)
- [ ] Filtro de valoración
- [ ] Filtro de disponibilidad
- [ ] URL params para filtros
- [ ] Reset filters functionality

### Sprint 4: Optimización
- [ ] Implementar React Query
- [ ] Lazy loading de imágenes
- [ ] Skeleton loaders
- [ ] Infinite scroll
- [ ] Performance optimization

### Sprint 5: Detalles Premium
- [ ] Animaciones y transiciones
- [ ] Hover effects
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

---

## 🎨 Diseño Visual (Bodas.net Style)

**Paleta de colores:**
- Primary: Similar a Bodas.net (#E91E63 - Rosa/Magenta)
- Secondary: Dorado para destacados
- Neutral: Grises para texto y fondos

**Tipografía:**
- Headers: Serif (elegante)
- Body: Sans-serif (legible)

**Espaciado:**
- Generoso padding en cards
- Whitespace para respirar
- Grid gaps consistentes

---

## 🔥 Prioridades INMEDIATAS

### 1. **Arreglar navegación por categorías** (HOY)
   - Crear `/fotografos`, `/banquetes`, etc.
   - Query correcta a Firestore
   - Mostrar resultados filtrados

### 2. **Mejorar ProviderCard** (HOY)
   - Diseño Bodas.net
   - Información completa
   - CTAs claros

### 3. **Implementar filtros básicos** (MAÑANA)
   - Ubicación
   - Precio
   - Valoración

### 4. **Optimizar queries** (ESTA SEMANA)
   - Índices Firestore
   - React Query
   - Performance

---

## 📊 Métricas de Éxito

**Antes (actual):**
- ❌ Navegación rota
- ❌ Mismos proveedores siempre
- ❌ Sin filtros funcionales
- ❌ UX confusa

**Después (objetivo):**
- ✅ Navegación fluida como Bodas.net
- ✅ Filtrado preciso por categoría
- ✅ Filtros avanzados funcionales
- ✅ UX premium nivel top

---

## 🚨 NOTAS CRÍTICAS

1. **URLs son FUNDAMENTALES:**
   - `/fotografos` NO `/search?category=Fotografía`
   - SEO + UX + Compartibilidad

2. **Firestore queries DEBEN ser eficientes:**
   - Índices compuestos
   - No filtrar client-side
   - Paginación real

3. **UI debe ser IDÉNTICA a Bodas.net:**
   - Mismo layout
   - Mismos componentes
   - Misma jerarquía visual

4. **Mobile-first:**
   - Bodas.net funciona perfecto en móvil
   - Nosotros también debemos

---

**Última actualización:** 28 de noviembre de 2025, 09:15 AM
**Estado:** PLAN APROBADO - LISTO PARA IMPLEMENTACIÓN
