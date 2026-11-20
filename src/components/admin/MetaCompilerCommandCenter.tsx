'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Loader2,
  Plug,
  Power,
  RefreshCw,
  Rocket,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { adminFetch, isAdminHttpError } from '@/lib/admin/adminFetch';
import type { ConnectorsPayload, SealPayload } from '@/lib/compiler/metacompiler-telemetry';
import { buildDefaultSpec } from '@/lib/compiler/metacompiler-spec';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * CENTRO DE MANDO SOBERANO DEL METACOMPILADOR (OLED #030305 · S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Bloques, todos alimentados por sondas REALES del servidor:
 *
 *   1. MATRIZ DE 5 CONECTORES — conmutación en caliente contra
 *      `/api/admin/compiler/connectors`. Muestra la puerta que gobierna cada
 *      conector y el servidor bloquea si una puerta quedaría huérfana.
 *   2. ENRUTADOR DE 3 PUERTAS — estado activo/huérfano por puerta, leído de la
 *      matriz, nunca estimado.
 *   3. TELEMETRÍA — integridad SSOT (SHA-256 computado vs referencia), salud
 *      sintáctica REAL de `ecosystem-ontology.ts` y procedencia del estado
 *      (DATABASE vs UNAVAILABLE). Cero `Math.random`: nada se inventa.
 *   4. TERMINAL DE COMPUERTAS + ACCIÓN SOBERANA — evidencia append-only con Exit
 *      Code y SHA-256 por fase, y el botón de sellado/despliegue.
 *
 * Regla de honestidad: si una sonda no responde se pinta SIN_EVIDENCIA y se
 * deshabilita la acción que dependa de ella. Este componente NO calcula
 * veredictos: los muestra tal como los firma el servidor.
 * ════════════════════════════════════════════════════════════════════════════
 */

const BORDER = 'border-[#1E1E26]';
const SURFACE = 'bg-[#0A0A0E]';

function shortHash(value: string | null): string {
  return value === null ? 'SIN_EVIDENCIA' : `${value.slice(0, 16)}…`;
}

export function MetaCompilerCommandCenter() {
  const [payload, setPayload] = useState<ConnectorsPayload | null>(null);
  const [seal, setSeal] = useState<SealPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingToggle, setPendingToggle] = useState<string | null>(null);
  const [sealing, setSealing] = useState(false);
  const [deployOnSeal, setDeployOnSeal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setPayload(await adminFetch<ConnectorsPayload>('/api/admin/compiler/connectors'));
    } catch (caught) {
      setPayload(null);
      setError(
        isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'No se pudo leer la matriz de conectores: SIN_EVIDENCIA.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = useCallback(
    async (id: string, active: boolean) => {
      setPendingToggle(id);
      setError(null);
      try {
        const next = await adminFetch<{
          state: ConnectorsPayload['state'];
          matrix: ConnectorsPayload['matrix'];
          persistence: { store: 'DATABASE' | 'UNAVAILABLE'; persisted: boolean; detail: string };
        }>('/api/admin/compiler/connectors', { method: 'POST', body: { id, active } });
        setPayload((previous) =>
          previous === null
            ? previous
            : {
                ...previous,
                state: next.state,
                matrix: next.matrix,
                store: next.persistence.store,
                persisted: next.persistence.persisted,
              },
        );
      } catch (caught) {
        // 409 = invariante de negocio. Se recarga para pintar el estado REAL.
        setError(
          isAdminHttpError(caught)
            ? `${caught.code} · ${caught.message}`
            : 'La conmutación no se aplicó: SIN_EVIDENCIA.',
        );
        await load();
      } finally {
        setPendingToggle(null);
      }
    },
    [load],
  );

  const sealNow = useCallback(async () => {
    setSealing(true);
    setError(null);
    try {
      setSeal(
        await adminFetch<SealPayload>('/api/admin/compiler/seal', {
          method: 'POST',
          body: { spec: buildDefaultSpec(), deploy: deployOnSeal },
        }),
      );
    } catch (caught) {
      setSeal(null);
      setError(
        isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'El sellado no respondió: SIN_EVIDENCIA.',
      );
    } finally {
      setSealing(false);
    }
  }, [deployOnSeal]);

  const matrix = payload?.matrix ?? null;
  const doors = useMemo(() => matrix?.doors ?? [], [matrix]);
  const sealBlocked = matrix === null || matrix.parity !== 'PASS';

  return (
    <section
      className={`rounded-3xl border ${BORDER} bg-[#030305] p-5 sm:p-6`}
      aria-label="Centro de mando del metacompilador"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#1E1E26] pb-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ecb613]">
            <Cpu className="h-3.5 w-3.5" />
            <span>Centro de mando soberano · motor local</span>
          </div>
          <h2 className="text-xl font-bold text-white">Metacompilador S-Class</h2>
          <p className="mt-1 max-w-2xl text-xs text-zinc-400">
            Mutaciones AST deterministas, matriz de 5 conectores y sellado verificable. Cero
            llamadas a modelos externos: todo se mide en este servidor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            className={`flex items-center gap-2 rounded-lg border ${BORDER} ${SURFACE} px-3 py-2 text-[11px] font-semibold text-zinc-300 transition hover:border-white/20`}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Re-sondear
          </button>
          <button
            type="button"
            onClick={() => void sealNow()}
            disabled={sealing || sealBlocked}
            className="flex items-center gap-2 rounded-lg bg-[#ecb613] px-4 py-2 text-[11px] font-bold text-black transition disabled:cursor-not-allowed disabled:opacity-40"
            title={
              sealBlocked
                ? 'Bloqueado: matriz de conectores sin paridad (puerta huérfana).'
                : 'Compila, verifica y sella la mutación'
            }
          >
            {sealing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Rocket className="h-3.5 w-3.5" />
            )}
            Sellar mutación &amp; desplegar
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
        {/* ── 1. MATRIZ DE 5 CONECTORES ─────────────────────────────────── */}
        <div className="lg:col-span-7">
          <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <Plug className="h-3.5 w-3.5" /> Matriz en caliente · 5 conectores
          </h3>

          <ul className="space-y-2">
            {(matrix?.rows ?? []).map((row) => {
              const busy = pendingToggle === row.id;
              return (
                <li
                  key={row.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border ${BORDER} ${SURFACE} px-3 py-2.5`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          row.active ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="truncate text-[11px] font-bold text-white">{row.label}</p>
                      <span className="shrink-0 rounded border border-[#1E1E26] px-1.5 py-0.5 font-mono text-[9px] text-zinc-500">
                        {row.id}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-zinc-500">
                      {row.summary}
                    </p>
                    <p className="mt-1 font-mono text-[9px] text-zinc-600">
                      puerta {row.door} · {row.governed ? 'GOBIERNADO' : 'SIN_MOTOR_DE_COBRO'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void toggle(row.id, !row.active)}
                    disabled={busy}
                    aria-pressed={row.active}
                    className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition disabled:opacity-50 ${
                      row.active
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                        : 'border-[#1E1E26] bg-black/40 text-zinc-400'
                    }`}
                  >
                    {busy ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Power className="h-3 w-3" />
                    )}
                    {row.active ? 'ACTIVO' : 'INACTIVO'}
                  </button>
                </li>
              );
            })}
            {matrix === null && !loading && (
              <li className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-3 font-mono text-[10px] text-amber-300">
                SIN_EVIDENCIA · la matriz no se pudo leer del servidor.
              </li>
            )}
          </ul>
        </div>

        {/* ── 2. ENRUTADOR DE 3 PUERTAS + 3. TELEMETRÍA ─────────────────── */}
        <div className="space-y-4 lg:col-span-5">
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Enrutador de 3 puertas
            </h3>
            <ul className="space-y-2">
              {doors.map((door) => (
                <li
                  key={door.door}
                  className={`rounded-xl border px-3 py-2 ${
                    door.active
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-rose-500/40 bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <a
                      href={door.href}
                      className="font-mono text-[11px] font-bold text-white underline-offset-2 hover:underline"
                    >
                      {door.href}
                    </a>
                    <span
                      className={`font-mono text-[9px] font-bold ${
                        door.active ? 'text-emerald-300' : 'text-rose-300'
                      }`}
                    >
                      {door.active ? 'ACTIVA' : 'HUERFANA'}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-zinc-500">
                    conectores: {door.connectors.length === 0 ? 'ninguno' : door.connectors.join(', ')}
                  </p>
                  <p className="font-mono text-[9px] text-zinc-600">
                    sectores: {door.sectors.length}
                  </p>
                </li>
              ))}
              {doors.length === 0 && (
                <li className="rounded-xl border border-amber-500/30 bg-amber-950/10 p-3 font-mono text-[10px] text-amber-300">
                  SIN_EVIDENCIA · puertas no sondeadas.
                </li>
              )}
            </ul>
          </div>

          <div className={`rounded-xl border ${BORDER} ${SURFACE} p-3`}>
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
              <Fingerprint className="h-3 w-3" /> Telemetría de integridad
            </p>
            <dl className="space-y-1.5 font-mono text-[10px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">estado guardado</dt>
                <dd className={payload?.persisted ? 'text-emerald-400' : 'text-amber-400'}>
                  {payload === null
                    ? 'SIN_EVIDENCIA'
                    : `${payload.store}${payload.persisted ? '' : ' · EFIMERO'}`}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">ontologia sha256</dt>
                <dd className="text-zinc-300">{shortHash(payload?.catalogue.file.sha256 ?? null)}</dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">ontologia sintaxis</dt>
                <dd className={payload?.catalogue.file.ok ? 'text-emerald-400' : 'text-rose-400'}>
                  {payload === null ? 'SIN_EVIDENCIA' : payload.catalogue.file.ok ? 'OK' : 'ERROR'}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">paridad de puertas</dt>
                <dd className={matrix?.parity === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}>
                  {matrix === null ? 'SIN_EVIDENCIA' : matrix.parity}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">ssot sha256</dt>
                <dd className="break-all text-zinc-400">
                  {seal === null ? 'sella para medir' : shortHash(seal.ssot.computedHash)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-zinc-500">webhook coolify</dt>
                <dd className={seal?.deploy.configured ? 'text-emerald-400' : 'text-amber-400'}>
                  {seal === null ? 'no sondeado' : seal.deploy.configured ? 'CONFIGURADO' : 'AUSENTE'}
                </dd>
              </div>
            </dl>

            <label className="mt-3 flex cursor-pointer items-center gap-2 border-t border-[#1E1E26] pt-2">
              <input
                type="checkbox"
                checked={deployOnSeal}
                onChange={(event) => setDeployOnSeal(event.target.checked)}
                className="h-3 w-3 accent-[#ecb613]"
              />
              <span className="text-[10px] text-zinc-400">
                Desplegar a produccion al sellar (requiere webhook)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* ── 4. TERMINAL DE COMPUERTAS + ACCIÓN SOBERANA ──────────────────── */}
      <div className="mt-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            <Cpu className="h-3.5 w-3.5" /> Consola de compuertas · evidencia append-only
          </h3>
          {seal !== null && (
            <span
              className={`flex items-center gap-1.5 font-mono text-[10px] ${
                seal.status === 'SEALED' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {seal.status === 'SEALED' ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {seal.status}
              {seal.abortReason === null ? '' : ` · ${seal.abortReason}`}
            </span>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto rounded-xl border border-[#1E1E26] bg-black/50 p-3 font-mono text-[10px]">
          {seal === null ? (
            <p className="text-zinc-600">
              Sin sellado en esta sesion. La evidencia solo existe cuando el motor ha corrido.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {seal.evidence.map((line) => (
                <li key={line.seq} className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-zinc-600">#{String(line.seq).padStart(2, '0')}</span>
                  <span
                    className={
                      line.verdict === 'PASS'
                        ? 'text-emerald-400'
                        : line.verdict === 'FAIL'
                          ? 'text-rose-400'
                          : 'text-amber-300'
                    }
                  >
                    {line.phase}
                  </span>
                  <span className="text-zinc-500">EXIT {line.exitCode}</span>
                  <span className="text-zinc-600">
                    {line.sha256 === null ? '--' : line.sha256.slice(0, 16)}
                  </span>
                  <span className="w-full text-zinc-500">{line.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {seal !== null && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Fingerprint className="h-3 w-3" /> sello {seal.sealHash.slice(0, 24)}
            </span>
            <span>
              fases {seal.stats.phasesPassed}/{seal.stats.phasesRun}
            </span>
            <span>paridad {seal.stats.parityChecked}</span>
            <span>
              conectores {seal.connectors.activeCount}/{seal.connectors.totalCount}
            </span>
            <span className={seal.deploy.dispatched ? 'text-emerald-400' : 'text-zinc-500'}>
              deploy {seal.deploy.dispatched ? 'DISPATCHED' : seal.deploy.detail}
            </span>
            {seal.blockers.length > 0 && (
              <span className="text-rose-300">bloqueos: {seal.blockers.join(' · ')}</span>
            )}
            <span className="text-zinc-600">{seal.checkedAt}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default MetaCompilerCommandCenter;



