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
  RefreshCw,
  TrendingUp,
  Landmark,
  Wallet,
  Sparkles,
  ExternalLink
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

export default function TesoreriaAdminCatminPage() {
  const [data, setData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTreasury = useCallback(async () => {
    setLoading(true);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Finanzas</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Tesorería & Stripe</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Tesorería & Depósitos Price-Lock 100€
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchTreasury}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-all"
            title="Sincronizar con Stripe"
          >
            <RefreshCw className={`w-4 h-4 text-[#ecb613] ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1.5 rounded-xl text-xs font-mono text-[#ecb613]">
            <Lock className="w-3.5 h-3.5" />
            <span>Split 80/10/10 Inmutable</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE TESORERÍA                          */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        {/* Card 1: Total Señales */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Total Señales Custodia</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {data ? `${data.metrics.totalDepositsAmount} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {data?.metrics.totalDepositsCount || 0} eventos con fecha bloqueada
          </p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Stripe SHA-256 Activo
          </div>
        </div>

        {/* Card 2: 80% Artistas */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Liquidación Artista (80%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {data ? `${data.metrics.artistSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Edwin Agudelo y elenco</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Retribución Neta Soberana
          </div>
        </div>

        {/* Card 3: 10% Plataforma EAR OS */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Infraestructura EAR OS (10%)</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ecb613]">
            {data ? `${data.metrics.earOsSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Pasarela, telemetría y hosting</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cero Cuotas Fijas
          </div>
        </div>

        {/* Card 4: 10% VIMUME */}
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Impacto VIMUME (10%)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Landmark className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {data ? `${data.metrics.vimumeSplit} €` : '0,00 €'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Sesiones 40 Hz Mayores</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Modelo 182 AEAT (80% Deducible)
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. TABLA DE MOVIMIENTOS EN VIVO (ESTILO CATMÍN)                       */}
      {/* ===================================================================== */}
      <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Libro Mayor de Señales Stripe Price-Lock
            </h2>
            <p className="text-xs text-zinc-500">Conciliación criptográfica SHA-256 válida por 48 horas</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            INMUTABLE
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-zinc-500">
            Cargando libro mayor desde Stripe...
          </div>
        ) : (!data?.transactions || data.transactions.length === 0) ? (
          <div className="py-12 text-center space-y-2">
            <CreditCard className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs font-mono text-zinc-400">0 depósitos registrados en el Libro Mayor</p>
            <p className="text-[11px] text-zinc-600 max-w-md mx-auto">
              Cero cifras de vanidad. Los depósitos de Stripe (100 €) se registrarán aquí automáticamente en tiempo real con su hash SHA-256 una vez sean procesados por la pasarela.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-500 text-[10px]">{tx.id}</span>
                    <span className="font-mono text-[#ecb613] text-[10px] bg-[#ecb613]/10 px-1.5 py-0.2 rounded border border-[#ecb613]/20">
                      {tx.hash}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">{tx.client}</div>
                  <div className="text-zinc-400 text-[11px] font-light">{tx.service}</div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">DEPÓSITO</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">{tx.deposit}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono uppercase">ESTADO</span>
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
