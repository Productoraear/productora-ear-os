# AUTOPISTA DE PROMPTS — CENTRO DE CONTROL CEO ENTERPRISE (para el Obrero, sin razonar)

## 0. REGLAS DEL ARQUITECTO (Halcón Peregrino + Physarum) — SIEMPRE ACTIVAS
Fuente: `GUIA_MAESTRA_COMANDOS_Y_DIAGNOSTICOS.md` Cap. 3.
1. **ZTLM** (Zero-Token Local Mirroring): datos masivos jamás a una IA de pago. Se procesan en disco local con Node/Python en streaming.
2. **Picado del halcón**: leer primero (`git status`, archivo exacto), un único cambio quirúrgico, verificar, cerrar. Nada de exploración especulativa.
3. **Red del moho**: reforzar solo las rutas que ya transportan tráfico (URLs con demanda real, GSC) y podar las demás. No se construye lo que ningún lead pisa.
4. **Una tarea = un commit = un Exit 0 mostrado en terminal.** Sin Exit observable no hay "hecho".
5. **Cero literales sensibles** en código/bundle. Secretos solo en `.env.local` y Coolify.
6. **No se toca `ear-os-ssot.ts`** sin autorización del CEO. Cifras siempre desde el SSOT.
7. **Cero promesas que no controlamos** (ruido, multas, resultados clínicos). Lenguaje verificable.
8. Cierre de cada bloque: acta `SIGMA://CLOSE/v1` en `CLINE_EXECUTION_LOG.md`.

## 1. ESTADO REAL (auditado, no relato)
| Pieza | Estado | Evidencia |
|---|---|---|
| Acceso admin local | Reparado: faltaban `EAR_SOVEREIGN_MASTER_PASSWORD`, `EAR_ADMIN_2FA_SECRET`, `NEXTAUTH_SECRET` (fail-closed 503) | `/api/auth/admin-verify` |
| 2FA | Secreto nuevo; alta en `.antigravity/local/2FA_ENROLL.txt` (ignorado por git) | `.gitignore` |
| Producción Coolify | Pendiente: replicar las 3 variables + `EAR_ADMIN_PASSWORD` en el contenedor | — |
| Auditor de intención (lectura íntegra) | Creado y probado | `scripts/audit_intent_coverage_full.cjs` |
| Panel `/admin/control` | Existe (6 pestañas). Brechas abajo | `ControlDashboard.tsx` |

## 2. BRECHAS DEL PANEL CEO (mapa de cobertura objetivo)
Regla: **no se elimina ninguna opción actual**; se reagrupa en 6 áreas con buscador global (⌘K).
1. **Hoy** (CEO): ingresos cobrados, depósitos Price-Lock, fechas bloqueadas, alertas HITL, leads calientes por URL de origen.
2. **Ventas**: embudo por temperatura de lead, cotizador, contratos pendientes de firma, WhatsApp handoff.
3. **Marketing**: cobertura de intención por URL (auditor), GSC, plantillas, calendario de contenidos.
4. **Contabilidad**: facturas, IVA 21 %, Modelo 303/130/390 (borradores), split 80/10/10, liquidaciones, exportación para gestor.
5. **Proveedores / Asistencia**: onboarding asistido ("hazlo por mí"), checklist de ficha, documentos listos, soporte cuando el proveedor no puede.
6. **Legal & Cumplimiento**: contratos tipo, RGPD/LOPDGDD, LSSI-CE, consumidores (RDL 1/2007), eIDAS, Ley 37/2003, estado de alta del CEO.

## 3. TAREAS ATÓMICAS (ejecutar en orden; cada una cierra con Exit 0)
Formato: `ID · archivo(s) · acción exacta · verificación`.
- **T01** `.env.production`/Coolify · añadir las 3 variables nuevas (valores distintos a local) · login en producción OK.
- **T02** `src/app/(admin)/admin/control/ControlDashboard.tsx` · añadir pestaña "Hoy" con KPIs leídos vía `useAdminResource` (sin `fetch` directo) · `npm run typecheck`, `npm run audit:admin`.
- **T03** `…/control/tabs/ContabilidadTab.tsx` (nuevo) · listado de facturas/IVA + exportación CSV para gestor · typecheck + lint.
- **T04** `…/control/tabs/LegalTab.tsx` (nuevo) · checklist de alta (ver §4) + biblioteca de plantillas con aviso "revisar con asesor" · typecheck.
- **T05** `…/control/tabs/MarketingTab.tsx` (nuevo) · lee `reports/intent_coverage/summary.json` y muestra URLs débiles · typecheck.
- **T06** Asistente "hazlo por mí" en `/portal/proveedor`: botón que abre WhatsApp con la ficha incompleta prellenada · `audit:cta-matrix`.
- **T07** n8n: workflows `lead-hot`, `deposit-paid`, `provider-incomplete` (disparan por webhook, HITL en cobros/cancelaciones) · prueba de webhook 200.
- **T08** `scripts/audit_intent_coverage_full.cjs` · ejecutar por lotes (`--limit=2000 --offset=N --resume`) y priorizar las URLs con score < 50 · `summary.json`.
- **T09** Cierre: `node scripts/run_sv_protocol_15_gates.cjs` 17/17 + acta SIGMA.

## 4. FIGURA JURÍDICA — ORIENTACIÓN (no es asesoramiento; confirmar con gestor/asesor fiscal)
Hechos aportados: 26 años en España, ≈3 años cotizados, sin alta de autónomo/empresa/entidad todavía.
- **No se puede facturar ni cobrar en nombre propio de forma habitual sin alta.** Prioridad nº 1: darse de alta.
- **Fase 1 (arranque, bajo riesgo):** autónomo (RETA). Permite facturar ya y empezar a cotizar. Cuota de tarifa plana/por ingresos reales: verificar importes vigentes en la Seguridad Social y AEAT.
- **Fase 2 (al crecer):** sociedad limitada (SL) para limitar responsabilidad y separar patrimonio personal del negocio; suele compensar al subir beneficios. Decidir con asesor según facturación prevista.
- **VIMUME / impacto social:** estructura **separada** (asociación o fundación). Las deducciones (Ley 49/2002, Modelo 182) dependen de que la entidad cumpla los requisitos legales; no prometer deducciones hasta que exista y esté acogida.
- **Jubilación:** ≈3 años cotizados es poco. Un asesor de Seguridad Social puede calcular años necesarios y estrategia de bases de cotización. Es una decisión con efecto a 20+ años: pedir simulación oficial.
- **Mediación de EAR OS:** contratos bilaterales cliente–proveedor; EAR OS no es parte del servicio ajeno. Revisar con abogado los T&C, RGPD y cláusulas de depósito antes de escalar.

## 5. AUDITORÍA DE URLs (30.000+) — CÓMO USARLO
```
node scripts/audit_intent_coverage_full.cjs --base=http://127.0.0.1:3007 --limit=2000 --offset=0 --concurrency=4 --resume
```
Lee el HTML íntegro; puntúa 4 capas (espacio · lugar INE · ocasión · necesidad) + señales de conversión. Salida: `reports/intent_coverage/`. Priorizar `weak_urls` por demanda GSC (regla del moho).
