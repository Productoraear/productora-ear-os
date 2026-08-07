# EAR OS — PROTOCOLO DE VALIDACIÓN EN STAGING & LAST MILE GATE
## ID: EAR-GATE-STAGING-01
## ESTADO: LISTO_PARA_PREVIEW / READY_FOR_STAGING_HARDENING
## CIERRE TÉCNICO: 98.0%

Este dossier formaliza la hoja de ruta inmutable para validar la última milla antes de cualquier autorización de despliegue a producción.

---

### 1. MATRIZ DE RUTAS EN PREVIEW (SMOKE TEST VERIFICABLE)

| Ruta de Acceso | Componente Núcleo | Estado Local | Criterio de Aceptación Staging |
| :--- | :--- | :--- | :--- |
| `https://TU-PREVIEW.vercel.app/presupuesto` | `TinderMatcherClient.tsx` | ✅ PASS | Carga del matcher, selección B2C/B2B/B2G, sin errores de consola |
| `https://TU-PREVIEW.vercel.app/cotizador` | `MultiPricer.tsx` | ✅ PASS | Selector dinámico de cachés, cálculo de split 80/10/10 |
| `https://TU-PREVIEW.vercel.app/the-signal` | Portal Inmersivo | ✅ PASS | Botón Apex interactivo, conversión fluida a cotizador |

---

### 2. PROTOCOLO DE VARIABLES EN VERCEL (PREVIEW ENVIRONMENT)
Configurar en Vercel Dashboard (**Settings → Environment Variables → Environment: Preview**):

- `STRIPE_SECRET_KEY` -> *Clave `sk_test_...` de Sandbox*
- `STRIPE_WEBHOOK_SECRET` -> *Firma `whsec_...` del endpoint de Preview*
- `DATABASE_URL` -> *Cadena de conexión Supabase/Postgres Staging con pooling (Transaction/Session)*
- `DIRECT_URL` -> *Cadena de conexión directa Supabase Staging*
- `NEXT_PUBLIC_BASE_URL` -> *URL completa del deployment de Preview*

> [!WARNING]
> **RECORDATORIO CONTRACTUAL DE SEGURIDAD:**
> Nunca imprimir, leer ni pegar valores reales de `.env` en el chat ni en logs. Solo reportar confirmación de presencia.

---

### 3. PROTOCOLO DE TEST DEL WEBHOOK DE STRIPE (SANDBOX/TEST)
1. Entrar en **Stripe Dashboard → Developers → Webhooks**.
2. Añadir endpoint de Preview: `https://[TU-PREVIEW].vercel.app/api/webhooks/stripe`.
3. Seleccionar evento: `checkout.session.completed`.
4. Pulsar **"Send test webhook"**.
5. Verificar respuesta `200 OK` con payload JSON `{ "received": true }` y ejecución de transacción ACID en base de datos.

---

### 4. AUDITORÍA DE POLÍTICAS RLS EN SUPABASE
Verificar en **Supabase Dashboard → Database → Policies**:

- `SmartContract`: Enable RLS -> Policy: `auth.uid() = user_id OR auth.jwt() ->> 'role' = 'ADMIN'`
- `CommissionLedger`: Enable RLS -> Policy: Solo lectura por `user_id`, inserción exclusiva vía Server Action / Webhook
- `Waybill`: Enable RLS -> Policy: Lectura vinculada a `workspace_id`
- `CalendarBlock`: Enable RLS -> Policy: Consulta pública, mutación restringida a propietario de artista

---

### 5. CAPA PERIMETRAL DE RATE LIMITING
Asegurar limitación por IP / Token (Upstash Redis o Cloudflare WAF) delante de:
- `/api/nexus/user/sync` (Límite: 10 req/min)
- `/api/profiles/claim` (Límite: 5 req/min)
- `/api/rag/query` (Límite: 20 req/min)

---

### 6. FORMULARIO DE RESPUESTA PARA EL GATEKEEPER HUMANO (10%)
Para certificar el paso de Staging a Producción 100%, reportar:

1. **Preview URL:** `https://...`
2. **Variables de Entorno en Preview:** Confirmadas (Sí/No)
3. **Resultado Webhook Stripe:** Éxito `200 OK` / Error
4. **Estado RLS en Supabase:** Activado en tablas críticas (Sí/No)
5. **Resultado Smoke Tests (3 rutas):** Navegación y renderizado limpios (Sí/No)
