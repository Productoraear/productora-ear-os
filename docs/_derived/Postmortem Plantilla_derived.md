<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\memoria EAR OS\05-Registros_y_Decisiones\Postmortem Plantilla.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: C39010BB5664BA234137019EA4B5BBEAB23AE56F91E21A00D7E3430D17CE784E
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 📝 Postmortem Plantilla - Análisis Forense de Incidentes

Esta nota sirve como plantilla base para documentar e investigar incidentes operacionales graves en producción (caídas de servicio, fallas de cobro, intrusiones), garantizando que el sistema aprenda y se endurezca.

---

## 🚨 [INC-00X] Título del Incidente

*   **Fecha de Ocurrencia:** YYYY-MM-DD
*   **Duración total:** XX horas / minutos
*   **Severidad:** Crítica / Alta / Media
*   **Autor del Análisis:** Ingeniero principal / Antigravity

---

### 1. Resumen Ejecutivo
*Breve descripción de qué falló, cuál fue el impacto directo en los clientes o artistas, y cómo se resolvió en primera instancia.*

### 2. Cronología de los Hechos (Timeline)
*   **HH:MM:** Inicia la anomalía o se reporta el error.
*   **HH:MM:** El escudo perimetral (`shield.ts`) o alerta de Telegram notifica al operador.
*   **HH:MM:** Diagnóstico del problema e identificación de la causa raíz.
*   **HH:MM:** Aplicación del rollback o hotfix en producción.
*   **HH:MM:** Restauración completa de servicios.

### 3. Causa Raíz (Root Cause Analysis)
*Detallar a nivel de base de datos o lógica de servidor por qué ocurrió la falla (ej. bloqueo de conexiones PostgreSQL, firma incorrecta de Stripe, etc.).*

### 4. Acciones de Mitigación Futura
- [ ] **Acción 1:** Solución inmediata del bug.
- [ ] **Acción 2:** Integración en el preflight de despliegue.
- [ ] **Acción 3:** Endurecimiento en el checklist de hardening.

---

## 🔗 Notas Relacionadas
*   [[Runbook de Rollback]] - Protocolo de contingencia rápida.
*   [[Indice Central]] - Retorno al menú central.
