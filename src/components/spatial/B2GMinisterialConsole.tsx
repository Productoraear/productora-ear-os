'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Landmark,
  ShieldAlert,
  FileDown,
  Volume2,
  Users,
  CheckCircle2,
  Lock,
  Phone,
} from 'lucide-react';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
} from '@/lib/constants/ear-os-ssot';
import { CENTRALITA } from '@/lib/phone-constants';

function formatEur(amount: number): string {
  const [integer, decimals] = amount.toFixed(2).split('.');
  return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimals} €`;
}

export default function B2GMinisterialConsole(): React.JSX.Element {
  const [aforoPax, setAforoPax] = useState<number>(1500);
  const [riderSelected, setRiderSelected] = useState<string>('line_array_18k');
  const [dir3Code, setDir3Code] = useState<string>('L01480001');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Techo preventivo automático congelado en 14.250,00 € (Art. 118 LCSP)
  const baseBudget = Math.min(AJUSTE_PREVENTIVO_B2G_EUR, Math.round(aforoPax * 8.5));
  const isCappedAtLimit = baseBudget >= AJUSTE_PREVENTIVO_B2G_EUR;
  const currentBudgetEur = isCappedAtLimit ? AJUSTE_PREVENTIVO_B2G_EUR : baseBudget;

  const handleDownloadDossier = () => {
    setIsExporting(true);
    const dossierData = {
      tipoContrato: 'Menor de Servicios (Art. 118 LCSP)',
      organoContratante: `Entidad Local (Código DIR3: ${dir3Code})`,
      aforoHomologado: `${aforoPax} personas`,
      sistemaSonorizacion:
        riderSelected === 'line_array_18k'
          ? 'Line Array 18.000W RMS (Tiro > 80m, Nivel acústico < 75 dB SPL)'
          : 'Sistema Electro-Voice / d&b Audiotechnik Gala',
      presupuestoMaximoAdjudicacion: formatEur(currentBudgetEur),
      limiteLegalLCSP: formatEur(LIMITE_B2G_LCSP_EUR),
      techoPreventivoGarantizado: formatEur(AJUSTE_PREVENTIVO_B2G_EUR),
      codigoFACe: dir3Code,
      plazoExpediente: '< 72 horas para Secretaría e Intervención',
      fechaEmision: new Date().toISOString(),
      proveedorHomologado: 'Productora EAR S.L. · CIF B-88492019',
    };

    const blob = new Blob([JSON.stringify(dossierData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PLIEGO_TECNICO_B2G_ART118_${dir3Code}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setIsExporting(false), 800);
  };

  return (
    <div className="w-full rounded-3xl bg-[#09090d]/95 border border-cyan-500/30 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-5">
      {/* Cabecera Ministerial */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Consola de Contratación Pública · Art. 118 LCSP</span>
          </div>
          <h3 className="font-[family-name:var(--font-src-syne)] font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
            Expediente Exprés para Festejos &amp; Ayuntamientos
          </h3>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Adjudicación directa para comisiones de fiestas y corporaciones locales sin licitación pública abierta.
          </p>
        </div>

        {/* Indicador de Techo Preventivo */}
        <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-right shrink-0">
          <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            Techo Preventivo Art. 118
          </span>
          <div className="flex items-center gap-1.5 justify-end mt-0.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-lg font-black text-cyan-300">
              {formatEur(AJUSTE_PREVENTIVO_B2G_EUR)}
            </span>
          </div>
          <span className="block text-[9px] font-mono text-zinc-500">
            Límite legal estricto: {formatEur(LIMITE_B2G_LCSP_EUR)}
          </span>
        </div>
      </div>

      {/* Controles del Expediente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parámetro 1: Aforo del Evento */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="b2g-pax-slider" className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Aforo Previsto de Plaza / Recinto</span>
            </label>
            <span className="font-mono text-sm font-bold text-cyan-400">{aforoPax} personas</span>
          </div>
          <input
            id="b2g-pax-slider"
            type="range"
            min={100}
            max={5000}
            step={100}
            value={aforoPax}
            onChange={(e) => setAforoPax(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>100 pax</span>
            <span>2.500 pax</span>
            <span>5.000 pax (Aforo Máximo)</span>
          </div>
        </div>

        {/* Parámetro 2: Rider Técnico y Acústica */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="b2g-rider-select" className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#ecb613]" />
              <span>Rider Técnico Homologado</span>
            </label>
            <span className="text-[10px] font-mono text-emerald-400">RC 600.000€ Incluida</span>
          </div>
          <select
            id="b2g-rider-select"
            value={riderSelected}
            onChange={(e) => setRiderSelected(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="line_array_18k">Line Array S-Class (18.000W RMS · Tiro &gt; 80m)</option>
            <option value="compact_pa_8k">Sistema Compacto PA (8.000W RMS · Plazas Pequeñas)</option>
          </select>
          <p className="text-[11px] text-zinc-400 font-sans">
            Homologación acústica ambiental garantizada (&lt; 75 dB SPL, Ley 37/2003 del Ruido).
          </p>
        </div>
      </div>

      {/* Código DIR3 y Descarga en 1 Clic */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="b2g-dir3-input" className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Código DIR3 de la Entidad Local (para Factura Electrónica FACe):
          </label>
          <input
            id="b2g-dir3-input"
            type="text"
            value={dir3Code}
            onChange={(e) => setDir3Code(e.target.value.toUpperCase())}
            placeholder="Ej: L01480001"
            className="px-3 py-1.5 rounded-xl bg-black/70 border border-white/15 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 w-full sm:w-48"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleDownloadDossier}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(34,211,238,0.35)] flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Generando...' : 'Descargar Pliego & Memoria FACe (1 Clic)'}</span>
          </button>

          <Link
            href={`tel:${CENTRALITA.phone}`}
            className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 font-mono text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Centralita B2G ({CENTRALITA.display})</span>
          </Link>
        </div>
      </div>

      {/* Compromisos Constitucionales del Expediente */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans text-zinc-400 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Sin concurso: adjudicación directa por contrato menor</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Frenado en {formatEur(AJUSTE_PREVENTIVO_B2G_EUR)} para evitar nulidad de pleno derecho</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Memoria técnica visada con póliza de seguro de RC al día</span>
        </div>
      </div>
    </div>
  );
}
