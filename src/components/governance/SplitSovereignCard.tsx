import React from 'react';
import { Crown, Cpu, HeartPulse, Scale } from 'lucide-react';
import SplitJustificationModal from '@/components/governance/SplitJustificationModal';
import { SOVEREIGN_SPLIT_RATIOS } from '@/lib/governance/splitJustificationEngine';

interface SplitSovereignCardProps {
  baseFee?: number;
  className?: string;
}

/**
 * 🛡️ SPLIT SOVEREIGN CARD — Tarjeta gráfica del desglose ético 80/10/10.
 * Renderiza las barras porcentuales con estética OLED y JetBrains Mono.
 * Integra el botón "Ver Justificación Fiscal & Legal" que abre el modal.
 */
export default function SplitSovereignCard({
  baseFee = 350,
  className = '',
}: SplitSovereignCardProps) {
  const rows = [
    {
      label: 'Artista Ejecutor',
      pct: SOVEREIGN_SPLIT_RATIOS.artista * 100,
      amount: baseFee * SOVEREIGN_SPLIT_RATIOS.artista,
      icon: Crown,
      accent: '#ffffff',
      desc: 'Retribución digna inmediata sin intermediarios.',
    },
    {
      label: 'Plataforma EAR OS',
      pct: SOVEREIGN_SPLIT_RATIOS.earOs * 100,
      amount: baseFee * SOVEREIGN_SPLIT_RATIOS.earOs,
      icon: Cpu,
      accent: '#ecb613',
      desc: 'Pasarela Stripe Price-Lock, telemetría y soporte.',
    },
    {
      label: 'VIMUME · Impacto Social',
      pct: SOVEREIGN_SPLIT_RATIOS.vimume * 100,
      amount: baseFee * SOVEREIGN_SPLIT_RATIOS.vimume,
      icon: HeartPulse,
      accent: '#00E5FF',
      desc: 'Deducible Ley 49/2002 · SROI 4.85x.',
    },
  ];

  const eur = (n: number): string =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2,
    }).format(n);

  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-[#030305] p-6 md:p-8 space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">
            Gobernanza Soberana
          </span>
          <h3 className="mt-1 text-lg font-black uppercase tracking-tight text-white font-syne">
            Split 80 / 10 / 10
          </h3>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-right">
          <span className="block text-[9px] font-mono uppercase tracking-widest text-white/40">
            Sobre tarifa base
          </span>
          <span className="font-mono text-sm font-bold text-white">
            {eur(baseFee)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl border"
                    style={{
                      color: row.accent,
                      borderColor: `${row.accent}40`,
                      backgroundColor: `${row.accent}0a`,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{row.label}</p>
                    <p className="text-[10px] text-white/40">{row.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: row.accent }}
                  >
                    {row.pct.toFixed(0)}%
                  </p>
                  <p className="font-mono text-[11px] text-white/60">
                    {eur(row.amount)}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.pct}%`,
                    backgroundColor: row.accent,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <SplitJustificationModal
        triggerLabel="Ver Justificación Fiscal & Legal"
        initialBudget={baseFee}
        className="w-full"
      />

      <p className="flex items-center gap-2 text-[10px] font-mono text-white/40">
        <Scale size={12} className="text-[#00E5FF]" />
        El 10% social es deducible, no un canon parasitario. Ley 49/2002 · Modelo 182 AEAT.
      </p>
    </div>
  );
}