"use client";

import React, { useState } from 'react';
import { 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  Fingerprint, 
  Mic2, 
  Lock,
  Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

type SignalMode = 'split' | 'artist_manifesto' | 'artist_form' | 'fan_access';

export default function TheSignal() {
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
      console.error("[TheSignal] Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const TheGreatDivide = () => (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center p-6 overflow-hidden bg-[#050505]">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#ecb613]/3 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center max-w-5xl mx-auto space-y-8"
      >
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] mx-auto">
          <Radio size={14} className="animate-pulse" /> Protocolo The Ear Signal S-Class
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none uppercase italic">
          EL 99% ES RUIDO.<br/>
          SOMOS LA <span className="text-[#ecb613] text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#ffd471]">SEÑAL</span>.
        </h1>
        
        <p className="text-white/40 text-xs md:text-sm max-w-xl mx-auto uppercase tracking-[0.2em] font-bold leading-relaxed">
          Arquitectura de talento asimétrica de Edwin Agudelo. Si tu frecuencia es pura, el escenario te pertenece.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto pt-8">
          <motion.div 
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => setMode('artist_manifesto')} 
            className="group cursor-pointer bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] hover:bg-white/[0.03] hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity text-white">
              <Mic2 size={120} />
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#ecb613] border border-white/10 mb-6 group-hover:border-[#ecb613]/30 transition-colors">
              <Volume2 size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#ecb613] transition-colors uppercase tracking-tight italic">Soy Artista</h3>
            <p className="text-xs text-white/40 mb-8 leading-relaxed font-bold uppercase tracking-wider">
              No buscamos rellenos de cartel. Buscamos Arquitectos de Experiencia y Solistas Clásicos.
            </p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Iniciar Certificación <ArrowRight size={14} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03, y: -5 }}
            onClick={() => setMode('fan_access')} 
            className="group cursor-pointer bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] hover:bg-white/[0.03] hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity text-white">
              <Fingerprint size={120} />
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#ecb613] border border-white/10 mb-6 group-hover:border-[#ecb613]/30 transition-colors">
              <Lock size={24} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#ecb613] transition-colors uppercase tracking-tight italic">Soy Curador</h3>
            <p className="text-xs text-white/40 mb-8 leading-relaxed font-bold uppercase tracking-wider">
              El algoritmo te da lo viral. Nosotros te damos lo legendario y acceso preferente.
            </p>
            <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Solicitar Acceso VIP <ArrowRight size={14} className="text-[#ecb613] group-hover:translate-x-2 transition-transform"/>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  const ArtistForm = () => (
    <div className="min-h-[70vh] py-12 px-6 flex justify-center items-center relative overflow-hidden bg-[#050505]">
       <div className="absolute top-0 left-0 w-full h-full bg-[#ecb613]/5 blur-[120px] opacity-20 pointer-events-none" />
       
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="w-full max-w-2xl bg-white/[0.02] border border-white/5 p-10 md:p-14 rounded-[3.5rem] relative shadow-2xl"
       >
          <div className="absolute top-8 right-10 text-[#ecb613] font-black text-[10px] uppercase tracking-[0.4em]">Fase {formStep}/3</div>
          
          <AnimatePresence mode="wait">
            {formStep === 1 && (
               <motion.div 
                 key="step1"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">1. Huella Digital</h3>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Enlace de Actuación (Video)</label>
                        <input name="videoLink" value={artistData.videoLink} onChange={handleInputChange} type="url" className="w-full bg-black/40 border border-white/10 p-5 text-white rounded-xl focus:border-[#ecb613]/50 outline-none transition-all font-bold text-sm" placeholder="Youtube / Vimeo..." />
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Métricas e Impacto Real</label>
                        <input name="metrics" value={artistData.metrics} onChange={handleInputChange} type="text" className="w-full bg-black/40 border border-white/10 p-5 text-white rounded-xl focus:border-[#ecb613]/50 outline-none transition-all font-bold text-sm" placeholder="Engagement, Audiencia media..." />
                     </div>
                     <button onClick={() => setFormStep(2)} className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-xl text-[10px] shadow-[0_0_30px_rgba(236,182,19,0.15)]">Avanzar Protocolo</button>
                  </div>
               </motion.div>
            )}
            
            {formStep === 2 && (
               <motion.div 
                 key="step2"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-8"
               >
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">2. Filosofía Escénica</h3>
                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Tu 'Linchpin' (¿Qué te hace único?)</label>
                        <textarea name="linchpin" value={artistData.linchpin} onChange={handleInputChange} rows={4} className="w-full bg-black/40 border border-white/10 p-5 text-white rounded-xl focus:border-[#ecb613]/50 outline-none resize-none transition-all font-bold text-sm" placeholder="¿Por qué tu espectáculo es asimétrico e incomparable?"></textarea>
                     </div>
                     <div className="space-y-3">
                        <label className="block text-[9px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Email Corporativo / Booking</label>
                        <input name="email" value={artistData.email} onChange={handleInputChange} type="email" className="w-full bg-black/40 border border-white/10 p-5 text-white rounded-xl focus:border-[#ecb613]/50 outline-none transition-all font-bold text-sm" placeholder="artista@agencia.com" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setFormStep(1)} className="py-5 border border-white/5 text-white/40 font-black uppercase tracking-widest rounded-xl text-[10px] hover:bg-white/5 transition-all">Atrás</button>
                        <button onClick={handleFinalSubmit} disabled={isSubmitting} className="py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-xl text-[10px] shadow-[0_0_30px_rgba(236,182,19,0.3)]">
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
                 className="text-center py-8 space-y-6"
               >
                  <div className="w-20 h-20 bg-[#ecb613]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ecb613]/30 shadow-[0_0_40px_rgba(236,182,19,0.2)]">
                     <ShieldCheck className="text-[#ecb613]" size={36} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">Señal Capturada</h3>
                  <p className="text-white/50 max-w-md mx-auto italic uppercase tracking-widest text-[9px] font-black leading-relaxed">
                    "Los datos han sido digitalizados. Si tu frecuencia es pura, recibirás el Kit de Autoridad en 48h."
                  </p>
                  <button onClick={() => setMode('split')} className="px-8 py-4 border border-white/10 text-white hover:bg-white hover:text-black transition-all uppercase tracking-[0.3em] text-[10px] font-black rounded-xl">Volver al Origen</button>
               </motion.div>
            )}
          </AnimatePresence>
       </motion.div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white selection:bg-[#ecb613]/30">
      {mode === 'split' && <TheGreatDivide />}
      
      {mode === 'artist_manifesto' && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[120px] rounded-full pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto text-left border-l-4 border-[#ecb613] pl-10 md:pl-16 py-6"
          >
            <span className="text-[#ecb613] font-black text-[11px] uppercase tracking-[0.5em] mb-6 block">Manifiesto de Ingreso S-Class</span>
            <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-none tracking-tighter uppercase italic">
              ANTES DE APLICAR,<br/>ENTIENDE ESTO:
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed mb-12 uppercase tracking-wider font-bold">
              EAR NO ES UN DIRECTORIO COMÚN. SOMOS UNA <strong className="text-white">INFRAESTRUCTURA DE TALENTO</strong> DE ÉLITE. EXIGIMOS EXCELENCIA ACÚSTICA ABSOLUTA. SI BUSCAS "BOLOS" RÁPIDOS, NO APLIQUES. SI BUSCAS CONSTRUIR UN ACTIVO PATRIMONIAL, ESTÁS EN EL LUGAR CORRECTO.
            </p>
            <button 
              onClick={() => setMode('artist_form')} 
              className="px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all rounded-xl shadow-[0_20px_50px_rgba(236,182,19,0.3)] text-[10px]"
            >
              ACEPTO EL DESAFÍO S-CLASS
            </button>
          </motion.div>
        </div>
      )}
      
      {mode === 'artist_form' && <ArtistForm />}
      
      {mode === 'fan_access' && (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/3 blur-[100px] rounded-full" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white/[0.01] border border-white/5 p-12 rounded-[3.5rem] text-center backdrop-blur-3xl"
          >
             <div className="mb-8 p-4 bg-[#ecb613]/10 rounded-2xl w-fit text-[#ecb613] border border-[#ecb613]/20 mx-auto">
               <Eye size={28}/>
             </div>
             <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">Información Asimétrica</h3>
             <p className="text-white/40 mb-10 text-[9px] font-black uppercase tracking-widest leading-relaxed">
               Únete al Círculo Interior para recibir acceso preferente, "soundchecks" exclusivos y grabaciones de alta gama.
             </p>
             <button 
               onClick={() => setMode('split')} 
               className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-xl hover:bg-[#ecb613] transition-all text-[10px]"
             >
               REGISTRAR INTERÉS VIP
             </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
