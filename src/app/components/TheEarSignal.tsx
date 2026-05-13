"use client";
import React, { useState } from 'react';
import { 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Eye, 
  X, 
  Fingerprint, 
  Mic2, 
  Lock,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';

type SignalMode = 'split' | 'artist_manifesto' | 'artist_form' | 'fan_access';

const TheEarSignal: React.FC = () => {
  const [mode, setMode] = useState<SignalMode>('split');
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artistData, setArtistData] = useState({
    videoLink: '',
    metrics: '',
    linchpin: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArtistData({ ...artistData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.submitLead({
        type: 'artist_candidate',
        source: 'the_ear_signal_funnel',
        section: 'certification_flow',
        data: artistData,
        timestamp: new Date().toISOString()
      });
      setFormStep(3);
    } catch (error) {
      console.error("Error al enviar candidatura:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TheGreatDivide = () => (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050505]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#ecb613]/3 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] mb-10">
          <Radio size={14} className="animate-pulse" /> Protocolo The Ear Signal
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
          EL 99% ES RUIDO.<br/>
          SOMOS LA <span className="text-[#ecb613]">SEÑAL</span>.
        </h1>
        
        <p className="text-white/40 text-sm md:text-lg max-w-2xl mx-auto uppercase tracking-widest font-bold mb-16 leading-relaxed">
          Arquitectura de talento asimétrica. Si tu frecuencia es pura, el ecosistema te pertenece.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setMode('artist_manifesto')} 
            className="group cursor-pointer bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-[#ecb613]/30 transition-all duration-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mic2 size={80} />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#ecb613] transition-colors uppercase tracking-tight">Soy Creador</h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed font-bold uppercase tracking-wide">No buscamos rellenos de cartel. Buscamos Arquitectos de Experiencia.</p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Iniciar Certificación <ArrowRight size={16} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => setMode('fan_access')} 
            className="group cursor-pointer bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-[#ecb613]/30 transition-all duration-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Fingerprint size={80} />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 group-hover:text-[#ecb613] transition-colors uppercase tracking-tight">Soy Curador</h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed font-bold uppercase tracking-wide">El algoritmo te da lo viral. Nosotros te damos lo legendario.</p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Solicitar Acceso VIP <ArrowRight size={16} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const ArtistForm = () => (
    <div className="min-h-screen py-24 px-6 bg-[#050505] flex justify-center items-center relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full bg-[#ecb613]/5 blur-[150px] opacity-20 pointer-events-none" />
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 p-10 md:p-16 rounded-[3rem] relative shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
       >
          <div className="absolute top-10 right-10 text-[#ecb613] font-black text-[10px] uppercase tracking-[0.4em]">Fase {formStep}/3</div>
          
          <AnimatePresence mode="wait">
            {formStep === 1 && (
               <motion.div 
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">1. Tu Huella Digital</h3>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Link Video (Actuación)</label>
                        <input name="videoLink" value={artistData.videoLink} onChange={handleInputChange} type="url" className="w-full bg-black border border-white/10 p-6 text-white rounded-2xl focus:border-[#ecb613] outline-none transition-all font-bold" placeholder="Youtube / Vimeo..." />
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Métricas Reales</label>
                        <input name="metrics" value={artistData.metrics} onChange={handleInputChange} type="text" className="w-full bg-black border border-white/10 p-6 text-white rounded-2xl focus:border-[#ecb613] outline-none transition-all font-bold" placeholder="Engagement, Audiencia media..." />
                     </div>
                     <button onClick={() => setFormStep(2)} className="w-full py-6 bg-white/[0.05] text-white font-black uppercase tracking-[0.3em] hover:bg-[#ecb613] hover:text-black transition-all rounded-2xl text-[10px]">Avanzar Protocolo</button>
                  </div>
               </motion.div>
            )}
            
            {formStep === 2 && (
               <motion.div 
                 key="step2"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-10"
               >
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">2. Filosofía de Escenario</h3>
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">¿Cuál es tu 'Linchpin'? (Valor Único)</label>
                        <textarea name="linchpin" value={artistData.linchpin} onChange={handleInputChange} rows={4} className="w-full bg-black border border-white/10 p-6 text-white rounded-2xl focus:border-[#ecb613] outline-none resize-none transition-all font-bold" placeholder="¿Por qué eres incomparable?"></textarea>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2">Email de Contacto Corporativo</label>
                        <input name="email" value={artistData.email} onChange={handleInputChange} type="email" className="w-full bg-black border border-white/10 p-6 text-white rounded-2xl focus:border-[#ecb613] outline-none transition-all font-bold" placeholder="tu@empresa.com" />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <button onClick={() => setFormStep(1)} className="py-6 border border-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl text-[10px] hover:bg-white/5 transition-all">Atrás</button>
                        <button onClick={handleFinalSubmit} disabled={isSubmitting} className="py-6 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-2xl text-[10px] shadow-[0_0_30px_rgba(236,182,19,0.3)]">
                          {isSubmitting ? 'Transmitiendo...' : 'Emitir Señal'}
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
            
            {formStep === 3 && (
               <motion.div 
                 key="step3"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center py-12 space-y-8"
               >
                  <div className="w-24 h-24 bg-[#ecb613]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ecb613]/30 shadow-[0_0_40px_rgba(236,182,19,0.2)]">
                     <ShieldCheck className="text-[#ecb613]" size={48} />
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Señal Capturada</h3>
                  <p className="text-white/40 max-w-md mx-auto italic uppercase tracking-widest text-[10px] font-bold leading-relaxed">
                    "Los datos han sido digitalizados. Si tu frecuencia es pura, recibirás el Kit de Autoridad en 48h."
                  </p>
                  <button onClick={() => setMode('split')} className="px-10 py-4 border border-white/10 text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em] text-[10px] font-black rounded-xl">Volver al Origen</button>
               </motion.div>
            )}
          </AnimatePresence>
       </motion.div>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-20 font-sans">
      {mode === 'split' && <TheGreatDivide />}
      
      {mode === 'artist_manifesto' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto text-left border-l-4 border-[#ecb613] pl-10 md:pl-16 py-8"
          >
            <span className="text-[#ecb613] font-black text-[12px] uppercase tracking-[0.5em] mb-10 block">Manifiesto de Ingreso S-Class</span>
            <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-none tracking-tighter uppercase">
              ANTES DE APLICAR,<br/>ENTIENDE ESTO:
            </h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-16 uppercase tracking-wide font-bold">
              EAR NO ES UN DIRECTORIO. SOMOS UNA <strong className="text-white">INFRAESTRUCTURA DE TALENTO</strong>. EXIGIMOS EXCELENCIA ABSOLUTA. SI BUSCAS "BOLOS" RÁPIDOS, NO APLIQUES. SI BUSCAS CONSTRUIR UN ACTIVO PATRIMONIAL, ESTÁS EN EL LUGAR CORRECTO.
            </p>
            <button 
              onClick={() => setMode('artist_form')} 
              className="px-12 py-6 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-2xl shadow-[0_20px_50px_rgba(236,182,19,0.3)] text-xs"
            >
              ACEPTO EL DESAFÍO S-CLASS
            </button>
          </motion.div>
        </div>
      )}
      
      {mode === 'artist_form' && <ArtistForm />}
      
      {mode === 'fan_access' && (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/3 blur-[120px] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white/[0.02] border border-white/5 p-16 rounded-[3rem] text-center backdrop-blur-3xl shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
          >
             <div className="mb-10 p-5 bg-[#ecb613]/10 rounded-2xl w-fit text-[#ecb613] border border-[#ecb613]/20 mx-auto">
               <Eye size={32}/>
             </div>
             <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Información Asimétrica</h3>
             <p className="text-white/40 mb-12 text-[10px] font-black uppercase tracking-widest leading-relaxed">
               Únete al Círculo Interior para recibir acceso anticipado a "Soundchecks" y grabaciones inéditas de alto impacto.
             </p>
             <button 
               onClick={() => setMode('split')} 
               className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-[#ecb613] transition-all text-[10px]"
             >
               REGISTRAR INTERÉS VIP
             </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TheEarSignal;
