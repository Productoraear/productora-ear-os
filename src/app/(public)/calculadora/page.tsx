import { CommercialEventCalculator } from '@/components/calculator/CommercialEventCalculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizador de Eventos en 1 Clic // Precios Oficiales S-Class | Productora EAR',
  description:
    'Calculador oficial de presupuestos para bodas, mariachis, fincas y eventos corporativos con logística desde Méntrida, Split 80/10/10 y fianza protegida Stripe de 100 €.',
  openGraph: {
    title: 'Cotizador de Eventos en 1 Clic // Precios Oficiales S-Class | Productora EAR',
    description:
      'Calculador oficial de presupuestos para bodas, mariachis, fincas y eventos corporativos con logística desde Méntrida, Split 80/10/10 y fianza protegida Stripe de 100 €.',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Productora EAR',
  },
  twitter: {
    card: 'summary',
    title: 'Cotizador de Eventos en 1 Clic // Precios Oficiales S-Class | Productora EAR',
    description:
      'Calculador oficial de presupuestos para bodas, mariachis, fincas y eventos corporativos con logística desde Méntrida, Split 80/10/10 y fianza protegida Stripe de 100 €.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CalculadoraPage() {
  return (
    <main className="min-h-screen bg-[#030305] px-4 pb-20 pt-24 text-white selection:bg-[#ecb613] selection:text-black md:px-12">
      <div className="mx-auto max-w-7xl">
        <CommercialEventCalculator />
      </div>
    </main>
  );
}