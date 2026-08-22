# Tarea P0 — Protección de /admin/demand-map

Identificador: AUTH-P0-ADMIN-DEMAND-MAP
Registrada: 2026-08-03 17:50:55
Estado: BLOQUEO_RELEASE_PENDIENTE_APROBACION
Prioridad: P0

## HECHO_VERIFICADO

- La auditoría localizó la ruta administrativa /admin/demand-map.
- No se observó evidencia local autorizada de autenticación dentro de la ruta.
- No se localizó middleware.* aplicable durante la auditoría de alcance.

## RIESGO_CONFIRMADO

- La ruta administrativa puede quedar accesible sin una barrera de autenticación verificable.

## ACCIÓN REQUERIDA

- Diseñar una protección explícita de autenticación y autorización para la ruta.
- Definir qué rol o roles pueden acceder.
- Implementar únicamente mediante una tarea de cambio separada y aprobada.
- Validar después mediante pruebas controladas y una nueva auditoría.

## PROHIBIDO HASTA APROBACIÓN

- No modificar route.*, middleware, Firebase, tokens, variables de entorno ni configuración.
- No ejecutar builds, tests, despliegues, migraciones o Git de escritura.

## CONDICIÓN DE CIERRE

- Existe evidencia técnica de control de acceso aplicable.
- La política de roles está documentada.
- Una auditoría posterior clasifica la ruta como PROTEGIDA.
