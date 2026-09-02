'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MeshGradientBackgroundProps {
  intensity?: 'subtle' | 'vibrant' | 'stage';
  children?: React.ReactNode;
}

export function MeshGradientBackground({ 
  intensity = 'stage', 
  children 
}: MeshGradientBackgroundProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden text-white">
      {/* 🔮 Dynamic Mesh Gradients (WebGL-Simulated 60FPS Ambient Lights) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow Orb 1 - Imperial Gold */}
        <motion.div
          animate={{
            x: ['-20%', '30%', '-10%', '-20%'],
            y: ['-10%', '40%', '10%', '-10%'],
            scale: [1, 1.25, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#ecb613]/25 via-amber-600/10 to-transparent blur-[120px]"
        />

        {/* Glow Orb 2 - Deep Stage Violet / Purple */}
        <motion.div
          animate={{
            x: ['20%', '-20%', '10%', '20%'],
            y: ['40%', '-10%', '30%', '40%'],
            scale: [1.1, 0.9, 1.2, 1.1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-purple-900/20 via-amber-950/15 to-transparent blur-[140px]"
        />

        {/* Glow Orb 3 - Cobalt Stage Atmosphere */}
        <motion.div
          animate={{
            x: ['-10%', '15%', '-25%', '-10%'],
            y: ['20%', '-20%', '10%', '20%'],
            scale: [0.9, 1.15, 1, 0.9],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-blue-950/15 via-amber-500/10 to-transparent blur-[160px]"
        />

        {/* High-End Film Noise Grid Layer */}
        <div 
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(#ecb613 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        {/* Top & Bottom Vignette Shadow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505] pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
