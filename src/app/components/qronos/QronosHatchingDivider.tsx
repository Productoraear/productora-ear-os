'use client';

import React from 'react';

export function QronosHatchingDivider({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative mx-auto h-10 w-full max-w-[1344px] lg:w-[calc(100%-3.5rem)] ${className}`}>
      {/* Hatching Diagonal Pattern */}
      <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 border-y border-white/[0.12] bg-[repeating-linear-gradient(135deg,transparent_0,transparent_6px,rgba(255,255,255,0.06)_6px,rgba(255,255,255,0.06)_7px)]" />

      {/* Top Left Crosshair */}
      <span className="absolute left-0 top-0 z-10 size-3 -translate-x-1/2 -translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-[linear-gradient(to_bottom,transparent,rgba(226,232,240,0.65)_50%,transparent)] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-[linear-gradient(to_right,transparent,rgba(226,232,240,0.65)_50%,transparent)]" />

      {/* Top Right Crosshair */}
      <span className="absolute right-0 top-0 z-10 size-3 translate-x-1/2 -translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-[linear-gradient(to_bottom,transparent,rgba(226,232,240,0.65)_50%,transparent)] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-[linear-gradient(to_right,transparent,rgba(226,232,240,0.65)_50%,transparent)]" />

      {/* Bottom Left Crosshair */}
      <span className="absolute bottom-0 left-0 z-10 size-3 -translate-x-1/2 translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-[linear-gradient(to_bottom,transparent,rgba(226,232,240,0.65)_50%,transparent)] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-[linear-gradient(to_right,transparent,rgba(226,232,240,0.65)_50%,transparent)]" />

      {/* Bottom Right Crosshair */}
      <span className="absolute bottom-0 right-0 z-10 size-3 translate-x-1/2 translate-y-1/2 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:-translate-x-1/2 before:bg-[linear-gradient(to_bottom,transparent,rgba(226,232,240,0.65)_50%,transparent)] after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:-translate-y-1/2 after:bg-[linear-gradient(to_right,transparent,rgba(226,232,240,0.65)_50%,transparent)]" />
    </div>
  );
}
