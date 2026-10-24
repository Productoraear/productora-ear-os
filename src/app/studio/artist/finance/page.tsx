'use client';

import React, { useState, useTransition } from 'react';
import { 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  Download, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { createArtistSubscriptionCheckout, type ArtistPlanId } from '@/app/actions/artistSubscriptionActions';
import { createConnectOnboardingLink } from '@/app/actions/stripeConnectActions';

type FinancePeriod = 'ESTE_MES' | 'TRIMESTRE' | 'ANUAL';
const FINANCE_PERIODS: readonly FinancePeriod[] = ['ESTE_MES', 'TRIMESTRE', 'ANUAL'] as const;

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
  const [isPayoutPending, setIsPayoutPending] = useTransition();
  const [isSubscribing, setIsSubscribing] = useTransition();
  const [payoutErrorMsg, setPayoutErrorMsg] = useState<string | null>(null);

  // Datos financieros del Artista / Cuadrilla (SSOT temporal — se sustituirá
  // por lectura server-side desde auraWallet / Stripe Connect en la siguiente fase).
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

  /**
   * Retiro de saldo vía Stripe Connect Express.
   * Si el artista aún no tiene cuenta Connect, se le envía al onboarding KYC real.
   */
  const handleInstantPayout = () => {
    setPayoutErrorMsg(null);
    setIsPayoutPending(async () => {
      try {
        const result = await createConnectOnboardingLink({
          providerId: '00000000-0000-0000-0000-000000000000', // Se inyecta el providerId real tras autenticación
          userId: 'artista-actual', // Sustituir por userId autenticado (session)
        });
        if (result.url) {
          window.location.href = result.url;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido al abrir Stripe Connect.';
        setPayoutErrorMsg(`Cobro no iniciado: ${message}`);
      }
    });
  };

  /**
   * Alta o cambio de plan SaaS vía Stripe Billing (modo suscripción recurrente).
   * Redirige al portal seguro de Stripe Checkout; la suscripción se cierra por webhook.
   */
  const handleSubscriptionCheckout = (plan: ArtistPlanId) => {
    setPayoutErrorMsg(null);
    setIsSubscribing(async () => {
      try {
        const result = await createArtistSubscriptionCheckout({
          plan,
          artistEmail: 'productoraear@gmail.com', // Sustituir por email autenticado del artista
          artistName: 'Edwin Agudelo', // Sustituir por stageName autenticado
        });
        if (result.ok) {
          window.location.href = result.checkoutUrl;
        } else {
          setPayoutErrorMsg(result.error);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido al crear la suscripción.';
        setPayoutErrorMsg(`Suscripción no iniciada: ${message}`);
      }
    });
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
              disabled={isPayoutPending || availableBalance <= 0}
              className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_10px_30px_rgba(236,182,19,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowUpRight className="w-4 h-4" />
              {isPayoutPending ? 'Abriendo Stripe Connect...' : 'Retirar Saldo Instantáneo'}
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 MÓDULO S-CLASS: MEMBRESÍA DEL PUENTE TECNOLÓGICO EAR OS (SAAS) */}
      <div className="rounded-3xl bg-[#09090d] border border-[#ecb613]/30 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Modelo Puente Tecnológico // SaaS Artistas
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                Membresía Activa
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Tu Suscripción al Puente: Clientes Pagan Seguro, Tú Cobras el 80%
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              Nosotros somos el puente tecnológico. Tus clientes pagan depósitos de 100€ asegurados en Stripe antes de cada bolo, nosotros despachamos las reservas en &lt;15s y gestionamos contratos con seguro RC 1M€.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-center min-w-[170px]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Plan Activo</span>
              <span className="text-base font-bold font-mono text-[#ecb613] block mt-0.5">Plan Élite Anual</span>
              <span className="text-[10px] text-emerald-400 font-mono">290 € / año (Ahorras 58€)</span>
            </div>
            <button
              onClick={() => handleSubscriptionCheckout('ELITE_ANNUAL')}
              disabled={isSubscribing}
              className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4 text-[#ecb613]" />
              <span>{isSubscribing ? 'Abriendo Stripe...' : 'Gestionar Suscripción'}</span>
            </button>
          </div>
        </div>

        {/* Comparador de Tiers del Puente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => handleSubscriptionCheckout('PRO_MONTHLY')}
            disabled={isSubscribing}
            className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2 text-left cursor-pointer hover:border-[#ecb613]/40 transition-all disabled:opacity-50"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-white uppercase">Plan Pro Mensual (29 € / mes)</span>
              <span className="text-[10px] font-mono text-gray-400">Sin permanencia</span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Pasarela Stripe para clientes (fianzas de 100€ en Escrow), Área Privada con calendario ACID, contratos digitales y despacho por WhatsApp.
            </p>
            <span className="inline-block text-[10px] font-mono font-bold text-[#ecb613] uppercase tracking-wider pt-1">
              {isSubscribing ? 'Abriendo...' : 'Activar Plan →'}
            </span>
          </button>

          <div className="p-4 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-[#ecb613] uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Plan Élite Anual (290 € / año)
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#ecb613] text-black px-2 py-0.5 rounded-full uppercase">
                Tu Plan Actual
              </span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Insignia Diamante Oro, prioridad en el mapa nacional y en ArtistasEuropa.com, seguro de RC de 1M€ incluido y soporte 24/7.
            </p>
          </div>
        </div>
      </div>

      {payoutErrorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          {payoutErrorMsg}
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
            {FINANCE_PERIODS.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
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
                      onClick={() => downloadFiscalInvoice(p)}
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

/**
 * Genera y descarga un certificado fiscal real (CSV) de la liquidación.
 * Cero fachadas: escribe un Blob con el desglose del split 80/10/10 y lo descarga.
 */
function downloadFiscalInvoice(p: GigPayoutRecord) {
  const gross = p.totalGrossEuro.toFixed(2);
  const net = p.netPayoutEuro.toFixed(2);
  const platform = (p.totalGrossEuro * 0.1).toFixed(2);
  const vimume = (p.totalGrossEuro * 0.1).toFixed(2);

  const csvLines = [
    ['ID Liquidación', p.id],
    ['Evento', p.eventName],
    ['Ubicación', p.venueCity],
    ['Formato', p.format],
    ['Fecha', p.date],
    ['Bruto (€)', gross],
    ['Split Artista 80% (€)', net],
    ['EAR OS 10% (€)', platform],
    ['VIMUME 10% (€)', vimume],
    ['Estado', p.status],
    ['Método', p.payoutMethod],
  ];

  const csv = csvLines
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `liquidacion_${p.id}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
