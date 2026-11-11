'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T05 · TALLER IKIGAI — MÓDULO DE MÉRITO DEL DÍA 1 (PISTA 66)
 * ════════════════════════════════════════════════════════════════════════════
 * Portado de `astra-os · components/tools/IkigaiWorkshop.tsx` y adaptado a EAR OS:
 *
 *  · CERO claves de IA en el cliente (INV-07): el original llamaba a
 *    `generateIkigaiResponse()` de su `geminiService`. Aquí el propósito se
 *    compone en local con `composeIkigaiPurpose()` (determinista, sin red).
 *  · CERO `framer-motion`, CERO iconos ajenos: solo `lucide-react` con
 *    `strokeWidth` 1.5 y estética OLED `#030305`.
 *  · Guardar el ejercicio NO completa el módulo: emite una `MeritEvidence`
 *    `kind:'exercise'` SIN verificador, que el motor de mérito rechaza como
 *    `SIN_VERIFICADOR` hasta que un mentor la firme (`evaluateUnlock`).
 *  · Geometría fija y `aria-live` (INV-18): sin saltos de layout ni spinners
 *    huérfanos mientras se escribe.
 *
 * Contrato SSOT: src/lib/academy/merit-program-ssot.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Check, CircleHelp, Fingerprint, ShieldCheck } from 'lucide-react';
import {
  IKIGAI_FIELDS,
  IKIGAI_MODULE_ID,
  buildIkigaiExerciseEvidence,
  composeIkigaiPurpose,
  describeIkigaiEvidenceStatus,
  describeIkigaiFieldStatus,
  type IkigaiAnswers,
  type IkigaiExerciseRecordResult,
  type IkigaiFieldDefinition,
} from '@/lib/academy/merit-program-ssot';

export interface IkigaiWorkshopProps {
  /** Identificador del artista que entrega (nunca se muestra en claro). */
  readonly artistId: string;
  /** Se invoca con la entrega preparada al guardar el ejercicio. */
  readonly onExerciseSaved: (record: IkigaiExerciseRecordResult) => void;
  readonly defaultSubmittedAt?: string;
}

const EMPTY_ANSWERS: IkigaiAnswers = {
  loves: '',
  goodAt: '',
  worldNeeds: '',
  paidFor: '',
};

type EvidenceStatus = ReturnType<typeof describeIkigaiEvidenceStatus>;

const STATUS_LABEL: Readonly<Record<EvidenceStatus, { text: string; tone: string }>> = {
  NO_ENTREGADO: { text: 'Sin entregar', tone: 'border-white/10 bg-white/[0.02] text-[#a1a1aa]' },
  PENDIENTE_VERIFICADOR: {
    text: 'Entregado · pendiente de verificador',
    tone: 'border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613]',
  },
  VERIFICADO: {
    text: 'Verificado por mentor',
    tone: 'border-[#10b981]/40 bg-[#10b981]/10 text-[#10b981]',
  },
  RECHAZADO: {
    text: 'Rechazado por el motor de mérito',
    tone: 'border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44]',
  },
};

interface FieldBlockProps {
  readonly field: IkigaiFieldDefinition;
  readonly value: string;
  readonly onChange: (id: IkigaiFieldDefinition['id'], value: string) => void;
}

function FieldBlock({ field, value, onChange }: FieldBlockProps): React.ReactElement {
  const length = value.trim().length;
  const enough = length >= field.minChars;
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label
          htmlFor={`ikigai-${field.id}`}
          className="font-syne text-lg font-semibold text-white"
        >
          {field.order}. {field.label}
        </label>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-[#a1a1aa]">
          {field.quadrant}
        </span>
      </div>
      <p className="mt-1 text-sm text-[#a1a1aa]">{field.prompt}</p>
      <textarea
        id={`ikigai-${field.id}`}
        value={value}
        rows={4}
        onChange={(event) => onChange(field.id, event.target.value)}
        placeholder={field.placeholder}
        aria-describedby={`ikigai-${field.id}-help ikigai-${field.id}-count`}
        className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-[#030305] p-3 text-sm text-[#f5f5f7] placeholder:text-[#52525b] focus:border-[#ecb613]/60 focus:outline-none focus:ring-1 focus:ring-[#ecb613]/40"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <details id={`ikigai-${field.id}-help`}>
          <summary className="flex cursor-pointer list-none items-center gap-1 text-xs text-[#a1a1aa] transition-colors duration-200 hover:text-[#f5f5f7]">
            <CircleHelp size={14} strokeWidth={1.5} aria-hidden="true" />
            Preguntas de apoyo
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#a1a1aa]">
            {field.helperQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </details>
        <span
          id={`ikigai-${field.id}-count`}
          className={`font-mono text-[11px] ${enough ? 'text-[#10b981]' : 'text-[#a1a1aa]'}`}
        >
          {length}/{field.minChars}
        </span>
      </div>
    </div>
  );
}


export function IkigaiWorkshop({
  artistId,
  onExerciseSaved,
  defaultSubmittedAt,
}: IkigaiWorkshopProps): React.ReactElement {
  const [answers, setAnswers] = useState<IkigaiAnswers>(EMPTY_ANSWERS);
  const [record, setRecord] = useState<IkigaiExerciseRecordResult | null>(null);
  const [saveError, setSaveError] = useState<string>('');

  // Render diferido (INV-19): el texto se estabiliza antes de recomponer.
  const deferredAnswers = useDeferredValue(answers);
  const composition = useMemo(() => composeIkigaiPurpose(deferredAnswers), [deferredAnswers]);

  const handleChange = useCallback((id: IkigaiFieldDefinition['id'], value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSaveError('');
  }, []);

  const handleSave = useCallback(() => {
    const submittedAt = defaultSubmittedAt ?? new Date().toISOString();
    const result = buildIkigaiExerciseEvidence(artistId, answers, submittedAt);
    setRecord(result);
    if (!result.accepted) {
      setSaveError('El taller está incompleto: revisa los campos marcados.');
      return;
    }
    setSaveError('');
    onExerciseSaved(result);
  }, [answers, artistId, defaultSubmittedAt, onExerciseSaved]);

  const evidenceStatus: EvidenceStatus = useMemo(() => {
    if (record === null) return 'NO_ENTREGADO';
    // Sin evidencia sellada por mentor todavía: el motor de mérito no completa nada.
    return describeIkigaiEvidenceStatus(record, artistId, [record.evidence]);
  }, [record, artistId]);

  const statusMeta = STATUS_LABEL[evidenceStatus];
  const canSubmit = composition.ready;

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 sm:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <p className="m-0 text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">
            Pista 66 · módulo 1 · Días 1–7
          </p>
          <h2 className="m-0 mt-1 font-syne text-2xl font-bold tracking-tight text-white">
            Taller Ikigai: propósito artístico
          </h2>
          <p className="m-0 mt-2 max-w-2xl text-sm text-[#a1a1aa]">
            Cuatro preguntas con evidencia real. Guardar el ejercicio genera una entrega pendiente
            de verificador: el módulo no se desbloquea hasta que un mentor la revise.
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs text-[#a1a1aa]">Avance</span>
          <p className="m-0 font-mono text-2xl text-[#ecb613]">{composition.completionPct}%</p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {IKIGAI_FIELDS.map((field) => (
          <FieldBlock
            key={field.id}
            field={field}
            value={answers[field.id]}
            onChange={handleChange}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
          <h3 className="m-0 font-syne text-base font-semibold text-white">Composición local</h3>
          <ul className="mt-3 space-y-2">
            {composition.purpose.map((line) => (
              <li key={line.id} className="text-sm">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#a1a1aa]">
                  {line.label}
                </span>
                <p className="m-0 mt-0.5 text-[#f5f5f7]">
                  {line.line.length > 0 ? line.line : 'Pendiente de tus palabras.'}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#050507] p-5">
          <h3 className="m-0 font-syne text-base font-semibold text-white">Estado del módulo</h3>
          <span
            className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.tone}`}
          >
            <ShieldCheck size={14} strokeWidth={1.5} aria-hidden="true" />
            {statusMeta.text}
          </span>
          <ul className="mt-3 space-y-1 text-xs text-[#a1a1aa]">
            {composition.fields.map((assessment) => {
              const def = IKIGAI_FIELDS.find((f) => f.id === assessment.id);
              return (
                <li key={assessment.id} className="flex items-center justify-between gap-3">
                  <span>{def?.label ?? assessment.id}</span>
                  <span className="flex items-center gap-1 font-mono">
                    {assessment.status === 'SUFICIENTE' && (
                      <Check size={13} strokeWidth={1.75} aria-hidden="true" />
                    )}
                    {describeIkigaiFieldStatus(assessment)}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="m-0 mt-3 flex items-center gap-1 font-mono text-[11px] text-[#52525b]">
            <Fingerprint size={13} strokeWidth={1.5} aria-hidden="true" />
            {record ? `huella ${record.submission.fingerprint}` : 'huella pendiente'}
            <span aria-hidden="true">·</span>
            {IKIGAI_MODULE_ID}
          </p>
        </div>
      </div>

  const canSubmit = composition.ready;


      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ecb613] px-6 py-3 text-sm font-semibold text-[#030305] transition-all duration-200 hover:bg-[#f5c53d] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-[#52525b]"
        >
          Guardar ejercicio y enviar a verificación
        </button>
        <p className="m-0 font-mono text-xs text-[#a1a1aa]">
          {canSubmit
            ? 'Listo para entregar · evidencia kind=exercise'
            : `Faltan ${composition.missing.length} de 4 respuestas`}
        </p>
      </div>

      <div aria-live="polite" className="mt-3 min-h-[1.25rem]">
        {saveError.length > 0 && <p className="m-0 text-sm text-[#FF2B44]">{saveError}</p>}
        {record !== null && record.accepted && (
          <p className="m-0 text-sm text-[#10b981]">
            Entrega registrada. Ningún módulo se desbloquea hasta la revisión de un mentor.
          </p>
        )}
      </div>

      <p className="m-0 mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#a1a1aa]">
        Taller de autodiagnóstico. El propósito se compone con tus propias palabras: no interviene
        ningún modelo de lenguaje ni se envía texto a terceros desde este componente.
      </p>
    </section>
  );
}

export default IkigaiWorkshop;
