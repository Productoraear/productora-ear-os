import type { Metadata } from 'next';
import CeoCockpitHub from '@/components/admin/CeoCockpitHub';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Cockpit CEO · Cartuchos ejecutivos & Matriz 8 Ejes · EAR OS',
  description:
    'Matriz multi-rol de 8 dimensiones y rack de habilidades locales que emiten liquidaciones, contratos y dossiers reales con cierre SHA-256.',
  robots: { index: false, follow: false },
};

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /admin/cockpit — CONSOLA DE EJECUCIÓN DEL CEO
 * ════════════════════════════════════════════════════════════════════════════
 * Aloja la Matriz Canónica Multi-Rol de 8 Ejes (VisionInput) y el Rack de
 * cartuchos ejecutivos del servidor.
 * ════════════════════════════════════════════════════════════════════════════
 */
export default function CeoCockpitPage() {
  return (
    <div className="mx-auto max-w-6xl pb-16">
      <CeoCockpitHub />
    </div>
  );
}
