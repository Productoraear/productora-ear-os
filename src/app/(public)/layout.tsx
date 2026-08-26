'use client';

import { InstantNeuralTunnelModal } from '@/components/sclass/InstantNeuralTunnelModal';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const isOpen = useNeuralTunnelStore((state) => state.isOpen);

  return (
    <div className="relative min-h-screen bg-[#050505]">
      {children}
      {/* Visualizador Reactivo Global con lectura explícita de estado */}
      {isOpen && <InstantNeuralTunnelModal isOpen={isOpen} />}
    </div>
  );
}