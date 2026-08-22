# PANEL PARA TI — Seguridad de rutas EAR OS

Actualizado: 2026-08-03 18:15:49

## Lo importante

Hay 3 bloqueos de release activos.
No publiques ni despliegues cambios relacionados con administración, liquidación de pagos o webhooks de pagos hasta resolverlos.

## Bloqueo 1 — Administración

Ruta: /admin/demand-map
Problema: no se encontró protección verificable.
Primera corrección pendiente: decidir qué roles pueden acceder y añadir una barrera de autenticación/autorización aprobada.
Después: prueba sin sesión, prueba con usuario normal y prueba con administrador.

## Bloqueo 2 — Liquidación

Ruta: /payments/liquidate
Problema: no se encontró autenticación verificable antes de una operación financiera sensible.
Primera corrección pendiente: definir qué persona o proceso interno puede liquidar pagos y exigir autenticación antes de operar.
Después: prueba sin credenciales, prueba con usuario no autorizado y prueba con rol autorizado.

## Bloqueo 3 — Webhook

Ruta: /payments/webhook
Problema: la detección textual encontró posible procesamiento antes de validar la firma del proveedor.
Primera corrección pendiente: garantizar que la firma se verifica antes de leer, guardar o cambiar datos de pago.
Después: prueba con firma inválida y prueba con firma válida controlada.

## Orden recomendado

1. Resolver /admin/demand-map: es una ruta interna y permite crear el patrón de roles.
2. Resolver /payments/liquidate: aplica el patrón de autenticación reforzada a operaciones financieras.
3. Resolver /payments/webhook: requiere un patrón distinto, basado en firma del proveedor y no en login de usuario.

## Regla para Cline

Cline no puede modificar código hasta que el usuario apruebe una tarea concreta.
Cada tarea aprobada debe limitarse a una ruta, una lista cerrada de archivos y pruebas autorizadas.
Después de cada cambio: revisar diff, ejecutar solo las pruebas aprobadas y actualizar la auditoría.

## Siguiente decisión tuya

Cuando quieras comenzar, escribe exactamente: APRUEBO TAREA AUTH-P0-ADMIN-DEMAND-MAP.
Eso no ejecutará nada automáticamente: abrirá una fase de planificación con archivos permitidos, cambios propuestos, prueba y plan de reversión.
