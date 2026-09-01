'use client';

import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  Send,
  Award
} from 'lucide-react';
import rawDispatches from '@/data/b2g/diplomatic_dispatches_fitur26.json';

interface DiplomaticDispatch {
  lead_id: string;
  entity_name: string;
  contact_person: string;
  country_region: string;
  ifema_stand: string;
  target_budget: number;
  email_subject: string;
  dispatch_body: string;
  dossier_pdf_url: string;
  status: string;
}

export function FiturDiplomaticViewer() {
  const dispatches = rawDispatches as DiplomaticDispatch[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPavilion, setSelectedPavilion] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDispatch, setActiveDispatch] = useState<DiplomaticDispatch | null>(null);

  // Extract unique pavilions
  const pavilions = useMemo(() => {
    const set = new Set<string>();
    dispatches.forEach(d => {
      const match = d.ifema_stand.match(/Pabell[oó]n\s+(\d+)/i);
      if (match) {
        set.add(`Pabellón ${match[1]}`);
      }
    });
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });
  }, [dispatches]);

  // Filtered dispatches
  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => {
      const matchesSearch = 
        d.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.country_region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPavilion = 
        selectedPavilion === 'ALL' || 
        d.ifema_stand.toLowerCase().includes(selectedPavilion.toLowerCase());

      return matchesSearch && matchesPavilion;
    });
  }, [dispatches, searchTerm, selectedPavilion]);

  const handleCopyText = (d: DiplomaticDispatch) => {
    navigator.clipboard.writeText(`${d.email_subject}\n\n${d.dispatch_body}`);
    setCopiedId(d.lead_id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d0d15] to-[#161626] border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-mono font-bold uppercase">
              <Award size={14} />
              <span>Gobernanza B2G FITUR 2026 // IFEMA Madrid</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase tracking-tight">
              Despachos Diplomáticos: Embajadores Culturales
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl font-light">
              217 propuestas institucionales formalizadas bajo el Art. 118 LCSP (14.250,00 € + IVA).
              Asignación directa con mentoría escénica de Edwin Agudelo y rider acústico Bose F1 Model 812.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/dossiers/dossier-embajadores-culturales-fitur-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-mono text-xs font-bold uppercase rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Download size={14} />
              <span>Dossier PDF Oficial</span>
            </a>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Buscar por entidad, país, cónsul o delegado (ej. Barcelona, Chile, Rossi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#07070b] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedPavilion}
              onChange={(e) => setSelectedPavilion(e.target.value)}
              aria-label="Filtrar por pabellón IFEMA"
              className="w-full px-4 py-2.5 rounded-xl bg-[#07070b] border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            >
              <option value="ALL">Todos los Pabellones ({dispatches.length})</option>
              {pavilions.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Listado de Despachos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDispatches.map((d) => (
          <div
            key={d.lead_id}
            className="p-5 rounded-2xl bg-[#09090f] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                  {d.lead_id}
                </span>
                <span className="text-amber-400 font-bold">
                  {d.target_budget.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
                  {d.entity_name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono mt-0.5">
                  <MapPin size={12} className="text-[#ecb613]" />
                  <span>{d.country_region} — {d.ifema_stand}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-300 font-mono space-y-1">
                <div className="text-zinc-500 text-[10px]">CONTACTO ASIGNADO:</div>
                <div className="font-bold text-white line-clamp-1">{d.contact_person}</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleCopyText(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                    copiedId === d.lead_id
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-200'
                  }`}
                >
                  {copiedId === d.lead_id ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === d.lead_id ? '¡Copiado!' : 'Copiar Oficio'}</span>
                </button>

                <button
                  onClick={() => setActiveDispatch(d)}
                  className="py-2 px-3 rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <FileText size={13} />
                  <span>Ver Carta</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Previsualización de Carta */}
      {activeDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full max-h-[85vh] bg-[#0c0c14] border border-white/20 rounded-3xl p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-lg font-bold font-syne text-white">
                  {activeDispatch.entity_name}
                </h4>
                <div className="text-xs font-mono text-zinc-400">
                  {activeDispatch.country_region} // {activeDispatch.ifema_stand}
                </div>
              </div>
              <button
                onClick={() => setActiveDispatch(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-mono"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs font-mono text-zinc-300 leading-relaxed bg-[#06060a] p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
              {activeDispatch.dispatch_body}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-amber-400 font-bold">
                Contrato Menor: 14.250,00 € + IVA
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(activeDispatch)}
                  className="px-4 py-2 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl flex items-center gap-1.5"
                >
                  <Copy size={14} />
                  <span>Copiar al Portapapeles</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
