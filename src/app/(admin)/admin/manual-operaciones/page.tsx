import React from 'react';
import { Metadata } from 'next';
import OperationalTrainingManual from '@/components/admin/OperationalTrainingManual';

export const metadata: Metadata = {
  title: 'Manual de Operaciones EAR OS 2030-2050 | Omni-Cockpit',
  description: 'Doctrina de inducción y protocolos operativos militares para agentes, marketing, rodaje 4K y CEO.'
};

export default function ManualOperacionesPage() {
  return (
    <div className="py-6">
      <OperationalTrainingManual />
    </div>
  );
}
