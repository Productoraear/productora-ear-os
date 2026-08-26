'use client';

import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';

export type TunnelProfile = 'solista' | 'mariachi' | 'productora' | 'vimume' | 'b2b' | string;

export interface InstantNeuralTunnelModalProps {
  activeProfile?: TunnelProfile;
  isOpen?: boolean;
  onClose?: () => void;
}

export function InstantNeuralTunnelModal({
  activeProfile = 'solista'
}: InstantNeuralTunnelModalProps) {
  const { isOpen, closeTunnel } = useNeuralTunnelStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#050505] border border-[#ecb613]/30 p-8 rounded-2xl max-w-lg w-full text-center shadow-[0_0_50px_rgba(236,182,19,0.15)]">
        <h2 className="text-2xl font-syne font-bold text-[#ecb613] mb-2">Túnel Neural Activo</h2>
        <p className="text-xs uppercase tracking-widest text-[#ecb613]/60 mb-4">Perfil: {activeProfile}</p>
        <p className="text-gray-400 mb-6 text-sm">Iniciando protocolo de cotización rápida y despacho B2B.</p>
        <button 
          onClick={closeTunnel}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all text-sm font-medium"
        >
          Cerrar Túnel
        </button>
      </div>
    </div>
  );
}

export default InstantNeuralTunnelModal;