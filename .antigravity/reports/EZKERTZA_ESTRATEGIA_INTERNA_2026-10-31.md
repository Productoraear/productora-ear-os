# Ezkertza Berria · Incoherencias, oportunidades y estrategia (USO INTERNO — no publicar)

## Incoherencias encontradas (medidas en el código y en la página de producción)

| # | Incoherencia | Origen | Estado |
|---|---|---|---|
| 1 | "50 a 200 invitados" junto a "comedores hasta 350" | Ficha pública del venue = 50–200 en banquete nupcial; dossier de Eduardo = 350 en eventos ampliados | **Reconciliado en copy**: 50–200 banquete, 350 solo eventos ampliados confirmados en visita. **Falta que Eduardo confirme por escrito cuál es el máximo real de boda.** |
| 2 | "Tour 360º · 3 vídeos · 69 fotos" pero solo se mostraban 8 fotos y 1 vídeo | Cifras copiadas de la ficha del marketplace; el vampiro solo recuperó 12 fotos + 1 vídeo | **Corregido**: la página muestra solo lo que existe (12 fotos, 1 vídeo). Tour 360º eliminado (sin enlace verificable). |
| 3 | `slice(0, 8)` recortaba la galería | `EzkertzaVenueListing.tsx` | **Corregido**: se muestran todas las fotos; las URLs rotas se ocultan solas. |
| 4 | "Más de 100 parejas" frente a 23 opiniones | Son datos distintos y compatibles: 100+ contrataciones, 23 reseñas publicadas (≈ 1 de cada 4–5 reseña) | No es error, es **oportunidad** (ver abajo). |
| 5 | Copy que nombraba a la competencia y prometía "supera en un 1.000 %" | `otzarreta/page.tsx` | **Corregido**: sin nombres de terceros ni cifra no demostrable. |
| 6 | "Garantía 100 % de retorno: EAR OS asume el coste y sigue operando GRATIS" | `otzarreta/page.tsx` (copy del CEO) | **Pendiente de decisión**: es una promesa contractual; no está en el SSOT ni en contrato. Sin cláusula firmada es riesgo legal. |
| 7 | Cifras de lo que el venue paga a otros portales (2.500–4.800 €/año) | `otzarreta/page.tsx` | **Pendiente**: sin fuente verificable, no debería publicarse como hecho. |
| 8 | Tabla de 126 landings: "18 municipios × 4 formatos + 54 de intención" | Verificar que cada URL responde 200 con contenido propio | Pendiente de sonda en producción. |

## Oportunidad: de 100+ parejas a 100+ pruebas

Hoy 1 de cada 4–5 parejas que contrata deja opinión. La ficha vive de 23 opiniones; el 96 % recomienda.

1. **Seguimiento post-boda a 7 días** (WhatsApp de la Conserjería, un solo mensaje): fotos de la boda + enlace a opinión. Cada reseña nueva alimenta el carrusel.
2. **Pedir permiso de uso de foto y cita** en el mismo mensaje (también cubre el riesgo legal de publicar opiniones ajenas).
3. **Registro propio de bodas** (fecha, pax, menú) para demostrar "100+ parejas" con datos del propio restaurante, no con una cifra de un tercero.
4. **Cada boda con música EAR**: pedir una reseña que mencione la acústica. Es el único dato que ningún otro portal puede mostrar.

## Cómo defendemos a EAR sin nombrar a nadie

Hablar de empresario a empresario, con tres frases y un dato:

- *"Tu ficha es tuya, el contacto es tuyo, la fecha se bloquea con 100 € deducibles."*
- *"Si dejas de usarnos, te llevas tu histórico."* (verificar que el contrato lo recoja)
- *"Sin cuotas fijas: solo pagamos cuando entra una reserva."* (split 80/10/10)

Si el proveedor compara por su cuenta: dar datos, no adjetivos (nº de leads propios, tasa de cierre, euros bloqueados). Nunca "somos mejores que X".

## Qué NO está hecho todavía de tu petición (honesto)

- **Fusionar `/alquiler-equipos-sonido-audiovisuales` con el arsenal** y **galerías sin recorte en todos los proveedores**: aún no tocados. Requiere tarea propia (rutas, redirecciones 301 y modelo de datos).
- **Inventario/stock por proveedor con categorías libres**: requiere diseño de datos (Prisma) y panel de proveedor. Es un bloque P1 aparte.
- **Imágenes "aún no vampirizadas" para el hero**: no existen en disco; el hero usa las 3 primeras fotos reales y está listo para recibir más.

