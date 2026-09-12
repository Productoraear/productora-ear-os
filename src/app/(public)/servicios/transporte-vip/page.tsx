import { Metadata } from 'next';
import ChauffeurVipView from '@/features/chauffeur/ui/ChauffeurVipView';

export const metadata: Metadata = {
  title: 'Flota VIP & Chauffeur S-Class | Productora EAR',
  description: 'Logística de transporte privado de alta gama, blindaje ejecutivo y traslados para artistas y eventos S-Class en España.',
};

export default function TransporteVipPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white">
      <ChauffeurVipView location="Madrid" />
    </main>
  );
}
