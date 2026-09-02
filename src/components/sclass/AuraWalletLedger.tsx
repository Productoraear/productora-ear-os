"use client";

import React, { useState } from "react";
import { WalletLedgerData } from "@/app/actions/commandCenterActions";
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  DollarSign, 
  Activity, 
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  User,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

interface AuraWalletLedgerProps {
  walletData: WalletLedgerData | null;
  systemFinancials: {
    wallets: { id: string; displayName: string; balance: number; currency: string }[];
    ledgerEntries: {
      id: string;
      displayName: string;
      amount: number;
      currency: string;
      status: string;
      reference: string | null;
      sourceEvent: string | null;
      notes: string | null;
      createdAt: Date;
    }[];
  } | null;
  isAdmin: boolean;
  loading: boolean;
  onRefresh: () => void;
}

export default function AuraWalletLedger({ 
  walletData, 
  systemFinancials, 
  isAdmin, 
  loading, 
  onRefresh 
}: AuraWalletLedgerProps) {
  const [viewMode, setViewMode] = useState<'Personal' | 'Global'>('Personal');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR"
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
      case "APPROVED":
        return "bg-blue-500/10 border-blue-500/20 text-blue-400";
      case "PENDING":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "REJECTED":
      case "VOID":
        return "bg-red-500/10 border-red-500/20 text-red-400";
      default:
        return "bg-neutral-500/10 border-neutral-500/20 text-neutral-400";
    }
  };

  const clipAddress = (addr: string | null) => {
    if (!addr) return "AURA-NOT-LINKED";
    if (addr.length <= 12) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}`;
  };

  const ledgerList = viewMode === 'Global' && systemFinancials 
    ? systemFinancials.ledgerEntries 
    : walletData?.ledgerEntries || [];

  return (
    <div className="space-y-8">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#d4a855]">
            Monedero Contable AuraWallet
          </h3>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
            Auditoría de saldos del monedero del artista y splits de Stripe Connect
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && systemFinancials && (
            <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('Personal')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'Personal' 
                    ? "bg-[#d4a855] text-black" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setViewMode('Global')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'Global' 
                    ? "bg-[#d4a855] text-black" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Sovereign Ledger
              </button>
            </div>
          )}

          <button 
            onClick={onRefresh}
            disabled={loading}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-[#d4a855] hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>
      </div>

      {loading && !walletData && !systemFinancials ? (
        <div className="p-16 text-center border border-white/5 rounded-[2.5rem] bg-black/40 space-y-4">
          <div className="w-8 h-8 border-2 border-[#d4a855] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
            Compilando balances y ledger transaccional...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Premium Aura Onyx Credit Card Component */}
          <div className="lg:col-span-1 space-y-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
              Tarjeta Perfil de Liquidación
            </div>

            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ duration: 0.3 }}
              className="relative aspect-[1.6/1] w-full rounded-[2.5rem] p-6 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1a150b] border border-white/10 shadow-[0_20px_50px_rgba(212,168,85,0.1)] overflow-hidden group"
            >
              {/* Golden grid glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#d4a855]/5 blur-3xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="space-y-1">
                  <div className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Sovereign Network</div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">AURA PLATINUM</h4>
                </div>
                <Cpu size={24} className="text-[#d4a855] opacity-80" />
              </div>

              {/* Balance display */}
              <div className="mb-6 relative z-10">
                <div className="text-[8px] text-[#d4a855] font-black uppercase tracking-widest mb-1">
                  Balance Neto Disponible
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tighter leading-none italic font-mono">
                  {formatCurrency(viewMode === 'Global' && systemFinancials 
                    ? systemFinancials.wallets.reduce((sum, w) => sum + w.balance, 0) 
                    : walletData?.balance || 0
                  )}
                </div>
              </div>

              {/* Footer info card */}
              <div className="flex justify-between items-end relative z-10 pt-2 border-t border-white/5">
                <div>
                  <div className="text-[7px] text-white/30 font-black uppercase tracking-widest">Aura Address</div>
                  <span className="text-[9px] font-bold text-white/80 font-mono tracking-wider">
                    {clipAddress(walletData?.walletAddress || "AURA-53c6-048")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#d4a855]/10 border border-[#d4a855]/20 px-2 py-0.5 rounded text-[8px] text-[#d4a855] font-black uppercase">
                  <ShieldCheck size={10} /> SECURE
                </div>
              </div>
            </motion.div>

            {/* Admin Insights summary */}
            {viewMode === 'Global' && systemFinancials && (
              <div className="p-5 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-white/40">
                  Resumen Global Perfil Roster
                </div>
                <div className="space-y-3">
                  {systemFinancials.wallets.map((w, index) => (
                    <div key={w.id} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <span className="font-bold text-white/70 truncate max-w-[120px]">{w.displayName}</span>
                      <span className="font-black text-[#d4a855] font-mono">{formatCurrency(w.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Financial Splits Audit Ledger List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
              Historial de Splits y Comisiones
            </div>

            {ledgerList.length === 0 ? (
              <div className="p-16 text-center border border-white/5 rounded-[2.5rem] bg-black/40 space-y-4">
                <Layers className="w-12 h-12 text-white/10 mx-auto" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Cero transacciones registradas</p>
                  <p className="text-[9px] text-white/30 uppercase font-black mt-1">
                    Los pagos procesados por Stripe Connect impactarán automáticamente esta cartola.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {ledgerList.map((entry) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:border-[#d4a855]/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${
                        entry.amount >= 0 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}>
                        {entry.amount >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black uppercase text-white tracking-tight">
                            {viewMode === 'Global' && 'displayName' in entry 
                              ? (entry as any).displayName 
                              : (entry.sourceEvent || "Stripe Payment Splitting")}
                          </span>
                          <span className={`text-[8px] font-black border px-2 py-0.5 rounded uppercase ${getStatusBadge(entry.status)}`}>
                            {entry.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[9px] text-white/35 font-black uppercase tracking-widest mt-1">
                          <Calendar size={10} /> {new Date(entry.createdAt).toLocaleDateString("es-ES")}
                          <span>•</span>
                          <span>Ref: {entry.reference || "ACID-SPLIT"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black font-mono tracking-tight text-white group-hover:text-[#d4a855] transition-colors">
                        {entry.amount >= 0 ? "+" : ""}{formatCurrency(entry.amount)}
                      </div>
                      {entry.notes && (
                        <p className="text-[8px] text-white/30 uppercase font-black tracking-widest mt-0.5 truncate max-w-[150px]">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
