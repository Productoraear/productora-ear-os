'use client';

import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

export default function BodasLandingPage() {
  const { openTunnel, isOpen } = useNeuralTunnelStore();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <h1 className="text-3xl font-syne text-[#ecb613] mb-4">Reserva de Bodas S-Class</h1>
      <button
        onClick={openTunnel}
        className="px-6 py-3 bg-[#ecb613] text-black font-bold rounded-xl shadow-lg"
      >
        {isOpen ? 'Túnel Desplegado' : 'Cotizar Fecha Instantánea'}
      </button>
    </div>
  );
}