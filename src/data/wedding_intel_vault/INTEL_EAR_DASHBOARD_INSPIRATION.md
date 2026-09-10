# EAR DASHBOARD INSPIRATION 🎨
**Referencias visuales y funcionales para la Suite Operativa EAR**

Este documento detalla la traducción de conceptos de marketplaces líderes (Airbnb, Uber, Bodas.net, Spotify) al ecosistema de Productora EAR.

---

## 1. Vista Operativa: "The Marketplace" (Uber/Airbnb)
**Objetivo:** Gestión de oferta/demanda en tiempo real.
**Rol:** Ops / Admin.
**Ubicación:** `/dashboard` (Command Center) -> Tabs: `OVERVIEW`, `WEDDINGS`, `CORPORATE`.

| Concepto Uber/Airbnb | Traducción a EAR | Implementación |
| :--- | :--- | :--- |
| **Mapa de Flota** | **Live Assets Map:** Mapa en tiempo real de artistas y equipos. Estado: `IDLE`, `EN_ROUTE`, `ON_STAGE`. | Tab `CORPORATE` / `VISIÓN GENERAL`. Uso de marcadores de estado. |
| **Estado de Reserva** | **Booking Life-cycle:** `LEAD` -> `PROPUESTA` -> `CONFIRMADO` (Depósito) -> `EJECUCIÓN` -> `CERRADO`. | Tab `WEDDINGS` (Funnel) y Listas de Proyectos. |
| **Dispatch / Asignación** | **War Room Dispatch:** Asignación rápida de "Rider Técnico" o "Artista" a un "Venue". | Botones de acción rápida en `WarRoom` y `Emanager`. |
| **Ratings / Calidad** | **Signal Quality:** Puntuación de fiabilidad del activo basada en historial de bolos. | KPI `SIGNAL QUALITY` en cabecera. |

---

## 2. Vista Nupcial: "The Planner" (Bodas.net Premium)
**Objetivo:** Claridad absoluta para la pareja. "Saber qué falta".
**Rol:** Couple.
**Ubicación:** `/mi-boda` (Mando Nupcial).

| Concepto Bodas.net | Traducción a EAR (Sovereign Edition) | Implementación |
| :--- | :--- | :--- |
| **Checklist** | **Neural Journey Roadmap:** Lista de hitos (Venue, Música, Ceremonia) con fechas límite inteligentes. | Módulo `EARChecklist` con estados `PENDIENTE`, `EN CURSO`, `COMPLETADO`. |
| **Budget Calculator** | **Ingeniería de Presupuesto:** Simulador financiero con desglose de partidas técnicas vs artísticas. | Módulo `EARBudgetSimulator` (ya existente). |
| **Team / Proveedores** | **Escuadrón Táctico:** Lista de proveedores como "Aliados Estratégicos". Contacto directo (WhatsApp/Email). | Sección "Mis Proveedores" estilo tarjeta de contacto VIP. |
| **Cuenta Atrás** | **Cronómetro de Despliegue:** Días, horas, minutos para el "Gran Despliegue". | Header principal con cuenta atrás dramática. |

---

## 3. Vista Talento: "The Label" (Spotify for Artists)
**Objetivo:** Crecimiento de carrera y transparencia de ingresos.
**Rol:** Artist / Talent.
**Ubicación:** `/aliados/dashboard` (Artist Dashboard).

| Concepto Spotify | Traducción a EAR (ASTRA HUB) | Implementación |
| :--- | :--- | :--- |
| **Audience Stats** | **Impacto de Audiencia:** Nº de bodas, invitados totales impactados, reviews 5 estrellas. | Tarjetas KPI grandes en `ArtistDashboard`. |
| **Catalog / Releases** | **Repertorio Activo:** Lista de setlists/shows validados por ASTRA. | Tab `ESCAPARATE` o `REPERTORIO`. |
| **Next Big Thing** | **Academy / XP:** Gamificación del progreso profesional. Subir de nivel desbloquea mejores tarifas. | Integración del **Centro de Formación Táctica** en el dashboard de artista. |
| **Income / Merch** | **Facturación / Cachés:** Desglose claro de bolos pagados, pendientes y proyección anual. | Tab `FACTURACIÓN` con gráficas simples. |

---

## 4. Reglas de Diseño EAR (Sovereign Style)
1.  **Alta Densidad, Alta Claridad:** Mucha información, pero jerarquizada por tipografía (Font Display vs Mono).
2.  **Negro Obsidian + Oro EAR:** Fondo oscuro predominante (`#050505`), acentos en oro (`#D4AF37`) y blanco puro para textos.
3.  **Scanlines & Glitch:** Detalles sutiles que recuerden que es un sistema operativo (OS), no una web estática.
4.  **Terminología Militar/Corporativa:** "Despliegue" en lugar de "Boda", "Activo" en lugar de "Cantante", "Inteligencia" en lugar de "Datos".

---
**ESTADO DE IMPLEMENTACIÓN:**
- [x] Documentación (Este archivo).
- [ ] Refactor `/dashboard` (Command Center) -> Uber/Marketplace logic.
- [ ] Refactor `/mi-boda` (Couple) -> Bodas.net Premium logic.
- [ ] Refactor `/aliados/dashboard` (Artist) -> Spotify Label logic.
