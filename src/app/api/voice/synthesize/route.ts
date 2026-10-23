import { NextResponse } from 'next/server';
import { toConversationalSpeech } from '@/lib/voice/speechNormalizer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface SynthesizeRequestBody {
  text: string;
  voiceId?: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as SynthesizeRequestBody;
    const { text, voiceId } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    // 1. Normalización fonética S-Class obligatoria (cero decimales aberrantes)
    const normalizedText = toConversationalSpeech(text);

    const elevenKey = process.env.ELEVENLABS_API_KEY;
    const targetVoiceId = voiceId || process.env.ELEVENLABS_EDWIN_VOICE_ID;

    // Si no hay clave de ElevenLabs o Voice ID configurado, delegar en síntesis nativa del navegador
    if (!elevenKey || !targetVoiceId) {
      return NextResponse.json({
        mode: 'browser',
        normalizedText,
        message: 'Utilizando síntesis local del navegador con normalización fonética S-Class.',
      });
    }

    // 2. Llamada streaming a ElevenLabs con la voz clonada de Edwin
    const elevenRes = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenKey,
        },
        body: JSON.stringify({
          text: normalizedText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.65,
            similarity_boost: 0.85,
            style: 0.2,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!elevenRes.ok) {
      const errText = await elevenRes.text();
      console.warn('⚠️ [ELEVENLABS_TTS_ERROR]:', errText);
      return NextResponse.json({
        mode: 'browser',
        normalizedText,
        fallbackReason: 'ElevenLabs API error, falling back to browser TTS',
      });
    }

    // Devolver el audio binario directamente con streaming
    const audioBuffer = await elevenRes.arrayBuffer();
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: unknown) {
    console.error('❌ [VOICE_SYNTHESIS_ERROR]:', error);
    return NextResponse.json(
      { error: 'Error interno en la síntesis de voz' },
      { status: 500 }
    );
  }
}
