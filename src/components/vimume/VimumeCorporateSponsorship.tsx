"use client";

/**
 * 🏛️ VIMUME CORPORATE SPONSORSHIP — SUITE DE APADRINAMIENTO RSC (S-CLASS)
 * ----------------------------------------------------------------------
 * Módulo B2B/ESG que consume el motor fiscal SSOT `calculateMecenazgo`
 * (Ley 49/2002 Art. 20 y RD-ley 6/2023) para el Impuesto sobre Sociedades.
 *
 * Reglas inmutables:
 *  - Deducción IS general: 40%  |  Fidelizada (>= 3 años): 50%.
 *  - Retorno Social de la Inversión (SROI) certificado: 4,85x.
 *  - Tiers de apadrinamiento: 3.000 € / 5.000 € / 10.000 €.
 */

import React, { useMemo, useState } from 'react';
import {
  Building2,
  Leaf,
  TrendingUp,
  Video,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  Quote,
} from 'lucide-react';
import {
  calculateMecenazgo,
  VIMUME_FISCAL_SSOT,
  type ContribuyenteType,
} from '@/lib/vimume-mecenazgo-engine';

export interface SponsorshipTier {
  id: 'aliado' | 'patrocinador' | 'fundador';
  name: string;
  amount: number;
  tagline: string;
  esg: string[];
  deliverables: string[];
}

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    id: 'aliado',
    name: 'Aliado RSC',
    amount: 3000,
    tagline: 'Primer escalón de impacto sociosanitario verificable.',
    esg: [
      'Sello Aliado VIMUME en memoria anual',
      'Reporte ESG de impacto agregado trimestral',
      'Reconocimiento en web institucional',
    ],
    deliverables: [
      'Vídeo-documental de 1 sesión con branding del sponsor',
      'Certificado fiscal Modelo 182 AEAT',
      '50 licencias formativas para empleados',
    ],
  },
  {
    id: 'patrocinador',
    name: 'Patrocinador Impacto',
    amount: 5000,
    tagline: 'Co-branding en programa clínico y comunicación institucional.',
    esg: [
      'Logotipo en material clínico homologado',
      'Auditoría SROI independiente (4,85x)',
      'Mención en memoria de sostenibilidad',
    ],
    deliverables: [
      'Vídeo-documental ejecutivo de 2 sesiones',
      '1 masterclass de musicoterapia para equipos',
      '140 licencias formativas para empleados',
    ],
  },
  {
    id: 'fundador',
    name: 'Fundador de Legado',
    amount: 10000,
    tagline: 'Apadrinamiento de un centro completo y su ciclo anual.',
    esg: [
      'Naming de programa "Ciclo con <empresa>"',
      'Dashboard ESG en vivo de impacto',
      'Presencia en nota de prensa y eventos institucionales',
    ],
    deliverables: [
      'Documental institucional de centro completo',
      'Evento corporativo de cierre con artistas EAR',
      '300 licencias formativas para empleados',
    ],
  },
];

export interface VimumeCorporateSponsorshipProps {
  /** Tipo de contribuyente. Por defecto persona jurídica (Impuesto de Sociedades). */
  donorType?: ContribuyenteType;
  /** Permite marcar la fidelización a 3 años (50% IS / 45% IRPF). */
  defaultRecurring?: boolean;
}

const IS_STANDARD = Math.round(VIMUME_FISCAL_SSOT.IS_STANDARD_RATE * 100);
const IS_RECURRING = Math.round(VIMUME_FISCAL_SSOT.IS_RECURRING_RATE * 100);
const SROI = VIMUME_FISCAL_SSOT.SROI_MULTIPLIER;

const eur = (n: number): string =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

export default function VimumeCorporateSponsorship({
  donorType = 'persona_juridica',
  defaultRecurring = false,
}: VimumeCorporateSponsorshipProps) {
  const [isRecurring, setIsRecurring] = useState<boolean>(defaultRecurring);
  const [customAmount, setCustomAmount] = useState<number>(5000);

  const tiers = useMemo(
    () =>
      SPONSORSHIP_TIERS.map((tier) => {
        const breakdown = calculateMecenazgo({
          amount: tier.amount,
          donorType,
          isRecurringThreeYears: isRecurring,
          donorName: 'Empresa Colaboradora',
        });
        return { tier, breakdown };
      }),
    [donorType, isRecurring],
  );

  const customBreakdown = useMemo(
    () =>
      calculateMecenazgo({
        amount: customAmount,
        donorType,
        isRecurringThreeYears: isRecurring,
      }),
    [customAmount, donorType, isRecurring],
  );

  const isCompany = donorType === 'persona_juridica';

  return (
    <section className="relative w-full overflow-x-hidden bg-[#030305] text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ecb613]/40 to-transparent" />
      <div className="absolute top-0 right-0 h-[520px] w-[520px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#00E5FF]/10 blur-[180px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        {/* Encabezado */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 px-5 py-2 text-[11px] font-black uppercase tracking-[0.4em] text-[#ecb613]">
            <Building2 size={14} /> Apadrinamiento Corporativo RSC
          </div>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.85]">
            Invierte en legado,
            <br />
            <span className="text-[#ecb613]">desgrava hasta el {IS_RECURRING}%</span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed">
            Bajo la Ley 49/2002 (Art. 20) y el RD-ley 6/2023, tu aportación al programa
            sociosanitario VIMUME es deducible en la cuota del Impuesto sobre Sociedades.
            Cada euro moviliza <strong className="text-[#00E5FF]">{SROI}x</strong> en valor
            social medido.
          </p>

          {/* Conmutador de fidelización */}
          <button
            type="button"
            onClick={() => setIsRecurring((v) => !v)}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-xs font-mono uppercase tracking-widest text-white/80 transition-all hover:border-[#ecb613]/40"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${isRecurring ? 'bg-emerald-400' : 'bg-white/20'}`}
            />
            {isRecurring
              ? `Fidelizado ≥ 3 años (${IS_RECURRING}% ${isCompany ? 'IS' : 'IRPF exceso'})`
              : `Aportación puntual (${IS_STANDARD}% ${isCompany ? 'IS' : 'IRPF'})`}
          </button>
        </div>

        {/* Tiers */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map(({ tier, breakdown }) => (
            <article
              key={tier.id}
              className="group relative flex flex-col rounded-[2rem] border border-white/10 bg-[#050507] p-8 transition-all hover:border-[#ecb613]/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ecb613]">
                  {tier.name}
                </span>
                <BadgeCheck className="h-5 w-5 text-[#00E5FF]" />
              </div>

              <div className="mt-6 font-mono text-4xl font-bold tracking-tight">
                {eur(tier.amount)}
              </div>
              <p className="mt-2 text-sm italic text-white/45">{tier.tagline}</p>

              <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  <TrendingUp size={13} /> Deducción fiscal
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-emerald-400">
                    −{eur(breakdown.deduccionTotal)}
                  </span>
                  <span className="text-xs text-white/40">
                    ({breakdown.porcentajeEfectivoAhorro}%)
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] font-mono text-white/60">
                  <span>Coste real</span>
                  <span className="text-right font-bold text-white">
                    {eur(breakdown.costeRealNeto)}
                  </span>
                  <span className="flex items-center gap-1 text-[#00E5FF]">
                    <Leaf size={12} /> SROI generado
                  </span>
                  <span className="text-right font-bold text-[#00E5FF]">
                    {eur(breakdown.sroiGenerado)}
                  </span>
                </div>
              </div>

              <ul className="mt-6 space-y-2.5 text-sm text-white/60">
                {tier.esg.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ecb613]" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/40">
                  <Video size={13} /> Entregables
                </div>
                <ul className="mt-3 space-y-2 text-xs text-white/50">
                  {tier.deliverables.map((item) => (
                    <li key={item} className="flex gap-3">
                      <Sparkles size={12} className="mt-0.5 shrink-0 text-[#00E5FF]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-xl bg-white/5 px-4 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-white/40">
                {breakdown.modelo182Clave}
              </div>
            </article>
          ))}
        </div>

        {/* Calculadora de retorno personalizada */}
        <div className="mt-16 grid gap-8 rounded-[2rem] border border-white/10 bg-[#050507] p-8 lg:grid-cols-2 lg:p-12">
          <div className="space-y-6">
            <h3 className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
              <ShieldCheck className="h-6 w-6 text-[#ecb613]" />
              Simulador de Retorno Corporativo
            </h3>
            <p className="text-sm text-white/50">
              Ajusta tu aportación y observa el coste real neto tras la deducción en cuota y
              el retorno social certificado.
            </p>

            <label className="block space-y-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                Aportación: {eur(customAmount)}
              </span>
              <input
                type="range"
                min={1000}
                max={25000}
                step={500}
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full accent-[#ecb613]"
                aria-label="Aportación corporativa en euros"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <Metric label="Aportación bruta" value={eur(customBreakdown.donacionBruta)} />
            <Metric
              label={`Deducción IS ${customBreakdown.porcentajeEfectivoAhorro}%`}
              value={`−${eur(customBreakdown.deduccionTotal)}`}
              tone="emerald"
            />
            <Metric label="Coste real neto" value={eur(customBreakdown.costeRealNeto)} />
            <Metric
              label={`SROI ${SROI}x`}
              value={eur(customBreakdown.sroiGenerado)}
              tone="cyan"
            />
            <div className="col-span-2 rounded-2xl border border-[#ecb613]/20 bg-[#ecb613]/5 p-5">
              <div className="flex items-start gap-3">
                <Quote className="h-5 w-5 shrink-0 text-[#ecb613]" />
                <p className="text-sm italic text-white/70">{customBreakdown.resumenEjecutivo}</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
          {VIMUME_FISCAL_SSOT.BENEFICIARY_DATA.name} · CIF{' '}
          {VIMUME_FISCAL_SSOT.BENEFICIARY_DATA.cif} ·{' '}
          {VIMUME_FISCAL_SSOT.BENEFICIARY_DATA.registerNumber}
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'emerald' | 'cyan';
}) {
  const toneClass =
    tone === 'emerald'
      ? 'text-emerald-400'
      : tone === 'cyan'
        ? 'text-[#00E5FF]'
        : 'text-white';
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      <div className={`mt-2 text-xl font-bold tracking-tight ${toneClass}`}>{value}</div>
    </div>
  );
}