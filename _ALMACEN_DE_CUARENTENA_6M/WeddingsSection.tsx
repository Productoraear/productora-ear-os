
import React, { useState } from 'react';
import { Heart, Calendar, Music, Star, Check, Utensils, Mic2, ShieldCheck, Layout, Speaker, Camera, ChevronUp, ChevronDown, Sun, Anchor } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { WEDDING_PACKAGES } from '../../data/weddings';

const WeddingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'experience' | 'altar' | 'servicios'>('experience');
  const [paymentModal, setPaymentModal] = useState<{open: boolean, amount: number, concept: string}>({ open: false, amount: 0, concept: '' });

  return (
    <div className="pt-20 bg-black min-h-screen font-body">
      
      {/* HERO SECTION */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auhref=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ear-gold/20 border border-ear-gold/40 text-ear-gold text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <Heart size={12} fill="currentColor" /> Arquitectura Nupcial
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-tight uppercase tracking-tighter">BODAS <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-white">SIN IGUAL</span></h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed animate-fade-in-up">
            Enfocados en crear momentos personalizados para cada pareja, garantizando que su día soñado sea inolvidable. Nuestra visión nos impide hacer un "copia y pega".
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-8 min-w-max">
             {[
               { id: 'experience', label: 'Las Colecciones', icon: Star },
               { id: 'servicios', label: 'Catering & Staff', icon: Utensils },
               { id: 'altar', label: 'Protocolo Mariachi', icon: Music },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 py-6 text-sm font-bold uppercase tracking-widest border-b-2 transition-all ${
                   activeTab === tab.id ? 'border-ear-gold text-ear-gold' : 'border-transparent text-gray-500 hover:text-white'
                 }`}
               >
                 <tab.icon size={16} /> {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* TAB: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="animate-fade-in space-y-16">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-3xl font-display font-bold text-white">VUESTRA SINGULARIDAD ES <br/><span className="text-ear-gold">EL PLAN MAESTRO</span></h3>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                        Entendemos que cada pareja es única. Por eso, nuestros presupuestos son arquitecturas a medida. Nada es estándar porque vuestro amor no lo es.
                    </p>
                    <div className="p-6 bg-white/5 border-l-4 border-ear-gold rounded-r-2xl">
                        <h4 className="text-white font-bold mb-2">Protocolo Plan "B" Garantizado</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            "Lo más importante es un plan B por si hiciera falta, aunque en EAR nunca falta, porque la previsión es nuestra religión."
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {WEDDING_PACKAGES.map((pack, i) => (
                    <div key={i} className={`p-8 rounded-3xl border ${pack.isPopular ? 'bg-gradient-to-b from-ear-purple/20 to-black border-ear-gold shadow-2xl' : 'bg-white/5 border-white/10'} transition-all`}>
                        <h4 className="text-xl font-display font-bold text-white mb-4">{pack.title}</h4>
                        <p className="text-gray-400 text-xs mb-6 leading-relaxed italic">"{pack.desc}"</p>
                        <ul className="space-y-3 mb-8">
                            {pack.features.map(f => <li key={f} className="flex items-center gap-2 text-[10px] text-gray-300 uppercase font-bold"><Check size={12} className="text-ear-gold" /> {f}</li>)}
                        </ul>
                        <button className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] ${pack.isPopular ? 'bg-ear-gold text-black' : 'bg-white/10 text-white'}`}>Personalizar</button>
                    </div>
                    ))}
                </div>
             </div>
          </div>
        )}

        {/* TAB: SERVICIOS */}
        {activeTab === 'servicios' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { t: "Wedding Planners", d: "Coordinación total de la logística técnica y emocional.", i: Calendar },
                    { t: "Catering Gourmet", d: "Alianzas con chefs de renombre para una experiencia de autor.", i: Utensils },
                    { t: "Maestros de Ceremonia", d: "Narrativa y voz para que vuestro sí sea legendario.", i: Mic2 },
                    { t: "Protocolo Plan B", d: "Infraestructura redundante ante cualquier imprevisto.", i: ShieldCheck },
                    { t: "Diseño de Espacios", d: "Transformación visual de la finca o salón.", i: Layout },
                    { t: "DJ & Sound Design", d: "Sistemas de audio de alta fidelidad 24/7.", i: Speaker }
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-ear-gold/30 transition-all group">
                        <s.i className="text-ear-gold mb-6 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="text-xl font-display font-bold text-white mb-2">{s.t}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
                    </div>
                ))}
            </div>
        )}

        {/* TAB: MARIACHI PROTOCOL */}
        {activeTab === 'altar' && (
            <div className="animate-fade-in bg-[#111] p-12 rounded-3xl border border-white/10 text-center max-w-4xl mx-auto">
                <Music className="text-ear-gold mx-auto mb-6" size={48} />
                <h3 className="text-3xl font-display font-bold text-white mb-6">EL PROTOCOLO <span className="text-ear-gold">EDWIN AGUDELO</span></h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-10">
                    Contratar mariachis conmigo es el gran acierto para vuestro día maravilloso. No es solo música; es un compromiso de puntualidad, prueba de sonido previa y un ritual diseñado para emocionar.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="text-white font-bold mb-2">El Ritual del Ramo</h4>
                        <p className="text-xs text-gray-500">Incluyo un ramo de cortesía para el momento del impacto visual ante los invitados.</p>
                    </div>
                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                        <h4 className="text-white font-bold mb-2">Compromiso Total</h4>
                        <p className="text-xs text-gray-500">Llego antes que los invitados para asegurar que la atmósfera sea perfecta desde el segundo uno.</p>
                    </div>
                </div>
            </div>
        )}

      </div>

      <PaymentModal 
        isOpen={paymentModal.open}
        onClose={() => setPaymentModal({...paymentModal, open: false})}
        amount={paymentModal.amount}
        concept={paymentModal.concept}
      />
    </div>
  );
};

export default WeddingsSection;
