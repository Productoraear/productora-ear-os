import React from 'react';
import type { Metadata } from 'next';
import { SovereignAppUiKitCollection } from '@/components/harvested/SovereignAppUiKitCollection';

export const metadata: Metadata = {
  title: 'App UI Kit Collection · Productora EAR OS',
  description:
    'Colección de 64 componentes modulares React 19 y 10 pantallas completas autónomas con selector interactivo inspirado en HorizonX.',
};

export default function AppUiKitPage() {
  return (
    <main>
      <SovereignAppUiKitCollection />
    </main>
  );
}

