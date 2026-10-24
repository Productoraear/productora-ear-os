/**
 * AnalogClickSynth
 * ----------------------------------------------------------------------------
 * Micro-interacción auditiva S-Class: click de botón analógico premium.
 *
 * Sintetiza un transitorio de ~20 ms a 800 Hz con decaimiento orgánico
 * (pitch-drop exponencial + envolvente de ganancia exponencial) usando
 * exclusivamente la Web Audio API. Cero dependencias externas.
 *
 * S-Class sealed: tipado estricto, cero `any`, sin exports muertos.
 * ----------------------------------------------------------------------------
 */

interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

const CLICK_FREQUENCY_HZ = 800;
const CLICK_DURATION_MS = 20;
const CLICK_VOLUME = 0.14;
const SILENCE_FLOOR = 0.0001;
const STOP_TAIL_SECONDS = 0.02;

let sharedAudioContext: AudioContext | null = null;

/**
 * Resuelve (y cachea) el AudioContext disponible. Devuelve `null` en SSR o en
 * navegadores sin Web Audio API. Reanuda el contexto si el navegador lo dejó
 * en estado `suspended` (política de autoplay).
 */
function resolveAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const w = window as WindowWithWebkitAudio;
  const Ctor: typeof AudioContext | undefined =
    typeof AudioContext !== 'undefined' ? AudioContext : w.webkitAudioContext;

  if (!Ctor) {
    return null;
  }

  if (!sharedAudioContext) {
    sharedAudioContext = new Ctor();
  }

  if (sharedAudioContext.state === 'suspended') {
    void sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

export interface AnalogClickOptions {
  /** Frecuencia del portador en Hz. Por defecto 800 Hz. */
  frequency?: number;
  /** Duración del transitorio en milisegundos. Por defecto 20 ms. */
  durationMs?: number;
  /** Ganancia pico (0..1). Por defecto 0.14. */
  volume?: number;
}

/**
 * Emite un click de botón analógico premium. Es idempotente y silencioso en
 * entornos sin soporte: jamás rompe la interacción del usuario.
 */
export function playAnalogClick(options: AnalogClickOptions = {}): void {
  const audioCtx = resolveAudioContext();
  if (!audioCtx) {
    return;
  }

  const frequency = options.frequency ?? CLICK_FREQUENCY_HZ;
  const durationMs = options.durationMs ?? CLICK_DURATION_MS;
  const volume = options.volume ?? CLICK_VOLUME;
  const durationSec = durationMs / 1000;

  try {
    const now = audioCtx.currentTime;

    // Portador: seno con pitch-drop orgánico (800 Hz → 400 Hz).
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(frequency * 0.5, 40),
      now + durationSec
    );

    // Envolvente: decaimiento exponencial (click analógico, sin cola dura).
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(SILENCE_FLOOR, now + durationSec);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start(now);
    oscillator.stop(now + durationSec + STOP_TAIL_SECONDS);
  } catch {
    /* síntesis best-effort */
  }
}
