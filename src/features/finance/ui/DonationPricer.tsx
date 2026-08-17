'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, ShieldCheck, Lock, Loader2, ArrowRight, Gift } from 'lucide-react';

interface DonationPricerProps {
  defaultAmount?: number;
  className?: string;
  onSuccess?: () => void;
}

const PRESETS = [
  { amount: 10, label: '10 €', desc: '1 Sesión Reminiscencia' },
  { amount: 25, label: '25 €', desc: 'Kit Neuroacústico' },
  { amount: 50, label: '50 €', desc: 'Bono Quincenal Mayor' },
  { amount: 100, label: '100 €', desc: 'Mecenas Protector' },
];

export function DonationPricer({ defaultAmount = 25, className = '' }: DonationPricerProps) {
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleCheckout = async () => {
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 1) {
      setError('Por favor, introduce una aportación mínima de 1 €.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          concept: `Aportación VIMUME // Programa Neuroacústico Legado (${finalAmount.toFixed(2)} €)`,
          metadata: {
            type: 'DONATION_VIMUME',
            is_donation: 'true',
            tier: finalAmount >= 100 ? 'MECENAS_PROTECTOR' : 'DONACION_INDIVIDUAL'
          }
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No se pudo generar la sesión de pago.');
      }
    } catch (err: any) {
      setError(err.message || 'Error conectando con la pasarela segura de Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-[#0a0a0f] border border-pink-500/30 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_50px_rgba(236,72,153,0.15)] space-y-6 text-white ${className}`}>
      
      {/* CABECERA DE IMPACTO */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
          <Heart size={22} fill="currentColor" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-[9px] font-mono font-bold tracking-widest uppercase">
            <Sparkles size={10} /> PROGRAMA VIMUME LEGADO
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase italic tracking-tight font-syne text-white">
            Micro-Mecenazgo & <span className="text-pink-400">Donaciones</span>
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
        El 100% de tu aportación se destina a financiar sesiones de neuro-reminiscencia sonora y equipamiento acústico en residencias públicas para mayores con Alzheimer o deterioro cognitivo.
      </p>

      {/* SELECTOR DE PRESETS */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
          SELECCIONA TU APORTACIÓN
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map((preset) => {
            const isSelected = amount === preset.amount && !customAmount;
            return (
              <button
                key={preset.amount}
                type="button"
                onClick={() => {
                  setAmount(preset.amount);
                  setCustomAmount('');
                  setError(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-pink-600 border-pink-400 text-white shadow-lg shadow-pink-600/30 scale-[1.02]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-pink-500/30'
                }`}
              >
                <div className="text-base sm:text-lg font-black font-mono">{preset.label}</div>
                <div className={`text-[9px] font-mono leading-tight mt-0.5 ${isSelected ? 'text-pink-100' : 'text-slate-400'}`}>
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INPUT CANTIDAD PERSONALIZADA */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
          <span>O INTRODUCE OTRA CANTIDAD LIBRE</span>
          <span className="text-[#ecb613] font-bold">Mínimo 1 €</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Ej. 15, 75, 250..."
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setError(null);
            }}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 pr-12 text-sm font-mono text-white focus:outline-none focus:border-pink-500 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-400 font-bold">
            EUR (€)
          </span>
        </div>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 font-mono">
          {error}
        </div>
      )}

      {/* BOTÓN DE PAGO VÍA STRIPE */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-[#ecb613] hover:opacity-95 text-white font-mono font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-pink-600/25 transition-all cursor-pointer active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Conectando con Pasarela Segura...</span>
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>Donar {finalAmount > 0 ? `${finalAmount.toLocaleString()} €` : ''} vía Stripe</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={12} className="text-emerald-400" /> Cifrado SSL 256-bit
          </span>
          <span>•</span>
          <span>Transacción Segura Stripe</span>
          <span>•</span>
          <span>Emisión de Certificado</span>
        </div>
      </div>

    </div>
  );
}

export default DonationPricer;
