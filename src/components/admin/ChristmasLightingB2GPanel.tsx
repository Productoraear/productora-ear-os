'use client';

import React, { useState } from 'react';
import { 
  Lightbulb, 
  Shield, 
  Download, 
  FileText, 
  Search, 
  ExternalLink, 
  Zap, 
  Building2, 
  MapPin, 
  Sparkles, 
  Layers, 
  DollarSign, 
  CheckCircle2,
  FileDown
} from 'lucide-react';

export interface LightingProvider {
  id: string;
  indice?: number;
  empresa: string;
  cnae: string;
  ambito: string;
  cpv_activos: string[];
  capacidades: string[];
  contacto_comercial: string;
  web: string;
  tipo_partner: string;
  stand_ferias?: string;
  catalogo_pdf?: string;
  sede_principal?: string;
  margen_estimado_subcontratacion: string;
  estado_homologacion?: string;
}

interface LightingPanelProps {
  initialData?: LightingProvider[];
}

export function ChristmasLightingB2GPanel({ initialData = [] }: LightingPanelProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered = initialData.filter(p => {
    const q = search.toLowerCase();
    const matchQuery = 
      p.empresa.toLowerCase().includes(q) ||
      p.ambito.toLowerCase().includes(q) ||
      p.capacidades.some(c => c.toLowerCase().includes(q)) ||
      p.cpv_activos.some(cpv => cpv.toLowerCase().includes(q));
    
    const matchType = selectedType === 'ALL' || p.tipo_partner.toLowerCase().includes(selectedType.toLowerCase());
    return matchQuery && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera Estratégica */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#161626] to-[#0d0d14] border border-[#ecb613]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono mb-2">
            <Lightbulb size={14} /> RADAR PRIVADO B2G · CPV 31522000 (ALUMBRADO NAVIDEÑO)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-syne">
            Catálogo Soberano de Iluminación y Licitaciones Municipales
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl font-light">
            Directorio confidencial de fabricantes líderes (Ximenez, Ilmex, Prilux, Electromiño) y expedientes de licitación del sector para subcontratación en contratos menores (&lt; 15.000 € Art. 118 LCSP).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/arsenal/luces-navidad"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
          >
            <Sparkles size={14} className="text-[#ecb613]" /> Catálogo 2026 EAR (530 Refs)
          </a>
          <a
            href="/dossiers/dossier-embajadores-culturales-fitur-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Download size={14} /> Dossier PDF Oficial
          </a>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros Rápidos */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input
            type="text"
            placeholder="Buscar por empresa, capacidad (3D, túneles, LED, arcos), CPV o provincia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#09090f] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/50 font-mono"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['ALL', 'Licitación', 'Fabricante', 'Instalador', 'Mayorista'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-[#ecb613] text-black shadow-md'
                  : 'bg-[#09090f] border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'Todos' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Proveedores Privados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#09090f] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between group shadow-xl space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {item.tipo_partner}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Margen: {item.margen_estimado_subcontratacion}
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white group-hover:text-[#ecb613] transition-colors line-clamp-1">
                  {item.empresa}
                </h3>
                <p className="text-[11px] font-mono text-white/40 mt-0.5 flex items-center gap-1.5">
                  <Building2 size={12} className="text-[#ecb613]" /> {item.sede_principal || item.ambito}
                </p>
                <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                  CNAE: {item.cnae}
                </p>
              </div>

              {/* CPV Activos */}
              <div className="space-y-1 pt-2 border-t border-white/5">
                <span className="text-[9px] font-mono text-amber-400/80 uppercase block">Códigos CPV Licitación:</span>
                <div className="flex flex-wrap gap-1">
                  {item.cpv_activos.map((cpv, i) => (
                    <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {cpv}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacidades Técnicas */}
              <div className="space-y-1 pt-1">
                <span className="text-[9px] font-mono text-white/40 uppercase block">Capacidades Técnicas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.capacidades.map((cap, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Acciones y Enlaces Externos */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-white/50 truncate max-w-[150px]">
                {item.contacto_comercial}
              </span>

              <div className="flex items-center gap-1.5">
                {item.catalogo_pdf && (
                  <a
                    href={item.catalogo_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-[#ecb613]/20 text-zinc-300 hover:text-[#ecb613] transition-colors border border-white/5"
                    title="Ver Catálogo PDF Oficial"
                  >
                    <FileDown size={14} />
                  </a>
                )}
                <a
                  href={item.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5"
                  title="Visitar Web Oficial"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
