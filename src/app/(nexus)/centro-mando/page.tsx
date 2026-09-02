import React from 'react';
import { LogisticsDashboard } from '@/modules/Nexus/LogisticsDashboard';

export const metadata = {
  title: 'Centro de Mando Logístico | EAR OS S-Class',
  description: 'Control de flota, activos y rigging en tiempo real.',
};

export default function CentroMandoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <LogisticsDashboard />
    </div>
  );
}
