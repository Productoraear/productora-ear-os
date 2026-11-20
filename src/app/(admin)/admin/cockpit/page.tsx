import type { Metadata } from 'next';
import CeoSkillsRack from '@/components/admin/CeoSkillsRack';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Cockpit CEO · Cartuchos ejecutivos · EAR OS',
  description:
    'Rack de habilidades locales que emiten liquidaciones, contratos y dossiers reales con cierre SHA-256. Cero tokens.',
  robots: { index: false, follow: false },
};

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /admin/cockpit — CONSOLA DE EJECUCIÓN DEL CEO
 * ════════════════════════════════════════════════════════════════════════════
 * Server Component delgado: la sesión ya la valida el layout de `(admin)` y el
 * middleware; el rack lee el catálogo real del servidor vía `GET /api/admin/skills`.
 * No se declaran cartuchos aquí: la única fuente es `src/lib/skills/registry.ts`.
 * ════════════════════════════════════════════════════════════════════════════
 */
export default function CeoCockpitPage() {
  return (
    <div className="mx-auto max-w-6xl pb-16">
      <CeoSkillsRack />
    </div>
  );
}
