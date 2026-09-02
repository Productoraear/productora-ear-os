<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\EAR_OS_STYLE_AND_VERCEL_PREFLIGHT.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: FFDAA27BD82F1DB4BEFDCF1705ADE1ACCA62CC060AD915707C990587962643CC
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# EAR OS Preflight Style & Deployment

## 1) Visual system unificado
- Typography: unificar a 2 familias máximo, una display y una text, cargadas con `next/font` para evitar layout shift y requests externos.
- Weights: limitar a 3 pesos reales por familia; no mezclar variantes arbitrarias entre VIMUME, Productora EAR y EAR OS.
- Lettering: aplicar una escala única de tracking, line-height y casing para dashboards, landing y admin.
- Spacing: usar una escala 4/8/12/16/24/32/48 para todo el sistema.
- Radii, sombras y bordes: mantener un lenguaje visual consistente en todos los módulos.

## 2) Color unification
- Definir un token set compartido entre VIMUME y Productora EAR: `bg`, `surface`, `muted`, `text`, `accent`, `accent-2`, `danger`, `success`.
- Limitar la UI a una paleta corta y estable; los acentos deben sentirse de la misma familia cromática.
- Separar color funcional de color de marca: el primero manda en estados, el segundo en identidad.
- Reusar el mismo sistema de tokens en admin, marketing, cards, botones, mapas y estados vacíos.

## 3) UX direction
- Nada de embudos agresivos ni CTA prematuros: la interfaz debe dejar respirar la información.
- Priorizar lectura, contexto y jerarquía visual por encima de conversión inmediata.
- Los flujos deben ser visibles, no invasivos; el usuario debe entender el sistema sin presión.
- Cada pantalla debe parecer una consola editorial, no una landing de urgencia.

## 4) Before Vercel
- Verificar `npm run build` sin errores.
- Auditar variables de entorno en Vercel para producción, preview y development.
- Confirmar que `NEXT_PUBLIC_*` solo contiene valores públicos y que secretos quedan en runtime server.
- Revisar fuentes, imágenes, metadata, favicon, Open Graph y sitemap.
- Medir tamaño del bundle y eliminar imports innecesarios.
- Validar que no haya código cliente donde debe ser server component.
- Revisar rutas, redirects, headers y dominio final.

## 5) Must-have requests
- Unificar letras entre VIMUME, Productora EAR y EAR OS.
- Rehacer el diseño a ultra limpio, sin elementos sobrantes.
- Mantener la web lenta en el buen sentido: más contemplativa, menos ansiosa.
- Eliminar micro-ruido visual, duplicidades y decisiones de color no compartidas.
- Preparar un checklist final antes del despliegue a Vercel.

## 6) Status
- Design system: pending unification.
- Typography: pending consolidation.
- Color tokens: pending cross-brand alignment.
- Deploy readiness: pending final preflight.
