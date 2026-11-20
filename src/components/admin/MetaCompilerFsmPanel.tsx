'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Fingerprint,
  GitBranch,
  Layers,
  Loader2,
  Play,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { adminFetch, isAdminHttpError } from '@/lib/admin/adminFetch';
import { META_FSM_STATES, type MetaFsmState } from '@/lib/compiler/metacompiler-fsm';
import { MetaCompilerSpecSchema, type MetaCompilerSpec } from '@/lib/compiler/metacompiler-spec';
import type { MetaCompilerResult } from '@/lib/compiler/metacompiler-engine';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * TERMINAL DE ESTADOS DEL METACOMPILADOR (OLED #030305 · S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Sustituye al prompt genérico por un editor estructurado Spec-First:
 *
 *   1. ÁRBOL DE ESTADOS EN VIVO — la FSM real, no una animación inventada:
 *      cada nodo pinta su veredicto con el Exit Code de la evidencia devuelta.
 *   2. EDITOR DE ESPECIFICACIÓN — los bloques del contrato (identidad, nodos,
 *      invariantes, promesa) validados con Zod EN EL NAVEGADOR antes de viajar.
 *   3. PANEL DE EVIDENCIA — log con fase, veredicto, Exit Code y SHA-256.
 *
 * Regla de honestidad: este componente NO calcula veredictos. Los muestra.
 * Si el servidor no responde, pinta `SIN_EVIDENCIA`, nunca un verde decorativo.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface ContractPayload {
  readonly states: readonly MetaFsmState[];
  readonly constitution: readonly {
    readonly id: string;
    readonly ssotSymbol: string;
    readonly expected: number | string;
    readonly actual: number | string;
    readonly invariant: string;
    readonly parity: boolean;
  }[];
}

const NODE_LABEL: Readonly<Record<MetaFsmState, string>> = {
  IDLE: 'Reposo',
  HASH_VERIF: 'Hash Zona Cero',
  TYPE_CHECK: 'Contrato de tipos',
  LINT_AST: 'Auditoría AST',
  GATE_EVAL: 'Sondas de plataforma',
  SEALED: 'Sellado',
  ABORT: 'Abortado',
};

type NodeStatus = 'PENDING' | 'ACTIVE' | 'PASS' | 'FAIL' | 'SIN_EVIDENCIA';

function statusOf(result: MetaCompilerResult | null, state: MetaFsmState): NodeStatus {
  if (result === null) return state === 'IDLE' ? 'ACTIVE' : 'PENDING';
  const evidence = result.evidence.find((line) => line.phase === state);
  if (evidence !== undefined) {
    if (evidence.verdict === 'PASS') return 'PASS';
    return evidence.verdict === 'FAIL' ? 'FAIL' : 'SIN_EVIDENCIA';
  }
  if (result.state === state) return 'ACTIVE';
  const reached = result.trace.some((line) => line.to === state || line.from === state);
  return reached ? 'PASS' : 'PENDING';
}

const STATUS_STYLE: Readonly<Record<NodeStatus, { readonly dot: string; readonly text: string; readonly ring: string }>> = {
  PENDING: { dot: 'bg-zinc-700', text: 'text-zinc-500', ring: 'border-white/5' },
  ACTIVE: { dot: 'bg-[#ecb613] animate-pulse', text: 'text-[#ecb613]', ring: 'border-[#ecb613]/40' },
  PASS: { dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'border-emerald-500/30' },
  FAIL: { dot: 'bg-rose-500', text: 'text-rose-300', ring: 'border-rose-500/40' },
  SIN_EVIDENCIA: { dot: 'bg-amber-400', text: 'text-amber-300', ring: 'border-amber-500/40' },
};

export function MetaCompilerFsmPanel() {
  const [contract, setContract] = useState<ContractPayload | null>(null);
  const [result, setResult] = useState<MetaCompilerResult | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seedOntology, setSeedOntology] = useState(false);

  // Editor Spec-First: cada bloque del contrato es un campo real.
  const [specId, setSpecId] = useState('omega-metacompiler-core');
  const [name, setName] = useState('MetaCompilador Soberano');
  const [summary, setSummary] = useState('Contrato de compilacion determinista con paridad de Zona Cero.');
  const [nodesRaw, setNodesRaw] = useState('zona-cero:ENGINE:Zona Cero (SSOT financiero)');
  const [checksRaw, setChecksRaw] = useState('split-80-10-10:artista + earOs + vimume === 1 al centimo');
  const [promiseUrl, setPromiseUrl] = useState('/admin/compiler');

  const loadContract = useCallback(async () => {
    setError(null);
    try {
      setContract(await adminFetch<ContractPayload>('/api/admin/compiler/fsm'));
    } catch (caught) {
      setError(
        isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'No se pudo leer el contrato de la FSM.',
      );
    }
  }, []);

  useEffect(() => {
    void loadContract();
  }, [loadContract]);

  /** Construye la especificación desde el editor y la valida con Zod. */
  const buildSpec = useCallback(():
    | { ok: true; spec: MetaCompilerSpec }
    | { ok: false; issues: string[] } => {
    const nodes = nodesRaw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [id, kind, ...label] = line.split(':');
        return { id: id.trim(), kind: (kind ?? 'ENGINE').trim(), label: label.join(':').trim() };
      });

    const checks = checksRaw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const [id, ...statement] = line.split(':');
        return { id: id.trim(), statement: statement.join(':').trim() };
      });

    const parsed = MetaCompilerSpecSchema.safeParse({
      specId,
      name,
      summary,
      phases: ['HASH_VERIF', 'TYPE_CHECK', 'LINT_AST', 'GATE_EVAL'],
      artifact: { blocks: ['HEADER', 'TYPES', 'VALIDATORS', 'GATES'], includeGates: true },
      ontology: { nodes },
      invariants: { checks },
      promiseUrl,
    });

    if (!parsed.success) {
      return {
        ok: false,
        issues: parsed.error.issues.map((issue) => `${issue.path.join('.') || 'spec'}: ${issue.message}`),
      };
    }
    return { ok: true, spec: parsed.data };
  }, [specId, name, summary, nodesRaw, checksRaw, promiseUrl]);

  const localValidation = useMemo(() => buildSpec(), [buildSpec]);

  const run = useCallback(async () => {
    if (!localValidation.ok) {
      setError(`Especificacion invalida: ${localValidation.issues.join(' | ')}`);
      return;
    }
    setRunning(true);
    setError(null);
    try {
      const payload = await adminFetch<{ data: MetaCompilerResult; sealed: boolean }>(
        '/api/admin/compiler/fsm',
        { method: 'POST', body: { spec: localValidation.spec, seedOntology } },
      );
      setResult(payload.data);
    } catch (caught) {
      setResult(null);
      setError(
        isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'El motor no respondio: SIN_EVIDENCIA.',
      );
    } finally {
      setRunning(false);
    }
  }, [localValidation, seedOntology]);

  const orderedStates = contract?.states ?? META_FSM_STATES;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#030305] p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ecb613]">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Maquina de estados discreta · motor local</span>
          </div>
          <h2 className="font-['Syne'] text-xl font-bold text-white">
            Terminal de Estados del Metacompilador
          </h2>
          <p className="mt-1 max-w-2xl text-xs text-zinc-400">
            Compilacion estatica sin tokens remotos: el mismo binario de TypeScript valida el
            artefacto y la FSM sella con SHA-256. Un solo ABORT bloquea el cierre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadContract()}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:border-white/20"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Contrato
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={running || !localValidation.ok}
            className="flex items-center gap-2 rounded-lg bg-[#ecb613] px-4 py-2 text-[11px] font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Compilar
          </button>
        </div>
      </header>

      {error !== null && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-[11px] text-rose-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <Activity className="h-3.5 w-3.5" /> Arbol de estados
          </h3>
          <ol className="space-y-2">
            {orderedStates.map((state) => {
              const status = statusOf(result, state);
              const style = STATUS_STYLE[status];
              const evidence = result?.evidence.find((line) => line.phase === state);
              return (
                <li
                  key={state}
                  className={`flex items-center justify-between rounded-xl border ${style.ring} bg-white/[0.02] px-3 py-2`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    <div>
                      <p className={`text-[11px] font-bold ${style.text}`}>{state}</p>
                      <p className="text-[10px] text-zinc-500">{NODE_LABEL[state]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {evidence !== undefined ? (
                      <>
                        <p className={`font-mono text-[10px] ${style.text}`}>EXIT {evidence.exitCode}</p>
                        <p className="font-mono text-[9px] text-zinc-600">
                          {evidence.sha256 === null ? 'sin hash' : evidence.sha256.slice(0, 12)}
                        </p>
                      </>
                    ) : (
                      <p className="font-mono text-[10px] text-zinc-600">{status}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {contract !== null && (
            <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                <ShieldCheck className="h-3 w-3" /> Paridad de Zona Cero
              </p>
              <ul className="space-y-1">
                {contract.constitution.slice(0, 8).map((constant) => (
                  <li key={constant.id} className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-zinc-500">{constant.ssotSymbol}</span>
                    <span className={constant.parity ? 'text-emerald-400' : 'text-rose-400'}>
                      {String(constant.actual)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <Layers className="h-3.5 w-3.5" /> Especificacion (Spec-First)
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">specId</span>
              <input
                value={specId}
                onChange={(event) => setSpecId(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 font-mono text-[11px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Promesa (URL)</span>
              <input
                value={promiseUrl}
                onChange={(event) => setPromiseUrl(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 font-mono text-[11px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Nombre</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 text-[12px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">Resumen</span>
              <input
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 text-[12px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">
                Ontologia · id:kind:label
              </span>
              <textarea
                value={nodesRaw}
                onChange={(event) => setNodesRaw(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 font-mono text-[11px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-zinc-500">
                Invariantes · id:enunciado
              </span>
              <textarea
                value={checksRaw}
                onChange={(event) => setChecksRaw(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-[#08080c] px-3 py-2 font-mono text-[11px] text-white outline-none focus:border-[#ecb613]"
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-[11px] text-zinc-400">
              <input
                type="checkbox"
                checked={seedOntology}
                onChange={(event) => setSeedOntology(event.target.checked)}
                className="h-3.5 w-3.5 accent-[#ecb613]"
              />
              Sembrar ontologia en PostgreSQL (idempotente)
            </label>
            <span
              className={`font-mono text-[10px] ${localValidation.ok ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {localValidation.ok ? 'ZOD OK' : `ZOD FAIL · ${localValidation.issues.length}`}
            </span>
          </div>

          {!localValidation.ok && (
            <ul className="mt-2 space-y-1 rounded-lg border border-rose-500/20 bg-rose-950/10 p-2">
              {localValidation.issues.slice(0, 4).map((issue) => (
                <li key={issue} className="font-mono text-[10px] text-rose-300">
                  <ChevronRight className="inline h-2.5 w-2.5" /> {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <Cpu className="h-3.5 w-3.5" /> Evidencia (append-only)
          </h3>
          {result !== null && (
            <span
              className={`flex items-center gap-1.5 font-mono text-[10px] ${
                result.state === 'SEALED' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.state === 'SEALED' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {result.state}
              {result.abortReason !== null ? ` · ${result.abortReason}` : ''}
            </span>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-white/5 bg-black/50 p-3 font-mono text-[10px]">
          {result === null ? (
            <p className="text-zinc-600">
              Sin ejecuciones. La evidencia solo existe cuando el motor ha corrido.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {result.evidence.map((line) => (
                <li key={line.seq} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-zinc-600">#{String(line.seq).padStart(2, '0')}</span>
                  <span className={STATUS_STYLE[statusOf(result, line.phase as MetaFsmState)].text}>
                    {line.phase}
                  </span>
                  <span className="text-zinc-500">EXIT {line.exitCode}</span>
                  <span className="text-zinc-600">
                    {line.sha256 === null ? '—' : line.sha256.slice(0, 16)}
                  </span>
                  <span className="w-full text-zinc-500">{line.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {result !== null && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Fingerprint className="h-3 w-3" /> sello {result.sealHash.slice(0, 24)}
            </span>
            <span>
              fases {result.stats.phasesPassed}/{result.stats.phasesRun}
            </span>
            <span>paridad {result.stats.parityChecked}</span>
            <span>nodos {result.stats.nodesSeeded}</span>
            <span className="text-zinc-600">{result.checkedAt}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default MetaCompilerFsmPanel;

