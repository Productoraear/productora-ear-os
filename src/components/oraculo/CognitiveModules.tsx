import React, { useState } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Headphones, 
  Globe, 
  ActivitySquare,
  Cpu,
  PenTool,
  MessageSquare
} from 'lucide-react';

export default function CognitiveModules() {
  const [brainType, setBrainType] = useState('corporativo'); // corporativo, artistico, hibrido
  const [operationMode, setOperationMode] = useState('consultor'); // consultor, generador

  const modules = [
    {
      id: 'hostility',
      name: 'Simulador de Hostilidad (Red Teaming)',
      icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
      desc: 'Simula ataques conversacionales, negociaciones agresivas o inyecciones al RAG.',
      status: 'OPERATIVO',
    },
    {
      id: 'yield',
      name: 'Radar de Escasez y Yield Management',
      icon: <TrendingUp className="w-5 h-5 text-amber-400" />,
      desc: 'Monitoriza disponibilidad de fechas clave, infiriendo precios dinámicos según saturación.',
      status: 'OPERATIVO',
    },
    {
      id: 'retention',
      name: 'Analizador de Retención Auditiva',
      icon: <Headphones className="w-5 h-5 text-purple-400" />,
      desc: 'Cerebro Artístico: Filtra frecuencias de rebote y evalúa acústica percibida (SPL 12 W/pax).',
      status: 'CALIBRADO',
    },
    {
      id: 'sclass',
      name: 'Traductor Aristocrático Transaccional',
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      desc: 'S-Class Filter: Re-escribe interacciones descartando fricción, inyectando fricción solo para proteger valor.',
      status: 'ACTIVO',
    },
    {
      id: 'vimume',
      name: 'Motor de Catarsis Terapéutica',
      icon: <ActivitySquare className="w-5 h-5 text-emerald-400" />,
      desc: 'VIMUME: Integra frecuencias Gamma 40 Hz y SROI para deducción Ley 49/2002.',
      status: 'ACTIVO',
    }
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#09090d] border border-[#ecb613]/20 shadow-[0_10px_40px_rgba(236,182,19,0.05)] space-y-8 animate-in fade-in zoom-in duration-500">
      
      {/* Header y Selectores */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h3 className="text-xl font-bold text-white font-serif flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#ecb613]" /> Armamento Cognitivo
          </h3>
          <p className="text-gray-400 text-xs mt-1">Configuración del motor de inferencia proactivo (LLM Engine).</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-lg border border-white/10">
            <button 
              onClick={() => setBrainType('corporativo')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${brainType === 'corporativo' ? 'bg-[#ecb613] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              CORPORATIVO
            </button>
            <button 
              onClick={() => setBrainType('artistico')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${brainType === 'artistico' ? 'bg-[#ecb613] text-black' : 'text-gray-400 hover:text-white'}`}
            >
              ARTÍSTICO
            </button>
            <button 
              onClick={() => setBrainType('hibrido')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${brainType === 'hibrido' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              HÍBRIDO
            </button>
          </div>

          <div className="flex items-center gap-2 bg-black/50 p-1.5 rounded-lg border border-white/10">
            <button 
              onClick={() => setOperationMode('consultor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${operationMode === 'consultor' ? 'bg-[#258DCD] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> CHAT / CONSULTOR
            </button>
            <button 
              onClick={() => setOperationMode('generador')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all ${operationMode === 'generador' ? 'bg-[#258DCD] text-white' : 'text-gray-400 hover:text-white'}`}
            >
              <PenTool className="w-3.5 h-3.5" /> EDITOR / GENERADOR
            </button>
          </div>
        </div>
      </div>

      {/* Grid de 5 Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div key={mod.id} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-[#ecb613]/30 hover:bg-[#14141e] transition-all group flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#ecb613]/10 transition-colors">
                  {mod.icon}
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-sm bg-emerald-950/50 text-emerald-400 border border-emerald-500/20 font-mono">
                  {mod.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{mod.name}</h4>
              <p className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors">
                {mod.desc}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-gray-600 font-mono uppercase">Inferencia local</span>
              <button className="text-xs font-bold text-[#ecb613] opacity-0 group-hover:opacity-100 transition-opacity">
                Configurar →
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
