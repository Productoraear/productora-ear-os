import React from 'react';
import { Metadata } from 'next';
import EcosystemMindMap from '@/app/components/ecosystem/EcosystemMindMap';

export const metadata: Metadata = {
  title: 'Ecosistema Productora EAR | Arquitectura Organizacional S-Class',
  description: 'Navegador interactivo del ecosistema de Productora EAR: Artistas, Eventos B2C, Empresas B2B, Instituciones B2G, Proyecto VIMUME y Nexus Transaccional.',
  robots: 'index, follow',
};

export default function EcosistemaPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black pt-20 pb-24">
      <EcosystemMindMap />
    </div>
  );
}
