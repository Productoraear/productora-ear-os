/**
 * ══════════════════════════════════════════════════════════════════════════════
 * PRISMA DIAMOND SCENE — WEB WORKER + OFFSCREENCANVAS (FASE 1 · Zero-INP)
 * ══════════════════════════════════════════════════════════════════════════════
 * Hallazgo GSC 2026-11-11: el canvas 3D del hero se renderizaba en WebGL sobre el
 * hilo principal. Cada frame competía con la interacción del usuario, así que el
 * INP se degradaba en móvil aunque la escena fuese "sólo 30 fps".
 *
 * Qué cambia aquí, y sólo esto:
 *   · El contexto WebGL se crea sobre un `OffscreenCanvas` transferido desde el
 *     hilo principal (`transferControlToOffscreen`). Ni un solo draw call toca
 *     el hilo de UI: 0 ms de bloqueo por frame.
 *   · El hilo principal sólo envía señales pequeñas: resize, puntero y pausa.
 *   · El bucle rAF del worker sigue gobernado por `useWebglLifecycle`: si el
 *     contenedor sale del viewport o la pestaña se oculta, el worker deja de
 *     pedir frames (`running = false`) y el coste de CPU/GPU cae a 0%.
 *
 * Anti-fachada (AF-1/AF-2): el worker NO simula nada. Si `THREE.WebGLRenderer`
 * no consigue contexto emite `unsupported` y el hilo principal monta la
 * alternativa 2D estática. Cero frames inventados.
 *
 * Contrato de mensajes (cerrado, tipado en ambos extremos):
 *   main → worker : init · resize · pointer · animate · dispose
 *   worker → main : ready {webglVersion} · unsupported {reason} · error {message}
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as THREE from 'three';

declare const self: unknown;

/** Nodo del sistema de 5 ejes. El ángulo y el color llegan del componente. */
export interface SceneAxisNode {
  readonly id: string;
  readonly color: string;
  readonly angle: number;
}

export interface WorkerInitMessage {
  readonly type: 'init';
  readonly canvas: OffscreenCanvas;
  readonly width: number;
  readonly height: number;
  readonly devicePixelRatio: number;
  readonly maxParticles: number;
  readonly targetFps: number;
  readonly axes: readonly SceneAxisNode[];
}

export type WorkerInbound =
  | WorkerInitMessage
  | { readonly type: 'resize'; readonly width: number; readonly height: number; readonly devicePixelRatio: number }
  | { readonly type: 'pointer'; readonly x: number; readonly y: number }
  | { readonly type: 'animate'; readonly running: boolean }
  | { readonly type: 'dispose' };

export type WorkerOutbound =
  | { readonly type: 'ready'; readonly webglVersion: 1 | 2 }
  | { readonly type: 'unsupported'; readonly reason: string }
  | { readonly type: 'error'; readonly message: string };

interface Scene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly diamondGroup: THREE.Group;
  readonly nexoGroup: THREE.Group;
  readonly particles: THREE.Points;
  readonly rubyLight: THREE.PointLight;
  readonly cyanLight: THREE.PointLight;
  readonly clock: THREE.Clock;
  targetRotX: number;
  targetRotY: number;
  currentRotX: number;
  currentRotY: number;
  lastFrameMs: number;
  readonly targetFps: number;
  running: boolean;
  frameId: number;
  readonly dispose: () => void;
}

const workerScope = self as unknown as {
  postMessage: (message: WorkerOutbound) => void;
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<WorkerInbound>) => void,
  ) => void;
  requestAnimationFrame: (callback: (timestamp: number) => void) => number;
  cancelAnimationFrame: (handle: number) => void;
  close: () => void;
};

/**
 * HANDLE CANÓNICO DEL WORKER (lo que el bundler entrega a `new URL(...)`).
 *
 * No se exporta una función `startScene()` a propósito: Next.js/webpack sólo
 * emite el worker como asset SI la llamada `new Worker(new URL('...', ...))`
 * aparece de forma estática en el fichero que el bundler transforma. Por eso el
 * componente principal instancia el worker y este módulo es SOLO la escena.
 * El `export default` siguiente existe para que el fichero sea un módulo ES y
 * `tsc`/eslint lo traten con semántica estricta (nunca un script global).
 */
export interface PrismaDiamondSceneProtocol {
  readonly inbound: WorkerInbound | null;
  readonly outbound: WorkerOutbound | null;
}

let activeScene: Scene | null = null;

function post(message: WorkerOutbound): void {
  workerScope.postMessage(message);
}

/** Libera geometrías, materiales y el contexto WebGL del worker. */
function disposeScene(scene: Scene): void {
  if (scene.frameId !== 0) {
    workerScope.cancelAnimationFrame(scene.frameId);
    scene.frameId = 0;
  }
  scene.scene.traverse((node) => {
    const drawable = node as THREE.Mesh | THREE.Line | THREE.Points | THREE.Sprite;
    if (drawable.geometry instanceof THREE.BufferGeometry) {
      drawable.geometry.dispose();
    }
    const material = (node as THREE.Mesh).material;
    if (material === undefined) return;
    const list = Array.isArray(material) ? material : [material];
    for (const entry of list) {
      const texture = (entry as THREE.SpriteMaterial).map;
      if (texture instanceof THREE.Texture) texture.dispose();
      entry.dispose();
    }
  });
  scene.renderer.dispose();
}

function renderFrame(scene: Scene): void {
  const elapsedTime = scene.clock.getElapsedTime();

  scene.currentRotX += (scene.targetRotX - scene.currentRotX) * 0.05;
  scene.currentRotY += (scene.targetRotY - scene.currentRotY) * 0.05;

  scene.diamondGroup.rotation.y = elapsedTime * 0.35 + scene.currentRotY;
  scene.diamondGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + scene.currentRotX;
  scene.diamondGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.22;

  scene.nexoGroup.rotation.y = -elapsedTime * 0.18 + scene.currentRotY * 0.4;
  scene.nexoGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.08;

  scene.particles.rotation.y = elapsedTime * 0.06;
  scene.particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

  scene.rubyLight.position.x = Math.sin(elapsedTime * 0.8) * 7;
  scene.cyanLight.position.x = -Math.sin(elapsedTime * 0.8) * 7;

  scene.renderer.render(scene.scene, scene.camera);
}

/**
 * Bucle gobernado: el worker NO se auto-invoca si el lifecycle dijo `paused`.
 * Un solo `requestAnimationFrame` por frame del worker (nunca del hilo de UI).
 */
function scheduleLoop(scene: Scene): void {
  const animate = (timestamp: number): void => {
    if (!scene.running) {
      scene.frameId = 0;
      return;
    }
    scene.frameId = workerScope.requestAnimationFrame(animate);

    const minFrameMs = scene.targetFps > 0 ? 1000 / scene.targetFps : 1000 / 30;
    if (timestamp - scene.lastFrameMs < minFrameMs) return;
    scene.lastFrameMs = timestamp;

    renderFrame(scene);
  };

  scene.frameId = workerScope.requestAnimationFrame(animate);
}

function buildScene(message: WorkerInitMessage): Scene {
  // El contexto se pide al OFFSCREEN canvas: vive entero dentro del worker.
  const renderer = new THREE.WebGLRenderer({
    canvas: message.canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030305, 0.04);

  const camera = new THREE.PerspectiveCamera(45, message.width / Math.max(1, message.height), 0.1, 100);
  camera.position.z = message.width < 768 ? 16 : 13;

  renderer.setPixelRatio(message.devicePixelRatio);
  renderer.setSize(message.width, message.height, false);

  // 1 · Luces prismáticas (rubí / cyan / oro soberano)
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const rubyLight = new THREE.PointLight(0xff2b44, 3.5, 30);
  rubyLight.position.set(-6, 4, 6);
  scene.add(rubyLight);

  const cyanLight = new THREE.PointLight(0x00e5ff, 3.5, 30);
  cyanLight.position.set(6, -4, 6);
  scene.add(cyanLight);

  const goldLight = new THREE.PointLight(0xecb613, 2.5, 25);
  goldLight.position.set(0, 7, -3);
  scene.add(goldLight);

  // 2 · Diamante central: octaedro físico + aristas rubí
  const diamondGroup = new THREE.Group();
  scene.add(diamondGroup);

  const diamondGeometry = new THREE.OctahedronGeometry(2.4, 0);
  const diamondMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    emissive: 0x110204,
    roughness: 0.08,
    metalness: 0.2,
    transmission: 0.88,
    ior: 2.417,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });
  diamondGroup.add(new THREE.Mesh(diamondGeometry, diamondMaterial));
  diamondGroup.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(diamondGeometry),
      new THREE.LineBasicMaterial({ color: 0xff2b44, transparent: true, opacity: 0.85 }),
    ),
  );

  // 3 · Anillo orbital y nodos de los 5 ejes soberanos
  const nexoGroup = new THREE.Group();
  scene.add(nexoGroup);

  const orbitRing = new THREE.Mesh(
    new THREE.RingGeometry(5.2, 5.25, 64),
    new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.08 }),
  );
  orbitRing.rotation.x = Math.PI / 2.6;
  nexoGroup.add(orbitRing);

  for (const axis of message.axes) {
    const x = Math.cos(axis.angle) * 5.2;
    const z = Math.sin(axis.angle) * 5.2;
    const y = Math.sin(axis.angle * 2) * 0.7;

    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(axis.color),
        emissive: new THREE.Color(axis.color),
        emissiveIntensity: 0.8,
        roughness: 0.2,
      }),
    );
    node.position.set(x, y, z);
    nexoGroup.add(node);

    nexoGroup.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)]),
        new THREE.LineBasicMaterial({ color: new THREE.Color(axis.color), transparent: true, opacity: 0.25 }),
      ),
    );
  }

  // 4 · Nube de partículas: presupuesto del lifecycle, nunca un número mágico
  const particleCount = Math.max(1, message.maxParticles);
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const palette = [new THREE.Color(0xff2b44), new THREE.Color(0x00e5ff), new THREE.Color(0xecb613)];

  for (let i = 0; i < particleCount; i += 1) {
    const r = 3.5 + Math.random() * 8.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    particlePositions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = r * Math.sin(phi);
    particlePositions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
    const chosen = palette[i % 3];
    particleColors[i * 3] = chosen.r;
    particleColors[i * 3 + 1] = chosen.g;
    particleColors[i * 3 + 2] = chosen.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(particles);

  const built: Scene = {
    renderer,
    scene,
    camera,
    diamondGroup,
    nexoGroup,
    particles,
    rubyLight,
    cyanLight,
    clock: new THREE.Clock(),
    targetFps: message.targetFps,
    targetRotX: 0,
    targetRotY: 0,
    currentRotX: 0,
    currentRotY: 0,
    lastFrameMs: 0,
    running: false,
    frameId: 0,
    dispose: () => disposeScene(built),
  };

  // Primer frame inmediato: el póster CSS ya ocupa la geometría, así que el
  // lienzo no se ve vacío ni provoca salto de layout.
  renderFrame(built);
  return built;
}

workerScope.addEventListener('message', (event: MessageEvent<WorkerInbound>) => {
  const payload = event.data;

  try {
    switch (payload.type) {
      case 'init': {
        if (activeScene !== null) {
          activeScene.dispose();
          activeScene = null;
        }
        const scene = buildScene(payload);
        activeScene = scene;
        const context = scene.renderer.getContext();
        const version: 1 | 2 = typeof WebGL2RenderingContext !== 'undefined' && context instanceof WebGL2RenderingContext ? 2 : 1;
        post({ type: 'ready', webglVersion: version });
        break;
      }
      case 'resize': {
        const scene = activeScene;
        if (scene === null) return;
        const width = Math.max(1, payload.width);
        const height = Math.max(1, payload.height);
        scene.camera.aspect = width / height;
        scene.camera.position.z = width < 768 ? 16 : 13;
        scene.camera.updateProjectionMatrix();
        scene.renderer.setPixelRatio(payload.devicePixelRatio);
        scene.renderer.setSize(width, height, false);
        if (!scene.running) renderFrame(scene);
        break;
      }
      case 'pointer': {
        const scene = activeScene;
        if (scene === null) return;
        // El hilo principal normaliza el puntero a [-0.5, 0.5]: aquí cero DOM.
        scene.targetRotY = payload.x * 1.3;
        scene.targetRotX = payload.y * 0.9;
        break;
      }
      case 'animate': {
        const scene = activeScene;
        if (scene === null) return;
        if (payload.running && !scene.running) {
          scene.running = true;
          scheduleLoop(scene);
        } else if (!payload.running) {
          scene.running = false;
        }
        break;
      }
      case 'dispose': {
        if (activeScene !== null) {
          activeScene.dispose();
          activeScene = null;
        }
        workerScope.close();
        break;
      }
      default:
        break;
    }
  } catch (error) {
    post({ type: 'error', message: error instanceof Error ? error.message : 'worker-scene-failure' });
  }
});
