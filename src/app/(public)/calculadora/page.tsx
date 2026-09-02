import CostCalculator from '@/app/components/CostCalculator';
import { AcousticSpatialMatcher } from '@/app/components/SClassScreens/AcousticSpatialMatcher';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Match Acústico & Inventario Activo | Productora EAR',
  description: 'Calculador acústico por m² y aforo con inventario en tiempo real de altavoces Bose, L-Acoustics, Shure y Behringer.',
};

export default function CalculadoraPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-12 space-y-16">
      <div className="max-w-7xl mx-auto">
        <AcousticSpatialMatcher />
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-16">
        <CostCalculator />
      </div>
    </div>
  );
}
