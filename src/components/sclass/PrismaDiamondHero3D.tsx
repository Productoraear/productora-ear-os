'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Activity, ShieldCheck, Compass } from 'lucide-react';
import { useWebglLifecycle } from '@/lib/hooks/useWebglLifecycle';
import type { WorkerInbound, WorkerOutbound } from './prismaDiamondScene.worker';

interface PrismaDiamondHero3DProps {
  onSelectRole?: (role: string) => void;
}

const AXIS_NODES = [
  { id: 'artistas', label: 'Artistas', color: '#FF2B44', angle: 0, tag: 'Split 80%', href: '/artistas' },
  { id: 'eventos', label: 'Eventos', color: '#F59E0B', angle: (2 * Math.PI) / 5, tag: '12 W/pax', href: '/eventos' },
  { id: 'empresas', label: 'Empresas', color: '#10B981', angle: (4 * Math.PI) / 5, tag: 'B2B 2FA', href: '/proveedores' },
  { id: 'instituciones', label: 'Instituciones', color: '#00E5FF', angle: (6 * Math.PI) / 5, tag: 'Art. 118 LCSP', href: '/ayuntamientos' },
  { id: 'vimume', label: 'VIMUME', color: '#8B5CF6', angle: (8 * Math.PI) / 5, tag: '40 Hz Gamma', href: '/vimume' },
];

/**
 * Geometría estática del hero (INV-18 · ley del skeleton anti-CLS).
 *
 * El contenedor fija ALTO y ANCHO antes de que exista un solo píxel de WebGL:
 * el canvas es hijo `absolute inset-0`, así que su llegada no desplaza ni un
 * nodo del flujo. `contain: layout paint style` aísla el hero para que ninguna
 * animación interna pueda invalidar el layout de la página.
 */
const HERO_GEOMETRY_CLASS =
  'relative w-full h-[clamp(580px,100svh,760px)] min-h-[580px] ' +
  'flex items-center justify-center overflow-hidden bg-[#030305] select-none [contain:layout_paint_style]';

/** Contrato de transporte: el worker se activa sólo si el navegador lo soporta. */
interface OffscreenCapability {
  readonly supported: boolean;
  readonly reason: 'offscreen-canvas+worker' | 'no-offscreen-canvas' | 'no-worker' | 'ssr';
}

export default React.memo(function PrismaDiamondHero3D({ onSelectRole }: PrismaDiamondHero3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [activeAxis, setActiveAxis] = useState<string | null>(null);
  const [capability, setCapability] = useState<OffscreenCapability>({ supported: false, reason: 'ssr' });
  /** `true` cuando el worker confirmó un contexto WebGL real (mensaje `ready`). */
  const [sceneLive, setSceneLive] = useState(false);

  // F-4 (viewport + accesibilidad 3D): la escena NO se inicializa por inercia.
  //   · prefers-reduced-motion / SSR / sin GPU / save-data → 'static': el canvas
  //     WebGL nunca se crea y manda la alternativa 2D (ESCENARIO ESTÁTICO).
  //   · fuera de viewport o pestaña oculta          → 'paused': se cancela el
  //     rAF (0 frames = 0% CPU/GPU) y se conserva el contexto WebGL.
  //   · dentro de viewport y tab visible            → 'running'.
  const {
    ref: containerRef,
    decision,
    label: webglStateLabel,
    shouldMountCanvas,
    shouldAnimate,
    shouldRenderStaticAlternative,
  } = useWebglLifecycle();

  const targetFps = decision.animateBudget.fps;
  const particleBudget = Math.max(1, decision.animateBudget.maxParticles);

  // El bucle vive en el WORKER: aquí sólo se guarda la señal de pausa. Leerla
  // por ref evita reconstruir la escena en cada scroll (cero frames perdidos).
  const animateRef = useRef<boolean>(shouldAnimate);
  const workerHandleRef = useRef<Worker | null>(null);

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      typeof Worker !== 'undefined' &&
      'transferControlToOffscreen' in HTMLCanvasElement.prototype;
    setCapability({
      supported,
      reason: supported ? 'offscreen-canvas+worker' : typeof Worker === 'undefined' ? 'no-worker' : 'no-offscreen-canvas',
    });
  }, []);

  // Pausa/reanudación: un mensaje de ~30 bytes. Nada se reconstruye.
  useEffect(() => {
    animateRef.current = shouldAnimate;
    workerHandleRef.current?.postMessage({ type: 'animate', running: shouldAnimate } satisfies WorkerInbound);
  }, [shouldAnimate]);

  useEffect(() => {
    // Sin canvas autorizado no existe worker ni contexto WebGL.
    if (!shouldMountCanvas || !capability.supported) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let cancelled = false;

    {
      // El chunk del worker (y con él three.js) se emite como ASSET aparte.
      // `new Worker(new URL('./x.worker.ts', import.meta.url))` es la forma
      // estática que reconoce el bundler de Next.js: si se usa un `import()`
      // dinámico de la clase, el módulo se evalúa en el HILO PRINCIPAL y el
      // offload sería cosmético (fachada). Sólo el `OffscreenCanvas` cruza la
      // frontera (`postMessage(init, [offscreen])`).
      const offscreen = canvas.transferControlToOffscreen();
      const sceneWorker = new Worker(new URL('./prismaDiamondScene.worker.ts', import.meta.url), {
        type: 'module',
      });
      workerHandleRef.current = sceneWorker;

      sceneWorker.onmessage = (event: MessageEvent<WorkerOutbound>) => {
        if (cancelled) return;
        // `ready` sólo se emite si el worker obtuvo un contexto WebGL real.
        if (event.data.type === 'ready') setSceneLive(true);
        // `unsupported`/`error` → se apaga la capa 3D y manda la 2D (AF-1).
        else setSceneLive(false);
      };
      sceneWorker.onerror = () => setSceneLive(false);

      const box = container.getBoundingClientRect();
      sceneWorker.postMessage(
        {
          type: 'init',
          canvas: offscreen,
          width: Math.max(1, Math.round(box.width)),
          height: Math.max(1, Math.round(box.height)),
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          maxParticles: particleBudget,
          targetFps: targetFps > 0 ? targetFps : 30,
          axes: AXIS_NODES.map((node) => ({ id: node.id, color: node.color, angle: node.angle })),
        } satisfies WorkerInbound,
        [offscreen],
      );
      sceneWorker.postMessage({ type: 'animate', running: animateRef.current } satisfies WorkerInbound);

      // Resize: el observer corre aquí pero sólo emite números al worker.
      const resizeObserver = new ResizeObserver(() => {
        const rect = container.getBoundingClientRect();
        sceneWorker.postMessage({
          type: 'resize',
          width: Math.max(1, Math.round(rect.width)),
          height: Math.max(1, Math.round(rect.height)),
          devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        } satisfies WorkerInbound);
      });
      resizeObserver.observe(container);

      // Puntero normalizado a [-0.5, 0.5]: una rect por evento, no por frame.
      const sendPointer = (clientX: number, clientY: number): void => {
        const rect = container.getBoundingClientRect();
        sceneWorker.postMessage({
          type: 'pointer',
          x: (clientX - rect.left) / rect.width - 0.5,
          y: (clientY - rect.top) / rect.height - 0.5,
        } satisfies WorkerInbound);
      };
      const handleMouseMove = (event: MouseEvent): void => sendPointer(event.clientX, event.clientY);
      const handleTouchMove = (event: TouchEvent): void => {
        const touch = event.touches[0];
        if (touch !== undefined) sendPointer(touch.clientX, touch.clientY);
      };

      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove, { passive: true });

      cleanupRef.current = () => {
        resizeObserver.disconnect();
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
        sceneWorker.postMessage({ type: 'dispose' } satisfies WorkerInbound);
        sceneWorker.terminate();
        workerHandleRef.current = null;
      };
    }

    return () => {
      cancelled = true;
      setSceneLive(false);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [shouldMountCanvas, capability.supported, containerRef, particleBudget, targetFps]);

  // Alternativa 2D: accesibilidad, navegadores sin OffscreenCanvas y cualquier
  // fallo del worker. Misma geometría CSS → el cambio no mueve un píxel.
  const showStaticAlternative =
    shouldRenderStaticAlternative || !capability.supported || (shouldMountCanvas && !sceneLive);

  return (
    <div
      ref={containerRef}
      data-webgl-state={webglStateLabel}
      data-webgl-tier={decision.reason}
      data-offscreen={capability.reason}
      className={HERO_GEOMETRY_CLASS}
    >
      {/* Canvas 3D: SÓLO existe si el lifecycle lo autoriza. El control se
          transfiere al worker (`transferControlToOffscreen`), así que aquí no
          se ejecuta ni un draw call. En 'static' no se crea contexto alguno. */}
      {shouldMountCanvas && capability.supported ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
      ) : null}

      {/* Alternativa 2D estática de alta fidelidad: mismo encuadre, mismos ejes,
          cero movimiento. Se pinta con CSS puro (sin three, sin shaders). */}
      {showStaticAlternative ? (
        <div
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="relative w-[min(74vw,420px)] aspect-square">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[18%] rounded-full border border-white/10" />
            <div className="absolute inset-[36%] rotate-45 border border-[#FF2B44]/40" />
            <div className="absolute inset-[36%] border border-[#00E5FF]/30" />
            <div className="absolute -inset-[2%] rounded-full opacity-60 bg-[radial-gradient(circle_at_50%_35%,rgba(255,43,68,0.14)_0%,rgba(0,229,255,0.08)_45%,transparent_70%)]" />
            {AXIS_NODES.map((node) => {
              const x = 50 + Math.cos(node.angle) * 46;
              const y = 50 + Math.sin(node.angle) * 46;
              return (
                <span
                  key={`static-${node.id}`}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: node.color,
                    boxShadow: `0 0 10px ${node.color}`,
                  }}
                />
              );
            })}
          </div>
          <span className="absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            Escenario estatico / motion reducido
          </span>
        </div>
      ) : null}

      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,43,68,0.06)_0%,rgba(0,229,255,0.04)_40%,transparent_75%)] pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-between min-h-full pointer-events-none text-center">
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-[#FF2B44]/40 backdrop-blur-xl shadow-[0_0_25px_rgba(255,43,68,0.3)] animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-2 h-2 rounded-full bg-[#FF2B44] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-white">
            PRODUCTORA EAR // CENTRO GRAVITACIONAL 3D
          </span>
          <span className="text-[9px] font-mono text-[#00E5FF] hidden sm:inline">PRISMA x NEXO</span>
        </div>

        <div className="mt-8 sm:mt-12 space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-white leading-tight">
            INFRAESTRUCTURA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF2B44] via-[#00E5FF] to-white italic">
              5 EJES SOBERANOS
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-mono font-light max-w-xl mx-auto leading-relaxed">
            Refracción acústica y arquitectónica en tiempo real. Rota el Diamante con tu ratón o dedo para orbitar entre los 5 nodos de la productora.
          </p>
        </div>

        <div className="pointer-events-auto mt-12 sm:mt-16 w-full max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {AXIS_NODES.map((node) => {
              const isActive = activeAxis === node.id;
              return (
                <Link
                  key={node.id}
                  href={node.href}
                  onMouseEnter={() => setActiveAxis(node.id)}
                  onMouseLeave={() => setActiveAxis(null)}
                  onClick={() => onSelectRole && onSelectRole(node.id)}
                  className={`p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer ${isActive ? 'bg-white/10 scale-[1.04] shadow-[0_0_30px_rgba(0,0,0,0.8)]' : 'bg-black/60 hover:bg-black/80 border-white/10'
                    }`}
                  style={{
                    borderColor: isActive ? node.color : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? `0 0 25px ${node.color}40` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: node.color }} />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">{node.tag}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold font-syne text-white uppercase group-hover:text-white transition-colors">
                      {node.label}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: isActive ? node.color : undefined }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-emerald-400" />
            Split Soberano 80/10/10
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-[#00E5FF]" />
            Rider 12 W/pax Bose
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Compass size={12} className="text-[#ecb613]" />
            Radio Km 0 Méntrida
          </span>
        </div>
      </div>
    </div>
  );
});
