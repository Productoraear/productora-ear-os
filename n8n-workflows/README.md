# Workflows n8n de Soporte y Blindaje — EAR OS S-Class

Directorio de workflows n8n listos para importar en `https://n8n.productoraear.com`.

## Cómo importar
1. Ve a tu proyecto: `https://n8n.productoraear.com/projects/BbHFu87gFWH2thL3/workflows`.
2. Botón **"Create Workflow"** → **"Import from File"**.
3. Selecciona el archivo `.json` correspondiente.
4. Configura las credenciales (Telegram, Google Drive, etc.) que pida cada nodo.
5. Activa el workflow con el interruptor **Active**.

## Workflows incluidos

| Archivo | Trigger | Función |
|---|---|---|
| `soporte-monitor-uptime.json` | Cron cada 5 min | Llama a `/api/support/health-check` y alerta si algo cae (Telegram/WhatsApp/Email escalonado). |
| `soporte-kpi-diario-0800.json` | Cron 08:00 Madrid | Genera el resumen ejecutivo diario y lo envía a Telegram. |
| `soporte-dlq-reintento.json` | Webhook | Recibe eventos fallidos y los reintenta contra el webhook de negocio original. |

## Variables de entorno requeridas (en n8n)
- `EAR_HEALTH_CHECK_URL` → `https://productoraear.com/api/support/health-check`
- `CRON_SECRET` → mismo secreto que en Vercel (header `Authorization: Bearer ...`).
- `EAR_KPI_URL` → endpoint del KPI radar (o el webhook `executive-kpi-radar`).
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` → para alertas.

## Nota S-Class
Estos workflows NO guardan ni re-hardcodean `verified:true`. Solo observan y alertan.
La fuente de verdad sigue siendo EAR OS (PostgreSQL/Prisma) y Stripe para pagos.