'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, KeyRound, CheckCircle2, Sparkles, TrendingUp, DollarSign, MessageCircle } from 'lucide-react';
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

type VariantKey = 'A' | 'B' | 'C';

interface VariantConfig {
  badge: string;
  headline: string;
  description: string;
  ctaText: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
}

const VARIANTS: Record<VariantKey, VariantConfig> = {
  A: {
    badge: 'AHORRO FINANCIERO · 0€ CUOTAS FIJAS',
    headline: '¿Por qué pagar 150€/mes a portales intermediarios?',
    description: 'En EAR OS te ahorras más de 1.800€ al año. Recibe el 80% neto de tu caché sin cuotas fijas, con pasarela blindada y deducción fiscal VIMUME del 80% (Ley 49/2002) para tus parejas.',
    ctaText: 'Reclamar Ficha & Activar Split 80/10/10',
    icon: DollarSign,
    accentColor: '#ecb613'
  },
  B: {
    badge: 'RESERVA BLINDADA · STRIPE PRICE-LOCK 100€',
    headline: 'Cero regateos: contratos y fechas 100% blindadas',
    description: 'Cada cliente formaliza su fecha congelando un depósito de garantía inmutable de 100€ en Stripe. Tu perfil homologado en la red S-Class transmite prestigio y seriedad inmediata.',
    ctaText: 'Reclamar Ficha & Activar Garantía Stripe',
    icon: ShieldCheck,
    accentColor: '#00E5FF'
  },
  C: {
    badge: 'MODELO HÍBRIDO · RED DE ÉLITE S-CLASS',
    headline: 'Ahorro de 1.800€/año + Reserva Directa de Gala',
    description: 'Ahorro directo sin intermediarios, cobro ágil garantizado y homologación acústica y técnica con soporte 24/7 de Productora EAR para bodas de alta distinción en tu provincia.',
    ctaText: 'Reclamar Ficha Homologada S-Class',
    icon: Sparkles,
    accentColor: '#FF2B44'
  }
};

export const ClaimProfileTrigger: React.FC<ClaimProfileTriggerProps> = ({ provider }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [variant, setVariant] = useState<VariantKey>('A');

  useEffect(() => {
    // 1. Si viene por query param ?v=A|B|C, respetar la variante
    const params = new URLSearchParams(window.location.search);
    const paramV = params.get('v')?.toUpperCase() as VariantKey;
    if (paramV && VARIANTS[paramV]) {
      setVariant(paramV);
      return;
    }

    // 2. Rotación pseudo-aleatoria A/B/C equilibrada
    const keys: VariantKey[] = ['A', 'B', 'C'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setVariant(randomKey);
  }, []);

  const currentVariant = VARIANTS[variant];
  const IconComponent = currentVariant.icon;

  const handleClaimClick = async () => {
    // Registrar telemetría de conversión para Arena AI Elo
    try {
      fetch('/api/arena/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winnerId: `variant-${variant.toLowerCase()}`,
          loserId: variant === 'A' ? 'variant-b' : 'variant-a',
          context: `claim_profile_${provider.category || 'general'}`
        })
      }).catch(() => {});
    } catch {}

    setIsModalOpen(true);
  };

  const whatsappDirectMsg = encodeURIComponent(
    `Hola, soy el titular de ${provider.name} (${provider.province || 'España'}). He visto mi ficha pública en EAR OS y quiero reclamar mi perfil oficial con el Split 80/10/10 [Ref: VAR-${variant}].`
  );
  const whatsappDirectUrl = `https://wa.me/34693693048?text=${whatsappDirectMsg}`;

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-[#ecb613]/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider font-bold">
            <IconComponent size={16} />
            <span>{currentVariant.headline}</span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
            TEST {variant}
          </span>
        </div>

        <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#ecb613]/10 border border-[#ecb613]/30 text-[10px] font-mono font-bold text-[#ecb613]">
          {currentVariant.badge}
        </div>

        <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
          {currentVariant.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleClaimClick}
            className="w-full py-2.5 px-3 rounded-xl bg-[#ecb613] hover:bg-[#d4a311] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isClaimed ? (
              <>
                <CheckCircle2 size={15} className="text-emerald-950" />
                <span>Ficha Verificada</span>
              </>
            ) : (
              <>
                <KeyRound size={15} />
                <span>{currentVariant.ctaText}</span>
              </>
            )}
          </button>

          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-emerald-100 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={15} className="text-emerald-400" />
            <span>Reclamar vía WhatsApp</span>
          </a>
        </div>
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
