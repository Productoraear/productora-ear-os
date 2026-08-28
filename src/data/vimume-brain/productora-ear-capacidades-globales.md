# Productora EAR: Capacidades Globales y Arquitectura del Ecosistema

**Versión del Documento:** 1.0  
**Fecha de Actualización:** 14 de Febrero de 2026  
**Autor:** Antigravity (Arquitecto de EAR OS)

---

## 1. Visión General del Ecosistema

### ¿Qué es Productora EAR?
Productora EAR es mucho más que una agencia de eventos; es un **Sistema Operativo de Entretenimiento (EAR OS)** diseñado para eliminar la incertidumbre en el mercado de bodas y eventos de lujo. Fusiona la producción técnica de alto nivel ("Ingeniería con 0% de Fallos") con una capa de **Neuro-Branding** y **Tecnología Financiera** (Riesgo Inverso).

Actúa como un *Firewall* entre el caos del sector (músicos informales, equipos fallidos) y la paz mental del cliente.

### Problemas que Resuelve

#### 🧑‍🤝‍🧑 Para el Usuario Final (Parejas / Corporativo)
*   **Eliminación del "Miedo al Fallo":** Garantiza contractualmente y auditado forensemente que el evento saldrá perfecto.
*   **Simplificación Radical:** Convierte la contratación de una orquesta sinfónica o un montaje de festival en un proceso tan simple como pedir un Uber (`Checkout` simplificado).
*   **Transparencia Total:** Acceso a dashboards (`/mi-boda`) donde ven auditorías reales de sus proveedores, no solo fotos bonitas.

#### 🕴️ Para el Manager (Edwin / Ops)
*   **Triaje Automático:** Filtra a los "turistas" de los clientes serios mediante barreras de pago (`Stripe`) y verficación de identidad (`SecurityGate`).
*   **Centralización de Comandos:** Un "War Room" digital que permite ver en una sola pantalla el estado de salud de todos los eventos, artistas y finanzas.
*   **Escalabilidad Sin Caos:** Permite gestionar 50 eventos simultáneos con la misma carga mental que gestionar 5, gracias a la automatización de contratos y logística.

### Diagrama Textual del Ecosistema

```mermaid
graph TD
    User[Usuario Final] -->|Descubrimiento| Landing[Web Pública / SEO Híbrido]
    Landing -->|Neuro-Cualificación| Gate[Security Gate / Login]
    
    Gate -->|B2C: Parejas| DashboardB2C[Mi Boda Dashboard]
    Gate -->|B2B: Empresas| DashboardB2B[Empresarios Dashboard]
    
    DashboardB2C -->|Selección| Marketplace[Directorio de Artistas]
    DashboardB2B -->|Licitación| Auction[Subasta / Licitación]
    
    Marketplace -->|Reserva| Checkout[Stripe Payment]
    Auction -->|Blindaje| Stripe[Stripe Depósito]
    
    Checkout -->|Sync| WarRoom[WAR ROOM (Edwin)]
    Stripe -->|Sync| WarRoom
    
    WarRoom -->|Asignación| TechRider[Validación Técnica]
    WarRoom -->|Logística| Proveedor[App Artistas / Aliados]
    
    Proveedor -->|Ejecución| Evento[Evento Real]
    Evento -->|Feedback| Auditoria[Auditoría Forense]
    Auditoria -->|Loop| Landing
```

---

## 2. Capacidades Globales Actuales

| Capacidad | Descripción | Usuario Impactado | Ubicación en Código (Clave) |
| :--- | :--- | :--- | :--- |
| **Identidad & Seguridad (EAR Gate)** | Login social (Google/Apple/Email), detección de bots, verificación de roles. Bloqueo de intrusos. | Todos | `src/components/auth/SecurityGuard`, `src/pages/auth/LoginPortal`, `src/contexts/AuthContext` |
| **Directorio Inteligente (The Signal)** | Catálogo de artistas y servicios con filtrado avanzado, "puntuación de fiabilidad" y demos multimedia. | Usuario / Manager | `src/pages/Directorio`, `src/components/directory/*`, `src/services/newsService.ts` (Intel) |
| **Blindaje Financiero (Fintech)** | Pasarela de pagos, gestión de depósitos, subastas en tiempo real y cálculo de "Riesgo Inverso". | Usuario / Manager | `src/pages/Checkout`, `src/pages/SanValentinAuction`, `src/services/contractingService.ts` |
| **War Room (Ops Center)** | Dashboard central para el equipo EAR. Monitoriza leads (`leadService`), estado de servidores y alertas de seguridad. | Manager (Ops) | `src/pages/ops/WarRoom.tsx`, `src/components/dashboard/ControlCenterDashboard.tsx` |
| **Gestión de Leads (Intelligence)** | Captura, cualificación y notificación multicanal (Telegram, WhatsApp) de nuevas oportunidades. | Manager | `src/services/leadService.ts`, `src/services/notificationService.ts` |
| **Auditoría Forense** | Módulo público/privado para visualizar la trazabilidad y calidad técnica de un evento pasado. | Usuario / B2B | `src/pages/ForensicAudit`, `src/components/marketing/AutopsyViewer.tsx` |

---

## 3. Fusión con Herramientas Externas

La plataforma no vive aislada; orquesta un conjunto de herramientas externas para potenciar sus capacidades.

### 🧠 Inteligencia Artificial (Antigravity + Gemini)
*   **Input:** Código fuente, logs de eventos, estructura de datos.
*   **Output:** Auditoría de código (`hybrid-protocol`), generación de copy persuasivo (`astra-neuro-branding`), análisis de competencia (`competitor-alternatives`).
*   **Ventaja:** Permite que un equipo de 1 persona opere como una agencia de 20. Auditoría constante 24/7.

### 💳 Stripe (Infraestructura Financiera)
*   **Integración:** Profunda. No es solo un botón de pago; crea sesiones de `Checkout` dinámicas basadas en algoritmos de precios variables (subastas).
*   **Ventaja:** Valida la "seriedad" del cliente instantáneamente. Elimina el cobro manual y la persecución de facturas.

### 🔥 Firebase (Backend Serverless)
*   **Roles:** Base de datos en tiempo real (Firestore), Autenticación robusta y Hosting global.
*   **Ventaja:** Latencia cercana a cero. Escalabilidad infinita sin gestionar servidores.

### 📊 Meta & Analytics (Telemetría de Mercado)
*   **Uso:** Tracking de eventos complejos (`InitiateCheckout`, `Lead`, `Purchase`) para reentrenar los algoritmos de anuncios de Instagram/Facebook.
*   **Ventaja:** Menor coste por adquisición (CPA) al alimentar a la IA de Meta con datos de "calidad" (gente que paga), no solo clicks.

---

## 4. Uso en el Día a Día: Casos de Uso

### Escenario A: La Pareja "Ansiosa" (B2C)
1.  **Descubrimiento:** Ana y Luis llegan a `productoraear.com` buscando "música boda madrid".
2.  **Impacto Neuro:** Ven la "Garantía de Emoción" y la tabla comparativa (EAR vs Otros) generada por el Protocolo Híbrido. Su cerebro racional se calma ("0% Riesgo").
3.  **Acción:** Intentan ver precios. El sistema activa `SecurityGuard`: "Para ver la excelencia, identifícate".
4.  **Conversión:** Se loguean con Google. Acceden al `Directorio`. Les gusta un grupo de Jazz.
5.  **Cierre:** Hacen clic en "Blindar Fecha". Se abre `Checkout` de Stripe por el 30%. Pagan.
6.  **Resultado:** Reciben acceso inmediato a su `MyWeddingDashboard` y contratos automáticos. Ana duerme tranquila.

### Escenario B: El Comandante en el "War Room" (Manager)
1.  **Alerta:** Edwin recibe un ping en Telegram: "Nuevo Lead Blindado: Ana & Luis - 1500€".
2.  **Análisis:** Abre `WarRoom`. Ve el lead en el tablero.
3.  **Ejecución:** Usa el módulo `AstraWarRoom` para "Invocar Tech Rider". La IA le confirma que el equipo de sonido en la finca de Ana es insuficiente.
4.  **Acción:** Edwin añade un "Pack Refuerzo Sonido" al perfil de Ana desde `admin/AdminArsenal`.
5.  **Resultado:** El problema técnico se resuelve meses antes de que ocurra.

---

## 5. Capacidades de Decisión para el Manager

Para que Edwin tome decisiones tipo "Francotirador", el sistema debe presentar:

### Métricas Críticas (KPIs)
*   **Índice de Salud de Cartera:** ¿Cuánto dinero hay "en juego" (depósitos cobrados vs pendiente)?
*   **Tasa de Estrés del Sistema:** ¿Cuántos eventos coinciden el mismo día vs capacidad técnica disponible?
*   **Velocidad del Lead:** Tiempo medio desde el registro hasta el pago del depósito.

### Presentación (Dashboard Futuro)
*   **Semáforos de Riesgo:** Rojo/Verde en cada evento próximo.
*   **Puntuación de Artista:** 0-100 basada en puntualidad, feedback y "vibe" (medido por VIMUME/Feedback).

---

## 6. Lista de Oportunidades de Mejora

### 🚀 Capacidades Faltantes (High Priority)
1.  **Pipeline Visual (Kanban):** El `ControlCenterDashboard` es muy "Matrix" (datos crudos). Falta un CRM visual de arrastrar y soltar (Nuevo -> Contactado -> Negociación -> Cerrado).
2.  **Generador de Contratos PDF:** Actualmente el contrato es digital/email. Se necesita generar un PDF legal firmado digitalmente al instante del pago.
3.  **Agenda Unificada:** Una vista de Calendario Maestra que cruce Artistas, Eventos y Disponibilidad de Equipo Técnico.

### 🤖 Integraciones IA Potenciales
1.  **Agente de Triaje WhatsApp:** Un bot (vía CallMeBot o API oficial) que responda preguntas básicas de disponibilidad y precios 24/7, escalando a Edwin solo lo complejo.
2.  **Pricing Dinámico:** Algoritmo que suba el precio de los artistas un 10-20% en fechas "calientes" (detectadas por volumen de tráfico web) automáticamente.

### ⚡ Automatizaciones de Ahorro de Tiempo
1.  **Tech Rider Auto-Validator:** Si la finca es "Finca X" y el artista es "Banda Y", el sistema avisa automáticamente: "Faltan 2 monitores". (Cruzando base de datos de fincas con riders de artistas).
2.  **Facturación Automática:** Conexión Stripe -> Software Contable (o generación de factura simple) para no hacer papeleo manual.
