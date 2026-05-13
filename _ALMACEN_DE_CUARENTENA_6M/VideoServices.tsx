
import React from 'react';
import { Camera, ArrowRight, CheckCircle, Layers } from 'lucide-react';
import { MASTER_SERVICES } from '../../lib/constants/SClassNexus';

interface ServicesProps {
  onNavigate?: (view: any) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const mainServices = MASTER_SERVICES.slice(0, 4);
  const additionalExpertise = MASTER_SERVICES.slice(4);

  return (
    <div className="pt-20 bg-black min-h-screen font-body">
       <div className="max-w-7xl mx-auto px-4 py-16">
         
         <div className="mb-20 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Camera size={14} /> Ingeniería de la Imagen Productora EAR
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 uppercase tracking-tighter">
              SERVICIOS <span className="text-ear-gold">AUDIOVISUALES</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              "No grabamos eventos; diseñamos la infraestructura invisible de los recuerdos. Cada pixel y cada decibelio está bajo nuestro control absoluto."
            </p>
         </div>

         {/* Master-Driven Service Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {mainServices.map((svc) => (
            <div 
                key={svc.id} 
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] hover:border-ear-gold/50 transition-all duration-300 cursor-pointer flex flex-col items-start"
            >
                <div className="w-14 h-14 bg-black rounded-xl border border-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svc.icon className="text-ear-gold" size={28} />
                </div>
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2">{svc.category}</span>
                <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-ear-gold transition-colors leading-tight">{svc.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light">
                {svc.desc}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 w-full flex justify-between items-center">
                  <span className="text-[9px] text-gray-600 font-mono">productoraear.com/{svc.slug}</span>
                  <ArrowRight size={14} className="text-ear-gold group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
            ))}
         </div>

         {/* Expertise Bar (Driven by remaining services) */}
         <div className="bg-[#111] border border-white/10 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Layers size={150} /></div>
            <h3 className="text-2xl font-display font-bold text-white mb-8 uppercase text-center">Nuestras Áreas de <span className="text-ear-gold">Impacto</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {additionalExpertise.map((exp) => (
                    <div key={exp.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 group-hover:bg-ear-gold group-hover:text-black transition-colors">
                            <exp.icon size={20} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">{exp.title}</p>
                            <p className="text-[9px] text-gray-500 font-mono">productoraear.com/{exp.slug}</p>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* Closing Strategy */}
         <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gradient-to-br from-ear-purple/20 to-black p-12 rounded-[2.5rem] border border-white/10">
            <div>
                <h3 className="text-3xl font-display font-bold text-white mb-6 uppercase">¿Buscas el <span className="text-ear-gold">Umbral de Libertad?</span></h3>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Nuestra metodología no vende vatios de sonido; vende tranquilidad. Acompañamos a empresarios y organizadores a pasar de la "ejecución con miedo" a la "arquitectura del éxito".
                </p>
                <button 
                  onClick={() => onNavigate && onNavigate('contact')}
                  className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-ear-gold transition-colors shadow-2xl flex items-center gap-2"
                >
                  Solicitar Auditoría de Evento <CheckCircle size={16} />
                </button>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 md:h-80 shadow-2xl">
                <img src="https://picsum.photos/id/250/1200/800" alt="Producción EAR" className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-zoom-in" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                    <span className="px-3 py-1 bg-ear-gold text-black text-[10px] font-black uppercase tracking-tighter">Garantía de Autoridad EAR</span>
                </div>
            </div>
         </div>

       </div>
    </div>
  );
};

export default Services;
