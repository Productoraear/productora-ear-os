'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

const ProVimumeDashboard = dynamic(
  () => import('@/modules/SClassScreens/PRO_VIMUMEDASHBOARD_2').then(m => m.default || m),
  { ssr: false }
);

export default function AdminVimumePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-sans space-y-6 selection:bg-[#ecb613] selection:text-black">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase text-white font-syne">
              CENTRO DE MANDO <span className="text-pink-400">ASTRA VIMUME</span>
            </h1>
            <p className="text-xs text-white/50">
              Panel Multirrol Estratégico (CEO, Terapeuta, CFO, Data Scientist)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono">
          <Sparkles size={13} />
          <span>ASTRA COGNITIVE NODE ACTIVE</span>
        </div>
      </div>

      <ProVimumeDashboard />
    </div>
  );
}
