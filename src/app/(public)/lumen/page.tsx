import React from 'react';
import type { Metadata } from 'next';
import { LumenWebGPUShaderCanvas } from '@/components/lumen/LumenWebGPUShaderCanvas';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import { LumenAtmosphericHero } from '@/components/lumen/LumenAtmosphericHero';
import { LumenBentoGrid } from '@/components/lumen/LumenBentoGrid';
import { LumenInteractiveShowcase } from '@/components/lumen/LumenInteractiveShowcase';
import { LumenPricingTerminal } from '@/components/lumen/LumenPricingTerminal';

export const metadata: Metadata = {
  title: 'Lumen Showcase · Productora EAR OS',
  description:
    'Experiencia visual y acústica de alta gama inspirada en HorizonX Lumen. Ingeniería sonora, solista de gala y contratación soberana.',
};

export default function LumenPage() {
  return (
    <main className="relative min-h-screen bg-[#030305] text-zinc-100 overflow-x-hidden selection:bg-amber-500 selection:text-zinc-950">
      {/* Background WebGL/WebGPU Reactive Shader */}
      <LumenWebGPUShaderCanvas />

      {/* Analog Noise Grain Overlay (Sequential / GPU accelerated) */}
      <LumenNoiseGrain />

      {/* Atmospheric Hero Section (Staggered Entrance) */}
      <LumenAtmosphericHero />

      {/* Bento Grid Telemetry & Invariants */}
      <LumenBentoGrid />

      {/* Interactive Acoustic & Logistics Showcase */}
      <LumenInteractiveShowcase />

      {/* Sovereign Pricing & Booking Terminal */}
      <LumenPricingTerminal />
    </main>
  );
}
