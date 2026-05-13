'use client';
import React, { useState } from 'react';

const AFFINITY_NODES = [
  { id: 'vanguard', label: 'Vanguardia Visual', icon: '✨', aura: 9.8 },
  { id: 'acoustic', label: 'Resonancia Acústica', icon: '🔊', aura: 9.2 },
  { id: 'logistic', label: 'Precisión Logística', icon: '⚡', aura: 9.5 },
  { id: 'luxury', label: 'Opulencia S-Class', icon: '💎', aura: 9.9 },
  { id: 'organic', label: 'Flujo Orgánico', icon: '🌿', aura: 8.7 },
];

export default function NeuralFilter({ onFilterChange }: { onFilterChange?: (activeNodes: string[]) => void }) {
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const toggleNode = (id: string) => {
    const nextNodes = activeNodes.includes(id) 
      ? activeNodes.filter(n => n !== id)
      : [...activeNodes, id];
      
    setActiveNodes(nextNodes);
    
    // Simular escaneo cuántico de la matriz de datos
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (onFilterChange) onFilterChange(nextNodes);
    }, 800);
  };

  return (
    <div className="w-full relative py-8">
      <div className="flex flex-col space-y-6">
        
        {/* Header del Filtro */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold font-syne text-white flex items-center">
              Afinidad Cuántica
              {isScanning && (
                <span className="ml-3 flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-[#d4a855] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#d4a855] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#d4a855] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </h4>
            <p className="text-white/50 text-sm font-manrope mt-1">Sintoniza la matriz para revelar nodos convergentes.</p>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-black text-[#d4a855] font-syne">
              {activeNodes.length === 0 ? '∞' : `+${(activeNodes.length * 12.4).toFixed(1)}%`}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Variación de Sinergia</div>
          </div>
        </div>

        {/* Nodos de Afinidad */}
        <div className="flex flex-wrap gap-3">
          {AFFINITY_NODES.map((node) => {
            const isActive = activeNodes.includes(node.id);
            return (
              <button
                key={node.id}
                onClick={() => toggleNode(node.id)}
                className={`group relative flex items-center px-5 py-3 rounded-2xl transition-all duration-300 overflow-hidden font-inter border ${
                  isActive 
                    ? 'bg-white text-black border-transparent shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {/* Indicador de Aura Cuántica */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4a855]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
                
                <span className="mr-2 text-lg z-10">{node.icon}</span>
                <span className={`text-sm font-bold tracking-wide z-10 ${isActive ? 'text-black' : 'text-white/80'}`}>
                  {node.label}
                </span>
                
                <div className={`ml-3 pl-3 border-l text-xs font-black z-10 ${isActive ? 'border-black/20 text-[#b68d3a]' : 'border-white/20 text-blue-400'}`}>
                  {node.aura} ⚡
                </div>
              </button>
            );
          })}
        </div>

        {/* Neural Scan Line (Efecto visual) */}
        <div className="h-[1px] w-full bg-white/10 relative overflow-hidden mt-4">
          <div className={`absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-[#d4a855] to-transparent ${isScanning ? 'animate-[scan_1s_ease-in-out_infinite]' : 'opacity-0'}`} />
        </div>
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
