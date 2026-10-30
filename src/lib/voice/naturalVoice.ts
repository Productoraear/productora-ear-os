/**
 * Voz natural (cliente). Usa Web Speech API del navegador, sin dependencias ni claves.
 * Para sonar menos robótica: elige la mejor voz es-ES disponible, trocea por frases,
 * varía ligeramente ritmo y tono y respeta pausas de puntuación.
 * Limitación: la calidad depende de las voces instaladas en el dispositivo del usuario.
 */

import { toConversationalSpeech } from './speechNormalizer';

export { toConversationalSpeech };

const PREFERRED_VOICE_HINTS: readonly string[] = ['natural', 'neural', 'online', 'google', 'microsoft', 'monica', 'paulina'];

function pickVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const spanish: SpeechSynthesisVoice[] = voices.filter((v: SpeechSynthesisVoice): boolean => v.lang.toLowerCase().startsWith('es'));
  if (spanish.length === 0) return null;
  const score = (v: SpeechSynthesisVoice): number => {
    const name: string = v.name.toLowerCase();
    let points: number = v.lang.toLowerCase() === 'es-es' ? 2 : 0;
    PREFERRED_VOICE_HINTS.forEach((hint: string, index: number): void => {
      if (name.includes(hint)) points += 10 - index;
    });
    return points;
  };
  return [...spanish].sort((a: SpeechSynthesisVoice, b: SpeechSynthesisVoice): number => score(b) - score(a))[0];
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?¿¡;:])\s+/)
    .map((s: string): string => s.trim())
    .filter((s: string): boolean => s.length > 0);
}

function jitter(base: number, spread: number): number {
  return base + (Math.random() * 2 - 1) * spread;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}

/** Presupuesto máximo de arranque de una frase: si el motor no arranca, se suelta. */
const UTTERANCE_START_GUARD_MS = 2500;
/** Suelo del techo por frase: un `onend` perdido JAMÁS puede colgar la locución. */
const UTTERANCE_MIN_BUDGET_MS = 6000;
/** Margen por carácter para frases largas (~1,3× la velocidad real de locución). */
const UTTERANCE_PER_CHAR_MS = 110;
/** Latido real: reanuda el motor móvil cuando el navegador lo suspende. */
const SPEECH_HEARTBEAT_MS = 600;
/** Ventana de espera para que Safari/WebKit móvil pueble `getVoices()`. */
const VOICES_WAIT_MS = 1200;

/**
 * Desbloquea el motor de voz DENTRO del gesto del usuario.
 * iOS Safari y Chrome Android ignoran `speak()` si la primera llamada llega fuera
 * de una activación de usuario (p. ej. después de un `await fetch`). Invocar en el `onClick`.
 */
export function primeSpeechSynthesis(): void {
  if (!isSpeechSupported()) return;
  const synth: SpeechSynthesis = window.speechSynthesis;
  try {
    const primer = new SpeechSynthesisUtterance(' ');
    primer.volume = 0;
    primer.lang = 'es-ES';
    synth.speak(primer);
  } catch {
    /* Entornos sin motor real: no es bloqueante, `speakNatural` sigue su curso. */
  }
  if (synth.paused) synth.resume();
}

/** Espera a que el navegador publique las voces (en iOS llegan tarde o nunca). */
async function waitForVoices(synth: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const immediate: SpeechSynthesisVoice[] = synth.getVoices();
  if (immediate.length > 0) return immediate;

  await new Promise<void>((resolve): void => {
    let done = false;
    let polling: ReturnType<typeof setInterval> | null = null;
    let deadline: ReturnType<typeof setTimeout> | null = null;

    function finish(): void {
      if (done) return;
      done = true;
      if (polling) clearInterval(polling);
      if (deadline) clearTimeout(deadline);
      if (synth.onvoiceschanged === onVoices) synth.onvoiceschanged = null;
      resolve();
    }
    function onVoices(): void {
      finish();
    }

    synth.onvoiceschanged = onVoices;
    polling = setInterval((): void => {
      if (synth.getVoices().length > 0) finish();
    }, 150);
    deadline = setTimeout(finish, VOICES_WAIT_MS);
  });

  return synth.getVoices();
}

/**
 * Locuta una frase con tres guardias: arranque, latido y techo duro.
 * Sin ellas, un `onend` que no llega (iOS deja el motor en pausa) cuelga la promesa
 * para siempre y el asistente se queda mudo sin recuperarse.
 */
function speakSentence(
  synth: SpeechSynthesis,
  sentence: string,
  voice: SpeechSynthesisVoice | null
): Promise<void> {
  return new Promise<void>((resolve): void => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'es-ES';
    if (voice) utterance.voice = voice;
    const isQuestion: boolean = sentence.endsWith('?');
    utterance.rate = Math.min(1.1, Math.max(0.9, jitter(0.98, 0.04)));
    utterance.pitch = Math.min(1.2, Math.max(0.9, jitter(isQuestion ? 1.08 : 1.0, 0.04)));

    let settled = false;
    let started = false;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    let startGuard: ReturnType<typeof setTimeout> | null = null;
    let hardCap: ReturnType<typeof setTimeout> | null = null;

    const settle = (): void => {
      if (settled) return;
      settled = true;
      if (heartbeat) clearInterval(heartbeat);
      if (startGuard) clearTimeout(startGuard);
      if (hardCap) clearTimeout(hardCap);
      resolve();
    };

    utterance.onstart = (): void => {
      started = true;
      if (startGuard) {
        clearTimeout(startGuard);
        startGuard = null;
      }
    };
    utterance.onend = (): void => settle();
    utterance.onerror = (): void => settle();

    synth.speak(utterance);

    heartbeat = setInterval((): void => {
      if (synth.paused) synth.resume();
    }, SPEECH_HEARTBEAT_MS);

    startGuard = setTimeout((): void => {
      if (settled || started) return;
      synth.cancel();
      settle();
    }, UTTERANCE_START_GUARD_MS);

    hardCap = setTimeout((): void => {
      // Si el motor sigue hablando, NO truncamos: se suelta el control y se deja
      // terminar. El techo protege contra el cuelgue, nunca contra la locución.
      if (!synth.speaking) synth.cancel();
      settle();
    }, Math.max(UTTERANCE_MIN_BUDGET_MS, sentence.length * UTTERANCE_PER_CHAR_MS));
  });
}

/** Habla el texto frase a frase con soporte blindado para móviles (iOS/Android). */
export async function speakNatural(text: string): Promise<void> {
  if (!isSpeechSupported()) return;
  const synth: SpeechSynthesis = window.speechSynthesis;
  synth.cancel();
  if (synth.paused) synth.resume();

  const voices: SpeechSynthesisVoice[] = await waitForVoices(synth);
  const voice: SpeechSynthesisVoice | null = pickVoice(voices);
  const cleanSpeechText = toConversationalSpeech(text);
  const sentences: string[] = splitSentences(cleanSpeechText.slice(0, 2000));

  for (const sentence of sentences) {
    await speakSentence(synth, sentence, voice);
    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 80 + Math.random() * 80);
    });
  }
}

/* ── Reconocimiento de voz (mínimo tipado propio; no está en lib.dom) ── */

interface RecognitionAlternative {
  readonly transcript: string;
}
interface RecognitionResult {
  readonly 0: RecognitionAlternative;
  readonly isFinal: boolean;
}
interface RecognitionEvent {
  readonly results: ArrayLike<RecognitionResult>;
}
interface RecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => RecognitionInstance;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isListeningSupported(): boolean {
  return getRecognitionCtor() !== null;
}

/** Escucha una frase. Devuelve función para detener. */
export function listenOnce(onFinal: (text: string) => void, onEnd: () => void): () => void {
  const Ctor: RecognitionCtor | null = getRecognitionCtor();
  if (!Ctor) {
    onEnd();
    return (): void => undefined;
  }
  const recognition: RecognitionInstance = new Ctor();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onresult = (e: RecognitionEvent): void => {
    const last: RecognitionResult = e.results[e.results.length - 1];
    if (last.isFinal) onFinal(last[0].transcript.trim());
  };
  recognition.onerror = (): void => onEnd();
  recognition.onend = (): void => onEnd();
  recognition.start();
  return (): void => recognition.stop();
}
