"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, ArrowUpRight, ShieldCheck, Copy, 
  CheckCircle2, RefreshCw, AlertCircle, Trophy, Sparkles, Clock
} from 'lucide-react';
import Link from 'next/link';
import { getAffiliateDashboardData, requestAffiliatePayoutAction, AffiliateDashboardDTO } from '@/app/actions/affiliateActions';

export default function PanelAfiliadoPage() {
  const [emailInput, setEmailInput] = useState('edwin@productoraear.com');
  const [data, setData] = useState<AffiliateDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>('350');
  const [payoutStatus, setPayoutStatus] = useState<{ message: string; isError?: boolean } | null>(null);
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const loadData = async (email: string) => {
    setLoading(true);
    try {
      const res = await getAffiliateDashboardData(email);
      setData(res);
    } catch (e) {
      console.error('Error cargando datos de afiliado:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(emailInput);
  }, []);

  const handleCopy = () => {
    if (data?.referralLink && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleRequestPayout = async () => {
    const amt = parseFloat(payoutAmount);
    if (isNaN(amt) || amt <= 0) return;
    setSubmittingPayout(true);
    setPayoutStatus(null);
    try {
      const res = await requestAffiliatePayoutAction(emailInput, amt);
      if (res.success) {
        setPayoutStatus({ message: res.message });
        await loadData(emailInput);
      } else {
        setPayoutStatus({ message: res.message, isError: true });
      }
    } catch (e: any) {
      setPayoutStatus({ message: e.message || 'Error en la solicitud', isError: true });
    } finally {
      setSubmittingPayout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-36 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* TOP BAR HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.25em] mb-2">
              <Trophy size={12} />
              <span>PORTAL DE AUTOSERVICIO // SPLIT 80/10/10</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
              PANEL DE <span className="text-[#ecb613]">EMBAJADOR Y AFILIADO</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
              Monitorea tus comisiones nupciales y corporativas, balance de Aura Wallet y liquidaciones dominicales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadData(emailInput)}
              className="px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#ecb613] w-56"
              placeholder="Email de afiliado..."
            />
            <button
              onClick={() => loadData(emailInput)}
              disabled={loading}
              className="p-2.5 bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 rounded-xl text-white transition-all cursor-pointer"
              title="Recargar Telemetría"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* HERO STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Balance Aura Wallet */}
          <div className="p-6 bg-[#0a0a0d] border border-white/10 hover:border-[#ecb613]/40 rounded-3xl transition-all relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Aura Wallet Balance</span>
              <div className="p-2 bg-[#ecb613]/10 text-[#ecb613] rounded-xl border border-[#ecb613]/20">
                <Wallet size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-white mt-4 font-mono">
              {data?.wallet.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </p>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Disponible para Retiro</span>
          </div>

          {/* Comisiones Pendientes */}
          <div className="p-6 bg-[#0a0a0d] border border-white/10 hover:border-amber-500/40 rounded-3xl transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">En Proceso / Pendiente</span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Clock size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-300 mt-4 font-mono">
              {data?.totalCommissionPending.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </p>
            <span className="text-[10px] text-zinc-400 font-mono mt-1 block">Liquidación Domingo 23:59 GMT</span>
          </div>

          {/* Total Liquidado Histórico */}
          <div className="p-6 bg-[#0a0a0d] border border-white/10 hover:border-emerald-500/40 rounded-3xl transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Total Liquidado</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldCheck size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400 mt-4 font-mono">
              {data?.totalCommissionPaid.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </p>
            <span className="text-[10px] text-zinc-400 font-mono mt-1 block">100% Contratos Cumplidos</span>
          </div>

          {/* Rango y Nodos */}
          <div className="p-6 bg-[#0a0a0d] border border-white/10 hover:border-purple-500/40 rounded-3xl transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Rango de Afiliado</span>
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                <Sparkles size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-purple-300 mt-4 font-syne uppercase truncate">
              {data?.user.rank || 'Operative Junior'}
            </p>
            <span className="text-[10px] text-zinc-400 font-mono mt-1 block">
              {data?.activeReferralsCount || 0} Eventos Registrados
            </span>
          </div>
        </div>

        {/* ENLACE DE ATRIBUCIÓN & SOLICITUD DE RETIRO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Enlace de Afiliado Box (Span 7) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#09090d] border border-[#ecb613]/30 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                Tu Enlace Canónico de Atribución (SHA-256)
              </span>
              <h3 className="text-xl font-bold text-white font-syne">
                Comparte y Cobra el 10% de Cada Contrato
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cualquier pareja o empresa que acceda mediante este link inscribe una cookie de atribución. Al completarse la reserva, tu comisión se refleja al instante.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <div className="flex-1 p-3 bg-black/60 border border-white/10 rounded-2xl font-mono text-xs text-[#ecb613] truncate flex items-center">
                {data?.referralLink || 'Cargando enlace...'}
              </div>
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-[#ecb613] hover:bg-white text-black font-black text-xs font-mono uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#ecb613]/20"
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
          </div>

          {/* Solicitud de Retiro / Payout (Span 5) */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-[#09090d] border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Solicitud de Liquidación
              </span>
              <h3 className="text-xl font-bold text-white font-syne mt-1">
                Retirar Fondos de Aura Wallet
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Liquidaciones los domingos 23:59 GMT. Regla KYC activa para importes ≥ 3.000 €.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(e.target.value)}
                  className="flex-1 p-3 bg-black/60 border border-white/10 rounded-2xl font-mono text-sm text-white focus:outline-none focus:border-[#ecb613]"
                  placeholder="Importe en €"
                />
                <button
                  onClick={handleRequestPayout}
                  disabled={submittingPayout || !data || data.wallet.balance <= 0}
                  className="px-6 py-3 bg-white/10 hover:bg-emerald-600 hover:text-white disabled:opacity-40 text-emerald-400 font-bold text-xs font-mono uppercase rounded-2xl transition-all cursor-pointer flex items-center gap-2"
                >
                  {submittingPayout ? <RefreshCw size={14} className="animate-spin" /> : <ArrowUpRight size={16} />}
                  <span>Solicitar</span>
                </button>
              </div>

              {payoutStatus && (
                <div className={`p-3 rounded-xl text-xs font-mono ${payoutStatus.isError ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300' : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'}`}>
                  {payoutStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLA DE COMISIONES / LEDGER RELACIONAL */}
        <div className="p-8 rounded-3xl bg-[#09090d] border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white font-syne">Historial del Commission Ledger</h3>
              <p className="text-xs text-zinc-400">Asientos inmutables vinculados a contratos y eventos reales.</p>
            </div>
            <span className="text-xs font-mono text-zinc-500">{data?.ledgers.length || 0} Registros</span>
          </div>

          <div className="space-y-3">
            {data?.ledgers && data.ledgers.length > 0 ? (
              data.ledgers.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/20 transition-all gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        item.status === 'PAID' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        item.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-sm font-bold text-white">{item.sourceEvent || 'Evento Nupcial / Corporativo'}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      Ref: {item.reference || item.id} • {item.notes || 'Comisión estándar 10%'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#ecb613] font-mono">
                      +{item.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                    </p>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs font-mono bg-black/20 rounded-2xl">
                Aún no se han registrado eventos con tu enlace de prescriptor. Comparte tu link para comenzar a acumular liquidaciones.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
