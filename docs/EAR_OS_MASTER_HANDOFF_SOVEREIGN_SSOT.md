# ANTIGRAVITY OMEGA v5.0 — BARE-METAL ABOS & GOVERNANCE PROTOCOL
MODO CEO ACTIVO — ZERO-TOKEN MEMORY (ZTM) — HIGH-SIGNAL EXECUTION
REPOSITORIO SSOT: H:\EAR_OS_V2\EAR_OS_V2\docs\EAR_OS_MASTER_HANDOFF_SOVEREIGN_SSOT.md
ENTORNO MANDATORIO: POWERSHELL 7 NATIVO | LOCAL WORKER (QWEN 32B / RX 7900 XTX) | PUERTO LOCAL: 3007

## 1. DEFINICIÓN DEL SISTEMA (ABOS)
EAR OS no es una web convencional. Es un **Autonomous Business Operating System (ABOS)** y un **Marketplace Vertical B2B/B2G** para la industria del entretenimiento y eventos de alta gama. Alberga un motor de datos RAG monopolístico (Vampire Engine) con +26k perfiles, una pasarela FinTech de liquidación (Stripe) inyectada en tiempo real y automatización de licitaciones (B2G Hunter).

## 2. BIFURCACIÓN DE ROLES
- **ANTIGRAVITY / CLAUDE:** System Orchestrator. Diseña planos, emite tareas cerradas a `.antigravity/tasks_queue.json`. Sin terminal interactiva destructiva.
- **CLINE + QWEN 32B:** Obrero local bare-metal en GPU. Lee cola, ejecuta scripts vampíricos, valida `npx tsc --noEmit` -> Exit Code 0.

## 3. REGLAS DE NEGOCIO INMUTABLES (S-CLASS SSOT)
- **Tarifa Base Solista:** 350,00 € (Edwin Agudelo).
- **Logística S-Class:** 1,50 €/km aplicados desde el Hub Central en Méntrida (Toledo) a partir del km 50. Suplemento hotelero (+120 €) si hora fin >= 3:00 AM o distancia > 200 km.
- **Split Soberano:** 80% Artista / 10% EAR OS / 10% VIMUME.
- **Cierre Transaccional:** Depósito de 100,00 € en Stripe con firma criptográfica Price-Lock SHA-256 (validez 24h a 72h).
- **Presión y Rider Acústico:** 12 W/pax (Sistemas Bose F1 812 / S1 Pro, Microfonía Shure Beta 87A).
- **Límite VIMUME B2G:** < 75 dB SPL en residencias de mayores y centros de día. Techo Art. 118 LCSP acotado estrictamente a < 15.000,00 € (Ajuste preventivo = 14.250,00 €).
- **Teléfono Oficial de Retención:** +34 693 693 048.

## 4. ESTADO VIGENTE DEL SISTEMA (LIVE EN PORT 3007)
- **Zero-Trust Middleware:** Ubicado en `src/middleware.ts` con CSP estricto, HSTS y whitelist para `/api/astra/payment-intent`.
- **EAR Concierge (Cmd+K):** Modal Omni-Bar unificado con Stripe Payment Element embebido condicionalmente sin redirecciones externas.
- **Directorio B2B & Público SOTA:** 
  - Rutas: `/admin/directorio`, `/proveedores` y `/bodas/[provincia]/[servicio]`.
  - Dataset consolidado y purgado: 26.394 proveedores canónicos únicos (cero colisiones, cero duplicados).
  - Erradicación del 100% de fichas sintéticas ("Partner ... en None") y artículos de blog ("Antes de la boda", etc.).
  - Prioridad absoluta para proveedores con teléfono directo verificado.
  - Blindaje Zero-CLS en `BentoProviderCard.tsx` con recuperación reactiva `onError` a Unsplash S-Class.
  - Productora EAR anclada como nodo soberano #1.
- **Motor Vampiro Nocturno (Extracción Continua):**
  - Demonio `night_vampire_scraper.py` activo en background (`task-3598`) con filtros anti-slop, extracción `PHONE_RE` y deduplicación en tiempo real.
- **Omni-Cockpit Modular S-Class:**
  - Ruta: `/admin/omni-cockpit`.
  - Reordenamiento interactivo en caliente con `@dnd-kit/sortable` y persistencia sin pérdidas en `localStorage` (`omni_cockpit_order_ssot`).
  - Serialización pura de IDs de widgets (erradicación de cuelgues por circular JSON de React nodes).
  - 4 Widgets S-Class integrados: Omni Search & Acciones Rápidas, Vampire Engine Telemetry (17.246 nodos, 15.804 teléfonos), Liquidity & Yield (Stripe 100 €, 350 € Solista, split 80/10/10), y VIMUME B2G (< 75 dB SPL, Art. 118 LCSP 14.250 €).
- **Catálogo de Navidad:** `/arsenal/luces-navidad` 100% saneado de enlaces y embeds a Google Drive.
- **Archivo Histórico de Sesiones (Vault ZTM):**
  - Todas las sesiones exportadas en Markdown a `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS\`.
  - Índice maestro consolidado en `docs/EAR_OS_MASTER_CHRONICLE_AND_STATE.md` y `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS\00_EAR_OS_MASTER_CHRONICLE_AND_STATE.md`.
  - Registro de hashes SHA-256 en `scripts/.archived_manifest.json`.

## 5. PROTECCIÓN DE MOTORES CERTIFICADOS
- **PROHIBIDO REESCRIBIR:** `src/lib/vimume/b2g-tender-engine.ts`, `src/lib/astra/astra-conversation-engine.ts` y los scripts del Vampire Engine (`scripts/vampirization/*`). Todo nuevo desarrollo debe importar y extender estas utilidades.

