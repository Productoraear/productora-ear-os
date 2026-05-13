
import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { EXPERTISE_SERVICES } from '../../data/expertise';

const AdditionalServices: React.FC = () => {
  return (
    <section className="py-24 bg-black relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="mb-16 md:flex justify-between items-end border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <span className="text-ear-gold font-body font-bold tracking-[0.2em] uppercase text-xs mb-3 block">
              El Arsenal Completo
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
              SERVICIOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-yellow-200">ADICIONALES</span>
            </h2>
          </div>
          <p className="text-gray-400 font-body text-sm mt-6 md:mt-0 max-w-sm text-right">
            Soluciones periféricas para centralizar toda tu producción en un solo ecosistema de confianza.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERTISE_SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-500 hover:border-ear-gold/30"
              >
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowUpRight className="text-ear-gold" size={24} />
                </div>

                <div className="flex items-start gap-6">
                  <div className={`p-4 rounded-xl bg-black/50 border border-white/10 group-hover:border-ear-gold/50 transition-colors`}>
                    <Icon className={`${service.color}`} size={32} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-ear-gold transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                      {service.subtitle}
                    </p>
                    
                    <p className="text-gray-300 font-body text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {service.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="w-1 h-1 rounded-full bg-ear-gold"></span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-white font-body mb-6 text-lg">
              ¿Tienes un proyecto que requiere una combinación de estos servicios?
            </p>
            <button className="px-10 py-4 bg-ear-gold hover:bg-white text-black font-bold font-display tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Personalizar mi Producción
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AdditionalServices;
