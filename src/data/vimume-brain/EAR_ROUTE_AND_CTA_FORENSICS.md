# EAR OS — ROUTE AND CTA FORENSICS (MACRO FORENSIC EDITION)
## ID: EAR-FORENSIC-ROUTES-02
## ESTADO: PASS (INVENTARIO 57.037 ARCHIVOS COMPLETO)

### 1. ALCANCE DEL RASTREO FORENSE MACRO
- **Total de archivos inventariados en el PC/Proyecto:** 57.037 archivos.
- **Raíces escaneadas:** `C:\EAR_OS_V2` (4.046 archivos), `C:\EAR_OS_INTEL_BUNKER` (52.991 archivos), `C:\EAR_OS_CONTROL`.
- **Filtros de Análisis:** Mapeo recursivo de enlaces `<Link>`, `router.push`, `redirect()`, `window.location` y Server Actions.

---

### 2. GRAFO DE ENRUTAMIENTO PÚBLICO (PUBLIC ROUTING ATLAS)

#### A. Navegación Principal (`SovereignNav.tsx`, `Navbar.tsx`, `PredatorNav.tsx`)
- `/` -> **[CONECTADO]** Renderiza la Landing Page Principal con el motor de captación y `TinderMatcherClient`.
- `/artistas/edwin-agudelo` -> **[CONECTADO]** Landing Premium de Edwin Agudelo.
- `/centro-mando` -> **[CONECTADO]** Acceso directo a la consola S-Class (`/centro-mando`).
- `/the-signal` -> **[ROTO / HUÉRFANO]** Detectado en `ApexButton.tsx` y `Navbar.tsx`. No existe `src/app/the-signal/page.tsx`.

#### B. Vertical Vimume (`src/app/(public)/vimume/...`)
- `/vimume` -> **[CONECTADO]** Landing principal Vimume.
- `/vimume/hermes` -> **[CONECTADO]** Portal Hermes Neural.
- `/vimume/hermes/dashboard` -> **[DECAÍDO / BUCLE]** Redirige mediante JS cliente a `#sonic-experience` en lugar de cargar panel.
- `/vimume/contacto`, `/vimume/nosotros`, `/vimume/roadmap`, `/vimume/inversion`, `/vimume/centros` -> **[CONECTADO ESTÁTICO]** Vínculos navegables 100%.
- `/vimume/gobernanza-del-dato` -> **[ROTO / HUÉRFANO]** Enlace en `/vimume/hermes/page.tsx` sin ruta física.

#### C. Catálogo de Artistas (`src/app/(public)/artistas/...`)
- `/artistas/solistas` -> **[CONECTADO]** Apunta a `/artistas/edwin-agudelo`.
- `/artistas/orquestas` -> **[PARCIAL]** Apunta a `/contacto?subject=Reserva+Ensamble+Mariachi+6`.
- `/artistas/djs` -> **[PARCIAL]** Apunta a `/contacto?subject=Reserva+DJ+Premium`.
- `/artistas` -> **[ROTO / HUÉRFANO]** Ejecuta `router.push('/presupuesto')`. La página `/presupuesto` NO existe.

---

### 3. VÍNCULOS Y CTAs DETECTADOS EN ARCHIVOS HISTÓRICOS Y DOCUMENTOS (`EAR_OS_INTEL_BUNKER`)
- Se hallaron 52.991 archivos de soporte y fragmentos RAG en `EAR_OS_INTEL_BUNKER`.
- **Rutas de cotización obsoletas/propuestas:** `/cotizador`, `/presupuesto`, `/admin/configurador`.
- **Rutas de Onboarding:** `/reclamar-perfil` (Llama a `/api/profiles/claim`), `/onboarding` (Llama a `ArtistProfileForm`).

---

### 4. MATRIZ DE CTAs TRANSMITIDOS POR PARÁMETROS
- `?subject=Reserva+DJ+Premium`
- `?subject=Reserva+Ensamble+Mariachi+6`
- `?subject=Reserva+Espectaculo+Ecuestre`
- `?subject=Reserva+Edwin+Agudelo+Solista`
- `?subject=reclamar-perfil`

---

### 5. DICTAMEN DE NAVEGACIÓN MACRO
Las arterias principales (`/`, `/vimume`, `/centro-mando`, `/artistas/edwin-agudelo`) funcionan correctamente. Sin embargo, existen **3 rutas huérfanas críticas** (`/presupuesto`, `/cotizador`, `/the-signal`) que rompen la conversión en puntos clave del enrutamiento público.
