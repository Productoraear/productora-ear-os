'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { Activity, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function LatticeColibriHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying40Hz, setIsPlaying40Hz] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Escena, Cámara y Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.035);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Luces Neuroacústicas (Violeta, Cyan y Esmeralda)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const violetLight = new THREE.PointLight(0x8b5cf6, 4, 30);
    violetLight.position.set(-5, 3, 5);
    scene.add(violetLight);

    const cyanLight = new THREE.PointLight(0x27c3a8, 4, 30);
    cyanLight.position.set(5, -3, 5);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xfdb927, 2, 20);
    amberLight.position.set(0, 5, -2);
    scene.add(amberLight);

    // 3. GRUPO CENTRAL DEL COLIBRÍ EN VUELO (LATTICE / MATERIA)
    const colibriGroup = new THREE.Group();
    scene.add(colibriGroup);

    // Sprite central con el isotipo del Colibrí en alta fidelidad
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/brand/colibri_logo_completo.png', (texture) => {
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const colibriSprite = new THREE.Sprite(spriteMat);
      colibriSprite.scale.set(3.6, 3.6, 1);
      colibriGroup.add(colibriSprite);
    });

    // 4. MALLA DE ONDAS Y PARTÍCULAS A 40 HZ (LATTICE NEUROACÚSTICO)
    const particleCount = 850;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalY = new Float32Array(particleCount);

    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorTeal = new THREE.Color(0x27c3a8);
    const colorGold = new THREE.Color(0xfdb927);

    for (let i = 0; i < particleCount; i++) {
      // Distribución en espiral / aura volumétrica de memoria
      const radius = 1.2 + Math.pow(Math.random(), 1.6) * 6.5;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 4.2;

      const x = Math.cos(angle) * radius;
      const y = elevation;
      const z = Math.sin(angle) * radius;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalY[i] = y;

      const mixVal = Math.random();
      const c = mixVal < 0.5 ? colorViolet.clone().lerp(colorTeal, mixVal * 2) : colorTeal.clone().lerp(colorGold, (mixVal - 0.5) * 2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.085,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const latticePoints = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(latticePoints);

    // Anillo de resonancia Gamma
    const ringGeo = new THREE.TorusGeometry(3.8, 0.025, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x27c3a8,
      transparent: true,
      opacity: 0.35,
    });
    const resonanceRing = new THREE.Mesh(ringGeo, ringMat);
    resonanceRing.rotation.x = Math.PI / 2.3;
    colibriGroup.add(resonanceRing);

    // 5. INTERACCIÓN INERCIAL CON EL RATÓN / PANTALLA TÁCTIL
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 1.2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.8;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        targetX = ((touch.clientX - rect.left) / rect.width - 0.5) * 1.0;
        targetY = ((touch.clientY - rect.top) / rect.height - 0.5) * 0.6;
      }
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // 6. REDIMENSIONAMIENTO RESPONSIVE (100% SIN DESBORDAMIENTO HORIZONTAL)
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.position.z = w < 768 ? 15 : 12;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObs = new ResizeObserver(() => onResize());
    resizeObs.observe(container);
    onResize();

    // 7. BUCLE DE ONDAS GAMMA 40 HZ
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Suavizado hacia el cursor
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // El aleteo y vuelo del colibrí en el espacio
      colibriGroup.position.x = Math.sin(t * 1.1) * 0.35 + currentX * 1.5;
      colibriGroup.position.y = Math.sin(t * 2.2) * 0.25 - currentY * 1.2;
      colibriGroup.rotation.y = Math.sin(t * 0.9) * 0.18 + currentX * 0.5;
      colibriGroup.rotation.z = Math.sin(t * 1.8) * 0.06;

      // Resonancia a 40 Hz en la nube de partículas
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        // Modulación senoidal rápida simulando el pulso a 40 Hz
        const wave = Math.sin(t * 8.0 + posArray[idx] * 2.0) * 0.12;
        posArray[idx + 1] = originalY[i] + wave;
      }
      posAttr.needsUpdate = true;

      // Rotación suave del campo de partículas
      latticePoints.rotation.y = t * 0.08;
      resonanceRing.rotation.z = t * 0.25;

      // Luces orbitantes
      violetLight.position.x = Math.sin(t * 0.7) * 6;
      cyanLight.position.x = -Math.sin(t * 0.7) * 6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      resizeObs.disconnect();

      particleGeometry.dispose();
      particleMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] flex items-center justify-center overflow-hidden bg-[#030305] select-none"
    >
      {/* ── 1. CANVAS THREE.JS LATTICE 3D ── */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* ── 2. GRADIENTES CINEMÁTICOS MONOCROMO & AURA VIMUME ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,rgba(39,195,168,0.05)_40%,transparent_75%)] pointer-events-none z-10" />

      {/* ── 3. OVERLAY CLINICO Y ACCIÓN INSTITUCIONAL (100% RESPONSIVE) ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-between min-h-full pointer-events-none text-center">
        
        {/* BADGE CLÍNICO DE ALTA AUTORIDAD */}
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/70 border border-[#8B5CF6]/50 backdrop-blur-xl shadow-[0_0_25px_rgba(139,92,246,0.35)] animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-2 h-2 rounded-full bg-[#27c3a8] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-white">
            PROYECTO VIMUME // ONDAS GAMMA 40 HZ
          </span>
          <span className="text-[9px] font-mono text-[#AAD6CD] hidden sm:inline">
            MODELO LATTICE x MATERIA
          </span>
        </div>

        {/* TÍTULO CLÍNICO & NEUROACÚSTICA */}
        <div className="mt-8 sm:mt-12 space-y-3 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne uppercase tracking-tight text-white leading-tight">
            VIAJE MUSICAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#27c3a8] to-[#fdb927] italic">
              POR LA MEMORIA
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-mono font-light max-w-xl mx-auto leading-relaxed">
            Estimulación neuroacústica de precisión para personas mayores y centros de día. El Colibrí despierta recuerdos autobiográficos a través de frecuencias bioarmónicas certificadas (&lt; 75 dB SPL).
          </p>
        </div>

        {/* BOTONES DE ACCIÓN CLÍNICA Y MECENAZGO */}
        <div className="pointer-events-auto mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
          <Link
            href="/vimume/protocolo"
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6d28d9] text-white font-mono text-xs font-bold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:scale-105 transition-transform"
          >
            <span>PROTOCOLO CLÍNICO</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/vimume/donar"
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-[#27c3a8]/50 text-[#27c3a8] font-mono text-xs font-bold transition-all hover:scale-105"
          >
            <Heart size={14} className="text-[#27c3a8]" />
            <span>MECENAZGO 80%</span>
          </Link>
        </div>

        {/* GARANTÍAS INSTITUCIONALES EN EL PIE */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-[#27c3a8]" />
            Límite Acústico &lt; 75 dB SPL
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Activity size={12} className="text-[#8B5CF6]" />
            Estudio Clínico N=45 (p &lt; 0.05)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#fdb927]" />
            Ley 49/2002 Modelo 182 AEAT
          </span>
        </div>

      </div>
    </div>
  );
}
