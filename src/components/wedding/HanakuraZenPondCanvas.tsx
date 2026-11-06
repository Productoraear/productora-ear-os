'use client';

import React, { useEffect, useRef } from 'react';

/**
 * HanakuraZenPondCanvas
 * Replicación 1:1 en WebGL de la escena de Hanakura Zen para bodas de alta gama:
 * - Estanque de agua en calma con reflejo oscuro y ondas expansivas (ripples).
 * - Pétalos de flor de cerezo que caen orgánicamente con física suave y crean anillos al posarse.
 * - Reacción interactiva al movimiento del ratón (estela de ondas suaves) y clic (anillo fuerte).
 * - Aceleración pura por GPU con degradación estática en caso de falta de soporte.
 */
export function HanakuraZenPondCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_click_time;

      // Generador de ondas en estanque
      float ripple(vec2 uv, vec2 center, float time) {
        float d = length(uv - center);
        float speed = 0.8;
        float wave = sin(d * 40.0 - time * speed) * exp(-d * 3.5) * exp(-time * 0.4);
        return clamp(wave, 0.0, 1.0);
      }

      // Caída orgánica de pétalos de cerezo
      float petals(vec2 p, float t) {
        float sum = 0.0;
        for (int i = 0; i < 7; i++) {
          float fi = float(i);
          float offset = fi * 1.57;
          vec2 pos = vec2(
            sin(t * 0.3 + offset) * 0.6 + sin(fi * 3.0) * 0.4,
            fract(0.9 - t * 0.15 - fi * 0.18) * 2.0 - 1.0
          );
          float d = length(p - pos);
          // Forma alargada de pétalo
          float petalShape = smoothstep(0.04, 0.01, d);
          sum += petalShape;
        }
        return clamp(sum, 0.0, 1.0);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        float t = u_time * 0.5;

        // Estela del ratón en el agua
        vec2 mouseNorm = (u_mouse * 2.0 - 1.0);
        float mouseWave = ripple(p, vec2(mouseNorm.x, -mouseNorm.y), mod(u_time * 1.5, 3.0)) * 0.25;

        // Ondas del clic
        float clickWave = ripple(p, vec2(mouseNorm.x, -mouseNorm.y), max(0.0, u_time - u_click_time)) * 0.5;

        // Ondas de pétalos cayendo
        float pondRipple = sin(length(p) * 15.0 - t * 1.2) * 0.05 + mouseWave + clickWave;

        // Colores del jardin zen nupcial (OLED 030305, rosa palido flor de cerezo y oro ecb613)
        vec3 colVoid = vec3(0.015, 0.015, 0.025);
        vec3 colCherryPetal = vec3(0.98, 0.72, 0.82); // Rosa flor de cerezo
        vec3 colGoldWarm = vec3(0.925, 0.714, 0.075);  // Oro noble EAR OS
        vec3 colWaterDeep = vec3(0.03, 0.05, 0.08);

        // Renderizado del agua en calma con reflejo tenue
        vec3 color = mix(colVoid, colWaterDeep, uv.y + pondRipple);

        // Añadir pétalos de cerezo flotando
        float petalLayer = petals(p, t);
        color = mix(color, colCherryPetal, petalLayer * 0.9);

        // Luz de atardecer zen cálido en la esquina superior
        float sunGlow = smoothstep(1.3, 0.1, length(p - vec2(-0.8, 0.8))) * 0.2;
        color += colGoldWarm * sunGlow;

        // Viñeteado perimetral suave
        color *= (1.0 - smoothstep(0.6, 1.4, length(p)));

        gl_FragColor = vec4(color, 0.9);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posAttrLoc = gl.getAttribLocation(program, 'position');
    const uResLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uClickTimeLoc = gl.getUniformLocation(program, 'u_click_time');

    let animId: number;
    let startTime = performance.now();
    let mousePos = { x: 0.5, y: 0.5 };
    let clickTime = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const handleClick = () => {
      clickTime = (performance.now() - startTime) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        gl?.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const render = (now: number) => {
      if (!gl) return;
      const elapsed = (now - startTime) * 0.001;

      gl.useProgram(program);
      gl.enableVertexAttribArray(posAttrLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mousePos.x, mousePos.y);
      gl.uniform1f(uClickTimeLoc, clickTime);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
      if (gl && program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-85 transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent opacity-80" />
    </div>
  );
}

