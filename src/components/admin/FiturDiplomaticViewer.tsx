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
  Award,
  Globe,
  Compass,
  Table,
  Grid,
  User,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import rawDispatches from '@/data/b2g/diplomatic_dispatches_fitur26.json';

interface NavigableUrls {
  ifema_exhibitor_url?: string;
  google_fitur_search_url?: string;
  official_website_search_url?: string;
  official_tourism_portal?: string;
  fitur_10times_portal?: string;
  contact_search_url?: string;
}

interface DiplomaticDispatch {
  lead_id: string;
  entity_name: string;
  contact_person: string;
  country_region: string;
  ifema_stand: string;
  sector?: string;
  target_budget: number;
  email_subject: string;
  dispatch_body: string;
  dossier_pdf_url: string;
  navigable_urls?: NavigableUrls;
  consular_endorsement?: string;
  status: string;
}

export function FiturDiplomaticViewer() {
  const dispatches = rawDispatches as DiplomaticDispatch[];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPavilion, setSelectedPavilion] = useState('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDispatch, setActiveDispatch] = useState<DiplomaticDispatch | null>(null);

  // Extraer pabellones únicos
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

  // Filtrado reactivo de expositores
  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        d.entity_name.toLowerCase().includes(q) ||
        d.country_region.toLowerCase().includes(q) ||
        d.contact_person.toLowerCase().includes(q) ||
        d.ifema_stand.toLowerCase().includes(q);
      
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
      {/* 1. SELLO DE ACREDITACIÓN CONSULAR HISTÓRICA */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0a1410] to-[#0a0a10] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Aval Diplomático Certificado
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Teatro de La Latina // Cancillería
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-200 font-medium mt-1">
              Oficio de Agradecimiento Oficial del <strong>Consulado General Central de Colombia en Madrid</strong> a Edwin Agudelo y sus Mariachis en acto ministerial de Estado.
            </p>
          </div>
        </div>
        <a
          href="/dossiers/dossier-embajadores-culturales-fitur-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shrink-0"
        >
          <Download size={13} />
          <span>Ver Dossier Oficial</span>
        </a>
      </div>

      {/* 2. HEADER Y CONTROLADORES DE BÚSQUEDA Y VISTA */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#09090f] border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-mono font-bold uppercase mb-2">
              <Award size={14} />
              <span>Directorio Íntegro & Despachos FITUR 2026 // IFEMA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-syne text-white uppercase tracking-tight">
              217 Entidades B2G: Datos Íntegros & URLs Navegables
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl font-light">
              Catálogo oficial de delegaciones, consulados y patronatos de turismo con enlaces directos a sus fichas de IFEMA, portales oficiales y oficios bajo el Art. 118 LCSP (14.250 €).
            </p>
          </div>

          {/* Selector de Modo de Vista */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'TABLE'
                  ? 'bg-[#ecb613] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Table size={14} />
              <span>Tabla Íntegra ({filteredDispatches.length})</span>
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'CARDS'
                  ? 'bg-[#ecb613] text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Grid size={14} />
              <span>Tarjetas de Oficio</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Buscar por país, entidad, delegado o stand (ej. Colombia, Marruecos, Pabellón 4)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#06060a] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedPavilion}
              onChange={(e) => setSelectedPavilion(e.target.value)}
              aria-label="Filtrar por pabellón IFEMA"
              className="w-full px-4 py-2.5 rounded-xl bg-[#06060a] border border-white/10 text-zinc-300 text-xs font-mono focus:outline-none focus:border-[#ecb613]"
            >
              <option value="ALL">Todos los Pabellones ({dispatches.length})</option>
              {pavilions.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. VISTA EN MODO TABLA ÍNTEGRA NAVEGABLE */}
      {viewMode === 'TABLE' && (
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#09090f] border border-white/10 overflow-hidden space-y-4">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs font-mono border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">ID / Entidad Oficial</th>
                  <th className="py-3 px-3">País & Stand IFEMA</th>
                  <th className="py-3 px-3">Contacto Asignado</th>
                  <th className="py-3 px-3">URLs Navegables Reales</th>
                  <th className="py-3 px-3 text-right">Acción B2G</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDispatches.map((d) => (
                  <tr key={d.lead_id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
                        {d.entity_name}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {d.lead_id} · {d.sector || 'Institucional'}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-zinc-200 font-semibold">{d.country_region}</div>
                      <div className="text-[11px] text-[#ecb613]">{d.ifema_stand}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-zinc-300 font-medium">{d.contact_person}</div>
                      <a
                        href={d.navigable_urls?.contact_search_url || `https://www.google.com/search?q=${encodeURIComponent(d.contact_person + ' ' + d.entity_name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>Buscar Contacto</span>
                        <ExternalLink size={10} />
                      </a>
                    </td>

                    {/* ENLACES NAVEGABLES REALES */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {/* Ficha IFEMA */}
                        <a
                          href={d.navigable_urls?.ifema_exhibitor_url || `https://www.ifema.es/fitur/catalogo-expositores?q=${encodeURIComponent(d.entity_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Compass size={11} />
                          <span>IFEMA Stand</span>
                        </a>

                        {/* Portal Oficial Turismo */}
                        <a
                          href={d.navigable_urls?.official_tourism_portal || `https://www.google.com/search?q=${encodeURIComponent(d.country_region + ' portal turismo oficial')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-[10px] flex items-center gap-1 transition-all"
                        >
                          <Globe size={11} />
                          <span>Portal Turismo</span>
                        </a>

                        {/* Buscar Web Oficial */}
                        <a
                          href={d.navigable_urls?.google_fitur_search_url || `https://www.google.com/search?q=${encodeURIComponent(d.entity_name + ' FITUR 2026')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-[10px] flex items-center gap-1 transition-all"
                        >
                          <ExternalLink size={11} />
                          <span>Web Oficial</span>
                        </a>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopyText(d)}
                          title="Copiar texto formal del oficio"
                          className={`p-1.5 rounded-lg border text-xs transition-all ${
                            copiedId === d.lead_id
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-white/5 hover:bg-white/10 border-white/10 text-zinc-300'
                          }`}
                        >
                          {copiedId === d.lead_id ? <Check size={13} /> : <Copy size={13} />}
                        </button>

                        <button
                          onClick={() => setActiveDispatch(d)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#ecb613]/15 hover:bg-[#ecb613]/30 border border-[#ecb613]/40 text-[#ecb613] font-bold text-[10px] flex items-center gap-1 transition-all"
                        >
                          <FileText size={12} />
                          <span>Oficio</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. VISTA EN MODO TARJETAS DE OFICIO */}
      {viewMode === 'CARDS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                {/* Enlaces Rápidos en Tarjeta */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <a
                    href={d.navigable_urls?.ifema_exhibitor_url || `https://www.ifema.es/fitur/catalogo-expositores?q=${encodeURIComponent(d.entity_name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/20 flex items-center gap-1"
                  >
                    <Compass size={11} /> Stand IFEMA
                  </a>
                  <a
                    href={d.navigable_urls?.official_tourism_portal || `https://www.google.com/search?q=${encodeURIComponent(d.country_region + ' portal turismo oficial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-500/20 flex items-center gap-1"
                  >
                    <Globe size={11} /> Portal Oficial
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-300 font-mono space-y-1">
                  <div className="text-zinc-500 text-[10px]">DELEGADO / CONTACTO:</div>
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
      )}

      {/* 5. MODAL DE PREVISUALIZACIÓN DE CARTA OFICIAL */}
      {activeDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full max-h-[85vh] bg-[#0c0c14] border border-white/20 rounded-3xl p-4 sm:p-6 flex flex-col space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="text-base sm:text-lg font-bold font-syne text-white line-clamp-1">
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

            {/* Enlaces del Modal */}
            <div className="flex flex-wrap gap-2 p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-xs font-mono">
              <a
                href={activeDispatch.navigable_urls?.ifema_exhibitor_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                <Compass size={12} /> Stand IFEMA
              </a>
              <span className="text-zinc-600">·</span>
              <a
                href={activeDispatch.navigable_urls?.official_tourism_portal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <Globe size={12} /> Portal Oficial
              </a>
              <span className="text-zinc-600">·</span>
              <a
                href={activeDispatch.navigable_urls?.google_fitur_search_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline flex items-center gap-1"
              >
                <ExternalLink size={12} /> Web Entidad
              </a>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs font-mono text-zinc-300 leading-relaxed bg-[#06060a] p-4 rounded-2xl border border-white/5 whitespace-pre-wrap">
              {activeDispatch.dispatch_body}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-white/10">
              <span className="text-xs font-mono text-amber-400 font-bold text-center sm:text-left">
                Contrato Menor: 14.250,00 € + IVA
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(activeDispatch)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-[#ecb613] text-black font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5"
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
