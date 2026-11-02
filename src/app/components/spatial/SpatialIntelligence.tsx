/**
 * W47_T01 · ANTI-FRANKENSTEIN — Componente neutralizado (tumba deliberada).
 *
 * Historia: montaba `useBiometricIntent()`, que registraba un listener global de
 * `mousemove` y, tras 1,5 s de ratón casi quieto, ejecutaba
 * `setIsPricerOpen(true)` → `BespokePricerModal` saltaba encima de la ficha o
 * del cotizador sin un solo clic del usuario. Eso es un modal zombi: rompe la
 * compra, no la mejora.
 *
 * Estado actual: 0 listeners globales, 0 disparos automáticos, 0 capas `fixed`.
 * No se monta en `src/app/layout.tsx`. Se conserva el export para no romper
 * importaciones históricas: si alguien vuelve a montarlo, no pasa nada.
 */
export function SpatialIntelligence() {
  return null;
}


