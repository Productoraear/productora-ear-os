'use client';

import React, { useEffect, useRef } from 'react';

interface VanguardFluidBackgroundProps {
    /** Color primario del fluido (hex). */
    accentColor?: string;
    /** Color secundario del fluido (hex). */
    accentColorSecondary?: string;
    /** Intensidad de la reacción al cursor (0 - 1). */
    cursorReactivity?: number;
    /** Velocidad de la simulación (0.5 - 2). */
    speed?: number;
    /** Opacidad global del canvas. */
    opacity?: number;
    /** Altura del contenedor. */
    className?: string;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uMouseVelocity;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uReactivity;

  varying vec2 vUv;

  // Hash & Noise (Simplex-like value noise)
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = rot * p * 2.0;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);

    // Dominio de deformación fluido (dom warping)
    float t = uTime * 0.12;
    vec2 q = vec2(
      fbm(p * 1.8 + vec2(t, -t * 0.7)),
      fbm(p * 1.8 + vec2(-t * 0.8, t * 0.6) + 4.7)
    );

    vec2 r = vec2(
      fbm(p * 2.2 + q * 2.4 + vec2(1.7, 9.2) + t * 0.4),
      fbm(p * 2.2 + q * 2.4 + vec2(8.3, 2.8) - t * 0.3)
    );

    float f = fbm(p * 2.6 + r * 3.0 - t * 0.5);

    // Reacción al cursor: ondas radiales + arrastre
    vec2 mouseP = vec2(uMouse.x * aspect, uMouse.y);
    float dist = distance(p, mouseP);
    float ripple = sin(dist * 18.0 - uTime * 3.5) * exp(-dist * 3.2);
    float cursorInfluence = ripple * uReactivity * (0.35 + uMouseVelocity * 1.6);

    // Composición de color
    float mixVal = clamp(f + cursorInfluence, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, mixVal);

    // Brillo especular en crestas del fluido
    float crest = smoothstep(0.62, 0.95, f + cursorInfluence);
    col += vec3(1.0, 0.92, 0.55) * crest * 0.22;

    // Halo dorado alrededor del cursor
    float halo = exp(-dist * 4.5) * (0.18 + uMouseVelocity * 0.55) * uReactivity;
    col += vec3(0.925, 0.713, 0.075) * halo;

    // Viñeta profunda OLED
    float vig = smoothstep(1.25, 0.35, distance(uv, vec2(0.5)));
    col *= mix(0.35, 1.0, vig);

    // Atenuación general para no competir con el contenido
    col *= 0.55;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default React.memo(function VanguardFluidBackground({
    accentColor = '#ecb613',
    accentColorSecondary = '#0a0806',
    cursorReactivity = 0.85,
    speed = 1.0,
    opacity = 0.9,
    className = '',
}: VanguardFluidBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        let cancelled = false;
        let animationFrameId = 0;
        let cleanup: (() => void) | null = null;

        (async () => {
            const THREE = await import('three');
            if (cancelled) return;

            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            const renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: false,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

            const colorA = new THREE.Color(accentColorSecondary);
            const colorB = new THREE.Color(accentColor);

            const uniforms = {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(1, 1) },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uMouseVelocity: { value: 0 },
                uColorA: { value: colorA },
                uColorB: { value: colorB },
                uReactivity: { value: cursorReactivity },
            };

            const material = new THREE.ShaderMaterial({
                vertexShader: VERTEX_SHADER,
                fragmentShader: FRAGMENT_SHADER,
                uniforms,
                depthWrite: false,
            });

            const geometry = new THREE.PlaneGeometry(2, 2);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Estado del cursor (suavizado)
            const targetMouse = new THREE.Vector2(0.5, 0.5);
            const currentMouse = new THREE.Vector2(0.5, 0.5);
            let lastMouse = new THREE.Vector2(0.5, 0.5);
            let velocity = 0;

            const handlePointerMove = (e: PointerEvent) => {
                const rect = container.getBoundingClientRect();
                targetMouse.x = (e.clientX - rect.left) / rect.width;
                targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
            };

            const handlePointerLeave = () => {
                targetMouse.set(0.5, 0.5);
            };

            window.addEventListener('pointermove', handlePointerMove, { passive: true });
            window.addEventListener('pointerleave', handlePointerLeave);

            const handleResize = () => {
                const w = container.clientWidth;
                const h = container.clientHeight;
                renderer.setSize(w, h);
                uniforms.uResolution.value.set(w, h);
            };

            const resizeObserver = new ResizeObserver(() => handleResize());
            resizeObserver.observe(container);
            handleResize();

            const clock = new THREE.Clock();

            const animate = () => {
                animationFrameId = requestAnimationFrame(animate);
                const dt = Math.min(clock.getDelta(), 0.05);
                uniforms.uTime.value += dt * speed;

                // Suavizado del cursor + cálculo de velocidad
                const prev = currentMouse.clone();
                currentMouse.lerp(targetMouse, 0.08);
                velocity = Math.max(velocity * 0.92, currentMouse.distanceTo(prev) * 12.0);
                velocity = Math.min(velocity, 1.0);
                lastMouse.copy(currentMouse);

                uniforms.uMouse.value.copy(currentMouse);
                uniforms.uMouseVelocity.value = velocity;

                renderer.render(scene, camera);
            };

            animate();

            cleanup = () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('pointermove', handlePointerMove);
                window.removeEventListener('pointerleave', handlePointerLeave);
                resizeObserver.disconnect();
                geometry.dispose();
                material.dispose();
                renderer.dispose();
            };
        })();

        return () => {
            cancelled = true;
            if (cleanup) cleanup();
        };
    }, [accentColor, accentColorSecondary, cursorReactivity, speed]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
            style={{ opacity }}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="w-full h-full block" />
            {/* Viñeta de transición hacia el fondo OLED */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060507]/40 via-transparent to-[#060507]" />
        </div>
    );
});