
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronRight, 
  Zap, 
  ArrowLeft, 
  CheckCircle,
  GraduationCap,
  Play
} from 'lucide-react';
import { Course } from '@/types';

interface ProfesorIAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfesorIAModal: React.FC<ProfesorIAModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulación de generación por ahora, conectaremos con Gemini después
    setTimeout(() => {
      setLoading(false);
      // Aquí iría el setCourse con los datos de Gemini
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-slate-900 border border-gold-500/30 rounded-3xl shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-black" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">PROFESOR<span className="text-gold-500">IA</span></h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Mente Maestra S-Class</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {!course ? (
            <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">¿Qué quieres dominar hoy?</h3>
                <p className="text-slate-400">Diseñaremos un plan de estudio acelerado con el ADN de EAR.</p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej: Embudos de Venta, Marca Personal..."
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-white focus:border-gold-500 outline-none transition-all"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-gold-500/20"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-black/30 border-t-black rounded-full" />
                  ) : (
                    <>
                      <Zap size={20} />
                      <span>INICIAR CLASE MAGISTRAL</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Aquí irá la visualización del curso rescatado */}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
