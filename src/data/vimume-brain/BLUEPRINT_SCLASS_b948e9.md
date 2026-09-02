# DOCUMENTO DE COORDENADAS TÁCTICAS (BLUEPRINT) - EAR OS V2

Este documento sirve como la verdad absoluta para la implementación del backend y la lógica de negocio de la plataforma EAR OS V2.

## 1. MAPA DE RUTAS (ROUTER NEXT.JS 14)

Estructura de carpetas bajo `app/` utilizando Route Grouping para separar contextos de negocio:

### (marketing) - Acceso Público
- `(marketing)/page.tsx` -> Home Principal (Lógica de bifurcación) {{DATA:SCREEN:SCREEN_70}}
- `(marketing)/artistas/page.tsx` -> Landing Artistas {{DATA:SCREEN:SCREEN_71}}
- `(marketing)/eventos/page.tsx` -> Landing Eventos 360 {{DATA:SCREEN:SCREEN_45}}
- `(marketing)/arsenal/page.tsx` -> Catálogo de Equipos {{DATA:SCREEN:SCREEN_75}}
- `(marketing)/empresarios/page.tsx` -> Landing B2B {{DATA:SCREEN:SCREEN_215}}
- `(marketing)/social/page.tsx` -> Proyecto VIMUME {{DATA:SCREEN:SCREEN_209}}
- `(marketing)/precios/page.tsx` -> Tabla de Planes {{DATA:SCREEN:SCREEN_120}}
- `(marketing)/journal/page.tsx` -> Blog Editorial

### (auth) - Filtros de Acceso
- `(auth)/the-signal/page.tsx` -> Embudo de Entrada {{DATA:SCREEN:SCREEN_53}}
- `(auth)/login/page.tsx` -> Acceso Soberano {{DATA:SCREEN:SCREEN_133}}
- `(auth)/auditoria/page.tsx` -> Formulario Forense {{DATA:SCREEN:SCREEN_171}}

### (dashboard) - Centro de Control (Protegido por Auth)
- `(dashboard)/portal/page.tsx` -> Dashboard Artista (XP/Timeline) {{DATA:SCREEN:SCREEN_196}}
- `(dashboard)/giras/page.tsx` -> Mapa de Giras (Lógica Uber) {{DATA:SCREEN:SCREEN_40}}
- `(dashboard)/giras/[id]/page.tsx` -> Detalle Show/Waybill {{DATA:SCREEN:SCREEN_129}}
- `(dashboard)/vault/page.tsx` -> Bóveda de Activos {{DATA:SCREEN:SCREEN_200}}
- `(dashboard)/studio/page.tsx` -> Academia Emanager {{DATA:SCREEN:SCREEN_109}}
- `(dashboard)/studio/[lessonId]/page.tsx` -> Visualización Lección {{DATA:SCREEN:SCREEN_220}}

### (admin) - Control Maestro
- `(admin)/control/page.tsx` -> Dashboard NASA Admin {{DATA:SCREEN:SCREEN_152}}
- `(admin)/artistas/page.tsx` -> Auditoría de Talento {{DATA:SCREEN:SCREEN_92}}
- `(admin)/analytics/page.tsx` -> Métricas ROI {{DATA:SCREEN:SCREEN_52}}

## 2. VIAJES LÓGICOS (USER JOURNEYS)

### A) Ayuntamiento B2B (Lógica VIMUME)
1. **Entrada:** Landing Empresarios {{DATA:SCREEN:SCREEN_215}}.
2. **Conversión:** Contratación de Pack Anual via Cotizador {{DATA:SCREEN:SCREEN_51}}.
3. **Activación Letal:** Webhooks detectan `client_type: gov` y desbloquean automáticamente el módulo VIMUME en el Dashboard.
4. **Operación:** Acceso a reportes clínicos y gestión de sesiones en residencias.

### B) Artista Emergente (Lógica Tinder + Ikigai)
1. **Filtro:** Atraviesa "The Signal" {{DATA:SCREEN:SCREEN_96}} respondiendo preguntas forenses.
2. **Onboarding:** Primera sesión de Ikigai {{DATA:SCREEN:SCREEN_93}} para definir el Linchpin.
3. **Gamificación:** Gana XP completando el "Mapa de Batalla" {{DATA:SCREEN:SCREEN_219}}.
4. **Match:** Su perfil es visible en el Marketplace tras validar su "Rider Técnico" {{DATA:SCREEN:SCREEN_16}}.

### C) Wedding Planner (Lógica Airbnb)
1. **Configuración:** Usa el simulador de inversión para "Bodas sin Igual" {{DATA:SCREEN:SCREEN_42}}.
2. **Inventario:** Selecciona activos del "Arsenal" (LED, Sonido) gestionados por EAR.
3. **Reserva:** Generación de Smart Contract y pago via EAR Pay.

## 3. MODELO DE DATOS (ESQUEMA PRISMA/JSON)

```prisma
model User {
  id            String    @id @default(cuid())
  role          Role      @default(EXPLORADOR) // Explorador, Arquitecto, Operador
  xp            Int       @default(0)
  signalStatus  Status    @default(PENDING) // Forensic Check
  vault         Asset[]
  events        Event[]
  vimumeNodes   Vimume[]
}

model Event {
  id            String    @id
  type          String    // Wedding, Corporate, Social
  status        String    // Logistics, Rigging, Soundcheck, Live
  location      String
  geoCoords     Json      // For Uber-style tracking
  budget        Float
  techArsenal   Gear[]
  contractHash  String    // Trust Architecture
}

model Gear {
  id            String    @id
  name          String
  providerId    String    // Lógica Airbnb (Subcontratado)
  status        String    @default("AVAILABLE")
}
```

## 4. ESTADOS Y FALLBACKS (ESTÉTICA OBSIDIAN & GOLD)

- **Estado Global:** Gestionado mediante `Zustand` para el HUD de XP y notificaciones de "The Signal".
- **Degradación Elegante:**
    - Si falla la API de Mapas (Uber Logic): El componente cambia a una vista de "Hoja de Ruta" textual en oro EAR sobre fondo Obsidian.
    - Si falla la carga de Vídeo (Academy): Placeholder con la "Señal" vibrando y mensaje: *"Reconectando infraestructura de conocimiento..."*
    - **Loading State:** Skeleton screens con gradientes de gris a negro y bordes dorados parpadeantes (animación `pulse`).