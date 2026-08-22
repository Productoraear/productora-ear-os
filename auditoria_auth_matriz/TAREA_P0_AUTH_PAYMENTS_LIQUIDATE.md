# Tarea P0 — Protección de /payments/liquidate

Identificador: AUTH-P0-PAYMENTS-LIQUIDATE
Registrada: 2026-08-03 18:06:49
Estado: BLOQUEO_RELEASE_PENDIENTE_APROBACION
Prioridad: P0

## HECHO_VERIFICADO

- La auditoría localizó la ruta /payments/liquidate.
- La ruta se identifica como sensible porque gestiona liquidación de pagos.
- No se observó evidencia local autorizada de autenticación dentro de la ruta.
- No se localizó middleware.* aplicable durante la auditoría de alcance.

## RIESGO_CONFIRMADO

- Una operación de liquidación puede quedar accesible sin una barrera de autenticación verificable.

## ACCIÓN REQUERIDA

- Definir quién puede liquidar pagos: administrador, personal financiero o proceso interno autenticado.
- Diseñar una protección explícita de autenticación y autorización antes de cualquier operación financiera.
- Implementar únicamente mediante una tarea de cambio separada y aprobada.
- Validar después mediante pruebas controladas y una nueva auditoría.

## PROHIBIDO HASTA APROBACIÓN

- No modificar route.*, Firebase, tokens, variables de entorno, Stripe, proveedores de pago ni configuración.
- No ejecutar liquidaciones reales, builds, despliegues, migraciones o Git de escritura.

## CONDICIÓN DE CIERRE

- Existe evidencia técnica de autenticación aplicable antes de la operación de liquidación.
- Existe autorización explícita para el rol o proceso que puede liquidar.
- Una prueba controlada confirma rechazo sin credenciales válidas.
- Una auditoría posterior clasifica la ruta como PROTEGIDA.
