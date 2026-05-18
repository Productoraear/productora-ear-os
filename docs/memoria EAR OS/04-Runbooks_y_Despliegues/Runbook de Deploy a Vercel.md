# 🚀 Runbook de Deploy a Vercel - Protocolo de Despliegue

Esta nota establece el protocolo oficial y obligatorio para realizar promociones estables a producción en la nube de Vercel.

---

## 📋 Lista de Pre-requisitos (Preflight)

Antes de realizar cualquier push a la rama de producción (`main`), el operador o ingeniero principal debe certificar:

1. **Compilación TypeScript Limpia:**
   ```bash
   npx tsc --noEmit
   ```
   *Debe retornar Exit Code 0. Prohibido omitir.*

2. **Next.js Production Build Test:**
   ```bash
   npm run build
   ```
   *Garantiza que no existan errores de hidratación, imports rotos o dependencias incompatibles en Turbopack.*

3. **Verificación de Secretos:**
   *Confirmar que no existen credenciales expuestas en archivos temporales o commits.*

---

## ⚙️ Variables de Entorno Requeridas en Producción

El panel de administración de Vercel debe disponer de los siguientes secretos inyectados en el entorno de `Production`:

*   `DATABASE_URL`: URI de conexión a PostgreSQL.
*   `STRIPE_SECRET_KEY`: Token de autenticación privado de Stripe.
*   `STRIPE_WEBHOOK_SECRET`: Secreto para verificar la firma de eventos entrantes.
*   `FIREBASE_SERVICE_ACCOUNT`: JSON serializado para autenticación de Firestore en servidor.
*   `TELEGRAM_BOT_TOKEN` & `TELEGRAM_CHAT_ID`: Para notificaciones del Escudo Perimetral y Ledger.

---

## 🔗 Notas Relacionadas
*   [[Esquema General]] - Topología de servicios.
*   [[Runbook de Rollback]] - Protocolo en caso de fallo crítico post-despliegue.
