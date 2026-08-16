'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Brain, Users, Activity, ShieldCheck, Sparkles, 
  ChevronRight, Building2, Phone, FileText, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';

// Carga diferida de los módulos de alta capacidad rescatados de la vertical
const ProVimumePage = dynamic(() => import('@/modules/SClassScreens/PRO_VIMUMEPAGE'), { ssr: false });
const VIMUMEClinicalBlock = dynamic(() => import('@/modules/SClassScreens/PRO_VIMUMECLINICALBLOCK').then(m => m.VIMUMEClinicalBlock), { ssr: false });
const VimumeFamilyDashboard = dynamic(() => import('@/modules/SClassScreens/PRO_VIMUMEFAMILYDASHBOARD').then(m => m.VimumeFamilyDashboard), { ssr: false });

export default function VimumeMasterHub() {
  const [activeView, setActiveView] = useState<'public' | 'clinical' | 'family'>('public');

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f1e8] selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* 🌌 HERO STRATEGIC HEADER */}
      <section className="relative pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto border-b border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono tracking-widest uppercase">
              <Brain size={13} />
              <span>FUNDACIÓN VIMUME // VIAJE MUSICAL POR LA MEMORIA</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight text-white font-syne">
              NEURO-REMINISCENCIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-[#ecb613]">ACTIVA</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-2xl font-light">
              Protocolos de estimulación cognitiva sonora para residencias, centros de día y familias. Licitaciones B2G (NextGenerationEU) y Musicoterapia de Precisión Grado Clínico.
            </p>
          </div>

          {/* SELECTOR DE VISTAS S-CLASS */}
          <div className="flex flex-wrap gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveView('public')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeView === 'public'
                  ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Proyecto & Estrategia
            </button>
            <button
              onClick={() => setActiveView('clinical')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeView === 'clinical'
                  ? 'bg-[#ecb613] text-black shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Evidencia Clínica (40Hz)
            </button>
            <button
              onClick={() => setActiveView('family')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeView === 'family'
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Portal Familias
            </button>
          </div>
        </div>

        {/* CTA B2G & FAMILIAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <a
            href={CENTRALITA.tel}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-pink-500/40 flex items-center justify-between group transition-all"
          >
            <div>
              <span className="text-[10px] font-mono text-pink-400 block uppercase">Convocatoria 2026</span>
              <h4 className="text-sm font-bold text-white">Solicitar Piloto en Residencia</h4>
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
          </a>

          <Link
            href="/vimume/prensa"
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ecb613]/40 flex items-center justify-between group transition-all"
          >
            <div>
              <span className="text-[10px] font-mono text-[#ecb613] block uppercase">Medios & Dossier</span>
              <h4 className="text-sm font-bold text-white">Kit Institucional & ODS 2030</h4>
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-[#ecb613] group-hover:translate-x-1 transition-all" />
          </Link>

          <a
            href={CENTRALITA.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] flex items-center justify-between group transition-all text-[#25D366]"
          >
            <div>
              <span className="text-[10px] font-mono block uppercase">Atención Inmediata</span>
              <h4 className="text-sm font-bold">WhatsApp Terapeutas de Guardia</h4>
            </div>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </section>

      {/* 🚀 CONTENIDO DINÁMICO TRASPLANTADO */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <AnimatePresence mode="wait">
          {activeView === 'public' && (
            <motion.div
              key="public"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12"
            >
              <ProVimumePage />
              <VIMUMEClinicalBlock ciudad="Madrid & Nacional" />
            </motion.div>
          )}

          {activeView === 'clinical' && (
            <motion.div
              key="clinical"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <VIMUMEClinicalBlock ciudad="Centros Sociosanitarios Homologados" />
            </motion.div>
          )}

          {activeView === 'family' && (
            <motion.div
              key="family"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <VimumeFamilyDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
