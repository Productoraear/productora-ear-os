"use client";

import React, { useState, useMemo } from 'react';
import { Calculator, Download, Sparkles, PieChart, ShieldCheck, DollarSign } from 'lucide-react';

export interface BudgetPartition {
  name: string;
  minPct: number;
  maxPct: number;
  recommendedPct: number;
  color: string;
  description: string;
}

const PARTITIONS: BudgetPartition[] = [
  { name: 'Catering & Banquete', minPct: 22, maxPct: 30, recommendedPct: 25, color: '#ecb613', description: 'Menú por pax, cóctel, barra libre y servicio de camareros.' },
  { name: 'Espacio, Finca & Alquiler', minPct: 18, maxPct: 25, recommendedPct: 20, color: '#10B981', description: 'Canon de espacio, exclusiva y habitaciones in situ.' },
  { name: 'Producción & Sonido Bose/PA', minPct: 10, maxPct: 16, recommendedPct: 12, color: '#00E5FF', description: 'Microfonía Shure, PAs Bose F1/S1 Pro, Line Array y técnicos.' },
  { name: 'Audiovisual, Foto & Vídeo 4K', minPct: 8, maxPct: 12, recommendedPct: 10, color: '#8b5cf6', description: 'Cobertura completa, brutos, teaser 48h y galería cloud.' },
  { name: 'Decoración, Carpas & Flores', minPct: 10, maxPct: 14, recommendedPct: 12, color: '#ec4899', description: 'Estructuras M2, tarima fenólica, iluminación micro-LED.' },
  { name: 'Contingencia & Imprevistos', minPct: 15, maxPct: 22, recommendedPct: 21, color: '#64748b', description: 'Fianza de daños, generador de rescate y margen de seguridad.' },
];

export const BudgetMatrix: React.FC = () => {
  const [totalBudgetEur, setTotalBudgetEur] = useState<number>(45000);
  const [paxCount, setPaxCount] = useState<number>(150);

  const breakdown = useMemo(() => {
    return PARTITIONS.map((p) => {
      const amount = Math.round((totalBudgetEur * p.recommendedPct) / 100);
      const perPax = paxCount > 0 ? Math.round(amount / paxCount) : 0;
      return {
        ...p,
        amount,
        perPax
      };
    });
  }, [totalBudgetEur, paxCount]);

  const exportCSV = () => {
    const headers = 'Partida,Porcentaje,Importe Total (€),Coste por Persona (€),Descripción\n';
    const rows = breakdown
      .map((b) => `"${b.name}","${b.recommendedPct}%","${b.amount} €","${b.perPax} €","${b.description}"`)
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Matriz_Presupuesto_EAR_${totalBudgetEur}EUR_${paxCount}PAX.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 rounded-3xl bg-[#08080d] border border-white/10 space-y-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] flex items-center gap-1">
            <Sparkles size={12} /> Matriz Predictiva de Presupuestos (B0.06)
          </span>
          <h3 className="text-xl font-bold font-syne text-white mt-1">
            Simulador Algorítmico de Gran Escala (hasta 265.000 €)
          </h3>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 transition-all"
        >
          <Download size={14} className="text-[#ecb613]" />
          Exportar CSV
        </button>
      </div>

      {/* Controles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-black/50 border border-white/5 font-mono">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Presupuesto Global del Evento</span>
            <span className="text-[#ecb613] font-bold text-sm">
              {totalBudgetEur.toLocaleString('es-ES')} €
            </span>
          </div>
          <input
            type="range"
            min={5000}
            max={265000}
            step={2500}
            value={totalBudgetEur}
            onChange={(e) => setTotalBudgetEur(Number(e.target.value))}
            className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Número de Asistentes (PAX)</span>
            <span className="text-white font-bold text-sm">{paxCount} PAX</span>
          </div>
          <input
            type="range"
            min={20}
            max={1000}
            step={10}
            value={paxCount}
            onChange={(e) => setPaxCount(Number(e.target.value))}
            className="w-full accent-[#ecb613] bg-zinc-800 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Barras Porcentuales */}
      <div className="space-y-4">
        {breakdown.map((b) => (
          <div key={b.name} className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                {b.name} ({b.recommendedPct}%)
              </span>
              <div className="space-x-3 text-right">
                <span className="text-zinc-400">{b.perPax} €/pax</span>
                <strong className="text-[#ecb613] font-bold">{b.amount.toLocaleString('es-ES')} €</strong>
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-zinc-900 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${b.recommendedPct}%`, backgroundColor: b.color }}
              />
            </div>

            <p className="text-[10px] text-zinc-500">{b.description}</p>
          </div>
        ))}
      </div>

      {/* Totales Resumen */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#050508] border border-white/10 text-xs font-mono">
        <span className="text-zinc-400 flex items-center gap-1">
          <ShieldCheck size={14} className="text-emerald-400" />
          Split Soberano EAR OS (80/10/10)
        </span>
        <span className="text-zinc-300">
          Coste Medio Real por Asistente:{' '}
          <strong className="text-[#ecb613] font-bold text-sm">
            {paxCount > 0 ? Math.round(totalBudgetEur / paxCount) : 0} €/pax
          </strong>
        </span>
      </div>
    </div>
  );
};
