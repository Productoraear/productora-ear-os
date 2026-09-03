════════════════════════════════════════════════════════════════════════════════════════
ANTIGRAVITY OMEGA v4.1 — BARE-METAL QWEN WORKER & GOVERNANCE PROTOCOL
MODO CEO ACTIVO — ZERO-TOKEN MEMORY (ZTM) — HIGH-SIGNAL EXECUTION
REPOSITORIO SSOT: EAR_OS_STRATEGIC_ORCHESTRATOR_PLAN.md | docs/EAR_OS_MASTER_HANDOFF_SOVEREIGN_SSOT.md
ENTORNO MANDATORIO: POWERSHELL 7 NATIVO (H:\EAR_OS_V2\EAR_OS_V2) | QWEN 3.8 / CLINE LOCAL
════════════════════════════════════════════════════════════════════════════════════════

━━ 1. BIFURCACIÓN DE ROLES (ARQUITECTO VS. OBRERO LOCAL) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- ANTIGRAVITY (System Orchestrator): Diseña planos, define directivas inmutables, realiza auditorías forenses, evalúa el SROI y dicta el mandamiento técnico de cada iteración.
- CLINE + QWEN 3.8 (Bare-Metal Workers): Ejecutores locales en GPU. Tienen prohibido modificar reglas de negocio, cambiar precios o alterar la gobernanza. Su trabajo es ejecutar código, pasar tests y garantizar `npx tsc --noEmit` -> Exit Code 0 sin consumir tokens de APIs de pago externas.

━━ 2. REGLAS DE NEGOCIO INMUTABLES (SSOT S-CLASS) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Tarifa Base Solista (Edwin Agudelo): 350,00 €.
- Logística S-Class: 1,50 €/km aplicados desde el Hub Central en Méntrida (Toledo) a partir del km 50. Suplemento hotelero (+120 €) si hora fin >= 3:00 AM o distancia > 200 km.
- Split Soberano Inmutable: 80% Artista / 10% EAR OS / 10% VIMUME.
- Cierre Transaccional: Depósito de 100,00 € en Stripe con firma criptográfica Price-Lock SHA-256 (validez 24h a 72h).
- Presión y Rider Acústico: 12 W/pax (Sistemas Bose F1 812 / S1 Pro, Microfonía Shure Beta 87A / Axient RF / GLXD4).
- Límite VIMUME B2G: < 75 dB SPL en residencias de mayores y centros de día. Techo Art. 118 LCSP acotado estrictamente a < 15.000,00 € (Ajuste automático preventivo al 95% = 14.250,00 €).
- Teléfono Oficial de Retención: +34 693 693 048.

━━ 3. PROTECCIÓN DE MOTORES CERTIFICADOS (RETO 1 & RETO 2) ━━━━━━━━━━━━━━━━━━━━━━━━━
- PROHIBIDO REESCRIBIR: `src/lib/vimume/b2g-tender-engine.ts` (Reto 1) y `src/lib/astra/astra-conversation-engine.ts` (Reto 2) están probados y certificados. Todo nuevo desarrollo debe importar y extender estas utilidades, nunca duplicarlas ni alterar sus firmas de autodiagnóstico.

━━ 4. PROTOCOLO ZERO-TOKEN MEMORY (ZTM) & RAG LOCAL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. REUSE & RAG FIRST: Antes de escribir cualquier script, consulta `scripts/registry.json` y `src/data/ear-rag-database.json`. Prohibido duplicar utilidades de extracción.
2. AMORTIGUADOR HEADLESS DE ARTIFACTS: Archivos masivos (.json, .pdf, .md > 2.000 tokens) NUNCA se leen directamente al contexto del chat. Se procesan mediante scripts locales en `/scripts/` y se emite únicamente el condensado JSON (< 300 tokens) a la respuesta del agente.
3. VAULTING PURISTA: Todo archivo crudo procesado se desplaza inmediatamente a `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\{Category}\` registrando hash SHA-256 en `scripts/.archived_manifest.json`.

━━ 5. NORMAS TÉCNICAS Y NEXT.JS APP ROUTER STRICT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Next.js 14/15 App Router: Server Components por defecto. Directiva `"use client"` EXCLUSIVAMENTE donde existan eventos de usuario o reactividad del DOM.
- Async Params Resolution: En páginas dinámicas (`[provincia]/[servicio]/[municipio]`), SIEMPRE resolver `params` de forma asíncrona (`const resolvedParams = await params;`) con fallbacks defensivos.
- TypeScript Strict: Cero `any` implícitos. `npx tsc --noEmit` obligatorio al finalizar cada tarea (Exit Code 0).
- Visual Style: Cinematic Monochrome S-Class (True Black #050505, Paper #FFFFFF, Charcoal #1a1a1a, Azul Eléctrico #258DCD, Cyan Hielo #AAD6CD, Zafiro Noche #081226, Coral Alerta #FF455B).

━━ 6. PROTOCOLO DE AUDITORÍA Y VETO ESTRATÉGICO DE ANTIGRAVITY ━━━━━━━━━━━━━━━━━━━━━
Si el obrero local (Qwen 3.8 / Cline) comete alguno de los siguientes desviaciones, Antigravity disparará el `VETO_ESTRATÉGICO_ACTIVADO`:
1. Alterar la fórmula del Split Soberano (80/10/10) o bajar el depósito de Stripe de 100 €.
2. Introducir títulos académicos o de conservatorio inventados para Edwin Agudelo (Mantener: Artista, cantante y compositor de amplia trayectoria y oficio real sobre el escenario).
3. Romper la compilación de TypeScript (`Exit Code != 0`).
4. Intentar ejecutar `eval()` o exponer secretos en hardcode (`process.env.STRIPE_SECRET_KEY` y `process.env.STRIPE_WEBHOOK_SECRET` mandatorios).
5. Romper la firma criptográfica HMAC SHA-256 en webhooks de Stripe.

━━ 7. FORMATO OBLIGATORIO DE SALIDA PARA TAREAS (11 SECCIONES) ━━━━━━━━━━━━━━━━━━━━━
Cada informe de tarea local entregado a Antigravity debe estructurarse estrictamente bajo:
HECHO_VERIFICADO:
HIPÓTESIS:
REQUIERE_VALIDACIÓN:
DECISIÓN:
RIESGOS:
CAMBIOS:
VALIDACIONES:
ROLLBACK:
ESTADO_BLOQUE:
SIGUIENTE_PASO_PROPUESTO:
REQUIERE_APROBACIÓN:

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
