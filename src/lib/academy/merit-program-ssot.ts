/**
 * ════════════════════════════════════════════════════════════════════════════
 * W52_T01 · SSOT DEL PROGRAMA DE FORMACIÓN POR MÉRITO (66 / 99 DÍAS HACIENDO CLIC)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina de centro de alto rendimiento: un módulo SOLO se desbloquea con
 * evidencia verificada del módulo anterior. No hay atajos:
 *   · Este motor no recibe pagos, fechas ni roles como entrada: pagar no
 *     desbloquea, esperar no desbloquea, ser admin no desbloquea.
 *   · La evidencia autoverificada (verificador = el propio artista) no cuenta.
 *   · Una evidencia sin verificador, sin fecha válida o de tipo desconocido
 *     se descarta y se informa como rechazada.
 *
 * Módulo PURO: sin fs, sin next/*, sin Prisma. Lo importan Server Components,
 * Client Components y el arnés `scripts/verify_merit_program.ts`.
 *
 * VERDAD DE CONTENIDOS (AF-5): cada módulo declara de dónde sale su contenido.
 * Lo que no está recuperado en disco se marca PENDIENTE; no se inventa.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type MeritTrackId = 'track66' | 'track99';

export type MeritEvidenceKind = 'exercise' | 'metric' | 'mentor_review';

export const MERIT_EVIDENCE_KINDS: readonly MeritEvidenceKind[] = ['exercise', 'metric', 'mentor_review'];

/** Procedencia del contenido de cada módulo (Ley del Auditor Real). */
export type ContentProvenance =
  /** Texto recuperado y guardado en disco. */
  | 'RECUPERADO_DISCO'
  /** Herramienta existente en el zip de Astra, pendiente de portar (W52_T05). */
  | 'ASTRA_PENDIENTE_PORTAR'
  /** El CEO declara que existe; falta la exportación de WordPress (W52_T06). */
  | 'PENDIENTE_EXPORT_WP';

export interface MeritModule {
  readonly id: string;
  readonly title: string;
  readonly dayFrom: number;
  readonly dayTo: number;
  /** Módulos que deben estar COMPLETADOS para desbloquear este. */
  readonly prerequisites: readonly string[];
  /** Tipos de evidencia verificada exigidos para dar el módulo por completado. */
  readonly requiredEvidence: readonly MeritEvidenceKind[];
  readonly provenance: ContentProvenance;
  readonly sourceRef: string | null;
}

export interface MeritTrack {
  readonly id: MeritTrackId;
  readonly name: string;
  readonly audience: string;
  readonly totalDays: number;
  readonly modules: readonly MeritModule[];
}

export interface MeritEvidence {
  readonly moduleId: string;
  readonly kind: MeritEvidenceKind;
  /** ISO-8601. */
  readonly verifiedAt: string;
  /** Identificador de quien verifica (mentor, CEO, sistema de métricas). */
  readonly verifier: string;
}

export interface UnlockInput {
  readonly artistId: string;
  readonly trackId: MeritTrackId;
  readonly evidence: readonly MeritEvidence[];
}

export interface LockedModule {
  readonly id: string;
  /** Qué falta, en lenguaje claro para el artista. */
  readonly missing: readonly string[];
}

export interface RejectedEvidence {
  readonly evidence: MeritEvidence;
  readonly reason: 'SIN_VERIFICADOR' | 'AUTOVERIFICADA' | 'FECHA_INVALIDA' | 'TIPO_DESCONOCIDO' | 'MODULO_DESCONOCIDO';
}

export interface UnlockResult {
  readonly trackId: MeritTrackId;
  readonly completed: readonly string[];
  readonly unlocked: readonly string[];
  readonly locked: readonly LockedModule[];
  readonly rejected: readonly RejectedEvidence[];
  readonly progressPct: number;
}

// ─── ID de módulo que da acceso directo a la pista 99 sin haber hecho la 66 ───
export const TRACK99_ENTRY_ASSESSMENT_ID = 'track99-entry-assessment';

// ─── PISTAS CANÓNICAS ────────────────────────────────────────────────────────

export const MERIT_TRACKS: Readonly<Record<MeritTrackId, MeritTrack>> = Object.freeze({
  track66: {
    id: 'track66',
    name: '66 días haciendo clic',
    audience: 'Artistas emergentes: del caos a la estructura profesional.',
    totalDays: 66,
    modules: [
      {
        id: 't66-m1-ikigai',
        title: 'Propósito: taller Ikigai',
        dayFrom: 1,
        dayTo: 7,
        prerequisites: [],
        requiredEvidence: ['exercise'],
        provenance: 'ASTRA_PENDIENTE_PORTAR',
        sourceRef: 'astra-os zip · components/tools/IkigaiWorkshop.tsx',
      },
      {
        id: 't66-m2-rueda-vida',
        title: 'Equilibrio: rueda de la vida',
        dayFrom: 8,
        dayTo: 14,
        prerequisites: ['t66-m1-ikigai'],
        requiredEvidence: ['exercise'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't66-m3-marca-artistica',
        title: 'Identidad y kit profesional del artista',
        dayFrom: 15,
        dayTo: 30,
        prerequisites: ['t66-m2-rueda-vida'],
        requiredEvidence: ['exercise', 'mentor_review'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't66-m4-presencia-digital',
        title: 'Presencia digital y primeros datos reales',
        dayFrom: 31,
        dayTo: 45,
        prerequisites: ['t66-m3-marca-artistica'],
        requiredEvidence: ['exercise', 'metric'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't66-m5-primer-contrato',
        title: 'Del contacto al contrato: primera actuación cobrada',
        dayFrom: 46,
        dayTo: 66,
        prerequisites: ['t66-m4-presencia-digital'],
        requiredEvidence: ['metric', 'mentor_review'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
    ],
  },
  track99: {
    id: 'track99',
    name: '99 días haciendo clic',
    audience: 'Artistas en activo que quieren dejar de sobrevivir y vivir dignamente de su arte.',
    totalDays: 99,
    modules: [
      {
        id: 't99-m1-diagnostico',
        title: 'Diagnóstico de carrera y mapa de ingresos',
        dayFrom: 1,
        dayTo: 20,
        prerequisites: [],
        requiredEvidence: ['exercise', 'mentor_review'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't99-m2-exposiciones-ferias',
        title: 'El arte de presentar: exposiciones y ferias en la era híbrida',
        dayFrom: 21,
        dayTo: 40,
        prerequisites: ['t99-m1-diagnostico'],
        requiredEvidence: ['exercise'],
        provenance: 'RECUPERADO_DISCO',
        sourceRef: 'public/data/formacion_artistas_recuperada.txt (Día 39)',
      },
      {
        id: 't99-m3-catalogo-lanzamientos',
        title: 'Catálogo, lanzamientos y regalías',
        dayFrom: 41,
        dayTo: 60,
        prerequisites: ['t99-m2-exposiciones-ferias'],
        requiredEvidence: ['exercise', 'metric'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't99-m4-negocio-directo',
        title: 'Negocio del directo: caché, rider y contratos',
        dayFrom: 61,
        dayTo: 80,
        prerequisites: ['t99-m3-catalogo-lanzamientos'],
        requiredEvidence: ['metric', 'mentor_review'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
      {
        id: 't99-m5-diamante-rojo',
        title: 'Certificación Diamante Rojo',
        dayFrom: 81,
        dayTo: 99,
        prerequisites: ['t99-m4-negocio-directo'],
        requiredEvidence: ['exercise', 'metric', 'mentor_review'],
        provenance: 'PENDIENTE_EXPORT_WP',
        sourceRef: null,
      },
    ],
  },
});

// ─── MÓDULO 1 · TALLER IKIGAI (W52_T05 · portado del zip de Astra) ───────────
// Contrato PURO y determinista de las cuatro preguntas del taller. La IA NO
// redacta el resultado: el «propósito» sale de las propias palabras del artista
// (composición fija), de modo que el ejercicio es reproducible y no depende de
// ninguna clave de Gemini en el navegador (INV-07).

/** Identificador canónico del módulo de mérito del Día 1 (pista 66). */
export const IKIGAI_MODULE_ID = 't66-m1-ikigai';

export type IkigaiFieldId = 'loves' | 'goodAt' | 'worldNeeds' | 'paidFor';

export interface IkigaiFieldDefinition {
  readonly id: IkigaiFieldId;
  readonly order: number;
  readonly label: string;
  /** Cuadrante del diagrama clásico (texto honesto, sin promesas médicas). */
  readonly quadrant: string;
  readonly prompt: string;
  readonly placeholder: string;
  /** Preguntas de apoyo del helper original de Astra, en texto fijo. */
  readonly helperQuestions: readonly string[];
  readonly minChars: number;
}

/** Las cuatro preguntas, en orden canónico de captura. */
export const IKIGAI_FIELDS: readonly IkigaiFieldDefinition[] = [
  {
    id: 'loves',
    order: 1,
    label: 'Lo que amas',
    quadrant: 'Pasión',
    prompt: '¿Qué harías igualmente aunque nadie te pagara por ello?',
    placeholder: 'Escribe en concreto: repertorio, escenarios, momentos que te encienden…',
    helperQuestions: [
      '¿Qué actuación recuerdas como la más feliz de tu vida?',
      '¿Qué parte del oficio harías gratis cada semana?',
      '¿Qué te quita el sueño de ilusión, no de preocupación?',
    ],
    minChars: 40,
  },
  {
    id: 'goodAt',
    order: 2,
    label: 'En lo que eres bueno',
    quadrant: 'Vocación',
    prompt: '¿Qué haces medible mejor que la mayoría de artistas de tu ámbito?',
    placeholder: 'Habilidad concreta + prueba: aforo, género, instrumento, años, datos reales…',
    helperQuestions: [
      '¿Qué te piden otros artistas que les resuelvas?',
      '¿Qué métrica real respalda esa habilidad?',
      '¿Dónde te eligen por delante de otro con el mismo precio?',
    ],
    minChars: 40,
  },
  {
    id: 'worldNeeds',
    order: 3,
    label: 'Lo que el mundo necesita',
    quadrant: 'Misión',
    prompt: '¿Qué problema real resuelve tu arte a quien te contrata?',
    placeholder: 'Describe el problema del cliente: boda, empresa, ayuntamiento, residencia…',
    helperQuestions: [
      '¿Qué se pierde el cliente si no te contrata?',
      '¿Qué momento concreto entrega tu actuación?',
      '¿Quién paga y por qué le merece la pena?',
    ],
    minChars: 40,
  },
  {
    id: 'paidFor',
    order: 4,
    label: 'Aquello por lo que te pagan',
    quadrant: 'Profesión',
    prompt: '¿Por qué concepto exacto te han pagado ya, con cifras?',
    placeholder: 'Concepto facturado + importe o nº de bolos: datos reales, no deseos…',
    helperQuestions: [
      '¿Cuál ha sido tu bolo mejor pagado y por qué?',
      '¿Qué parte del servicio nadie te discute en precio?',
      '¿Qué puedes facturar mañana con lo que ya tienes?',
    ],
    minChars: 40,
  },
];

export type IkigaiAnswers = Readonly<Record<IkigaiFieldId, string>>;

export type IkigaiFieldStatus = 'VACIO' | 'CORTO' | 'SUFICIENTE';

export interface IkigaiFieldAssessment {
  readonly id: IkigaiFieldId;
  readonly status: IkigaiFieldStatus;
  readonly length: number;
  readonly minChars: number;
}

export interface IkigaiPurposeLine {
  readonly id: IkigaiFieldId;
  readonly label: string;
  /** Frase ensamblada con las palabras del artista (sin inventar contenido). */
  readonly line: string;
}

export interface IkigaiComposition {
  readonly ready: boolean;
  readonly fields: readonly IkigaiFieldAssessment[];
  readonly missing: readonly IkigaiFieldId[];
  /** 0–100: media del avance por campo, redondeada. */
  readonly completionPct: number;
  readonly purpose: readonly IkigaiPurposeLine[];
  /** Frase para llevar al Día 2; vacía mientras el taller no esté completo. */
  readonly statement: string;
}

export interface IkigaiExerciseSubmission {
  readonly artistId: string;
  readonly answers: IkigaiAnswers;
  /** ISO-8601 del momento de entrega. */
  readonly submittedAt: string;
  /** Huella estable del ejercicio (FNV-1a 32 bits, hex) para trazabilidad. */
  readonly fingerprint: string;
}

export interface IkigaiExerciseRecordResult {
  readonly accepted: boolean;
  /** Por qué NO se acepta (vacío si `accepted`). */
  readonly blocking: readonly string[];
  readonly composition: IkigaiComposition;
  readonly submission: IkigaiExerciseSubmission;
  /**
   * Evidencia lista para `evaluateUnlock`. Nace SIN verificador (''), por lo
   * que el motor de mérito la rechaza como SIN_VERIFICADOR: el artista NO puede
   * autocompletar el módulo. La evidencia se sella cuando un mentor la revisa.
   */
  readonly evidence: MeritEvidence;
}

const IKIGAI_TEMPLATE: Readonly<Record<IkigaiFieldId, (value: string) => string>> = {
  loves: (value) => `Mi motor es ${value}.`,
  goodAt: (value) => `Lo hago con ventaja demostrable: ${value}.`,
  worldNeeds: (value) => `Resuelve un problema real: ${value}.`,
  paidFor: (value) => `Se monetiza así: ${value}.`,
};

function normalizeAnswer(raw: string): string {
  return typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '';
}

/** FNV-1a 32 bits: huella estable del ejercicio, sin dependencias externas. */
export function ikigaiFingerprint(answers: IkigaiAnswers): string {
  const canon = IKIGAI_FIELDS.map((field) => normalizeAnswer(answers[field.id])).join('|');
  let hash = 0x811c9dc5;
  for (let i = 0; i < canon.length; i += 1) {
    hash ^= canon.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * Compone el propósito con las palabras del artista. Determinista: misma
 * entrada ⇒ misma salida. No rellena huecos ni inventa contenido (AF-5).
 */
export function composeIkigaiPurpose(answers: IkigaiAnswers): IkigaiComposition {
  const fields: IkigaiFieldAssessment[] = IKIGAI_FIELDS.map((field) => {
    const length = normalizeAnswer(answers[field.id]).length;
    const status: IkigaiFieldStatus =
      length === 0 ? 'VACIO' : length < field.minChars ? 'CORTO' : 'SUFICIENTE';
    return { id: field.id, status, length, minChars: field.minChars };
  });

  const missing = fields.filter((f) => f.status !== 'SUFICIENTE').map((f) => f.id);
  const ready = missing.length === 0;

  const ratioSum = fields.reduce((acc, f) => acc + Math.min(1, f.length / Math.max(1, f.minChars)), 0);
  const completionPct = Math.round((ratioSum / fields.length) * 100);

  const purpose: IkigaiPurposeLine[] = IKIGAI_FIELDS.map((field) => {
    const value = normalizeAnswer(answers[field.id]);
    return {
      id: field.id,
      label: field.label,
      line: value.length > 0 ? IKIGAI_TEMPLATE[field.id](value) : '',
    };
  });

  const statement = ready ? purpose.map((p) => p.line).join(' ') : '';

  return { ready, fields, missing, completionPct, purpose, statement };
}

/** Qué le falta a una respuesta concreta, en lenguaje claro para el artista. */
export function describeIkigaiFieldStatus(assessment: IkigaiFieldAssessment): string {
  if (assessment.status === 'VACIO') return 'sin responder';
  if (assessment.status === 'CORTO') {
    return `faltan ${assessment.minChars - assessment.length} caracteres`;
  }
  return 'suficiente';
}

/**
 * Prepara la entrega del taller como evidencia `exercise` PENDIENTE de
 * verificador. La firma es la del contrato de mérito: no añade atajos.
 */
export function buildIkigaiExerciseEvidence(
  artistId: string,
  answers: IkigaiAnswers,
  submittedAt: string,
): IkigaiExerciseRecordResult {
  const composition = composeIkigaiPurpose(answers);
  const submitter = artistId.trim();
  const blocking: string[] = [];

  if (submitter.length === 0) blocking.push('falta identificar al artista que entrega');
  if (!Number.isFinite(Date.parse(submittedAt))) blocking.push('la fecha de entrega no es válida');
  for (const fieldId of composition.missing) {
    const def = IKIGAI_FIELDS.find((d) => d.id === fieldId);
    if (!def) continue;
    const assessment = composition.fields.find((f) => f.id === fieldId);
    if (assessment?.status === 'VACIO') blocking.push(`falta responder «${def.label}»`);
    else blocking.push(`«${def.label}» no llega a ${def.minChars} caracteres`);
  }

  const submission: IkigaiExerciseSubmission = {
    artistId: submitter,
    answers: {
      loves: normalizeAnswer(answers.loves),
      goodAt: normalizeAnswer(answers.goodAt),
      worldNeeds: normalizeAnswer(answers.worldNeeds),
      paidFor: normalizeAnswer(answers.paidFor),
    },
    submittedAt,
    fingerprint: ikigaiFingerprint(answers),
  };

  return {
    accepted: blocking.length === 0,
    blocking,
    composition,
    submission,
    // Sin verificador: el módulo NO se completa hasta que un mentor firme.
    evidence: { moduleId: IKIGAI_MODULE_ID, kind: 'exercise', verifiedAt: '', verifier: '' },
  };
}

/** Estado honesto de una entrega de Ikigai dentro del motor de mérito. */
export function describeIkigaiEvidenceStatus(
  record: IkigaiExerciseRecordResult,
  artistId: string,
  evidence: readonly MeritEvidence[],
): 'NO_ENTREGADO' | 'PENDIENTE_VERIFICADOR' | 'VERIFICADO' | 'RECHAZADO' {
  if (!record.accepted) return 'NO_ENTREGADO';

  // ¿Existe ya una evidencia sellada por un TERCERO para este módulo?
  const sealed = evidence.find(
    (ev) =>
      ev.moduleId === IKIGAI_MODULE_ID &&
      ev.kind === 'exercise' &&
      ev.verifier.trim().length > 0 &&
      ev.verifier.trim().toLowerCase() !== artistId.trim().toLowerCase() &&
      Number.isFinite(Date.parse(ev.verifiedAt)),
  );
  // Sin firma de tercero: la entrega está PENDIENTE, no rechazada.
  if (!sealed) return 'PENDIENTE_VERIFICADOR';

  const result = evaluateUnlock({ artistId, trackId: 'track66', evidence });
  return result.completed.includes(IKIGAI_MODULE_ID) ? 'VERIFICADO' : 'RECHAZADO';
}

/**
 * Precio del programa: NO se inventa. Queda en SIN_EVIDENCIA hasta que el CEO
 * lo fije. Ninguna UI puede mostrar un precio mientras `priceEur` sea null.
 */
export const MERIT_PROGRAM_PRICING: Readonly<
  Record<MeritTrackId, { readonly priceEur: number | null; readonly status: 'SIN_EVIDENCIA' | 'FIRMADO_CEO' }>
> = Object.freeze({
  track66: { priceEur: null, status: 'SIN_EVIDENCIA' },
  track99: { priceEur: null, status: 'SIN_EVIDENCIA' },
});

// ─── MOTOR DE DESBLOQUEO ─────────────────────────────────────────────────────

const KIND_LABEL: Readonly<Record<MeritEvidenceKind, string>> = {
  exercise: 'ejercicio entregado y verificado',
  metric: 'métrica real verificada',
  mentor_review: 'revisión de mentor',
};

function isValidIsoDate(value: string): boolean {
  if (typeof value !== 'string' || value.length < 10) return false;
  const time = Date.parse(value);
  return Number.isFinite(time);
}

function classifyEvidence(
  artistId: string,
  ev: MeritEvidence,
  knownModuleIds: ReadonlySet<string>,
): RejectedEvidence['reason'] | null {
  if (!MERIT_EVIDENCE_KINDS.includes(ev.kind)) return 'TIPO_DESCONOCIDO';
  if (!knownModuleIds.has(ev.moduleId)) return 'MODULO_DESCONOCIDO';
  const verifier = typeof ev.verifier === 'string' ? ev.verifier.trim() : '';
  if (verifier.length === 0) return 'SIN_VERIFICADOR';
  if (verifier.toLowerCase() === artistId.trim().toLowerCase()) return 'AUTOVERIFICADA';
  if (!isValidIsoDate(ev.verifiedAt)) return 'FECHA_INVALIDA';
  return null;
}

/**
 * Evalúa qué módulos están completados, desbloqueados y bloqueados.
 * Determinista: misma entrada ⇒ misma salida (sin reloj, sin azar).
 */
export function evaluateUnlock(input: UnlockInput): UnlockResult {
  const track = MERIT_TRACKS[input.trackId];
  const knownIds = new Set<string>(track.modules.map((m) => m.id));
  if (input.trackId === 'track99') knownIds.add(TRACK99_ENTRY_ASSESSMENT_ID);

  const rejected: RejectedEvidence[] = [];
  const validKindsByModule = new Map<string, Set<MeritEvidenceKind>>();

  for (const ev of input.evidence) {
    const reason = classifyEvidence(input.artistId, ev, knownIds);
    if (reason) {
      rejected.push({ evidence: ev, reason });
      continue;
    }
    const kinds = validKindsByModule.get(ev.moduleId) ?? new Set<MeritEvidenceKind>();
    kinds.add(ev.kind);
    validKindsByModule.set(ev.moduleId, kinds);
  }

  // Puerta de entrada a la pista 99: revisión de mentor de la evaluación de acceso.
  const track99GateOpen =
    input.trackId !== 'track99' ||
    (validKindsByModule.get(TRACK99_ENTRY_ASSESSMENT_ID)?.has('mentor_review') ?? false);

  const completed: string[] = [];
  const unlocked: string[] = [];
  const locked: LockedModule[] = [];

  for (const mod of track.modules) {
    const missing: string[] = [];

    if (!track99GateOpen) {
      missing.push('evaluación de acceso a la pista 99 revisada por un mentor (o completar la pista 66)');
    }
    for (const pre of mod.prerequisites) {
      if (!completed.includes(pre)) missing.push(`completar el módulo «${track.modules.find((m) => m.id === pre)?.title ?? pre}»`);
    }

    if (missing.length > 0) {
      locked.push({ id: mod.id, missing });
      continue;
    }

    unlocked.push(mod.id);

    const have = validKindsByModule.get(mod.id) ?? new Set<MeritEvidenceKind>();
    const pendingKinds = mod.requiredEvidence.filter((k) => !have.has(k));
    if (pendingKinds.length === 0) completed.push(mod.id);
  }

  const progressPct = Math.round((completed.length / track.modules.length) * 100);

  return { trackId: input.trackId, completed, unlocked, locked, rejected, progressPct };
}

/** Qué evidencias faltan para completar un módulo ya desbloqueado (texto para el artista). */
export function describePendingEvidence(trackId: MeritTrackId, moduleId: string, evidence: readonly MeritEvidence[], artistId: string): string[] {
  const mod = MERIT_TRACKS[trackId].modules.find((m) => m.id === moduleId);
  if (!mod) return [];
  const result = evaluateUnlock({ artistId, trackId, evidence });
  if (result.completed.includes(moduleId)) return [];
  const validKinds = new Set<MeritEvidenceKind>(
    evidence
      .filter((ev) => ev.moduleId === moduleId && !result.rejected.some((r) => r.evidence === ev))
      .map((ev) => ev.kind),
  );
  return mod.requiredEvidence.filter((k) => !validKinds.has(k)).map((k) => KIND_LABEL[k]);
}

/** Recuento honesto del estado de los contenidos (para el panel del CEO). */
export function contentProvenanceSummary(): Readonly<Record<ContentProvenance, number>> {
  const summary: Record<ContentProvenance, number> = {
    RECUPERADO_DISCO: 0,
    ASTRA_PENDIENTE_PORTAR: 0,
    PENDIENTE_EXPORT_WP: 0,
  };
  for (const track of Object.values(MERIT_TRACKS)) {
    for (const mod of track.modules) summary[mod.provenance] += 1;
  }
  return summary;
}

