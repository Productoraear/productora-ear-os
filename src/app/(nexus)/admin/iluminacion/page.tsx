import type { Metadata } from 'next';
import { ChristmasLightingB2GPanel } from '@/components/admin/ChristmasLightingB2GPanel';

export const metadata: Metadata = {
  title: 'Iluminación B2G · EAR OS Nexus',
  description: 'Catálogo Soberano de Iluminación y Licitaciones Municipales — CPV 31522000 (Alumbrado Navideño).',
};

export default function IluminacionAdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <ChristmasLightingB2GPanel />
      </div>
    </div>
  );
}