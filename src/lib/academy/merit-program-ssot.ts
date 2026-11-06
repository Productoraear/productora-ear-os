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

