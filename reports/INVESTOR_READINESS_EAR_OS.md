# EAR OS — DIAGNÓSTICO DE PREPARACIÓN PARA INVERSIÓN (SILICON VALLEY)

> Fecha: 2026-10-05 · Método: barrido forense del flujo de dinero
> `/reservar/solista` → calendario → depósito Stripe → webhook → lock atómico → ledger 80/10/10 → n8n
> Verificación concreta contra código (no contra intenciones).

---

## 1. LO QUE EXIGE SILICON VALLEY (JERARQUÍA DURA, SIN HUMO)

Un inversor no compra código, seguridad ni diseño: compra **evidencia de que el dinero fluye y puede escalar**. En orden de dureza:

| # | Exigencia | Cómo se evalúa | Estado actual en EAR OS |
|---|-----------|----------------|--------------------------|
| 1 | **Tracción / ingresos verificables** | GMV, nº de reservas pagadas, run-rate, cuentas bancarias | ⚠️ **BLOQUEADO.** Fail-closed sin `STRIPE_SECRET_KEY` real → 0 € procesados. |
| 2 | **Unit economics probados** | CAC, LTV, margen bruto, contribución por show | ⚠️ Parcial. Split 80/10/10 + precios SSOT listos, pero 0 datos reales para LTV/CAC. |
| 3 | **Funnel end-to-end sin fachadas** | Reserva → pago → escritura → lock → split | ✅ Motor escrito y cableado (artista-deposit, webhook, lock ACID, ledger). No probado en vivo. |
| 4 | **Demo reproducible** | Transacción grabable que un inversor pueda tocar | ❌ No existe demo grabable (sin claves no hay checkout). |
| 5 | **TAM/SAM/SOM defendible** | Mercado total, accesible, conquistable | ⚠️ Narrativa existe (bodas/fincas/B2G/VIMUME), sin modelo numérico formal. |
| 6 | **Equipo + roadmap + data room** | Gobernanza, hitos, KPIs automatizados | ⚠️ Infraestructura n8n/telemetría existe; falta data room unificado. |

**Conclusión forense:** el eslabón más débil **ya no es la seguridad** (blindada y sellada en la elevación previa). El eslabón más débil ahora es **la operatividad del motor de dinero**: un sistema 100% fail-closed sin credenciales reales es *seguro pero financieramente muerto*. Seguridad sin ingresos = no invertible.

---

## 2. EL VALLE DE LA MUERTE (DE SEGURO A OPERATIVO)

La elevación fail-closed fue correcta y defendible ante cualquier due diligence. Pero creó un **punto muerto** que solo se resuelve con credenciales legítimas:

1. **`STRIPE_SECRET_KEY` real** (o `sk_test_...` legítimo de Stripe Test Mode para demo).
2. **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** (`pk_test_...` para demo).
3. **`STRIPE_WEBHOOK_SECRET`** (firma de eventos).
4. **`POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING`** (persistencia real).
5. **`NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`** (telemetría).
6. **`SESSION_SECRET`** y **`ORACULO_ADMIN_TOTP_SECRET`** (admin).

> **Sin estas claves, ningún script, vista o motor puede producir 1 € de tracción.**
> El siguiente paso lógico NO es añadir features: es **desbloquear el checkout con Stripe Test Mode y grabar una transacción end-to-end**.

---

## 3. EL SIGUIENTE PASO LÓGICO (ORDEN DE EJECUCIÓN)

### Fase A — Desbloqueo (dueño: CEO, ~30 min)
1. Crear/abrir cuenta Stripe → Modo Test → copiar `sk_test_...` y `pk_test_...`.
2. Configurar webhook de test en el dashboard de Stripe → obtener `STRIPE_WEBHOOK_SECRET`.
3. Escribir las 8 variables en `.env` local (no commitear jamás el `.env`).

### Fase B — Demo grabable (dueño: obrero, ~1 bloque)
4. Transacción piloto: reservar solista → pagar 100 € con tarjeta de test (`4242 4242 4242 4242`).
5. Verificar cadena: webhook recibido → lock atómico → ledger 80/10/10 → fila `ProductionEvent` única.
6. Grabar la demo (Checkout a Confirmación) para el data room.

### Fase C — Data Room medible (dueño: obrero, automatizable ya)
7. Generar métricas verificables del SSOT (script `build_investor_metrics.cjs`).
8. Dashboards KPI con funnel real (telemetría ya existente + Prisma).

---

## 4. QUÉ CONSTRUÍ DE INMEDIATO (SIN DEPENDER DE TU .ENV)

`scripts/build_investor_metrics.cjs` — extrae las constantes del **SSOT canónico** (cero duplicación) y produce `reports/investor_metrics.json` con:
- Unit economics del solista (precio, split 80/10/10, logística, depósito, techo B2G).
- Rider acústico por contexto.
- Estructura del funnel y de la cadena de dinero (para due diligence).
- Marcadores de "pendiente de datos reales" donde el inversor exigirá números.

Este artefacto convierte el storytelling en **números justificables**, que es exactamente lo primero que audita un inversor.

---

## 5. VEREDICTO

> El MVP está **seguro y cableado**, pero **no es invertible sin tracción demostrable**.
> El único movimiento que hace historia ahora es: **poner las claves → grabar la primera transacción end-to-end → medirla con el data room**.
> Todo lo demás (features, UX, SEO) es distracción hasta que el motor de 100 € escupa su primer split 80/10/10 real.