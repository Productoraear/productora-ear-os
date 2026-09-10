import type { Metadata } from 'next';
import HunterPanel from '@/modules/SClassScreens/panels/HunterPanel';

export const metadata: Metadata = {
  title: 'Hunter Engine · EAR OS Nexus',
  description: 'S-Class Infiltration & Intelligence Gathering — panel táctico de caza de leads B2B.',
};

export default function HunterAdminPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <HunterPanel />
      </div>
    </div>
  );
}