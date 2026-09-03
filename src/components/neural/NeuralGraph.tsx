'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import {
  TaxonomyNode,
  SimulationNode,
  SynapseLink,
  RoleKey,
  CameraState,
  MASTER_TAXONOMY
} from '@/types/neural';

interface ExtendedSimulationNode extends SimulationNode {
  expansionFactor: number;
  renderX: number;
  renderY: number;
}

interface NeuralGraphProps {
  selectedRole: RoleKey | null;
  selectedNodeId: string | null;
  onSelectRole: (role: RoleKey | null) => void;
  onSelectNode: (node: TaxonomyNode | null) => void;
  className?: string;
}

export default function NeuralGraph({
  selectedRole,
  selectedNodeId,
  onSelectRole,
  onSelectNode,
  className = ''
}: NeuralGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera state
  const cameraRef = useRef<CameraState>({
    x: 0,
    y: 0,
    zoom: 0.85,
    targetX: 0,
    targetY: 0,
    targetZoom: 0.85
  });

  // Pointer state
  const pointerRef = useRef<{
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
    isDown: boolean;
    dragMode: 'none' | 'pan' | 'node';
    draggedNodeId: string | null;
    startX: number;
    startY: number;
    hasMoved: boolean;
  }>({
    screenX: 0,
    screenY: 0,
    worldX: 0,
    worldY: 0,
    isDown: false,
    dragMode: 'none',
    draggedNodeId: null,
    startX: 0,
    startY: 0,
    hasMoved: false
  });

  const hoveredNodeIdRef = useRef<string | null>(null);

  // Graph state refs
  const nodesMapRef = useRef<Map<string, ExtendedSimulationNode>>(new Map());
  const linksRef = useRef<SynapseLink[]>([]);
  const animFrameIdRef = useRef<number>(0);
  const selectedRoleRef = useRef<RoleKey | null>(selectedRole);

  // Cache de Iconos Vanguardistas precargados para los Círculos
  const iconsRef = useRef<{
    colibri: HTMLImageElement | null;
    artistas: HTMLImageElement | null;
    eventos: HTMLImageElement | null;
    empresas: HTMLImageElement | null;
    instituciones: HTMLImageElement | null;
    root: HTMLImageElement | null;
  }>({
    colibri: null,
    artistas: null,
    eventos: null,
    empresas: null,
    instituciones: null,
    root: null
  });

  // Precarga de los Iconos Vanguardistas y el Colibrí Oficial de Sebastián Díaz
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Colibrí Oficial de Sebastián Díaz para VIMUME
    const colibriImg = new Image();
    colibriImg.src = '/images/brand/colibri_isotipo.png';
    iconsRef.current.colibri = colibriImg;

    // Función auxiliar para generar imágenes SVG en tiempo de ejecución
    const makeSvgImg = (svgInner: string, strokeColor: string) => {
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${strokeColor}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${svgInner}</svg>`;
      const img = new Image();
      img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
      return img;
    };

    // 2. Artistas: Micrófono de estudio de alta gama (#f43f5e)
    iconsRef.current.artistas = makeSvgImg(
      `<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/>`,
      '#f43f5e'
    );

    // 3. Eventos: Calendario dinámico de galas y producciones (#f59e0b)
    iconsRef.current.eventos = makeSvgImg(
      `<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>`,
      '#f59e0b'
    );

    // 4. Empresas: Arquitectura corporativa / Rascacielos vanguardista (#10b981)
    iconsRef.current.empresas = makeSvgImg(
      `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h4"/><path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
      '#10b981'
    );

    // 5. Instituciones: Columnas de estado y gobierno municipal (#06b6d4)
    iconsRef.current.instituciones = makeSvgImg(
      `<line x1="2" x2="22" y1="22" y2="22"/><line x1="4" x2="20" y1="2" y2="2"/><path d="m2 7 10-5 10 5"/><path d="M4 10v10"/><path d="M8 10v10"/><path d="M12 10v10"/><path d="M16 10v10"/><path d="M20 10v10"/><line x1="2" x2="22" y1="7" y2="7"/>`,
      '#06b6d4'
    );

    // 6. Nodo Root: DIAMANTE SOBERANO CENTRAL DE PRODUCTORA EAR
    const earDiamondImg = new Image();
    earDiamondImg.src = '/images/brand/ear_diamante_central.png';
    iconsRef.current.root = earDiamondImg;
  }, []);

  useEffect(() => {
    selectedRoleRef.current = selectedRole;
  }, [selectedRole]);

  // Build simulation graph
  useEffect(() => {
    const nodesMap = new Map<string, ExtendedSimulationNode>();
    const links: SynapseLink[] = [];

    // 1. Root Node: Centro Gravitacional Productora EAR (El Corazón del Diamante)
    const rootNode: ExtendedSimulationNode = {
      id: MASTER_TAXONOMY.id,
      label: MASTER_TAXONOMY.label,
      role: 'root',
      type: 'root',
      x: 0,
      y: 0,
      renderX: 0,
      renderY: 0,
      vx: 0,
      vy: 0,
      radius: 48,
      baseRadius: 48,
      color: '#00E5FF',
      glowColor: '#FF1A2A',
      depth: 0,
      orbitRadius: 0,
      orbitAngle: 0,
      orbitSpeed: 0,
      expansionFactor: 1.0,
      data: MASTER_TAXONOMY
    };
    nodesMap.set(rootNode.id, rootNode);

    // 2. Coordenadas Geométricas en Forma de Diamante S-Class
    // Vértices del Diamante:
    // - VIMUME: Vértice Superior / Corona de Luz (x: 0, y: -270)
    // - Artistas: Vértice Lateral Izquierdo / Hombro del Diamante (x: -260, y: -80)
    // - Eventos: Vértice Lateral Derecho / Hombro del Diamante (x: 260, y: -80)
    // - Empresas: Pabellón Inferior Izquierdo (x: -165, y: 150)
    // - Instituciones: Pabellón Inferior Derecho (x: 165, y: 150)
    const DIAMOND_COORDS: Record<string, { x: number; y: number; fanBaseAngle: number }> = {
      vimume: { x: 0, y: -270, fanBaseAngle: -Math.PI / 2 },
      artistas: { x: -260, y: -80, fanBaseAngle: -Math.PI * 0.95 },
      eventos: { x: 260, y: -80, fanBaseAngle: -Math.PI * 0.05 },
      empresas: { x: -165, y: 150, fanBaseAngle: Math.PI * 0.75 },
      instituciones: { x: 165, y: 150, fanBaseAngle: Math.PI * 0.25 }
    };

    const primaryChildren = MASTER_TAXONOMY.children || [];

    primaryChildren.forEach((pChild, idx) => {
      const coord = DIAMOND_COORDS[pChild.role] || { 
        x: Math.cos((idx / primaryChildren.length) * Math.PI * 2) * 270, 
        y: Math.sin((idx / primaryChildren.length) * Math.PI * 2) * 270,
        fanBaseAngle: (idx / primaryChildren.length) * Math.PI * 2
      };
      
      const px = coord.x;
      const py = coord.y;
      const orbitDist = Math.sqrt(px * px + py * py);
      const angle = Math.atan2(py, px);

      const pSimNode: ExtendedSimulationNode = {
        id: pChild.id,
        label: pChild.label,
        role: pChild.role,
        type: 'primary',
        x: px,
        y: py,
        renderX: px,
        renderY: py,
        vx: 0,
        vy: 0,
        radius: 35,
        baseRadius: 35,
        color: pChild.color,
        glowColor: pChild.glowColor,
        parentId: rootNode.id,
        depth: 1,
        orbitRadius: orbitDist,
        orbitAngle: angle,
        orbitSpeed: 0, // Anclados de forma estable en la geometría de diamante
        expansionFactor: 1.0, // Nodos primarios siempre visibles
        data: pChild
      };
      nodesMap.set(pSimNode.id, pSimNode);

      // Enlace Núcleo Central Diamante -> Nodo Primario
      links.push({
        id: `${rootNode.id}->${pSimNode.id}`,
        sourceId: rootNode.id,
        targetId: pSimNode.id,
        color: pChild.color,
        length: orbitDist,
        strength: 0.03,
        pulses: [
          { progress: 0.1, speed: 0.007, size: 3.5, color: pChild.color },
          { progress: 0.55, speed: 0.006, size: 2.8, color: pChild.color }
        ]
      });

      // 3. Subnodos Secundarios (Despliegue dinámico desde cada vértice)
      const secChildren = pChild.children || [];
      const secCount = secChildren.length;
      const secFanSpread = Math.PI * 0.65;
      const secBaseDist = 175;

      secChildren.forEach((sChild, sIdx) => {
        const fanBase = coord.fanBaseAngle;
        const sAngleOffset = secCount === 1 
          ? 0 
          : -secFanSpread / 2 + (sIdx / (secCount - 1)) * secFanSpread;
        const sAngle = fanBase + sAngleOffset;
        const sx = px + Math.cos(sAngle) * secBaseDist;
        const sy = py + Math.sin(sAngle) * secBaseDist;

        const sSimNode: ExtendedSimulationNode = {
          id: sChild.id,
          label: sChild.label,
          role: sChild.role,
          type: 'secondary',
          x: sx,
          y: sy,
          renderX: px,
          renderY: py,
          vx: 0,
          vy: 0,
          radius: 0,
          baseRadius: 18,
          color: sChild.color,
          glowColor: sChild.glowColor,
          parentId: pSimNode.id,
          depth: 2,
          orbitRadius: secBaseDist,
          orbitAngle: sAngle,
          orbitSpeed: 0.0005 * (sIdx % 2 === 0 ? 1 : -1),
          expansionFactor: 0.0, // Hidden until primary clicked!
          data: sChild
        };
        nodesMap.set(sSimNode.id, sSimNode);

        links.push({
          id: `${pSimNode.id}->${sSimNode.id}`,
          sourceId: pSimNode.id,
          targetId: sSimNode.id,
          color: sChild.color,
          length: secBaseDist,
          strength: 0.035,
          pulses: [
            { progress: 0.3, speed: 0.009, size: 2.5, color: sChild.color }
          ]
        });

        // 4. Leaf Nodes (Third Level)
        const leafChildren = sChild.children || [];
        const leafCount = leafChildren.length;
        const leafSpread = Math.PI * 0.55;
        const leafDist = 120;

        leafChildren.forEach((lChild, lIdx) => {
          const lAngleOffset = leafCount === 1 
            ? 0 
            : -leafSpread / 2 + (lIdx / (leafCount - 1)) * leafSpread;
          const lAngle = sAngle + lAngleOffset;
          const lx = sx + Math.cos(lAngle) * leafDist;
          const ly = sy + Math.sin(lAngle) * leafDist;

          const lSimNode: ExtendedSimulationNode = {
            id: lChild.id,
            label: lChild.label,
            role: lChild.role,
            type: 'leaf',
            x: lx,
            y: ly,
            renderX: sx,
            renderY: sy,
            vx: 0,
            vy: 0,
            radius: 0,
            baseRadius: 12,
            color: lChild.color,
            glowColor: lChild.glowColor,
            parentId: sSimNode.id,
            depth: 3,
            orbitRadius: leafDist,
            orbitAngle: lAngle,
            orbitSpeed: 0.0008,
            expansionFactor: 0.0, // Hidden until primary clicked!
            data: lChild
          };
          nodesMap.set(lSimNode.id, lSimNode);

          links.push({
            id: `${sSimNode.id}->${lSimNode.id}`,
            sourceId: sSimNode.id,
            targetId: lSimNode.id,
            color: lChild.color,
            length: leafDist,
            strength: 0.045,
            pulses: [
              { progress: 0.6, speed: 0.012, size: 2.0, color: lChild.color }
            ]
          });
        });
      });
    });

    nodesMapRef.current = nodesMap;
    linksRef.current = links;
  }, []);

  // Set camera target based on selected role
  useEffect(() => {
    if (!selectedRole) {
      cameraRef.current.targetX = 0;
      cameraRef.current.targetY = 0;
      cameraRef.current.targetZoom = 0.85;
      return;
    }

    const primaryNode = nodesMapRef.current.get(selectedRole);
    if (primaryNode) {
      cameraRef.current.targetX = -primaryNode.x * 1.35;
      cameraRef.current.targetY = -primaryNode.y * 1.35;
      cameraRef.current.targetZoom = 1.25;
    }
  }, [selectedRole]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let isDestroyed = false;

    const render = () => {
      if (isDestroyed) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      // Smooth Camera LERP
      const cam = cameraRef.current;
      cam.x += (cam.targetX - cam.x) * 0.08;
      cam.y += (cam.targetY - cam.y) * 0.08;
      cam.zoom += (cam.targetZoom - cam.zoom) * 0.08;

      const nodes = Array.from(nodesMapRef.current.values());
      const links = linksRef.current;
      const pointer = pointerRef.current;
      const curSelectedRole = selectedRoleRef.current;
      const icons = iconsRef.current;

      // 1. Expansion LERP: Subnodos florecen al hacer clic en su nodo primario
      nodes.forEach((n) => {
        if (n.type === 'secondary' || n.type === 'leaf') {
          const targetExp = n.role === curSelectedRole ? 1.0 : 0.0;
          n.expansionFactor += (targetExp - n.expansionFactor) * 0.12;
        } else {
          n.expansionFactor = 1.0;
        }

        // Compute rendered positions sprung from parent
        if (n.parentId && n.type !== 'root' && n.type !== 'primary') {
          const parent = nodesMapRef.current.get(n.parentId);
          if (parent) {
            n.renderX = parent.renderX + (n.x - parent.renderX) * n.expansionFactor;
            n.renderY = parent.renderY + (n.y - parent.renderY) * n.expansionFactor;
            n.radius = n.baseRadius * n.expansionFactor;
          }
        } else {
          n.renderX = n.x;
          n.renderY = n.y;
          n.radius = n.baseRadius;
        }
      });

      // 2. Orbital motion & subtle breathing
      nodes.forEach((n) => {
        if (n.type !== 'root' && n.parentId) {
          const parent = nodesMapRef.current.get(n.parentId);
          if (parent) {
            n.orbitAngle += n.orbitSpeed;
            const targetAnchorX = parent.x + Math.cos(n.orbitAngle) * n.orbitRadius;
            const targetAnchorY = parent.y + Math.sin(n.orbitAngle) * n.orbitRadius;
            
            const ax = (targetAnchorX - n.x) * 0.008;
            const ay = (targetAnchorY - n.y) * 0.008;
            n.vx += ax;
            n.vy += ay;
          }
        }
      });

      // 3. Spring force along links
      links.forEach((link) => {
        const source = nodesMapRef.current.get(link.sourceId);
        const target = nodesMapRef.current.get(link.targetId);
        if (!source || !target) return;
        if (target.expansionFactor < 0.02) return;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - link.length) * link.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (source.type !== 'root') {
          source.vx += fx * 0.4;
          source.vy += fy * 0.4;
        }
        if (target.id !== pointer.draggedNodeId) {
          target.vx -= fx * 0.5;
          target.vy -= fy * 0.5;
        }
      });

      // 4. Node-Node Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          if (a.expansionFactor < 0.02 || b.expansionFactor < 0.02) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy;
          const minDist = (a.radius + b.radius) * 2.2;
          
          if (distSq < minDist * minDist && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const repForce = ((minDist - dist) / dist) * 0.08;
            const rx = dx * repForce;
            const ry = dy * repForce;

            if (a.type !== 'root' && a.id !== pointer.draggedNodeId) {
              a.vx -= rx;
              a.vy -= ry;
            }
            if (b.type !== 'root' && b.id !== pointer.draggedNodeId) {
              b.vx += rx;
              b.vy += ry;
            }
          }
        }
      }

      // 5. Pointer Gravitational Response
      if (!pointer.draggedNodeId) {
        nodes.forEach((n) => {
          if (n.expansionFactor < 0.02) return;
          const dx = n.renderX - pointer.worldX;
          const dy = n.renderY - pointer.worldY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 140;

          if (dist < influenceRadius && dist > 0 && n.type !== 'root') {
            const push = ((influenceRadius - dist) / influenceRadius) * 0.35;
            n.vx += (dx / dist) * push;
            n.vy += (dy / dist) * push;
          }
        });
      }

      // 6. Velocity integration & damping
      nodes.forEach((n) => {
        if (n.id === pointer.draggedNodeId) {
          n.x = pointer.worldX;
          n.y = pointer.worldY;
          n.vx = 0;
          n.vy = 0;
        } else if (n.type !== 'root') {
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.88;
          n.vy *= 0.88;
        } else {
          n.x = 0;
          n.y = 0;
          n.vx = 0;
          n.vy = 0;
        }
      });

      // ================= DRAW CANVAS =================
      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep Obsidian Background
      const bgGrad = ctx.createRadialGradient(
        width / 2, height / 2, 80,
        width / 2, height / 2, Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0a0b12');
      bgGrad.addColorStop(0.5, '#06070a');
      bgGrad.addColorStop(1, '#030305');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2 + cam.x;
      const centerY = height / 2 + cam.y;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(cam.zoom, cam.zoom);

      // 💎 ESTRUCTURA CRISTALINA DEL DIAMANTE S-CLASS EN EL FONDO
      // 1. Rayo Láser / Haz Vertical de Luz Ascendente
      const beamGrad = ctx.createLinearGradient(0, -360, 0, 320);
      beamGrad.addColorStop(0, 'rgba(0, 229, 255, 0.6)');
      beamGrad.addColorStop(0.3, 'rgba(0, 229, 255, 0.25)');
      beamGrad.addColorStop(0.7, 'rgba(255, 26, 42, 0.3)');
      beamGrad.addColorStop(1, 'rgba(255, 26, 42, 0.7)');

      ctx.save();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = beamGrad;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(0, -350);
      ctx.lineTo(0, 310);
      ctx.stroke();

      // Halo difuso del rayo
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, -350);
      ctx.lineTo(0, 310);
      ctx.stroke();
      ctx.restore();

      // 2. Facetas Geométricas del Diamante (Conexiones Criptográficas)
      const diamondApex = { x: 0, y: -270 };
      const diamondLeft = { x: -260, y: -80 };
      const diamondRight = { x: 260, y: -80 };
      const diamondPavLeft = { x: -165, y: 150 };
      const diamondPavRight = { x: 165, y: 150 };
      const diamondCulet = { x: 0, y: 290 };

      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.18)';
      ctx.shadowColor = 'rgba(0, 229, 255, 0.3)';
      ctx.shadowBlur = 8;

      // Silueta Exterior del Diamante
      ctx.beginPath();
      ctx.moveTo(diamondApex.x, diamondApex.y);
      ctx.lineTo(diamondRight.x, diamondRight.y);
      ctx.lineTo(diamondPavRight.x, diamondPavRight.y);
      ctx.lineTo(diamondCulet.x, diamondCulet.y);
      ctx.lineTo(diamondPavLeft.x, diamondPavLeft.y);
      ctx.lineTo(diamondLeft.x, diamondLeft.y);
      ctx.closePath();
      ctx.stroke();

      // Facetas Internas del Diamante que Convergen en el Centro Gravitacional
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(255, 26, 42, 0.15)';
      ctx.beginPath();
      // Línea de cintura horizontal
      ctx.moveTo(diamondLeft.x, diamondLeft.y);
      ctx.lineTo(diamondRight.x, diamondRight.y);
      // Triangulaciones hacia el núcleo
      ctx.moveTo(diamondLeft.x, diamondLeft.y);
      ctx.lineTo(0, 0);
      ctx.moveTo(diamondRight.x, diamondRight.y);
      ctx.lineTo(0, 0);
      ctx.moveTo(diamondPavLeft.x, diamondPavLeft.y);
      ctx.lineTo(0, 0);
      ctx.moveTo(diamondPavRight.x, diamondPavRight.y);
      ctx.lineTo(0, 0);
      ctx.moveTo(diamondApex.x, diamondApex.y);
      ctx.lineTo(0, 0);
      ctx.moveTo(diamondCulet.x, diamondCulet.y);
      ctx.lineTo(0, 0);
      ctx.stroke();

      // 3. Esfera Rubí Flotante en el Vértice Inferior (Culet)
      const pulseTime = Date.now() * 0.003;
      const sphereGlow = 10 + Math.sin(pulseTime) * 3;
      ctx.shadowColor = '#FF1A2A';
      ctx.shadowBlur = sphereGlow;
      ctx.fillStyle = '#FF1A2A';
      ctx.beginPath();
      ctx.arc(diamondCulet.x, diamondCulet.y + 15, 5, 0, Math.PI * 2);
      ctx.fill();

      // Órbitas sutiles
      ctx.shadowBlur = 0;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      [220, 390, 540].forEach((r) => {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      const activeRole = curSelectedRole || (hoveredNodeIdRef.current ? nodesMapRef.current.get(hoveredNodeIdRef.current)?.role : null);

      // Draw Synapse Lines & Pulses
      links.forEach((link) => {
        const source = nodesMapRef.current.get(link.sourceId);
        const target = nodesMapRef.current.get(link.targetId);
        if (!source || !target) return;

        const minExpansion = Math.min(source.expansionFactor, target.expansionFactor);
        if (minExpansion < 0.02) return;

        const isLinkActive = !activeRole || activeRole === 'root' || source.role === activeRole || target.role === activeRole;
        const linkAlpha = (isLinkActive ? 0.38 : 0.04) * minExpansion;

        ctx.beginPath();
        ctx.moveTo(source.renderX, source.renderY);
        ctx.lineTo(target.renderX, target.renderY);
        ctx.strokeStyle = link.color;
        ctx.globalAlpha = linkAlpha;
        ctx.lineWidth = isLinkActive ? 1.6 : 0.8;
        ctx.stroke();

        // Synaptic Pulses
        if (isLinkActive && minExpansion > 0.4) {
          link.pulses.forEach((pulse) => {
            pulse.progress += pulse.speed;
            if (pulse.progress > 1) pulse.progress = 0;

            const px = source.renderX + (target.renderX - source.renderX) * pulse.progress;
            const py = source.renderY + (target.renderY - source.renderY) * pulse.progress;

            ctx.globalAlpha = 0.85 * minExpansion;
            ctx.fillStyle = pulse.color || link.color;
            ctx.beginPath();
            ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
            ctx.fill();

            // Pulse glow
            ctx.beginPath();
            ctx.arc(px, py, pulse.size * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = pulse.color || link.color;
            ctx.globalAlpha = 0.2 * minExpansion;
            ctx.fill();
          });
        }
      });

      // Draw Nodes (only those expanded)
      nodes.forEach((n) => {
        if (n.expansionFactor < 0.02) return;

        const isHovered = hoveredNodeIdRef.current === n.id;
        const isSelected = selectedNodeId === n.id || curSelectedRole === n.id;
        const isNodeActive = !activeRole || activeRole === 'root' || n.role === activeRole || n.role === 'root';
        const nodeAlpha = (isNodeActive ? 1 : 0.15) * n.expansionFactor;

        ctx.globalAlpha = nodeAlpha;

        // 1. Glow Layer
        const glowRadius = (isHovered || isSelected ? n.radius * 2.8 : n.radius * 1.8) * n.expansionFactor;
        const glow = ctx.createRadialGradient(n.renderX, n.renderY, n.radius * 0.4, n.renderX, n.renderY, glowRadius);
        glow.addColorStop(0, n.glowColor);
        glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.renderX, n.renderY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Node Core Disk
        ctx.beginPath();
        ctx.arc(n.renderX, n.renderY, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.type === 'root' ? '#0f1118' : '#08090d';
        ctx.fill();

        // 3. Border Ring
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = isSelected ? '#ffffff' : n.color;
        ctx.stroke();

        // 4. Inner Ring for Primary / Root
        if (n.type === 'root' || n.type === 'primary') {
          ctx.beginPath();
          ctx.arc(n.renderX, n.renderY, n.radius * 0.72, 0, Math.PI * 2);
          ctx.strokeStyle = n.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = nodeAlpha * 0.4;
          ctx.stroke();
          ctx.globalAlpha = nodeAlpha;
        }

        // 5. ICONOS VANGUARDISTAS DENTRO DE LOS CÍRCULOS (Canvas Rendering)
        if (n.type === 'primary') {
          // Si es el eje VIMUME: El auténtico Colibrí de Sebastián Díaz
          if (n.role === 'vimume' && icons.colibri && icons.colibri.complete) {
            const colibriW = n.radius * 1.45;
            const colibriH = colibriW * (586 / 795);
            ctx.save();
            ctx.globalAlpha = nodeAlpha * (isHovered || isSelected ? 1 : 0.9);
            ctx.drawImage(
              icons.colibri,
              n.renderX - colibriW / 2 + 1,
              n.renderY - colibriH / 2,
              colibriW,
              colibriH
            );
            ctx.restore();
          } else {
            // Ejes restantes: Artistas, Eventos, Empresas, Instituciones
            const iconImg = icons[n.role as keyof typeof icons];
            if (iconImg && iconImg.complete) {
              const iconSize = n.radius * 1.05;
              ctx.save();
              ctx.globalAlpha = nodeAlpha * (isHovered || isSelected ? 1 : 0.85);
              ctx.drawImage(
                iconImg,
                n.renderX - iconSize / 2,
                n.renderY - iconSize / 2,
                iconSize,
                iconSize
              );
              ctx.restore();
            }
          }
        } else if (n.type === 'root') {
          // Nodo central Productora EAR: DIAMANTE CENTRAL SOBERANO
          const rootImg = icons.root;
          if (rootImg && rootImg.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(n.renderX, n.renderY, n.radius * 0.92, 0, Math.PI * 2);
            ctx.clip();
            const imgSize = n.radius * 1.95;
            ctx.drawImage(
              rootImg,
              n.renderX - imgSize / 2,
              n.renderY - imgSize / 2,
              imgSize,
              imgSize
            );
            ctx.restore();

            // Anillo Especular Diamante Cian & Rubí
            ctx.beginPath();
            ctx.arc(n.renderX, n.renderY, n.radius * 0.92, 0, Math.PI * 2);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#00E5FF';
            ctx.stroke();

            // Halo sutil exterior
            ctx.beginPath();
            ctx.arc(n.renderX, n.renderY, n.radius, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(255, 26, 42, 0.4)';
            ctx.stroke();
          }
        } else if (n.type === 'secondary' && n.expansionFactor > 0.4) {
          // Sub-nodos secundarios: Micro-núcleo interno pulsante
          ctx.beginPath();
          ctx.arc(n.renderX, n.renderY, n.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = n.color;
          ctx.globalAlpha = nodeAlpha * 0.75;
          ctx.fill();
          ctx.globalAlpha = nodeAlpha;
        }

        // 6. Typography Labels exteriores elegantes
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (n.type === 'root') {
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('PRODUCTORA EAR', n.renderX, n.renderY + n.radius + 15);
          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = '#00E5FF';
          ctx.fillText('CENTRO GRAVITACIONAL', n.renderX, n.renderY + n.radius + 26);
        } else if (n.type === 'primary') {
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(n.label.toUpperCase(), n.renderX, n.renderY + n.radius + 14);

          ctx.font = 'bold 8px monospace';
          ctx.fillStyle = n.color;
          ctx.fillText(n.data.tag || 'EJE SOBERANO', n.renderX, n.renderY + n.radius + 25);
        } else if (n.type === 'secondary') {
          if (n.expansionFactor > 0.4) {
            ctx.font = '500 9px Inter, sans-serif';
            ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
            ctx.fillText(n.label, n.renderX, n.renderY + n.radius + 12);
          }
        } else if (n.type === 'leaf') {
          if (n.expansionFactor > 0.6 && (isHovered || isSelected)) {
            ctx.font = '400 8.5px Inter, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(n.label, n.renderX, n.renderY + n.radius + 10);
          }
        }
      });

      ctx.restore();
      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [selectedNodeId]);

  // Coordinate Conversion Helper: Screen to Graph World
  const screenToWorld = useCallback((screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cam = cameraRef.current;
    const clientX = screenX - rect.left;
    const clientY = screenY - rect.top;
    const worldX = (clientX - canvas.clientWidth / 2 - cam.x) / cam.zoom;
    const worldY = (clientY - canvas.clientHeight / 2 - cam.y) / cam.zoom;
    return { x: worldX, y: worldY };
  }, []);

  // Find node under mouse
  const getNodeAt = useCallback((worldX: number, worldY: number): ExtendedSimulationNode | null => {
    const nodes = Array.from(nodesMapRef.current.values());
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (n.expansionFactor < 0.2) continue;

      const dx = n.renderX - worldX;
      const dy = n.renderY - worldY;
      const hitRadius = Math.max(n.radius * 1.35, 18);
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        return n;
      }
    }
    return null;
  }, []);

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);

    const { x: worldX, y: worldY } = screenToWorld(e.clientX, e.clientY);
    const hitNode = getNodeAt(worldX, worldY);

    pointerRef.current = {
      screenX: e.clientX,
      screenY: e.clientY,
      worldX,
      worldY,
      isDown: true,
      dragMode: hitNode ? 'node' : 'pan',
      draggedNodeId: hitNode && hitNode.type !== 'root' ? hitNode.id : null,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x: worldX, y: worldY } = screenToWorld(e.clientX, e.clientY);
    const pointer = pointerRef.current;
    pointer.worldX = worldX;
    pointer.worldY = worldY;

    if (pointer.isDown) {
      const deltaX = e.clientX - pointer.screenX;
      const deltaY = e.clientY - pointer.screenY;

      if (Math.abs(e.clientX - pointer.startX) > 4 || Math.abs(e.clientY - pointer.startY) > 4) {
        pointer.hasMoved = true;
      }

      if (pointer.dragMode === 'pan') {
        cameraRef.current.x += deltaX;
        cameraRef.current.y += deltaY;
        cameraRef.current.targetX = cameraRef.current.x;
        cameraRef.current.targetY = cameraRef.current.y;
      }

      pointer.screenX = e.clientX;
      pointer.screenY = e.clientY;
    } else {
      const hitNode = getNodeAt(worldX, worldY);
      hoveredNodeIdRef.current = hitNode ? hitNode.id : null;
      canvas.style.cursor = hitNode ? 'pointer' : 'grab';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}

    const pointer = pointerRef.current;
    if (!pointer.hasMoved) {
      const { x: worldX, y: worldY } = screenToWorld(e.clientX, e.clientY);
      const clickedNode = getNodeAt(worldX, worldY);

      if (clickedNode) {
        onSelectNode(clickedNode.data);

        if (clickedNode.role !== 'root') {
          if (clickedNode.type === 'primary') {
            onSelectRole(selectedRoleRef.current === clickedNode.role ? null : clickedNode.role);
          } else {
            onSelectRole(clickedNode.role);
          }

          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('ear-role-selected', {
                detail: {
                  role: clickedNode.role,
                  nodeId: clickedNode.id,
                  label: clickedNode.label,
                  type: clickedNode.type
                }
              })
            );
          }
        } else {
          onSelectRole(null);
          onSelectNode(null);
        }
      } else {
        onSelectRole(null);
        onSelectNode(null);
      }
    }

    pointer.isDown = false;
    pointer.dragMode = 'none';
    pointer.draggedNodeId = null;
    canvas.style.cursor = 'grab';
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.min(Math.max(cameraRef.current.targetZoom * zoomFactor, 0.4), 2.8);
    cameraRef.current.targetZoom = newZoom;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      />
    </div>
  );
}
