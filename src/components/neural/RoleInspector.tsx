'use client';

import React from 'react';
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
  ShieldCheck,
  Zap
} from 'lucide-react';

interface RoleInspectorProps {
  selectedRole: RoleKey;
  selectedNode: TaxonomyNode | null;
  onClose: () => void;
  onSelectSubNode: (node: TaxonomyNode) => void;
}

export default function RoleInspector({
  selectedRole,
  selectedNode,
  onClose,
  onSelectSubNode
}: RoleInspectorProps) {
  const roleDef = ROLE_DEFINITIONS[selectedRole];
  const primaryTaxonomy = MASTER_TAXONOMY.children?.find((c) => c.role === selectedRole);

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
      aria-label={`Detalles de ${roleDef.label}`}
      className="pointer-events-auto w-full max-w-md bg-black/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-white flex flex-col gap-5 max-h-[85vh] overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-right-4 duration-300"
    >
      {/* Header del Inspector */}
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

      {/* Métricas Clave del Eje */}
      <div className="grid grid-cols-3 gap-2">
        {roleDef.summaryMetrics.map((metric, i) => (
          <div
            key={i}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-0.5"
          >
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              {metric.label}
            </span>
            <span
              style={{ color: i === 0 ? roleDef.color : '#ffffff' }}
              className="text-xs font-bold font-mono tracking-tight"
            >
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Descripción Operativa */}
      <div className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
        {selectedNode && selectedNode.id !== selectedRole ? (
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mb-1.5 uppercase">
              <Layers size={11} style={{ color: roleDef.color }} />
              Sub-nodo Activo: <strong className="text-white">{selectedNode.label}</strong>
            </div>
            <p>{selectedNode.description || roleDef.description}</p>
          </div>
        ) : (
          <p>{roleDef.description}</p>
        )}
      </div>

      {/* Sub-ramas de la Taxonomía Oficial (Mapa Conceptual) */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold flex items-center justify-between">
          <span>Sub-ramas Neuronales ({primaryTaxonomy?.children?.length || 0})</span>
          <span className="text-[9px] text-zinc-500">Interconecta y navega</span>
        </span>

        <div className="flex flex-col gap-2">
          {primaryTaxonomy?.children?.map((sec) => {
            const isSecSelected = selectedNode?.id === sec.id;
            return (
              <div
                key={sec.id}
                className="rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 p-2.5 transition-all flex flex-col gap-1.5"
              >
                <button
                  type="button"
                  onClick={() => onSelectSubNode(sec)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span
                    style={{ color: isSecSelected ? roleDef.color : undefined }}
                    className="text-xs font-medium text-zinc-200 group-hover:text-white flex items-center gap-2"
                  >
                    <span
                      style={{ backgroundColor: sec.color }}
                      className="w-1.5 h-1.5 rounded-full"
                    />
                    {sec.label}
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                  />
                </button>

                {/* Hijos de tercer nivel (hojas) */}
                {sec.children && sec.children.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 pl-3.5 border-l border-white/5">
                    {sec.children.map((leaf) => {
                      const isLeafSelected = selectedNode?.id === leaf.id;
                      return (
                        <button
                          key={leaf.id}
                          type="button"
                          onClick={() => onSelectSubNode(leaf)}
                          style={{
                            borderColor: isLeafSelected ? roleDef.color : 'rgba(255,255,255,0.08)',
                            backgroundColor: isLeafSelected ? roleDef.accentBg : 'rgba(255,255,255,0.02)'
                          }}
                          className="text-[10px] font-mono px-2 py-1 rounded-md border text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
                        >
                          <span
                            style={{ backgroundColor: roleDef.color }}
                            className="w-1 h-1 rounded-full opacity-60"
                          />
                          <span>{leaf.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de Acción Táctica y Asistente */}
      <div className="flex flex-col gap-2 pt-2 border-t border-white/10 mt-auto">
        <Link
          href={roleDef.route}
          style={{
            backgroundColor: roleDef.color,
            color: '#000000'
          }}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:brightness-110 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
        >
          <span>ACCEDER A LA PLATAFORMA {roleDef.label.toUpperCase()}</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>

        <button
          type="button"
          onClick={handleInvokeAssistant}
          className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles size={13} className="text-[#ecb613]" />
          <span>CONSULTAR CON EL ASISTENTE LOCAL</span>
        </button>
      </div>
    </aside>
  );
}
