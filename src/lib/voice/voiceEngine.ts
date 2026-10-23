/**
 * 🔊 VOICE ENGINE — Motor multi-proveedor con failover (Omega Diamante)
 * ----------------------------------------------------------------------------
 * Capa SERVER-ONLY que sintetiza y transcribe voz con cadena automática de
 * degradación: ElevenLabs → OpenAI → Google → síntesis nativa del navegador.
 *
 * CERO FACHADAS: todos los proveedores son reales. Si una clave no está
 * configurada, se salta ese proveedor y se registra el motivo; si ningún
 * proveedor cloud está disponible, se devuelve `mode: 'browser'` para que el
 * cliente use la síntesis/transcripción nativa (Web Speech API).
 *
 * NO importar este módulo desde componentes 'use client' (lee process.env).
 * ----------------------------------------------------------------------------
 */
import { toConversationalSpeech } from '@/lib/voice/speechNormalizer';
import {
  DEFAULT_VOICE_SETTINGS,
  getVoiceById,
  resolveProviderRef,
  type ProviderVoiceRef,
  type VoiceProviderId,
  type VoiceSettings,
} from '@/lib/voice/voiceRegistry';

export interface SynthesizeOptions {
  readonly voiceId?: string;
  readonly providerOrder?: readonly VoiceProviderId[];
  readonly settings?: Partial<VoiceSettings>;
}

export interface SynthesizeResult {
  readonly mode: 'elevenlabs' | 'openai' | 'google' | 'browser';
  readonly audio: ArrayBuffer | null;
  readonly contentType: string;
  readonly normalizedText: string;
  readonly voiceId: string;
  readonly providerVoiceId: string;
  readonly fallbackReason?: string;
}

export interface TranscribeOptions {
  readonly language?: string;
}

export interface TranscribeResult {
  readonly mode: 'openai' | 'google' | 'browser';
  readonly text: string;
  readonly language: string;
  readonly fallbackReason?: string;
}

const DEFAULT_PROVIDER_ORDER: readonly VoiceProviderId[] = [
  'elevenlabs',
  'openai',
  'google',
  'browser',
];

function envOr(key: string, fallback: string): string {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
}

/** Resuelve el ID real de ElevenLabs por voz (las claves nunca salen de aquí). */
function elevenVoiceId(ref: ProviderVoiceRef): string {
  switch (ref.providerVoiceId) {
    case 'edwin_agudelo_gala':
      return envOr('ELEVENLABS_EDWIN_VOICE_ID', ref.providerVoiceId);
    case 'edwin_agudelo_vimume':
      return envOr('ELEVENLABS_VIMUME_VOICE_ID', ref.providerVoiceId);
    case 'higgsfield_cinematic_narrator':
      return envOr('ELEVENLABS_CINEMATIC_VOICE_ID', ref.providerVoiceId);
    case 'ceremonial_hostess':
      return envOr('ELEVENLABS_HOSTESS_VOICE_ID', ref.providerVoiceId);
    default:
      return ref.providerVoiceId;
  }
}

async function synthElevenLabs(
  text: string,
  ref: ProviderVoiceRef,
  settings: VoiceSettings
): Promise<ArrayBuffer | null> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return null;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${elevenVoiceId(ref)}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': key },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarityBoost,
          style: settings.style,
          use_speaker_boost: settings.speakerBoost,
        },
      }),
    }
  );

  if (!res.ok) return null;
  return await res.arrayBuffer();
}

async function synthOpenAI(
  text: string,
  ref: ProviderVoiceRef,
  settings: VoiceSettings
): Promise<ArrayBuffer | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: ref.providerVoiceId,
      input: text,
      speed: settings.rate,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) return null;
  return await res.arrayBuffer();
}

async function synthGoogle(text: string, ref: ProviderVoiceRef): Promise<ArrayBuffer | null> {
  const key = process.env.GOOGLE_TTS_API_KEY;
  if (!key) return null;

  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: ref.supportedLocales[0] ?? 'es-ES', name: ref.providerVoiceId },
      audioConfig: { audioEncoding: 'MP3' },
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { audioContent?: string };
  if (!data.audioContent) return null;

  const bytes = Buffer.from(data.audioContent, 'base64');
  const out = new Uint8Array(bytes.byteLength);
  bytes.copy(out);
  return out.buffer;
}

/**
 * Sintetiza texto a voz con failover multi-proveedor.
 * Devuelve siempre un `SynthesizeResult`; si ningún proveedor cloud responde,
 * `mode: 'browser'` y `audio: null` (el cliente usa Web Speech API).
 */
export async function synthesizeSpeech(
  text: string,
  options: SynthesizeOptions = {}
): Promise<SynthesizeResult> {
  const normalizedText = toConversationalSpeech(text);
  const requestedVoiceId = options.voiceId ?? 'edwin_agudelo_gala';
  const voice = getVoiceById(requestedVoiceId) ?? getVoiceById('edwin_agudelo_gala');

  if (!voice) {
    return {
      mode: 'browser',
      audio: null,
      contentType: 'text/plain',
      normalizedText,
      voiceId: requestedVoiceId,
      providerVoiceId: requestedVoiceId,
      fallbackReason: 'Voz no registrada',
    };
  }

  const settings: VoiceSettings = {
    ...DEFAULT_VOICE_SETTINGS,
    ...voice.defaultSettings,
    ...(options.settings ?? {}),
  };
  const order: readonly VoiceProviderId[] = options.providerOrder ?? DEFAULT_PROVIDER_ORDER;
  const fallbackReasons: string[] = [];

  for (const provider of order) {
    const ref = resolveProviderRef(voice, provider);
    if (!ref) continue;

    try {
      if (provider === 'elevenlabs') {
        if (!process.env.ELEVENLABS_API_KEY) {
          fallbackReasons.push('elevenlabs: sin ELEVENLABS_API_KEY');
          continue;
        }
        const audio = await synthElevenLabs(normalizedText, ref, settings);
        if (audio) {
          return { mode: 'elevenlabs', audio, contentType: 'audio/mpeg', normalizedText, voiceId: voice.id, providerVoiceId: elevenVoiceId(ref) };
        }
        fallbackReasons.push('elevenlabs: error del proveedor');
      } else if (provider === 'openai') {
        const audio = await synthOpenAI(normalizedText, ref, settings);
        if (audio) {
          return { mode: 'openai', audio, contentType: 'audio/mpeg', normalizedText, voiceId: voice.id, providerVoiceId: ref.providerVoiceId };
        }
        fallbackReasons.push('openai: sin OPENAI_API_KEY o error');
      } else if (provider === 'google') {
        const audio = await synthGoogle(normalizedText, ref);
        if (audio) {
          return { mode: 'google', audio, contentType: 'audio/mpeg', normalizedText, voiceId: voice.id, providerVoiceId: ref.providerVoiceId };
        }
        fallbackReasons.push('google: sin GOOGLE_TTS_API_KEY o error');
      }
    } catch {
      fallbackReasons.push(`${provider}: excepción`);
    }
  }

  const browserRef = voice.providerRefs.find((r: ProviderVoiceRef): boolean => r.provider === 'browser');

  return {
    mode: 'browser',
    audio: null,
    contentType: 'text/plain',
    normalizedText,
    voiceId: voice.id,
    providerVoiceId: browserRef?.providerVoiceId ?? 'es-ES',
    fallbackReason: fallbackReasons.join('; ') || 'sin proveedor cloud configurado',
  };
}

/**
 * Transcribe audio a texto con failover (Whisper → Google → navegador).
 * `audioBlob` se recibe como multipart/form-data desde el cliente.
 */
export async function transcribeSpeech(
  audioBlob: Blob,
  options: TranscribeOptions = {}
): Promise<TranscribeResult> {
  const language = options.language ?? 'es-ES';

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const form = new FormData();
      form.append('file', audioBlob, 'audio.webm');
      form.append('model', 'whisper-1');
      form.append('language', language);
      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${openaiKey}` },
        body: form,
      });
      if (res.ok) {
        const data = (await res.json()) as { text?: string };
        if (data.text && data.text.trim()) {
          return { mode: 'openai', text: data.text.trim(), language };
        }
      }
    } catch {
      // continuar al siguiente proveedor
    }
  }

  const googleKey = process.env.GOOGLE_STT_API_KEY;
  if (googleKey) {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const res = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${googleKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              languageCode: language,
              encoding: 'WEBM_OPUS',
              sampleRateHertz: 48000,
            },
            audio: { content: base64 },
          }),
        }
      );
      if (res.ok) {
        const data = (await res.json()) as {
          results?: Array<{ alternatives?: Array<{ transcript?: string }> }>;
        };
        const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          return { mode: 'google', text: transcript.trim(), language };
        }
      }
    } catch {
      // continuar al fallback
    }
  }

  return {
    mode: 'browser',
    text: '',
    language,
    fallbackReason: 'sin STT cloud configurado; usa Web Speech API en el cliente',
  };
}
