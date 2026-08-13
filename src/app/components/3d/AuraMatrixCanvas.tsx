'use client';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import * as THREE from 'three';

const AuraMatrixCanvas = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Torus geometry
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xecb613, wireframe: true });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);

    // Icosahedron geometry
    const icosahedronGeometry = new THREE.IcosahedronGeometry(5);
    const icosahedronMaterial = new THREE.MeshBasicMaterial({ color: 0xecb613, wireframe: true });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);

    // Positioning
    torus.position.set(-5, 0, 0);
    icosahedron.position.set(5, 0, 0);

    scene.add(torus);
    scene.add(icosahedron);

    camera.position.z = 30;

    // Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
    const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);

    scene.add(particlesMesh);

    // Animation loop
    let angle = 0;
    const animate = () => {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.01;
      icosahedron.rotation.y += 0.01;

      particlesMesh.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      document.body.removeChild(renderer.domElement);
      scene.remove(torus);
      scene.remove(icosahedron);
      scene.remove(particlesMesh);

      torus.geometry.dispose();
      icosahedron.geometry.dispose();
      particlesMesh.geometry.dispose();

      torusMaterial.dispose();
      icosahedronMaterial.dispose();
      particleMaterial.dispose();

      renderer.dispose();
    };
  }, []);

  return (
    <canvas className="fixed inset-0 z-0 pointer-events-none" />
  );
};

export default dynamic(() => Promise.resolve(AuraMatrixCanvas), {
  ssr: false,
});