'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Activity, ShieldCheck, Compass } from 'lucide-react';

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

export default function PrismaDiamondHero3D({ onSelectRole }: PrismaDiamondHero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeAxis, setActiveAxis] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Escena, Cámara y Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 13;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Luces Prismáticas (Rubí, Cyan y Oro)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const rubyLight = new THREE.PointLight(0xff2b44, 3.5, 30);
    rubyLight.position.set(-6, 4, 6);
    scene.add(rubyLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 3.5, 30);
    cyanLight.position.set(6, -4, 6);
    scene.add(cyanLight);

    const goldLight = new THREE.PointLight(0xecb613, 2.5, 25);
    goldLight.position.set(0, 7, -3);
    scene.add(goldLight);

    // 3. DIAMANTE CENTRAL S-CLASS (Geometría Octaédrica Facetada con Refracción)
    const diamondGroup = new THREE.Group();
    scene.add(diamondGroup);

    // Malla facetada de diamante
    const diamondGeometry = new THREE.OctahedronGeometry(2.4, 0);
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x050508,
      emissive: 0x110204,
      roughness: 0.08,
      metalness: 0.2,
      transmission: 0.88,
      ior: 2.417, // Índice de refracción real del diamante
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
    diamondGroup.add(diamondMesh);

    // Aristas de luz del diamante (Borde resplandeciente Rubí/Cyan)
    const edgesGeometry = new THREE.EdgesGeometry(diamondGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xff2b44,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const diamondEdges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    diamondGroup.add(diamondEdges);

    // Sprite central con el logotipo oficial de Productora EAR
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/brand/ear_logo_official_diamond.png', (texture) => {
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      const logoSprite = new THREE.Sprite(spriteMaterial);
      logoSprite.scale.set(1.9, 1.9, 1);
      diamondGroup.add(logoSprite);
    });

    // 4. ANILLOS ORBITALES & GRAFO NEXO (5 Ejes Soberanos)
    const nexoGroup = new THREE.Group();
    scene.add(nexoGroup);

    // Anillo orbital exterior
    const orbitRingGeometry = new THREE.RingGeometry(5.2, 5.25, 64);
    const orbitRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeometry, orbitRingMaterial);
    orbitRing.rotation.x = Math.PI / 2.6;
    nexoGroup.add(orbitRing);

    // 5 Nodos de los Ejes con líneas conectoras al Diamante
    const nodeMeshes: THREE.Mesh[] = [];
    const lineGeometries: THREE.BufferGeometry[] = [];
    const radius = 5.2;

    AXIS_NODES.forEach((axis) => {
      const x = Math.cos(axis.angle) * radius;
      const z = Math.sin(axis.angle) * radius;
      const y = Math.sin(axis.angle * 2) * 0.7;

      // Esfera del nodo
      const nodeGeom = new THREE.SphereGeometry(0.35, 16, 16);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(axis.color),
        emissive: new THREE.Color(axis.color),
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { id: axis.id, label: axis.label, color: axis.color };
      nexoGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Línea conectora sináptica hacia el Diamante central
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(axis.color),
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      nexoGroup.add(line);
      lineGeometries.push(lineGeom);
    });

    // 5. NUBE DE PARTÍCULAS PRISMÁTICAS (NEXO & POLVO CÓSMICO)
    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const pColor1 = new THREE.Color(0xff2b44);
    const pColor2 = new THREE.Color(0x00e5ff);
    const pColor3 = new THREE.Color(0xecb613);

    for (let i = 0; i < particleCount; i++) {
      const r = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi);
      particlePositions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);

      const chosenColor = i % 3 === 0 ? pColor1 : i % 3 === 1 ? pColor2 : pColor3;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. INTERACCIÓN CON RATÓN Y GIROSCOPIO (Suavizado Inercial)
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 1.3;
      targetRotX = y * 0.9;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 1.1;
        targetRotX = y * 0.7;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 7. RESPONSIVE RESIZE OBSERVER (Cero desbordamiento horizontal)
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      // Ajuste de distancia de cámara para móviles (pantallas estrechas)
      camera.position.z = w < 768 ? 16 : 13;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    handleResize();

    // 8. BUCLE DE ANIMACIÓN
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Suavizado inercial hacia la posición del ratón
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Rotación y flotación del Diamante (PRISMA)
      diamondGroup.rotation.y = elapsedTime * 0.35 + currentRotY;
      diamondGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + currentRotX;
      diamondGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.22;

      // Rotación del sistema orbital NEXO
      nexoGroup.rotation.y = -elapsedTime * 0.18 + currentRotY * 0.4;
      nexoGroup.rotation.z = Math.sin(elapsedTime * 0.3) * 0.08;

      // Pulsación de partículas
      particles.rotation.y = elapsedTime * 0.06;
      particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

      // Oscilación de luces de color
      rubyLight.position.x = Math.sin(elapsedTime * 0.8) * 7;
      cyanLight.position.x = -Math.sin(elapsedTime * 0.8) * 7;

      renderer.render(scene, camera);
    };

    animate();

    // 9. LIMPIEZA TOTAL DE RECURSOS AL DESMONTAR
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();

      diamondGeometry.dispose();
      diamondMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      orbitRingGeometry.dispose();
      orbitRingMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] flex items-center justify-center overflow-hidden bg-[#030305] select-none"
    >
      {/* ── 1. CANVAS THREE.JS 3D BACKGROUND (100% RESPONSIVE) ── */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* ── 2. GRADIENTES CINEMÁTICOS MONOCROMO S-CLASS ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305]/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,43,68,0.06)_0%,rgba(0,229,255,0.04)_40%,transparent_75%)] pointer-events-none z-10" />

      {/* ── 3. OVERLAY DE INFORMACIÓN Y CONTROL SOBERANO ── */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-between min-h-full pointer-events-none text-center">
        
        {/* BADGE SUPERIOR DE AUTORIDAD */}
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-[#FF2B44]/40 backdrop-blur-xl shadow-[0_0_25px_rgba(255,43,68,0.3)] animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-2 h-2 rounded-full bg-[#FF2B44] animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-white">
            PRODUCTORA EAR // CENTRO GRAVITACIONAL 3D
          </span>
          <span className="text-[9px] font-mono text-[#00E5FF] hidden sm:inline">
            PRISMA x NEXO
          </span>
        </div>

        {/* TÍTULO CENTRAL DISRUPTIVO */}
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

        {/* ── 4. HUD INFERIOR DE ACCESO DIRECTO A LOS 5 EJES (100% RESPONSIVE) ── */}
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
                  className={`p-3 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col justify-between text-left group cursor-pointer ${
                    isActive 
                      ? 'bg-white/10 scale-[1.04] shadow-[0_0_30px_rgba(0,0,0,0.8)]' 
                      : 'bg-black/60 hover:bg-black/80 border-white/10'
                  }`}
                  style={{
                    borderColor: isActive ? node.color : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? `0 0 25px ${node.color}40` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: node.color }} 
                    />
                    <span className="text-[9px] font-mono text-zinc-500 uppercase">
                      {node.tag}
                    </span>
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

        {/* PIE DE TELEMETRÍA */}
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
}
