'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDIO AMBIENTAL S-CLASS · SINTETIZADO EN TIEMPO REAL
 * ════════════════════════════════════════════════════════════════════════════
 * Silencio absoluto por defecto (política de autoplay): el AudioContext sólo
 * nace en el gesto del usuario. El ambiente es un drone de 55 Hz + quinta con
 * aire filtrado y LFO de respiración de sala — cero assets descargados, por lo
 * tanto cero peso de red y cero licencias de terceros.
 *
 * Encendido y apagado con rampa lineal de ganancia (sin clics ni sobresaltos)
 * y cierre del contexto tras el desvanecimiento para liberar el hilo de audio.
 * ════════════════════════════════════════════════════════════════════════════
 */

const TARGET_GAIN = 0.055;
const FADE_IN_SECONDS = 1.4;
const FADE_OUT_SECONDS = 0.7;

type AudioContextConstructor = new () => AudioContext;

interface AmbientGraph {
  readonly context: AudioContext;
  readonly master: GainNode;
  readonly stops: readonly AudioScheduledSourceNode[];
}

function resolveAudioContextConstructor(): AudioContextConstructor | null {
  if (typeof window === 'undefined') return null;
  if (typeof window.AudioContext !== 'undefined') return window.AudioContext;
  const legacy = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return legacy.webkitAudioContext ?? null;
}

function buildAmbientGraph(ContextCtor: AudioContextConstructor): AmbientGraph {
  const context = new ContextCtor();

  const master = context.createGain();
  master.gain.value = 0;
  master.connect(context.destination);

  const lowpass = context.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 340;
  lowpass.Q.value = 0.6;
  lowpass.connect(master);

  // Drone: fundamental 55 Hz + quinta 82,5 Hz ligeramente detunada.
  const fundamental = context.createOscillator();
  fundamental.type = 'sine';
  fundamental.frequency.value = 55;

  const fifth = context.createOscillator();
  fifth.type = 'sine';
  fifth.frequency.value = 82.5;
  fifth.detune.value = 6;

  const droneGain = context.createGain();
  droneGain.gain.value = 0.34;
  fundamental.connect(droneGain);
  fifth.connect(droneGain);
  droneGain.connect(lowpass);

  // Aire de sala: ruido marrón en bucle (2 s), sin archivo de audio.
  const airBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 2), context.sampleRate);
  const samples = airBuffer.getChannelData(0);
  let tail = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const white = Math.random() * 2 - 1;
    tail = (tail + 0.02 * white) / 1.02;
    samples[index] = tail * 3.2;
  }

  const air = context.createBufferSource();
  air.buffer = airBuffer;
  air.loop = true;

  const airGain = context.createGain();
  airGain.gain.value = 0.22;
  air.connect(airGain);
  airGain.connect(lowpass);

  // LFO: el filtro "respira" como una sala viva (0,07 Hz).
  const lfo = context.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = 0.07;

  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 110;
  lfo.connect(lfoDepth);
  lfoDepth.connect(lowpass.frequency);

  fundamental.start();
  fifth.start();
  air.start();
  lfo.start();

  return {
    context,
    master,
    stops: [fundamental, fifth, air, lfo],
  };
}
export function CinematicAudioToggle(): React.JSX.Element {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [unsupported, setUnsupported] = useState<boolean>(false);
  const graphRef = useRef<AmbientGraph | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setUnsupported(resolveAudioContextConstructor() === null);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      const graph = graphRef.current;
      graphRef.current = null;
      if (graph) {
        for (const node of graph.stops) {
          try {
            node.stop();
          } catch {
            /* el nodo ya estaba detenido */
          }
        }
        void graph.context.close();
      }
    };
  }, []);

  const toggle = useCallback(() => {
    const current = graphRef.current;

    if (current) {
      const { context, master, stops } = current;
      const now = context.currentTime;

      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS);

      graphRef.current = null;
      setEnabled(false);

      closeTimerRef.current = window.setTimeout(() => {
        for (const node of stops) {
          try {
            node.stop();
          } catch {
            /* idempotente */
          }
        }
        void context.close();
        closeTimerRef.current = null;
      }, Math.round(FADE_OUT_SECONDS * 1000) + 80);

      return;
    }

    const ContextCtor = resolveAudioContextConstructor();
    if (!ContextCtor) {
      setUnsupported(true);
      return;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    const graph = buildAmbientGraph(ContextCtor);
    graphRef.current = graph;
    setEnabled(true);

    void graph.context.resume().then(() => {
      const now = graph.context.currentTime;
      graph.master.gain.cancelScheduledValues(now);
      graph.master.gain.setValueAtTime(0, now);
      graph.master.gain.linearRampToValueAtTime(TARGET_GAIN, now + FADE_IN_SECONDS);
    });
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={unsupported}
      aria-pressed={enabled}
      aria-label="Audio inmersivo ambiental"
      title="Ambiente sintetizado en tiempo real. Sin descargas ni audio de terceros."
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-black/55 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur transition-colors duration-200 hover:border-[#ecb613]/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
    >
      {enabled ? (
        <Volume2 size={14} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <VolumeX size={14} strokeWidth={1.5} aria-hidden="true" />
      )}
      <span>{unsupported ? 'Audio no disponible' : `Audio inmersivo: ${enabled ? 'on' : 'off'}`}</span>
    </button>
  );
}