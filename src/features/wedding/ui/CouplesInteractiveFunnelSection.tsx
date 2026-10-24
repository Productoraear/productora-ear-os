'use client';

import React, { useState } from 'react';
import {
  Flame,
  Layers,
} from 'lucide-react';
import SequentialFunnelSClass from '@/components/mobile-fusion/SequentialFunnelSClass';
import Archetype1_TinderDeck from '@/components/mobile-fusion/Archetype1_TinderDeck';
import { playHapticClick } from '@/lib/audio/AuraAudioSynth';

export function CouplesInteractiveFunnelSection() {
  const [activeTab, setActiveTab] = useState<'funnel' | 'tinder'>('funnel');

  return (
    <div className="space-y-6">
      {/* Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#ecb613]">
              EXPERIENCIA INTERACTIVA EN DIRECTO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
            Elige tu Formato de Boda
          </h2>
          <p className="text-xs text-white/60 font-light max-w-xl">
            Prueba la experiencia de selección S-Class: haz Swipe para encontrar la sonoridad perfecta o recorre el
            embudo secuencial completo (Tinder + Airbnb + Bodas + Uber + Price-Lock).
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => {
              playHapticClick(750, 0.02);
              setActiveTab('funnel');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'funnel'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Embudo Completo
          </button>
          <button
            onClick={() => {
              playHapticClick(850, 0.02);
              setActiveTab('tinder');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tinder'
                ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Tinder Swipe
          </button>
        </div>
      </div>

      {/* Interactive Experience Container */}
      <div className="relative rounded-3xl bg-[#07070a] border border-[#ecb613]/25 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {activeTab === 'funnel' ? (
          <div className="p-2 sm:p-4">
            <SequentialFunnelSClass />
          </div>
        ) : (
          <div className="p-4 sm:p-6 min-h-[580px] flex items-center justify-center">
            <div className="w-full max-w-md">
              <Archetype1_TinderDeck />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouplesInteractiveFunnelSection;
