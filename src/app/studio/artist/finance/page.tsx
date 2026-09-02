'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Calendar,
  Building,
  TrendingUp,
  Percent
} from 'lucide-react';

interface GigPayoutRecord {
  id: string;
  date: string;
  eventName: string;
  venueCity: string;
  format: string;
  totalGrossEuro: number;
  sovereignSplitPercent: number; // 80%
  netPayoutEuro: number;
  status: 'LIQUIDADO' | 'EN_ESCROW' | 'PROCESANDO';
  payoutMethod: string;
}

export default function ArtistFinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'ESTE_MES' | 'TRIMESTRE' | 'ANUAL'>('ESTE_MES');
  const [isRequestingPayout, setIsRequestingPayout] = useState<boolean>(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Datos financieros reales del Artista / Cuadrilla
  const availableBalance = 1420.80; // Saldo neto listo para transferir
  const escrowLockedBalance = 600.00; // Depósitos de 100€ de reservas bloqueadas
  const lifetimeEarned = 18450.00;

  const [payouts] = useState<GigPayoutRecord[]>([
    {
      id: 'PAY-2026-088',
      date: '28/08/2026',
      eventName: 'Boda Gala Real (Gala Solista)',
      venueCity: 'Finca El Regajal (Aranjuez)',
      format: 'Edwin Agudelo Solista',
      totalGrossEuro: 372.50,
      sovereignSplitPercent: 80,
      netPayoutEuro: 298.00,
      status: 'LIQUIDADO',
      payoutMethod: 'Stripe Connect (Cuenta ES84...)'
    },
    {
      id: 'PAY-2026-087',
      date: '25/08/2026',
      eventName: 'Concierto Fiestas Patronales',
      venueCity: 'Plaza Mayor (Méntrida, Toledo)',
      format: 'Trío Mariachi Tradicional',
      totalGrossEuro: 600.00,
      sovereignSplitPercent: 80,
      netPayoutEuro: 480.00,
      status: 'LIQUIDADO',
      payoutMethod: 'Stripe Connect (Cuenta ES84...)'
    },
    {
      id: 'PAY-2026-089',
      date: '05/09/2026',
      eventName: 'Gala Privada Bodas de Plata',
      venueCity: 'Hotel Santo Mauro (Madrid)',
      format: 'Quinteto Imperial',
      totalGrossEuro: 900.00,
      sovereignSplitPercent: 80,
      netPayoutEuro: 720.00,
      status: 'EN_ESCROW',
      payoutMethod: 'Stripe Escrow (Liberación automática post-evento)'
    },
    {
      id: 'PAY-2026-090',
      date: '12/09/2026',
      eventName: 'Sesión Musicoterapia VIMUME',
      venueCity: 'Residencia Los Nogales (Madrid)',
      format: 'Dúo VIMUME Terapéutico',
      totalGrossEuro: 480.00,
      sovereignSplitPercent: 80,
      netPayoutEuro: 384.00,
      status: 'EN_ESCROW',
      payoutMethod: 'Stripe Escrow (Liberación post-acta SPL)'
    }
  ]);

  const handleInstantPayout = () => {
    setIsRequestingPayout(true);
    setTimeout(() => {
      setIsRequestingPayout(false);
      setPayoutSuccessMsg(`✅ Transferencia instantánea de ${availableBalance.toFixed(2)} € solicitada con éxito a tu cuenta bancaria asociada.`);
    }, 1200);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      {/* Header Fintech S-Class */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#161624] to-[#0d0d14] border border-[#ecb613]/30 p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" /> Aura Wallet — Liquidación de Artistas
              </span>
              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono">
                Split Soberano: 80% Neto Inmutable
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
              Billetera de Liquidación & Regalías en Directo
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Cobros automatizados mediante Stripe Connect. Liquidación garantizada del 80% de cada evento sin intermediarios abusivos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleInstantPayout}
              disabled={isRequestingPayout || availableBalance <= 0}
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4" />
              {isRequestingPayout ? 'Procesando Stripe...' : 'Retirar Saldo Instantáneo'}
            </button>
          </div>
        </div>
      </div>

      {payoutSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          {payoutSuccessMsg}
        </div>
      )}

      {/* Tarjetas de Balance Fintech */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Balance Disponible */}
        <div className="p-6 rounded-2xl bg-[#09090d] border border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">SALDO DISPONIBLE (STRIPE CONNECT)</span>
          <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">
            {availableBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-gray-400 block font-mono">
            Transferible en 24h a tu cuenta bancaria ES84...
          </span>
        </div>

        {/* Balance en Escrow */}
        <div className="p-6 rounded-2xl bg-[#09090d] border border-amber-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">DEPÓSITOS EN ESCROW (PRÓXIMOS BOLOS)</span>
          <div className="text-3xl md:text-4xl font-black text-amber-400 font-mono">
            {escrowLockedBalance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-amber-300/80 block font-mono">
            Fondos garantizados por depósitos de clientes
          </span>
        </div>

        {/* Ganancias Acumuladas */}
        <div className="p-6 rounded-2xl bg-[#09090d] border border-white/10 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#258DCD]/10 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block">GANANCIAS ACUMULADAS (AURA 80%)</span>
          <div className="text-3xl md:text-4xl font-black text-white font-mono">
            {lifetimeEarned.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-[#258DCD] block font-mono">
            100% libre de comisiones ocultas
          </span>
        </div>
      </div>

      {/* Historial de Liquidaciones de Bolos */}
      <div className="rounded-2xl bg-[#09090d] border border-white/10 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white font-serif">Desglose de Liquidaciones por Bolo</h3>
            <p className="text-xs text-gray-400">Transparencia absoluta con certificado de split y retenciones</p>
          </div>

          <div className="flex gap-1.5">
            {['ESTE_MES', 'TRIMESTRE', 'ANUAL'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white font-bold border border-white/30'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {period.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Payouts */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3">Fecha & Evento</th>
                <th className="pb-3">Formato de Gala</th>
                <th className="pb-3">Total Bruto</th>
                <th className="pb-3">Split Artista (80%)</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5">
                    <span className="font-bold text-white block">{p.eventName}</span>
                    <span className="text-[11px] text-gray-500">{p.date} · {p.venueCity}</span>
                  </td>
                  <td className="py-3.5 text-gray-300">{p.format}</td>
                  <td className="py-3.5 text-white font-bold">{p.totalGrossEuro.toFixed(2)} €</td>
                  <td className="py-3.5 text-emerald-400 font-bold text-sm">
                    +{p.netPayoutEuro.toFixed(2)} €
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      p.status === 'LIQUIDADO'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-950 text-amber-300 border-amber-500/40'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => alert(`Descargando factura de liquidación fiscal para el evento: ${p.eventName}`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                      title="Descargar Certificado Fiscal"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulador de Ingresos Mensuales */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d0d14] via-[#12121c] to-[#0d0d14] border border-[#ecb613]/25 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ecb613]" />
          <h4 className="text-sm font-bold text-white font-serif">Simulador de Ingresos con Split Soberano (80%)</h4>
        </div>
        <p className="text-xs text-gray-400">
          En Productora EAR garantizamos que el 80% de cada euro presupuestado va directamente a los artistas que pisan el escenario.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">4 Bolos Solista / Mes</span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">1.120,00 € netos</span>
            <span className="text-[10px] text-emerald-400 font-mono">280 € / bolo (80% de 350€)</span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">8 Bolos Solista / Mes</span>
            <span className="text-xl font-bold font-mono text-[#ecb613] mt-1 block">2.240,00 € netos</span>
            <span className="text-[10px] text-[#ecb613] font-mono">Alta temporada / Bodas</span>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-white/5 text-center">
            <span className="text-[10px] font-mono text-gray-400 uppercase block">4 Bolos Trío / Mes</span>
            <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">1.920,00 € netos</span>
            <span className="text-[10px] text-purple-300 font-mono">480 € / bolo para el ensamble</span>
          </div>
        </div>
      </div>
    </div>
  );
}
