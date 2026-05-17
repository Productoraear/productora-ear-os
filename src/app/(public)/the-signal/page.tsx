import React from 'react';
import TheSignalFunnel from '@/components/SClass/TheSignalFunnel';

export const metadata = {
  title: 'The Ear Signal | Certificación S-Class',
  description: 'Arquitectura de talento asimétrica de Edwin Agudelo. Si tu frecuencia es pura, el escenario te pertenece.',
};

export default function TheSignalPage() {
  return (
    <main className="min-h-screen bg-black pt-28 pb-16">
      <TheSignalFunnel />
    </main>
  );
}
