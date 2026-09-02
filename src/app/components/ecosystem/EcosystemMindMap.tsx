'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Network, Search, ChevronRight, ChevronDown, ExternalLink, 
  Copy, Check, Layers, Sparkles, Building2, Users, Music, 
  Calendar, ShieldCheck, HeartPulse, ArrowRight
} from 'lucide-react';
import { ECOSYSTEM_STRUCTURE, EcosystemNode, exportToXMindTabbed } from '@/lib/constants/ecosystem-structure';

interface NodeCardProps {
  node: EcosystemNode;
  level: number;
  filterQuery: string;
}

const VERTICAL_ICONS: Record<string, any> = {
  'vert-artistas': Music,
  'vert-eventos': Calendar,
  'vert-empresas': Building2,
  'vert-instituciones': ShieldCheck,
  'vert-vimume': HeartPulse,
  'vert-nexus': Network,
};

const VERTICAL_COLORS: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'vert-artistas': { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300' },
  'vert-eventos': { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' },
  'vert-empresas': { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
  'vert-instituciones': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' },
  'vert-vimume': { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
  'vert-nexus': { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300' },
};

function TreeNode({ node, level, filterQuery }: NodeCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const matchesSearch = useMemo(() => {
    if (!filterQuery) return true;
    const query = filterQuery.toLowerCase();
    const checkMatch = (n: EcosystemNode): boolean => {
      if (n.title.toLowerCase().includes(query) || (n.category && n.category.toLowerCase().includes(query))) return true;
      return Boolean(n.children?.some(checkMatch));
    };
    return checkMatch(node);
  }, [node, filterQuery]);

  if (!matchesSearch) return null;

  const Icon = VERTICAL_ICONS[node.id] || (level === 0 ? Sparkles : null);
  const colorTheme = VERTICAL_COLORS[node.id] || { 
    bg: 'bg-slate-900/60', 
    border: 'border-slate-800', 
    text: 'text-slate-200', 
    badge: 'bg-slate-800 text-slate-400' 
  };

  return (
    <div className={`my-1.5 transition-all duration-200 ${level > 0 ? 'ml-4 sm:ml-8 pl-3 sm:pl-4 border-l-2 border-slate-800/80 hover:border-amber-500/50' : ''}`}>
      <div className={`group flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border backdrop-blur-md transition-all ${
        level === 0 
          ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-lg shadow-amber-950/20' 
          : level === 1
          ? `${colorTheme.bg} ${colorTheme.border} shadow-md`
          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isOpen ? 'Colapsar rama' : 'Expandir rama'}
            >
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <div className="w-4 h-4 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors" />
            </div>
          )}

          {Icon && <Icon className={`w-4 h-4 shrink-0 ${colorTheme.text}`} />}

          <span className={`font-medium truncate ${
            level === 0 
              ? 'text-lg font-bold text-amber-300 tracking-wide' 
              : level === 1 
              ? `text-base font-semibold ${colorTheme.text}` 
              : 'text-sm text-slate-200'
          }`}>
            {node.title}
          </span>

          {node.badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${colorTheme.badge}`}>
              {node.badge}
            </span>
          )}

          {node.isHero && (
            <span className="text-[10px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
              Paciente Cero
            </span>
          )}
        </div>

        {node.route && (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={node.route}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-black text-slate-300 transition-all border border-slate-700/60 hover:border-amber-400 shadow-sm"
            >
              <span>Ver en web</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeNode 
              key={child.id} 
              node={child} 
              level={level + 1} 
              filterQuery={filterQuery} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EcosystemMindMap() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyXMind = () => {
    const text = exportToXMindTabbed();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Soberano */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arquitectura Organizacional S-Class</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Ecosistema <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">Productora EAR</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Navegador interactivo de jerarquías, nodos operativos y mapeo canónico de rutas web integradas en EAR OS.
        </p>

        {/* Métricas del Sistema */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mt-8">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl font-bold text-amber-400 font-mono">6</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Verticales Macro</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl font-bold text-emerald-400 font-mono">32</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Sub-Ramas</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl font-bold text-purple-400 font-mono">78</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Nodos Activos</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-2xl font-bold text-cyan-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Next.js Vinculado</div>
          </div>
        </div>
      </div>

      {/* Barra de Control: Búsqueda y Exportar a XMind */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl mb-8 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nodo, vertical, servicio o ruta (ej. Navalcarnero, Edwin, Fitur, Bodas)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        <button
          onClick={handleCopyXMind}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shrink-0 ${
            copied 
              ? 'bg-emerald-500 text-black' 
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Copiado para XMind!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar para XMind</span>
            </>
          )}
        </button>
      </div>

      {/* Árbol Interactivo del Ecosistema */}
      <div className="p-4 sm:p-8 rounded-3xl bg-slate-950/60 border border-slate-800/80 shadow-2xl backdrop-blur-xl">
        <TreeNode 
          node={ECOSYSTEM_STRUCTURE.root} 
          level={0} 
          filterQuery={searchQuery} 
        />
      </div>
    </div>
  );
}
