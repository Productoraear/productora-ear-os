'use client';

import React, { useTransition } from 'react';
import { Lock, PhoneCall, Loader2, ShieldCheck } from 'lucide-react';
import type { ChristmasLightingProduct } from '@/data/luces-navidad';
import { createB2GLightingCheckout } from '@/app/actions/vipCheckoutActions';

export default function LightingDetailActions({ product }: { product: ChristmasLightingProduct }) {
  const [isPending, startTransition] = useTransition();

  const handleSmartLock = () => {
    startTransition(async () => {
      try {
        const res = await createB2GLightingCheckout({
          sku: product.sku,
          productName: product.name,
          category: product.category,
          cataloguePage: product.cataloguePage,
          priceNumeric: product.priceNumeric,
          municipality: 'Sede Municipal / Corporativa',
          priceLockMode: 'SMART_LOCK_10EUR'
        });

        if (res?.url) {
          window.location.href = res.url;
        }
      } catch (err: any) {
        alert(err.message || 'Error al conectar con Stripe.');
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleSmartLock}
          disabled={isPending}
          className="w-full sm:w-auto flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 disabled:opacity-50 font-mono uppercase tracking-wider"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Smart-Lock 72h (10 € Depósito)
        </button>

        <a
          href={`https://wa.me/34682141077?text=Hola%2C%20solicito%20la%20memoria%20t%C3%A9cnica%20oficial%20y%20pliego%20para%20la%20referencia%20${encodeURIComponent(product.sku)}%20(${encodeURIComponent(product.name)})%20de%20Productora%20EAR`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/15"
        >
          <PhoneCall className="w-4 h-4 text-[#ecb613]" /> Expediente LCSP WhatsApp
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Garantía de precio congelado por 72h con depósito reembolsable / compensable</span>
      </div>
    </div>
  );
}
