import { CommercialEventCalculator } from '@/components/calculator/CommercialEventCalculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizador de Eventos en 1 Clic // Precios Oficiales S-Class | Productora EAR',
  description: 'Calculador oficial de presupuestos para bodas, mariachis, fincas y eventos corporativos con logística desde Méntrida, Split 80/10/10 y fianza protegida Stripe de 100 €.',
};

export default function CalculadoraPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 md:px-12 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto">
        <CommercialEventCalculator />
      </div>
    </div>
  );
}
