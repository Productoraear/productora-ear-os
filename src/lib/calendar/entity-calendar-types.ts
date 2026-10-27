/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · CALENDARIO SOBERANO POR ENTIDAD (SSOT DE DISPONIBILIDAD)
 * ════════════════════════════════════════════════════════════════════════════
 * INCOHERENCIA ERRADICADA:
 *   Hasta hoy TODOS los flujos de "Bloquear fecha" del ecosistema
 *   (artistas, mariachis, catering, fincas, fotografía, sonido, transporte,
 *   wedding planners, VIMUME…) aterrizaban en `/reservar/solista`, es decir,
 *   en el calendario de Edwin Agudelo. Un proveedor de catering bloqueaba la
 *   agenda del tenor y un mariachi veía ocupadas las fechas del CEO.
 *
 * DOCTRINA:
 *   · Cada rol (artista, proveedor, finca, técnico, terapeuta) posee su
 *     propio calendario, aislado por clave `kind:slug`.
 *   · Ninguna fecha bloqueada de una entidad puede colisionar con otra.
 *   · El SSOT financiero (ear-os-ssot.ts) NO se toca: aquí solo se gestiona
 *     ocupación temporal, nunca dinero.
 *   · Cero `any`, cero datos hardcodeados de fechas, cero fachadas.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Tipos de entidad que pueden bloquear fecha en el ecosistema EAR OS. */
export type CalendarEntityKind =
  | 'artista'
  | 'musica'
  | 'finca'
  | 'catering'
  | 'tecnica'
  | 'fotografia'
  | 'moda'
  | 'decoracion'
  | 'transporte'
  | 'wedding'
  | 'servicios'
  | 'senior_care';

/** Metadatos de presentación de cada tipología (acento OLED único). */
export interface CalendarEntityKindMeta {
  readonly kind: CalendarEntityKind;
  readonly label: string;
  readonly shortLabel: string;
  readonly accent: string;
  /** Categoría del Data Lake de proveedores (`public/data/providers/*.json`). */
  readonly providerCategory: string | null;
  /** Gremio canónico de la taxonomía nupcial, cuando aplica. */
  readonly weddingGremioId: string | null;
}

export const CALENDAR_ENTITY_KINDS: readonly CalendarEntityKindMeta[] = Object.freeze([
  { kind: 'artista', label: 'Artistas & Intérpretes', shortLabel: 'Artista', accent: '#ecb613', providerCategory: 'musica', weddingGremioId: 'musica' },
  { kind: 'musica', label: 'Música & Animación', shortLabel: 'Música', accent: '#ecb613', providerCategory: 'musica', weddingGremioId: 'musica' },
  { kind: 'finca', label: 'Fincas & Espacios', shortLabel: 'Finca', accent: '#34D399', providerCategory: 'finca', weddingGremioId: 'fincas' },
  { kind: 'catering', label: 'Catering & Brasas', shortLabel: 'Catering', accent: '#F97316', providerCategory: 'catering', weddingGremioId: 'catering' },
  { kind: 'tecnica', label: 'Audiovisuales & Sonido', shortLabel: 'Técnica', accent: '#00E5FF', providerCategory: 'sonido', weddingGremioId: 'tecnica' },
  { kind: 'fotografia', label: 'Foto & Vídeo', shortLabel: 'Foto', accent: '#FB7185', providerCategory: 'foto', weddingGremioId: 'fotografia' },
  { kind: 'moda', label: 'Moda & Complementos', shortLabel: 'Moda', accent: '#E7C6A5', providerCategory: 'moda', weddingGremioId: 'moda' },
  { kind: 'decoracion', label: 'Decoración & Floristería', shortLabel: 'Decoración', accent: '#FBBF24', providerCategory: 'decoracion', weddingGremioId: 'decoracion' },
  { kind: 'transporte', label: 'Transporte & Logística', shortLabel: 'Transporte', accent: '#A78BFA', providerCategory: 'transporte', weddingGremioId: 'transporte' },
  { kind: 'wedding', label: 'Wedding Planners & Ceremonia', shortLabel: 'Planner', accent: '#F472B6', providerCategory: 'wedding', weddingGremioId: 'wedding' },
  { kind: 'servicios', label: 'Servicios Complementarios', shortLabel: 'Servicios', accent: '#94A3B8', providerCategory: 'servicios', weddingGremioId: null },
  { kind: 'senior_care', label: 'Centros Senior · VIMUME', shortLabel: 'VIMUME', accent: '#22D3EE', providerCategory: 'senior_care', weddingGremioId: null },
]);

const KIND_INDEX: Readonly<Record<string, CalendarEntityKindMeta>> = Object.freeze(
  Object.fromEntries(CALENDAR_ENTITY_KINDS.map((meta) => [meta.kind, meta] as const)),
);

/** Alias heredados del ecosistema (`sonido`, `foto`, `fincas`…) → kind canónico. */
const KIND_ALIASES: Readonly<Record<string, CalendarEntityKind>> = Object.freeze({
  artistas: 'artista',
  artista: 'artista',
  musicos: 'musica',
  musica: 'musica',
  fincas: 'finca',
  finca: 'finca',
  catering: 'catering',
  tecnica: 'tecnica',
  sonido: 'tecnica',
  audiovisuales: 'tecnica',
  fotografia: 'fotografia',
  foto: 'fotografia',
  video: 'fotografia',
  moda: 'moda',
  decoracion: 'decoracion',
  transporte: 'transporte',
  wedding: 'wedding',
  planner: 'wedding',
  servicios: 'servicios',
  senior_care: 'senior_care',
  senior: 'senior_care',
  vimume: 'senior_care',
});

/** Normaliza cualquier alias de entrada al kind canónico. `null` si no existe. */
export function resolveCalendarEntityKind(raw: string | null | undefined): CalendarEntityKind | null {
  if (typeof raw !== 'string') return null;
  const key = raw.trim().toLowerCase();
  if (!key) return null;
  return KIND_ALIASES[key] ?? null;
}

/** Metadatos de un kind canónico. Fallback seguro: `servicios`. */
export function getCalendarEntityKindMeta(kind: CalendarEntityKind): CalendarEntityKindMeta {
  return KIND_INDEX[kind] ?? KIND_INDEX.servicios;
}

/** Categoría del Data Lake (`musica`, `finca`, `foto`…) → kind de calendario. */
const PROVIDER_CATEGORY_TO_KIND: Readonly<Record<string, CalendarEntityKind>> = Object.freeze({
  musica: 'musica',
  finca: 'finca',
  catering: 'catering',
  sonido: 'tecnica',
  foto: 'fotografia',
  moda: 'moda',
  decoracion: 'decoracion',
  transporte: 'transporte',
  wedding: 'wedding',
  servicios: 'servicios',
  senior_care: 'senior_care',
});

/**
 * Deduce el calendario correcto a partir de la categoría de un proveedor.
 * Permite que cualquier tarjeta del directorio enlace a la agenda de SU dueño
 * en lugar de al configurador del solista.
 */
export function inferCalendarKindFromCategory(
  category: string | null | undefined,
): CalendarEntityKind {
  if (typeof category !== 'string') return 'servicios';
  const key = category.trim().toLowerCase();
  return PROVIDER_CATEGORY_TO_KIND[key] ?? 'servicios';
}

/** Franja horaria canónica de una actuación/servicio (buffer logístico incluido). */
export interface CalendarTimeSlot {
  readonly id: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly timeRange: string;
  readonly label: string;
  readonly period: 'manana' | 'tarde' | 'noche';
  readonly isLateNight: boolean;
}

/**
 * Tope ético y buffer logístico: ninguna entidad puede cubrir más de 6
 * servicios diarios con 30 min de buffer entre ellos (invariante de negocio).
 */
export const CALENDAR_MAX_SERVICES_PER_DAY = 6;
export const CALENDAR_LOGISTICS_BUFFER_MINUTES = 30;

export const CALENDAR_TIME_SLOTS: readonly CalendarTimeSlot[] = Object.freeze([
  { id: 'slot_1200', startTime: '12:00', endTime: '13:30', timeRange: '12:00 - 13:30', label: 'Vermut / Cóctel Mediodía', period: 'manana', isLateNight: false },
  { id: 'slot_1400', startTime: '14:00', endTime: '15:30', timeRange: '14:00 - 15:30', label: 'Banquete Comida / Brindis', period: 'manana', isLateNight: false },
  { id: 'slot_1700', startTime: '17:00', endTime: '18:30', timeRange: '17:00 - 18:30', label: 'Ceremonia Tarde / Tardeo', period: 'tarde', isLateNight: false },
  { id: 'slot_1800', startTime: '18:00', endTime: '19:30', timeRange: '18:00 - 19:30', label: 'Cóctel Atardecer / Recepción', period: 'tarde', isLateNight: false },
  { id: 'slot_2130', startTime: '21:30', endTime: '23:00', timeRange: '21:30 - 23:00', label: 'Cena de Gala / Serenata', period: 'noche', isLateNight: false },
  { id: 'slot_2330', startTime: '23:30', endTime: '01:00', timeRange: '23:30 - 01:00', label: 'Fiesta / Barra Libre', period: 'noche', isLateNight: false },
  { id: 'slot_0130', startTime: '01:30', endTime: '03:00', timeRange: '01:30 - 03:00', label: 'Cierre Nocturno (+Suplemento)', period: 'noche', isLateNight: true },
]);

/** Resolución defensiva `HH:MM` → franja canónica. */
export function findTimeSlot(startTime: string): CalendarTimeSlot | null {
  const normalized = startTime.trim().slice(0, 5);
  return CALENDAR_TIME_SLOTS.find((slot) => slot.startTime === normalized) ?? null;
}

export type CalendarDayStatus = 'LIBRE' | 'PARCIAL' | 'BLOQUEADO' | 'PASADO';

/** Disponibilidad de una entidad en un día concreto. */
export interface EntityDayAvailability {
  /** Fecha normalizada YYYY-MM-DD. */
  readonly date: string;
  readonly status: CalendarDayStatus;
  readonly fullDayBlocked: boolean;
  readonly bookedSlots: readonly string[];
  readonly availableSlots: readonly string[];
  readonly reservedByClient: boolean;
  readonly reason: string | null;
}

/** Registro persistido por entidad (clave `kind:slug`). */
export interface EntityCalendarRecord {
  readonly kind: CalendarEntityKind;
  readonly slug: string;
  displayName: string;
  /** Bloqueos manuales de día completo (`YYYY-MM-DD`, ordenados). */
  blockedDates: string[];
  /** Franjas reservadas por fecha: `{ "2026-11-14": ["14:00"] }`. */
  reservedSlots: Record<string, string[]>;
  /** Fechas con reserva confirmada por el cliente (Price-Lock pagado). */
  confirmedDates: string[];
  /** Feed .ics externo (Google/Apple) para importación. */
  externalIcalUrl: string | null;
  updatedAt: string;
}

/** Resultado de un intento de bloqueo (TOCTOU-safe dentro del proceso). */
export interface EntityBlockResult {
  readonly success: boolean;
  readonly action: 'block' | 'unblock';
  readonly date: string;
  readonly blockedDates: readonly string[];
  readonly reason: string | null;
}

/** Resultado de un intento de reserva de franja. */
export interface EntitySlotReservationResult {
  readonly success: boolean;
  readonly date: string;
  readonly timeSlot: string;
  readonly reason: 'RESERVED' | 'ALREADY_RESERVED' | 'FULL_DAY_BLOCKED' | 'MAX_DAILY_CAP_REACHED' | 'INVALID_INPUT';
  readonly bookedSlots: readonly string[];
}

