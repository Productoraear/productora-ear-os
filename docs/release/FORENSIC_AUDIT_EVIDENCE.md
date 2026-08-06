# FORENSIC AUDIT EVIDENCE (OMEGA v2.1)

| ID | Severidad | Dominio | Ruta | Símbolo/Líneas | Evidencia | Impacto | Estado | Acción Mínima | Gate |
|---|---|---|---|---|---|---|---|---|---|
| FAE-01 | P0 | Auth / Edge | `middleware.ts` | Archivo Inexistente | `list_dir` en raíz y `src/` no encontró el archivo. Rutas privadas protegen por CSR. | `src/app/(nexus)/dashboard/page.tsx:16` redirige al usuario sólo tras cargar en cliente. Atacante puede deshabilitar JS para ver el esqueleto privado. | CONFIRMADO | Crear interceptor Edge básico en `middleware.ts` | Auth |
| FAE-02 | P0 | Identidad | `src/app/api/nexus/user/sync/route.ts` | L6-L10 | El endpoint recibe `{id, email}` del body sin validar JWT/Cabecera HTTP de autorización. | Permite falsificar roles y enviar UIDs arbitrarios. | CONFIRMADO | Implementar `firebase-admin` JWT check | Datos |
| FAE-03 | P1 | Pagos | `src/app/api/webhooks/stripe/route.ts` | L10-L16 | El código depende de `STRIPE_WEBHOOK_SECRET` pero asume su inyección en runtime Vercel. | Fallo silencioso (Error 500) en producción si el secreto no está inyectado. | REQUIERE_VALIDACION | Comprobar presencia de ENVs en Vercel Dashboard | Deploy |
| FAE-04 | P2 | Analítica | `src/app/layout.tsx` | L64-L90 | Ausencia absoluta de scripts de Microsoft Clarity o GA4, y carencia de banner de consentimiento. | Sin visibilidad del comportamiento real de los usuarios en producción. | CONFIRMADO | Añadir scripts bajo componente de consentimiento | SEO |
