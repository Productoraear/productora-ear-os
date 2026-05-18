# 🛡️ Checklist de Hardening - Matriz de Seguridad S-Class

Esta nota detalla el cumplimiento e implementación física de los 30 controles de endurecimiento y seguridad para **EAR OS**.

---

## 🏛️ Identidad y Acceso

1. **MFA Obligatoria para Administradores:** Implementado en consola Supabase/Firebase Auth.
2. **RBAC Centralizado (`permissions.ts`):** Lógica unificada para control por rol en `src/lib/auth/permissions.ts`.
3. **Mínimo Privilegio:** Restricción de lectura y mutación por rol (ej. `EXPLORADOR` no puede editar nada).
4. **Secretos Rotados:** Las API keys se gestionan en entornos protegidos de Vercel/Render.
5. **Auditoría de Acciones:** Registro de logs en Firestore para mutaciones críticas de la consola CommandCenter.

---

## 💳 Backend y APIs (Stripe Connect)

6. **Lógica Exclusiva en Servidor:** Todos los balances e intercambios contables corren en Server Actions.
7. **Idempotencia Atómica:** Prevención de doble procesamiento en Stripe Webhook usando `CommissionLedger.reference` indexado como restricción `UNIQUE`.
8. **Transacciones ACID `$transaction`:** Split del cobro (Infraestructura, Retención, Artista) consolidado de forma atómica en Prisma PostgreSQL.
9. **Defensa Perimetral Activa (`shield.ts`):** Detección pasiva y bloqueo instantáneo de bots y scrapers.
10. **Aislamiento de Invitados:** Creación e identificación de usuarios temporales con rol determinista sin consultas aleatorias.

---

## 🔗 Notas Relacionadas
*   [[Esquema General]] - Topología perimetral.
*   [[Webhook de Stripe Connect]] - Lógica contable.
