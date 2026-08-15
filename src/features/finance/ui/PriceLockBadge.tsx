'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PriceLockBadgeProps {
  initialHash?: string;
  initialAmount?: number;
  initialExpiresAtMs?: number;
  riderConfig?: string;
  onPayLock?: () => void;
}

export function PriceLockBadge({
  initialHash = '0x8F92A1B7C4E3D8F0E4A198231',
  initialAmount = 1450,
  initialExpiresAtMs,
  riderConfig = 'Bose F1 Model 812 + FBT Sub + Behringer XR18',
  onPayLock
}: PriceLockBadgeProps) {
  // Configurar expiración por defecto a 72 horas si no se provee
  const targetTime = initialExpiresAtMs || (Date.now() + 72 * 60 * 60 * 1000);
  
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 71,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const updateCountdown = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="bg-[#0a0a0c] border border-[#ecb613]/40 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-[0_0_50px_rgba(236,182,19,0.15)] selection:bg-[#ecb613] selection:text-black">
      
      {/* Glow Superior */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">
              Invariante Criptográfico · Palanca 8
            </span>
            <h3 className="text-lg font-black tracking-tight text-white uppercase">
              Tarifa Congelada (Price-Lock 72h)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-full text-xs font-mono text-[#ecb613]">
          <Clock className="w-3.5 h-3.5" />
          <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>
      </div>

      {/* Hash e Información de Bóveda */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
            Hash de Firma en Bóveda
          </span>
          <code className="text-xs text-[#ecb613] font-mono break-all font-bold block bg-black/40 p-2 rounded border border-white/5">
            {initialHash}
          </code>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
            Importe Bloqueado (Garantizado)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{initialAmount.toLocaleString('es-ES')} €</span>
            <span className="text-xs text-emerald-400 font-bold">+ IVA</span>
          </div>
        </div>
      </div>

      {/* Rider Homologado */}
      <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-6 text-xs text-slate-300 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block">Rider Técnico Homologado Incluido:</span>
          <p className="text-slate-400 mt-0.5">{riderConfig}</p>
        </div>
      </div>

      {/* CTA Pay-to-Lock */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-white/10">
        <div className="text-xs text-slate-400">
          <span>Depósito para Bloqueo de Fecha: </span>
          <strong className="text-white font-bold">100,00 €</strong>
        </div>

        <button
          onClick={onPayLock || (() => alert('Iniciando Pay-to-Lock: Bloqueo de 100€ vía Stripe/Bizum...'))}
          className="w-full sm:w-auto bg-[#ecb613] text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#d4a210] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          Bloquear Fecha por 100€ <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default PriceLockBadge;
