'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  RoleKey,
  TaxonomyNode,
  ROLE_DEFINITIONS,
  MASTER_TAXONOMY
} from '@/types/neural';
import {
  X,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface NodeInspectorProps {
  selectedRole: RoleKey;
  selectedNode: TaxonomyNode | null;
  onClose: () => void;
  onSelectSubNode: (node: TaxonomyNode) => void;
}

export default function NodeInspector({
  selectedRole,
  selectedNode,
  onClose,
  onSelectSubNode
}: NodeInspectorProps) {
  const roleDef = ROLE_DEFINITIONS[selectedRole];
  const primaryTaxonomy = MASTER_TAXONOMY.children?.find((c) => c.role === selectedRole);

  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedSubNodeId, setExpandedSubNodeId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/neural/telemetry?role=${selectedRole}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setTelemetry(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    // Disparar evento para que el asistente cambie de contexto
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ear-role-selected', {
          detail: {
            role: selectedRole,
            nodeId: selectedNode?.id || selectedRole,
            label: selectedNode?.label || roleDef.label
          }
        })
      );
    }

    return () => {
      isMounted = false;
    };
  }, [selectedRole, selectedNode, roleDef.label]);

  const handleInvokeAssistant = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ear-role-selected', {
          detail: {
            role: selectedRole,
            nodeId: selectedNode?.id || selectedRole,
            label: selectedNode?.label || roleDef.label,
            openChat: true
          }
        })
      );
    }
  };

  return (
    <aside
      aria-label={`Telemetría de ${roleDef.label}`}
      className="pointer-events-auto w-full max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white flex flex-col gap-5 max-h-[88vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-right-4 duration-300 z-50"
    >
      {/* Header del Cockpit */}
      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: roleDef.color }}
              className="w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
            />
            <span
              style={{ color: roleDef.color }}
              className="text-[10px] font-mono font-bold tracking-widest uppercase"
            >
              {roleDef.badge}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {roleDef.label}
          </h2>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {roleDef.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Cerrar Inspector"
        >
          <X size={18} />
        </button>
      </div>

      {/* Umbrales de Negocio y Métricas SSOT */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Cpu size={13} style={{ color: roleDef.color }} />
            UMBRALES OPERATIVOS (SSOT)
          </span>
          <span className="text-[9px] text-zinc-500 uppercase">
            {loading ? 'Sincronizando...' : 'Live 100%'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {selectedRole === 'artistas' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Split Soberano</span>
                <span className="text-sm font-bold text-white">80% / 10% / 10%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Tarifa Solista Base</span>
                <span className="text-sm font-bold text-rose-400">350,00 €</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Logística de Gira</span>
                <span className="text-sm font-bold text-white">Convoy 14 pax (85%)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Hábito / Clic</span>
                <span className="text-sm font-bold text-white">61 y 99 Días</span>
              </div>
            </>
          )}

          {selectedRole === 'eventos' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Ticket Suelo Bodas</span>
                <span className="text-sm font-bold text-amber-400">3.800,00 €</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Margen Bruto Mínimo</span>
                <span className="text-sm font-bold text-emerald-400">≥ 58% Neto</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Recurrencia Anual</span>
                <span className="text-sm font-bold text-white">30% (Fechas/Aniv.)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Presión Acústica</span>
                <span className="text-sm font-bold text-white">12 W/pax Bose F1</span>
              </div>
            </>
          )}

          {selectedRole === 'empresas' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Fincas Homologadas</span>
                <span className="text-sm font-bold text-emerald-400">12 Espacios Clave</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Comisión Afiliado</span>
                <span className="text-sm font-bold text-white">10% a 15% (~450 €)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Liquidación B2B</span>
                <span className="text-sm font-bold text-white">≤ 7 Días Hábiles</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">SLA Onboarding</span>
                <span className="text-sm font-bold text-white">&lt; 15 Minutos</span>
              </div>
            </>
          )}

          {selectedRole === 'instituciones' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Art. 118 LCSP Techo</span>
                <span className="text-sm font-bold text-cyan-400">14.990,00 €</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Margen Neto B2G</span>
                <span className="text-sm font-bold text-emerald-400">≥ 48%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Ciclo Cobro FACe</span>
                <span className="text-sm font-bold text-white">≤ 30 Días Hábiles</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Conformidad Digital</span>
                <span className="text-sm font-bold text-white">100% (DIR3 exacto)</span>
              </div>
            </>
          )}

          {selectedRole === 'vimume' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Neuroacústica</span>
                <span className="text-sm font-bold text-violet-400">40 Hz Gamma</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Límite Residencias</span>
                <span className="text-sm font-bold text-white">&lt; 75 dB SPL</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Mecenazgo Ley 49/02</span>
                <span className="text-sm font-bold text-white">80% Deducción</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex flex-col">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">Cohorte Piloto N</span>
                <span className="text-sm font-bold text-white">45 Pax (p &lt; 0.05)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sub-Nodos Satélites — Acordeón Expandible */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Layers size={13} style={{ color: roleDef.color }} />
            SUB-NODOS VINCULADOS
          </span>
          <span className="text-[10px] text-zinc-500">
            {primaryTaxonomy?.children?.length || 0} satélites
          </span>
        </div>

        <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {primaryTaxonomy?.children?.map((subNode) => {
            const isExpanded = expandedSubNodeId === subNode.id;
            const isSelected = selectedNode?.id === subNode.id;
            return (
              <div key={subNode.id} className="flex flex-col">
                {/* Cabecera del acordeón */}
                <button
                  type="button"
                  onClick={() => {
                    const nextId = isExpanded ? null : subNode.id;
                    setExpandedSubNodeId(nextId);
                    onSelectSubNode(subNode);
                  }}
                  aria-expanded={isExpanded}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    isExpanded || isSelected
                      ? 'bg-white/10 border-white/20 text-white font-medium'
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      style={{ backgroundColor: subNode.color || roleDef.color }}
                      className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    />
                    <span className="truncate font-mono tracking-wide">{subNode.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-zinc-500 shrink-0 transition-transform duration-200"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </button>

                {/* Panel de detalle expandible */}
                {isExpanded && (
                  <div className="mx-2 mb-1 mt-0.5 rounded-b-xl border border-t-0 border-white/10 bg-white/[0.03] p-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {subNode.description && (
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {subNode.description}
                      </p>
                    )}
                    {!subNode.description && (
                      <p className="text-[11px] text-zinc-500 italic">
                        Módulo estratégico vinculado al eje {roleDef.label}.
                      </p>
                    )}
                    {subNode.route && (
                      <Link
                        href={subNode.route}
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
                        style={{
                          color: roleDef.color,
                          backgroundColor: `${roleDef.color}18`,
                          border: `1px solid ${roleDef.color}40`,
                        }}
                      >
                        <ArrowRight size={11} />
                        Abrir módulo
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Acciones del Cockpit */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
        <Link
          href={roleDef.route}
          className="w-full py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase text-black flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
          style={{ backgroundColor: roleDef.color }}
        >
          <span>EXPLORAR SOLUCIÓN {roleDef.label.toUpperCase()}</span>
          <ArrowRight size={14} />
        </Link>

        <button
          type="button"
          onClick={handleInvokeAssistant}
          className="w-full py-2.5 px-4 rounded-xl font-mono text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles size={13} style={{ color: roleDef.color }} />
          <span>CONECTAR CON ASISTENTE LOCAL</span>
        </button>
      </div>
    </aside>
  );
}
