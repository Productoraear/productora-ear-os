'use client';

import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

export function DynamicContextBar() {
  const openTunnel = useNeuralTunnelStore((state) => state.openTunnel);
  const isOpen = useNeuralTunnelStore((state) => state.isOpen);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/60 backdrop-blur-md border-b border-white/10">
      <span className="text-xs font-mono text-[#ecb613]">EAR OS // S-CLASS</span>
      <button
        onClick={openTunnel}
        className="px-4 py-1.5 bg-[#ecb613] text-black font-mono font-bold text-xs uppercase rounded-full hover:scale-105 transition-all"
      >
        {isOpen ? 'Túnel Activo ⚡' : 'Desplegar Túnel ⚡'}
      </button>
    </div>
  );
}