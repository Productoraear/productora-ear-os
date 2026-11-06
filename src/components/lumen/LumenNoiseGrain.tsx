'use client';

import React from 'react';

/**
 * LumenNoiseGrain
 * Ultra-lightweight SVG FeTurbulence noise grain overlay.
 * Fixed, pointer-events-none, strictly GPU-accelerated.
 * Gives the OLED dark aesthetic that tactile analog depth characteristic of HorizonX & Awwwards sites.
 */
export function LumenNoiseGrain() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-20 opacity-[0.035] mix-blend-overlay"
      aria-hidden="true"
    >
      <svg className="w-full h-full">
        <filter id="lumen-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#lumen-noise-filter)" />
      </svg>
    </div>
  );
}

