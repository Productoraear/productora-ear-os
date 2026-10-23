import { NextResponse } from 'next/server';
import {
  getAllAgentVoiceAssignments,
  setAgentVoiceAssignment,
  getPersistedVoiceCatalog,
} from '@/lib/voice/voicePersistence';
import {
  DEFAULT_AGENT_VOICE_ASSIGNMENTS,
  getVoiceById,
} from '@/lib/voice/voiceRegistry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AgentAssignmentSummary {
  readonly agentId: string;
  readonly voiceId: string;
  readonly voiceName: string;
  readonly artist: string;
  readonly language: string;
  readonly isCustom: boolean;
}

/**
 * 🎛️ GET /api/voices/assignments
 * Retorna las asignaciones de voz efectivas de los 32 agentes de la flota Titan Fleet
 * + agentes sectoriales de dispatch (Wave 30), resolviendo DB y fallback canónico.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const [persistedAssignments, catalog] = await Promise.all([
      getAllAgentVoiceAssignments(),
      getPersistedVoiceCatalog(),
    ]);

    const catalogMap = new Map(catalog.map((v) => [v.id, v]));

    const assignments: Record<string, AgentAssignmentSummary> = {};

    // Iterar sobre todos los agentes conocidos
    const allAgentIds = Object.keys(DEFAULT_AGENT_VOICE_ASSIGNMENTS);

    for (const agentId of allAgentIds) {
      const defaultVoiceId = DEFAULT_AGENT_VOICE_ASSIGNMENTS[agentId as keyof typeof DEFAULT_AGENT_VOICE_ASSIGNMENTS] ?? 'edwin_agudelo_gala';
      const effectiveVoiceId = persistedAssignments[agentId] ?? defaultVoiceId;
      const isCustom = Boolean(persistedAssignments[agentId] && persistedAssignments[agentId] !== defaultVoiceId);

      const voice = catalogMap.get(effectiveVoiceId) ?? getVoiceById(effectiveVoiceId);

      assignments[agentId] = {
        agentId,
        voiceId: effectiveVoiceId,
        voiceName: voice?.profile.name ?? effectiveVoiceId,
        artist: voice?.profile.artist ?? 'Productora EAR',
        language: voice?.profile.language ?? 'es-ES',
        isCustom,
      };
    }

    return NextResponse.json({
      ok: true,
      assignments,
      total: Object.keys(assignments).length,
    });
  } catch (error: unknown) {
    console.error('❌ [VOICE_ASSIGNMENTS_GET_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error al recuperar asignaciones de voz' },
      { status: 500 }
    );
  }
}

interface UpdateAssignmentBody {
  readonly agentId?: unknown;
  readonly voiceProfileId?: unknown;
  readonly customSettings?: Record<string, unknown>;
}

/**
 * 🎛️ PUT /api/voices/assignments
 * Actualiza la asignación de voz para un agente de la flota en PostgreSQL (idempotente).
 */
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as UpdateAssignmentBody;

    const agentId = typeof body?.agentId === 'string' ? body.agentId.trim() : '';
    const voiceProfileId = typeof body?.voiceProfileId === 'string' ? body.voiceProfileId.trim() : '';

    if (!agentId) {
      return NextResponse.json(
        { error: 'Parámetro requerido: agentId' },
        { status: 400 }
      );
    }

    if (!voiceProfileId) {
      return NextResponse.json(
        { error: 'Parámetro requerido: voiceProfileId' },
        { status: 400 }
      );
    }

    await setAgentVoiceAssignment(agentId, voiceProfileId, body.customSettings);

    return NextResponse.json({
      ok: true,
      agentId,
      voiceProfileId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('❌ [VOICE_ASSIGNMENTS_PUT_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error al actualizar asignación de voz del agente' },
      { status: 500 }
    );
  }
}
