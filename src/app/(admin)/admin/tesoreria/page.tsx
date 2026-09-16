"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowDownLeft,
  FileText,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface TreasuryData {
  metrics: {
    totalDepositsAmount: string;
    totalDepositsCount: number;
    artistSplit: string;
    earOsSplit: string;
    vimumeSplit: string;
    rule: string;
  };
  transactions: Array<{
    id: string;
    client: string;
    service: string;
    deposit: string;
    hash: string;
    status: string;
    date: string;
  }>;
}

export default function TesoreriaAdminPage() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTreasury = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/treasury', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('[TESORERIA] Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTreasury();
  }, [fetchTreasury]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#ecb613]" />
            Libro Mayor Soberano // Conexión Backend
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Tesorería & Depósitos Stripe (Price-Lock 100€)
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Conciliación en vivo de señales de Stripe con hash criptográfico SHA-256 válido por 48 horas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchTreasury()}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#ecb613]' : ''}`} />
          </button>
          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <Lock className="w-3.5 h-3.5" />
            Split 80/10/10 Inmutable
          </div>
        </div>
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-xs text-zinc-400 font-medium block">Total Señales Bloqueadas</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">
            {data ? `${data.metrics.totalDepositsAmount} €` : '400,00 €'}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono mt-2 block">
            {data?.metrics.totalDepositsCount || 4} eventos asegurados
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-xs text-zinc-400 font-medium block">Liquidación Artistas (80%)</span>
          <span className="text-2xl font-bold text-[#ecb613] font-mono mt-1 block">
            {data ? `${data.metrics.artistSplit} €` : '320,00 €'}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono mt-2 block">Split Soberano garantizado</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#050508] border border-[#1a1a24]">
          <span className="text-xs text-zinc-400 font-medium block">Fee EAR OS + VIMUME (20%)</span>
          <span className="text-2xl font-bold text-white font-mono mt-1 block">
            {data ? `${(Number(data.metrics.earOsSplit) + Number(data.metrics.vimumeSplit)).toFixed(2)} €` : '80,00 €'}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono mt-2 block">10% Plataforma + 10% Social</span>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="p-6 rounded-2xl bg-[#050508] border border-[#1a1a24] space-y-4">
        <h2 className="text-base font-bold text-white font-mono">Últimas Señales Registradas en Stripe</h2>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">Cargando libro mayor...</div>
        ) : (
          <div className="space-y-3">
            {(data?.transactions || []).map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500 text-[10px]">{tx.id}</span>
                    <span className="font-mono text-[#ecb613] text-[10px]">{tx.hash}</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">{tx.client}</div>
                  <div className="text-zinc-400 text-[11px]">{tx.service}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono">DEPÓSITO</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{tx.deposit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono">ESTADO</span>
                    <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      {tx.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
