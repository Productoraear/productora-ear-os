'use client';

import React, { useState } from 'react';
import NeuralGraph from '@/components/neural/NeuralGraph';
import NodeInspector from '@/components/neural/NodeInspector';
import { TaxonomyNode, RoleKey } from '@/types/neural';
import { Network, Sparkles, X } from 'lucide-react';

export function LumenConstellationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | null>(null);
  const [selectedNode, setSelectedNode] = useState<TaxonomyNode | null>(null);

  const activeRole: RoleKey = (selectedRole || (selectedNode?.role !== 'root' && selectedNode?.role ? selectedNode.role : 'artistas')) as RoleKey;

  return (
    <>
      {/* Floating Action Badge to Toggle Constellation */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-zinc-950/80 border border-amber-500/40 text-amber-300 backdrop-blur-xl shadow-[0_0_25px_rgba(236,182,19,0.25)] hover:border-amber-400 hover:scale-105 active:scale-95 transition-all text-xs font-mono font-bold tracking-wider uppercase cursor-pointer"
        aria-label="Abrir Constelación de Nodos Navegables EAR OS"
      >
        <Network className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>Constelación de Nodos</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
      </button>

      {/* Fullscreen Interactive Neural Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl transition-all animate-fade-in">
          {/* Top Control Bar */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-mono tracking-wide uppercase">
                  Constelación de Ecosistema EAR OS
                </h3>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Nodos interactivos navegables: Haz clic o arrastra para explorar arquetipos y servicios.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive Neural Canvas */}
          <div className="w-full h-full pt-20 relative">
            <NeuralGraph
              selectedRole={selectedRole}
              selectedNodeId={selectedNode ? selectedNode.id : null}
              onSelectRole={setSelectedRole}
              onSelectNode={setSelectedNode}
              className="w-full h-full"
            />

            {/* Node Inspector Overlay */}
            {selectedNode && (
              <div className="absolute bottom-6 left-6 max-w-sm w-full z-40">
                <NodeInspector
                  selectedRole={activeRole}
                  selectedNode={selectedNode}
                  onClose={() => setSelectedNode(null)}
                  onSelectSubNode={(sub) => setSelectedNode(sub)}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
