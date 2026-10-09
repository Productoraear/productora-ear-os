# 🧠 ESPECIFICACIÓN CANÓNICA DEL SUPERVISOR AUTÓNOMO (CIERRE EN CAJA)

> **Código de cierre (fuente de verdad):**
> `A1C A2A A3B A4C A5C B1C B2B B3B B4B B5A C1A C2A C3B C4B C5B D1C D2C D3A D4A D5C E1C E2C E3D E4C E5C F1C F2D F3D F4C F5A G1D G2C G3B G4A G5A`
>
> **Estado:** DECISIONES BLOQUEADAS — 35/35 (cierre en caja).
> **Traducción:** las 35 decisiones coinciden con el consejo S-Class del `GUARDIAN` del cuestionario `dashboard_cuestionario_supervisor.html`.
> **Fecha de sellado:** 2026-10-03

---

## 0. PROPÓSITO

Esta especificación convierte el código de cierre en requisitos de construcción inequívocos para el **Supervisor Autónomo** (el "ente vivo") de EAR OS. Cada decisión se traduce en un requisito de arquitectura, de negocio o de gobernanza. No se admiten interpretaciones ambiguas: lo que aquí se fija es el contrato SSOT del supervisor.

---

## A — EL SUPERVISOR AUTÓNOMO (EL "ENTE VIVO")

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| A1 | **C** | **Nivel 5 (MAPE-K completo).** El supervisor implementa el bucle Monitorizar → Analizar → Planificar → Ejecutar sobre una Knowledge base persistente. No es un simple orquestador de tareas: cierra el ciclo cognitivo completo. |
| A2 | **A** | **Residencia: PM2 en Windows** (`H:\EAR_OS_V2\EAR_OS_V2`), persistente y con auto-restart ante caídas. El daemon de PM2 garantiza que el ente esté siempre encendido localmente. |
| A3 | **B** | **Motor LLM: Ollama local Qwen 27B (coste 0) + fallback a API externa** solo si Ollama falla o se satura. La decisión preferente es siempre local; el fallback es resiliencia, no ruta habitual. |
| A4 | **C** | **Autonomía acotada:** puede editar archivos, validar (`tsc --noEmit`), revertir si falla, inyectar tareas en `tasks_queue.json` y disparar webhooks n8n. **No** tiene autonomía sobre secretos, `git push` ni operaciones Stripe directas. |
| A5 | **C** | **Kill-switch doble + panel:** archivo centinela `.antigravity/STOP` + endpoint con clave `/api/admin/kill-supervisor` + botón visible en panel admin. El cese de emergencia es triple-redundante. |

**Guardarraíles de autonomía:** el supervisor NUNCA podrá (a) alterar el Split 80/10/10, la tarifa 350 €, el depósito 100 € o el límite 14 250 €; (b) exponer `STRIPE_SECRET_KEY` al cliente; (c) auto-ejecutar `git push` ni rotar secretos sin intervención humana.

---

## B — PURGA DEL DATA LAKE (DEDUP)

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| B1 | **C** | **Eliminación de 3 clases:** hash byte-idéntico + equivalente semántico (fuzzy) + boilerplate sin valor de negocio. |
| B2 | **B** | **Mover a cuarentena** (aislar, no borrar duro). Se conserva la trazabilidad sin destruir datos. |
| B3 | **B** | **Objetivo: ~15 000 pepitas únicas** (equilibrio entre rigor y conservación). |
| B4 | **B** | **Verificación:** recuento de grupos eliminados + hash del índice (Exit 0) **+** diff de inventario antes/después. |
| B5 | **A** | **Reversible** con snapshot/cuarentena. El borrado duro queda prohibido como política de dedup. |

---

## C — ROTACIÓN DE SECRETOS (LO URGENTE)

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| C1 | **A** | **Rotar TODO hoy:** GitHub PAT, Google/Stitch, Perplexity, Hostinger. Sin excepciones. |
| C2 | **A** | **Destino de secretos: Coolify Secrets (VPS)** en `82.29.179.172`. |
| C3 | **B** | **Rotación automática cada 30 días** mediante script automatizado/lote programado. |
| C4 | **B** | **Sí hay credenciales en el historial de Git → purgar con `git filter-repo`.** Auditoría previa obligatoria. |
| C5 | **B** | **Eliminar `mcp_config.json` del repo** y regenerar plantilla sin secretos (referencias `${SECRET}` o template vacío). |

**Regla inmutable:** ningún secreto real puede residir en `src/`, `public/` ni en archivos `"use client"`. Solo servidor o gestor de secretos externo.

---

## D — PARSER PROTOBUF (.pb) → ÍNDICE DECISIONAL

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| D1 | **C** | **Parser híbrido:** extracción de strings + detección de campos clave (sin schema completo). |
| D2 | **C** | **Extraer:** texto plano + pares clave-valor + entidades (fechas, `350`, `100`, `14250`, split, nombres). |
| D3 | **A** | **Salida: un JSON por conversación** en `decisions/<id>.json`. |
| D4 | **A** | **Índice en `vault/decision-dna/`** (local, gitignored, fuera del árbol pesado de Git). |
| D5 | **C** | **Verificación:** recuento de decisiones por archivo (Exit 0 si >0 en todos) **+** cobertura (parseados/101) **+** reporte decisiones/descartes/errores. |

**Input sombreado:** los 101 archivos `.pb` (conversaciones serializadas). El output alimentará la Knowledge base (MAPE-K) del bloque A.

---

## E — GRAFO INTENCIÓN → MOTOR (OMEGA + N8N)

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| E1 | **C** | **Cableado:** unir webhooks a motores + normalizar contratos entrada/salida + **cola de reintentos por webhook**. |
| E2 | **C** | **Disparo de tarea en `omega.js`:** manual (`omega.js next`) + eventos n8n (lead, reserva, licitación) + auto-detección del supervisor (MAPE-K). |
| E3 | **D** | **Inventario previo obligatorio** antes de cablear: los 10 motores nucleares están dispersos; hay que mapearlos con precisión quirúrgica primero. |
| E4 | **C** | **Convivencia:** `omega.js` ejecuta, el supervisor decide/supervisa. No se reemplaza `omega.js`. |
| E5 | **C** | **Trazabilidad dual:** origen en `tasks_queue.json` + evento n8n registrado en `OMEGA_STATE_JOURNAL.md`. |

**Webhooks mandatorios (7):** `/webhook/b2b-quote`, `/webhook/stripe-price-lock`, `/webhook/finca-partnership`, `/webhook/vimume-clinical-report`, `/webhook/call-center-intake`, `/webhook/autonomous-escalation`, `/webhook/executive-kpi-radar`.

---

## F — MÉTRICA DE MARGEN (CIERRE = €, NO ARCHIVO)

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| F1 | **C** | **Unidad de "completado":** feature + `tsc` Exit 0 + webhook n8n con payload real + **€ verificado** (100/350/14 250). |
| F2 | **D** | **KPIs del panel de margen:** reservas 100 € (`stripe-price-lock`) + cachés 350 € (`b2b-quote`) + licitaciones 14 250 € (`b2b-quote` + PLACSP) + **split 80/10/10 liquidado**. |
| F3 | **D** | **Visualización:** panel admin web + journal `.md`. |
| F4 | **C** | **Verificación de cierre en caja:** payload webhook persistido **+** test e2e que dispara el webhook y verifica. |
| F5 | **A** | **Feature sin mapeo a € del SSOT → NO se construye** (veto del Mandato 9). |

**Regla suprema:** nada se da por completado si no produce negocio verificable. "Funcional" no es "vendido".

---

## G — GOBERNANZA, SEGURIDAD Y CONTINUIDAD

| ID | Decisión | Requisito S-CLASS |
|----|----------|-------------------|
| G1 | **D** | **Guardarraíles inmutables (SSOT completo):** Split 80/10/10, 350 €, 100 €, 14 250 €, 12 W/pax, 75 dB **+** no tocar `b2g-tender-engine.ts` / `astra-conversation-engine.ts` **+** no exponer `STRIPE_SECRET_KEY` en cliente. |
| G2 | **C** | **Presupuesto de contexto (ZTM) híbrido:** memoria limpia por bloque de motor (no persistente entre tareas, no limpia total descontrolada). |
| G3 | **B** | **Persistencia:** `tasks_queue.json` + journal **+** snapshot diario a carpeta aislada. |
| G4 | **A** | **Alertas críticas al humano:** Email/WhatsApp si falla dinero, seguridad o `tsc`. |
| G5 | **A** | **Orden de materialización:** Secretos → Supervisor → Dedup → Parser → Grafo → Métricas. |

---

## 8. ORDEN DE MATERIALIZACIÓN (DERIVADO DE G5A)

1. **C — Rotación de secretos** (crítico, riesgo de fuga activa).
2. **A — Supervisor autónomo** (el ente vivo, Nivel 5 MAPE-K, PM2, kill-switch).
3. **B — Purga del data lake** (dedup con cuarentena, target ~15 000).
4. **D — Parser protobuf** (vault/decision-dna, JSON por conversación).
5. **E — Grafo intención→motor** (inventario previo + cableado omega↔n8n).
6. **F — Métrica de margen** (cierre = € verificado).

---

## 9. CONDICIONES DE "COMPLETADO" GLOBAL

El Supervisor Autónomo se considera **sellado** cuando:

- [ ] Los 35 requisitos anteriores tienen implementación o verificación comprobable.
- [ ] `npx tsc --noEmit` devuelve Exit Code 0.
- [ ] Existe al menos **1 € verificado** trazable a un webhook n8n con payload persistido.
- [ ] Kill-switch tripe-redundante operativo (STOP + endpoint + botón admin).
- [ ] Cero secretos reales en el árbol Git (post `filter-repo`).
- [ ] `vault/decision-dna/` contiene el índice decisional de los 101 `.pb`.