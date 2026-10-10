/**
 * AuraAudioSynth
 * ----------------------------------------------------------------------------
 * Synthesizer de audio ambiental basado en Web Audio API.
 * Genera un tono portador (136.1 Hz — "OM" tuning) modulado por un LFO
 * de onda cuadrada a 40 Hz aplicado sobre el detune del oscilador.
 *
 * S-Class sealed: tipado estricto, cero `any`, sin exports muertos.
 * ----------------------------------------------------------------------------
 */

/**
 * Extensión tipada del constructor de AudioContext para soportar
 * el prefijo `webkit` en navegadores legacy (Safari antiguo).
 */
interface WindowWithWebkitAudio extends Window {
  webkitAudioContext?: typeof AudioContext;
}

/**
 * Tipo de retorno del helper de resolución de AudioContext.
 */
type AudioContextConstructor = typeof AudioContext;

/**
 * Constantes de síntesis (inmutables, selladas).
 */
const CARRIER_FREQUENCY_HZ = 136.1;
const LFO_FREQUENCY_HZ = 40;
const FADE_DURATION_SECONDS = 1.5;
const SILENCE_THRESHOLD = 0.0001;

/**
 * Resuelve el constructor de AudioContext disponible en el entorno actual.
 * Lanza un error explícito si no existe soporte.
 */
function resolveAudioContextConstructor(): AudioContextConstructor {
  if (typeof window === 'undefined') {
    throw new Error(
      'AuraAudioSynth: AudioContext no está disponible en un entorno sin `window` (SSR).'
    );
  }

  const w = window as WindowWithWebkitAudio;
  const Ctor: AudioContextConstructor | undefined =
    typeof AudioContext !== 'undefined' ? AudioContext : w.webkitAudioContext;

  if (!Ctor) {
    throw new Error(
      'AuraAudioSynth: este navegador no soporta la Web Audio API.'
    );
  }

  return Ctor;
}

/**
 * Sintetizador ambiental Aura.
 *
 * Ciclo de vida:
 *   - `constructor()` inicializa el grafo de audio en silencio.
 *   - `toggle()` alterna entre fade-in y fade-out.
 *   - `dispose()` libera recursos y cierra el AudioContext.
 */
class AuraAudioSynth {
  private readonly audioCtx: AudioContext;
  private readonly oscillator: OscillatorNode;
  private readonly lfo: OscillatorNode;
  private readonly gainNode: GainNode;
  private isActive: boolean;
  private disposed: boolean;

  constructor() {
    const AudioCtxCtor = resolveAudioContextConstructor();

    this.audioCtx = new AudioCtxCtor();
    this.oscillator = this.audioCtx.createOscillator();
    this.lfo = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();
    this.isActive = false;
    this.disposed = false;

    // Configuración del oscilador portador.
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(
      CARRIER_FREQUENCY_HZ,
      this.audioCtx.currentTime
    );

    // Configuración del LFO que modula el detune del portador.
    this.lfo.type = 'square';
    this.lfo.frequency.setValueAtTime(
      LFO_FREQUENCY_HZ,
      this.audioCtx.currentTime
    );
    this.lfo.connect(this.oscillator.detune);

    // Conexión del grafo: oscillator -> gain -> destination.
    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    // Arranque de osciladores.
    this.oscillator.start();
    this.lfo.start();

    // Ganancia inicial en silencio.
    this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
  }

  /**
   * Alterna el estado del sintetizador entre activo (fade-in) y silencioso
   * (fade-out). Es idempotente respecto al estado interno.
   */
  public toggle(): void {
    if (this.disposed) {
      return;
    }

    const now = this.audioCtx.currentTime;

    if (!this.isActive) {
      // Fade-in.
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(
        Math.max(this.gainNode.gain.value, SILENCE_THRESHOLD),
        now
      );
      this.gainNode.gain.linearRampToValueAtTime(1, now + FADE_DURATION_SECONDS);
      this.isActive = true;
      return;
    }

    // Fade-out.
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + FADE_DURATION_SECONDS);
    this.isActive = false;
  }

  /**
   * Libera los recursos del sintetizador: detiene osciladores y cierra
   * el AudioContext. Tras invocarlo, la instancia queda inutilizable.
   */
  public dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;

    try {
      this.oscillator.stop();
    } catch {
      /* ya detenido */
    }

    try {
      this.lfo.stop();
    } catch {
      /* ya detenido */
    }

    try {
      this.oscillator.disconnect();
      this.lfo.disconnect();
      this.gainNode.disconnect();
    } catch {
      /* ya desconectado */
    }

    void this.audioCtx.close().catch(() => {
      /* cierre best-effort */
    });
  }

  /**
   * Indica si el sintetizador está actualmente emitiendo sonido.
   */
  public get active(): boolean {
    return this.isActive;
  }
}

export default AuraAudioSynth;
export type { WindowWithWebkitAudio };