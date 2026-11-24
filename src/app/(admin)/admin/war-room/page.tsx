'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Satellite,
  ShieldAlert,
  Network,
  Zap,
  Search,
  Filter,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Sliders,
  Download,
  Share2,
  Sparkles,
  Database,
  Globe,
  Terminal,
} from 'lucide-react';
import {
  computeBlastRadius,
  getTopology,
  resolveCanonicalNodeId,
  type TopologyNode,
  type TopologyEdge,
  type BlastRadiusReport,
  type CriticalityLevel,
  type TopologyNodeType,
} from '@/lib/graph/blast-radius';

// Colores canónicos por tipo de nodo (OLED Palette EAR OS)
const TYPE_COLORS: Record<TopologyNodeType, { fill: string; stroke: string; glow: string; label: string }> = {
  constitutional: { fill: '#d97706', stroke: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', label: 'Constitucional' },
  domain: { fill: '#059669', stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', label: 'Dominio / Paciente Cero' },
  route: { fill: '#2563eb', stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', label: 'Ruta Front (Next.js)' },
  api: { fill: '#7c3aed', stroke: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', label: 'Endpoint API (Back)' },
  data: { fill: '#e11d48', stroke: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)', label: 'Modelo Prisma (Datos)' },
  dataset: { fill: '#0891b2', stroke: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', label: 'Dataset Elevado (Zod/JSON)' },
};

interface VisualNode extends TopologyNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  highlighted?: boolean;
}

export default function AdminWarRoomPage(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const topology = useMemo(() => getTopology(), []);

  // Estados de control
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [selectedCritFilter, setSelectedCritFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('RULE-53');
  const [activeReport, setActiveReport] = useState<BlastRadiusReport | null>(null);
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Ejecutar Blast-Radius inicial
  useEffect(() => {
    try {
      const rep = computeBlastRadius(searchQuery);
      setActiveReport(rep);
      setSelectedNode(rep.targetNode);
    } catch {
      // Ignorar si no existe
    }
  }, []);

  const handleSearch = (queryId: string) => {
    setSearchQuery(queryId);
    try {
      const rep = computeBlastRadius(queryId);
      setActiveReport(rep);
      setSelectedNode(rep.targetNode);
    } catch {
      // Fallback
    }
  };

  // Filtrado de nodos para el canvas
  const filteredNodes = useMemo(() => {
    return topology.nodes.filter((n) => {
      const matchesType = selectedTypeFilter === 'ALL' || n.type === selectedTypeFilter;
      const matchesCrit = selectedCritFilter === 'ALL' || n.criticality === selectedCritFilter;
      return matchesType && matchesCrit;
    });
  }, [topology, selectedTypeFilter, selectedCritFilter]);

  // Posiciones visuales
  const visualNodes = useMemo<VisualNode[]>(() => {
    const width = 1200;
    const height = 700;
    const count = filteredNodes.length;

    return filteredNodes.map((node, i) => {
      const angle = (i / count) * 2 * Math.PI;
      // Dispersión en anillos concéntricos según el tipo
      let baseRadius = 250;
      if (node.type === 'constitutional') baseRadius = 80;
      else if (node.type === 'domain') baseRadius = 160;
      else if (node.type === 'api') baseRadius = 260;
      else if (node.type === 'data') baseRadius = 320;
      else if (node.type === 'route') baseRadius = 390;

      const jitter = (Math.sin(i * 13) * 35);
      const r = baseRadius + jitter;
      const x = width / 2 + Math.cos(angle) * r;
      const y = height / 2 + Math.sin(angle) * r;

      const isRoot = activeReport?.canonicalNodeId === node.id;
      const isImpacted = activeReport?.impactChain.some((item) => item.nodeId === node.id);

      return {
        ...node,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: isRoot ? 14 : isImpacted ? 9 : node.criticality === 'CRITICAL' ? 7 : 5,
        highlighted: isRoot || isImpacted,
      };
    });
  }, [filteredNodes, activeReport]);

  // Render loop en HTML5 Canvas con zoom, pan y efectos glow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // 1. Dibujar aristas relevantes
      const nodePosMap = new Map<string, { x: number; y: number }>();
      visualNodes.forEach((vn) => nodePosMap.set(vn.id, { x: vn.x, y: vn.y }));

      // Dibujar enlaces destacados primero
      if (activeReport) {
        ctx.lineWidth = 1.5;
        activeReport.impactChain.slice(0, 80).forEach((item) => {
          const targetPos = nodePosMap.get(item.nodeId);
          const rootPos = nodePosMap.get(activeReport.canonicalNodeId);
          if (targetPos && rootPos) {
            ctx.beginPath();
            ctx.strokeStyle = item.criticality === 'CRITICAL' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.4)';
            ctx.moveTo(rootPos.x, rootPos.y);
            ctx.lineTo(targetPos.x, targetPos.y);
            ctx.stroke();
          }
        });
      }

      // 2. Dibujar nodos
      visualNodes.forEach((vn) => {
        const style = TYPE_COLORS[vn.type] || TYPE_COLORS.route;

        ctx.beginPath();
        ctx.arc(vn.x, vn.y, vn.radius, 0, 2 * Math.PI);

        if (vn.highlighted) {
          ctx.fillStyle = vn.id === activeReport?.canonicalNodeId ? '#ffffff' : style.stroke;
          ctx.shadowColor = style.glow;
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = style.fill;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.lineWidth = vn.highlighted ? 2.5 : 1;
        ctx.strokeStyle = vn.highlighted ? '#ffffff' : style.stroke;
        ctx.stroke();

        // Rótulos para nodos destacados
        if (vn.highlighted || vn.type === 'domain' || vn.type === 'constitutional') {
          ctx.fillStyle = '#f3f4f6';
          ctx.font = vn.id === activeReport?.canonicalNodeId ? 'bold 11px Inter, sans-serif' : '9px Inter, sans-serif';
          ctx.shadowBlur = 0;
          const displayLabel = vn.id.length > 20 ? vn.id.slice(0, 18) + '…' : vn.id;
          ctx.fillText(displayLabel, vn.x + vn.radius + 4, vn.y + 3);
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [visualNodes, activeReport, zoom, pan]);

  // Manejo de Pan / Drag en Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.4), 3));
  };

  const presetNodes = [
    { label: 'RULE-53 (Paciente Cero)', id: 'RULE-53' },
    { label: 'RULE-64 (Fianza Stripe)', id: 'RULE-64' },
    { label: 'SSOT-PRICING (Zona Cero)', id: 'SSOT-PRICING' },
    { label: 'DATASET-LUCES (652 Refs)', id: 'DATASET-LUCES-NAVIDAD' },
    { label: 'API-STRIPE (Checkout)', id: 'API-STRIPE' },
    { label: 'OTZARRETA (Fincas 2026)', id: 'DOMAIN-OTZARRETA' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-neutral-100 p-4 md:p-8 font-sans">
      {/* 1. Header Ejecutivo & Telemetría SRE */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg">
                <Satellite className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  WAR ROOM & SEMANTIC CONTROL PLANE
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    TIER-1 RUNTIME
                  </span>
                </h1>
                <p className="text-sm text-neutral-400">
                  Consola ejecutiva de soberanía de infraestructura, topología de dependencias AST y motor de radio de impacto.
                </p>
              </div>
            </div>
          </div>

          {/* Métricas en vivo del plano de control */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              <span className="text-neutral-500">NODOS:</span>{' '}
              <span className="text-white font-bold">{topology.stats.total_nodes}</span>
            </div>
            <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              <span className="text-neutral-500">ARISTAS:</span>{' '}
              <span className="text-amber-400 font-bold">{topology.stats.total_edges}</span>
            </div>
            <div className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              <span className="text-neutral-500">AST INTROSPECTION:</span>{' '}
              <span className="text-emerald-400 font-bold">{topology.execution_duration_ms} ms</span>
            </div>
            <Link
              href="/admin/compiler"
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" /> Compilador Maestro
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Barra de Presets y Búsqueda de Blast-Radius */}
      <div className="max-w-7xl mx-auto mb-6 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">Presets Blast-Radius:</span>
            <div className="flex flex-wrap gap-1.5">
              {presetNodes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSearch(p.id)}
                  className={`text-xs px-2.5 py-1 rounded border transition-all ${
                    searchQuery === p.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                      : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-96">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="ID de nodo (ej: RULE-53, SSOT, API-STRIPE)..."
                className="w-full bg-black/60 border border-neutral-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg border border-neutral-700"
            >
              Auditar
            </button>
          </div>
        </div>
      </div>

      {/* 3. Panel Dual: Canvas de Grafo + Informe de Blast-Radius */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Canvas WebGL / Grafo Interactivo (8 Cols) */}
        <div className="lg:col-span-8 bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden relative flex flex-col">
          {/* Barra de Filtros del Grafo */}
          <div className="p-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono">Tipo:</span>
              {(['ALL', 'constitutional', 'domain', 'dataset', 'route', 'api', 'data'] as const).map((typeKey) => (
                <button
                  key={typeKey}
                  onClick={() => setSelectedTypeFilter(typeKey)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedTypeFilter === typeKey
                      ? 'bg-neutral-200 text-black font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {typeKey.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono">Zoom:</span>
              <button
                onClick={() => setZoom((z) => Math.min(z * 1.2, 3))}
                className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
              >
                +
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z * 0.8, 0.4))}
                className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
              >
                -
              </button>
              <button
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                className="px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Lienzo Canvas */}
          <div className="flex-1 relative min-h-[520px] bg-[#07070b] cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              width={1200}
              height={700}
              className="w-full h-full block"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onWheel={handleWheel}
            />

            {/* Leyenda de Capas Flotante */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur border border-neutral-800 rounded-lg p-2.5 text-[10px] space-y-1 font-mono">
              <div className="text-neutral-400 uppercase tracking-wider mb-1 font-bold">Capas de Topología</div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Constitucional (SSOT & Reglas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Dominio (Paciente Cero / Otzarreta)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span>Datasets Elevados (Zod / JSON)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Rutas Front (Next.js Pages)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span>Endpoints API & Webhooks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Persistencia Prisma (Modelos)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Consola de Blast-Radius & Auditoría (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {activeReport ? (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Auditoría de Impacto Transitivo
                  </span>
                  <h3 className="text-base font-bold text-white font-mono">{activeReport.canonicalNodeId}</h3>
                  <p className="text-xs text-neutral-400">{activeReport.targetNode.name}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                    activeReport.blastSeverity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  SEVERIDAD: {activeReport.blastSeverity}
                </span>
              </div>

              {/* Métricas del Reporte */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-black/40 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">TOTAL ALCANZADOS:</span>
                  <span className="text-lg font-bold text-white">{activeReport.totalImpactedNodes}</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">COMPUERTAS MECÁNICAS:</span>
                  <span className="text-lg font-bold text-amber-400">{activeReport.mechanicalGatesAffected.length}</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">DEPENDIENTES DIRECTOS:</span>
                  <span className="text-sm font-semibold text-neutral-200">{activeReport.directDependents.length}</span>
                </div>
                <div className="p-2.5 bg-black/40 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">TRANSITIVOS PROFUNDOS:</span>
                  <span className="text-sm font-semibold text-neutral-200">{activeReport.transitiveDependents.length}</span>
                </div>
              </div>

              {/* Compuertas Mecánicas Afectadas */}
              {activeReport.mechanicalGatesAffected.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Compuertas que Bloquean en Fallo:
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {activeReport.mechanicalGatesAffected.map((gate) => (
                      <div
                        key={gate.id}
                        className="p-2 bg-neutral-950 border border-amber-500/20 rounded text-xs flex items-center justify-between"
                      >
                        <span className="font-mono text-amber-300 font-bold">{gate.id}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {String(gate.metadata?.command || 'gate')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cadena de Impacto (Top 8) */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Cadena de Propagación:
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                  {activeReport.impactChain.slice(0, 8).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-neutral-950 border border-neutral-800 rounded flex items-center justify-between font-mono text-[11px]"
                    >
                      <div className="truncate mr-2">
                        <span className="text-neutral-500 mr-1.5">L{item.depth}</span>
                        <span className="text-neutral-200">{item.nodeId}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {item.relationship}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen Forense */}
              <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-lg text-xs text-neutral-400 leading-relaxed font-mono">
                {activeReport.summary}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-8 text-center text-neutral-500 text-xs">
              Selecciona un preset o busca un nodo para calcular el radio de impacto.
            </div>
          )}

          {/* Enlace de Bóveda Obsidian & Documentación */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">Bóveda Offline Obsidian</div>
                <div className="text-[11px] text-neutral-400">.vault/CONTROL_PLANE_INDEX.md</div>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
              YAML + [[wikilinks]]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
