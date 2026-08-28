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
      <div className="bg-gradient-to-b from-[#081226] to-[#040914] border border-[#AAD6CD]/30 p-8 rounded-3xl max-w-lg w-full text-center shadow-[0_20px_60px_rgba(8,18,38,0.95)]">
        <h2 className="text-2xl font-syne font-bold text-white mb-2">Túnel Neural Activo</h2>
        <p className="text-xs uppercase tracking-widest text-[#AAD6CD] mb-4">Perfil: {activeProfile}</p>
        <p className="text-zinc-300 mb-6 text-sm">Iniciando protocolo de cotización de alta fidelidad y despacho B2B con tecnología S-Class.</p>
        <button 
          onClick={closeTunnel}
          className="px-6 py-2.5 bg-[#258DCD] hover:bg-[#1e7ebd] text-white rounded-full transition-all text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(37,141,205,0.4)] cursor-pointer"
        >
          Cerrar Túnel
        </button>
      </div>
    </div>
  );
}

export default InstantNeuralTunnelModal;