'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { VendorClaimProposalModal } from './VendorClaimProposalModal';

interface ProviderFooterClaimBannerProps {
  provider: {
    id: string;
    name: string;
    slug: string;
    category: string;
    province: string;
    phone?: string;
  };
}

export const ProviderFooterClaimBanner: React.FC<ProviderFooterClaimBannerProps> = ({ provider }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cleanName = (provider.name || '')
    .replace(/Restáaurante/gi, 'Restaurante')
    .replace(/Restáurante/gi, 'Restaurante');

  const locationName = (provider.province || 'España').split(',')[0];

  return (
    <>
      <div className="p-6 sm:p-8 rounded-[2rem] bg-gradient-to-r from-[#0c0c14] via-[#09090f] to-black border-2 border-[#ecb613]/50 shadow-[0_15px_60px_rgba(236,182,19,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 my-10 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#ecb613]/20 text-[#ecb613] font-mono text-[10px] uppercase font-bold border border-[#ecb613]/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles size={13} /> DIRECTORIO PROFESIONAL // PROPUESAT S-CLASS 2026
            </span>
            <span className="text-[10px] font-mono text-zinc-400">LSSI Art. 16 · RGPD Art. 6.1.f</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-syne text-white tracking-tight">
            ¿Eres el titular o director de <span className="text-[#ecb613]">{cleanName}</span>?
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
            Reclama tu perfil en 1-clic <strong className="text-white">100% GRATIS</strong> y consulta la propuesta de aceleración comercial con <strong className="text-[#ecb613]">126 Landings Dedicadas y Garantía de Retorno ROI por Contrato</strong> en {locationName}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full lg:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-[#ecb613] via-amber-500 to-amber-600 hover:from-amber-400 hover:to-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-xl shadow-amber-950/50 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound size={16} />
            <span>Ver Propuesta & Reclamar Ficha</span>
            <ArrowRight size={16} />
          </button>

          <a
            href={`/api/providers/opt-out?slug=${provider.slug}`}
            className="w-full sm:w-auto px-4 py-4 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 font-mono text-xs rounded-2xl transition-all text-center"
          >
            Retirada 1-clic
          </a>
        </div>
      </div>

      {/* Modal de Propuesta Ejecutiva & Reclamación */}
      <VendorClaimProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        provider={{ ...provider, name: cleanName }}
      />
    </>
  );
};
