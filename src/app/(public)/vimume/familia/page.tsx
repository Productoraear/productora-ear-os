'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowLeft, Users, Brain, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

const VimumeFamilyDashboard = dynamic(
  () => import('@/modules/SClassScreens/PRO_VIMUMEFAMILYDASHBOARD').then(m => m.VimumeFamilyDashboard),
  { ssr: false }
);

export default function VimumeFamiliaPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f1e8] selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link 
              href="/vimume" 
              className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Volver al Hub VIMUME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white font-syne">
              PORTAL FAMILIAR // <span className="text-pink-400">TELEMETRÍA NEURAL</span>
            </h1>
            <p className="text-xs md:text-sm text-white/60">
              Monitorización biométrica, bitácora de reminiscencia sonora y trazabilidad de empatía reactiva (+24%).
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Canal Seguro Encriptado SHA-256</span>
          </div>
        </div>

        {/* Dynamic Family Dashboard */}
        <VimumeFamilyDashboard />

      </div>
    </div>
  );
}
