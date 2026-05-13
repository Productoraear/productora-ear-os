// Ruta: src/app/components/studio/InteractiveLessonMaster.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Send, ChevronRight, HelpCircle, ShieldCheck } from 'lucide-react';

interface LessonProps {
  title: string;
  description: string;
  onValidation: (input: string) => void;
}

export const InteractiveLessonMaster: React.FC<LessonProps> = ({ title, description, onValidation }) => {
  const [proof, setProof] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleValidation = async () => {
    setIsValidating(true);
    // Simulación de validación forense
    setTimeout(() => {
      onValidation(proof);
      setIsValidating(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Player de Video NASA */}
      <div className="aspect-video w-full bg-black rounded-3xl border border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/158/800/600')] bg-cover bg-center opacity-40 grayscale"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] active:scale-90 transition-transform">
            <Play size={32} fill="currentColor" className="ml-1" />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-[10px] font-mono text-[#D4AF37] opacity-60">
          <span>SIGNAL_ENCRYPTED_V.4.2</span>
          <span>EDWIN AGUDELO OFFICIAL</span>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[2.5rem]">
        <h2 className="text-2xl font-['Cinzel'] font-black text-white mb-4">{title}</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 italic">"{description}"</p>

        <div className="space-y-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                <HelpCircle size={18} />
             </div>
             <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Prueba de Trabajo Táctica</h4>
          </div>
          
          <textarea 
            value={proof}
            onChange={(e) => setProof(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl p-5 text-sm text-gray-300 outline-none focus:border-[#D4AF37] min-h-[120px] transition-all"
            placeholder="Define aquí tu arquitectura de patrimonio o infraestructura técnica para validación..."
          />

          <button 
            onClick={handleValidation}
            disabled={!proof || isValidating}
            className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 disabled:opacity-30 transition-all"
          >
            {isValidating ? "SINCRONIZANDO CON EL ORÁCULO..." : "VALIDAR INFRAESTRUCTURA"} <ShieldCheck size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
