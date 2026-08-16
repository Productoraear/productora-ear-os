'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, DollarSign, ShieldCheck, Sparkles, ArrowRight, 
  CheckCircle2, Share2, Copy, Trophy, Phone, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';

export default function AfiliadosPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://productoraear.com/?ref=VIP_AFILIADO_2026";

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-32 pb-40 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* HEADER HERO S-CLASS */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Trophy size={13} />
            <span>RED DE VALOR // 10% LEDGER MERCANTIL</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            PROGRAMA DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">AFILIADOS S-CLASS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Prescriptores de alto ticket, Wedding Planners y Directores de Eventos: Monetiza tus recomendaciones con liquidación garantizada del 10% por contrato mercantil.
          </p>
        </div>

        {/* BENTO GRID DE VENTAJAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between">
            <DollarSign className="text-[#ecb613]" size={36} />
            <div className="mt-8">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Comisión Directa</span>
              <h3 className="text-3xl font-black text-white mt-1">10% por Evento</h3>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                Ingresos netos por cada contratación de sonido L-Acoustics, microfonía Axient o booking de Edwin Agudelo.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
            <ShieldCheck className="text-emerald-400" size={36} />
            <div className="mt-8">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">Liquidación Automática</span>
              <h3 className="text-3xl font-black text-white mt-1">Ledger Transparente</h3>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                Trazabilidad blockchain SHA-256 en cada presupuesto emitido con tu enlace o código de prescriptor.
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between">
            <Sparkles className="text-purple-400" size={36} />
            <div className="mt-8">
              <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">Herramientas VIP</span>
              <h3 className="text-3xl font-black text-white mt-1">Dossiers de Marca Blanca</h3>
              <p className="text-xs text-white/50 mt-2 leading-relaxed">
                Material descargable de alta fidelidad para presentar a tus clientes corporativos y parejas de novios.
              </p>
            </div>
          </div>
        </div>

        {/* ENLACE PERSONALIZADO & CTA */}
        <div className="p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#ecb613]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white font-syne uppercase">Tu Enlace de Prescriptor Táctico</h3>
            <p className="text-xs text-white/50 font-light">Comparte este enlace para asignar comisiones de por vida a tu cuenta:</p>
            <div className="inline-flex items-center gap-3 p-3 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs text-[#ecb613] select-all">
              <span>{referralLink}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={handleCopy}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Enlace'}</span>
            </button>

            <Link
              href="/servicios"
              className="px-8 py-4 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.3)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Abrir Túnel Neural →</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
