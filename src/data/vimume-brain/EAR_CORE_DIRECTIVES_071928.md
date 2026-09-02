# EAR WEB CORE DIRECTIVES [v1.0]

## CONTEXTO & PROPÓSITO
Este documento define la arquitectura lógica, funcional y de diseño para el ecosistema web Productora EAR (integra UNIO, ASTRA, VIMUME).
**Prioridad Absoluta:** Conversión, Velocidad, Autoridad Forense.
**Stack:** Next.js, Firebase, Tailwind (EAR Design System), Stripe.

---

### 🟢 DIRECTIVA 01: CAPTACIÓN Y ENRUTAMIENTO NEURAL
**Objetivo:** Clasificación inmediata del tráfico según intención de compra o rol.
**Orden de Máquina:**
1.  **Implementar "The Great Divide" (Hero Section):**
    *   Dividir el viewport inicial. Izquierda: "Necesito un Evento" (B2C/B2B). Derecha: "Soy Artista/Talento" (ASTRA).
    *   *UX:* Sin carruseles. Texto estático de alto impacto.
2.  **Selector de Rol Activo:**
    *   Al primer clic, asignar `user_intent` en sesión: [Novios | Planner | Venue | Corporativo | Artista].
    *   *Acción:* Renderizar dinámicamente el contenido subsiguiente basado exclusivamente en este tag.
3.  **Ruta Crítica (Neural Path):**
    *   Eliminar navegación superflua. El menú principal debe mutar según el rol detectado.
    *   *KPI:* Máximo 3 clics desde Landing hasta "Ver Disponibilidad" o "Booking".

### 🟢 DIRECTIVA 02: CONVERSIÓN DE ALTA VELOCIDAD (FLASH BOOKING)
**Objetivo:** Cerrar reservas, depósitos o auditorías en una sola sesión (< 5 min).
**Orden de Máquina:**
1.  **Motores de Pago Ubicuos:**
    *   Integrar Stripe Elements/Checkout en *cada* ficha de producto/servicio.
    *   Habilitar Apple Pay / Google Pay por defecto para reducir fricción en móvil.
2.  **Lógica de "Compromiso Mínimo":**
    *   Para servicios High-Ticket (>1k€): Habilitar "Bloqueo de Fecha" por tarifa plana (ej. 50€/100€) reembolsable o descontable.
    *   Para Auditorías/Formación: Checkout directo en 1 paso.
3.  **Prevención de Abandono:**
    *   Si `scroll_depth` > 50% y `intent` = exit: Disparar modal "Guardar Presupuesto" (captura de lead).

### 🟢 DIRECTIVA 03: AUTORIDAD FORENSE (TRUST ARCHITECTURE)
**Objetivo:** Validar la competencia técnica y artística en < 60 segundos.
**Orden de Máquina:**
1.  **Prueba Social "Anti-Fake":**
    *   Mostrar widgets de *Reseñas Verificadas* (Google/Bodas.net) con API en tiempo real. No texto estático.
    *   Incluir metadatos en testimonios: [Fecha del evento | Lugar | Tipo de servicio].
2.  **Visualización de Datos Forenses:**
    *   Para B2B/Corporativo: Mostrar gráficas de "Uptime técnico", "SLA de respuesta" y "Eventos ejecutados sin incidencias".
    *   Para Novios: Mostrar "Timeline de tranquilidad" (pasos visuales desde contrato hasta evento).
3.  **Contratos Transparentes:**
    *   Enlace visible en footer y checkout a "Garantía de Satisfacción" y modelos de contrato.

### 🟢 DIRECTIVA 04: ORQUESTACIÓN DE RECURRENTES (COMMAND CENTER)
**Objetivo:** Fidelización mediante utilidad operativa. El login es un espacio de trabajo, no un perfil.
**Orden de Máquina:**
1.  **Dashboard Polimórfico (RBAC):**
    *   Al hacer Login, detectar `role`.
    *   **Novios:** Ver "Cuenta atrás", "Pagos pendientes", "Checklist musical".
    *   **Artistas (ASTRA):** Ver "Próximos bolos", "Liquidaciones", "Analítica de perfil".
    *   **Venues:** Ver "Calendario de ocupación EAR", "Comisiones generadas".
2.  **Centro de Notificaciones Inteligente:**
    *   Alertas de acción requerida (ej. "Firma contrato", "Sube repertorio") en la cabecera.
    *   Estado de semáforo (Rojo/Ámbar/Verde) para la salud del evento.

### 🟢 DIRECTIVA 05: APRENDIZAJE Y TELEMETRÍA (FEEDBACK LOOP)
**Objetivo:** Optimización automática basada en datos de comportamiento real.
**Orden de Máquina:**
1.  **Instrumentación de Eventos:**
    *   Taguear automáticamente: `click_cta`, `time_on_page`, `drop_off_point`.
    *   Enviar a: PostHog / Mixpanel (o capa de analítica interna en Firebase).
2.  **Heatmaps Tácticos:**
    *   Identificar "zonas muertas" en el layout cada 14 días.
3.  **A/B Testing Nativo:**
    *   Estructurar componentes críticos (Hero, Pricing Tables) para aceptar variantes de copy/diseño desde configuración remota (Remote Config) sin redeploy.

---

## 🛠️ GUÍA DE ESTILO & UX (TOKEN OPTIMIZED)
*   **Diseño:** Glassmorphism 3.0 + Midnight Luxury (Dark Mode por defecto).
*   **Tipografía:** Playfair Display (Títulos/Emoción) + Montserrat/Inter (Datos/Forenses).
*   **Paleta:**
    *   `ear-black` (#040404) - Fondo.
    *   `ear-gold` (#D4AF37) - Éxito/Premium.
    *   `ear-blue` (#89cff0) - Confianza/Datos.
    *   `ear-alert` (#FFD166) - Urgencia/CTA.
*   **Interacciones:** Micro-animaciones solo en feedback de usuario (hover, click, success). Transiciones de página < 0.3s.

## 🚀 PROTOCOLO DE EJECUCIÓN PARA AGENTES
1.  **Leer** este archivo antes de modificar componentes `src/`.
2.  **Validar** cada PR contra las 5 directivas. Si una feature añade fricción, se descarta.
3.  **Priorizar** la reutilización de componentes modulares (Atomic Design).
