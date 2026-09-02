'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { GraduationCap, Users, Award, Plus, Sparkles, BookOpen } from 'lucide-react';

const AcademyPanel = dynamic(
  () => import('@/modules/SClassScreens/panels/AcademyPanel').then(mod => mod.AcademyPanel || mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex items-center justify-center animate-pulse">
        <span className="text-slate-400 font-mono text-xs">Cargando Panel de Gestión LMS...</span>
      </div>
    )
  }
);

export default function AdminAcademyPage() {
  return (
    <div className="min-h-screen bg-[#050505] p-4 lg:p-8 text-white font-sans space-y-8">
      
      {/* HEADER DE MANDO */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#ecb613] text-xs font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full bg-[#ecb613]/5">
            Campus Nexus :: Gobernanza Educativa
          </span>
          <h1 className="text-3xl font-black mt-3 tracking-tight">ACADEMIA DE ARTISTAS & CERTIFICACIÓN</h1>
          <p className="text-slate-400 text-sm mt-1">Supervisión de alumnos, progreso de módulos, validación de insignias y catálogo de materiales.</p>
        </div>

        <button 
          onClick={() => alert("Módulo de Creación de Lección S-Class")}
          className="flex items-center gap-2 bg-[#ecb613] text-black font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-[#d4a210] transition-all shadow-lg cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Lección
        </button>
      </div>

      {/* MÉTRICAS GENERALES DE CAMPUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Artistas Matriculados</span>
            <Users className="w-5 h-5 text-[#ecb613]" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-white">50</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">MRR Campus: 2.450 € / mes</span>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Tasa de Certificación</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-white">92%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Insignia S-Class en Cotizador</span>
        </div>

        <div className="bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-mono">Módulos Activos</span>
            <BookOpen className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold mt-2 text-white">4</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Sonido, Legal, Booking, ODS</span>
        </div>
      </div>

      {/* CONTENEDOR DEL PANEL LMS */}
      <div className="space-y-6">
        <Suspense fallback={
          <div className="h-96 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex items-center justify-center animate-pulse">
            <span className="text-slate-400 font-mono text-xs">Cargando Panel...</span>
          </div>
        }>
          <AcademyPanel />
        </Suspense>
      </div>

    </div>
  );
}
