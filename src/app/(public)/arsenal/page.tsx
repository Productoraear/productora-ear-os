import React from 'react';
import { Metadata } from 'next';
import ArsenalTecnicoView from '@/features/arsenal/ui/ArsenalTecnicoView';

export const metadata: Metadata = {
  title: 'El Arsenal Técnico | Infraestructura y Equipos Audiovisuales S-Class',
  description: 'Alquiler de Pantallas LED, Monitores 4K, Sonido Line Array VTX A8, Iluminación y Escenarios en Madrid y toda España bajo el dominio productoraear.com.',
  alternates: {
    canonical: 'https://www.productoraear.com/arsenal',
  }
};

export default function ArsenalPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <ArsenalTecnicoView />
    </main>
  );
}
