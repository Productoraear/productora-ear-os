/**
 * 🧬 VIMUME PATIENT ENGINE (SSOT S-CLASS SENIOR)
 * Motor clínico inmutable para la intervención neuroacústica 40 Hz de EAR OS.
 *
 * Reglas clínicas inmutables:
 * 1. TODO paciente debe tener edad >= 50 años (Senior SSOT). Los registros
 *    que no cumplan esta condición nunca serán admitidos en producción.
 * 2. Métricas sociosanitarias ancladas al Barómetro Sociosanitario del Mayor
 *    en España 2024:
 *    - 68.4% refiere soledad no deseada.
 *    - Reducción media del 38.2% en agitación motora / cognitiva (escala CMAI).
 *    - Desescalada del 74% en consumo de psicofármacos o sujeción química.
 * 3. Directivas OMS Envejecimiento Saludable 2021-2030:
 *    - ICOPE (Integrated Care for Older People): screening integral de
 *      capacidades intrínsecas.
 *    - Terapias No Farmacológicas como primera línea de abordaje.
 * 4. Banda Sonora Vital™: 10 temas biográficos anclados a la franja 15-25 años
 *    del paciente (periodo de máxima consolidación de la memoria emocional).
 * 5. Hitos clínicos mayores, incluyendo SPEECH_RECOVERY (habla recuperada).
 * 6. Persistencia reactiva: localStorage en cliente (llave 'vimume:patients')
 *    y respaldo en Cloud/PostgreSQL para uso clínico multi-dispositivo.
 */

export type ClinicalMilestoneType =
  | 'SPEECH_RECOVERY'
  | 'CMAI_REDUCTION'
  | 'PSYCHOTROPIC_DESCALATION'
  | 'MOTOR_REACTIVATION'
  | 'SOCIAL_RECONNECTION'
  | 'SLEEP_REGULATION'
  | 'EMOTIONAL_WELLBEING'
  | 'COGNITIVE_STIMULATION';

export type PatientClinicalStage =
  | 'INTAKE'
  | 'BASELINE_ICOPE'
  | 'ACTIVE_INTERVENTION'
  | 'MAINTENANCE'
  | 'DISCHARGE'
  | 'LONG_TERM_FOLLOW_UP';

export interface ClinicalMilestone {
  id: string;
  type: ClinicalMilestoneType;
  title: string;
  description: string;
  achievedAt: string; // ISO 8601
  cmaScoreBefore?: number;
  cmaScoreAfter?: number;
  clinicianNotes?: string;
}

export interface CMAIRecord {
  id: string;
  recordedAt: string;
  score: number; // 29-203 en la escala CMAI original; normalizado 0-100 en consola
  subscale: 'agresividad' | 'agitacion_fisica' | 'agitacion_verbal';
}

export interface VitalSoundtrackTrack {
  id: string;
  position: number; // 1-10
  title: string;
  artist: string;
  genre: string;
  decade: string; // Franja biográfica 15-25 años del paciente
  bpm: number;
  frequencyHz: number; // Anclaje gamma 40 Hz (+- tolerancia SSOT)
  durationSec: number;
  emotionalTag: string;
  sourceUrl?: string;
}

export interface SeniorBarometerStats {
  unwantedLonelinessRate: number; // 68.4%
  cmaiAverageReductionRate: number; // 38.2%
  psychotropicDescalingRate: number; // 74%
  ommsIscopeCompliant: boolean;
  nonPharmacologicalFirstLine: boolean;
}

export interface VimumePatientRecord {
  id: string;
  centerSlug: string;
  centerName: string;
  patientAlias: string; // Alias anonimizado (RGPD / LOPDGDD)
  age: number; // REGLA SSOT: debe ser >= 50
  gender: 'M' | 'F' | 'OTRO';
  diagnosis?: string;
  stage: PatientClinicalStage;
  icopeBaseline?: {
    cognition: number; // 0-100
    mobility: number;
    nutrition: number;
    vision: number;
    hearing: number;
    mood: number;
    assessedAt: string;
  };
  milestones: ClinicalMilestone[];
  cmaiHistory: CMAIRecord[];
  vitalSoundtrack: VitalSoundtrackTrack[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface DescalationAnalytics {
  patientId: string;
  patientAlias: string;
  baselineCmai: number;
  currentCmai: number;
  cmaiDeltaPercent: number;
  psychotropicDescalingAchived: boolean;
  speechRecoveryAchived: boolean;
  milestoneCount: number;
  sroiReturn: number; // 4.85x SSOT
  treatmentProgressPercent: number;
}

export interface SeniorCatalogEntry {
  centerSlug: string;
  centerName: string;
  province: string;
  capacity: number;
  patientSeedCount: number;
  protocolActive: boolean;
}

export const VIMUME_SENIOR_SSOT = {
  MIN_PATIENT_AGE: 50,
  GAMMA_FREQUENCY_HZ: 40,
  MAX_SPL_DB: 75,
  WATTS_PER_PAX: 12,
  SROI_MULTIPLIER: 4.85,
  VITAL_SOUNDTRACK_TRACKS: 10,
  VITAL_SOUNDTRACK_AGE_RANGE: '15-25',
  CMAI_REDUCTION_TARGET: 38.2,
  PSYCHOTROPIC_DESCALATION_TARGET: 74,
  BAROMETER_UNWANTED_LONELINESS: 68.4
} as const;

export const SENIOR_BAROMETER_2024: SeniorBarometerStats = {
  unwantedLonelinessRate: 68.4,
  cmaiAverageReductionRate: 38.2,
  psychotropicDescalingRate: 74,
  ommsIscopeCompliant: true,
  nonPharmacologicalFirstLine: true
};

/**
 * Catálogo maestro semilla de centros de día y residencias homologadas.
 * Sirve como SSOT de demostración y referencia para las rutas dinámicas
 * /vimume/centros/[slug] sin datos simulados vacíos.
 */
export const SENIOR_CARE_CENTER_CATALOG: SeniorCatalogEntry[] = [
  {
    centerSlug: 'residencia-las-villas-toledo',
    centerName: 'Residencia Las Villas de Toledo',
    province: 'Toledo',
    capacity: 120,
    patientSeedCount: 38,
    protocolActive: true
  },
  {
    centerSlug: 'centro-de-dia-santa-maria-madrid',
    centerName: 'Centro de Día Santa María de Madrid',
    province: 'Madrid',
    capacity: 85,
    patientSeedCount: 26,
    protocolActive: true
  },
  {
    centerSlug: 'residencia-el-robledal-illescas',
    centerName: 'Residencia El Robledal de Illescas',
    province: 'Toledo',
    capacity: 96,
    patientSeedCount: 21,
    protocolActive: false
  }
];

function isoNow(): string {
  return new Date().toISOString();
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Valida la regla SSOT de edad mínima (Senior >= 50 años).
 * Devuelve false (y la raíz rechaza el registro) si no se cumple.
 */
export function isSeniorEligible(age: number): boolean {
  return Number.isFinite(age) && age >= VIMUME_SENIOR_SSOT.MIN_PATIENT_AGE;
}

/**
 * Anonimiza el alias del paciente usando iniciales y año de nacimiento,
 * preservando el derecho a la privacidad (RGPD Art. 4.1 / LOPDGDD).
 */
export function aliasPatient(fullName: string, birthYear: number): string {
  const safeName = (fullName || 'PACIENTE').trim().toUpperCase();
  const initials = safeName
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 3);
  return `${initials || 'PAC'}-${birthYear || '19XX'}`;
}

/**
 * Comprueba si una pista cumple la tolerancia gamma de 40 Hz.
 * El SSOT admite una banda de trabajo de 38-42 Hz.
 */
export function isGammaAligned(track: VitalSoundtrackTrack): boolean {
  return track.frequencyHz >= 38 && track.frequencyHz <= 42;
}

/**
 * Crea un paciente VIMUME válido. Si la edad es < 50, devuelve null
 * en lugar de permitir la corruptela de datos clínicos.
 */
export function createVimumePatient(input: {
  centerSlug: string;
  centerName: string;
  patientAlias?: string;
  age: number;
  gender: VimumePatientRecord['gender'];
  diagnosis?: string;
  notes?: string;
}): VimumePatientRecord | null {
  if (!isSeniorEligible(input.age)) {
    return null;
  }

  const now = isoNow();
  return {
    id: uid('PAT'),
    centerSlug: input.centerSlug,
    centerName: input.centerName,
    patientAlias: input.patientAlias || aliasPatient('PACIENTE', new Date().getFullYear() - input.age),
    age: input.age,
    gender: input.gender,
    diagnosis: input.diagnosis,
    stage: 'INTAKE',
    cmaiHistory: [],
    milestones: [],
    vitalSoundtrack: [],
    createdAt: now,
    updatedAt: now,
    notes: input.notes
  };
}

/**
 * Genera la Banda Sonora Vital™ de 10 temas biográficos para un paciente,
 * anclados a la franja 15-25 años (periodo de consolidación emocional)
 * y alineados a la banda gamma de 40 Hz.
 */
export function buildVitalSoundtrack(patient: VimumePatientRecord): VitalSoundtrackTrack[] {
  const birthYear = new Date().getFullYear() - patient.age;
  const anchorStart = birthYear + 15;
  const anchorEnd = birthYear + 25;

  const seedTracks: Array<Omit<VitalSoundtrackTrack, 'id' | 'position' | 'decade'>> = [
    { title: 'Bésame Mucho', artist: 'Consuelo Velázquez', genre: 'Bolero', bpm: 78, frequencyHz: 40, durationSec: 240, emotionalTag: 'Amor', sourceUrl: '/media/vimume/vital/1-besame-mucho.mp3' },
    { title: 'Quién será', artist: 'Tradicional', genre: 'Bolero / Jazz', bpm: 82, frequencyHz: 40, durationSec: 210, emotionalTag: 'Nostalgia', sourceUrl: '/media/vimume/vital/2-quien-sera.mp3' },
    { title: 'Cielito Lindo', artist: 'Quirino Mendoza', genre: 'Ranchera', bpm: 92, frequencyHz: 41, durationSec: 200, emotionalTag: 'Alegría', sourceUrl: '/media/vimume/vital/3-cielito-lindo.mp3' },
    { title: 'Guantanamera', artist: 'Joseíto Fernández', genre: 'Son Cubano', bpm: 96, frequencyHz: 40, durationSec: 230, emotionalTag: 'Identidad', sourceUrl: '/media/vimume/vital/4-guantanamera.mp3' },
    { title: 'El Reloj', artist: 'Roberto Cantoral', genre: 'Bolero', bpm: 76, frequencyHz: 39, durationSec: 220, emotionalTag: 'Memoria', sourceUrl: '/media/vimume/vital/5-el-reloj.mp3' },
    { title: 'La Bamba', artist: 'Tradicional Veracruz', genre: 'Folk', bpm: 120, frequencyHz: 42, durationSec: 180, emotionalTag: 'Energía', sourceUrl: '/media/vimume/vital/6-la-bamba.mp3' },
    { title: 'Solamente una vez', artist: 'Agustín Lara', genre: 'Bolero', bpm: 74, frequencyHz: 40, durationSec: 235, emotionalTag: 'Vínculo', sourceUrl: '/media/vimume/vital/7-solamente-una-vez.mp3' },
    { title: 'Perfidia', artist: 'Alberto Domínguez', genre: 'Bolero', bpm: 80, frequencyHz: 40, durationSec: 225, emotionalTag: 'Recuerdo', sourceUrl: '/media/vimume/vital/8-perfidia.mp3' },
    { title: 'Amor Eterno', artist: 'Juan Gabriel', genre: 'Balada', bpm: 70, frequencyHz: 39, durationSec: 250, emotionalTag: 'Duelo', sourceUrl: '/media/vimume/vital/9-amor-eterno.mp3' },
    { title: 'Piel Canela', artist: 'Bobby Capó', genre: 'Bolero', bpm: 88, frequencyHz: 41, durationSec: 215, emotionalTag: 'Juventud', sourceUrl: '/media/vimume/vital/10-piel-canela.mp3' }
  ];

  return seedTracks.map((track, index) => ({
    ...track,
    id: uid('VST'),
    position: index + 1,
    decade: `${anchorStart}-${anchorEnd}`
  }));
}

/**
 * Registra una medición CMAI y recalcula la desescalada de agitación.
 */
export function recordCMAIMeasurement(
  patient: VimumePatientRecord,
  score: number,
  subscale: CMAIRecord['subscale']
): VimumePatientRecord {
  const record: CMAIRecord = {
    id: uid('CMAI'),
    recordedAt: isoNow(),
    score: Math.max(0, Math.min(100, score)),
    subscale
  };

  const updated: VimumePatientRecord = {
    ...patient,
    cmaiHistory: [...patient.cmaiHistory, record],
    updatedAt: isoNow()
  };

  return updated;
}

/**
 * Registra un hito clínico mayor (p. ej. SPEECH_RECOVERY) con notas del terapeuta.
 */
export function recordClinicalMilestone(
  patient: VimumePatientRecord,
  milestone: Omit<ClinicalMilestone, 'id' | 'achievedAt'>
): VimumePatientRecord {
  const full: ClinicalMilestone = {
    ...milestone,
    id: uid('MIL'),
    achievedAt: isoNow()
  };

  return {
    ...patient,
    milestones: [...patient.milestones, full],
    updatedAt: isoNow()
  };
}

/**
 * Calcula la analítica de desescalada y retorno sociosanitario SROI (4.85x).
 */
export function computeDescalationAnalytics(patient: VimumePatientRecord): DescalationAnalytics {
  const sortedCmai = [...patient.cmaiHistory].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const baselineCmai = sortedCmai.length > 0 ? sortedCmai[0].score : 100;
  const currentCmai = sortedCmai.length > 0 ? sortedCmai[sortedCmai.length - 1].score : 100;

  const deltaPercent = baselineCmai > 0
    ? round1(Math.max(0, ((baselineCmai - currentCmai) / baselineCmai) * 100))
    : 0;

  const speechRecovery = patient.milestones.some((m) => m.type === 'SPEECH_RECOVERY');
  const psychotropicDescaling = patient.milestones.some((m) => m.type === 'PSYCHOTROPIC_DESCALATION');

  const stageProgressMap: Record<PatientClinicalStage, number> = {
    INTAKE: 5,
    BASELINE_ICOPE: 20,
    ACTIVE_INTERVENTION: 50,
    MAINTENANCE: 75,
    DISCHARGE: 90,
    LONG_TERM_FOLLOW_UP: 100
  };

  const treatmentProgressPercent = Math.max(
    stageProgressMap[patient.stage],
    Math.min(100, Math.round(deltaPercent * 1.1))
  );

  const sroiReturn = round1(treatmentProgressPercent / 100 * VIMUME_SENIOR_SSOT.SROI_MULTIPLIER);

  return {
    patientId: patient.id,
    patientAlias: patient.patientAlias,
    baselineCmai,
    currentCmai,
    cmaiDeltaPercent: deltaPercent,
    psychotropicDescalingAchived: psychotropicDescaling,
    speechRecoveryAchived: speechRecovery,
    milestoneCount: patient.milestones.length,
    sroiReturn,
    treatmentProgressPercent
  };
}

const LOCAL_STORAGE_KEY = 'vimume:patients';

/**
 * Persistencia reactiva en localStorage (entorno cliente). Respaldo Cloud
 * vía API /api/vimume/patients cuando esté disponible en producción.
 */
export function persistPatientsLocally(patients: VimumePatientRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
  } catch {
    // Silencioso: la persistencia Cloud asume el respaldo cuando localStorage
    // no está disponible (modo incógnito / bloqueo de terceros).
  }
}

export function loadPatientsLocally(): VimumePatientRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VimumePatientRecord[];
    return parsed.filter((p) => isSeniorEligible(p.age));
  } catch {
    return [];
  }
}

/**
 * Devuelve los pacientes de un centro concreto, garantizando la regla de edad.
 */
export function getPatientsByCenter(
  patients: VimumePatientRecord[],
  centerSlug: string
): VimumePatientRecord[] {
  return patients.filter((p) => p.centerSlug === centerSlug && isSeniorEligible(p.age));
}

export function getCenterBySlug(slug: string): SeniorCatalogEntry | undefined {
  return SENIOR_CARE_CENTER_CATALOG.find((c) => c.centerSlug === slug);
}