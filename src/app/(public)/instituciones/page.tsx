import React from 'react';
import { Metadata } from 'next';
import B2GInstitutionalPortal from '@/components/b2g/B2GInstitutionalPortal';

export const metadata: Metadata = {
  title: 'Canal Instituciones & Administraciones Públicas (Art. 118 LCSP) | Productora EAR',
  description: 'Gabinete técnico para Administraciones Locales, Ayuntamientos y Diputaciones. Contratación menor simplificada, facturación FACe y programas ODS 2030.',
  alternates: {
    canonical: 'https://www.productoraear.com/instituciones',
  },
};

export default function InstitucionesPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <B2GInstitutionalPortal />
    </main>
  );
}
