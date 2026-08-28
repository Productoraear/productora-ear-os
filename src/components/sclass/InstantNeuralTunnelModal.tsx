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
      <div className="bg-[#0b0b10] border border-white/15 p-8 rounded-[2rem] max-w-lg w-full text-center shadow-[0_25px_70px_rgba(0,0,0,0.95)]">
        <h2 className="text-2xl font-syne font-bold text-white mb-2">Túnel Neural Activo</h2>
        <p className="text-xs uppercase tracking-widest text-[#ecb613] mb-4 font-mono">Perfil: {activeProfile}</p>
        <p className="text-zinc-400 mb-6 text-sm">Iniciando protocolo de cotización de alta fidelidad y despacho B2B con tecnología S-Class.</p>
        <button 
          onClick={closeTunnel}
          className="px-8 py-3 bg-[#ecb613] hover:bg-amber-400 text-black rounded-full transition-all text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_25px_rgba(236,182,19,0.3)] cursor-pointer"
        >
          Cerrar Túnel
        </button>
      </div>
    </div>
  );
}

export default InstantNeuralTunnelModal;