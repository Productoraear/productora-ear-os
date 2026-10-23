/**
 * 🎛️ VOICE PERSISTENCE — Capa híbrida resiliente de persistencia vocal.
 * ----------------------------------------------------------------------------
 * Une la persistencia PostgreSQL (Prisma: VoiceProfile + AgentVoiceAssignment)
 * con el registro canónico en memoria (voiceRegistry.ts). Si la base de datos
 * no está disponible, TODAS las llamadas degradan transparentemente a los
 * defaults en memoria, garantizando que la flota Titan Fleet SIEMPRE tenga una
 * voz operativa (CERO fachadas, CERO cortes de servicio vocal).
 * ----------------------------------------------------------------------------
 * SERVER-ONLY: este módulo importa PrismaClient y NO debe ejecutarse en cliente.
 * ----------------------------------------------------------------------------
 */
import { prisma } from '@/lib/prisma';
import type { Prisma, VoiceProfile as PrismaVoiceProfile } from '@prisma/client';
import type { VoiceProfile } from '@/lib/audio/voiceStudioEngine';
import {
  DEFAULT_AGENT_VOICE_ASSIGNMENTS,
  DEFAULT_VOICE_SETTINGS,
  getVoiceCatalog,
  getVoiceForAgent,
} from './voiceRegistry';
import type {
  ProviderVoiceRef,
  RegisteredVoice,
  VoiceContext,
  VoiceSettings,
} from './voiceRegistry';

/** Convierte el `gender` persistido (String) al tipo estricto del registro. */
function toGender(value: string): VoiceProfile['gender'] {
  if (value === 'female') return 'female';
  if (value === 'neutral') return 'neutral';
  return 'male';
}

/** Mapa en memoria completo (fallback) para asignaciones agente → voz. */
function buildMemoryAssignments(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [agentId, voiceId] of Object.entries(DEFAULT_AGENT_VOICE_ASSIGNMENTS)) {
    if (typeof voiceId === 'string') result[agentId] = voiceId;
  }
  return result;
}

/** Reconstruye un RegisteredVoice a partir de una fila persistida VoiceProfile. */
function mapPersistedVoice(row: PrismaVoiceProfile): RegisteredVoice {
  const profile: VoiceProfile = {
    id: row.id,
    name: row.name,
    artist: row.artist,
    language: row.language,
    gender: toGender(row.gender),
    tone: row.tone,
    tags: [...row.tags],
    ...(row.sampleAudio ? { sampleAudio: row.sampleAudio } : {}),
    description: row.description,
    isMasterProfile: row.isMasterProfile,
  };

  const providerRefs: ProviderVoiceRef[] = [];
  if (row.elevenVoiceId) {
    providerRefs.push({
      provider: 'elevenlabs',
      providerVoiceId: row.elevenVoiceId,
      supportedLocales: [row.language],
    });
  }
  if (row.openAiVoice) {
    providerRefs.push({
      provider: 'openai',
      providerVoiceId: row.openAiVoice,
      supportedLocales: [row.language],
    });
  }
  if (row.googleVoice) {
    providerRefs.push({
      provider: 'google',
      providerVoiceId: row.googleVoice,
      supportedLocales: [row.language],
    });
  }
  if (providerRefs.length === 0) {
    providerRefs.push({ provider: 'browser', providerVoiceId: row.language, supportedLocales: [row.language] });
  }

  const contexts: VoiceContext[] = row.isMasterProfile
    ? ['gala', 'asistente', 'comercial', 'ceremonia']
    : ['asistente'];

  const defaultSettings: VoiceSettings = {
    ...DEFAULT_VOICE_SETTINGS,
    stability: row.stability,
    similarityBoost: row.similarityBoost,
    rate: row.speed,
    pitch: row.pitch,
  };

  return { id: row.id, profile, providerRefs, contexts, defaultSettings };
}

/** Resuelve la voz efectiva de un agente de la flota (DB → memoria). */
export async function getEffectiveVoiceForAgent(agentId: string): Promise<string> {
  try {
    const assignment = await prisma.agentVoiceAssignment.findUnique({
      where: { agentId },
    });
    if (assignment?.voiceProfileId) return assignment.voiceProfileId;
  } catch {
    // DB no disponible → degrada transparentemente a memoria.
  }
  return getVoiceForAgent(agentId);
}

/** Devuelve todas las asignaciones agente → voz (DB → memoria). */
export async function getAllAgentVoiceAssignments(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.agentVoiceAssignment.findMany();
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.agentId] = row.voiceProfileId;
    }
    return result;
  } catch {
    return buildMemoryAssignments();
  }
}

/** Persiste (upsert idempotente) la asignación de voz de un agente. */
export async function setAgentVoiceAssignment(
  agentId: string,
  voiceProfileId: string,
  customSettings?: Record<string, unknown>,
): Promise<void> {
  const settings: Prisma.InputJsonValue | undefined =
    customSettings === undefined
      ? undefined
      : (customSettings as unknown as Prisma.InputJsonValue);

  try {
    await prisma.agentVoiceAssignment.upsert({
      where: { agentId },
      create: {
        agentId,
        voiceProfileId,
        ...(settings === undefined ? {} : { customSettings: settings }),
      },
      update: {
        voiceProfileId,
        ...(settings === undefined ? {} : { customSettings: settings }),
      },
    });
  } catch {
    // DB no disponible → la asignación no persiste pero no rompe el servicio vocal.
  }
}

/** Catálogo vocal persistido (DB → memoria). */
export async function getPersistedVoiceCatalog(): Promise<readonly RegisteredVoice[]> {
  try {
    const rows = await prisma.voiceProfile.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
    if (rows.length === 0) return getVoiceCatalog();
    return rows.map((row: PrismaVoiceProfile): RegisteredVoice => mapPersistedVoice(row));
  } catch {
    return getVoiceCatalog();
  }
}
