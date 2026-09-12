import { Metadata } from 'next';
import { LiveCommandCenter } from '@/features/tour-logistics/ui/LiveCommandCenter';

export const metadata: Metadata = {
  title: 'Centro de Mando Logístico & Telemetría NASA | EAR Nexus',
  description: 'Telemetría en tiempo real de convoyes, estado de giras y posicionamiento de flota.',
};

export default async function FleetLiveAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tourId?: string }>;
}) {
  const params = await searchParams;
  const tourId = params.tourId || 'tour-sovereign-omega-2026';

  return (
    <main className="min-h-screen bg-[#030305] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="border-b border-white/10 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            NASA <span className="text-[#00E5FF]">FLEET COMMAND</span>
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Telemetría de convoyes, buses de producción y monitoreo de ruta en vivo.
          </p>
        </header>
        <LiveCommandCenter tourId={tourId} />
      </div>
    </main>
  );
}
