'use client';

// src/features/landing/components/HormoziOfferStack.tsx
//
// GRAND SLAM VALUE STACKER (HORMOZI $100M OFFERS)
// Tarjeta OLED con el desglose brutal de valor vs precio real desde 350 €
// y depósito de 100 € en Stripe (Price-Lock SHA-256).

import type { HormoziValueItem } from '@/lib/seo/searchIntentEngine';

const ACCENT = '#ecb613';

interface HormoziOfferStackProps {
  valueStack: HormoziValueItem[];
  valueTotal: number;
  basePrice: number;
  deposit: number;
}

const money = (v: number) =>
  v.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export default function HormoziOfferStack({ valueStack, valueTotal, basePrice, deposit }: HormoziOfferStackProps) {
  return (
    <section className="w-full overflow-x-hidden border rounded-2xl p-6 md:p-8" style={{ borderColor: 'rgba(236,182,19,0.35)', background: '#050507' }}>
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ACCENT }}>
          Grand Slam Value Stacker
        </p>
        <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-1" style={{ fontFamily: 'Syne, sans-serif' }}>
          Todo lo que va incluido
        </h3>
      </div>

      <ul className="space-y-3">
        {valueStack.map((item, i) => (
          <li key={item.label} className="flex items-center justify-between gap-4 rounded-xl bg-[#030305] border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs mt-0.5" style={{ color: ACCENT }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm text-white/80">{item.label}</span>
            </div>
            <span className="font-mono text-sm text-white font-semibold shrink-0">{money(item.value)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between rounded-xl border p-4 font-mono" style={{ borderColor: 'rgba(236,182,19,0.5)', background: 'rgba(236,182,19,0.06)' }}>
        <span className="text-sm uppercase tracking-wider text-white/60">Valor acumulado</span>
        <span className="text-2xl font-bold" style={{ color: ACCENT }}>{money(valueTotal)}</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Precio real desde</p>
          <p className="text-2xl text-white font-bold mt-1">{money(basePrice)}</p>
        </div>
        <div className="rounded-xl bg-[#030305] border border-white/10 p-4">
          <p className="text-[10px] uppercase tracking-wider text-white/40">Fianza Stripe</p>
          <p className="text-2xl text-white font-bold mt-1">{money(deposit)}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-white/50 leading-relaxed">
        Congela la fecha con un depósito de {money(deposit)} mediante <span className="text-white/80">Price-Lock SHA-256</span> válido
        24h–72h. El precio no subirá después del cierre.
      </p>
    </section>
  );
}