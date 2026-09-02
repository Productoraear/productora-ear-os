'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const AuraMatrixCanvas = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Torus geometry (Gold wireframe accent)
    const torusGeometry = new THREE.TorusGeometry(12, 2.5, 16, 80);
    const torusMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xecb613, 
      wireframe: true,
      transparent: true,
      opacity: 0.15 
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);

    // Icosahedron geometry
    const icosahedronGeometry = new THREE.IcosahedronGeometry(6, 1);
    const icosahedronMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xd4af37, 
      wireframe: true,
      transparent: true,
      opacity: 0.12 
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);

    torus.position.set(-6, 2, -5);
    icosahedron.position.set(6, -2, -5);

    scene.add(torus);
    scene.add(icosahedron);

    camera.position.z = 28;

    // Atmospheric Stardust Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 80;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({ 
      color: 0xecb613, 
      size: 0.15,
      transparent: true,
      opacity: 0.35 
    });
    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);

    scene.add(particlesMesh);

    let animationFrameId: number;

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      torus.rotation.x += 0.003;
      torus.rotation.y += 0.004;

      icosahedron.rotation.x -= 0.002;
      icosahedron.rotation.y += 0.003;

      particlesMesh.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.remove(torus);
      scene.remove(icosahedron);
      scene.remove(particlesMesh);

      torusGeometry.dispose();
      icosahedronGeometry.dispose();
      particleGeometry.dispose();

      torusMaterial.dispose();
      icosahedronMaterial.dispose();
      particleMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden" 
    />
  );
};

export default dynamic(() => Promise.resolve(AuraMatrixCanvas), {
  ssr: false,
});