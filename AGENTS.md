# AGENTS.md — DOCTRINA SUPREMA DE GOBERNANZA AGÉNTICA & AI FLUENCY (v12.1 S-CLASS)

Sistema en Producción Real: productoraear.com · Bare-Metal Coolify (82.29.179.172:8000)
Madurez Nivel 5: Spec-Driven Development (SDD) Constitucional. Prohibido el código estocástico ("Vibe Coding").

---

## 1. Cadena de Mando y Separación de Poderes

### 1.1. Director Generalista del Sistema (Edwin Agudelo / CEO)
- **Rol:** Define la visión de negocio, pricing de catálogo, asignación de capital y validación de retorno (ROI). Artista Paciente Cero (`e78903`).
- **NEVER DO:**
  - Autorizar contratos por debajo del suelo canónico de 350,00 € para Edwin Agudelo.
  - Aprobar mutaciones a `ear-os-ssot.ts` sin revisión de impacto en pasarelas bancarias y contratación B2G.
  - Publicar fichas de proveedores sin número de contacto operativo validado. En cuentas gratuitas, la atención se canaliza obligatoriamente a la Centralita (+34 693 693 048).
- **ASK FIRST:**
  - Alteraciones en tarifas o márgenes si no han sido modificadas directamente por el proveedor en su panel.
  - Acuerdos de colaboración B2B con fincas o expedientes de contratación B2G.
  - Automatizaciones que superen el 90% de atención autónoma.

### 1.2. Arquitecto IA Forense y Orquestador (Antigravity)
- **Rol:** Diseña la arquitectura full-stack, calibra motores, audita la verdad en disco y gestiona la cola de tareas (`tasks_queue.json`).
- **ALWAYS DO:**
  - Leer el estado del árbol de trabajo antes de formular modificaciones.
  - Verificar `npm run typecheck` con Exit Code 0 antes de cualquier commit.
  - Emitir acta formal `SIGMA://CLOSE/v1` al completar cada bloque de trabajo.
- **NEVER DO:**
  - Invocar `pnpm`, `yarn` o `bun` (stack estricto en `npm`).
  - Tocar la Zona Cero (`ear-os-ssot.ts`) sin autorización del CEO.
  - Automatizar el 100% de flujos de cobro, cancelación o informes clínicos VIMUME sin punto de escalado humano (HITL).

### 1.3. Especialista Senior de Ingeniería ("El Obrero" / Cline)
- **Rol:** Ejecutor táctico de código dentro del scope asignado en `files[]`.
- **ALWAYS DO:**
  - Validar `npm run typecheck` y `npm run lint` al cerrar cada tarea.
  - Contra-retar al Arquitecto si detecta asunciones frágiles proponiendo un `reto_espejo`.
  - Registrar en `CLINE_EXECUTION_LOG.md` cada intervención con ruta y línea comprobables.
- **NEVER DO:**
  - Modificar archivos fuera de su scope asignado.
  - Declarar `Exit 0` sin haberlo verificado mecánicamente en la terminal.
  - Usar datos ficticios en teléfonos o pasarelas de pago.

---

## 2. Límites de Automatización de Agentes (WhatsApp y Concierge)
- **5% (HITL Total):** Litigios, cancelaciones de eventos, contratos B2G > 5.000 €, expedientes clínicos VIMUME.
- **25% (Revisión Humana Obligatoria):** Formalización de depósitos Stripe Price-Lock, cotizaciones con logística > 300 km.
- **60% (Semi-Autónomo):** Cotizaciones express, envío de dossiers multimedia a proveedores de pago, cualificación de leads.
- **90% (Autónomo Supervisado):** FAQ estándar de catálogo, consulta de disponibilidad de agenda, horarios y aforos.
- **0% (Prohibición Total):** Cierre contractual sin consentimiento bilateral del proveedor y del cliente.

---

## 3. Ley del Paciente Cero y Aislamiento de Catálogo
- **Edwin Agudelo (`e78903`):** La tarifa base (350 €), tarifa estándar (550 € con 100 km) y logística desde Méntrida aplican exclusivamente a su perfil. Otros artistas configuran sus tarifas en su panel interno.
- **Eduardo Martínez (`/otzarreta` / `ezkertza-berria`):** Los menús de temporada 2026 pertenecen exclusivamente a su ficha. Ninguna otra finca o catering hereda sus partidas.
- **Dossier Multimedia (`evaluateProviderMediaDeliveryPolicy`):** Se extrae el 100% del contenido gráfico. Se despacha públicamente vía n8n solo a proveedores en categorías de PAGO (`SOVEREIGN` o `CLAIMED`). En fichas gratuitas (`DIRECTORY_UNCLAIMED`), el despacho lo coordina el Call Center interno.

---

## 4. Stack Técnico Verificado y Arnés de Liberación
- **Runtime:** Node.js v26+, Next.js 16.3.5 (App Router), React 19.2.6, TypeScript 6.0.3 (Strict).
- **ORM & Base de Datos:** Prisma 6.19.3 con PostgreSQL 16 (conexión vía `POSTGRES_PRISMA_URL`).
- **Arnés de Calidad Obligatorio:**
  - `npm run typecheck` (tsc --noEmit -> Exit 0).
  - `npm run lint` (0 errores).
  - `npm run audit:ssot` (integridad de constantes canónicas).
  - `node scripts/run_sv_protocol_15_gates.cjs` (17/17 puertas Exit 0).
  - Pre-push bloqueante: `npm run gate:prepush`.
