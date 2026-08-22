# Tarea P0 — Validación segura de /payments/webhook

Identificador: AUTH-P0-PAYMENTS-WEBHOOK
Registrada: 2026-08-03 18:14:42
Estado: BLOQUEO_RELEASE_PENDIENTE_APROBACION
Prioridad: P0

## HECHO_VERIFICADO

- La auditoría localizó la ruta /payments/webhook.
- Se detectó evidencia de procesamiento antes de la primera evidencia de validación de firma.
- La evidencia textual sitúa el primer procesamiento detectado en línea 2 y la validación detectada en línea 26.

## RIESGO_CONFIRMADO

- Un webhook podría procesar eventos antes de verificar que proceden del proveedor de pagos.

## ACCIÓN REQUERIDA

- Revisar el flujo exacto y asegurar que la firma se valida antes de leer, guardar, actualizar o liquidar datos de pago.
- Rechazar explícitamente firmas inválidas antes de ejecutar cualquier efecto lateral.
- Implementar únicamente mediante una tarea de cambio separada y aprobada.
- Validar después con una prueba controlada de firma inválida y una prueba de firma válida.

## PROHIBIDO HASTA APROBACIÓN

- No modificar route.*, Stripe, secretos, variables de entorno, configuración, Git ni infraestructura.
- No enviar webhooks reales ni ejecutar pagos, liquidaciones o despliegues.

## CONDICIÓN DE CIERRE

- La validación de firma ocurre antes de todo efecto lateral.
- Una prueba con firma inválida es rechazada sin cambios de datos.
- Una prueba con firma válida procesa exclusivamente el evento esperado.
- Una auditoría posterior clasifica la ruta como PROTEGIDA.
