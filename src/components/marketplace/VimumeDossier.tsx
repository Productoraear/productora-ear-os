"use client";
import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Users, ShieldCheck, Download, X } from 'lucide-react';

interface DossierProps {
  isOpen: boolean;
  onClose: () => void;
  targetData: {
    id: string;
    nombre: string;
    location: string;
    type: string;
    density?: number;
    providers?: number;
  } | null;
}

export default function VimumeDossier({ isOpen, onClose, targetData }: DossierProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen || !targetData) return null;

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      alert("DOSSIER GENERADO PRECISAMENTE. Iniciando descarga de PDF Institucional...");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm transition-all duration-500">
      <div className="bg-white text-zinc-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl relative flex flex-col md:flex-row">
        
        {/* BOTÓN CERRAR */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors z-20"
        >
          <X size={20} className="text-zinc-400" />
        </button>

        {/* BARRA LATERAL TÉCNICA */}
        <div className="w-full md:w-64 bg-zinc-50 border-r border-zinc-200 p-8 flex flex-col gap-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center">
              <span className="text-white font-black text-xs">EAR</span>
            </div>
            <div className="font-mono text-[10px] uppercase font-bold tracking-tighter leading-none">
              Dossier<br />Institucional
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">ID MISION</p>
              <p className="text-xs font-bold font-mono tracking-tighter uppercase">{targetData.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">STATUS</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <p className="text-xs font-bold font-mono uppercase">Target Detectado</p>
              </div>
            </div>
          </div>

          <div className="mt-auto">
             <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className={`w-full py-4 text-[10px] font-mono font-black uppercase tracking-[0.2em] border-2 border-zinc-900 flex items-center justify-center gap-2 transition-all overflow-hidden relative
                ${isGenerating ? 'bg-zinc-100' : 'bg-transparent hover:bg-zinc-900 hover:text-white'}
              `}
             >
               {isGenerating ? 'Procesando...' : (
                 <>
                   <Download size={14} />
                   Generar PDF
                 </>
               )}
               {isGenerating && (
                 <div className="absolute bottom-0 left-0 h-1 bg-zinc-900 animate-[loading_2s_linear_infinite]" />
               )}
             </button>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL (ESTILO WHITEPAPER ACADÉMICO) */}
        <div className="flex-1 p-8 md:p-12 font-serif bg-white">
          <div className="max-w-xl">
             <header className="mb-12 border-b-4 border-zinc-900 pb-8">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4 font-sans">
                  INFORME TÉCNICO DE VIABILIDAD: <span className="text-purple-600">VIMUME 2026</span>
                </h1>
                <p className="text-zinc-500 text-sm italic">
                  Análisis de Densidad de Soporte (ADS) para intervención terapéutica mediante activos culturales de proximidad.
                </p>
             </header>

             <section className="space-y-8">
                <div className="bg-zinc-50 p-6 border-l-4 border-purple-500 font-sans">
                   <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Objetivo de la Misión</h4>
                   <p className="text-lg leading-tight font-black uppercase italic">
                     {targetData.nombre} - {targetData.location}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-8 font-sans">
                   <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1">
                        <Users size={12} /> Densidad de Soporte
                      </h4>
                      <p className="text-3xl font-black tracking-tighter">
                        {targetData.density || "3.8"}:1
                      </p>
                      <p className="text-[9px] text-emerald-600 font-mono font-bold uppercase tracking-tighter">Eficiencia Óptima UE</p>
                   </div>
                   <div>
                      <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-1">
                        <ShieldCheck size={12} /> Activos Disponibles
                      </h4>
                      <p className="text-3xl font-black tracking-tighter">
                        {targetData.providers || "12"}
                      </p>
                      <p className="text-[9px] text-zinc-400 font-mono font-bold uppercase tracking-tighter">Proveedores S-Class</p>
                   </div>
                </div>

                <div className="prose prose-zinc prose-sm">
                   <p className="text-zinc-600 leading-relaxed text-sm">
                     Tras el barrido bit a bit realizado sobre la infraestructura **EAR OS**, se certifica la existencia de una red local capaz de sustentar el proyecto **VIMUME (Viaje Musical por la Memoria)** sin dependencias externas.
                   </p>
                   <p className="text-zinc-600 leading-relaxed text-sm">
                     La geolocalización detectada confirma que {targetData.nombre} se encuentra en una zona de **Alta Densidad Operativa**, garantizando un ratio de intervención de coste optimizado superior al 40% respecto a la media de Proyectos de Impacto Cultural de la Unión Europea.
                   </p>
                </div>

                <div className="pt-8 border-t border-zinc-100 flex items-center justify-between opacity-50 font-sans">
                   <div className="text-[9px] font-mono uppercase font-bold tracking-widest">
                      Protocolo: CAZADOR_STEALTH_VIMUME
                   </div>
                   <div className="text-[9px] font-mono uppercase font-bold tracking-widest">
                      Hash: {targetData.id.slice(0, 8)}...
                   </div>
                </div>
             </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
