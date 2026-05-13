import React from 'react';
import { ChevronDown, PlayCircle, ArrowRight, Building2, Cpu } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 
        VIDEO BACKGROUND LAYER 
      */}
      <video 
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        autoPlay 
        muted 
        loop 
        playsInline
        poster="https://picsum.photos/id/158/1920/1080"
      >
        <source src="https://cdn.coverr.co/videos/coverr-abstract-purple-lines-2633/1080p.mp4" type="video/mp4" />
      </video>

      {/* GRADIENT OVERLAY - Cinematic Dark Mode */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-0 pointer-events-none"></div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center z-10 pt-20">
        
        {/* Strategic Identity Declaration */}
        <div className="mb-8 animate-fade-in-up">
            <span className="inline-block py-1 px-3 border border-ear-gold/30 rounded-full bg-black/50 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.3em] text-ear-gold uppercase">
              Sistemas de Impacto
            </span>
        </div>

        {/* Titular: The High Status Promise */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-8 tracking-tight drop-shadow-2xl leading-[1.1]">
          ARQUITECTURA E <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold via-yellow-200 to-ear-gold gold-glow">INGENIERÍA</span><br/>
          DE EVENTOS Y TALENTO
        </h1>

        {/* Subtítulo: The Logic (Renaming) */}
        <p className="max-w-3xl text-lg md:text-xl text-gray-300 font-body leading-relaxed mb-16 text-shadow-lg font-light border-l-2 border-ear-gold/50 pl-6 text-left md:text-center md:border-0 md:pl-0">
          La mayoría vende ruido y logística. Nosotros diseñamos <strong className="text-white">Sistemas de Impacto</strong>. 
          <br className="hidden md:block"/>
          No alquilamos equipos ni representamos nombres; construimos la infraestructura invisible para que el mensaje sea inevitable.
        </p>

        {/* THE GREAT DIVIDER (Bifurcation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          
          {/* Left Door: Engineering (Corporate) */}
          <button className="group relative overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-blue-500/50 p-6 rounded-xl text-left transition-all duration-500 hover:bg-blue-950/10">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Cpu size={60} />
             </div>
             <div className="relative z-10">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 block">Para Empresas</span>
                <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">LA INGENIERÍA</h3>
                <p className="text-gray-500 text-xs mb-4">"Busco precisión técnica y seguridad de ejecución."</p>
                <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-widest">
                   Acceso Corporativo <ArrowRight size={14} className="text-blue-400 group-hover:translate-x-2 transition-transform"/>
                </div>
             </div>
          </button>

          {/* Right Door: Architecture (Artists) */}
          <button className="group relative overflow-hidden bg-[#0a0a0a] border border-white/10 hover:border-ear-gold/50 p-6 rounded-xl text-left transition-all duration-500 hover:bg-ear-gold/5">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Building2 size={60} />
             </div>
             <div className="relative z-10">
                <span className="text-ear-gold text-xs font-bold uppercase tracking-widest mb-2 block">Para Artistas</span>
                <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-ear-gold transition-colors">LA ARQUITECTURA</h3>
                <p className="text-gray-500 text-xs mb-4">"Busco estructura para mi carrera y diseño de legado."</p>
                <div className="flex items-center gap-2 text-white text-sm font-bold uppercase tracking-widest">
                   Acceso a la Señal <ArrowRight size={14} className="text-ear-gold group-hover:translate-x-2 transition-transform"/>
                </div>
             </div>
          </button>

        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce z-10 pointer-events-none">
        <span className="text-[10px] text-gray-500 font-body tracking-[0.3em] mb-3 uppercase">Ver Infraestructura</span>
        <ChevronDown className="text-ear-gold drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]" size={24} />
      </div>

    </div>
  );
};

export default Hero;
