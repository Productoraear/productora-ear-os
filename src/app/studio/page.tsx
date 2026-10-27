import { permanentRedirect } from 'next/navigation';

/**
 * 🛰️ STUDIO ROOT DISPATCHER
 * Enruta la raíz /studio al búnker operativo de artistas /studio/artist.
 */
export default function StudioRootRedirect() {
  permanentRedirect('/studio/artist');
}
