import { NextResponse } from 'next/server';
import { synthesizeSpeech, type SynthesizeOptions } from '@/lib/voice/voiceEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SynthesizeRequestBody {
  text: string;
  voiceId?: string;
  settings?: SynthesizeOptions['settings'];
}

/**
 * 🔊 POST /api/voice/synthesize — Síntesis de voz S-Class.
 * Acepta `voiceId` (de la galería del Voice Registry) y `settings` opcionales.
 * Delega en el motor multi-proveedor con failover (ElevenLabs → OpenAI →
 * Google → navegador). Respuesta binaria (audio/mpeg) si hay proveedor cloud;
 * JSON `{ mode: 'browser' }` si el cliente debe usar Web Speech API.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as SynthesizeRequestBody;
    const text: string = typeof body?.text === 'string' ? body.text : '';

    if (!text.trim()) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    const result = await synthesizeSpeech(text, {
      voiceId: body.voiceId,
      settings: body.settings,
    });

    if (result.mode === 'browser' || result.audio === null) {
      return NextResponse.json({
        mode: 'browser',
        normalizedText: result.normalizedText,
        voiceId: result.voiceId,
        fallbackReason: result.fallbackReason,
      });
    }

    return new Response(result.audio, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    console.error('❌ [VOICE_SYNTHESIS_ERROR]:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: 'Error interno en la síntesis de voz' },
      { status: 500 }
    );
  }
}
