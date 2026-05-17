import React from 'react';
import ArsenalTechnical from '@/components/SClass/ArsenalTechnical';

export const metadata = {
  title: 'Arsenal Técnico S-Class | Productora EAR',
  description: 'Gobernanza de recursos, fincas de eventos, proveedores y material técnico de Edwin Agudelo. Catálogo unificado y normalizado.',
};

export default function ArsenalPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-16">
      <ArsenalTechnical />
    </main>
  );
}
