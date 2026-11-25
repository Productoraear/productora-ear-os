'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Crown,
  Heart,
  Landmark,
  Building2,
  Compass,
  Sparkles,
  Copy,
  Check,
  Send,
  FileCode,
  BookOpen,
  Scale,
  Sliders,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { z } from 'zod';
import {
  SPLIT_SOBERANO,
  DEPOSITO_STRIPE_EUR,
  LIMITE_B2G_LCSP_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  MASTER_OBJECTIVES,
  MASTER_TACTICS,
  MASTER_TARGETS,
  type MasterObjectiveId,
  type MasterTacticId,
  type MasterTargetAgentId,
} from '@/lib/compiler/master-guide';
import {
  refineWithVelocityOracle,
  type OracleObjective,
  type OracleRefinedOutput,
} from '@/lib/oraculo/oracle-refiner';
import { getVelocityVaultStats } from '@/lib/oraculo/velocity-knowledge-index';

export const MasterCompilerFormSchema = z
  .object({
    objective: z.string(),
    tactic: z.string(),
    targetAgent: z.string(),
    rawVision: z.string(),
  })
  .strict();

export default function MasterCompilerPage(): React.JSX.Element {
  const [rawVision, setRawVision] = useState<string>('');
  const [selectedObjective, setSelectedObjective] = useState<MasterObjectiveId>('VENTAS');
  const [selectedTactic, setSelectedTactic] = useState<MasterTacticId>('SOBREDEMANDA');
  const [selectedTargetAgent, setSelectedTargetAgent] = useState<MasterTargetAgentId>('CLINE');
  const [copiedPepita, setCopiedPepita] = useState<boolean>(false);
  const [copiedMegaprompt, setCopiedMegaprompt] = useState<boolean>(false);
  const [isDispatchingN8n, setIsDispatchingN8n] = useState<boolean>(false);
  const [n8nStatusMessage, setN8nStatusMessage] = useState<string | null>(null);

  // Mapeo del objetivo del SSOT al Oráculo
  const oracleObjective: OracleObjective = useMemo(() => {
    switch (selectedObjective) {
      case 'VENTAS':
        return 'BODAS';
      case 'FINCAS':
        return 'PROVEEDOR';
      case 'B2G':
        return 'B2G';
      case 'ARQUITECTURA':
        return 'ESTRATEGIA';
      default:
        return 'BODAS';
    }
  }, [selectedObjective]);

  // Estadísticas de la Bóveda de Velocity
  const vaultStats = useMemo(() => getVelocityVaultStats(), []);

  // Motor del Oráculo: reacciona en tiempo real o bajo demanda
  const refinedResult: OracleRefinedOutput = useMemo(() => {
    return refineWithVelocityOracle({
      rawVision,
      objective: oracleObjective,
    });
  }, [rawVision, oracleObjective]);

  // Manejo de copia de la Pepita de Oro
  const handleCopyPepita = async () => {
    try {
      await navigator.clipboard.writeText(refinedResult.pepitaDeOro);
      setCopiedPepita(true);
      setTimeout(() => setCopiedPepita(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Manejo de copia del Megaprompt
  const handleCopyMegaprompt = async () => {
    try {
      await navigator.clipboard.writeText(refinedResult.megaprompt);
      setCopiedMegaprompt(true);
      setTimeout(() => setCopiedMegaprompt(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Disparo al Webhook de n8n
  const handleDispatchN8n = async () => {
    setIsDispatchingN8n(true);
    setN8nStatusMessage(null);
    try {
      const res = await fetch('/api/admin/oracle/dispatch-n8n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective: selectedObjective,
          tactic: selectedTactic,
          targetAgent: selectedTargetAgent,
          input: rawVision,
          pepitaDeOro: refinedResult.pepitaDeOro,
          megaprompt: refinedResult.megaprompt,
          matchedVaultDocs: refinedResult.matchedVaultDocs,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setN8nStatusMessage('✓ Payload despachado a n8n con éxito.');
      } else {
        setN8nStatusMessage(`✗ Error n8n: ${data.error || 'Fallo desconocido'}`);
      }
    } catch {
      setN8nStatusMessage('✗ Error de conexión con el webhook.');
    } finally {
      setIsDispatchingN8n(false);
      setTimeout(() => setN8nStatusMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans p-4 sm:p-8 space-y-6">
      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* BANNER CANÓNICO DE UNIFICACIÓN: COCKPIT CEO v14.1                         */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0b0c13] to-amber-500/10 border border-[#ecb613]/40 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-[#ecb613] text-black font-bold px-2 py-0.5 rounded">
                PUENTE CANÓNICO
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Compilador Unificado del CEO · EAR OS v14.1
              </span>
            </div>
            <h2 className="text-base font-bold font-syne text-white mt-0.5">
              Cockpit &amp; Oráculo Multi-Rail Operacional
            </h2>
          </div>
        </div>
        <Link
          href="/admin/oracle-compiler"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] shrink-0"
        >
          <span>Ir al Cockpit CEO (/admin/oracle-compiler)</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* BARRA SUPERIOR DE MANDO DEL CEO                                          */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Consola de Decisión Ejecutiva · Antigravity &amp; Oráculo RAG</span>
          </div>
          <h1 className="font-[family-name:var(--font-src-syne)] font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Compilador Soberano del CEO
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Filtrado aristocrático Halcón sobre la Bóveda Velocity ({vaultStats.totalFiles} recursos · {vaultStats.totalSizeMb} MB) e inyección constitucional de SSOT.
          </p>
        </div>

        {/* Accesos a Secciones Secundarias Reubicadas */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/legal"
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Módulo Legal &amp; Cookies</span>
          </Link>
          <Link
            href="/admin/components"
            className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-zinc-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Arena Componentes</span>
          </Link>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 1. PANEL SUPERIOR · ENTRADA DEL CEO (VISION INPUT)                       */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ecb613]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              1. Entrada del CEO (Vision Input)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            Ingresa ideas brutas, borradores, objeciones o pliegos para purgar y refinar.
          </span>
        </div>

        {/* Selector de los 4 Objetivos Estratégicos (SSOT Guía Maestra) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MASTER_OBJECTIVES.map((obj) => {
            const isSelected = selectedObjective === obj.id;

            return (
              <button
                key={obj.id}
                type="button"
                onClick={() => setSelectedObjective(obj.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#ecb613]/15 border-[#ecb613]/50 text-white shadow-[0_0_20px_rgba(236,182,19,0.25)]'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold uppercase">{obj.label}</span>
                </div>
                <p className="text-[11px] font-sans text-zinc-400 line-clamp-2">
                  {obj.hint}
                </p>
              </button>
            );
          })}
        </div>

        {/* Ejes de Táctica Comercial & Destinatario de Ejecución (SSOT Guía Maestra) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5">
          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5 font-bold">
              Táctica Comercial:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {MASTER_TACTICS.map((tac) => (
                <button
                  key={tac.id}
                  type="button"
                  onClick={() => setSelectedTactic(tac.id)}
                  className={`px-3 py-1.5 rounded-xl border text-left text-xs font-mono transition-all ${
                    selectedTactic === tac.id
                      ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="truncate block font-bold">{tac.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5 font-bold">
              Destinatario de Ejecución:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MASTER_TARGETS.map((tgt) => (
                <button
                  key={tgt.id}
                  type="button"
                  onClick={() => setSelectedTargetAgent(tgt.id)}
                  className={`px-3 py-1.5 rounded-xl border text-center text-xs font-mono transition-all ${
                    selectedTargetAgent === tgt.id
                      ? 'bg-[#ecb613]/15 border-[#ecb613]/50 text-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.2)]'
                      : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold">{tgt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Área de Texto de la Visión */}
        <div>
          <textarea
            rows={4}
            value={rawVision}
            onChange={(e) => setRawVision(e.target.value)}
            placeholder="Escribe aquí tu visión en bruto: ej. 'Los novios piden rebajar 100€ porque dicen que en otra finca les regalan la barra libre...'"
            className="w-full p-4 rounded-2xl bg-black/60 border border-white/15 text-sm font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors resize-y"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 2. PANEL CENTRAL · MOTOR DEL ORÁCULO (VELOCITY RAG & FILTRO HALCÓN)     */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              2. Motor del Oráculo (Velocity RAG &amp; Filtro Halcón)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            {vaultStats.totalFiles} Recursos de Bóveda Sincronizados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna A: Invariantes Constitucionales del SSOT Inyectadas */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400 uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Invariantes Sagradas de ear-os-ssot.ts Aplicadas:</span>
            </div>
            <ul className="space-y-1.5 text-xs font-sans text-zinc-300">
              {refinedResult.appliedInvariants.map((inv) => (
                <li key={inv} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{inv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna B: Recursos de la Bóveda Velocity Vinculados */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2.5">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#ecb613] uppercase">
              <BookOpen className="w-4 h-4" />
              <span>Recursos Bóveda Velocity / Incubadora RAG:</span>
            </div>
            {refinedResult.matchedVaultDocs.length > 0 ? (
              <ul className="space-y-1.5 text-xs font-mono text-zinc-300">
                {refinedResult.matchedVaultDocs.map((doc) => (
                  <li key={doc.sha256} className="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <span className="truncate pr-2">{doc.filename}</span>
                    <span className="text-[9px] text-[#ecb613] shrink-0 font-bold uppercase">
                      {doc.category}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 font-sans">
                Sin documentos adicionales de filtro inmediato.
              </p>
            )}
          </div>
        </div>

        {/* Principios de Tono Aristocrático y Reglas Canónicas */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-white font-bold">FILTRO HALCÓN:</span>
            {refinedResult.toneGuidelines.map((g) => (
              <span key={g} className="flex items-center gap-1">
                <span className="text-[#ecb613]">•</span> {g}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-full border border-[#ecb613]/30 font-bold uppercase">
            100 REGLAS CANÓNICAS ACTIVAS · CONSTITUCIÓN DIAMANTE SELLADA
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════ */}
      {/* 3. PANEL INFERIOR · SALIDA SOBERANA (PEPITA DE ORO & DISPARADORES)       */}
      {/* ════════════════════════════════════════════════════════════════════════ */}
      <section className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#ecb613]" />
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              3. Salida Soberana (Pepita de Oro &amp; Disparadores)
            </h2>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Botón 1: Copiar al Portapapeles */}
            <button
              type="button"
              onClick={handleCopyPepita}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                copiedPepita
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-[#ecb613] text-black hover:bg-[#ffd24d] shadow-[0_0_15px_rgba(236,182,19,0.3)]'
              }`}
            >
              {copiedPepita ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPepita ? '¡Copiado!' : 'Copiar Pepita de Oro'}</span>
            </button>

            {/* Botón 2: Disparar Flujo n8n */}
            <button
              type="button"
              onClick={handleDispatchN8n}
              disabled={isDispatchingN8n}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isDispatchingN8n ? 'Enviando...' : 'Disparar Flujo n8n'}</span>
            </button>

            {/* Botón 3: Exportar Megaprompt para Obrero */}
            <button
              type="button"
              onClick={handleCopyMegaprompt}
              className={`px-4 py-2 rounded-xl border border-white/15 font-mono text-xs font-semibold transition-all flex items-center gap-1.5 ${
                copiedMegaprompt
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>{copiedMegaprompt ? 'Megaprompt Copiado' : 'Exportar Megaprompt Obrero'}</span>
            </button>
          </div>
        </div>

        {/* Mensaje de estado n8n si existe */}
        {n8nStatusMessage && (
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 animate-fadeIn">
            {n8nStatusMessage}
          </div>
        )}

        {/* Visor de la Pepita de Oro */}
        <div className="p-5 rounded-2xl bg-black/60 border border-white/15">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
            <span>TEXTO FINAL DE ALTO IMPACTO (LISTO PARA ENVIAR)</span>
            <span className="text-[#ecb613]">TONO ARISTOCRÁTICO · CERO ADJETIVOS VACÍOS</span>
          </div>
          <pre className="font-sans text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed select-all">
            {refinedResult.pepitaDeOro}
          </pre>
        </div>
      </section>
    </div>
  );
}
