'use client';

import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Landmark,
  HeartPulse,
  Send,
  Sparkles,
  Lock,
  PhoneCall,
  CalendarClock,
} from 'lucide-react';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  CENTRALITA_EAR_OS,
  VAT_RATE,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

/**
 * TOWNHALL INSTITUTIONAL FAST-TRACK (B2G)
 * ─────────────────────────────────────────────────────────────────────────────
 * Tramitador instantáneo para Ayuntamientos, Alcaldías y Concejalías de Festejos.
 * En 1 clic compila el expediente de Contrato Menor Art. 118 LCSP, blinda el
 * presupuesto al ajuste preventivo SSOT (< 14.250 €) y despacha el lead de forma
 * NO bloqueante al workflow n8n `b2b-quote` (cero leads huérfanos).
 */

type PackageKind = 'fiestas' | 'alumbrado' | 'vimume';

interface TownhallFormState {
  municipio: string;
  cif: string;
  dir3: string;
  packageKind: PackageKind;
  eventDate: string;
  contactName: string;
  contactEmail: string;
}

interface FormalProposal {
  expediente: string;
  text: string;
  baseEur: number;
  ivaEur: number;
  totalEur: number;
}

interface PackageMeta {
  label: string;
  description: string;
}

const PACKAGE_META: Record<PackageKind, PackageMeta> = {
  fiestas: {
    label: 'Fiestas Patronales',
    description: 'Escenarios móviles, orquestas de gala y sonorización calibrada a 12 W/pax.',
  },
  alumbrado: {
    label: 'Alumbrado Navideño & Acto Institucional',
    description: 'Producción artística y técnica para encendido navideño y conmemoraciones municipales.',
  },
  vimume: {
    label: 'Módulo Social VIMUME 40 Hz',
    description: 'Neuroacústica no invasiva para residencias municipales. Ley 49/2002 + Modelo 182.',
  },
};

const EMPTY_FORM: TownhallFormState = {
  municipio: '',
  cif: '',
  dir3: '',
  packageKind: 'fiestas',
  eventDate: '',
  contactName: '',
  contactEmail: '',
};

const CIF_PATTERN = /^[A-Z]\d{8}[A-Z0-9]$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const N8N_B2B_QUOTE_URL = 'https://n8n.productoraear.com/webhook/b2b-quote';

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildExpediente(seed: string): string {
  const normalized = seed.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'B2G';
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `EXP-118-${normalized}-${ts}`;
}

/** Despacho fire-and-forget al workflow n8n `b2b-quote`. La UI jamás se bloquea. */
function dispatchN8nB2bQuote(payload: Record<string, unknown>): void {
  try {
    fetch(N8N_B2B_QUOTE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => undefined);
  } catch {
    // Sin red o credenciales: el flujo principal continúa intacto.
  }
}

export default function TownhallInstitutionalFastTrack() {
  const [form, setForm] = useState<TownhallFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [proposal, setProposal] = useState<FormalProposal | null>(null);

  const baseEur = AJUSTE_PREVENTIVO_B2G_EUR;
  const ivaEur = round2(baseEur * VAT_RATE);
  const totalEur = round2(baseEur + ivaEur);

  const updateField = <K extends keyof TownhallFormState>(
    key: K,
    value: TownhallFormState[K],
  ): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setFormError(null);

    const { municipio, cif, dir3, packageKind, eventDate, contactName, contactEmail } = form;

    if (!municipio.trim() || municipio.trim().length < 3) {
      setFormError('Indica el organismo contratante (Ayuntamiento / Concejalía).');
      return;
    }
    if (!CIF_PATTERN.test(cif.trim().toUpperCase())) {
      setFormError('CIF/NIF no válido. Formato esperado: A12345678.');
      return;
    }
    if (!dir3.trim() || dir3.trim().length < 9) {
      setFormError('Código DIR3 municipal obligatorio para FacturaE (FACe).');
      return;
    }
    if (!eventDate) {
      setFormError('Indica la fecha prevista del evento.');
      return;
    }
    if (!contactName.trim() || contactName.trim().length < 2) {
      setFormError('Indica el nombre del contacto institucional.');
      return;
    }
    if (!EMAIL_PATTERN.test(contactEmail.trim())) {
      setFormError('Email de contacto no válido.');
      return;
    }

    setIsSubmitting(true);

    const expediente = buildExpediente(cif || municipio);
    const meta = PACKAGE_META[packageKind];
    const vimumePct = Math.round(SPLIT_SOBERANO.vimume * 100);

    // Despacho NO bloqueante al cluster n8n (b2b-quote). Cero leads huérfanos.
    dispatchN8nB2bQuote({
      event: 'townhall_b2g_fasttrack_submitted',
      expediente,
      packageKind,
      packageLabel: meta.label,
      municipio: municipio.trim(),
      cif: cif.trim().toUpperCase(),
      dir3: dir3.trim(),
      eventDate,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      baseEur,
      ivaEur,
      totalEur,
      art118LcspCeilingEur: LIMITE_B2G_LCSP_EUR,
      preventiveCeilingEur: AJUSTE_PREVENTIVO_B2G_EUR,
      vimumeSplitPct: SPLIT_SOBERANO.vimume,
      timestamp: new Date().toISOString(),
    });

    const text = [
      '════════════════════════════════════════════════════════════════════════════',
      'PROPUESTA FORMAL · CONTRATO MENOR DE SERVICIOS ARTÍSTICOS (ART. 118 LCSP)',
      `EXPEDIENTE: ${expediente}`,
      '════════════════════════════════════════════════════════════════════════════',
      '',
      `1. ORGANISMO CONTRATANTE: ${municipio.trim()}`,
      `   CIF: ${cif.trim().toUpperCase()}  ·  CÓDIGO DIR3: ${dir3.trim()}`,
      `   FECHA PREVISTA: ${eventDate}`,
      '',
      `2. OBJETO: ${meta.label} — ${meta.description}`,
      '',
      '3. DESGLOSE ECONÓMICO (IVA EXCLUIDO, BASE PREVENTIVA AL 95%):',
      `   Base imponible preventiva: ${baseEur.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`,
      `   Techo legal Art. 118 LCSP: ${LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES', { minimumFractionDigits: 2 })} € (ajuste preventivo blindado)`,
      `   IVA (${(VAT_RATE * 100).toFixed(0)}%): ${ivaEur.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`,
      `   TOTAL CON IVA: ${totalEur.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €`,
      '',
      '4. GARANTÍAS Y SOLVENCIA TÉCNICA:',
      '   - Seguro de Responsabilidad Civil por importe de 1.000.000 €.',
      '   - Sonorización certificada Ley 37/2003 (límite salud pública < 75 dB SPL, 12 W/pax).',
      '   - Facturación electrónica FacturaE (FACe) y código DIR3 vinculado.',
      '',
      '5. MÓDULO SOCIAL VIMUME (LEY 49/2002 DE MECENAZGO):',
      '   - Protocolo 40 Hz Gamma no invasivo para mayores en residencias municipales.',
      `   - Destino social del ${vimumePct}% del Split Soberano 80/10/10.`,
      '   - Emisión de certificado RSC/ESG y modelo 182 (deducción fiscal AEAT).',
      '',
      `6. CONTACTO: ${contactName.trim()} · ${contactEmail.trim()}`,
      `   Centralita oficial (CEO Edwin Agudelo): ${CENTRALITA_EAR_OS}`,
      '',
      'La presente propuesta queda sujeta a verificación de disponibilidad y despacho',
      'inmediato vía n8n. El depósito de blindaje (100 €) es 100% deducible del total.',
      '════════════════════════════════════════════════════════════════════════════',
    ].join('\n');

    setProposal({ expediente, text, baseEur, ivaEur, totalEur });
    setIsSubmitting(false);
  };

  const handleReset = (): void => {
    setForm(EMPTY_FORM);
    setProposal(null);
    setFormError(null);
  };

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola Productora EAR, solicito tramitación B2G Art. 118 LCSP para mi municipio.',
  )}`;

  return (
    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-8">
      {/* Cabecera del tramitador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4] shrink-0">
            <Landmark size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-[0.3em] font-bold">
              Fast-Track · 1 clic · &lt; 14.250 €
            </span>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
              Tramitador Institucional Art. 118 LCSP
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
              Presupuesto preventivo blindado al 95% del techo legal, seguro de RC de 1.000.000 €,
              módulo social VIMUME y despacho inmediato al cluster n8n.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 text-right">
          <div className="px-4 py-2 rounded-2xl bg-[#06b6d4]/10 border border-[#06b6d4]/30">
            <div className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-wider">Base preventiva</div>
            <div className="text-lg font-black text-white font-syne">
              {baseEur.toLocaleString('es-ES')} €
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/40">
            Techo legal: {LIMITE_B2G_LCSP_EUR.toLocaleString('es-ES')} € · IVA {Math.round(VAT_RATE * 100)}%
          </span>
        </div>
      </div>

      {/* Formulario de tramitación */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label htmlFor="tf-municipio" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Organismo contratante
            </label>
            <input
              id="tf-municipio"
              type="text"
              value={form.municipio}
              onChange={(e) => updateField('municipio', e.target.value)}
              placeholder="Ayuntamiento de Toledo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tf-cif" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              CIF / NIF
            </label>
            <input
              id="tf-cif"
              type="text"
              value={form.cif}
              onChange={(e) => updateField('cif', e.target.value.toUpperCase())}
              placeholder="P4516800E"
              maxLength={9}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tf-dir3" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Código DIR3 municipal
            </label>
            <input
              id="tf-dir3"
              type="text"
              value={form.dir3}
              onChange={(e) => updateField('dir3', e.target.value)}
              placeholder="L01451688"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tf-fecha" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Fecha prevista del evento
            </label>
            <input
              id="tf-fecha"
              type="date"
              value={form.eventDate}
              onChange={(e) => updateField('eventDate', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tf-contacto" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Nombre del contacto institucional
            </label>
            <input
              id="tf-contacto"
              type="text"
              value={form.contactName}
              onChange={(e) => updateField('contactName', e.target.value)}
              placeholder="Concejalía de Festejos"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tf-email" className="text-[10px] font-mono font-bold uppercase text-white/50 block">
              Email de contacto
            </label>
            <input
              id="tf-email"
              type="email"
              value={form.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="festejos@ayuntamiento.es"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#06b6d4] font-mono transition-all"
            />
          </div>

        </div>

        {/* Selector de paquete */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase text-white/50 block">Paquete institucional</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(PACKAGE_META) as PackageKind[]).map((kind) => {
              const meta = PACKAGE_META[kind];
              const isActive = form.packageKind === kind;
              const Icon = kind === 'vimume' ? HeartPulse : kind === 'alumbrado' ? Sparkles : Building2;
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => updateField('packageKind', kind)}
                  aria-pressed={isActive}
                  className={`rounded-2xl border p-4 text-left transition-all duration-300 ease-out ${
                    isActive
                      ? 'bg-[#06b6d4]/10 border-[#06b6d4]/50 shadow-[0_0_24px_rgba(6,182,212,0.25)]'
                      : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/[0.07]'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-[#06b6d4]' : 'text-white/50'} />
                  <div className="mt-2 text-xs font-bold uppercase text-white font-mono">{meta.label}</div>
                  <p className="mt-1 text-[11px] text-zinc-400 leading-relaxed">{meta.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blindaje legal */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white uppercase font-mono text-[10px]">
              <ShieldCheck size={14} className="text-[#06b6d4]" /> RC 1.000.000 €
            </div>
            <p className="text-zinc-400">Seguro de responsabilidad civil y solvencia técnica certificada.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white uppercase font-mono text-[10px]">
              <HeartPulse size={14} className="text-[#06b6d4]" /> VIMUME Ley 49/2002
            </div>
            <p className="text-zinc-400">Módulo social 40 Hz + Modelo 182 y deducción fiscal AEAT.</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white uppercase font-mono text-[10px]">
              <Lock size={14} className="text-[#06b6d4]" /> Ajuste preventivo 95%
            </div>
            <p className="text-zinc-400">Blindado frente a reparos de intervención del Tribunal de Cuentas.</p>
          </div>
        </div>

        {formError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
            {formError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#06b6d4] to-[#0891b2] text-black font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.35)] hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
          >
            <Send size={15} />
            <span>{isSubmitting ? 'Tramitando expediente...' : 'Tramitar en 1 clic · Art. 118 LCSP'}</span>
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wider hover:bg-emerald-500/25 transition-all"
          >
            <PhoneCall size={14} />
            <span>Gabinete técnico: {CENTRALITA_EAR_OS}</span>
          </a>
        </div>

      </form>

      {/* Propuesta formal generada */}
      {proposal && (
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-[#ecb613]" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Propuesta formal {proposal.expediente} lista para presentación
                </span>
                <span className="text-[10px] font-mono text-white/40">
                  Base {proposal.baseEur.toLocaleString('es-ES')} € + IVA {proposal.ivaEur.toLocaleString('es-ES')} €
                  = {proposal.totalEur.toLocaleString('es-ES')} € total
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                <CheckCircle2 size={14} /> Despachado a n8n
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition-all"
              >
                Nueva tramitación
              </button>
            </div>
          </div>

          <pre className="w-full bg-black/60 border border-white/10 rounded-2xl p-6 text-[11px] font-mono text-white/80 overflow-x-auto whitespace-pre-wrap max-h-[360px] leading-relaxed select-all">
            {proposal.text}
          </pre>
        </div>
      )}

      <p className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
        <CalendarClock size={12} className="text-white/30" />
        La tramitación no genera factura ni cargo: solo compila la propuesta formal y la despacha al
        cluster n8n en segundo plano.
      </p>
    </div>
  );
}


