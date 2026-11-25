import { permanentRedirect } from 'next/navigation';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * SANEAMIENTO CANÓNICO P0 — /celebraciones → /
 * ════════════════════════════════════════════════════════════════════════════
 * Erradicación definitiva de la ruta contaminada /celebraciones y sus CTAs
 * obsoletos. Redirección permanente 301 al escaparate canónico principal.
 * ════════════════════════════════════════════════════════════════════════════
 */
export default function CelebracionesPage(): never {
  permanentRedirect('/');
}
