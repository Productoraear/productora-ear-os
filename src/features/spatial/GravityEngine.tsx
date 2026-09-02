'use client';

// R3F@8 JSX intrinsics for React 19 compatibility
import type { ThreeElements } from '@react-three/fiber';
/* eslint-disable @typescript-eslint/no-namespace */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { InstancedMesh, MathUtils, Color, Object3D, ShaderMaterial } from 'three';
import { useBiometricStore } from '@/lib/hooks/useBiometricIntent';

const vertexShader = `
  varying vec2 vUv;
  varying float vIntent;
  uniform float uTime;
  uniform float uIntent;

  void main() {
    vUv = uv;
    vIntent = uIntent;
    vec3 pos = position;
    
    // Animación sutil
    pos.x += sin(uTime * 0.5 + float(gl_InstanceID) * 0.1) * 0.02;
    pos.y += cos(uTime * 0.5 + float(gl_InstanceID) * 0.1) * 0.02;
    
    vec4 mvPosition = instanceMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vIntent;
  uniform vec3 uColor;
  uniform float uTime;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float strength = 0.05 / dist - 0.1;
    
    // Brillo Aura Onyx
    vec3 finalColor = uColor * strength;
    
    // Aumento de brillo por intención biométrica
    finalColor *= (1.0 + vIntent * 2.0);
    
    gl_FragColor = vec4(finalColor, strength);
  }
`;

function Particles() {
  const meshRef = useRef<InstancedMesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const { intent, mousePos } = useBiometricStore();
  const { viewport } = useThree();
  const dummy = useMemo(() => new Object3D(), []);

  // ⚡ Optimización S-Class: Conteo dinámico basado en dispositivo
  const particleCount = useMemo(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return 300;
    return 2000;
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uIntent: { value: 0 },
    uColor: { value: new Color('#d4a855') },
  }), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = MathUtils.randFloatSpread(10);
      const y = MathUtils.randFloatSpread(10);
      const z = MathUtils.randFloatSpread(10);
      temp.push({ x, y, z, speed: Math.random() });
    }
    return temp;
  }, [particleCount]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Actualización segura de uniforms sin colapsar por nulos
    if (materialRef.current && materialRef.current.uniforms) {
      if (materialRef.current.uniforms.uTime) {
        materialRef.current.uniforms.uTime.value = time;
      }
      if (materialRef.current.uniforms.uIntent) {
        materialRef.current.uniforms.uIntent.value = intent;
      }
    }

    if (meshRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const { x, y, z, speed } = p;
        
        const targetX = (mousePos.x / (typeof window !== 'undefined' ? window.innerWidth : 1) - 0.5) * viewport.width;
        const targetY = -(mousePos.y / (typeof window !== 'undefined' ? window.innerHeight : 1) - 0.5) * viewport.height;
        
        const dx = targetX - x;
        const dy = targetY - y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        let finalX = x + Math.sin(time * speed) * 0.1;
        let finalY = y + Math.cos(time * speed) * 0.1;
        
        if (intent > 0.1 && distToMouse < 2) {
          finalX += dx * intent * 0.05;
          finalY += dy * intent * 0.05;
        }

        dummy.position.set(finalX, finalY, z);
        dummy.scale.setScalar(0.02 * (1 + intent));
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  );
}

export default function GravityEngine() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setHasWebGL(support);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (hasWebGL === false) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#050505] overflow-hidden">
        {/* Fallback Aura: High Fidelity CSS Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a855]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#d4a855]/5 rounded-full blur-[80px]" />
        </div>
      </div>
    );
  }

  if (hasWebGL === null) return <div className="fixed inset-0 bg-[#050505] z-0" />;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#050505] overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
