'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Landmark,
  MapPin,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  FileText,
  Volume2,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  BadgeAlert,
  Building2,
  CircleDollarSign,
  Loader2
} from 'lucide-react';

interface B2GTenderOpportunity {
  id: string;
  expedienteRef: string;
  title: string;
  organoContratante: string;
  municipio: string;
  provincia: string;
  dir3Code: string;
  cpvCode: string;
  cpvDescription: string;
  importeBase: number;
  importeConIVA: number;
  fechaPublicacion: string;
  fechaLimite: string;
  diasRestantes: number;
  tipoContrato: 'MENOR' | 'NEGOCIADO_SIN_PUB' | 'ABIERTO';
  isLCSPCompliant: boolean;
  vimumeCompatible: boolean;
  matchScore: number;
  matchReasons: string[];
  status: 'NUEVA' | 'ANALIZADA' | 'BORRADOR_EMITIDO' | 'PRESENTADA' | 'ADJUDICADA' | 'DESCARTADA';
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  NUEVA: { label: 'Nueva', color: 'text-[#ecb613]', bg: 'bg-[#ecb613]/10 border-[#ecb613]/30' },
  ANALIZADA: { label: 'Analizada', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' },
  BORRADOR_EMITIDO: { label: 'Borrador Emitido', color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
  PRESENTADA: { label: 'Presentada', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  ADJUDICADA: { label: 'Adjudicada', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  DESCARTADA: { label: 'Descartada', color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/30' },
};

export function B2GTenderFeedCard() {
  const [tenders, setTenders] = useState<B2GTenderOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');
  const [generatingExpediente, setGeneratingExpediente] = useState<string | null>(null);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/b2g/alerts');
      const data = await res.json();
      if (data.success) {
        setTenders(data.tenders);
        setLastRefresh(new Date().toLocaleTimeString('es-ES'));
      }
    } catch {
      // Silently handle — keep existing data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleGenerateExpediente = (tenderId: string) => {
    setGeneratingExpediente(tenderId);
    setTimeout(() => {
      setTenders(prev =>
        prev.map(t =>
          t.id === tenderId ? { ...t, status: 'BORRADOR_EMITIDO' as const } : t
        )
      );
      setGeneratingExpediente(null);
    }, 2000);
  };

  const totalPipelineValue = tenders
    .filter(t => t.status !== 'DESCARTADA')
    .reduce((acc, t) => acc + t.importeBase, 0);

  const vimumeCount = tenders.filter(t => t.vimumeCompatible).length;
  const urgentCount = tenders.filter(t => t.diasRestantes <= 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5" /> Escáner de Licitaciones PLACSP · Art. 118 LCSP
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
            Licitaciones & Festejos Municipales B2G
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Rastreo automático de contratos menores (&lt;15.000 €) en la Plataforma de Contratación del Sector Público
          </p>
        </div>
        <button
          onClick={fetchTenders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613]/40 text-white text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Escaneando PLACSP...' : `Refrescar Feed`}
          {lastRefresh && <span className="text-gray-500 normal-case">({lastRefresh})</span>}
        </button>
      </div>

      {/* KPI Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#09090d] border border-white/10">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Oportunidades Detectadas</span>
          <p className="text-2xl font-bold text-white mt-1">{tenders.length}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#09090d] border border-white/10">
          <span className="text-[10px] text-gray-500 font-mono uppercase">Pipeline B2G</span>
          <p className="text-2xl font-bold text-[#ecb613] mt-1">{totalPipelineValue.toLocaleString('es-ES')} €</p>
        </div>
        <div className="p-3 rounded-xl bg-[#09090d] border border-emerald-500/20">
          <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" /> VIMUME Compatible
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{vimumeCount}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#09090d] border border-orange-500/20">
          <span className="text-[10px] text-gray-500 font-mono uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-400" /> Urgentes (≤3 días)
          </span>
          <p className="text-2xl font-bold text-orange-400 mt-1">{urgentCount}</p>
        </div>
      </div>

      {/* Tender Cards */}
      <div className="space-y-3">
        {tenders.map((tender) => {
          const statusCfg = STATUS_CONFIG[tender.status] || STATUS_CONFIG.NUEVA;
          const isUrgent = tender.diasRestantes <= 3;
          const isGenerating = generatingExpediente === tender.id;

          return (
            <article
              key={tender.id}
              className={`p-5 rounded-2xl bg-[#09090d] border transition-all hover:border-[#ecb613]/30 ${
                isUrgent ? 'border-orange-500/30' : 'border-white/10'
              }`}
            >
              {/* Top Row: Status + Match + Urgency */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-white">
                  Match: {tender.matchScore}%
                </span>
                {tender.vimumeCompatible && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" /> VIMUME &lt;75 dB
                  </span>
                )}
                {isUrgent && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> {tender.diasRestantes} días restantes
                  </span>
                )}
                {tender.isLCSPCompliant && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Art. 118 LCSP
                  </span>
                )}
              </div>

              {/* Title & Entity */}
              <h3 className="text-sm md:text-base font-bold text-white leading-snug mb-2">
                {tender.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-400 mb-4">
                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#258DCD] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Órgano Contratante</span>
                    <span className="text-white">{tender.organoContratante}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#AAD6CD] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Municipio</span>
                    <span className="text-white">{tender.municipio} ({tender.provincia})</span>
                    <span className="text-gray-600 block">DIR3: {tender.dir3Code}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CircleDollarSign className="w-3.5 h-3.5 text-[#ecb613] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-500 block">Importe Base (sin IVA)</span>
                    <span className="text-[#ecb613] text-base font-bold">{tender.importeBase.toLocaleString('es-ES')} €</span>
                    <span className="text-gray-600 block">CPV: {tender.cpvCode}</span>
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tender.matchReasons.map((reason, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/5"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              {/* Timeline */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-gray-500 mb-4 pb-3 border-b border-white/5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Publicado: {tender.fechaPublicacion}
                </span>
                <span className={`flex items-center gap-1 ${isUrgent ? 'text-orange-400 font-bold' : ''}`}>
                  <BadgeAlert className="w-3 h-3" /> Límite: {tender.fechaLimite}
                </span>
                <span>Exp: {tender.expedienteRef}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {tender.status === 'NUEVA' || tender.status === 'ANALIZADA' ? (
                  <button
                    onClick={() => handleGenerateExpediente(tender.id)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generando Expediente Art. 118...</>
                    ) : (
                      <><FileText className="w-3.5 h-3.5" /> Generar Expediente Art. 118</>
                    )}
                  </button>
                ) : tender.status === 'BORRADOR_EMITIDO' ? (
                  <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-mono uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Borrador Listo — Firma Pendiente
                  </span>
                ) : null}

                <Link
                  href={`/checkout/presupuesto?format=vimume-b2g&entity=${encodeURIComponent(tender.organoContratante)}&base=${tender.importeBase}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613]/40 text-white text-xs font-mono uppercase tracking-wider transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Calcular Split Soberano
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Techo Art. 118 LCSP: 14.250,00 € (Ajuste automático al 95%). Split Soberano 80/10/10.</span>
        </div>
        <span>Teléfono Retención: <strong className="text-white">+34 693 693 048</strong></span>
      </div>
    </div>
  );
}

export default B2GTenderFeedCard;
