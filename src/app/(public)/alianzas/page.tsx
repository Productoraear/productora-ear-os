import React from 'react';
import type { Metadata } from 'next';
import { AllianceNetwork } from '@/modules/SClassScreens/AllianceNetwork';

export const metadata: Metadata = {
  title: 'Red de Alianzas Estratégicas S-Class | Productora EAR',
  description: 'Red de colaboradores, fincas monumentales, wedding planners y empresas de catering de alta fidelidad homologadas en EAR OS.',
  keywords: ['alianzas bodas', 'fincas colaboradoras madrid', 'partners productora ear', 'catering homologado', 'wedding planners espana']
};

export default function AlianzasPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
      <div className="mb-8">
        <span className="text-xs uppercase font-mono tracking-widest text-[#00E5FF] px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20">
          ECOSISTEMA S-CLASS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-white mt-3">
          Red Soberana de Alianzas & Fincas Homologadas
        </h1>
        <p className="text-sm text-zinc-400 font-mono mt-1">
          Infraestructura de colaboración B2B con Split garantizado (80/10/10) y certificación de calidad técnica.
        </p>
      </div>

      <AllianceNetwork />
    </div>
  );
}
