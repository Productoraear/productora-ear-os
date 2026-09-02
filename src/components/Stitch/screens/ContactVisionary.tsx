'use client';
import React from 'react';

export default function ContactVisionary() {
  return (
    <div className="bg-[#221d10] min-h-screen text-white font-sans p-6">
      <span className="text-[#ecb613] text-sm font-bold tracking-widest uppercase mb-2 block">Producción 360</span>
      <h1 className="text-white text-4xl md:text-5xl font-black leading-tight mb-8">HABLEMOS DE <br/><span className="text-[#ecb613]">VISIÓN</span></h1>
      
      <form className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tipo de Proyecto</p>
          <select className="w-full bg-[#332d19] border border-[#675a32] rounded-xl h-14 px-4 text-white focus:ring-1 focus:ring-[#ecb613] outline-none appearance-none">
            <option>Producción Artística</option>
            <option>Evento Corporativo</option>
            <option>Renta de Equipo (Arsenal)</option>
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Mensaje</p>
          <textarea className="w-full bg-[#332d19] border border-[#675a32] rounded-xl p-4 text-white min-h-[160px] focus:ring-1 focus:ring-[#ecb613] outline-none" placeholder="Descríbenos tu visión..."></textarea>
        </div>

        <button className="w-full h-14 bg-[#ecb613] text-black font-black rounded-xl shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-3 group">
          INICIAR PROYECTO <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </form>
    </div>
  );
}
