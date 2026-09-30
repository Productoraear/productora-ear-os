'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, ShieldCheck, HeartHandshake, History, ExternalLink, CheckCircle2, Lock } from 'lucide-react';
import { getVendorBillingSummaryAction, requestVendorPayoutAction, VendorFinancialSummary } from '@/app/actions/vendorBillingActions';

export default function VendorBillingPage() {
  const [summary, setSummary] = useState<VendorFinancialSummary | null>(null);
  const [payoutAmount, setPayoutAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [requesting, setRequesting] = useState<boolean>(false);
  const [payoutMessage, setPayoutMessage] = useState<string | null>(null);

  useEffect(() => {
    loadBilling();
  }, []);

  const loadBilling = async () => {
    setLoading(true);
    const data = await getVendorBillingSummaryAction('edwin-agudelo');
    setSummary(data);
    setPayoutAmount(data.availableBalance.toString());
    setLoading(false);
  };

  const handleRequestPayout = async () => {
    if (!summary) return;
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0 || amount > summary.availableBalance) {
      setPayoutMessage('Importe no válido para retirar.');
      return;
    }

    setRequesting(true);
    setPayoutMessage(null);
    const res = await requestVendorPayoutAction('edwin-agudelo', amount);
    setRequesting(false);

    if (res.success) {
      setPayoutMessage(res.message ?? 'Solicitud procesada correctamente.');
      loadBilling();
    } else {
      setPayoutMessage(res.error ?? 'Error al procesar el retiro.');
    }
  };

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center p-12 text-zinc-500 font-mono text-xs animate-pulse">
        Cargando Bóveda Financiera AuraWallet...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <header className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-mono text-emerald-400 font-bold uppercase mb-2">
          <Wallet size={12} />
          <span>Bóveda Financiera AuraWallet · Liquidaciones Dominicales</span>
        </div>
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Tesorería & Split Soberano 80/10/10</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Transparencia absoluta en liquidaciones. El 80% neto de tus contrataciones se liquida de forma directa a tu IBAN.
        </p>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Saldo Disponible */}
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-emerald-500/30 relative overflow-hidden space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Saldo Retirable Ahora</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            {summary.availableBalance.toFixed(2)} €
          </div>
          <div className="text-[11px] text-zinc-400 font-light flex items-center gap-1 pt-2">
            <ShieldCheck size={12} className="text-emerald-400" />
            <span>Garantía de Depósito Stripe Price-Lock</span>
          </div>
        </div>

        {/* Facturado Mes */}
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Ganancia Neta Mes (80%)</div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            {summary.totalEarnedMonth.toFixed(2)} €
          </div>
          <div className="text-[11px] text-zinc-400 font-light pt-2">
            Sobre total devengado de {(summary.totalEarnedMonth / 0.8).toFixed(2)} €
          </div>
        </div>

        {/* Retorno Social VIMUME */}
        <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-purple-500/30 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1">
            <HeartHandshake size={12} />
            <span>Impacto Social VIMUME (10%)</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            {summary.vimumeContributionTotal.toFixed(2)} €
          </div>
          <div className="text-[11px] text-purple-300/80 font-light pt-2">
            80% Deducible en IRPF / Certificado RSC Modelo 182
          </div>
        </div>

      </div>

      {/* Desglose Gráfico Split Soberano 80/10/10 */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider flex items-center gap-2">
          <Lock size={14} className="text-[#ecb613]" />
          <span>Estructura Canónica del Split 80/10/10</span>
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full h-4 rounded-full bg-white/5 overflow-hidden flex">
          <div className="h-full bg-emerald-500" style={{ width: '80%' }} title="80% Artista / Proveedor" />
          <div className="h-full bg-amber-400" style={{ width: '10%' }} title="10% Plataforma EAR OS" />
          <div className="h-full bg-purple-500" style={{ width: '10%' }} title="10% VIMUME Impacto Social" />
        </div>

        {/* Leyenda */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>80% Artista / Proveedor ({summary.splitBreakdown.artist80.toFixed(2)} €)</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>10% Infraestructura EAR OS ({summary.splitBreakdown.earOs10.toFixed(2)} €)</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <span className="w-3 h-3 rounded-full bg-purple-500" />
            <span>10% Terapias VIMUME Senior ({summary.splitBreakdown.vimume10.toFixed(2)} €)</span>
          </div>
        </div>
      </div>

      {/* Formulario de Retiro de Fondos */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
          <ArrowDownRight size={16} className="text-emerald-400" />
          <span>Solicitar Liquidación a Cuenta Bancaria (IBAN)</span>
        </h3>

        {payoutMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{payoutMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="number"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            max={summary.availableBalance}
            min={1}
            step={0.01}
            className="w-full sm:w-64 bg-black/60 border border-white/10 rounded-xl p-3 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/50"
            placeholder="Importe €"
          />
          <button
            onClick={handleRequestPayout}
            disabled={requesting || summary.availableBalance <= 0}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {requesting ? 'Procesando Retiro...' : 'Confirmar Transferencia SEPA Directa'}
          </button>
        </div>
      </div>

      {/* Historial de Liquidaciones */}
      <div className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold font-syne text-white flex items-center gap-2">
          <History size={16} className="text-zinc-400" />
          <span>Historial de Pagos & Auditoría Criptográfica SHA-256</span>
        </h3>

        <div className="divide-y divide-white/5 overflow-x-auto">
          {summary.payoutHistory.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs font-mono min-w-[500px]">
              <div>
                <div className="text-white font-bold">{item.id}</div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span>SHA256: {item.sha256Hash.substring(0, 16)}...</span>
                </div>
              </div>
              <div className="text-zinc-400">{item.date}</div>
              <div className="text-emerald-400 font-bold">+{item.amount.toFixed(2)} €</div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
