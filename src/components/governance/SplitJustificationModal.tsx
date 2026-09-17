'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Scale,
  X,
  Calculator,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  HeartPulse,
  FileBadge,
} from 'lucide-react';
import {
  generateSplitJustification,
  type SplitJustificationReport,
} from '@/lib/governance/splitJustificationEngine';

interface SplitJustificationModalProps {
  triggerLabel?: string;
  initialBudget?: number;
  className?: string;
}

const eur = (n: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n);

/**
 * 🛡️ SPLIT JUSTIFICATION MODAL
 * Simulador interactivo de deducción fiscal Ley 49/2002 y certificado de
 * impacto social. Demuestra el valor del 10% VIMUME frente al canon
 * parasitario del 20%-50% de los mánagers tradicionales.
 */
export default function SplitJustificationModal({
  triggerLabel = 'Ver Justificación Fiscal & Legal',
  initialBudget = 350,
  className = '',
}: SplitJustificationModalProps) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [managerPct, setManagerPct] = useState<number>(30);

  const report: SplitJustificationReport = useMemo(
    () => generateSplitJustification(budget, managerPct / 100),
    [budget, managerPct],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors ${className}`}
      >
        <Scale className="w-4 h-4" />
        {triggerLabel}
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#030305] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto text-white shadow-[0_0_80px_rgba(236,182,19,0.18)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30">
                    <ShieldCheck className="w-6 h-6 text-[#ecb613]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                      Gobernanza · Ley 49/2002 · Modelo 182 AEAT
                    </p>
                    <h3 className="text-xl font-black font-syne tracking-tight">
                      Justificación del Split Soberano 80/10/10
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Simulador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="split-budget"
                    className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2"
                  >
                    Presupuesto del evento (€)
                  </label>
                  <input
                    id="split-budget"
                    type="number"
                    min={100}
                    step={50}
                    value={budget}
                    onChange={(e) =>
                      setBudget(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full bg-black/60 border border-[#ecb613]/30 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="split-manager"
                    className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-2"
                  >
                    Comisión mánager tradicional ({managerPct}%)
                  </label>
                  <input
                    id="split-manager"
                    type="range"
                    min={20}
                    max={50}
                    step={1}
                    value={managerPct}
                    onChange={(e) => setManagerPct(Number(e.target.value))}
                    className="w-full accent-[#ecb613]"
                  />
                </div>
              </div>

              {/* Desglose */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    Artista Ejecutor · 80%
                  </span>
                  <div className="mt-2 text-2xl font-black font-mono text-white">
                    {eur(report.split.artista)}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                    EAR OS · 10%
                  </span>
                  <div className="mt-2 text-2xl font-black font-mono text-[#ecb613]">
                    {eur(report.split.earOs)}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#00E5FF]/5 border border-[#00E5FF]/30 p-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00E5FF]">
                    VIMUME · 10%
                  </span>
                  <div className="mt-2 text-2xl font-black font-mono text-[#00E5FF]">
                    {eur(report.split.vimume)}
                  </div>
                </div>
              </div>

              {/* Comparativa parasitaria */}
              <div className="rounded-2xl bg-black/50 border border-[#ecb613]/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ecb613]">
                  <TrendingUp className="w-4 h-4" />
                  Ventaja soberana frente al mánager tradicional
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs font-mono">
                    <span className="block text-zinc-500">Artista (mánager {report.comparativa.managerPct * 100}%)</span>
                    <strong className="text-white">{eur(report.comparativa.artistaNetManager)}</strong>
                  </div>
                  <div className="text-xs font-mono">
                    <span className="block text-zinc-500">Artista (Split Soberano)</span>
                    <strong className="text-[#ecb613]">{eur(report.comparativa.artistaNetSovereign)}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-300">{report.comparativa.veredicto}</p>
              </div>

              {/* Retorno fiscal */}
              <div className="rounded-2xl bg-[#00E5FF]/5 border border-[#00E5FF]/25 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF]">
                  <Calculator className="w-4 h-4" />
                  Deducción fiscal del 10% VIMUME
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="block text-zinc-500">IRPF (80% · tope 250 €)</span>
                    <strong className="text-[#00E5FF]">{eur(report.fiscal.deduccionIrpf)}</strong>
                  </div>
                  <div>
                    <span className="block text-zinc-500">Sociedades (45%)</span>
                    <strong className="text-[#00E5FF]">{eur(report.fiscal.deduccionSociedades)}</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Sparkles className="w-4 h-4 text-[#00E5FF]" />
                  <span className="text-zinc-300">SROI generado:</span>
                  <strong className="text-[#00E5FF]">{eur(report.fiscal.sroiGenerado)}</strong>
                </div>
              </div>

              {/* Impacto clínico */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <HeartPulse className="w-4 h-4 text-[#ecb613]" />
                  Impacto social contrastado
                </div>
                {report.impactoSocial.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/10 px-4 py-2"
                  >
                    <div>
                      <span className="block text-xs text-white">{metric.label}</span>
                      <span className="block text-[10px] text-zinc-500">{metric.source}</span>
                    </div>
                    <strong className="font-mono text-[#ecb613]">{metric.value}</strong>
                  </div>
                ))}
              </div>

              {/* Argumentos jurídicos */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
                  <FileBadge className="w-4 h-4 text-[#ecb613]" />
                  Blindaje jurídico europeo
                </div>
                <ul className="space-y-1.5">
                  {report.argumentosJuridicos.map((arg) => (
                    <li
                      key={arg}
                      className="flex gap-2 text-[11px] text-zinc-400 leading-relaxed"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E5FF]" />
                      {arg}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 transition-colors"
                >
                  Cerrar
                </button>
                <div className="px-4 py-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono text-center">
                  {report.sello}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}