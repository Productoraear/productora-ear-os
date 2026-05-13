import React from 'react';
import { Check, X, Calendar, ArrowRight, Zap, Star, Shield } from 'lucide-react';

const PricingTable: React.FC = () => {
  return (
    <section className="py-24 bg-ear-dark relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-ear-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Inversión en Resultados</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">PLANES & <span className="text-ear-gold">PRECIOS</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Encuentra el plan perfecto para ti o tu empresa. Transparencia total y garantía por escrito.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* ARTISTAS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-ear-gold/30 transition-all">
             <div className="mb-8">
                <Star className="text-ear-gold mb-4" size={32} />
                <h3 className="text-2xl font-display font-bold text-white uppercase">Artistas</h3>
                <div className="mt-4">
                    <span className="text-4xl font-black text-white">€150</span>
                    <span className="text-gray-500 text-xs font-bold uppercase"> / Mes</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Planes premium desde €1000/mes</p>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-ear-gold"/> Gestión de booking base.</li>
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-ear-gold"/> Mentoría grupal.</li>
                <li className="flex items-center gap-3 text-sm text-gray-400 font-bold text-gray-300"><Check size={16} className="text-ear-gold"/> Premium incluye fotos/video.</li>
             </ul>
             <button className="w-full py-4 bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-ear-gold hover:text-black transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> Agenda 30 min gratis
             </button>
          </div>

          {/* EVENTOS */}
          <div className="bg-gradient-to-br from-ear-purple/20 to-black border border-ear-gold rounded-3xl p-8 flex flex-col shadow-2xl relative transform lg:-translate-y-4">
             <div className="absolute top-0 right-0 bg-ear-gold text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">Insignia</div>
             <div className="mb-8">
                <Zap className="text-ear-gold mb-4" size={32} />
                <h3 className="text-2xl font-display font-bold text-white uppercase">Eventos</h3>
                <div className="mt-4">
                    <span className="text-4xl font-black text-white">€3000</span>
                    <span className="text-gray-500 text-xs font-bold uppercase"> / Pago Único</span>
                </div>
                <p className="text-xs text-gray-400 mt-2 italic">Resultados que superan expectativas.</p>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-white font-bold"><Check size={16} className="text-ear-gold"/> Ingeniería 360 del evento.</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-ear-gold"/> Gestión de proveedores élite.</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><Check size={16} className="text-ear-gold"/> Protocolo Plan B garantizado.</li>
             </ul>
             <button className="w-full py-4 bg-ear-gold text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-white transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> Reservar Consultoría 30 min
             </button>
          </div>

          {/* EMPRESARIOS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-blue-500/30 transition-all">
             <div className="mb-8">
                <Shield className="text-blue-400 mb-4" size={32} />
                <h3 className="text-2xl font-display font-bold text-white uppercase">Empresarios</h3>
                <div className="mt-4">
                    <span className="text-4xl font-black text-white">€1000</span>
                    <span className="text-gray-500 text-xs font-bold uppercase"> / Mes</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Premium hasta €3000/mes</p>
             </div>
             <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-blue-400"/> Implementación táctica real.</li>
                <li className="flex items-center gap-3 text-sm text-gray-400 font-bold text-gray-300"><Check size={16} className="text-blue-400"/> ROI garantizado por escrito.</li>
                <li className="flex items-center gap-3 text-sm text-gray-400"><Check size={16} className="text-blue-400"/> Estrategia de crecimiento dirigida.</li>
             </ul>
             <button className="w-full py-4 bg-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                <Calendar size={14} /> Agenda 30 min gratis
             </button>
          </div>

        </div>

        <div className="mt-16 text-center">
            <p className="text-gray-500 text-sm">¿Necesitas un plan a medida? <button className="text-ear-gold font-bold underline ml-2">Contacta con Auditoría</button></p>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
