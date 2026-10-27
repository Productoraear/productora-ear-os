import { permanentRedirect } from 'next/navigation';

/**
 * 💒 CANONICAL WEDDING CONSOLIDATION
 * Redirige la variante singular /boda a la ruta canónica plural /bodas (308 Permanent).
 */
export default function BodaRootRedirect() {
  permanentRedirect('/bodas');
}
