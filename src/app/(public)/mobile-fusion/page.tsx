'use client';

import React, { useState } from 'react';
import SequentialFunnelSClass from '@/components/mobile-fusion/SequentialFunnelSClass';
import MobileFusionContainer from '@/components/mobile-fusion/MobileFusionContainer';

export default function MobileFusionPage() {
  const [view, setView] = useState<'funnel' | 'lab'>('funnel');

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-[#020203]/90 backdrop-blur-xl border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#ecb613] text-black flex items-center justify-center font-black text-[11px]">Ω</div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white">EAR OS Mobile Fusion</span>
        </div>
        <button
          onClick={() => setView(v => (v === 'funnel' ? 'lab' : 'funnel'))}
          className="py-2 px-3 min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-mono text-white/70 transition-all"
        >
          {view === 'funnel' ? 'Ver Laboratorio (10 Arquetipos)' : 'Ver Funnel Secuencial'}
        </button>
      </div>
      {view === 'funnel' ? <SequentialFunnelSClass /> : <MobileFusionContainer />}
    </>
  );
}
