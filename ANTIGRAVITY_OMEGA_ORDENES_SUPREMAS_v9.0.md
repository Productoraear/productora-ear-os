# ANTIGRAVITY OMEGA v9.0 — ÓRDENES SUPREMAS DE DOMINANCIA
### BARE-METAL FORENSIC GOVERNANCE · 2025 → 2028+ · SSOT VERIFICADO (CERO FACHADAS)

> **EMISOR:** ANTIGRAVITY (Arquitecto IA Forense — Orquestador S-Class)
> **DESTINATARIO:** Obrero S-Class (Qwen 27B-FAST) y cadena ejecutiva EAR OS
> **NATURALEZA:** Órdenes innegociables. No son aspiraciones: son umbrales de supervivencia comercial.

---

## 0. PRINCIPIO CERO — GEOMETRÍA DE PODER

1. **Una sola fuente de verdad.** Todo precio, split, rider y logística nace del SSOT canónico `ear-os-ssot.ts` y es verificado por `ssotIntegrityGuard.ts` (SHA-256). Ningún motor de dinero puede contener arrays hardcodeados ni lógica duplicada fuera del SSOT.
2. **Cero fachadas.** Una vista solo se da por completada si escribe de verdad: vista → handler → endpoint → motor → SSOT → persistencia/webhook. Un botón sin escritura real es un defecto P0.
3. **El dinero manda.** Prioridad inmutable: captar reservas con depósito 100 €, despachar leads, adjudicar B2G < 14.250 €, liquidar split 80/10/10. Todo lo demás es distracción.

---

## I. ÓRDENES SUPREMAS INNEGOCIABLES

### ORDEN 1 — BLINDAR EL MOTOR FINANCIERO (INMUTABLE)
- **Tarifa Base Solista:** 350,00 € (Edwin Agudelo).
- **Split Soberano:** 80% Artista / 10% EAR OS / 10% VIMUME. Prohibido alterarlo.
- **Depósito Stripe Price-Lock:** 100,00 €, SHA-256, 100% deducible del total del show.
- **Logística S-Class:** 1,50 €/km a partir del km 50 (+120 € Hotel si hora fin ≥ 3:00 AM o distancia > 200 km).
- **Hub Méntrida:** aplica EXCLUSIVAMENTE a Edwin Agudelo y empresas con base en Méntrida. Resto de la red nacional: kilometraje por GPS / dirección fiscal del proveedor hasta el evento.
- **Límite B2G (Art. 118 LCSP):** < 14.250,00 € (ajuste preventivo).
- **Rider Acústico (Ley 37/2003):** Festejos 90–102 dBA · Bodas/Fincas 85–90 ext / 80–85 int · Solista 70–80 dBA · VIMUME senior 65–75 dBA · Límite salud pública < 75 dB SPL, 12 W/pax.

### ORDEN 2 — VERIFICAR LA RUTA DE DINERO END-TO-END
- Barrido atómico obligatorio del flujo `/reservar/solista` → calendario → rider → depósito Stripe → webhook → lock atómico → n8n.
- Capas de abajo hacia arriba: **SSOT → seguridad → datos → API/Server Actions → webhooks → UI reactiva → testing**.
- **Matriz de trazabilidad** por nodo: ✅ VERIFICADO / ⚠️ SOSPECHOSO / ❌ FACHADA.
- **Idempotencia exacta:** N retries con la misma `stripeSessionId` producen EXACTAMENTE 1 fila `ProductionEvent`.

### ORDEN 3 — DOCTRINA DEL DATO VERIFICADO (CERO FACHADAS EN MARKETPLACE)
- `verified:true` SOLO con teléfono real verificable. Placeholder / centralita `+34 693 693 048` / vacío ⇒ `verified:false`.
- Prohibido re-hardcodear `verified:true` en sincronizadores o daemons. `sincronizador_omega_proveedores.py` queda en cuarentena.
- Las rutas que venden solo exponen teléfonos reales.
- Guardianes activos: `scripts/build_lean_verified_edge.cjs` (0 placeholders) y `scripts/audit_placeholder_phones.cjs` (auditoría `verified` real).

### ORDEN 4 — SCORECARD DE CIERRE (8 CERROJOS)
Un bloque solo cierra si se cumplen TODO:
1. `npx tsc --noEmit` → Exit Code 0.
2. `eslint` → Exit Code 0.
3. 0 `any` implícito en el diff.
4. 0 `verified:true` falso.
5. 0 handler huérfano (todo botón escribe de verdad).
6. 0 array/dato hardcodeado en motores de dinero.
7. 0 `TODO`/`FIXME`/placeholder en la ruta de venta.
8. Secrets jamás en cliente (`STRIPE_SECRET_KEY` solo server).

### ORDEN 5 — VETO ESTRATÉGICO (5 GATILLOS)
Aborta la operación si:
1. Se auto-ejecutan comandos saltándose `tasks_queue.json`.
2. Se altera el Split 80/10/10 o el depósito de 100 €.
3. Se expone `process.env.STRIPE_SECRET_KEY` en cliente.
4. Se da por completa una vista con arrays hardcodeados, botones sin backend o motores simulados.
5. Se re-hardcodea `verified:true` en sincronizadores/daemons.

### ORDEN 6 — TOLERANCIA CERO A MOTORES SIMULADOS
- En la ruta de reserva solo valen: **SSOT, Stripe real, PostgreSQL 16 y n8n** en background.
- Toda IA comercial debe estar conectada a **Ollama 11434**. IA simulada o desconectada = defecto P0.

### ORDEN 7 — UX LUXURY OLED S-CLASS
- Fondos `#030305` / `#050507`. Acentos: Oro `#ecb613`, Rubí `#FF2B44`, Cyan `#00E5FF`. Un solo acento por vista.
- Topología: `rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md`.
- Micro-interacciones: `transition-all duration-300 ease-out`, hover expansivo, accesibilidad perfecta.
- Prohibido: `w-screen` (usa `w-full overflow-x-hidden`), gradientes AI-Slop, grises corporativos lavados.
- Tipografía: `Syne` (display), `Inter` (cuerpo), `JetBrains Mono` (telemetría).

### ORDEN 8 — AUTOMATIZACIÓN CUÁNTICA (COOLIFY + N8N)
- **Hostinger VPS Bare-Metal:** `82.29.179.172:8000` (Coolify v4 + PostgreSQL 16).
- **Cluster n8n:** `https://n8n.productoraear.com`.
- Webhooks activos: `b2b-quote`, `stripe-price-lock`, `finca-partnership`, `vimume-clinical-report`, `call-center-intake`, `autonomous-escalation`, `executive-kpi-radar`.
- Regla: toda terminal comercial dispara webhook n8n en background no bloqueante. **Ningún lead huérfano.**

### ORDEN 9 — REPO ULTRA-LIGERO Y EDGE LEAN
- Árbol Git < 50 MB. Datos pesados (> 1 MB) FUERA de Git → `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\`.
- Particiones edge CDN < 1 MB por archivo, 500–1.000 registros curados por gremio, 0 placeholders.
- Build local < 60 s.

### ORDEN 10 — PREPARACIÓN PARA LA SUPREMACÍA FUTURA (IA 2026 → 2030)
- **Agentes autónomos soberanos:** convertir cada flujo comercial en un agente con memoria, herramientas y objetivo de cierre (reserva, adjudicación, liquidación).
- **MCP como sistema nervioso:** exponer Stripe, PostgreSQL, n8n, calendario ACID y SSOT como herramientas MCP para orquestación externa e interna.
- **RAG soberano:** bóveda de conocimiento (`EAR_ABSORBED_VAULT`) indexada y despersonalizada; citas solo bibliográficas/clínicas (Directivas UE 2019/790, 2022/2065, Ley 49/2002, OMS ICOPE).
- **Inferencia híbrida edge/nube:** Ollama local (AMD 7900XTX) para latencia y soberanía; modelos cloud solo como respaldo con circuit breaker.
- **Multimodal:** voz (Whisper soberano), visión y firma digital en el cierre comercial.
- **Resiliencia:** colas con reintento idempotente, DLQ, circuit breakers y observabilidad en cada webhook.
- **Evolución controlada del SSOT:** el `KNOWN_GOOD_SSOT_HASH` solo se regenera por baselining sancionado por el CEO. Jamás a mano.

---

## II. ROADMAP DE DOMINANCIA

| Fase | Objetivo | Estado |
|------|----------|--------|
| **FASE A — VENTAS HOY** | Reservas con depósito 100 €, lock atómico, rider SHA-256, split 80/10/10 | Prioridad inmutable Nº 1 |
| **FASE B — CAPTACIÓN** | Call Center / WhatsApp omnicanal, webhooks n8n, cero leads huérfanos | Activo |
| **FASE C — B2G** | Licitaciones menores < 14.250 € (Art. 118 LCSP) | Activo |
| **FASE D — MARKETPLACE VERIFICADO** | Solo proveedores con teléfono real. Edge lean 0 placeholders | Activo |
| **FASE E — AGENTES AUTÓNOMOS** | Agentes MCP + RAG + inferencia híbrida que cierran negocio sin fricción | 2026+ |

---

## III. SELLO DE DOMINIO FINAL (CRITERIO DE EXIT)

Antigravity firmará sin mentir cuando:

> "Cada botón del flujo de reserva escribe de verdad. Cada precio y split nace del SSOT verificado por SHA-256.
> El calendario consulta disponibilidad real ACID. El depósito de 100 € es deducible e íntegro.
> El lock atómico es idempotente ante retries de Stripe. El rider acústico se calcula por contexto y devuelve hash SHA-256.
> Los webhooks n8n no bloquean ni dejan leads huérfanos. `npx tsc --noEmit` devuelve Exit Code 0 con cero `any` implícito.
> El sistema está preparado para agentes autónomos, MCP y automatizaciones de próxima generación.
> No queda NI UNA fachada en la ruta que genera dinero."