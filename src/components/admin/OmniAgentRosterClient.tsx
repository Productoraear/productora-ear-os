'use client';

import * as React from 'react';
import {
  Bot,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import type { FleetSpec } from '@/lib/agents/omegaFleet';
import { OmniAgentConsoleModal } from '@/components/agents/OmniAgentConsoleModal';

interface OmniAgentRosterClientProps {
  readonly fleet: readonly FleetSpec[];
  readonly totalSkills: number;
  readonly totalRules: number;
  readonly killSwitchActive: boolean;
  readonly dlqDepth: number;
}

const DIVISION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Comercial: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Técnica: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'Jurídica/B2G/Financiera': { bg: 'bg-amber-500/10', text: 'text-[#ecb613]', border: 'border-amber-500/30' },
  'VIMUME/B2B': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  Sector: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
  'Artist Career': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
};

export function OmniAgentRosterClient({
  fleet,
  totalSkills,
  totalRules,
  killSwitchActive,
  dlqDepth,
}: OmniAgentRosterClientProps): React.JSX.Element {
  const [search, setSearch] = React.useState('');
  const [selectedDivision, setSelectedDivision] = React.useState<string>('TODAS');

  const divisions = React.useMemo(() => {
    const set = new Set<string>();
    for (const item of fleet) {
      set.add(item.division);
    }
    return ['TODAS', ...Array.from(set)];
  }, [fleet]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return fleet.filter((item) => {
      const matchesDiv = selectedDivision === 'TODAS' || item.division === selectedDivision;
      if (!matchesDiv) return false;
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sector.toLowerCase().includes(q) ||
        item.division.toLowerCase().includes(q)
      );
    });
  }, [fleet, search, selectedDivision]);

  const handleOpenConsole = (agentId?: string): void => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('agent', 'true');
      if (agentId) url.searchParams.set('target', agentId);
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new Event('popstate'));
    }
  };

  return (
    <div className="space-y-6">
      {/* HUD Telemetría Superior */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Flota S-Class</span>
            <Bot className="w-4 h-4 text-[#ecb613]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{fleet.length}</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> 0 Huérfanos · 100% Cobertura
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Divisiones de Choque</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">6</div>
          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
            {totalSkills} skills · {totalRules} reglas · 6 divisiones
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Kill-Switch</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {killSwitchActive ? (
              <span className="text-rose-500">ACTIVO</span>
            ) : (
              <span className="text-emerald-400">DESPEJADO</span>
            )}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
            Circuit-breaker S-Class activo
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-500 uppercase">Cola DLQ / Fallos</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {dlqDepth >= 0 ? dlqDepth : '0'}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
            {dlqDepth === 0 ? '0 mensajes muertos' : 'Replay n8n disponible'}
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#09090d] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, función, gremio o división..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ecb613] transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-neutral-500 mr-1 hidden sm:block" />
          {divisions.map((div) => (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase whitespace-nowrap transition-colors ${
                selectedDivision === div
                  ? 'bg-[#ecb613] text-black font-bold shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {div}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleOpenConsole()}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-500 text-black font-bold font-mono text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-[0_0_20px_rgba(236,182,19,0.3)] whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5" /> Abrir Consola (Ctrl+Shift+A)
        </button>
      </div>

      {/* Grid de Agentes (48 S-Class) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((agent) => {
          const divStyle = DIVISION_COLORS[agent.division] ?? {
            bg: 'bg-white/5',
            text: 'text-neutral-400',
            border: 'border-white/10',
          };

          return (
            <div
              key={agent.id}
              className="p-4 rounded-2xl bg-[#09090d]/80 border border-white/10 hover:border-[#ecb613]/50 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono uppercase border ${divStyle.bg} ${divStyle.text} ${divStyle.border}`}
                  >
                    {agent.division}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">{agent.sector}</span>
                </div>

                <h3 className="text-sm font-bold text-white font-mono mt-2 flex items-center gap-1.5 group-hover:text-[#ecb613] transition-colors">
                  <Terminal className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#ecb613]" />
                  {agent.id}
                </h3>

                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Activo
                </span>

                <button
                  onClick={() => handleOpenConsole(agent.id)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#ecb613] text-neutral-300 hover:text-black transition-colors font-mono text-[11px] flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" /> Conversar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 rounded-2xl bg-[#09090d] border border-white/10 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-[#ecb613] mx-auto" />
          <div className="text-sm font-bold text-white">No hay agentes que coincidan con la búsqueda</div>
          <p className="text-xs text-neutral-400">
            Prueba a limpiar los términos de búsqueda o cambiar de división.
          </p>
        </div>
      )}

      {/* Modal de Consola OmniAgent */}
      <OmniAgentConsoleModal />
    </div>
  );
}
