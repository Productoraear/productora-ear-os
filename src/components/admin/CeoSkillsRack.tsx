'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  FileType2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { adminFetch, isAdminHttpError } from '@/lib/admin/adminFetch';
import type { SkillArtifactKind, SkillRole } from '@/lib/skills/skill-contract';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * RACK DE CARTUCHOS EJECUTIVOS DEL CEO (OLED #030305 · 0 TOKENS)
 * ════════════════════════════════════════════════════════════════════════════
 * Cada cartucho ejecuta una habilidad local del Skill Dispatcher y devuelve un
 * artefacto real (.xlsx / .pdf / .md) descargable, con su SHA-256 a la vista.
 *
 * Reglas de honestidad heredadas del resto del panel:
 *   · El catálogo se lee del SERVIDOR (`GET /api/admin/skills?role=CEO`); aquí
 *     no se declara ningún cartucho a mano.
 *   · Si el catálogo no responde, se pinta SIN_EVIDENCIA y se deshabilita todo.
 *   · Los importes se muestran tal como los devuelve el motor, nunca recalculados
 *     en el navegador (el dinero se calcula una sola vez, en céntimos).
 *   · Cero spinners huérfanos: cada cartucho declara su estado.
 * ════════════════════════════════════════════════════════════════════════════
 */

const SURFACE = 'bg-[#09090d]';
const BORDER = 'border-[#1E1E26]';
const ACCENT = '#ecb613';

interface SkillManifestDto {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly role: SkillRole;
  readonly artifactKind: SkillArtifactKind;
  readonly steps: readonly { readonly id: string; readonly label: string }[];
  readonly externalTokenCost: number;
}

interface CatalogDto {
  readonly role: SkillRole;
  readonly skills: readonly SkillManifestDto[];
  readonly timeoutMs: number;
  readonly externalTokenCost: number;
  readonly probed: boolean;
  readonly source: string;
  readonly checkedAt: string;
}

interface ArtifactDto {
  readonly kind: SkillArtifactKind;
  readonly filename: string;
  readonly byteLength: number;
  readonly sha256: string;
  readonly downloadUrl: string;
  readonly expiresInSeconds: number;
}

interface ExecutionDto {
  readonly skill: string;
  readonly title: string;
  readonly mode: 'REAL' | 'SIMULADO';
  readonly probed: boolean;
  readonly checkedAt: string;
  readonly summary: readonly { readonly label: string; readonly value: string }[];
  readonly evidence: readonly string[];
  readonly artifacts: readonly ArtifactDto[];
}

type RunState =
  | { readonly status: 'idle' }
  | { readonly status: 'running' }
  | { readonly status: 'done'; readonly execution: ExecutionDto }
  | { readonly status: 'error'; readonly message: string };

const KIND_ICON: Record<SkillArtifactKind, typeof FileText> = {
  xlsx: FileSpreadsheet,
  pdf: FileType2,
  md: FileText,
  json: FileText,
};

/** Descarga autenticada: el endpoint exige Bearer, así que no vale un `<a href>`. */
async function downloadArtifact(artifact: ArtifactDto): Promise<void> {
  const response = await fetch(artifact.downloadUrl, {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`La descarga respondió ${response.status}. Vuelve a ejecutar el cartucho.`);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = artifact.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ── Formularios por cartucho ─────────────────────────────────────────────
 * Un cartucho sin formulario no se puede ejecutar: la UI no inventa payloads.
 * Los campos son los MISMOS que valida el Zod del servidor.
 */

type FieldType = 'text' | 'number' | 'date' | 'select' | 'items' | 'blocks';

interface FieldSpec {
  readonly key: string;
  readonly label: string;
  readonly type: FieldType;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly options?: readonly string[];
}

const FORMS: Readonly<Record<string, readonly FieldSpec[]>> = Object.freeze({
  'ceo-liquidation-split': [
    { key: 'eventName', label: 'Nombre del evento', type: 'text', placeholder: 'Boda Otzarreta' },
    { key: 'eventDate', label: 'Fecha del evento', type: 'date' },
    {
      key: 'artistLabel',
      label: 'Beneficiario (artista o proveedor)',
      type: 'text',
      placeholder: 'Edwin Agudelo',
    },
    { key: 'depositPaidEur', label: 'Deposito ya cobrado (EUR)', type: 'number', placeholder: '100' },
    {
      key: 'items',
      label: 'Lineas del evento',
      type: 'items',
      hint: 'Una por linea con formato: Concepto | 1000',
    },
  ],
  'ceo-lcsp-contract': [
    { key: 'counterparty', label: 'Contraparte', type: 'text', placeholder: 'Ayuntamiento de Toledo' },
    { key: 'counterpartyTaxId', label: 'CIF o NIF (opcional)', type: 'text', placeholder: 'P4500000A' },
    { key: 'mode', label: 'Regimen', type: 'select', options: ['B2G', 'B2C'] },
    { key: 'grossEur', label: 'Importe bruto (EUR)', type: 'number', placeholder: '9000' },
    { key: 'eventDate', label: 'Fecha del evento', type: 'date' },
    { key: 'venue', label: 'Emplazamiento', type: 'text', placeholder: 'Plaza del Ayuntamiento' },
    { key: 'pax', label: 'Aforo (personas)', type: 'number', placeholder: '400' },
    {
      key: 'serviceSummary',
      label: 'Objeto del servicio',
      type: 'text',
      placeholder: 'Mariachi monumental y sonido',
    },
  ],
  'ceo-provider-dossier': [
    { key: 'providerName', label: 'Proveedor', type: 'text', placeholder: 'Asador Etxebarri' },
    { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Asador' },
    { key: 'capacityPax', label: 'Aforo declarado (opcional)', type: 'number', placeholder: '250' },
    { key: 'proposedGrossEur', label: 'Propuesta bruta (EUR)', type: 'number', placeholder: '9000' },
    { key: 'monthlyFeeEur', label: 'Cuota mensual (0 = gratuito)', type: 'number', placeholder: '0' },
    { key: 'proposalDate', label: 'Fecha de la propuesta', type: 'date' },
    {
      key: 'valueBlocks',
      label: 'Bloques de valor',
      type: 'blocks',
      hint: 'Uno por linea (max. 6).',
    },
  ],
  'ceo-forensic-audit': [
    { key: 'operator', label: 'Operador', type: 'text', placeholder: 'Edwin Agudelo' },
    { key: 'notes', label: 'Notas (opcional)', type: 'text' },
  ],
});

type FormValues = Record<string, string>;

/** Valores por defecto: fecha de hoy en ISO, nunca una fecha inventada. */
function defaultValues(skillId: string, todayIso: string): FormValues {
  const values: FormValues = {};
  for (const field of FORMS[skillId] ?? []) {
    if (field.type === 'date') values[field.key] = todayIso;
    else if (field.type === 'select') values[field.key] = field.options?.[0] ?? '';
    else values[field.key] = '';
  }
  return values;
}

/** Marca de campo opcional: se omite del payload en lugar de enviar cadena vacía. */
function isOptional(field: FieldSpec): boolean {
  return field.label.includes('opcional') || field.label.includes('0 = gratuito');
}

type BuildResult = { readonly ok: true; readonly payload: Record<string, unknown> } | { readonly ok: false; readonly error: string };

/**
 * Convierte el formulario al payload tipado. Nunca inventa valores: si falta
 * un campo obligatorio devuelve el motivo en lugar de mandar basura al motor.
 */
function buildPayload(skillId: string, values: FormValues): BuildResult {
  const payload: Record<string, unknown> = {};
  for (const field of FORMS[skillId] ?? []) {
    const raw = (values[field.key] ?? '').trim();
    if (raw.length === 0) {
      if (isOptional(field)) continue;
      return { ok: false, error: `Falta el campo «${field.label}».` };
    }
    switch (field.type) {
      case 'number': {
        const parsed = Number.parseFloat(raw.replace(',', '.'));
        if (!Number.isFinite(parsed)) return { ok: false, error: `«${field.label}» no es un número válido.` };
        payload[field.key] = parsed;
        break;
      }
      case 'items': {
        const lines = raw.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
        if (lines.length === 0) return { ok: false, error: 'La liquidación necesita al menos una línea.' };
        const items: { concept: string; amountEur: number }[] = [];
        for (const line of lines) {
          const separator = line.lastIndexOf('|');
          if (separator === -1) {
            return { ok: false, error: `Línea sin «|»: «${line}». Formato: Concepto | 1000` };
          }
          const concept = line.slice(0, separator).trim();
          const amount = Number.parseFloat(line.slice(separator + 1).trim().replace(',', '.'));
          if (concept.length < 2) return { ok: false, error: `Concepto demasiado corto en «${line}».` };
          if (!Number.isFinite(amount) || amount < 0) return { ok: false, error: `Importe inválido en «${line}».` };
          items.push({ concept, amountEur: amount });
        }
        payload[field.key] = items;
        break;
      }
      case 'blocks': {
        const blocks = raw.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
        if (blocks.length === 0) return { ok: false, error: 'Añade al menos un bloque de valor.' };
        payload[field.key] = blocks;
        break;
      }
      default: {
        payload[field.key] = raw;
        break;
      }
    }
  }
  return { ok: true, payload };
}

/* ── Tarjeta de cartucho ──────────────────────────────────────────────── */

function SkillCartridge({ skill, todayIso }: { skill: SkillManifestDto; todayIso: string }) {
  const [values, setValues] = useState<FormValues>(() => defaultValues(skill.id, todayIso));
  const [state, setState] = useState<RunState>({ status: 'idle' });
  const [localError, setLocalError] = useState<string | null>(null);

  const fields = FORMS[skill.id] ?? [];
  const Icon = KIND_ICON[skill.artifactKind];
  const running = state.status === 'running';

  const setValue = useCallback((key: string, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  }, []);

  const execute = useCallback(async () => {
    setLocalError(null);
    const built = buildPayload(skill.id, values);
    if (!built.ok) {
      setLocalError(built.error);
      return;
    }
    setState({ status: 'running' });
    try {
      const execution = await adminFetch<ExecutionDto>('/api/admin/skills', {
        method: 'POST',
        body: { skillId: skill.id, role: 'CEO', payload: built.payload },
      });
      setState({ status: 'done', execution });
    } catch (caught) {
      setState({
        status: 'error',
        message: isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'No se pudo ejecutar el cartucho: SIN_EVIDENCIA.',
      });
    }
  }, [skill.id, values]);

  return (
    <article className={`rounded-2xl border ${BORDER} ${SURFACE} p-4`}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
          <div className="min-w-0">
            <h3 className="text-xs font-bold leading-tight text-zinc-100">{skill.title}</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{skill.summary}</p>
          </div>
        </div>
        <span className="shrink-0 rounded border border-[#ecb613]/30 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#ecb613]">
          {skill.artifactKind}
        </span>
      </header>

      <ol className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {skill.steps.map((step, index) => (
          <li key={step.id} className="font-mono text-[9px] text-zinc-600">
            {index + 1}. {step.label}
          </li>
        ))}
      </ol>

      <div className="mt-3 space-y-2">
        {fields.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={`${skill.id}-${field.key}`}
              className="mb-1 block font-mono text-[9px] uppercase tracking-wide text-zinc-500"
            >
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select
                id={`${skill.id}-${field.key}`}
                value={values[field.key] ?? ''}
                onChange={(event) => setValue(field.key, event.target.value)}
                disabled={running}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 text-xs text-zinc-200 focus:border-[#ecb613]/60 focus:outline-none disabled:opacity-40"
              >
                {(field.options ?? []).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'items' || field.type === 'blocks' ? (
              <textarea
                id={`${skill.id}-${field.key}`}
                value={values[field.key] ?? ''}
                onChange={(event) => setValue(field.key, event.target.value)}
                disabled={running}
                rows={3}
                placeholder={
                  field.type === 'items'
                    ? 'Menu 120 pax | 7200\nMaridaje | 1200'
                    : 'Menu de temporada\nLogistica coordinada'
                }
                className="w-full resize-y rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-700 focus:border-[#ecb613]/60 focus:outline-none disabled:opacity-40"
              />
            ) : (
              <input
                id={`${skill.id}-${field.key}`}
                type={field.type}
                value={values[field.key] ?? ''}
                onChange={(event) => setValue(field.key, event.target.value)}
                disabled={running}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-white/10 bg-black/50 px-2 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-700 focus:border-[#ecb613]/60 focus:outline-none disabled:opacity-40"
              />
            )}
            {field.hint === undefined ? null : (
              <p className="mt-0.5 font-mono text-[9px] text-zinc-600">{field.hint}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => void execute()}
        disabled={running}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#ecb613] px-3 py-2 text-[11px] font-bold text-black transition hover:bg-[#f5c63a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        {running ? 'Ejecutando…' : 'Ejecutar cartucho'}
      </button>

      {localError === null ? null : (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-2 py-1.5 text-[10px] text-amber-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          {localError}
        </p>
      )}

      {state.status === 'error' ? (
        <p className="mt-2 flex items-start gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-2 py-1.5 text-[10px] text-rose-300">
          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
          {state.message}
        </p>
      ) : null}

      {state.status === 'done' ? <SkillResult execution={state.execution} /> : null}
    </article>
  );
}

/* ── Resultado de la ejecución ────────────────────────────────────────── */

function SkillResult({ execution }: { execution: ExecutionDto }) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = useCallback(async (artifact: ArtifactDto) => {
    setDownloadError(null);
    setDownloading(artifact.sha256);
    try {
      await downloadArtifact(artifact);
    } catch (caught) {
      setDownloadError(caught instanceof Error ? caught.message : 'Descarga fallida.');
    } finally {
      setDownloading(null);
    }
  }, []);

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-emerald-400">
          <CheckCircle2 className="h-3 w-3" /> Ejecutado · {execution.mode}
        </span>
        <span className="font-mono text-[9px] text-zinc-600">{execution.checkedAt}</span>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
        {execution.summary.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="truncate font-mono text-[9px] uppercase text-zinc-600">{row.label}</dt>
            <dd className="truncate font-mono text-[11px] font-bold text-zinc-100">{row.value}</dd>
          </div>
        ))}
      </dl>

      {execution.artifacts.map((artifact) => (
        <div key={artifact.sha256} className="rounded-lg border border-white/10 bg-black/40 p-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-mono text-[10px] text-zinc-200">{artifact.filename}</p>
              <p className="truncate font-mono text-[9px] text-zinc-600">
                {formatBytes(artifact.byteLength)} · sha256 {artifact.sha256.slice(0, 16)}…
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleDownload(artifact)}
              disabled={downloading !== null}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-bold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-40"
            >
              {downloading === artifact.sha256 ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              Descargar
            </button>
          </div>
        </div>
      ))}

      {downloadError === null ? null : (
        <p className="font-mono text-[9px] text-rose-300">{downloadError}</p>
      )}

      <details className="pt-1">
        <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-wide text-zinc-500">
          Evidencia forense ({execution.evidence.length})
        </summary>
        <ul className="mt-1 space-y-0.5">
          {execution.evidence.map((line) => (
            <li key={line} className="font-mono text-[9px] leading-relaxed text-zinc-500">
              · {line}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

/* ── Rack principal ───────────────────────────────────────────────────── */

export function CeoSkillsRack() {
  const [catalog, setCatalog] = useState<CatalogDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Fecha de hoy ISO calculada en cliente: sólo rellena el campo de fecha. */
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const load = useCallback(async () => {
    setError(null);
    try {
      const payload = await adminFetch<CatalogDto>('/api/admin/skills?role=CEO');
      setCatalog(payload);
    } catch (caught) {
      setCatalog(null);
      setError(
        isAdminHttpError(caught)
          ? `${caught.code} · ${caught.message}`
          : 'No se pudo leer el catálogo de cartuchos: SIN_EVIDENCIA.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section aria-labelledby="ceo-skills-rack-title" className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-2 rounded-2xl border border-[#ecb613]/25 bg-[#0b0b10] p-4">
        <div className="flex items-start gap-2.5">
          <Crown className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} />
          <div>
            <h2 id="ceo-skills-rack-title" className="text-sm font-bold text-white">
              Rack de cartuchos ejecutivos
            </h2>
            <p className="mt-0.5 max-w-2xl text-[11px] leading-relaxed text-zinc-400">
              Habilidades locales del despachador: generan el documento real en esta máquina, sin
              ninguna llamada a un modelo. Cada artefacto viaja con su SHA-256 para que puedas
              contrastarlo.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wide">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="h-3 w-3" /> 0 tokens
          </span>
          <span className="text-zinc-500">
            {catalog === null ? 'SIN_EVIDENCIA' : `${catalog.skills.length} cartuchos`}
          </span>
          {catalog === null ? null : (
            <span className="text-zinc-600">timeout {Math.round(catalog.timeoutMs / 1000)} s</span>
          )}
        </div>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-[#1E1E26] bg-[#09090d] p-4 font-mono text-[11px] text-zinc-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Leyendo el catálogo del servidor…
        </div>
      ) : null}

      {error === null ? null : (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 text-[11px] text-rose-300">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <div>
            <p className="font-bold">Catálogo no disponible</p>
            <p className="mt-0.5 font-mono text-[10px] text-rose-400/80">{error}</p>
          </div>
        </div>
      )}

      {catalog !== null && catalog.skills.length === 0 ? (
        <p className="rounded-2xl border border-[#1E1E26] bg-[#09090d] p-4 font-mono text-[11px] text-zinc-500">
          El servidor no declaró ningún cartucho para el rol CEO.
        </p>
      ) : null}

      {catalog !== null && catalog.skills.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {catalog.skills.map((skill) => (
            <SkillCartridge key={skill.id} skill={skill} todayIso={todayIso} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default CeoSkillsRack;
