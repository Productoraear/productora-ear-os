import React from 'react';

export const SovereignSkeleton = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="relative">
      <div className="w-24 h-24 border-2 border-ear-gold/20 border-t-ear-gold rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-ear-gold/10 rounded-xl animate-pulse" />
      </div>
      <p className="mt-8 text-[10px] text-ear-gold font-black uppercase tracking-[0.6em] text-center animate-pulse">Sincronizando Nexus...</p>
    </div>
  </div>
);
