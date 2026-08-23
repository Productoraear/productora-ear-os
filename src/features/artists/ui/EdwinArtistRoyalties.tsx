"use client";

import React, { useState, useRef } from 'react';
import { 
  BanknotesIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon, 
  ArrowDownTrayIcon, 
  SparklesIcon,
  CheckBadgeIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DocumentCheckIcon,
  ArrowUpTrayIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline';
import { UniversalCueBridge, CueSessionReport } from '@/lib/UniversalCueBridge';
import { CueSheetGenerator, ProofOfPlayCertificate, VenueMetadata } from '@/lib/cue-sheet-generator';

interface RoyaltyRecord {
  id: string;
  event: string;
  client: string;
  date: string;
  totalGross: number;
  artistNet: number; // 80%
  platformShare: number; // 10%
  vimumeShare: number; // 10%
  status: 'LIQUIDADO' | 'PENDIENTE_EVENTO' | 'PROCESANDO_STRIPE';
  venueType: 'BODA_VIP' | 'CORPORATIVO' | 'FESTIVAL_B2G' | 'STREAMING_B2B';
  sha256Proof: string;
}

const INITIAL_ROYALTIES: RoyaltyRecord[] = [
  {
    id: "ROY-2026-081",
    event: "Gala Nupcial Finca La Concepción (Marbella)",
    client: "Familia Gómez-Montoya",
    date: "2026-08-15",
    totalGross: 1450.00,
    artistNet: 1160.00, // 80%
    platformShare: 145.00, // 10%
    vimumeShare: 145.00, // 10%
    status: 'LIQUIDADO',
    venueType: 'BODA_VIP',
    sha256Proof: '7A9F31C80B22E14D'
  },
  {
    id: "ROY-2026-082",
    event: "Mariachi Sinfónico B2B — Inauguración Bodegas",
    client: "Grupo Hostelería Sur",
    date: "2026-08-20",
    totalGross: 850.00,
    artistNet: 680.00, // 80%
    platformShare: 85.00, // 10%
    vimumeShare: 85.00, // 10%
    status: 'LIQUIDADO',
    venueType: 'CORPORATIVO',
    sha256Proof: '3C19EA92DF01B56A'
  },
  {
    id: "ROY-2026-089",
    event: "Boda de Gala Jardines del Trapiche (Málaga)",
    client: "Pablo & Cristina",
    date: "2026-09-05",
    totalGross: 1750.00,
    artistNet: 1400.00, // 80%
    platformShare: 175.00, // 10%
    vimumeShare: 175.00, // 10%
    status: 'PENDIENTE_EVENTO',
    venueType: 'BODA_VIP',
    sha256Proof: '8E44BF109AA120CC'
  },
  {
    id: "ROY-2026-090",
    event: "Licencia Sincronización & Streaming B2B Venues",
    client: "Pool Hostelería Costa del Sol (12 Venues)",
    date: "2026-08-01",
    totalGross: 600.00,
    artistNet: 420.00, // 70% Pool Streaming
    platformShare: 120.00, // 20%
    vimumeShare: 60.00, // 10%
    status: 'LIQUIDADO',
    venueType: 'STREAMING_B2B',
    sha256Proof: '9B6E5430AA87F102'
  }
];

export const EdwinArtistRoyalties: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ROYALTIES' | 'CUE_BRIDGE'>('ROYALTIES');
  const [filter, setFilter] = useState<'ALL' | 'LIQUIDADO' | 'PENDIENTE_EVENTO'>('ALL');
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Cue Bridge State
  const [cueReport, setCueReport] = useState<CueSessionReport | null>(null);
  const [certificate, setCertificate] = useState<ProofOfPlayCertificate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredRecords = INITIAL_ROYALTIES.filter(r => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const totalArtistLiquidated = INITIAL_ROYALTIES
    .filter(r => r.status === 'LIQUIDADO')
    .reduce((acc, curr) => acc + curr.artistNet, 0);

  const totalPending = INITIAL_ROYALTIES
    .filter(r => r.status === 'PENDIENTE_EVENTO')
    .reduce((acc, curr) => acc + curr.artistNet, 0);

  const handlePayoutRequest = () => {
    setIsRequestingPayout(true);
    setTimeout(() => {
      setIsRequestingPayout(false);
      setPayoutSuccess(true);
      setTimeout(() => setPayoutSuccess(false), 5000);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        const report = UniversalCueBridge.parse(content, file.name);
        setCueReport(report);
        
        const cert = await CueSheetGenerator.generateCertificate(report, {
          venueName: 'Gala Edwin Agudelo Directo',
          venueNif: 'B-71758247',
          address: 'Auditorio Central',
          city: 'Málaga / Madrid',
          gpsCoordinates: '36.7213,-4.4214',
          ownerEmail: 'booking@edwinagudelo.es'
        });
        setCertificate(cert);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadCertificate = () => {
    if (!certificate) return;
    const html = CueSheetGenerator.renderPrintableHtml(certificate);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) win.focus();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-[#050505] text-zinc-100 font-sans">
      {/* HEADER S-CLASS */}
      <div className="bg-gradient-to-r from-zinc-900/90 via-black to-zinc-950 p-6 sm:p-8 rounded-3xl border border-[#ecb613]/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <ShieldCheckIcon className="w-4 h-4" />
              Split Soberano 80/10/10 & Proof of Play SHA-256
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-syne">
              Portal Financiero & <span className="text-[#ecb613]">Royalties de Autor</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              Liquidación soberana de directos, derechos conexos y streaming para <span className="text-zinc-200 font-semibold">Edwin Agudelo</span>. Facturación blindada con SHA-256 Price-Lock.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              onClick={handlePayoutRequest}
              disabled={isRequestingPayout}
              className="px-6 py-3.5 bg-gradient-to-r from-[#ecb613] to-[#d4a855] text-black font-bold text-sm rounded-xl shadow-lg shadow-[#ecb613]/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <SparklesIcon className="w-4 h-4" />
              {isRequestingPayout ? "Conectando con Stripe Express..." : "Solicitar Transferencia Stripe"}
            </button>
          </div>
        </div>

        {payoutSuccess && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-300">
            <CheckBadgeIcon className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Transferencia Stripe Connect iniciada. Los fondos auditados se liquidarán a tu cuenta bancaria en 24 horas.</span>
          </div>
        )}
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Caché Neto Liquidado</span>
            <BanknotesIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalArtistLiquidated.toFixed(2)} €</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono flex items-center gap-1">
            <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> 80% Retenido directamente
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Custodia en Depósito</span>
            <ClockIcon className="w-5 h-5 text-[#ecb613]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ecb613] font-mono">{totalPending.toFixed(2)} €</div>
          <div className="text-[11px] text-zinc-400 mt-2 font-mono">Liberación 48h pre-evento</div>
        </div>

        <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Fondo VIMUME I+D</span>
            <ShieldCheckIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{(totalArtistLiquidated * 0.125).toFixed(2)} €</div>
          <div className="text-[11px] text-zinc-400 mt-2 font-mono">10% Canon Musicoterapia</div>
        </div>

        <div className="bg-zinc-900/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Obras Registradas DNDA</span>
            <DocumentTextIcon className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">2 Obras / 100% IP</div>
          <div className="text-[11px] text-purple-400 mt-2 font-mono">Partidas 10-501 y 10-471</div>
        </div>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('ROYALTIES')}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'ROYALTIES' 
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20' 
              : 'text-zinc-400 hover:text-white bg-white/5'
          }`}
        >
          Liquidaciones & Contratos
        </button>
        <button
          onClick={() => setActiveTab('CUE_BRIDGE')}
          className={`px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'CUE_BRIDGE' 
              ? 'bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/20' 
              : 'text-zinc-400 hover:text-white bg-white/5'
          }`}
        >
          <DocumentCheckIcon className="w-4 h-4" />
          Universal Cue Bridge & Reclamo SGAE
        </button>
      </div>

      {/* TAB 1: ROYALTIES TABLE */}
      {activeTab === 'ROYALTIES' && (
        <div className="bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md animate-in fade-in duration-200">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white font-syne">Desglose de Liquidaciones & Contratos</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Trazabilidad matemática inmutable con reparto soberano</p>
            </div>

            <div className="flex items-center gap-2 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'ALL' ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                Todos ({INITIAL_ROYALTIES.length})
              </button>
              <button
                onClick={() => setFilter('LIQUIDADO')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'LIQUIDADO' ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                Liquidados
              </button>
              <button
                onClick={() => setFilter('PENDIENTE_EVENTO')}
                className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'PENDIENTE_EVENTO' ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
              >
                En Custodia
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/60 text-zinc-400 text-xs uppercase font-mono tracking-wider border-b border-white/5">
                <tr>
                  <th className="p-4 sm:px-6">Evento / Contrato</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Bruto Facturado</th>
                  <th className="p-4 text-[#ecb613]">Split Artista (80%)</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 sm:pr-6 text-right">Firma SHA-256</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300 font-mono text-xs">
                {filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:px-6">
                      <div className="font-bold text-white font-sans text-sm">{item.event}</div>
                      <div className="text-[11px] text-zinc-400">{item.client} • {item.id}</div>
                    </td>
                    <td className="p-4 text-zinc-400">{item.date}</td>
                    <td className="p-4 font-semibold text-zinc-200">{item.totalGross.toFixed(2)} €</td>
                    <td className="p-4 font-bold text-[#ecb613] text-sm">{item.artistNet.toFixed(2)} €</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 ${
                        item.status === 'LIQUIDADO' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {item.status === 'LIQUIDADO' ? <CheckBadgeIcon className="w-3.5 h-3.5" /> : <ClockIcon className="w-3.5 h-3.5" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 sm:pr-6 text-right font-mono text-[10px] text-zinc-400">
                      <span className="bg-black/50 px-2 py-1 rounded border border-white/5">{item.sha256Proof}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CUE BRIDGE & PROOF OF PLAY */}
      {activeTab === 'CUE_BRIDGE' && (
        <div className="bg-gradient-to-b from-zinc-950 to-black border border-cyan-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <DocumentCheckIcon className="w-4 h-4" />
                Proof of Play & SGAE Reporting
              </div>
              <h3 className="text-2xl font-bold text-white font-syne">
                Auditoría de Historial DJ & Emisión de Certificado Visado
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                Carga los sets sonados en tus directos para emitir el certificado SHA-256 y reclamar el 100% de los derechos de ejecución a SGAE y AIE.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                accept=".txt,.csv,.xml,.nml,.m3u,.m3u8" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ArrowUpTrayIcon className="w-4 h-4" />
                Importar Cue-Sheet DJ
              </button>
            </div>
          </div>

          {cueReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Motor Detectado</span>
                  <span className="text-white font-bold text-sm">{cueReport.softwareDetected}</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Obras Auditadas</span>
                  <span className="text-cyan-400 font-bold text-sm">{cueReport.totalTracks} Tracks</span>
                </div>
                <div>
                  <span className="text-zinc-500 uppercase block text-[10px]">Duración Total</span>
                  <span className="text-[#ecb613] font-bold text-sm">{cueReport.totalDurationFormatted}</span>
                </div>
              </div>

              {certificate && (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                      <CheckBadgeIcon className="w-4 h-4" />
                      <span>Acta Generada: {certificate.certificateId}</span>
                    </div>
                    <p className="text-xs text-zinc-300 font-mono">
                      Firma Digital: <code className="text-[#ecb613]">{certificate.sha256Proof.substring(0, 24)}...</code>
                    </p>
                  </div>

                  <button
                    onClick={handleDownloadCertificate}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    Descargar Certificado Oficial SGAE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EdwinArtistRoyalties;
