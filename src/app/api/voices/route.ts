import { NextResponse } from 'next/server';
import { getVoiceCatalog, type RegisteredVoice } from '@/lib/voice/voiceRegistry';

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
 * Devuelve metadatos públicos de cada voz y el estado de disponibilidad de
 * proveedores. Nunca expone claves API ni IDs secretos.
 */
export async function GET(): Promise<NextResponse> {
  const voices: readonly AdminVoice[] = getVoiceCatalog().map(
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
      providers: v.providerRefs.map((r) => ({
        provider: r.provider,
        available: isProviderAvailable(r.provider),
      })),
    })
  );

  return NextResponse.json({ voices, total: voices.length });
}
