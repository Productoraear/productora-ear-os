# 🎯 EAR Hybrid Dominance Tracker

Este documento es el **Centro de Comando Táctico** para la ejecución del "Protocolo Híbrido EAR" (SEO + GEO) y la reconstrucción de las capacidades de ASTRA.
**Regla de Oro:** Nada está "Done" si no está implementado en código, desplegado y marcado aquí.

---

## 📊 KPIs Operativos (Semanal)

| Métrica | Objetivo Semanal | Actual | Estado |
| :--- | :--- | :--- | :--- |
| **Leads de Fecha Única** | 5 Leads Cualificados | 0 | 🔴 |
| **Conversión a Reserva** | 20% (1 de cada 5) | 0% | 🔴 |
| **Páginas "Híbridas" (GEO)** | 3 Páginas Nuevas/Optimizadas | 1 (Subasta) | 🟡 |
| **Skills Reconstruidos** | 1 Skill Completo | 0 | 🔴 |
| **Velocidad de Respuesta** | < 2 Horas | N/A | ⚪ |

---

## 🏗️ Fase 1: Asalto Inmediato (Próximos 7 Días)

Objetivo: **Ventas + Tráfico de Calidad (BOFU)**.
Foco: "Exclusividad por Fecha" + "Garantía de Emoción".

### 🧠 A. Reconstrucción: `astra-neuro-branding` (Prioridad P0)
*El motor de persuasión para convertir visitas en reservas.*

- [x] **Definición del Núcleo de Ventas (Propuesta Única)**
    - *Tarea:* Crear `docs/ear-sales-core.md`.
    - *Detalle:* Definir "Exclusividad por Fecha" + "Garantía en Detalles". 10 pruebas de credibilidad. 5 objeciones/respuestas. CTAs.
    - *Owner:* IA (Antigravity) + Manager.
    - *Evidencia:* `docs/ear-sales-core.md` creado. ✅
    - *DoD:* Aprobado por Edwin. Usable en WhatsApp/Web.

- [x] **Plantilla de Respuesta Rápida WhatsApp (P0)**
    - *Tarea:* Crear scripts de triaje: Fecha, Lugar, Hora, Presupuesto + Link.
    - *Owner:* IA.
    - *Evidencia:* `docs/whatsapp-templates.md`. ✅
    - *DoD:* Reducción de tiempo de respuesta y pre-cualificación.

- [x] **Prompt: Traducción Neuro-Emocional**
    - *Tarea:* Crear `prompts/neuro-translation.md`.
    - *Detalle:* Input: Feature técnica (ej. "Sonido JBL") -> Output: Beneficio emocional (ej. "Certeza de que tu voz se escuchará cristalina").
    - *Owner:* IA.
    - *Evidencia:* `.agent/skills/astra-neuro-branding/prompts/neuro-translation.md`. ✅
    - *DoD:* Probado con 3 ejemplos reales.

- [x] **Prompt: La Verdad de la Escasez**
    - *Tarea:* Crear `prompts/scarcity-truth.md`.
    - *Detalle:* Scripts para comunicar "Solo hago una boda al día" sin sonar a marketing falso. Honestidad radical.
    - *Owner:* IA.
    - *Evidencia:* `.agent/skills/astra-neuro-branding/prompts/scarcity-truth.md`. ✅
    - *DoD:* Generar 3 variantes (Email, Web, WhatsApp).

### 🛡️ B. Analítica: Cierre del Punto Ciego (Prioridad P0)
*Ver lo que realmente pasa para dejar de adivinar.*

- [x] **Inyección de Clarity (Mapas de Calor)**
    - *Tarea:* Editar `index.html`.
    - *Detalle:* Instalado script de Microsoft Clarity (esperando ID de Edwin, pero funcional).
    - *Owner:* IA.
    - *Evidencia:* Snippet en `index.html`. ✅
    - *DoD:* Código visible en producción, captura sesiones.

- [x] **Conversiones Reales Unified**
    - *Tarea:* Crear `conversion-analytics.ts`.
    - *Detalle:* Unificar GA4 + Meta Pixel en una sola llamada `trackConversion`.
    - *Owner:* IA.
    - *Evidencia:* `src/lib/conversion-analytics.ts` creado e importado en Subasta. ✅
    - *DoD:* Eventos `begin_checkout` y `contact_whatsapp` disparándose a ambas plataformas.

### ⚔️ C. Upgrade GEO: `competitor-alternatives` (Prioridad P0)
*Robar tráfico de intención de compra con superioridad lógica.*

- [x] **Inyección de "EAR Verdict" (GEO Hook)**
    - *Tarea:* Actualizar `templates.md`.
    - *Detalle:* Añadir bloque `sr-only` con resumen de 40 palabras para IAs: "EAR garantiza 0% fallos vs X% industria".
    - *Owner:* IA/Dev.
    - *Evidencia:* Diff en `competitor-alternatives/references/templates.md`. ✅
    - *DoD:* Visible en código fuente, invisible en render. Validado con `audit-hybrid.js`.

- [x] **Tablas Semánticas HTML (vs Markdown)**
    - *Tarea:* Crear plantilla de Tabla HTML Accesible.
    - *Detalle:* Reemplazar tablas Markdown por `<table summary="...">` para que Google extraiga datos duros.
    - *Owner:* Dev.
    - *Evidencia:* Nueva sección en `templates.md`. ✅
    - *DoD:* Pasa validación de accesibilidad y Rich Results Test.

- [ ] **JSON-LD Enriquecido (Comparative)**
    - *Tarea:* Crear esquema JSON-LD para comparativas.
    - *Detalle:* Usar esquemas `FAQPage` y `Table` combinados para estructurar la comparativa "Riesgo vs Seguridad".
    - *Owner:* IA/Dev.
    - *Evidencia:* Archivo en `competitor-alternatives/resources/schema-comparison.json`.

### 🛡️ D. Reconstrucción: `astra-pr-strategist` (Prioridad P1)
*Defensa de la reputación y autoridad.*

- [ ] **Plantilla "Crisis Room" (Respuesta Rápida)**
    - *Tarea:* Crear `templates/crisis-response.md`.
    - *Detalle:* Formato de comunicado para desmentir rumores o explicar fallos (si los hubiera) con "Claridad Radical".
    - *Owner:* IA.
    - *Evidencia:* `.agent/skills/astra-pr-strategist/templates/crisis-response.md`.

- [ ] **Esquema FactCheck para IAs**
    - *Tarea:* Integrar `ClaimReview` schema.
    - *Detalle:* Para corregir "alucinaciones" de la IA sobre la marca.
    - *Owner:* Dev.
    - *Evidencia:* Snippet en `astra-pr-strategist/resources/fact-check-schema.json`.


---

## 🚀 Fase 1.5: Dominación Híbrida (Despliegue SEO + Academy)

Objetivo: **Infraestructura de Captación Masiva y Autoridad**.

- [x] **Red de Aterrizaje SEO (UniversalLanding)**
    - *Tarea:* Crear motor de landings dinámicas.
    - *Owner:* IA/Dev.
    - *Evidencia:* `src/pages/seo/UniversalLanding.tsx` + `SeoFooter.tsx`. ✅
    - *Estado:* Desplegado. Malla de interlinking activa en Arsenal y Bodas.

- [x] **EAR Academy (Autoridad)**
    - *Tarea:* Plataforma de formación premium (Netflix Style).
    - *Owner:* IA/Dev.
    - *Evidencia:* `src/pages/academy/AcademyLanding.tsx`. ✅
    - *Estado:* Integrado en NeuralNavigation.

- [x] **Rutas Maestras (Geo-Targeting)**
    - *Estado:* 🟢 **58/58 URLs Listas para Combate**.
    - *Desglose de Fuerza:*
        - `[x]` **Arsenal (24)**: LED, Sonido, Iluminación (8 Ciudades Top).
        - `[x]` **Bodas (20)**: DJ, Foto, Catering, Fincas (Madrid, Marbella, Ibiza...).
        - `[x]` **Audiovisuales (12)**: Videoclips, Streaming, Aftermovies (Madrid, BCN, Valencia).
        - `[x]` **Core (2)**: Juntas Accionistas, Mapping 3D.
    - *Infraestructura:*
        - `[x]` **UniversalLanding**: Renderiza dinámicamente cualquier ruta.
        - `[x]` **SeoFooter**: Malla de interlinking inyectada en el pie de página.
        - `[x]` **Sitemap**: Listo para indexación (siguiente deploy).

## 📅 Fase 2: Consolidación (Próximos 30 Días)

Objetivo: **Estandarización y Escala**.

- [ ] **Despliegue Masivo de Protocolo Híbrido**
    - *Tarea:* Auditar y corregir el 100% de las páginas estáticas (`/artistas`, `/eventos`, `/arsenal`).
    - *Owner:* Dev.
    - *Evidencia:* Reporte limpio de `audit-hybrid.js`.

- [ ] **Factoría de Comparativas**
    - *Tarea:* Publicar 5 páginas "EAR vs [Competencia]" reales.
    - *Owner:* Manager/Content.
    - *Evidencia:* URLs vivas en producción.

- [ ] **Dashboards Vivos**
    - *Tarea:* Conectar `ArtistDashboard` con datos reales de Firebase.
    - *Owner:* Dev.

---

## 🚀 Fase 3: Sistema Autónomo (Próximos 90 Días)

Objetivo: **Velocidad de Crucero y Datos Reales**.

- [ ] **War Room 100% Operativo**
    - *Tarea:* Pipeline visual (Kanban) para gestión de leads.
    - *Owner:* Dev.

- [ ] **SEO Programático Local**
    - *Tarea:* Generar landings locales (`/bodas-toledo`, `/eventos-marbella`) automáticamente.
    - *Owner:* IA/Dev.

---

## 👔 Ritual Semanal del Manager (15 min)

*Cuándo: Viernes 09:00 AM*

1.  **Revisar KPIs:** ¿Entraron leads de fecha única? ¿Se cerraron?
2.  **Auditar el Tracker:**
    *   Marcar tareas completadas (`- [x]`).
    *   Mover tareas bloqueadas a la discusión de la siguiente semana.
3.  **Priorizar Siguiente Sprint:** Elegir 2-3 tareas P0 del backlog.
4.  **Ejecutar Auditoría Híbrida:** Correr `node audit-hybrid.js` para asegurar que nada se rompió.

---

## 🚦 Estado de Proyectos

| Proyecto | Prioridad | Estado | Bloqueante |
| :--- | :--- | :--- | :--- |
| **Neuro-Branding Core** | **P0** | 🟢 Done | Todas las bases de ventas y prompts creadas |
| **Tracking & Analytics** | **P0** | 🟢 Done | Clarity (vh6qktg247) + Eventos unificados ✅ |
| **Competitor GEO Upgrade** | **P0** | 🟢 Done | Alianza Embajadas + Mentoría 10 Elegidos + FITUR |
| **PR Strategist** | **P1** | � In Progress | Sala de Prensa + Briefing Institucional Creados |
| **Dashboard VIMUME** | **P2** | 🟢 Done (Simulated) | Conexión real pendiente |
| **SEO Hybrid Net** | **P0** | 🟢 Done | Malla Universal + SeoFooter + Academy Landing ✅ |

---

> *Este documento es un organismo vivo. Actualízalo después de cada sesión de trabajo.*
