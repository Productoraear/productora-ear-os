import React from 'react';
import { WalletCards, TrendingUp, ShieldCheck } from 'lucide-react';

export default function VendorBillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black font-syne text-white tracking-tight">Liquidaciones & Split Soberano 80/10/10</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
          Trazabilidad de pagos, transferencias dominicales y estados contables.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-500 block">Saldo Disponible</span>
          <span className="text-3xl font-black font-syne text-white">0.00 €</span>
          <span className="text-[10px] font-mono text-emerald-400 block">Liquidación semanal activa</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-500 block">Split Asignado</span>
          <span className="text-3xl font-black font-syne text-[#ecb613]">80%</span>
          <span className="text-[10px] font-mono text-zinc-400 block">Tier Free Homologado</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 space-y-2">
          <span className="text-xs font-mono uppercase text-zinc-500 block">Retiros KYC</span>
          <span className="text-3xl font-black font-syne text-blue-400">&ge; 3.000 €</span>
          <span className="text-[10px] font-mono text-zinc-400 block">Auditoría S-Class</span>
        </div>
      </div>
    </div>
  );
}
