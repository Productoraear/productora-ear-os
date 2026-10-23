import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getPersistedVoiceCatalog,
  getAllAgentVoiceAssignments,
} from '@/lib/voice/voicePersistence';
import type { RegisteredVoice } from '@/lib/voice/voiceRegistry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface AdminVoice {
  readonly id: string;
  readonly name: string;
  readonly artist: string;
  readonly language: string;
  readonly gender: string;
  readonly tone: string;
  readonly tags: readonly string[];
  readonly sampleAudio?: string;
  readonly description: string;
  readonly isMasterProfile: boolean;
  readonly contexts: readonly string[];
  readonly assignedAgentsCount: number;
  readonly providers: readonly { readonly provider: string; readonly available: boolean }[];
}

/** Reporta disponibilidad de cada proveedor SIN exponer claves (solo presencia). */
function isProviderAvailable(provider: string): boolean {
  switch (provider) {
    case 'elevenlabs':
      return Boolean(process.env.ELEVENLABS_API_KEY);
    case 'openai':
      return Boolean(process.env.OPENAI_API_KEY);
    case 'google':
      return Boolean(process.env.GOOGLE_TTS_API_KEY);
    case 'local_voicestudio':
      return true; // daemon local, salud comprobada aparte
    case 'browser':
      return true;
    default:
      return false;
  }
}

/**
 * 🎛️ GET /api/voices — Galería de voces para el Admin Voice Command Center.
 * Devuelve metadatos públicos de cada voz, el estado de disponibilidad de
 * proveedores y el recuento de agentes asignados. Nunca expone claves API ni IDs secretos.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const [catalog, assignments] = await Promise.all([
      getPersistedVoiceCatalog(),
      getAllAgentVoiceAssignments(),
    ]);

    // Calcular cuántos agentes usan cada voz
    const countMap: Record<string, number> = {};
    for (const voiceId of Object.values(assignments)) {
      countMap[voiceId] = (countMap[voiceId] ?? 0) + 1;
    }

    const voices: readonly AdminVoice[] = catalog.map(
      (v: RegisteredVoice): AdminVoice => ({
        id: v.id,
        name: v.profile.name,
        artist: v.profile.artist,
        language: v.profile.language,
        gender: v.profile.gender,
        tone: v.profile.tone,
        tags: v.profile.tags,
        sampleAudio: v.profile.sampleAudio,
        description: v.profile.description,
        isMasterProfile: Boolean(v.profile.isMasterProfile),
        contexts: v.contexts,
        assignedAgentsCount: countMap[v.id] ?? 0,
        providers: v.providerRefs.map((r) => ({
          provider: r.provider,
          available: isProviderAvailable(r.provider),
        })),
      })
    );

    return NextResponse.json({ ok: true, voices, total: voices.length });
  } catch (error: unknown) {
    console.error('❌ [VOICES_GET_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error al recuperar galería de voces' },
      { status: 500 }
    );
  }
}

interface CreateVoiceProfileBody {
  readonly id?: unknown;
  readonly name?: unknown;
  readonly artist?: unknown;
  readonly language?: unknown;
  readonly gender?: unknown;
  readonly tone?: unknown;
  readonly tags?: unknown;
  readonly sampleAudio?: unknown;
  readonly description?: unknown;
  readonly isMasterProfile?: unknown;
  readonly elevenVoiceId?: unknown;
  readonly openAiVoice?: unknown;
  readonly googleVoice?: unknown;
  readonly speed?: unknown;
  readonly pitch?: unknown;
  readonly stability?: unknown;
  readonly similarityBoost?: unknown;
}

/**
 * 🎛️ POST /api/voices — Crea o actualiza un perfil de voz personalizado en DB.
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as CreateVoiceProfileBody;

    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const artist = typeof body?.artist === 'string' ? body.artist.trim() : '';
    const tone = typeof body?.tone === 'string' ? body.tone.trim() : '';

    if (!id || !name || !artist || !tone) {
      return NextResponse.json(
        { error: 'Campos requeridos: id, name, artist, tone' },
        { status: 400 }
      );
    }

    const language = typeof body.language === 'string' ? body.language : 'es-ES';
    const gender = typeof body.gender === 'string' ? body.gender : 'male';
    const description = typeof body.description === 'string' ? body.description : '';
    const tags = Array.isArray(body.tags) ? body.tags.filter((t): t is string => typeof t === 'string') : [];
    const isMasterProfile = Boolean(body.isMasterProfile);
    const sampleAudio = typeof body.sampleAudio === 'string' ? body.sampleAudio : undefined;

    const elevenVoiceId = typeof body.elevenVoiceId === 'string' ? body.elevenVoiceId : undefined;
    const openAiVoice = typeof body.openAiVoice === 'string' ? body.openAiVoice : undefined;
    const googleVoice = typeof body.googleVoice === 'string' ? body.googleVoice : undefined;

    const speed = typeof body.speed === 'number' ? body.speed : 1.0;
    const pitch = typeof body.pitch === 'number' ? body.pitch : 1.0;
    const stability = typeof body.stability === 'number' ? body.stability : 0.65;
    const similarityBoost = typeof body.similarityBoost === 'number' ? body.similarityBoost : 0.85;

    const created = await prisma.voiceProfile.upsert({
      where: { id },
      create: {
        id,
        name,
        artist,
        language,
        gender,
        tone,
        tags,
        sampleAudio,
        description,
        isMasterProfile,
        elevenVoiceId,
        openAiVoice,
        googleVoice,
        speed,
        pitch,
        stability,
        similarityBoost,
      },
      update: {
        name,
        artist,
        language,
        gender,
        tone,
        tags,
        sampleAudio,
        description,
        isMasterProfile,
        elevenVoiceId,
        openAiVoice,
        googleVoice,
        speed,
        pitch,
        stability,
        similarityBoost,
      },
    });

    return NextResponse.json({ ok: true, voice: created }, { status: 201 });
  } catch (error: unknown) {
    console.error('❌ [VOICES_POST_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error al registrar perfil de voz' },
      { status: 500 }
    );
  }
}
