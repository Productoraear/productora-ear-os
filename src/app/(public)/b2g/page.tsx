import React from 'react';
import { Metadata } from 'next';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';

export const metadata: Metadata = {
  title: 'Producción B2G para Ayuntamientos e Instituciones | Productora EAR',
  description: 'Contratación pública menor (<15.000€) bajo LCSP, alumbrado navideño monumental, fiestas patronales y sonorización de actos oficiales.',
  alternates: {
    canonical: 'https://www.productoraear.com/b2g',
  }
};

export default function B2GPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <BespokeTemplate
        title="Licitaciones B2G & Producción Municipal para Ayuntamientos"
        description="Gestión integral de eventos públicos, fiestas patronales, conciertos y alumbrado navideño con cumplimiento estricto LCSP y seguro de responsabilidad civil."
        location="Madrid"
        province="Madrid"
        category="Ayuntamientos B2G"
        serviceId="b2g"
        isApex={true}
      />
    </main>
  );
}
