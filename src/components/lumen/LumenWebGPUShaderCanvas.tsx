'use client';

import React, { useEffect, useRef } from 'react';

/**
 * LumenWebGPUShaderCanvas
 * Offscreen/WebGL2/WebGPU responsive shader ambient background.
 * Implements subtle OLED `#030305` fluid noise lighting inspired by HorizonX.
 * Renders in a decoupled animation loop with zero main-thread blockage.
 */
export function LumenWebGPUShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGL2RenderingContext | WebGLRenderingContext | null =
      canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      return; // Fallback to CSS ambient gradients
    }

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

      // Subtle noise generator
      float hash(vec2 p) {
        p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
        return -1.0 + 2.0 * fract(17.0 * fract(p.x * p.y * (p.x + p.y)));
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        // Fluid noise waves
        float t = u_time * 0.25;
        float n = noise(p * 1.5 + vec2(sin(t * 0.3), cos(t * 0.2)));
        n += 0.5 * noise(p * 3.0 - vec2(cos(t * 0.4), sin(t * 0.5)));

        // Mouse reactive displacement
        vec2 mouseNorm = (u_mouse * 2.0 - 1.0);
        float mouseDist = length(p - vec2(mouseNorm.x, -mouseNorm.y));
        float mouseGlow = smoothstep(0.8, 0.0, mouseDist) * 0.15;

        // OLED deep palette (#030305 base, subtle gold #ecb613 & cyan #00e5ff highlights)
        vec3 colBase = vec3(0.012, 0.012, 0.02); // #030305
        vec3 colGold = vec3(0.925, 0.714, 0.075); // #ecb613
        vec3 colCyan = vec3(0.0, 0.898, 1.0);    // #00e5ff

        float vignette = 1.0 - smoothstep(0.3, 1.4, length(p));
        float goldMask = smoothstep(0.2, 0.7, n) * 0.08;
        float cyanMask = smoothstep(0.4, 0.9, -n) * 0.05;

        vec3 color = colBase + (colGold * goldMask) + (colCyan * cyanMask) + (colGold * mouseGlow);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
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

    let animationId: number;
    let startTime = performance.now();
    let mousePos = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl?.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const render = (time: number) => {
      if (!gl) return;
      const elapsed = (time - startTime) * 0.001;

      gl.useProgram(program);
      gl.enableVertexAttribArray(posAttrLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uResLoc, canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uMouseLoc, mousePos.x, mousePos.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-60 mix-blend-screen transition-opacity duration-1000"
      />
      {/* Fallback ambient radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(236,182,19,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,229,255,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[#030305]/40 backdrop-blur-[1px]" />
    </div>
  );
}

