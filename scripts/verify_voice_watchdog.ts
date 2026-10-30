/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DEL MOTOR DE VOZ — `npm run verify:voice`
 * ═══════════════════════════════════════════════════════════════════════════════
 * Simula navegadores móviles hostiles (iOS Safari / Chrome Android) para probar
 * que `speakNatural` NUNCA deja la conversación colgada:
 *
 *   A) SILENT_START — el motor acepta `speak()` y jamás dispara `onstart`.
 *   B) NO_END      — arranca pero `onend` no llega nunca (pausa silenciosa iOS).
 *   C) NORMAL      — onstart + onend: locuta todas las frases.
 *   D) PAUSED_MID  — el motor se pausa a mitad: el latido debe reanudarlo.
 *   E) PRIME       — `primeSpeechSynthesis` no lanza sin motor disponible.
 *
 * Exit 0 sólo si las 5 pruebas pasan. Cualquier cuelgue → Exit 1.
 */

interface FakeUtterance {
  text: string;
  lang: string;
  voice: unknown;
  rate: number;
  pitch: number;
  volume: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

type Mode = 'SILENT_START' | 'NO_END' | 'NORMAL' | 'PAUSED_MID';

interface FakeVoice {
  readonly name: string;
  readonly lang: string;
}

interface FakeSynth {
  paused: boolean;
  speaking: boolean;
  pending: boolean;
  onvoiceschanged: (() => void) | null;
  getVoices: () => FakeVoice[];
  speak: (u: FakeUtterance) => void;
  cancel: () => void;
  resume: () => void;
}

interface Harness {
  readonly synth: FakeSynth;
  readonly counters: { cancel: number; resume: number; spoken: number };
}

const VOICES: FakeVoice[] = [{ name: 'Google español', lang: 'es-ES' }];

function createHarness(mode: Mode, pauseAfterMs?: number): Harness {
  const counters = { cancel: 0, resume: 0, spoken: 0 };
  const synth: FakeSynth = {
    paused: false,
    speaking: false,
    pending: false,
    onvoiceschanged: null,
    getVoices: (): FakeVoice[] => VOICES,
    speak: (u: FakeUtterance): void => {
      counters.spoken += 1;
      synth.pending = true;
      if (mode === 'SILENT_START') return; // nunca arranca: el peor caso móvil
      setTimeout((): void => {
        synth.pending = false;
        synth.speaking = true;
        u.onstart?.();
        if (mode === 'NORMAL') {
          synth.speaking = false;
          u.onend?.();
        }
      }, 10);
      if (mode === 'PAUSED_MID' && typeof pauseAfterMs === 'number') {
        setTimeout((): void => {
          synth.paused = true; // suspensión silenciosa: `onend` jamás llega
        }, pauseAfterMs);
      }
    },
    cancel: (): void => {
      counters.cancel += 1;
      synth.speaking = false;
      synth.pending = false;
    },
    resume: (): void => {
      counters.resume += 1;
      synth.paused = false;
    },
  };
  return { synth, counters };
}

async function withHarness<T>(harness: Harness, run: () => Promise<T>): Promise<T> {
  const globalAny = globalThis as unknown as {
    window?: unknown;
    SpeechSynthesisUtterance?: unknown;
  };
  const fakeWindow = {
    speechSynthesis: harness.synth,
    setTimeout: globalThis.setTimeout.bind(globalThis),
    clearTimeout: globalThis.clearTimeout.bind(globalThis),
    setInterval: globalThis.setInterval.bind(globalThis),
    clearInterval: globalThis.clearInterval.bind(globalThis),
  };
  const previousWindow = globalAny.window;
  const previousUtterance = globalAny.SpeechSynthesisUtterance;

  globalAny.window = fakeWindow;
  class UtteranceStub implements FakeUtterance {
    text: string;
    lang = 'es-ES';
    voice: unknown = null;
    rate = 1;
    pitch = 1;
    volume = 1;
    onstart: (() => void) | null = null;
    onend: (() => void) | null = null;
    onerror: (() => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  }
  globalAny.SpeechSynthesisUtterance = UtteranceStub;

  try {
    return await run();
  } finally {
    globalAny.window = previousWindow;
    globalAny.SpeechSynthesisUtterance = previousUtterance;
  }
}

interface Check {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

function push(checks: Check[], name: string, ok: boolean, detail: string): void {
  checks.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name} · ${detail}`);
}

function deadlockGuard(ms: number): Promise<never> {
  return new Promise<never>((_resolve, reject): void => {
    setTimeout((): void => reject(new Error('CUELGUE: speakNatural no resolvió')), ms);
  });
}

async function main(): Promise<number> {
  const mod = await import('../src/lib/voice/naturalVoice');
  const checks: Check[] = [];

  // A) El motor acepta la frase y jamás dispara onstart → guardia de arranque.
  {
    const harness = createHarness('SILENT_START');
    const started = Date.now();
    try {
      await withHarness(harness, async (): Promise<void> => {
        await Promise.race([mod.speakNatural('Hola, soy el concierge.'), deadlockGuard(12000)]);
      });
      const elapsed = Date.now() - started;
      push(
        checks,
        'A SILENT_START libera el turno',
        elapsed >= 2400 && elapsed <= 5000 && harness.counters.cancel >= 1,
        `${elapsed} ms · cancel=${harness.counters.cancel} (cuelgue erradicado)`
      );
    } catch (error) {
      push(checks, 'A SILENT_START libera el turno', false, String(error));
    }
  }

  // B) Arranca pero `onend` no llega nunca → techo duro sin truncar la locución.
  {
    const harness = createHarness('NO_END');
    const started = Date.now();
    try {
      await withHarness(harness, async (): Promise<void> => {
        await Promise.race([mod.speakNatural('Hola.'), deadlockGuard(12000)]);
      });
      const elapsed = Date.now() - started;
      push(
        checks,
        'B NO_END corta por techo duro',
        elapsed >= 5800 && elapsed <= 9000 && harness.counters.cancel === 1,
        `${elapsed} ms · cancel=${harness.counters.cancel} (sin truncar: sólo el inicial)`
      );
    } catch (error) {
      push(checks, 'B NO_END corta por techo duro', false, String(error));
    }
  }

  // C) Motor sano: locuta todas las frases y libera el turno rápido.
  {
    const harness = createHarness('NORMAL');
    const started = Date.now();
    try {
      await withHarness(harness, async (): Promise<void> => {
        await mod.speakNatural('Hola. ¿Qué tal? Todo listo.');
      });
      const elapsed = Date.now() - started;
      push(
        checks,
        'C NORMAL locuta todas las frases',
        harness.counters.spoken === 3 && elapsed < 3000,
        `${harness.counters.spoken} frases · ${elapsed} ms`
      );
    } catch (error) {
      push(checks, 'C NORMAL locuta todas las frases', false, String(error));
    }
  }

  // D) Suspensión a mitad de locución → el latido reanuda el motor.
  {
    const harness = createHarness('PAUSED_MID', 150);
    try {
      await withHarness(harness, async (): Promise<void> => {
        await Promise.race([mod.speakNatural('Hola, te confirmo la reserva.'), deadlockGuard(12000)]);
      });
      push(
        checks,
        'D PAUSED_MID latido reanuda',
        harness.counters.resume >= 1 && harness.synth.paused === false,
        `resume=${harness.counters.resume} · paused=${harness.synth.paused}`
      );
    } catch (error) {
      push(checks, 'D PAUSED_MID latido reanuda', false, String(error));
    }
  }

  // E) Sin motor disponible no puede lanzar (fail-closed silencioso).
  {
    const globalAny = globalThis as unknown as { window?: unknown };
    const previousWindow = globalAny.window;
    globalAny.window = {};
    let threw = false;
    try {
      mod.primeSpeechSynthesis();
      await mod.speakNatural('Hola sin motor.');
    } catch {
      threw = true;
    } finally {
      globalAny.window = previousWindow;
    }
    push(checks, 'E PRIME sin motor no lanza', !threw, threw ? 'lanzó excepción' : 'return limpio');
  }

  const passed = checks.filter((c: Check): boolean => c.ok).length;
  console.log('');
  console.log('='.repeat(72));
  console.log(`RESUMEN: ${passed}/${checks.length} [OK] | motor de voz`);
  console.log('='.repeat(72));
  if (passed !== checks.length) {
    checks
      .filter((c: Check): boolean => !c.ok)
      .forEach((c: Check): void => console.log(`  ❌ ${c.name}: ${c.detail}`));
    return 1;
  }
  return 0;
}

main()
  .then((code: number): void => {
    process.exit(code);
  })
  .catch((error: unknown): void => {
    console.error('❌ VERIFICADOR DE VOZ ABORTADO:', error);
    process.exit(1);
  });


