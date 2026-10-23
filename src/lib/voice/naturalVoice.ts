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

/** Habla el texto frase a frase. Resuelve cuando termina o se cancela. */
export async function speakNatural(text: string): Promise<void> {
  if (!isSpeechSupported()) return;
  const synth: SpeechSynthesis = window.speechSynthesis;
  synth.cancel();
  const voice: SpeechSynthesisVoice | null = pickVoice(synth.getVoices());
  const cleanSpeechText = toConversationalSpeech(text);
  const sentences: string[] = splitSentences(cleanSpeechText.slice(0, 2000));

  for (const sentence of sentences) {
    await new Promise<void>((resolve): void => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'es-ES';
      if (voice) utterance.voice = voice;
      const isQuestion: boolean = sentence.endsWith('?');
      utterance.rate = Math.min(1.1, Math.max(0.9, jitter(0.98, 0.04)));
      utterance.pitch = Math.min(1.2, Math.max(0.9, jitter(isQuestion ? 1.08 : 1.0, 0.04)));
      utterance.onend = (): void => resolve();
      utterance.onerror = (): void => resolve();
      synth.speak(utterance);
    });
    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 120 + Math.random() * 120);
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
