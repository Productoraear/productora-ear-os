
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, Zap, Shield, Info, CheckCircle2, ChevronDown, Music, Users, Camera } from "lucide-react";
import { MOCK_S_CLASS_ARTISTS, calculateSClassAffinity } from "@/services/affinityService";

export const ArtistMatcher = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState<any>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-100, 100], [-10, 10]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleSwipe = (direction: "left" | "right") => {
    const artist = MOCK_S_CLASS_ARTISTS[currentIndex];
    const affinity = calculateSClassAffinity(artist.metrics);

    if (direction === "right" && affinity.puntuacion_total >= 35) {
      setMatchSuccess(artist);
      // En una implementación real, aquí guardaríamos en Firebase
    } else {
      setCurrentIndex((prev) => prev + 1);
      setShowDetails(false);
    }
    x.set(0);
  };

  const closeMatch = () => {
    setMatchSuccess(null);
    setCurrentIndex((prev) => prev + 1);
    setShowDetails(false);
  };

  if (currentIndex >= MOCK_S_CLASS_ARTISTS.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-6 border border-gold-500/20"
        >
          <Shield className="text-gold-500" size={40} />
        </motion.div>
        <h3 className="text-2xl font-black uppercase text-gold-500 mb-2 tracking-tighter">Radar Completado</h3>
        <p className="text-white/40 max-w-xs text-xs font-medium italic leading-relaxed">
          Has filtrado el talento bajo el estándar S-Class. Los perfiles seleccionados están en cola de auditoría.
        </p>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="mt-10 px-8 py-3 bg-gold-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
        >
          Reiniciar Despliegue
        </button>
      </div>
    );
  }

  const currentArtist = MOCK_S_CLASS_ARTISTS[currentIndex];
  const affinity = calculateSClassAffinity(currentArtist.metrics);

  return (
    <div className="relative w-full max-w-sm mx-auto h-[640px] flex flex-col items-center select-none">
      
      {/* MATCH MODAL */}
      <AnimatePresence>
        {matchSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center border border-gold-500/30"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative mb-8"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold-500 shadow-[0_0_50px_rgba(212,175,55,0.4)]">
                <img src={matchSuccess.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gold-500 p-2 rounded-full border-4 border-black">
                <CheckCircle2 color="black" size={20} />
              </div>
            </motion.div>
            
            <h2 className="text-4xl font-black uppercase tracking-tighter text-gold-500 leading-none mb-2 italic">ELITE MATCH</h2>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8 underline decoration-gold-500/30 underline-offset-4">Afinidad S-Class Detectada</p>
            
            <p className="text-base text-white/70 italic leading-relaxed mb-10 px-4">
              "{matchSuccess.name} cumple con el protocolo de excelencia EAR OS. Iniciando reserva estratégica..."
            </p>

            <div className="space-y-4 w-full">
              <button 
                onClick={closeMatch}
                className="w-full py-4 bg-gold-500 text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-gold-400 transition-all shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
              >
                Confirmar Reserva
              </button>
              <button 
                onClick={closeMatch}
                className="w-full py-4 bg-white/5 text-white/60 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                Seguir Buscando
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER INFO */}
      <div className="w-full mb-6 flex justify-between items-end px-2">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] gold-text mb-1 italic">Tinder de Talento</h4>
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">Protocolo S-Class Activo</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{currentIndex + 1} / {MOCK_S_CLASS_ARTISTS.length}</span>
        </div>
      </div>

      <div className="relative w-full flex-1">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentArtist.id}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120) handleSwipe("right");
              if (info.offset.x < -120) handleSwipe("left");
            }}
            className="absolute inset-0 bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] cursor-grab active:cursor-grabbing group"
          >
            {/* SWIPE OVERLAYS */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-10 left-10 z-30 border-4 border-gold-500 px-6 py-2 rounded-2xl -rotate-12 pointer-events-none bg-black/50 backdrop-blur-sm">
              <span className="text-3xl font-black text-gold-500 uppercase italic tracking-tighter">S-CLASS</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-10 right-10 z-30 border-4 border-red-500 px-6 py-2 rounded-2xl rotate-12 pointer-events-none bg-black/50 backdrop-blur-sm">
              <span className="text-3xl font-black text-red-500 uppercase italic tracking-tighter">RECHAZAR</span>
            </motion.div>

            {/* ARTIST IMAGE */}
            <div className="absolute inset-0">
              <img 
                src={currentArtist.image} 
                alt={currentArtist.name} 
                className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* QUICK STATS CHIP */}
            <div className="absolute top-8 right-8 z-20">
               <div className="bg-black/60 backdrop-blur-xl border border-gold-500/20 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
                 <Zap size={14} className="text-gold-500" />
                 <div className="h-4 w-px bg-white/10"></div>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">
                   AFINIDAD: <span className="text-gold-500">{affinity.porcentajeAfinidad}%</span>
                 </span>
               </div>
            </div>

            {/* CARD CONTENT */}
            <div className={`absolute left-0 w-full p-10 z-20 transition-all duration-500 ${showDetails ? 'bottom-0 h-full bg-black/95 flex flex-col pt-20' : 'bottom-0 bg-gradient-to-t from-black to-transparent pt-20'}`}>
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{currentArtist.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="bg-gold-500/10 text-gold-500 border border-gold-500/20 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">{currentArtist.genre}</span>
                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-2">
                       <Shield size={10} className="text-gold-500/50" /> Verificado EAR
                    </span>
                  </div>
                </div>
                {!showDetails && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}
                    className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-gold-500/10 hover:border-gold-500 transition-all"
                  >
                    <ChevronDown size={20} className="text-white/40" />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {showDetails && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 space-y-8 mt-4 overflow-y-auto pr-2 custom-scrollbar"
                  >
                    <p className="text-sm font-medium text-white/50 italic leading-relaxed leading-snug">
                       "Un activo de alto desempeño para eventos que requieren precisión técnica y una estética impecable."
                    </p>

                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500/80 border-b border-gold-500/20 pb-2">Matriz de Evaluación</h4>
                       
                       <div className="grid grid-cols-1 gap-5">
                         {[
                           { label: "Calidad Musical", val: currentArtist.metrics.musica, icon: Music },
                           { label: "Logística / Puntualidad", val: currentArtist.metrics.logistica_puntualidad, icon: Zap },
                           { label: "Estética Premium", val: currentArtist.metrics.estetica_presentacion, icon: Camera },
                           { label: "Hardware Operativo", val: currentArtist.metrics.equipo_tecnico, icon: Shield },
                           { label: "Interacción S-Class", val: currentArtist.metrics.presencia_interaccion, icon: Users },
                         ].map((item, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40 px-1">
                                <span className="flex items-center gap-2"><item.icon size={10} className="text-gold-500/50" /> {item.label}</span>
                                <span className="text-gold-500">{item.val}/10</span>
                              </div>
                              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.val * 10}%` }}
                                  transition={{ duration: 1, delay: i * 0.1 }}
                                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
                                />
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    <button 
                       onClick={() => setShowDetails(false)}
                       className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border border-white/5 bg-white/5 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                       <X size={14} /> Minimizar Detalles
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {!showDetails && (
                <div className="flex justify-between gap-5 mt-8">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSwipe("left"); }}
                    className="flex-1 h-14 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/40 rounded-2xl flex items-center justify-center transition-all group"
                  >
                    <X className="text-white/40 group-hover:text-red-500" size={24} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSwipe("right"); }}
                    className="flex-1 h-14 bg-gold-500 hover:bg-gold-400 border border-gold-500 rounded-2xl flex items-center justify-center transition-all group shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
                  >
                    <Heart className="text-black" size={24} fill="currentColor" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-8 opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2"><X size={12} /> <span className="text-[9px] font-black uppercase tracking-widest">DESCARTAR</span></div>
        <div className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/30" /> <span className="text-[9px] font-black uppercase tracking-widest">S-CLASS MATCH</span> <div className="w-1 h-1 rounded-full bg-white/30" /></div>
        <div className="flex items-center gap-2"><Heart size={12} fill="currentColor" /> <span className="text-[9px] font-black uppercase tracking-widest">RESERVAR</span></div>
      </div>
    </div>
  );
};
