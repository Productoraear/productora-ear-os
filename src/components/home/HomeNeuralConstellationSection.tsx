'use client';

import React, { useState } from 'react';
import NeuralGraph from '@/components/neural/NeuralGraph';
import NodeInspector from '@/components/neural/NodeInspector';
import { TaxonomyNode, RoleKey } from '@/types/neural';
import { Network, Sparkles, X, ChevronDown, Compass } from 'lucide-react';

export function HomeNeuralConstellationSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);

  const activeRole: RoleKey = (selectedRole || (selectedNode?.role !== 'root' && selectedNode?.role ? selectedNode.role : 'artistas')) as RoleKey;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-white/10 overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            Cartografía del Ecosistema
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Constelación de Nodos Navegables
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1 font-sans">
            Explora de forma visual e interactiva la conexión entre artistas, fincas, instituciones B2G y sesiones clínicas VIMUME.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/40 bg-zinc-950/80 hover:bg-zinc-900 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(236,182,19,0.15)] cursor-pointer"
        >
          <Network className="w-4 h-4 text-amber-400" />
          <span>{isExpanded ? 'Reducir Explorador' : 'Expandir Vista Inmersiva'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Interactive Neural Canvas Box */}
      <div
        className={`relative w-full rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-2xl ${
          isExpanded ? 'h-[720px]' : 'h-[460px]'
        }`}
      >
        <NeuralGraph
          selectedRole={selectedRole}
          selectedNodeId={selectedNode ? selectedNode.id : null}
          onSelectRole={setSelectedRole}
          onSelectNode={setSelectedNode}
          className="w-full h-full"
        />

        {/* Top Floating Helper Tag */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Arrastra para rotar · Clic en un nodo para inspeccionar</span>
        </div>

        {/* Embedded Node Inspector Overlay */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-sm w-full z-30">
            <NodeInspector
              selectedRole={activeRole}
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              onSelectSubNode={(sub) => setSelectedNode(sub)}
            />
          </div>
        )}
      </div>
    </section>
  );
}

