'use client';

import React from 'react';
import { ShieldCheck, X, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ClaimProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider?: {
    id: string;
    name: string;
    slug?: string;
    category?: string;
    province?: string;
    phone?: string;
  } | null;
  onClaimSuccess?: (providerId: string, token: string) => void;
}

export const ClaimProviderModal: React.FC<ClaimProviderModalProps> = ({
  isOpen,
  onClose,
  provider,
  onClaimSuccess
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0d0d12] border border-[#ecb613]/30 shadow-2xl text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613]">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">
              Verificación S-Class
            </h3>
            <p className="text-xs text-[#ecb613] font-mono">
              {provider?.name || 'Proveedor Oficial'}
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed font-light">
          El módulo de reclamo automatizado 2FA está en proceso de calibración para la provincia de {provider?.province || 'Madrid'}. Para reclamar tu perfil de forma prioritaria, contacta directamente con soporte técnico.
        </p>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => {
              if (onClaimSuccess && provider?.id) {
                onClaimSuccess(provider.id, 'mock-token-sclass');
              }
              onClose();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#d4a855] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle2 size={16} />
            <span>Confirmar Solicitud</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimProviderModal;
