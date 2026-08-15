import React from 'react';
import RoleSelectionGateway from '@/components/onboarding/RoleSelectionGateway';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EAR OS V2 :: Gateway Soberano de Acceso',
  description: 'Selección de perfil operativo e institucional para Productora EAR, VIMUME y Fincas para Bodas.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center relative overflow-hidden">
      {/* Capa de atmósfera visual Aura Onyx */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ecb613]/10 via-[#050505]/80 to-[#050505] pointer-events-none" />
      
      {/* Selector de 4 Perfiles Soberano */}
      <RoleSelectionGateway />
    </main>
  );
}