# BODAS.NET — DIGITAL TWIN SPECIFICATION
## PRD Forense Completo · Versión 1.0 · Proyecto UNIO

---

## 1. RESUMEN EJECUTIVO
Bodas.net es el marketplace líder en España para la organización de bodas. 
El **Proyecto UNIO** busca replicar su arquitectura funcional completa (Gemelo Digital), mejorándola con:
- **UX Premium**: Micro-interacciones, modo oscuro/claro dinámico y transiciones fluidas.
- **Rendimiento "Zero-Gravity"**: LCP < 1.0s, TTI instantáneo.
- **Arquitectura EAR**: Integración con el motor de matching y telemetría de Productora EAR.

---

## 2. ARQUITECTURA DE INFORMACIÓN (IA)

### 2.1 Navegación Principal
1.  **Directorio B2C**: /directorio (Fincas, Fotógrafos, Música, etc.)
2.  **Herramientas Parejas**: /herramientas (Checklist, Invitados, Mesas)
3.  **Editorial**: /articulos (Blog de inspiración)
4.  **Comunidad**: /comunidad (Foros y grupos)

### 2.2 Estructura de URLs
- `/directorio/{categoria}`
- `/directorio/{categoria}/{provincia}`
- `/perfil/{slug}--e{id}`
- `/articulos/{slug}`

---

## 🚀 Estado de la Implementación (v1.0 - Zero-Gravity)

La Fase 1 del Proyecto UNIO ya está operativa en el núcleo de EAR OS:

1.  **Directorio Táctico (`/unio/directorio`)**: Marketplace de alta fidelidad con filtrado avanzado y motor de sugerencias "Neural Match".
2.  **Gestión Financiera (`/unio/presupuesto`)**: Simulador de presupuestos con IA predictiva y análisis de desviaciones en tiempo real.
3.  **Infraestructura de Rendimiento**: Carga diferida (Lazy Loading), optimización de LCP mediante Overlay Strategy y deferencia de animaciones pesadas.

---

## 3. MÓDULOS DEL GEMELO DIGITAL

### 3.1 Motor de Búsqueda y Filtrado (High-End)
Replicación del sistema de búsqueda dual con:
- **Filtros Dinámicos**: Adaptativos según categoría (ej. Nº de invitados para Fincas vs. Estilo para Fotógrafos).
- **Vista de Mapa Real-Time**: Integración con Leaflet/Mapbox para geolocalización.
- **Ranking Predictivo**: Ordenación por relevancia, reviews y "Sello EAR".

### 3.2 Perfil de Proveedor "Showroom"
- **Galería Inmersiva**: Carruseles interactivos y soporte para Tours 360°.
- **Social Proof**: Sistema de reviews con fotos reales de bodas.
- **Conversión Directa**: Chat en tiempo real y solicitud de presupuesto inteligente.

### 3.3 Dashboard de Herramientas (SaaS)
- **Checklist Operativo**: 104 tareas pre-configuradas.
- **Gestor de Mesas 2D**: Drag & drop para distribución de invitados.
- **Presupuestador**: Control de pagos y alertas de vencimiento.

---

## 4. IMPLEMENTACIÓN TÉCNICA (STACK)
- **Frontend**: React + Vite + Framer Motion.
- **UI System**: Tailwind CSS + Custom Design Tokens (EAR Gold/Purple).
- **Backend/Data**: Firebase Firestore + Cloud Functions.
- **Optimización**: Deferring de librerías, Responsive Images (WebP), Tree Shaking.

---

## 5. MOMENTOS "WOW" (Diferenciadores)
- **The Neural Match**: IA que sugiere proveedores basados en el perfil psicológico de la pareja.
- **Budget Simulation**: Visualización 3D del impacto del presupuesto en el evento.
- **Seamless Transition**: Navegación sin recargas entre el directorio y las herramientas de gestión.
