import React from 'react';
import OracleSearch from '../components/OracleSearch';

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-10 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black text-ear-gold uppercase tracking-[0.2em] italic">Sala Blanca S-Class</h1>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Motor de Inyección Activo</span>
          </div>
        </div>
        
        {/* LA PARRILLA DE ENSAMBLAJE */}
        <div className="border border-white/5 rounded-[3rem] p-10 bg-white/[0.02] shadow-2xl relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <p className="text-gray-600 text-center uppercase tracking-widest text-xs font-black mb-10">
              Integración de Oracle RAG
            </p>
            {/* AQUÍ INYECTAREMOS SUS COMPONENTES */}
            <OracleSearch />
          </div>
        </div>
      </div>
    </div>
  );
}
