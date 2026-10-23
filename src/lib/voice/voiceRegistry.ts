/**
 * 🎛️ VOICE REGISTRY — SSOT DE VOCES (Omega Diamante Voice Command Center)
 * ----------------------------------------------------------------------------
 * Registro canónico de voces de Productora EAR. Cada voz asocia su perfil
 * artístico con los proveedores TTS/STT disponibles y los contextos de uso
 * (gala, VIMUME, doblaje, ceremonia, asistente, comercial).
 *
 * PRINCIPIOS (Doctrina del Dato Verificado — CERO FACHADAS):
 *  - CERO secretos: aquí NO hay claves API. Los `providerVoiceId` son
 *    identificadores estables; las claves se resuelven SOLO en el motor
 *    (src/lib/voice/voiceEngine.ts, server-only).
 *  - CLIENTE SEGURO: este módulo es puro y puede importarse desde componentes
 *    'use client' sin exponer variables de entorno.
 *  - BEBE DEL SSOT artístico ya homologado (EAR_VOICE_PROFILES).
 * ----------------------------------------------------------------------------
 */
import { EAR_VOICE_PROFILES, type VoiceProfile } from '@/lib/audio/voiceStudioEngine';
import type { AgentId } from '@/lib/agents/agentBus';

export type VoiceProviderId =
  | 'elevenlabs'
  | 'openai'
  | 'google'
  | 'local_voicestudio'
  | 'browser';

export type VoiceContext =
  | 'gala'
  | 'vimume'
  | 'doblaje'
  | 'ceremonia'
  | 'asistente'
  | 'comercial';

export interface ProviderVoiceRef {
  readonly provider: VoiceProviderId;
  readonly providerVoiceId: string;
  readonly supportedLocales: readonly string[];
}

export interface VoiceSettings {
  readonly stability: number;
  readonly similarityBoost: number;
  readonly style: number;
  readonly speakerBoost: boolean;
  readonly rate: number;
  readonly pitch: number;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  stability: 0.65,
  similarityBoost: 0.85,
  style: 0.2,
  speakerBoost: true,
  rate: 1.0,
  pitch: 1.0,
};

export interface RegisteredVoice {
  readonly id: string;
  readonly profile: VoiceProfile;
  readonly providerRefs: readonly ProviderVoiceRef[];
  readonly contexts: readonly VoiceContext[];
  readonly defaultSettings: VoiceSettings;
}

interface VoiceBinding {
  readonly voiceId: string;
  readonly contexts: readonly VoiceContext[];
  readonly providers: readonly ProviderVoiceRef[];
  readonly settings?: Partial<VoiceSettings>;
}

/**
 * Vinculación voz ↔ proveedores. Los `providerVoiceId` son identificadores
 * estables por proveedor (nunca claves); el motor resuelve los IDs reales
 * desde variables de entorno por voz.
 */
const VOICE_BINDINGS: readonly VoiceBinding[] = [
  {
    voiceId: 'edwin_agudelo_gala',
    contexts: ['gala', 'asistente', 'comercial', 'ceremonia'],
    providers: [
      { provider: 'elevenlabs', providerVoiceId: 'edwin_agudelo_gala', supportedLocales: ['es-ES'] },
      { provider: 'openai', providerVoiceId: 'onyx', supportedLocales: ['es-ES'] },
      { provider: 'google', providerVoiceId: 'es-ES-Standard-B', supportedLocales: ['es-ES'] },
      { provider: 'local_voicestudio', providerVoiceId: 'edwin_agudelo_gala', supportedLocales: ['es-ES'] },
      { provider: 'browser', providerVoiceId: 'es-ES', supportedLocales: ['es-ES'] },
    ],
  },
  {
    voiceId: 'edwin_agudelo_vimume',
    contexts: ['vimume'],
    providers: [
      { provider: 'elevenlabs', providerVoiceId: 'edwin_agudelo_vimume', supportedLocales: ['es-ES'] },
      { provider: 'openai', providerVoiceId: 'ash', supportedLocales: ['es-ES'] },
      { provider: 'google', providerVoiceId: 'es-ES-Standard-C', supportedLocales: ['es-ES'] },
      { provider: 'local_voicestudio', providerVoiceId: 'edwin_agudelo_vimume', supportedLocales: ['es-ES'] },
      { provider: 'browser', providerVoiceId: 'es-ES', supportedLocales: ['es-ES'] },
    ],
  },
  {
    voiceId: 'higgsfield_cinematic_narrator',
    contexts: ['doblaje', 'comercial'],
    providers: [
      { provider: 'elevenlabs', providerVoiceId: 'higgsfield_cinematic_narrator', supportedLocales: ['es-ES', 'en-US'] },
      { provider: 'openai', providerVoiceId: 'onyx', supportedLocales: ['es-ES', 'en-US'] },
      { provider: 'google', providerVoiceId: 'es-ES-Standard-C', supportedLocales: ['es-ES'] },
      { provider: 'local_voicestudio', providerVoiceId: 'higgsfield_cinematic_narrator', supportedLocales: ['es-ES', 'en-US'] },
      { provider: 'browser', providerVoiceId: 'es-ES', supportedLocales: ['es-ES'] },
    ],
  },
  {
    voiceId: 'ceremonial_hostess',
    contexts: ['ceremonia', 'asistente'],
    providers: [
      { provider: 'elevenlabs', providerVoiceId: 'ceremonial_hostess', supportedLocales: ['es-ES', 'en-GB', 'fr-FR'] },
      { provider: 'openai', providerVoiceId: 'nova', supportedLocales: ['es-ES', 'en-GB', 'fr-FR'] },
      { provider: 'google', providerVoiceId: 'es-ES-Standard-A', supportedLocales: ['es-ES'] },
      { provider: 'local_voicestudio', providerVoiceId: 'ceremonial_hostess', supportedLocales: ['es-ES', 'en-GB', 'fr-FR'] },
      { provider: 'browser', providerVoiceId: 'es-ES', supportedLocales: ['es-ES'] },
    ],
  },
];

/** Voz por defecto por agente de la flota (división comercial ↔ contexto). */
const DEFAULT_AGENT_VOICE_ASSIGNMENTS: Partial<Record<AgentId, string>> = {
  'omni-supervisor-daemon': 'edwin_agudelo_gala',
  'voice-concierge': 'ceremonial_hostess',
  'sales-closer': 'edwin_agudelo_gala',
  'lead-intake-dispatcher': 'ceremonial_hostess',
  'vip-concierge-escalation': 'ceremonial_hostess',
  'retention-reactivator': 'edwin_agudelo_gala',
  'finca-negotiator': 'edwin_agudelo_gala',
  'cross-sell-orchestrator': 'edwin_agudelo_gala',
  'vimume-protocol-sentinel': 'edwin_agudelo_vimume',
  'clinical-report-generator': 'edwin_agudelo_vimume',
  'dental-clinic-coordinator': 'ceremonial_hostess',
  'hospitality-table-agent': 'ceremonial_hostess',
  'corporate-experience-agent': 'ceremonial_hostess',
  'supervisor': 'edwin_agudelo_gala',
};

function buildRegistry(): readonly RegisteredVoice[] {
  const result: RegisteredVoice[] = [];

  for (const binding of VOICE_BINDINGS) {
    const profile: VoiceProfile | undefined = EAR_VOICE_PROFILES.find(
      (p: VoiceProfile): boolean => p.id === binding.voiceId
    );
    if (!profile) continue;

    result.push({
      id: binding.voiceId,
      profile,
      providerRefs: binding.providers,
      contexts: binding.contexts,
      defaultSettings: { ...DEFAULT_VOICE_SETTINGS, ...(binding.settings ?? {}) },
    });
  }

  return result;
}

/** Catálogo completo registrado (seguro para cliente y admin). */
export const REGISTERED_VOICES: readonly RegisteredVoice[] = buildRegistry();

/** Devuelve una voz registrada por su id. */
export function getVoiceById(id: string): RegisteredVoice | undefined {
  return REGISTERED_VOICES.find((v: RegisteredVoice): boolean => v.id === id);
}

/** Devuelve el catálogo completo de voces registradas. */
export function getVoiceCatalog(): readonly RegisteredVoice[] {
  return REGISTERED_VOICES;
}

/** Voz por defecto para un contexto de uso. */
export function getDefaultVoiceForContext(context: VoiceContext): RegisteredVoice | undefined {
  return (
    REGISTERED_VOICES.find((v: RegisteredVoice): boolean => v.contexts.includes(context)) ??
    REGISTERED_VOICES.find((v: RegisteredVoice): boolean => Boolean(v.profile.isMasterProfile)) ??
    REGISTERED_VOICES[0]
  );
}

/** Resuelve la voz asignada a un agente de la flota (fallback: gala de Edwin). */
export function getVoiceForAgent(agent: AgentId | string): string {
  return (
    DEFAULT_AGENT_VOICE_ASSIGNMENTS[agent as AgentId] ?? 'edwin_agudelo_gala'
  );
}

/** Resuelve la referencia de proveedor para una voz (con preferencia de proveedor). */
export function resolveProviderRef(
  voice: RegisteredVoice,
  preferred: VoiceProviderId
): ProviderVoiceRef | undefined {
  return (
    voice.providerRefs.find((r: ProviderVoiceRef): boolean => r.provider === preferred) ??
    voice.providerRefs[0]
  );
}

/** Proveedores disponibles en la cadena de failover. */
export function listAvailableProviders(): readonly VoiceProviderId[] {
  return ['elevenlabs', 'openai', 'google', 'local_voicestudio', 'browser'];
}

