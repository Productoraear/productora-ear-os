import React from 'react';
import { Metadata } from 'next';
import ArsenalTecnicoView from '@/features/arsenal/ui/ArsenalTecnicoView';
import { SplineHeroSClass } from '@/components/ui/SplineHeroSClass';

export const metadata: Metadata = {
  title: 'El Arsenal Técnico | Infraestructura y Equipos Audiovisuales S-Class',
  description: 'Alquiler de Pantallas LED P2.9 Novastar, Monitores 4K, Sonido Line Array VTX A8, Iluminación y Escenarios en Madrid y toda España bajo el dominio productoraear.com.',
  alternates: {
    canonical: 'https://www.productoraear.com/arsenal',
  }
};

export default function ArsenalPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <SplineHeroSClass
        title="Arsenal Audiovisual"
        subtitle="3D & Hardware de Élite"
        description="Pantallas LED P2.9 Novastar HDR de alto brillo, procesado 4K, sonido Line Array d&b / Bose F1 a 12 W/pax y microfonía inalámbrica Shure Axient con técnico in situ."
        primaryCtaText="Calcular Presupuesto"
        primaryCtaLink="/cotizador"
        secondaryCtaText="Consultar por WhatsApp"
        secondaryCtaLink="https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20deseo%20consultar%20disponibilidad%20del%20Arsenal%20Audiovisual%20LED%20y%20Sonido."
      />
      <div className="max-w-[1280px] mx-auto px-4">
        <ArsenalTecnicoView />
      </div>
    </main>
  );
}

