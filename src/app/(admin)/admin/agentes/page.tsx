"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Send,
  Download,
  X,
  ExternalLink,
  Cpu,
  Lock,
  Flame,
} from 'lucide-react';
import { z } from 'zod';
import { AgentMonitorCeoWorkspace } from '@/components/admin/AgentMonitorCeoWorkspace';
import {
  SENTINEL_HASH_SSOT,
} from '@/lib/governance/constitution-tier1';
import {
  SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  DEPOSITO_STRIPE_EUR,
} from '@/lib/constants/ear-os-ssot';
import {
  GLOBAL_SYSTEM_INVARIANTS,
  resolveEntityContext,
} from '@/lib/oraculo/entity-resolver';
import {
  executeMegapromptObrero,
  executeWebhookN8n,
  type MultiRailExecutionResult,
} from '@/lib/compiler/multi-rail-execution';

/* ========================================================================== */
/* CONTRATO DE DATOS ZOD ESTRICTO (NIVEL 5)                                   */
/* ========================================================================== */

export const AgentGovernanceContractSchema = z
  .object({
    role: z.enum(['CEO', 'ARQUITECTO_ANTIGRAVITY', 'OBRERO_CLINE']),
    agentName: z.string(),
    model: z.string(),
    status: z.enum(['ACTIVO', 'STANDBY', 'AUDITADO']),
    neverRules: z.array(z.string()),
    alwaysRules: z.array(z.string()),
    askFirstRules: z.array(z.string()),
  })
  .strict();

export type AgentGovernanceContract = z.infer<typeof AgentGovernanceContractSchema>;

const AGENTS_ROSTER: readonly AgentGovernanceContract[] = [
  {
    role: 'CEO',
    agentName: 'Edwin Agudelo (Director Generalista)',
    model: 'Human-in-the-Loop Sovereign (HITL)',
    status: 'ACTIVO',
    neverRules: [
      'Autorizar contratos de Edwin Agudelo por debajo del suelo de 350 €',
      'Aprobar mutaciones de la Zona Cero (ear-os-ssot.ts) sin justificación',
      'Publicar teléfonos directos en cuentas gratuitas (enmascaramiento obligatorio)',
    ],
    alwaysRules: [
      'Validar retorno de inversión (ROI) y cash flow de tesorería',
      'Custodiar el margen B2B de fincas (Otzarreta 2026)',
    ],
    askFirstRules: [
      'Alteraciones de tarifas de catálogo o pasarelas',
      'Licitaciones B2G superiores a 5.000 €',
    ],
  },
  {
    role: 'ARQUITECTO_ANTIGRAVITY',
    agentName: 'Antigravity (Orquestador Forense & SRE)',
    model: 'Gemini 2.5 Pro / Thinking System',
    status: 'ACTIVO',
    neverRules: [
      'Tocar la Zona Cero (ear-os-ssot.ts) sin autorización expresa del CEO',
      'Invocar gestores ajenos como pnpm, yarn o bun (estricto npm)',
      'Permitir tipos any o deuda técnica en rutas financieras',
    ],
    alwaysRules: [
      'Verificar npm run typecheck (tsc --noEmit Exit Code 0)',
      'Supervisar las 22 compuertas del arnés constitucional',
      'Auditar en disco el trabajo de Cline antes de cualquier commit',
    ],
    askFirstRules: [
      'Cambios en el esquema Prisma o migraciones de base de datos',
      'Ampliaciones estructurales del grafo AST',
    ],
  },
  {
    role: 'OBRERO_CLINE',
    agentName: 'Cline (Especialista Senior de Ingeniería)',
    model: 'Claude 3.7 Sonnet / DeepSeek V3',
    status: 'ACTIVO',
    neverRules: [
      'Modificar archivos fuera de su scope asignado en files[]',
      'Declarar Exit 0 sin haberlo comprobado mecánicamente',
      'Usar datos ficticios en teléfonos o números de cuenta',
    ],
    alwaysRules: [
      'Validar typecheck y lint al cerrar cada tarea',
      'Registrar en CLINE_EXECUTION_LOG.md cada intervención con líneas auditables',
      'Proponer reto_espejo ante asunciones frágiles del arquitecto',
    ],
    askFirstRules: [
      'Creación de nuevos paquetes npm o dependencias externas',
      'Refactorización de archivos compartidos',
    ],
  },
];

export default function AgentMonitorPage() {
  const [activeResult, setActiveResult] = useState<MultiRailExecutionResult | null>(null);

  const handleTriggerMegaprompt = () => {
    const res = executeMegapromptObrero({
      eventId: `AGENT-DISPATCH-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Antigravity (Arquitecto SRE)',
      venue: 'EAR OS Workspace Central',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 0,
      dimensionId: 'GOBERNANZA_SRE',
      entityContext: resolveEntityContext('agentes-sre', 'GOBERNANZA_SRE'),
      pepitaDeOro: 'Megaprompt AST Obrero Cline con Blast Radius Verificado',
      rawVision: 'Despacho de tarea atómica con delimitación estricta de archivos y compuertas mecánicas',
    });
    setActiveResult(res);
  };

  const handleTriggerN8n = async () => {
    const res = await executeWebhookN8n({
      eventId: `AGENT-AUDIT-${Date.now().toString(36).toUpperCase()}`,
      clientName: 'Monitor de Agentes',
      venue: 'SRE Central',
      eventDate: new Date().toISOString().slice(0, 10),
      grossEur: 0,
      dimensionId: 'GOBERNANZA_SRE',
      entityContext: resolveEntityContext('agentes-sre', 'GOBERNANZA_SRE'),
      pepitaDeOro: 'Auditoría de Sesiones y Tool Calls Agénticos',
      rawVision: 'Disparo de registro de misiones y aprobaciones hacia n8n',
    });
    setActiveResult(res);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        <span>/</span>
        <span>Gobernanza</span>
        <span>/</span>
        <span className="text-[#ecb613]">Monitor de Agentes</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne tracking-tight text-white uppercase">
            MONITOR DE AGENTES &amp; GOBERNANZA MCP (S-CLASS)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Separación de poderes (CEO · Arquitecto · Obrero) • Supervisión en tiempo real de tool calls y misiones
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 font-mono">
          <button
            type="button"
            onClick={handleTriggerMegaprompt}
            className="px-4 py-2 rounded-xl bg-pink-500/15 border border-pink-500/40 text-pink-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Terminal className="w-4 h-4 text-pink-400" />
            <span>Exportar Megaprompt Obrero</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerN8n}
            className="px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Webhook n8n</span>
          </button>

          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>ZERO-RISK RBAC</span>
          </div>
        </div>
      </div>

      {/* Tarjetas de Gobernanza de los 3 Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
        {AGENTS_ROSTER.map((agent) => (
          <div
            key={agent.role}
            className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-0.5 rounded-full border border-[#ecb613]/20">
                  {agent.role}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {agent.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white font-syne">{agent.agentName}</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">{agent.model}</p>
              </div>

              <div className="space-y-2 text-[11px] pt-2 border-t border-zinc-900">
                <div>
                  <span className="text-red-400 font-bold block text-[10px]">⛔ NEVER (Inviolable):</span>
                  <ul className="text-zinc-400 space-y-0.5 mt-0.5 list-disc list-inside">
                    {agent.neverRules.map((r, i) => (
                      <li key={i} className="text-zinc-400">{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-emerald-400 font-bold block text-[10px]">✅ ALWAYS (Mecánico):</span>
                  <ul className="text-zinc-400 space-y-0.5 mt-0.5 list-disc list-inside">
                    {agent.alwaysRules.map((r, i) => (
                      <li key={i} className="text-zinc-400">{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-amber-400 font-bold block text-[10px]">❓ ASK FIRST (Escalado):</span>
                  <ul className="text-zinc-400 space-y-0.5 mt-0.5 list-disc list-inside">
                    {agent.askFirstRules.map((r, i) => (
                      <li key={i} className="text-zinc-400">{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Espacio de trabajo de monitoreo original */}
      <AgentMonitorCeoWorkspace />

      {/* Modal Multi-Rail Artifact */}
      {activeResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
          <div className="w-full max-w-2xl bg-[#09090d] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                  {activeResult.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-900">
                <span className="text-zinc-400">Documento Generado:</span>
                <span className="text-white font-bold">{activeResult.filename}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-900 space-y-1">
                <span className="text-zinc-500 text-[10px] block">SELLO SHA-256</span>
                <span className="text-[#ecb613] text-[11px] break-all">{activeResult.sha256}</span>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-400 text-[11px]">Contenido:</span>
                <pre className="p-3 rounded-xl bg-black border border-zinc-900 text-[11px] text-zinc-300 overflow-x-auto max-h-48 font-mono">
                  {activeResult.previewContent}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveResult(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs transition-colors"
              >
                Cerrar
              </button>
              {activeResult.downloadUrl && (
                <a
                  href={activeResult.downloadUrl}
                  download={activeResult.filename}
                  className="px-4 py-2 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
