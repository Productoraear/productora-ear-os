'use client';

import React, { useState, useMemo, useId } from 'react';
import {
  Lightbulb,
  Download,
  Search,
  ExternalLink,
  Building2,
  Sparkles,
  FileDown,
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

const FILTER_TYPES = ['ALL', 'Licitación', 'Fabricante', 'Instalador', 'Mayorista'] as const;
type FilterType = (typeof FILTER_TYPES)[number];

const FILTER_LABELS: Record<FilterType, string> = {
  ALL: 'Todos',
  Licitación: 'Licitación',
  Fabricante: 'Fabricante',
  Instalador: 'Instalador',
  Mayorista: 'Mayorista',
};

export function ChristmasLightingB2GPanel({ initialData = [] }: LightingPanelProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('ALL');

  const searchInputId = useId();
  const resultsSummaryId = useId();
  const gridLabelId = useId();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialData.filter((p) => {
      const matchQuery =
        q.length === 0 ||
        p.empresa.toLowerCase().includes(q) ||
        p.ambito.toLowerCase().includes(q) ||
        p.capacidades.some((c) => c.toLowerCase().includes(q)) ||
        p.cpv_activos.some((cpv) => cpv.toLowerCase().includes(q));

      const matchType =
        selectedType === 'ALL' ||
        p.tipo_partner.toLowerCase().includes(selectedType.toLowerCase());
      return matchQuery && matchType;
    });
  }, [initialData, search, selectedType]);

  const resultsSummary =
    filtered.length === 1
      ? '1 proveedor encontrado'
      : `${filtered.length} proveedores encontrados`;

  return (
    <section
      className="space-y-6"
      aria-labelledby="christmas-lighting-panel-title"
      role="region"
    >
      {/* Cabecera Estratégica */}
      <header className="p-6 rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#161626] to-[#0d0d14] border border-[#ecb613]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono mb-2">
            <Lightbulb size={14} aria-hidden="true" focusable="false" />
            <span>RADAR PRIVADO B2G · CPV 31522000 (ALUMBRADO NAVIDEÑO)</span>
          </div>
          <h2
            id="christmas-lighting-panel-title"
            className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight font-syne"
          >
            Catálogo Soberano de Iluminación y Licitaciones Municipales
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-2xl font-light">
            Directorio confidencial de fabricantes líderes (Ximenez, Ilmex, Prilux, Electromiño) y
            expedientes de licitación del sector para subcontratación en contratos menores
            (&lt; 15.000 € Art. 118 LCSP).
          </p>
        </div>

        <nav
          className="flex flex-wrap items-center gap-3"
          aria-label="Acciones del catálogo de iluminación"
        >
          <a
            href="/arsenal/luces-navidad"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs font-mono flex items-center gap-2 border border-white/20 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            aria-label="Abrir catálogo 2026 EAR con 530 referencias"
          >
            <Sparkles size={14} className="text-[#ecb613]" aria-hidden="true" focusable="false" />
            <span>Catálogo 2026 EAR (530 Refs)</span>
          </a>
          <a
            href="/dossiers/dossier-embajadores-culturales-fitur-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-bold text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            aria-label="Descargar dossier PDF oficial (se abre en nueva pestaña)"
          >
            <Download size={14} aria-hidden="true" focusable="false" />
            <span>Dossier PDF Oficial</span>
          </a>
        </nav>
      </header>

      {/* Barra de Búsqueda y Filtros Rápidos */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <label htmlFor={searchInputId} className="sr-only">
            Buscar proveedor de iluminación por empresa, capacidad, CPV o provincia
          </label>
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            size={16}
            aria-hidden="true"
            focusable="false"
          />
          <input
            id={searchInputId}
            type="search"
            placeholder="Buscar por empresa, capacidad (3D, túneles, LED, arcos), CPV o provincia..."
            aria-label="Buscar proveedor de iluminación"
            aria-describedby={resultsSummaryId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#09090f] border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/50 focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 font-mono"
          />
        </div>

        <div
          role="group"
          aria-label="Filtrar por tipo de entidad"
          className="flex gap-2 overflow-x-auto no-scrollbar"
        >
          {FILTER_TYPES.map((type) => {
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                aria-pressed={isActive}
                aria-label={`Filtrar por tipo: ${FILTER_LABELS[type]}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] ${
                  isActive
                    ? 'bg-[#ecb613] text-black shadow-md'
                    : 'bg-[#09090f] border border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                {FILTER_LABELS[type]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumen de resultados para lectores de pantalla */}
      <p
        id={resultsSummaryId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {resultsSummary}
      </p>

      {/* Grid de Proveedores Privados */}
      {filtered.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="p-8 rounded-2xl bg-[#09090f] border border-white/10 text-center"
        >
          <p className="text-sm font-mono text-white/60">
            No se han encontrado proveedores que coincidan con los criterios de búsqueda.
          </p>
        </div>
      ) : (
        <ul
          aria-labelledby={gridLabelId}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0 m-0"
        >
          <span id={gridLabelId} className="sr-only">
            Listado de proveedores de iluminación navideña
          </span>
          {filtered.map((item) => {
            const cardTitleId = `provider-title-${item.id}`;
            const cardDescId = `provider-desc-${item.id}`;
            return (
              <li key={item.id} className="list-none">
                <article
                  aria-labelledby={cardTitleId}
                  aria-describedby={cardDescId}
                  className="p-5 rounded-2xl bg-[#09090f] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between group shadow-xl space-y-4 h-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        aria-label={`Tipo de partner: ${item.tipo_partner}`}
                      >
                        {item.tipo_partner}
                      </span>
                      <span
                        className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold"
                        aria-label={`Margen estimado de subcontratación: ${item.margen_estimado_subcontratacion}`}
                      >
                        Margen: {item.margen_estimado_subcontratacion}
                      </span>
                    </div>

                    <div>
                      <h3
                        id={cardTitleId}
                        className="text-base font-black text-white group-hover:text-[#ecb613] transition-colors line-clamp-1"
                      >
                        {item.empresa}
                      </h3>
                      <p
                        id={cardDescId}
                        className="text-[11px] font-mono text-white/40 mt-0.5 flex items-center gap-1.5"
                      >
                        <Building2
                          size={12}
                          className="text-[#ecb613]"
                          aria-hidden="true"
                          focusable="false"
                        />
                        <span>{item.sede_principal || item.ambito}</span>
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                        CNAE: {item.cnae}
                      </p>
                    </div>

                    {/* CPV Activos */}
                    <div className="space-y-1 pt-2 border-t border-white/5">
                      <span
                        id={`cpv-label-${item.id}`}
                        className="text-[9px] font-mono text-amber-400/80 uppercase block"
                      >
                        Códigos CPV Licitación:
                      </span>
                      <ul
                        aria-labelledby={`cpv-label-${item.id}`}
                        className="flex flex-wrap gap-1 list-none p-0 m-0"
                      >
                        {item.cpv_activos.map((cpv, i) => (
                          <li key={`${item.id}-cpv-${i}`} className="list-none">
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {cpv}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Capacidades Técnicas */}
                    <div className="space-y-1 pt-1">
                      <span
                        id={`cap-label-${item.id}`}
                        className="text-[9px] font-mono text-white/40 uppercase block"
                      >
                        Capacidades Técnicas:
                      </span>
                      <ul
                        aria-labelledby={`cap-label-${item.id}`}
                        className="flex flex-wrap gap-1.5 list-none p-0 m-0"
                      >
                        {item.capacidades.map((cap, i) => (
                          <li key={`${item.id}-cap-${i}`} className="list-none">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/5">
                              {cap}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Acciones y Enlaces Externos */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <span
                      className="text-[11px] font-mono text-white/50 truncate max-w-[150px]"
                      aria-label={`Contacto comercial: ${item.contacto_comercial}`}
                    >
                      {item.contacto_comercial}
                    </span>

                    <div
                      className="flex items-center gap-1.5"
                      role="group"
                      aria-label={`Acciones para ${item.empresa}`}
                    >
                      {item.catalogo_pdf && (
                        <a
                          href={item.catalogo_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/5 hover:bg-[#ecb613]/20 text-zinc-300 hover:text-[#ecb613] transition-colors border border-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                          title="Ver Catálogo PDF Oficial"
                          aria-label={`Ver catálogo PDF de ${item.empresa} (se abre en nueva pestaña)`}
                        >
                          <FileDown size={14} aria-hidden="true" focusable="false" />
                        </a>
                      )}
                      <a
                        href={item.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                        title="Visitar Web Oficial"
                        aria-label={`Visitar web oficial de ${item.empresa} (se abre en nueva pestaña)`}
                      >
                        <ExternalLink size={14} aria-hidden="true" focusable="false" />
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}