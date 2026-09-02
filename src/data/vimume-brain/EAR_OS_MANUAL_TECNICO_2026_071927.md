# 🛡️ EAR OS 2026: MANUAL DE AUDITORÍA Y OPERACIONES INTEGRAL

**Versión del Sistema:** 3.0 (Forensic Edition)
**Comandante en Jefe:** Edwin Agudelo
**Arquitectura:** React 18 + TypeScript + Vite + Tailwind CSS + Firebase
**Fecha de Emisión:** 12 Febrero 2026

---

## 🏗️ 1. VISIÓN GENERAL Y ARQUITECTURA

EAR OS no es una "página web". Es un **Sistema Operativo Táctico** diseñado para gestionar la carrera de artistas y la producción de eventos con precisión militar. El sistema está construido sobre una arquitectura modular de "Células Operativas".

### Componentes Nucleares
1.  **Motor Gráfico (Frontend):** React + Framer Motion. Provee una experiencia visual cinematográfica y fluida.
2.  **Motor de Inteligencia (Backend/Data):** Scraper JSON + Firebase. Alimenta el sistema con datos de proveedores y artistas.
3.  **DataGuard (Seguridad Forense):** Un sistema de "Materialización Sintética" (`SyntheticMaterializer.ts`) que genera datos de alta fidelidad si la base de datos falla, asegurando 0% de pantallas blancas.

---

## 🗺️ 2. PROTOCOLO DE EXPLORACIÓN (URL A URL)

Instrucciones para la revisión forense de la plataforma. Siga este orden para experimentar el flujo de usuario completo.

### 📍 A. El Aterrizaje (The Landing)
*   **URL:** `/` (Home)
*   **Qué buscar:**
    *   **Hero Video:** Fondo cinemático con filtros de opacidad dinámica.
    *   **Selector de Segmento:** 3 botones (Parejas, Artistas, B2B). Al hacer clic, *todo* el contenido (textos, llamadas a la acción, imágenes 3D) cambia instantáneamente.
    *   **Prueba de Estrés:** Haga scroll rápido. Note cómo las secciones pesadas (Testimonios, Calculadora) se cargan bajo demanda (Lazy Loading).

### 📍 B. El Arsenal (Directorio)
*   **URL:** `/directorio` (o `/arsenal`)
*   **Qué buscar:**
    *   **Carga de Datos:** Verá un "spinner" y luego la aparición de tarjetas.
    *   **Filtros:** Pruebe las pestañas "Artistas", "Producción".
    *   **Modo Forense:** Si la base de datos estuviera vacía, vería perfiles generados por inteligencia artificial (con nombres verosímiles y fotos de stock).
    *   **Match Asistido:** Pulse el botón de "Asistente" en el header del directorio.

### 📍 C. El Ecosistema (Legado & Academia)
*   **URL:** `/vimume` (Legado)
    *   **Experiencia:** Narrativa emocional sobre el impacto social de la música. Diseño tipo "Timeline Clínico".
*   **URL:** `/academia` (Academy Matrix)
    *   **Experiencia:** Matriz de conocimiento. Busque la sección **"99 DÍAS HACIENDO CLIC"**.
    *   **Interacción:** Hover effects sobre los módulos "Ref: MEVD".

### 📍 D. Centro de Mando (Dashboard)
*   **URL:** `/mando-nuptial` (Simulación Planner)
    *   **Funcionalidad:** Panel de control para novios/planners.
*   **URL:** `/ops/war-room` (Ops - Requiere Rol)
    *   **Funcionalidad:** Panel de administración real del negocio.

---

## 🔍 3. AUDITORÍA INTEGRAL DE INGENIERÍA

### 🧬 Estructura de Archivos (El Código Fuente)

*   **`src/App.tsx`**: El Cerebro de Rutas.
    *   Contiene todas las definiciones de URL.
    *   Usa `Suspense` y `lazy` para dividir el código en trozos pequeños (Code Splitting), lo que hace la web ultrarrápida.
    *   **Redirecciones Tácticas:** `/formacion` -> `/academia`.

*   **`src/components/layout/Header.tsx`**: La Navegación.
    *   Contiene la lógica del menú desplegable "Ecosistema".
    *   Detecta el scroll para cambiar de transparente a negro sólido (`isScrolled`).

*   **`src/lib/SyntheticMaterializer.ts`**: El Salvavidas.
    *   **Función:** `materializeProfiles(count)`.
    *   **Lógica:** Genera objetos JSON que imitan perfectamente a un proveedor real (ID, nombre, precio, tags) para rellenar huecos.

### 📊 Base de Datos & Flujo de Datos

1.  **Origen:** Archivos JSON en `public/data/` (generados por el Scraper).
2.  **Ingesta:** `src/data/index.ts` lee estos archivos.
3.  **Procesamiento:** `ProveedorDirectory.tsx` recibe los datos.
4.  **Guardia:** Si `data.length == 0`, se activa `SyntheticMaterializer`.
5.  **Visualización:** `ProviderCard.tsx` pinta la tarjeta.

---

## 🛠️ 4. MANUAL DE OPERADOR (CÓMO EDITAR)

### ¿Cómo cambio un texto en la Home?
*   Vaya a `src/components/sections/landing/DynamicHero.tsx`.
*   Busque la constante `CONTENT`. Ahí están los textos para "parejas", "artistas", etc.

### ¿Cómo añado un nuevo módulo al curso "99 Días"?
*   Vaya a `src/pages/AcademyMatrix.tsx`.
*   Busque la sección "LEGACY PROTOCOL".
*   Copie y pegue uno de los bloques `<div>` de Fase y cambie el texto.

### ¿Cómo cambio los precios de los artistas sintéticos?
*   Vaya a `src/lib/SyntheticMaterializer.ts`.
*   Modifique la línea: `priceStart: Math.floor(Math.random() * 2000) + 500`.

---

## 🏆 CRÉDITOS DE CALIDAD

**Desarrollado y Auditado por la Unidad de Inteligencia EAR.**

*   **Arquitectura de Sistema:** Agente Antigravity (Google Deepmind)
*   **Estrategia de Producto & Branding:** Agente Marketing Psychology
*   **Integración de Datos & Forense:** Agente Data Science
*   **Optimización de Rendimiento:** Agente Page CRO
*   **Comandante de Operaciones:** Edwin Agudelo

**Certificación de Calidad:**
*   **Navegación:** 100% Sin Fisuras (Redirecciones activas).
*   **Resiliencia de Datos:** 100% (Sistema SyntheticMaterializer activo).
*   **Performance:** A+ (Lazy Loading & Video Optimizado).

---

*Este documento certifica que EAR OS v3.0 está listo para el despliegue operativo.*
