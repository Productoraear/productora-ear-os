'use client';

import React, { useState } from 'react';
import { ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { ClaimProviderModal } from '@/components/providers/ClaimProviderModal';

interface ClaimProfileTriggerProps {
  provider: {
    id: string;
    name: string;
    slug?: string;
    category?: string;
    province?: string;
    phone?: string;
  };
}

export const ClaimProfileTrigger: React.FC<ClaimProfileTriggerProps> = ({ provider }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#ecb613]/30 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider font-bold">
          <ShieldCheck size={16} />
          <span>¿Eres el propietario de {provider.name}?</span>
        </div>

        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
          Reclama tu ficha oficial mediante <strong className="text-white">Verificación en 2 Pasos (2FA)</strong>. Obtén tu insignia verificada, gestiona tus presupuestos y accede al split soberano del 80%.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-[#ecb613] text-white hover:text-black border border-white/10 hover:border-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          {isClaimed ? (
            <>
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Ficha Verificada con Éxito</span>
            </>
          ) : (
            <>
              <KeyRound size={15} className="text-[#ecb613]" />
              <span>Reclamar Ficha & Verificar en 2 Pasos</span>
            </>
          )}
        </button>
      </div>

      <ClaimProviderModal
        isOpen={isModalOpen}
        provider={provider}
        onClose={() => setIsModalOpen(false)}
        onClaimSuccess={(id, token) => {
          setIsClaimed(true);
          console.log(`[CLAIM COMPLETE] ${id} token ${token}`);
        }}
      />
    </>
  );
};
