<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\memoria EAR OS\04-Runbooks_y_Despliegues\Runbook de Rollback.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 3F2FA5A4E7ADADE6BA4DC9301BBA37A9446794C7B85CAA334BEB9F2DE97C6D36
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🔄 Runbook de Rollback - Protocolo de Contingencia de Emergencia

Esta nota define las acciones inmediatas para restaurar el estado operativo estable del sistema EAR OS si una promoción de producción introduce fallas imprevistas.

---

## 🚨 Niveles de Emergencia

### Nivel 1: Falla Crítica de UI/Navegación
*   *Síntomas:* Componentes rotos, loops de redirección o 404 generalizados.
*   *Acción:* Rollback instantáneo de build en el panel de control de Vercel (Redeploy de versión previa en 1 clic).

### Nivel 2: Falla de Conexión o Integración de APIs (Stripe/Firebase)
*   *Síntomas:* Cobros duplicados, webhooks caídos (500) o denegación de Base de Datos.
*   *Acción:* 
    1. Pausar la pasarela de pagos desde el dashboard de Stripe.
    2. Revertir cambios locales en Git a la última versión certificada (`main`).
    3. Re-desplegar forzadamente vía CLI o Git Push.

---

## ⚡ Secuencia de Comandos para Rollback en Git

Para deshacer localmente y forzar el estado anterior en el servidor remoto:

```bash
# 1. Identificar el último commit estable
git log --oneline

# 2. Retornar el HEAD local al commit seleccionado
git reset --hard <ESTABLE_COMMIT_HASH>

# 3. Forzar la subida a GitHub para re-desplegar de forma automática
git push origin main --force
```

---

## 🔗 Notas Relacionadas
*   [[Runbook de Deploy a Vercel]] - Flujo regular de despliegue.
*   [[Webhook de Stripe Connect]] - Monitoreo contable reactivo.
