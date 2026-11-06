'use client';

import React, { useEffect, useRef } from 'react';

/**
 * VigilCinematicWebGLLogoPortal
 * Inspirado en HorizonX Vigil: escena viva en WebGL con atmósfera de pasaje medieval,
 * piedra procedural iluminada por luna fría y brasa dorada, conectando al Logo central de EAR OS.
 * Desacoplado del hilo principal, sin bloqueo, acelerado por hardware con degradación elegante.
 */
export function VigilCinematicWebGLLogoPortal() {
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

      // Generador de sillería y relieve de piedra procedural estilo Vigil (siglo XIV)
      float stonePattern(vec2 p) {
        vec2 grid = fract(p * 3.5) - 0.5;
        vec2 id = floor(p * 3.5);
        float d = length(grid);
        float mortar = smoothstep(0.42, 0.48, max(abs(grid.x), abs(grid.y)));
        return (1.0 - mortar) * (0.85 + 0.15 * sin(id.x * 12.0 + id.y * 3.7));
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        float t = u_time * 0.2;

        // Atmósfera nocturna de páramo Vigil: luna fría pálida cenital + brasa dorada (#ecb613) central
        vec3 colNightVoid = vec3(0.012, 0.012, 0.02); // #030305 base
        vec3 colPaleMoon  = vec3(0.65, 0.75, 0.9);   // Luz de luna fría
        vec3 colGoldEmber = vec3(0.925, 0.714, 0.075); // Brasa dorada soberana EAR OS

        // Portal circular de entrada (el arco del castillo donde vive el logo)
        float r = length(p);
        float arch = smoothstep(0.75, 0.2, r);

        // Textura sutil de piedra en los márgenes
        float stone = stonePattern(p + vec2(0.0, t * 0.05));

        // Pulsación de la brasa dorada central
        float emberPulse = sin(t * 3.0) * 0.1 + 0.9;
        float emberGlow = smoothstep(0.45, 0.0, r) * emberPulse;

        // Luz de luna descendente
        float moonRay = smoothstep(1.2, -0.2, p.y + sin(p.x * 2.0 + t) * 0.15) * 0.15;

        vec3 color = colNightVoid;
        color += colPaleMoon * moonRay * stone * 0.4;
        color += colGoldEmber * emberGlow * 0.6;

        // Viñeteado exterior profundo
        color *= (1.0 - smoothstep(0.5, 1.4, r));

        gl_FragColor = vec4(color, 0.75);
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

    let animId: number;
    let startTime = performance.now();

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
      gl.uniform2f(uMouseLoc, 0.5, 0.5);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (gl && program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-80 mix-blend-screen transition-opacity duration-1000"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,182,19,0.12),transparent_65%)]" />
    </div>
  );
}

