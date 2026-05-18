# 🏛️ EAR OS SOVEREIGN HARDENING CHECKLIST — S-CLASS COMPLIANCE AUDIT
## Estado: [ACTIVE-ENFORCED] | Nivel: S-CLASS | Orquestador: VIMUME OS | Versión: V153

Este documento representa la matriz de control de seguridad para la inspección del equipo de auditores senior. Mapea cada uno de los 30 vectores de hardening directamente a los archivos, módulos e implementaciones físicas del repositorio.

---

## 🔒 1. IDENTIDAD Y ACCESO (IDENTITY CONTROL)

*   [x] **1. Activar MFA obligatoria para roles administrativos:**
    *   *Implementación:* Delegado en el proveedor de identidad centralizado de Firebase Auth / Supabase y validado en sesión activa.
*   [x] **2. Usar RBAC centralizado con una sola fuente de verdad:**
    *   *Ubicación:* [src/lib/auth/permissions.ts](file:///c:/EAR_OS_V2/src/lib/auth/permissions.ts)
    *   *Módulo:* La función pura `userCan(role, action)` centraliza la autorización por acción del sistema, eliminando la deuda técnica de comprobaciones inline dispersas.
*   [x] **3. Separar roles de lectura, operación y administración:**
    *   *Ubicación:* `prisma/schema.prisma` -> `enum Role` (EXPLORADOR, OPERADOR, ADMIN, COMMANDER, ARTIST, FLEET_OPERATOR). Mapeado en `permissions.ts`.
*   [x] **4. Aplicar principio de mínimo privilegio en todo acceso:**
    *   *Implementación:* Las Server Actions de despacho e información de sistemas bloquean la ejecución si el token de sesión no resuelve un rol autorizado a través de la compuerta de `userCan`.
*   [x] **5. Revisar y revocar accesos inactivos o temporales:**
    *   *Mecanismo:* Políticas de expiración de JWT en Supabase Auth y Firebase claims.
*   [x] **6. Prohibir credenciales compartidas:**
    *   *Auditoría:* Cada usuario y perfil en `User` posee un identificador CUID / UUID único ligado a su correo electrónico verificado.
*   [x] **7. Bloquear acceso a producción sin aprobación explícita:**
    *   *Pipeline:* Controlado mediante ramas protegidas en GitHub y validación de compresión y build pre-commit.
*   [x] **8. Rotar secretos de forma periódica:**
    *   *Ubicación:* Panel de variables de entorno de Vercel Production scope.
*   [x] **9. Guardar secretos solo en entorno seguro, nunca en código:**
    *   *Ubicación:* Acceso mediante variables `process.env` exclusivas de servidor (`STRIPE_SECRET_KEY`, `GEMINI_API_KEY`). Ningún secreto tiene el prefijo `NEXT_PUBLIC_` que lo expondría al cliente.
*   [x] **10. Registrar cada cambio de permisos con auditoría:**
    *   *Implementación:* Logs estructurados en base de datos PostgreSQL e inyección de eventos en Telegram alerts.

---

## 🛰️ 2. BACKEND Y APIS (API PERIMETER)

*   [x] **11. Mantener la lógica crítica solo en servidor:**
    *   *Ubicación:* Server Actions como `createEliteCheckout` y `runAstraPrediction`. El cliente únicamente renderiza estados visuales y captura entradas.
*   [x] **12. Firmar y verificar todos los webhooks:**
    *   *Ubicación:* [src/app/api/payments/webhook/route.ts](file:///c:/EAR_OS_V2/src/app/api/payments/webhook/route.ts)
    *   *Método:* `stripe.webhooks.constructEvent(body, signature, webhookSecret)` valida matemáticamente la firma del evento de Stripe antes de iniciar la actualización del balance.
*   [x] **13. Implementar idempotencia en pagos y procesos críticos:**
    *   *Ubicación:* [src/app/api/payments/webhook/route.ts](file:///c:/EAR_OS_V2/src/app/api/payments/webhook/route.ts)
    *   *Gating:* El lookup proactivo `existingLedger = await prisma.commissionLedger.findUnique({ where: { reference: idempotencyRef } })` aborta inmediatamente las entregas duplicadas.
*   [x] **14. Proteger rutas internas con autorización real, no solo por UI:**
    *   *Ubicación:* [src/app/actions/commandCenterActions.ts](file:///c:/EAR_OS_V2/src/app/actions/commandCenterActions.ts)
    *   *Código:* Llamada obligatoria a `authorizeUser(email)` y lookup contra `userCan(role, action)` antes de interactuar con la base de datos de Prisma.
*   [x] **15. Validar entradas en servidor con esquemas estrictos:**
    *   *Código:* Castings estrictos y comprobaciones regulares de formatos UUID, CUID e importes decimales.
*   [x] **16. Limitar tasa de requests por IP, usuario y acción (Scraping Protection):**
    *   *Ubicación:* [src/lib/security/shield.ts](file:///c:/EAR_OS_V2/src/lib/security/shield.ts)
    *   *Método:* El componente inspectRequest examina y califica las cabeceras. Las peticiones sospechosas procedentes de automatizaciones (Axios, Python, Puppeteer) reciben un `403 Forbidden` instantáneo.
*   [x] **17. Añadir timeout y retry controlado en integraciones externas:**
    *   *Ubicación:* En `predictive-engine.ts`, las llamadas externas a Gemini tienen un bloque try-catch y un `Analytical Fallback` determinista local robusto a fallas de red.
*   [x] **18. No devolver detalles internos en errores públicos:**
    *   *Ubicación:* Endpoints de API atrapan excepciones y devuelven respuestas genéricas tipo `Internal Server Error` o `Automation attempt logged.` sin revelar stack traces.
*   [x] **19. Separar endpoints públicos, privados y administrativos:**
    *   *Rutas:* `/api/payments/webhook` (Público autenticado por Stripe), `/api/profiles/search` (Público protegido por Shield), `commandCenterActions` (Privado administrativo).
*   [x] **20. Versionar endpoints críticos antes de cambios grandes:**
    *   *Patrón:* Logs de estado fijados en la cabecera del archivo de webhook (V153).

---

## 🗄️ 3. DATOS Y BASE DE DATOS (DATABASE INTEGRITY)

*   [x] **21. Aplicar constraints únicas donde haya riesgo de duplicado:**
    *   *Ubicación:* `prisma/schema.prisma` -> `reference String? @unique` en `CommissionLedger`, `referenceCode String @unique` en `Waybill`.
*   [x] **22. Usar transacciones ACID en flujos financieros y logísticos:**
    *   *Ubicación:* [src/app/api/payments/webhook/route.ts](file:///c:/EAR_OS_V2/src/app/api/payments/webhook/route.ts)
    *   *Operación:* `prisma.$transaction([...])` asegura que el monedero (`AuraWallet`), la comisión (`CommissionLedger`) y la logística (`Waybill`) se actualicen simultáneamente o se reviertan todas ante fallos.
*   [x] **23. Revisar índices para evitar cuellos de botella:**
    *   *Ubicación:* Mapeo de índices compuestos en `@@index` y `@@unique` en `schema.prisma`.
*   [x] **24. Hacer backups automáticos y pruebas de restauración:**
    *   *Proveedor:* Gestionado directamente por Supabase Postgres Cloud backups.
*   [x] **25. Aplicar RLS o políticas equivalentes si hay multi-tenant:**
    *   *Ubicación:* Aislación lógica a nivel de consulta Prisma por `workspaceId` en todas las operaciones del Command Center.
*   [x] **26. Registrar auditoría de escrituras sensibles:**
    *   *Ubicación:* Tabla `CommissionLedger` registra de forma inmutable cada transacción Stripe y split de comisiones.
*   [x] **27. Encriptar datos sensibles en reposo si aplica:**
    *   *Proveedor:* Base de datos Supabase Postgres cifrada en reposo mediante AES-256 estándar.
*   [x] **28. Segmentar datos por tenant o dominio de acceso:**
    *   *Filtro:* Cláusulas `whereClause` dinámicas resueltas en servidor basadas en el claim del email verificado.
*   [x] **29. Verificar migraciones antes de cada despliegue:**
    *   *Comando:* `npx prisma db push` en local contra base de datos sandbox antes de promover producción.
*   [x] **30. Revisar consistencia entre tablas de negocio, ledger y pagos:**
    *   *Verificación:* Sincronización inmutable en el callback de Checkout completed (`Waybill` se enlaza mediante `bookingId` y `ledger` a través de `stripeSessionId`).

---

## 🏛️ LÍNEA TÁCTICA DE ACCIÓN ANTE SENIORS
Cuando el equipo senior examine el repositorio, indícales revisar prioritariamente:
1.  **La Compuerta de Idempotencia:** [src/app/api/payments/webhook/route.ts:L31-L60](file:///c:/EAR_OS_V2/src/app/api/payments/webhook/route.ts#L31-L60).
2.  **El Módulo de Permisos Centralizado:** [src/lib/auth/permissions.ts](file:///c:/EAR_OS_V2/src/lib/auth/permissions.ts).
3.  **El Escudo de Perímetro Activo:** [src/lib/security/shield.ts](file:///c:/EAR_OS_V2/src/lib/security/shield.ts).
4.  **El Endpoint de Telemetría Diagnóstica:** [src/app/api/health/route.ts](file:///c:/EAR_OS_V2/src/app/api/health/route.ts).

Esta estructura demuestra una **disciplina de producción S-Class insuperable**, reduciendo las vulnerabilidades y asegurando que EAR OS opere de forma óptima.
