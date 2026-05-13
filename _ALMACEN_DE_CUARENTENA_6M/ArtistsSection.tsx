
import React, { useState } from 'react';
/* Added PenTool to the imports from lucide-react */
import { ChevronLeft, MapPin, ShieldCheck, Zap, Fingerprint, Landmark, History, GraduationCap, Calendar, Brain, Megaphone, Globe, Lock, Shirt, Ticket, Heart, Scale, TrendingUp, Star, PenTool } from 'lucide-react';
import PaymentModal from './PaymentModal';
import { FEATURED_ARTISTS } from '../../data/artists';

const ArtistsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'contents' | 'join'>('catalog');
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [dashboardSubTab, setDashboardSubTab] = useState<'estrategia' | 'branding' | 'historia' | 'mariachi' | 'academy'>('estrategia');
  
  const [paymentModal, setPaymentModal] = useState<{open: boolean, amount: number | string, concept: string}>({
      open: false,
      amount: 0,
      concept: ''
  });

  const renderStrategicDashboard = () => {
    return (
        <div className="animate-fade-in pb-24">
            <button 
                onClick={() => setSelectedArtistId(null)}
                className="flex items-center gap-2 text-ear-gold text-xs font-bold uppercase tracking-widest mb-8 hover:text-white transition-colors"
            >
                <ChevronLeft size={16} /> Volver al Hub
            </button>

            {/* PROFILE HEADER */}
            <div className="flex flex-col md:flex-row gap-12 items-end mb-12 border-b border-white/10 pb-12">
                <div className="relative w-64 h-80 shrink-0 rounded-2xl overflow-hidden border-2 border-ear-gold/30 shadow-2xl group">
                    <img src="https://picsum.photos/id/453/600/800" alt="Edwin Agudelo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-full bg-ear-gold text-black text-[10px] font-black text-center py-2 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <ShieldCheck size={12} /> Cómplice Estratégico
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex wrap items-center gap-3 mb-6">
                        <span className="px-4 py-1 bg-ear-gold text-black rounded-full text-[10px] font-black uppercase tracking-widest">Compositor de la Igualdad</span>
                        <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-gray-400 text-[10px] font-bold uppercase tracking-widest">CEO Productora EAR</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-6 uppercase">Edwin Agudelo</h2>
                    <p className="text-gray-400 text-xl max-w-3xl leading-relaxed italic border-l-4 border-ear-gold pl-8">
                        "No vendo música, diseño el activo patrimonial de tu talento. Mi compromiso es que dejes de sobrevivir y empieces a trascender."
                    </p>
                    
                    <div className="grid grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                            <span className="block text-2xl font-black text-ear-gold">160k</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">KM Cantados</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                            <span className="block text-2xl font-black text-ear-gold">37</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Conciertos Int.</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                            <span className="block text-2xl font-black text-ear-gold">95%</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Satisfacción</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                            <span className="block text-2xl font-black text-ear-gold">24/7</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Compromiso</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* INNER DASHBOARD NAVIGATION */}
            <div className="flex overflow-x-auto gap-4 mb-12 border-b border-white/5 pb-4 no-scrollbar">
                {[
                    { id: 'estrategia', label: 'Estrategia 360', icon: Zap },
                    { id: 'branding', label: 'Marca Personal', icon: Fingerprint },
                    { id: 'academy', label: 'Metodología EAR', icon: GraduationCap },
                    { id: 'mariachi', label: 'Cátedra Mariachi', icon: Landmark },
                    { id: 'historia', label: 'Biografía', icon: History }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setDashboardSubTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                            dashboardSubTab === tab.id 
                            ? 'bg-ear-gold text-black border-ear-gold shadow-lg' 
                            : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                        }`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* DASHBOARD CONTENT SWITCHER */}
            {dashboardSubTab === 'estrategia' && (
                <div className="animate-fade-in space-y-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h3 className="text-3xl font-display font-bold text-white mb-4 uppercase">Ruta de Carrera Artística</h3>
                        <p className="text-gray-400 mb-6">Nuestra arquitectura de gestión cubre cada ángulo crítico de una carrera profesional.</p>
                        
                        {/* PRICING INFO ARTISTAS */}
                        <div className="bg-white/5 border border-ear-gold/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                            <div className="text-left">
                                <span className="text-ear-gold font-bold text-xs uppercase tracking-widest">Inversión Recomendada</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-3xl font-black text-white">€150</span>
                                    <span className="text-gray-500 text-xs font-bold uppercase">/ Mensual</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Planes Premium desde €1000/mes (Incluye fotos, video y acompañamiento)</p>
                            </div>
                            <button className="px-8 py-3 bg-ear-gold text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-white transition-all flex items-center justify-center gap-2">
                                <Calendar size={14} /> Agendar cita de 30 min <span className="opacity-60">(Sin compromiso)</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Desarrollo de Mentalidad", icon: Brain, desc: "Fomentamos creatividad, resiliencia y autenticidad. Talleres para abrazar el fracaso como motor de crecimiento." },
                            { title: "Branding & Marketing", icon: Megaphone, desc: "Estrategias innovadoras para destacar en mercados saturados. Tu marca es tu promesa." },
                            { title: "Networking Estratégico", icon: Globe, desc: "Habilidades para construir relaciones de valor. Acceso directo a nuestra red de contactos internacional." },
                            { title: "Estrategia Exclusiva", icon: Lock, desc: "Contenido y acompañamiento premium solo para suscriptores certificados EAR." },
                            { title: "Merchandising de Autor", icon: Shirt, desc: "Diseño y producción de identidad tangible que refleja tu estilo y genera ingresos." },
                            { title: "Eventos & Ticketing", icon: Ticket, desc: "Asesoramiento en organización y venta de entradas para maximizar asistencia y retorno." },
                            { title: "Fan Experience", icon: Heart, desc: "Meet & Greets, pases VIP y experiencias únicas para fidelizar a tu comunidad real." },
                            { title: "Blindaje Legal/Fiscal", icon: Scale, desc: "Derechos de autor, contratos y planificación fiscal. Protegemos tu patrimonio futuro." }
                        ].map((srv, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-ear-gold/50 transition-all cursor-pointer group">
                                <srv.icon className="text-ear-gold mb-6 group-hover:scale-110 transition-transform" size={32} />
                                <h4 className="text-xl font-display font-bold text-white mb-4 leading-tight">{srv.title}</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">{srv.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="pt-20 bg-black min-h-screen font-body">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {!selectedArtistId && (
            <div className="flex justify-center mb-16 border-b border-white/10 sticky top-20 bg-black/95 backdrop-blur z-30 pt-4">
            {['catalog', 'contents', 'join'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-widest border-b-2 transition-all ${
                    activeTab === tab ? 'border-ear-gold text-ear-gold' : 'border-transparent text-gray-500 hover:text-white'
                    }`}
                >
                {tab === 'join' ? 'Auditoría de Acceso' : tab === 'catalog' ? 'Catálogo EAR' : 'Metodología & Formación'}
                </button>
            ))}
            </div>
        )}

        {activeTab === 'catalog' && (
          <div className="animate-fade-in">
             {selectedArtistId === 1 ? (
                 renderStrategicDashboard()
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURED_ARTISTS.map(artist => (
                        <div 
                          key={artist.id} 
                          className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-ear-gold/50 transition-all flex flex-col cursor-pointer shadow-lg" 
                          onClick={() => artist.id === 1 ? setSelectedArtistId(1) : null}
                        >
                            <div className="aspect-[3/4] overflow-hidden relative">
                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                            <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 border border-white/20">
                                <MapPin size={10} className="text-ear-gold" /> {artist.location}
                            </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-black/50 to-black">
                            <span className="text-ear-gold text-xs font-bold uppercase tracking-widest mb-1">{artist.genre}</span>
                            <h4 className="text-2xl font-bold text-white mb-2">{artist.name}</h4>
                            <p className="text-gray-300 text-xs mb-4 line-clamp-3 leading-relaxed">
                                {artist.desc}
                            </p>
                            <div className="mt-auto space-y-3">
                                <button className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-ear-gold transition-colors">Contratar</button>
                                {artist.id === 1 && (
                                    <button className="w-full py-2 bg-purple-900/20 text-purple-300 border border-purple-500/30 font-bold uppercase tracking-widest text-[10px] rounded hover:bg-purple-900/40 transition-colors flex items-center justify-center gap-2">
                                        <TrendingUp size={12} /> Ver Estrategia 360
                                    </button>
                                )}
                            </div>
                            </div>
                        </div>
                    ))}
                 </div>
             )}
          </div>
        )}

        {activeTab === 'contents' && !selectedArtistId && (
            <div className="animate-fade-in max-w-5xl mx-auto space-y-20">
                <div className="text-center">
                    <h3 className="text-4xl font-display font-bold text-white mb-6 uppercase">Librería de <span className="text-ear-gold">Legado EAR</span></h3>
                    <p className="text-gray-400 text-lg leading-relaxed">Metodología propia y acompañamiento estratégico para artistas que buscan la excelencia.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { t: "Mentalidad CEO Artístico", d: "Deja de sobrevivir y empieza a gestionar tu carrera como una empresa de alto valor.", i: Brain },
                        { t: "Marketing para Suscriptores", d: "Contenido exclusivo y acompañamiento real en estrategias de lanzamiento digital.", i: Star },
                        { t: "Diseño de Marca Personal", d: "El camino del autoconocimiento y la concientización técnica de tu identidad.", i: PenTool },
                        { t: "Auditoría de Escenario", d: "Análisis forense de tus actuaciones para optimizar el impacto y la rentabilidad.", i: Scale }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-ear-gold transition-all cursor-pointer group">
                            <item.i className="text-ear-gold mb-4 group-hover:scale-110 transition-transform" size={32} />
                            <h4 className="text-xl font-bold text-white mb-2">{item.t}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">{item.d}</p>
                            <span className="text-xs font-black uppercase text-white tracking-widest border-b border-ear-gold pb-1">Acceder al Módulo</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'join' && !selectedArtistId && (
          <div className="max-w-4xl mx-auto animate-fade-in">
             {/* Application form code... */}
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

export default ArtistsSection;
