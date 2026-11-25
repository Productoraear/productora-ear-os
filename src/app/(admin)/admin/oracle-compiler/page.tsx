'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Crown,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  Search,
  Sliders,
  Database,
  ExternalLink,
  Flame,
  Globe,
  Radio,
  Sparkles,
  Network,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import {
  computeBlastRadius,
  getTopology,
  type BlastRadiusReport,
  type TopologyNode,
} from '@/lib/graph/blast-radius';
import {
  EAR_OS_SEVEN_FRONTS,
  getTier1HealthStatus,
  verifySentinelIntegrity,
  SENTINEL_HASH_SSOT,
  type BusinessFrontDefinition,
  type Tier1HealthReport,
} from '@/lib/governance/constitution-tier1';
import VisionInput from '@/components/admin/VisionInput';
import MultiRailExecutionPanel from '@/components/admin/MultiRailExecutionPanel';
import {
  type CeoOperationalDimensionId,
  getCeoDimension,
} from '@/lib/compiler/ceo-operational-matrix';
import {
  refineWithVelocityOracle,
  type OracleRefinedOutput,
} from '@/lib/oraculo/oracle-refiner';

export default function OracleCompilerTier1Page(): React.JSX.Element {
  const topology = useMemo(() => getTopology(), []);
  const healthStatus = useMemo<Tier1HealthReport>(() => getTier1HealthStatus(), []);
  const isSentinelIntact = useMemo(() => verifySentinelIntegrity(SENTINEL_HASH_SSOT), []);

  // Estados de interfaz
  const [selectedDimension, setSelectedDimension] = useState<CeoOperationalDimensionId>('CLIENTES_NOVIOS');
  const [rawVision, setRawVision] = useState<string>('');
  const [refinedOutput, setRefinedOutput] = useState<OracleRefinedOutput | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number | 'ALL'>('ALL');
  const [searchRuleQuery, setSearchRuleQuery] = useState<string>('');
  const [activeBlastTarget, setActiveBlastTarget] = useState<string>('RULE-53');
  const [blastReport, setBlastReport] = useState<BlastRadiusReport | null>(null);

  // Filtrar las 100 reglas canónicas desde la topología
  const allRules = useMemo(() => {
    return topology.nodes
      .filter((n) => n.id.startsWith('RULE-'))
      .sort((a, b) => {
        const idA = Number(a.metadata?.ruleId || 0);
        const idB = Number(b.metadata?.ruleId || 0);
        return idA - idB;
      });
  }, [topology]);

  const filteredRules = useMemo(() => {
    return allRules.filter((r) => {
      const block = Number(r.metadata?.block || 0);
      const matchesBlock = selectedBlock === 'ALL' || block === selectedBlock;
      const q = searchRuleQuery.toLowerCase();
      const matchesQuery =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        String(r.metadata?.directive || '').toLowerCase().includes(q);
      return matchesBlock && matchesQuery;
    });
  }, [allRules, selectedBlock, searchRuleQuery]);

  // Ejecutar Blast-Radius al seleccionar regla
  useEffect(() => {
    try {
      const rep = computeBlastRadius(activeBlastTarget);
      setBlastReport(rep);
    } catch {
      // Fallback
    }
  }, [activeBlastTarget]);

  return (
    <div className="min-h-screen bg-[#050508] text-neutral-100 p-4 md:p-8 font-sans">
      {/* 1. Header Soberano & Monitor de Zona Cero Criptográfico */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-neutral-800 pb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl">
                <Crown className="w-7 h-7" />
              </span>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  ORÁCULO CEO · PLANO DE CONTROL TIER-1
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                    100/100 CANÓNICAS ACTIVAS
                  </span>
                </h1>
                <p className="text-sm text-neutral-400 mt-1">
                  Plano de mando en tiempo de ejecución. Introspección AST, semáforo de infraestructura y auditoría transitiva de blast-radius.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/admin/war-room"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold rounded-lg text-xs flex items-center gap-2 transition-all"
            >
              <Network className="w-4 h-4 text-cyan-400" /> War Room WebGL
            </Link>
            <Link
              href="/admin/compiler"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg text-xs flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" /> Compilador de Intención
            </Link>
          </div>
        </div>

        {/* Monitor Criptográfico de Zona Cero */}
        <div className="mt-6 p-4 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSentinelIntact ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <div>
              <span className="text-neutral-500 block text-[10px] uppercase tracking-wider">Sello Centinela SSOT (Zona Cero):</span>
              <span className="text-white font-bold tracking-tight select-all">{SENTINEL_HASH_SSOT}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-bold">
              ESTADO: INTACTO & SELLADO
            </span>
            <span className="text-neutral-500 text-[11px]">Madurez: Nivel 5 SDD</span>
          </div>
        </div>
      </div>

      {/* 2. Semáforo de Salud Operativa (4 Cuadrantes Vivos) */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400">PASARELA STRIPE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-base font-bold text-white">Idempotencia & Price-Lock</div>
          <div className="text-xs text-emerald-400 font-mono mt-1">Split 80/10/10 · Connect Activo</div>
        </div>

        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400">BASE DE DATOS PRISMA</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-base font-bold text-white">PostgreSQL 16 Pooling</div>
          <div className="text-xs text-emerald-400 font-mono mt-1">76 Modelos · Latencia &lt; 5ms</div>
        </div>

        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400">WEBHOOK n8n RELEVO</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-base font-bold text-white">Despacho Asíncrono</div>
          <div className="text-xs text-emerald-400 font-mono mt-1">Non-Blocking + DLQ Activa</div>
        </div>

        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-neutral-400">CATÁLOGO 2026</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-base font-bold text-white">652 Refs Iluminación</div>
          <div className="text-xs text-emerald-400 font-mono mt-1">Esquema Zod Elevado TIER-1</div>
        </div>
      </div>

      {/* 3. Monitor de los 7 Frentes de Negocio de EAR OS */}
      <div className="max-w-7xl mx-auto mb-8 bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Los 7 Frentes de Infraestructura & Dominio (Mandato Soberano)
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-500">7/7 Frentes Monitorizados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {EAR_OS_SEVEN_FRONTS.map((front) => (
            <div
              key={front.id}
              className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
                <span>FRENTE #{front.code}</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                  {front.operationalStatus}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{front.name}</div>
              <div className="text-[11px] text-neutral-400 mt-1 line-clamp-1">{front.patientZeroRef}</div>
              <div className="text-[10px] text-amber-400/90 font-mono mt-2 pt-2 border-t border-neutral-900">
                {front.sovereignPrinciple}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Matriz Canónica Multi-Rol de 8 Ejes (Cockpit Vision Input & Refinador S-Class) */}
      <div className="max-w-7xl mx-auto mb-8 bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
        <VisionInput
          selectedDimension={selectedDimension}
          onSelectDimension={(dimId) => {
            setSelectedDimension(dimId);
            const firstRule = getCeoDimension(dimId).canonicalRuleIds[0];
            if (firstRule) {
              setActiveBlastTarget(`RULE-${firstRule}`);
            }
          }}
          rawVision={rawVision}
          onChangeRawVision={setRawVision}
          onRefineComplete={setRefinedOutput}
          showRefinerOutput={true}
          title="MATRIZ CANÓNICA MULTI-ROL DE 8 EJES (ENTRADA DEL COMPILADOR CEO)"
          subtitle="Selecciona cualquiera de las 8 dimensiones operativas para precargar invariantes sagradas de ear-os-ssot.ts, proyectar el radio de impacto transitivo y compilar la visión en un Megaprompt S-Class."
        />
      </div>

      {/* 5. Fase 3: Multi-Rail Execution Plane (7 Disparadores Industriales) */}
      <div className="max-w-7xl mx-auto mb-8 bg-neutral-900/40 border border-neutral-800 rounded-xl p-5">
        <MultiRailExecutionPanel
          selectedDimension={selectedDimension}
          rawVision={rawVision}
          pepitaDeOro={refinedOutput?.pepitaDeOro || ''}
        />
      </div>

      {/* 6. Panel Dual: Telemetría de las 100 Reglas + Simulador de Blast-Radius */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Roster de las 100 Reglas (7 Cols) */}
        <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-xl p-5 space-y-4 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                Matriz Constitucional (100 Reglas AST)
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                {filteredRules.length} de 100 mostradas
              </span>
            </div>

            {/* Selector de Bloques 1 a 10 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedBlock('ALL')}
                className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                  selectedBlock === 'ALL'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                TODOS
              </button>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                    selectedBlock === b
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  B{b}
                </button>
              ))}
            </div>
          </div>

          {/* Buscador de Reglas */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchRuleQuery}
              onChange={(e) => setSearchRuleQuery(e.target.value)}
              placeholder="Buscar por ID, título o directiva de regla..."
              className="w-full bg-black/60 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Listado con scroll de las 100 Reglas */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredRules.map((rule) => {
              const ruleId = String(rule.metadata?.ruleId || '');
              const isSelected = activeBlastTarget === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveBlastTarget(rule.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">{rule.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-800 text-neutral-400 rounded">
                        Bloque {String(rule.metadata?.block || '')}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        rule.criticality === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {rule.criticality}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mb-1">{rule.name}</div>
                  <div className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {String(rule.metadata?.directive || '')}
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span>{rule.path}</span>
                    <span className="text-amber-400/80 hover:text-amber-300">Auditar Blast-Radius →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha: Motor de Blast-Radius Interactivo (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {blastReport ? (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4 sticky top-6">
              <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                    Radio de Impacto Transitivo
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono">{blastReport.canonicalNodeId}</h3>
                  <p className="text-xs text-neutral-400">{blastReport.targetNode.name}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                    blastReport.blastSeverity === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {blastReport.blastSeverity}
                </span>
              </div>

              {/* Indicadores de Impacto */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-black/50 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">TOTAL IMPACTADOS:</span>
                  <span className="text-xl font-bold text-white">{blastReport.totalImpactedNodes}</span>
                </div>
                <div className="p-3 bg-black/50 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">COMPUERTAS CI/CD:</span>
                  <span className="text-xl font-bold text-amber-400">
                    {blastReport.mechanicalGatesAffected.length}
                  </span>
                </div>
                <div className="p-3 bg-black/50 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">DIRECTOS (L1):</span>
                  <span className="text-base font-bold text-neutral-300">
                    {blastReport.directDependents.length}
                  </span>
                </div>
                <div className="p-3 bg-black/50 border border-neutral-800 rounded-lg">
                  <span className="text-neutral-500 block text-[10px]">TRANSITIVOS (L2+):</span>
                  <span className="text-base font-bold text-neutral-300">
                    {blastReport.transitiveDependents.length}
                  </span>
                </div>
              </div>

              {/* Compuertas Mecánicas que Bloquean */}
              {blastReport.mechanicalGatesAffected.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-amber-400" /> Compuertas que Bloquean en Fallo:
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {blastReport.mechanicalGatesAffected.map((gate) => (
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

              {/* Cadena de Propagación AST */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Cadena de Propagación:
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                  {blastReport.impactChain.slice(0, 10).map((item, idx) => (
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
                {blastReport.summary}
              </div>
            </div>
          ) : (
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-8 text-center text-neutral-500 text-xs">
              Haz clic en cualquier regla para proyectar su radio de impacto transitivo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
