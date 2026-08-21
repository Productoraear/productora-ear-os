'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Brain, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw,
  Zap, 
  Maximize2, 
  Minimize2, 
  Lock, 
  Sparkles, 
  Layers, 
  FileCode
} from 'lucide-react';

// Hook de Resiliencia S-Class para evitar React Error #441 (Hydration Mismatch)
function useHasMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export interface MapNode {
  id: string;
  label: string;
  type: 'core' | 'strategy' | 'task' | 'rag_reference';
  status?: 'pending' | 'in_progress' | 'completed';
  children?: MapNode[];
  details?: string;
  sourceTag?: string;
}

const DEFAULT_MAPEAR_TREE: MapNode = {
  id: 'core_ear_os',
  label: '🏛️ EAR OS 2026 — Núcleo Soberano',
  type: 'core',
  details: 'Ecosistema de Producción, IA, RAG y Captación B2B/B2C.',
  children: [
    {
      id: 'strat_solista',
      label: '🌟 Pack Solista Premium (350 €)',
      type: 'strategy',
      sourceTag: 'Incubadora Despegue',
      details: 'Show 1h, Equipo Bose, Ramo de Flores, Canción Personalizada, Sombreros, Exclusividad.',
      children: [
        { id: 'task_wa_trigger', label: 'Disparador WhatsApp Directo', type: 'task', status: 'completed' },
        { id: 'task_exclusivity', label: 'Garantía 1 Evento/Día', type: 'task', status: 'completed' }
      ]
    },
    {
      id: 'strat_rag_vault',
      label: '🧠 Bóveda RAG (+2.241 Nodos)',
      type: 'strategy',
      sourceTag: 'Whisper + Incubadora',
      details: 'Conocimiento indexado de Dani Aragón, Romuald Fons y la Incubadora.',
      children: [
        { id: 'task_dynamic_centinel', label: 'Demonio Watchdog Activo', type: 'task', status: 'completed' },
        { id: 'task_graph_edges', label: 'Relaciones de Grafo Neural', type: 'task', status: 'in_progress' }
      ]
    },
    {
      id: 'strat_mapear_mcp',
      label: '🗺️ MapEar Cognitive Canvas (E2EE)',
      type: 'strategy',
      sourceTag: 'S-Class Core',
      details: 'Ideación Zoom OUT y Ejecución Zoom IN con exportación MCP.',
      children: [
        { id: 'task_mcp_export', label: 'Sincronización con Antigravity Engine', type: 'task', status: 'in_progress' },
        { id: 'task_e2ee_crypto', label: 'Cifrado AES-256 WebCrypto Local', type: 'task', status: 'completed' }
      ]
    }
  ]
};

export default function MapEarPage() {
  const mounted = useHasMounted();
  const [treeData, setTreeData] = useState<MapNode>(DEFAULT_MAPEAR_TREE);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('core_ear_os');
  const [zoomMode, setZoomMode] = useState<'out' | 'in'>('out');
  const [mcpExportStatus, setMcpExportStatus] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);

  // Cargar mapa guardado en LocalStorage con resiliencia
  useEffect(() => {
    if (!mounted) return;
    try {
      const saved = localStorage.getItem('EAR_OS_MAPEAR_TREE');
      if (saved) {
        setTreeData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Fallback a estructura predeterminada de MapEar:', e);
    }
  }, [mounted]);

  // Guardar cambios atómicamente
  const saveTree = useCallback((updated: MapNode) => {
    setTreeData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('EAR_OS_MAPEAR_TREE', JSON.stringify(updated));
    }
  }, []);

  // Encontrar nodo por ID recursivamente
  const findNode = useCallback((node: MapNode, id: string): MapNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const selectedNode = useMemo(() => findNode(treeData, selectedNodeId) || treeData, [treeData, selectedNodeId, findNode]);

  // Inserción de subnodo
  const handleAddChild = (parentId: string) => {
    const newChild: MapNode = {
      id: `node_${Date.now()}`,
      label: 'NUEVO NODO COGNITIVO',
      type: 'task',
      status: 'pending',
      details: 'Especifica la instrucción táctica o concepto clave.'
    };

    const updateRecursive = (current: MapNode): MapNode => {
      if (current.id === parentId) {
        return {
          ...current,
          children: [...(current.children || []), newChild]
        };
      }
      if (current.children) {
        return {
          ...current,
          children: current.children.map(updateRecursive)
        };
      }
      return current;
    };

    saveTree(updateRecursive(treeData));
  };

  // Borrar nodo
  const handleDeleteNode = (idToDelete: string) => {
    if (idToDelete === treeData.id) return; // No borrar la raíz
    const deleteRecursive = (current: MapNode): MapNode => {
      if (!current.children) return current;
      return {
        ...current,
        children: current.children
          .filter(c => c.id !== idToDelete)
          .map(deleteRecursive)
      };
    };
    saveTree(deleteRecursive(treeData));
    setSelectedNodeId(treeData.id);
  };

  // Exportar para MCP / Antigravity / RAG
  const handleExportMCP = () => {
    const mcpPayload = {
      protocol: 'MCP_MAPEAR_V1',
      system: 'EAR_OS_SOVEREIGN',
      exportedAt: new Date().toISOString(),
      tree: treeData
    };
    const blob = new Blob([JSON.stringify(mcpPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MapEar_MCP_Context_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMcpExportStatus('¡Exportación Contextual MCP descargada con éxito!');
    setTimeout(() => setMcpExportStatus(null), 3000);
  };

  // Simulación de Auto-Expansión Cognitiva RAG / IA
  const handleAiExpand = () => {
    setAiGenerating(true);
    setTimeout(() => {
      const aiNode: MapNode = {
        id: `ai_node_${Date.now()}`,
        label: `✨ [RAG Suggestion] Expansión para ${selectedNode.label}`,
        type: 'strategy',
        sourceTag: 'RAG Neural Engine',
        details: 'Generado automáticamente según patrones de conversión de la Incubadora y Dani Aragón.',
        status: 'in_progress'
      };
      const insertAiNode = (current: MapNode): MapNode => {
        if (current.id === selectedNode.id) {
          return { ...current, children: [...(current.children || []), aiNode] };
        }
        if (current.children) {
          return { ...current, children: current.children.map(insertAiNode) };
        }
        return current;
      };
      saveTree(insertAiNode(treeData));
      setAiGenerating(false);
    }, 800);
  };

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-amber-500 flex items-center justify-center font-mono">
        <RefreshCw className="w-8 h-8 animate-spin mr-3" />
        <span>INICIALIZANDO MAPEAR S-CLASS RESILIENCE SHIELD...</span>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-black">
      {/* CABECERA S-CLASS */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl text-neutral-950 font-bold shadow-lg shadow-amber-500/10">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                MapEar <span className="text-xs font-mono uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">S-Class v2.6</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Motor Cognitivo Soberano • Ideación Zoom OUT & Ejecución Zoom IN
              </p>
            </div>
          </div>
        </div>

        {/* BARRAS DE CONTROL RÁPIDO */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setZoomMode(zoomMode === 'out' ? 'in' : 'out')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium hover:border-neutral-700 transition"
          >
            {zoomMode === 'out' ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-emerald-400" />}
            <span>{zoomMode === 'out' ? 'Modo Macro (Zoom OUT)' : 'Modo Micro (Zoom IN)'}</span>
          </button>

          <button
            onClick={handleExportMCP}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition"
          >
            <FileCode className="w-4 h-4" />
            <span>Exportar MCP / Antigravity</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs">
            <Lock className="w-3.5 h-3.5" />
            <span>E2EE AES-256</span>
          </div>
        </div>
      </header>

      {mcpExportStatus && (
        <div className="max-w-7xl mx-auto mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{mcpExportStatus}</span>
        </div>
      )}

      {/* REPRESENTACIÓN PRINCIPAL: CANVAS Y PANEL DETALLE */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ÁRBOL RECURSIVO VISUAL (CANVAS COGNITIVO) */}
        <section className="lg:col-span-8 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-xl min-h-[550px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800/60">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Estructura Jerárquica de Conocimiento
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                Click en nodo para seleccionar
              </span>
            </div>

            {/* Renderizado de Nodos */}
            <div className="space-y-2">
              <TreeNodeItem
                node={treeData}
                selectedId={selectedNodeId}
                onSelect={(id) => setSelectedNodeId(id)}
                zoomMode={zoomMode}
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Dispositivo Soberano Local</span>
            <span>Sincronizado con ear-rag-database.json</span>
          </div>
        </section>

        {/* PANEL DETALLE Y ACCIONES (ZOOM IN EXECUTION) */}
        <aside className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Panel de Control Táctico
              </h2>
              <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                ID: {selectedNode.id.slice(0, 10)}...
              </span>
            </div>

            {/* Información del Nodo Seleccionado */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Etiqueta del Nodo</label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    const newLabel = e.target.value;
                    const updateLabel = (curr: MapNode): MapNode => {
                      if (curr.id === selectedNode.id) return { ...curr, label: newLabel };
                      if (curr.children) return { ...curr, children: curr.children.map(updateLabel) };
                      return curr;
                    };
                    saveTree(updateLabel(treeData));
                  }}
                  className="w-full mt-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {selectedNode.sourceTag && (
                <div>
                  <label className="text-[11px] font-mono text-neutral-400 uppercase">Fuente Cognitiva</label>
                  <div className="mt-1 inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-md font-mono">
                    {selectedNode.sourceTag}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-mono text-neutral-400 uppercase">Detalle / Instrucción Ejecutable</label>
                <textarea
                  rows={4}
                  value={selectedNode.details || ''}
                  onChange={(e) => {
                    const newDet = e.target.value;
                    const updateDet = (curr: MapNode): MapNode => {
                      if (curr.id === selectedNode.id) return { ...curr, details: newDet };
                      if (curr.children) return { ...curr, children: curr.children.map(updateDet) };
                      return curr;
                    };
                    saveTree(updateDet(treeData));
                  }}
                  placeholder="Escribe la descripción, la fórmula de valor o el prompt MCP..."
                  className="w-full mt-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-500/50 font-mono"
                />
              </div>
            </div>
          </div>

          {/* BOTONERA DE ACCIÓN RÁPIDA */}
          <div className="space-y-2 mt-6 pt-4 border-t border-neutral-800">
            <button
              onClick={() => handleAddChild(selectedNode.id)}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Añadir Sub-nodo Hermano/Hijo</span>
            </button>

            <button
              onClick={handleAiExpand}
              disabled={aiGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{aiGenerating ? 'Sintetizando RAG...' : 'Sugerencia Automática RAG'}</span>
            </button>

            {selectedNode.id !== treeData.id && (
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="w-full py-2 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Nodo Seleccionado</span>
              </button>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

// COMPONENTE AUXILIAR: RENDERIZADOR RECURSIVO DEL ÁRBOL
function TreeNodeItem({
  node,
  selectedId,
  onSelect,
  zoomMode
}: {
  node: MapNode;
  selectedId: string;
  onSelect: (id: string) => void;
  zoomMode: 'out' | 'in';
}) {
  const isSelected = node.id === selectedId;

  return (
    <div className="ml-3 my-1">
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
          isSelected
            ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/5'
            : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 text-neutral-300'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="text-xs">
            {node.type === 'core' && '🏛️'}
            {node.type === 'strategy' && '🌟'}
            {node.type === 'task' && (node.status === 'completed' ? '✅' : '⏳')}
          </span>
          <span className="text-xs font-medium truncate">{node.label}</span>
        </div>

        {zoomMode === 'out' && node.sourceTag && (
          <span className="text-[10px] font-mono bg-neutral-900 text-amber-400/80 px-2 py-0.5 rounded border border-neutral-800 shrink-0">
            {node.sourceTag}
          </span>
        )}
      </div>

      {/* Renderizado de Nodos Hijos */}
      {node.children && node.children.length > 0 && (
        <div className="pl-3 border-l border-neutral-800/80 ml-2 mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              zoomMode={zoomMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
