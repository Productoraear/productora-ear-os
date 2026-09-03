import React from 'react';
import CommandCenterDashboard from '@/components/sclass/ArsenalTechnical';

export const metadata = {
  title: 'Centro de Mando EAR | Comandante S-Class',
  description: 'Cuadro de mando e infraestructura soberana de Edwin Agudelo. Telemetría de flotas, scraping autónomo y balances atómicos.',
};

export default function CommandCenterPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-16">
      <CommandCenterDashboard />
    </main>
  );
}
