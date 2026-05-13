import React, { useState } from 'react';
import { Heart, Brain, Users, Video, Table, BarChart, MessageCircle, Globe, Share2, FileText, CheckCircle, ArrowLeft, Mic, Image, Mail, Calendar, Eye, Clock, Rocket, Flag, RefreshCw, TrendingUp, CalendarClock, ClipboardCheck, MapPin, Target, Award, HeartHandshake, Search, Lightbulb, Megaphone, Coins, Landmark, Handshake, MonitorPlay, Code, Database, Layout, Smartphone, Laptop, Server, PieChart, ThumbsUp, MousePointer, BookOpen, Building, AlertTriangle, Briefcase, Frown, Smile, Download, Zap, Blocks, AlertOctagon, UserCheck, Lock, Shield, FileKey, Globe2, HelpCircle, Terminal, Scale, FileSignature, Gavel, Copyright, EyeOff, XCircle, Package, CalendarCheck, Ear, Sun, ChevronDown, ChevronUp, ShieldCheck, Gem, TrendingDown, Anchor, Network, Activity, Star, Speaker } from 'lucide-react';

const SocialProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ethics' | 'strategy' | 'funding' | 'campaigns' | 'roadmap'>('overview');
  const [openAccordion, setOpenAccordion] = useState<string | null>('sensory');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="pt-20 bg-black min-h-screen font-body text-white">
      
      {/* HERO SECTION */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=2000&auhref=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-900/30 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
            <Heart size={12} fill="currentColor" /> Proyecto Buque Insignia
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 animate-fade-in-up">
            VIAJE MUSICAL <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">POR LA MEMORIA</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed animate-fade-in-up delay-100 font-body">
            Reconectando vidas a través de la música. Una iniciativa terapéutica para devolver la identidad y la emoción a nuestros mayores.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* TABS */}
        <div className="flex justify-center mb-12 overflow-x-auto">
           <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 min-w-max">
              <button onClick={() => setActiveTab('overview')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Proyecto</button>
              <button onClick={() => setActiveTab('ethics')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'ethics' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>CÓDIGO ÉTICO</button>
              <button onClick={() => setActiveTab('strategy')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'strategy' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Estrategia</button>
              <button onClick={() => setActiveTab('funding')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'funding' ? 'bg-ear-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}>INVERSIÓN (Funding)</button>
              <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'campaigns' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Campañas</button>
              <button onClick={() => setActiveTab('roadmap')} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'roadmap' ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Cronograma</button>
           </div>
        </div>

        {/* CONTENT AREAS */}
        
        {/* 1. OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in space-y-20">
             
             {/* General Description */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <Brain size={48} className="text-pink-400 mb-6" />
                    <h3 className="text-2xl font-display font-bold mb-4">El Poder de la Reminiscencia</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Utilizamos la música como llave maestra para acceder a recuerdos que parecían perdidos. Nuestro enfoque científico y humano busca mejorar la calidad de vida de personas con Alzheimer y demencia, reduciendo la ansiedad y fomentando la conexión con sus seres queridos.
                    </p>
                    </div>
                    <div className="flex gap-4">
                    <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                        <span className="text-3xl font-bold text-white block mb-1">150+</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Familias Impactadas</span>
                    </div>
                    <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                        <span className="text-3xl font-bold text-white block mb-1">90%</span>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Mejora Emocional</span>
                    </div>
                    </div>
                </div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10 h-[500px]">
                    <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?q=80&w=1000&auhref=format&fit=crop" alt="Music Therapy" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-lg text-white font-bold italic">"La música es lo último que se olvida."</p>
                    </div>
                </div>
             </div>

             {/* SPECIALIZATION: VITAL SOUND HERITAGE */}
             <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="text-ear-gold font-bold uppercase tracking-[0.2em] text-xs mb-3 block">
                            Especialización Cultural
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            PATRIMONIO SONORO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">VITAL</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                            Rechazamos las playlists genéricas. Para la generación que construyó este país, una Copla no es entretenimiento; es un <strong>ancla emocional</strong> a su identidad antes del olvido.
                        </p>
                    </div>

                    {/* The 3 Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Pillar 1: Copla */}
                        <div className="bg-black/50 border border-white/10 p-6 rounded-2xl hover:border-red-500/50 transition-all group">
                            <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-500 group-hover:scale-110 transition-transform">
                                <Anchor size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">La Copla & Posguerra</h4>
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 block">Pilar de Resiliencia</span>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Música de supervivencia. Conectamos con emociones de fortaleza y superación. Reactivamos la dignidad y la "raíz" del paciente.
                            </p>
                        </div>

                        {/* Pillar 2: Ye-yé */}
                        <div className="bg-black/50 border border-white/10 p-6 rounded-2xl hover:border-yellow-500/50 transition-all group">
                            <div className="w-12 h-12 bg-yellow-900/20 rounded-full flex items-center justify-center mb-4 text-yellow-500 group-hover:scale-110 transition-transform">
                                <Sun size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">El Ye-yé & Apertura</h4>
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3 block">Pilar de Vitalidad</span>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Alegría y activación motora. La herramienta para cambiar el estado de ánimo de pasivo a activo. Nadie puede estar triste escuchando "Tómbola".
                            </p>
                        </div>

                        {/* Pillar 3: Verbena */}
                        <div className="bg-black/50 border border-white/10 p-6 rounded-2xl hover:border-orange-500/50 transition-all group">
                            <div className="w-12 h-12 bg-orange-900/20 rounded-full flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Verbena & Folclore</h4>
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3 block">Pilar de Comunidad</span>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Pasodobles y Zarzuelas. Sonidos que significan "familia". Un himno colectivo que combate el aislamiento y une a la sala.
                            </p>
                        </div>
                    </div>

                    {/* The Linchpin & Tech */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Linchpin */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-center">
                            <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                                <MapPin className="text-ear-gold" /> El Linchpin: Curación Biográfica
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                No adivinamos; investigamos. Creamos perfiles basados en la región y la edad exacta. <strong>El Mapeo de la Banda Sonora Vital™</strong> identifica qué sonaba en la radio cuando tenían 15 años, fijando la memoria para siempre.
                            </p>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-ear-gold uppercase tracking-widest">
                                <CheckCircle size={14} /> Manolo Escobar activa neuronas que The Beatles no tocan.
                            </div>
                        </div>

                        {/* Tech Infra */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 flex flex-col justify-center">
                            <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
                                <Speaker className="text-blue-400" /> Infraestructura de Contexto
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                La música antigua tiene grabaciones ruidosas. No ponemos el disco viejo; <strong>remasterizamos la experiencia en vivo</strong>. Usamos audio de alta fidelidad para atravesar la barrera de la hipoacusia (sordera) y entregar claridad cristalina.
                            </p>
                            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest">
                                <Zap size={14} /> Tecnología Médica de Precisión Sonora.
                            </div>
                        </div>
                    </div>

                </div>
             </div>

          </div>
        )}

        {/* 2. ETHICAL CODE */}
        {activeTab === 'ethics' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             
             {/* Header */}
             <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-ear-gold/10 border border-ear-gold/30 text-ear-gold text-xs font-bold uppercase tracking-widest mb-6">
                  <ShieldCheck size={14} /> Manifiesto de Verdad
               </div>
               <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">EL PACTO DE CUIDADO</h2>
               <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto">
                 En un sector lleno de buenas intenciones pero a veces falto de rigor, nosotros operamos bajo un protocolo de Humanidad Radical. <strong className="text-white">No gestionamos "pacientes"; honramos historias de vida.</strong>
               </p>
             </div>

             {/* 1. Ecosystem of Respect (Stakeholders) */}
             <div className="mb-20">
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                   <Users className="text-pink-400" /> 1. El Ecosistema de Respeto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Protagonists */}
                   <div className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-pink-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-pink-900/20 rounded-xl text-pink-400 group-hover:bg-pink-500 group-hover:text-white transition-colors"><Smile size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Los Participantes</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Dignidad Absoluta</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                         Rechazamos el lenguaje infantilizador. Nos dirigimos a ellos con el respeto jerárquico que merecen sus años hasta que la confianza permita cercanía.
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-xs font-bold text-pink-400 italic">"No son sujetos de terapia; son los guías de su propio viaje."</p>
                      </div>
                   </div>

                   {/* Guardians */}
                   <div className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-blue-900/20 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><HeartHandshake size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Familias & Cuidadores</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Transparencia Emocional</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                         Sabemos que necesitáis certeza, no solo esperanza. Ofrecemos canales directos para actualizaciones reales, no automatizadas.
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-xs font-bold text-blue-400 italic">"No endulzamos la realidad, la acompañamos."</p>
                      </div>
                   </div>

                   {/* Allies */}
                   <div className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-green-900/20 rounded-xl text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors"><Briefcase size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aliados Clínicos</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Rigor Científico</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                         No competimos con la medicina; nos integramos en ella. Entregamos informes basados en evidencia y coordinamos nuestra intervención.
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-xs font-bold text-green-400 italic">"Musicoterapia no es entretenimiento. Es clínica."</p>
                      </div>
                   </div>

                   {/* Partners */}
                   <div className="bg-[#111] border border-white/10 p-8 rounded-2xl hover:border-ear-gold/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="p-3 bg-ear-gold/20 rounded-xl text-ear-gold group-hover:bg-ear-gold group-hover:text-black transition-colors"><Landmark size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Socios de Impacto</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Rendición de Cuentas</h4>
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                         Si algo no funciona, lo decimos. Si algo funciona, lo probamos con datos. El uso de los fondos es sagrado.
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <p className="text-xs font-bold text-ear-gold italic">"Resultados medibles. Cero humo."</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* 2. Communication Technology (Accordion) */}
             <div className="mb-20">
                <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                   <Zap className="text-ear-gold" /> 2. Nuestra "Tecnología" de Comunicación
                </h3>
                <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden">
                   {/* Item 1 */}
                   <div className="border-b border-white/5">
                      <button 
                        onClick={() => toggleAccordion('sensory')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
                      >
                         <div className="flex items-center gap-4">
                            <Ear className="text-pink-400" size={24} />
                            <span className="text-lg font-bold text-white">Adaptación Sensorial Radical</span>
                         </div>
                         {openAccordion === 'sensory' ? <ChevronUp className="text-gray-500"/> : <ChevronDown className="text-gray-500"/>}
                      </button>
                      {openAccordion === 'sensory' && (
                         <div className="p-6 pt-0 pl-16 text-gray-400 text-sm leading-relaxed border-l-2 border-pink-500/20 ml-6 mb-6 animate-fade-in">
                            No gritamos; articulamos. Controlamos el entorno para eliminar el ruido de fondo que aísla. Cuidamos la iluminación para que la lectura de labios y las señales visuales sean claras para quienes han perdido audición.
                         </div>
                      )}
                   </div>
                   {/* Item 2 */}
                   <div className="border-b border-white/5">
                      <button 
                        onClick={() => toggleAccordion('cognitive')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
                      >
                         <div className="flex items-center gap-4">
                            <Brain className="text-blue-400" size={24} />
                            <span className="text-lg font-bold text-white">Arquitectura Cognitiva</span>
                         </div>
                         {openAccordion === 'cognitive' ? <ChevronUp className="text-gray-500"/> : <ChevronDown className="text-gray-500"/>}
                      </button>
                      {openAccordion === 'cognitive' && (
                         <div className="p-6 pt-0 pl-16 text-gray-400 text-sm leading-relaxed border-l-2 border-blue-500/20 ml-6 mb-6 animate-fade-in">
                            Para mentes que procesan diferente, comunicamos diferente. Dividimos la información en piezas asimilables, usamos la repetición positiva y validamos la comprensión sin presionar.
                         </div>
                      )}
                   </div>
                   {/* Item 3 */}
                   <div>
                      <button 
                        onClick={() => toggleAccordion('nonverbal')}
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
                      >
                         <div className="flex items-center gap-4">
                            <Eye className="text-ear-gold" size={24} />
                            <span className="text-lg font-bold text-white">El Poder de lo No Verbal</span>
                         </div>
                         {openAccordion === 'nonverbal' ? <ChevronUp className="text-gray-500"/> : <ChevronDown className="text-gray-500"/>}
                      </button>
                      {openAccordion === 'nonverbal' && (
                         <div className="p-6 pt-0 pl-16 text-gray-400 text-sm leading-relaxed border-l-2 border-ear-gold/20 ml-6 mb-6 animate-fade-in">
                            Cuando las palabras fallan, nuestro lenguaje corporal sostiene la conversación. Contacto visual directo, paciencia infinita y contacto físico respetuoso cuando la cultura lo permite.
                         </div>
                      )}
                   </div>
                </div>
             </div>

             {/* 3. Ethical Shielding */}
             <div className="bg-gradient-to-br from-gray-900 to-black border border-ear-gold/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                   <Shield size={150} />
                </div>
                <div className="relative z-10">
                   <h3 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                      <Lock className="text-ear-gold" /> 3. Protocolo de Integridad EAR
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                         <h4 className="text-white font-bold flex items-center gap-2"><UserCheck size={18} className="text-green-400"/> Consentimiento Real</h4>
                         <p className="text-xs text-gray-400 leading-relaxed">
                            No asumimos el "sí". Buscamos el consentimiento informado, respetando la capacidad de decisión y, cuando es necesario, involucrando a tutores legales.
                         </p>
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-white font-bold flex items-center gap-2"><FileKey size={18} className="text-blue-400"/> Privacidad Blindada</h4>
                         <p className="text-xs text-gray-400 leading-relaxed">
                            Los recuerdos son sagrados; los datos, también. Cumplimiento estricto del RGPD con medidas de seguridad reforzadas para información de salud.
                         </p>
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-white font-bold flex items-center gap-2"><Sun size={18} className="text-ear-gold"/> La Verdad Ante Todo</h4>
                         <p className="text-xs text-gray-400 leading-relaxed">
                            No prometemos curas milagrosas; prometemos momentos de conexión real y mejora de la calidad de vida basada en la ciencia.
                         </p>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        )}

        {/* 3. FUNDING STRATEGY (NEW TAB) */}
        {activeTab === 'funding' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
             
             {/* 1. THE REFRAMING HERO */}
             <div className="text-center mb-16 relative">
               <div className="absolute left-1/2 top-0 -translate-x-1/2 w-64 h-64 bg-ear-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
               <span className="text-ear-gold font-bold uppercase tracking-[0.3em] text-xs mb-4 block relative z-10">
                 FILOSOFÍA DE FINANCIACIÓN
               </span>
               <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-6 relative z-10 leading-tight">
                 DE LA CARIDAD A LA <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-ear-gold to-white">INVERSIÓN EN LEGADO</span>
               </h2>
               <p className="text-gray-400 text-lg max-w-3xl mx-auto font-body leading-relaxed relative z-10">
                 No buscamos donaciones para sobrevivir. Buscamos Socios Fundadores que quieran asociar su marca a la innovación en la <strong>"Silver Economy"</strong> y la <strong>Restauración Cognitiva</strong>.
               </p>
             </div>

             {/* 2. THE SPIELBERG PITCH (Visual Hook) */}
             <div className="mb-20 bg-[#111] border border-ear-gold/30 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 p-6 opacity-5 pointer-events-none">
                   <Video size={120} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                   <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                         <span className="text-xs font-bold text-red-500 uppercase tracking-widest">El Pitch de 50 Palabras</span>
                      </div>
                      <blockquote className="text-2xl md:text-3xl font-display font-bold text-white leading-snug italic border-l-4 border-ear-gold pl-6">
                        "El Alzheimer borra quién eres. Pero la música se aloja en una parte del cerebro que la enfermedad no toca. Nosotros usamos esa 'puerta trasera' neurológica para que Antonio, que no recuerda a su hija, vuelva a cantarle la nana de su infancia. Recuperamos a la persona, nota a nota."
                      </blockquote>
                   </div>
                   <div className="md:w-1/3 flex flex-col justify-center items-center text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                         <Lightbulb size={40} className="text-ear-gold" />
                      </div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                         Efecto Visualización Inmediata
                      </p>
                   </div>
                </div>
             </div>

             {/* 3. THE TARGET MAP (Shooting Map) */}
             <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Target size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">Mapa de Tiro: Los 3 Verticales</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Banking */}
                   <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-3 bg-green-900/20 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors"><Landmark size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase">Banca & Seguros</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Longevidad Digna</h4>
                      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                         El gancho: Eficiencia sociosanitaria.
                         <br/>
                         "Nuestra arquitectura reduce la ansiedad en centros y mejora la calidad de vida sin fármacos."
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <span className="text-xs font-bold text-white block mb-1">Objetivos:</span>
                         <span className="text-xs text-gray-500">Fundación "la Caixa", Mapfre, BBVA.</span>
                      </div>
                   </div>

                   {/* Tech */}
                   <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-colors"><Network size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase">Tech & Telco</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Conexión Humana</h4>
                      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                         El gancho: Reconexión real.
                         <br/>
                         "En un mundo hiperconectado, nuestros mayores están aislados. Usamos tecnología de audio para reconectar neuronas."
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <span className="text-xs font-bold text-white block mb-1">Objetivos:</span>
                         <span className="text-xs text-gray-500">Fundación Telefónica, Vodafone.</span>
                      </div>
                   </div>

                   {/* Pharma */}
                   <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-colors"><Activity size={24}/></div>
                         <span className="text-xs font-bold text-gray-500 uppercase">Sanitaria</span>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">Terapia Complementaria</h4>
                      <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                         El gancho: Humanización de marca.
                         <br/>
                         "Somos el complemento emocional a su tratamiento clínico. Ustedes cuidan el cuerpo; nosotros la identidad."
                      </p>
                      <div className="pt-4 border-t border-white/10">
                         <span className="text-xs font-bold text-white block mb-1">Objetivos:</span>
                         <span className="text-xs text-gray-500">Cinfa, Sanitas, Laboratorios.</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* 4. THE OFFER (Sponsorship Products) */}
             <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-ear-gold/20 rounded-xl text-ear-gold"><Gem size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">Productos de Patrocinio (Legado)</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   
                   {/* Level 1 */}
                   <div className="bg-gradient-to-b from-white/10 to-black p-1 rounded-3xl">
                      <div className="bg-black h-full rounded-[20px] p-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 bg-white/10 px-4 py-2 rounded-bl-xl text-xs font-bold text-white uppercase tracking-widest">Nivel 1</div>
                         <h4 className="text-2xl font-display font-bold text-white mb-2">Adopta un Centro</h4>
                         <p className="text-ear-gold font-bold text-xl mb-6">3.000€ - 5.000€</p>
                         <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-ear-gold mt-0.5"/> Intervención completa (3 meses) en una residencia.</li>
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-ear-gold mt-0.5"/> Reporte de Impacto Emocional (Video + Datos).</li>
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-ear-gold mt-0.5"/> Visita corporativa de voluntariado.</li>
                         </ul>
                         <button className="w-full py-3 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors">Solicitar Dossier</button>
                      </div>
                   </div>

                   {/* Level 2 (Featured) */}
                   <div className="bg-gradient-to-b from-ear-gold to-yellow-600 p-1 rounded-3xl transform lg:-translate-y-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                      <div className="bg-black h-full rounded-[20px] p-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 bg-ear-gold text-black px-4 py-2 rounded-bl-xl text-xs font-bold uppercase tracking-widest">Exclusivo</div>
                         <h4 className="text-2xl font-display font-bold text-white mb-2">Arquitecto de Memoria</h4>
                         <p className="text-ear-gold font-bold text-xl mb-6">Partner Único</p>
                         <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-white"><Star size={16} className="text-ear-gold mt-0.5"/> Apadrinamiento total del lanzamiento Fase Piloto.</li>
                            <li className="flex items-start gap-3 text-sm text-white"><Star size={16} className="text-ear-gold mt-0.5"/> Branding exclusivo en toda la comunicación.</li>
                            <li className="flex items-start gap-3 text-sm text-white"><Star size={16} className="text-ear-gold mt-0.5"/> Documental dedicado a la marca.</li>
                         </ul>
                         <button className="w-full py-4 bg-ear-gold text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-colors shadow-lg">Agendar Reunión</button>
                      </div>
                   </div>

                   {/* Level 3 */}
                   <div className="bg-gradient-to-b from-blue-500/30 to-black p-1 rounded-3xl">
                      <div className="bg-black h-full rounded-[20px] p-8 relative overflow-hidden">
                         <div className="absolute top-0 right-0 bg-blue-900/30 px-4 py-2 rounded-bl-xl text-xs font-bold text-blue-400 uppercase tracking-widest">En Especie</div>
                         <h4 className="text-2xl font-display font-bold text-white mb-2">Socio Tecnológico</h4>
                         <p className="text-blue-400 font-bold text-xl mb-6">Equipamiento</p>
                         <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-blue-400 mt-0.5"/> Donación de auriculares (JBL/Shure) o Tablets.</li>
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-blue-400 mt-0.5"/> "Powered by [Tu Marca]" en cada sesión.</li>
                            <li className="flex items-start gap-3 text-sm text-gray-400"><CheckCircle size={16} className="text-blue-400 mt-0.5"/> Contenido para RRSS de la marca.</li>
                         </ul>
                         <button className="w-full py-3 border border-white/20 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-black transition-colors">Ofrecer Tecnología</button>
                      </div>
                   </div>

                </div>
             </div>

             {/* 5. TRUST ARCHITECTURE (Why Us) */}
             <div className="mb-20 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/3 text-center">
                   <div className="w-32 h-32 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden border-2 border-ear-gold relative">
                      <img src="https://picsum.photos/id/453/400/400" alt="Fundador" className="w-full h-full object-cover" />
                   </div>
                   <h4 className="text-white font-bold text-lg">El Linchpin del Fundador</h4>
                   <p className="text-gray-500 text-xs uppercase tracking-widest">Edwin Agudelo</p>
                </div>
                <div className="md:w-2/3 space-y-4">
                   <h3 className="text-2xl font-display font-bold text-white">¿Por qué confiar sin métricas históricas?</h3>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3">
                         <ShieldCheck className="text-ear-gold mt-1 shrink-0" size={20}/>
                         <p className="text-gray-400 text-sm"><strong>Foso Moral (Honestidad Radical):</strong> No tenemos la burocracia de las grandes ONGs. Cada euro va directo a la intervención. Somos la fuerza de ataque rápido contra la soledad.</p>
                      </div>
                      <div className="flex items-start gap-3">
                         <Anchor className="text-ear-gold mt-1 shrink-0" size={20}/>
                         <p className="text-gray-400 text-sm"><strong>Autoridad Artística:</strong> "He emocionado a auditorios de miles; ahora uso esa capacidad técnica de élite para emocionar a quien más lo necesita. Es una transferencia de competencia."</p>
                      </div>
                      <div className="flex items-start gap-3">
                         <TrendingDown className="text-ear-gold mt-1 shrink-0" size={20}/>
                         <p className="text-gray-400 text-sm"><strong>Metodología, no Evento:</strong> No hacemos "conciertos". Aplicamos el protocolo Vimume (Diagnóstico, Intervención, Evaluación). Un sistema escalable y medible.</p>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        )}

        {/* 2. STRATEGY DASHBOARD (Updated) */}
        {activeTab === 'strategy' && (
          <div className="animate-fade-in">
             
             {/* 2.1 OBJECTIVES & STRATEGY */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-ear-gold/20 rounded-xl text-ear-gold"><Target size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">1. Objetivos & Ejecución</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Objective 1 */}
                    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 group hover:border-ear-gold/30 transition-colors flex flex-col">
                        <h4 className="text-ear-gold font-bold mb-4 flex items-center gap-2 text-lg"><Users size={18}/> Conversión & Fidelización</h4>
                        <ul className="space-y-4 text-sm text-gray-400 mb-6 flex-1">
                           <li className="flex gap-2 items-start"><Video size={14} className="text-blue-400 mt-1 shrink-0"/> <span><strong>Estrategia 1:</strong> Testimonios en video para conexión emocional.</span></li>
                           <li className="flex gap-2 items-start"><Download size={14} className="text-green-500 mt-1 shrink-0"/> <span><strong>Estrategia 2:</strong> Guías descargables (Lead Magnets) sobre beneficios.</span></li>
                        </ul>
                        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-500 font-mono">
                           <Mail size={12} /> Herramienta: Lead Magnets + Mailchimp
                        </div>
                    </div>

                    {/* Objective 2 */}
                    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 group hover:border-ear-gold/30 transition-colors flex flex-col">
                        <h4 className="text-ear-gold font-bold mb-4 flex items-center gap-2 text-lg"><MonitorPlay size={18}/> Plataforma Informativa</h4>
                        <ul className="space-y-4 text-sm text-gray-400 mb-6 flex-1">
                           <li className="flex gap-2 items-start"><MessageCircle size={14} className="text-blue-400 mt-1 shrink-0"/> <span><strong>Estrategia 1:</strong> FAQs con videos de expertos en musicoterapia.</span></li>
                           <li className="flex gap-2 items-start"><FileText size={14} className="text-green-500 mt-1 shrink-0"/> <span><strong>Estrategia 2:</strong> Blog educativo sobre calidad de vida.</span></li>
                        </ul>
                        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-500 font-mono">
                           <Layout size={12} /> Herramienta: WordPress + WooCommerce
                        </div>
                    </div>

                    {/* Objective 3 */}
                    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-white/10 group hover:border-ear-gold/30 transition-colors flex flex-col">
                        <h4 className="text-ear-gold font-bold mb-4 flex items-center gap-2 text-lg"><Award size={18}/> Referente del Sector</h4>
                        <ul className="space-y-4 text-sm text-gray-400 mb-6 flex-1">
                           <li className="flex gap-2 items-start"><BarChart size={14} className="text-blue-400 mt-1 shrink-0"/> <span><strong>Estrategia 1:</strong> Publicar estudios de caso y resultados concretos.</span></li>
                           <li className="flex gap-2 items-start"><Users size={14} className="text-green-500 mt-1 shrink-0"/> <span><strong>Estrategia 2:</strong> Colaboraciones con influencers del sector salud.</span></li>
                        </ul>
                        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-500 font-mono">
                           <Share2 size={12} /> Herramienta: Integración Redes Sociales
                        </div>
                    </div>

                </div>
             </div>

             {/* 2.3 COMMUNICATION & MARKETING */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Megaphone size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">2. Estrategia de Comunicación</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Internal Communication */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-purple-400" size={18}/> Comunicación Interna
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex gap-3">
                                <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs font-bold h-fit">Slack</span>
                                <span>Comunicación fluida y constante entre equipos de desarrollo y producción.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-purple-900/40 text-purple-300 px-2 py-1 rounded text-xs font-bold h-fit">Reuniones</span>
                                <span>Sesiones semanales para revisar progreso y ajustar estrategia por resultados.</span>
                            </li>
                        </ul>
                    </div>

                    {/* External Communication */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Globe className="text-pink-400" size={18}/> Comunicación Externa
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                <span className="text-sm font-bold text-white">Redes Sociales</span>
                                <span className="text-xs text-gray-500">Videos cortos de sesiones en FB/IG.</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                <span className="text-sm font-bold text-white">Blog & Newsletter</span>
                                <span className="text-xs text-gray-500">Publicaciones semanales de consejos e historias.</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                <span className="text-sm font-bold text-white">Eventos & Webinars</span>
                                <span className="text-xs text-gray-500">Demostraciones en vivo de musicoterapia.</span>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* 2.4 TECHNOLOGICAL PLATFORM */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Code size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">3. Plataforma Tecnológica</h3>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                        {/* Tech Stack */}
                        <div className="space-y-6">
                            <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <Database size={14}/> Stack Técnico
                            </h4>
                            <div className="space-y-3">
                                <div className="p-3 border border-white/10 rounded-lg bg-black/50">
                                    <p className="text-white font-bold text-sm">CMS & Gestión</p>
                                    <p className="text-xs text-gray-500">WordPress + WooCommerce (Servicios)</p>
                                </div>
                                <div className="p-3 border border-white/10 rounded-lg bg-black/50">
                                    <p className="text-white font-bold text-sm">Desarrollo</p>
                                    <p className="text-xs text-gray-500">PHP, MySQL (Back) / React (Front Interactivo)</p>
                                </div>
                            </div>
                        </div>
                        {/* Web Structure */}
                        <div className="space-y-6">
                            <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <Layout size={14}/> Estructura Web
                            </h4>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> <strong>Home:</strong> Video destacado + CTA claro.</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div> <strong>Secciones:</strong> Servicios, Beneficios, Blog, Contacto.</li>
                            </ul>
                        </div>
                        {/* UX */}
                        <div className="space-y-6">
                            <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                <Smartphone size={14}/> Experiencia Usuario
                            </h4>
                            <div className="bg-cyan-900/10 border border-cyan-500/20 p-4 rounded-xl">
                                <p className="text-white font-bold text-sm mb-1">Ruta Guiada</p>
                                <p className="text-xs text-gray-400 mb-4">Tour interactivo desde la llegada.</p>
                                <p className="text-white font-bold text-sm mb-1">Gamificación</p>
                                <p className="text-xs text-gray-400">Recompensas por educación.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* 2.5 SECURITY & PRIVACY */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400"><Shield size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">4. Seguridad y Privacidad</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* GDPR */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-900/30 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors"><FileKey size={24}/></div>
                            <h4 className="text-xl font-bold text-white">Cumplimiento GDPR</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Consentimiento informado y explícito.</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Políticas de privacidad claras y accesibles.</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Derecho al olvido y portabilidad de datos.</li>
                        </ul>
                    </div>

                    {/* SSL & Infrastructure */}
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-colors group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-900/30 rounded-lg text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors"><Lock size={24}/></div>
                            <h4 className="text-xl font-bold text-white">Infraestructura Segura</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Certificados SSL (Encriptación total).</li>
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Dominio verificado: <strong>www.productoraear.com</strong></li>
                            <li className="flex gap-2 items-center"><CheckCircle size={14} className="text-emerald-500"/> Backups diarios y protección anti-DDoS.</li>
                        </ul>
                    </div>
                </div>
             </div>

             {/* 2.6 RESOURCE OPTIMIZATION */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-teal-500/20 rounded-xl text-teal-400"><Blocks size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">5. Optimización de Recursos</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                        <div className="p-3 bg-teal-900/30 rounded-lg text-teal-400"><Layout size={24}/></div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Diseño Modular</h4>
                            <p className="text-gray-400 text-sm">Arquitectura flexible que facilita futuras actualizaciones y mantenimiento sin reconstruir el sistema.</p>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                        <div className="p-3 bg-teal-900/30 rounded-lg text-teal-400"><Terminal size={24}/></div>
                        <div>
                            <h4 className="text-white font-bold mb-2">Código Abierto</h4>
                            <p className="text-gray-400 text-sm">Uso estratégico de WordPress, Mailchimp y Google Analytics para minimizar costes de licencia y maximizar control.</p>
                        </div>
                    </div>
                </div>
             </div>

             {/* 2.7 RISK MANAGEMENT */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><AlertOctagon size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">6. Factores de Error y Riesgos</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] p-6 rounded-2xl border border-red-900/30 flex items-center gap-6">
                        <div className="space-y-1">
                            <span className="text-red-400 text-xs font-bold uppercase">Riesgo</span>
                            <h4 className="text-white font-bold">Desconexión con el Público</h4>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="space-y-1">
                            <span className="text-green-400 text-xs font-bold uppercase">Mitigación</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <UserCheck size={16}/> Validación continua con usuarios.
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] p-6 rounded-2xl border border-red-900/30 flex items-center gap-6">
                        <div className="space-y-1">
                            <span className="text-red-400 text-xs font-bold uppercase">Riesgo</span>
                            <h4 className="text-white font-bold">Limitaciones Presupuestarias</h4>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="space-y-1">
                            <span className="text-green-400 text-xs font-bold uppercase">Mitigación</span>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Target size={16}/> Priorización de funciones críticas.
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* 2.8 FUNDING STRATEGY */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400"><Coins size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">7. Estrategia de Financiación (Ver Tab 'Inversión')</h3>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                   <p className="text-gray-400 text-sm">Esta sección ha sido expandida y movida a su propia pestaña "INVERSIÓN (Funding)" para mayor detalle estratégico.</p>
                </div>
             </div>

             {/* 2.9 MEASUREMENT OF SUCCESS (KPIs) */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-400"><PieChart size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">8. Medición de Éxito (KPIs)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="p-4 bg-pink-500/10 rounded-full text-pink-500 mb-4">
                            <Share2 size={32} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Engagement RRSS</h4>
                        <p className="text-xs text-gray-400 mb-4">Interacciones, compartidos y alcance de campañas.</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 w-[70%]"></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 self-end">Objetivo: Alto</span>
                    </div>

                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="p-4 bg-blue-500/10 rounded-full text-blue-500 mb-4">
                            <MousePointer size={32} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Conversiones Web</h4>
                        <p className="text-xs text-gray-400 mb-4">Ratio de visitantes a clientes registrados.</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%]"></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 self-end">Objetivo: Medio/Alto</span>
                    </div>

                    <div className="bg-[#111] border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="p-4 bg-green-500/10 rounded-full text-green-500 mb-4">
                            <ThumbsUp size={32} />
                        </div>
                        <h4 className="font-bold text-white mb-2">Satisfacción Usuario</h4>
                        <p className="text-xs text-gray-400 mb-4">Feedback post-sesión de musicoterapia.</p>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[90%]"></div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2 self-end">Objetivo: Muy Alto</span>
                    </div>
                </div>
             </div>

             {/* 2.10 STRATEGIC OPTIMIZATION QUESTIONS */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400"><HelpCircle size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">9. Preguntas Estratégicas (RFP)</h3>
                </div>
                
                <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                   <div className="p-6 border-b border-white/10">
                      <p className="text-gray-400 text-sm">Cuestiones clave para la fase de definición técnica y estratégica con el equipo EAR.</p>
                   </div>
                   <div className="divide-y divide-white/5">
                      {[
                        "¿Especificidad de la plataforma: enfoque técnico (stack) o estratégico?",
                        "¿Profundidad de la estrategia de comunicación: ejemplos concretos y cronogramas?",
                        "¿Tipos de contenidos prioritarios: video corto, infografías, artículos?",
                        "¿Público objetivo prioritario: Seniors/Cuidadores vs Inversores/B2B?",
                        "¿Límites presupuestarios iniciales definidos?",
                        "¿Ejemplos de contenido disruptivo en mente?",
                        "¿Formato de entrega del plan de contenidos (Excel, Sheets)?",
                        "¿Riesgos específicos conocidos a evitar?",
                        "¿Fechas límite estrictas para cada fase del lanzamiento?",
                        "¿Modelo de interacción con expertos: colaborativo o por silos?",
                        "¿Definición numérica de 'Éxito' (KPIs específicos)?"
                      ].map((q, i) => (
                        <div key={i} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                           <span className="text-orange-400 font-bold font-mono text-sm">{(i+1).toString().padStart(2, '0')}.</span>
                           <p className="text-sm text-gray-300">{q}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* 2.11 LEGAL FRAMEWORK & COMMITMENT (New Section) */}
             <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400"><Scale size={24} /></div>
                    <h3 className="text-3xl font-display font-bold text-white">10. Marco Contractual & Compromiso</h3>
                </div>

                {/* Contract Clauses */}
                <div className="mb-12">
                   <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <FileSignature className="text-gray-400" size={20}/> Cláusulas Estándar
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "Objeto del Contrato", icon: FileText, desc: "Definición clara de servicios y alcance." },
                        { title: "Duración", icon: Clock, desc: "Plazos de ejecución y vigencia." },
                        { title: "Exclusividad", icon: Lock, desc: "Términos de exclusividad territorial o temporal." },
                        { title: "Propiedad Intelectual", icon: Copyright, desc: "Derechos sobre obras y contenidos creados." },
                        { title: "Confidencialidad", icon: EyeOff, desc: "Protección de datos sensibles y know-how." },
                        { title: "Terminación", icon: XCircle, desc: "Condiciones de rescisión anticipada." },
                        { title: "Resolución Conflictos", icon: Gavel, desc: "Mediación y jurisdicción competente." },
                        { title: "Aceptación", icon: Handshake, desc: "Firma y conformidad de las partes." }
                      ].map((clause, i) => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors">
                           <div className="flex items-center gap-3 mb-2">
                              <clause.icon size={16} className="text-indigo-400" />
                              <span className="font-bold text-sm text-white">{clause.title}</span>
                           </div>
                           <p className="text-xs text-gray-500">{clause.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Maximum Involvement Pledge */}
                <div className="bg-gradient-to-r from-indigo-900/20 to-black border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <Award size={120} />
                   </div>
                   <div className="relative z-10">
                      <h4 className="text-2xl font-display font-bold text-white mb-6">Nuestra Implicación Máxima</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="flex gap-4">
                            <div className="p-3 bg-ear-gold/20 rounded-lg text-ear-gold h-fit">
                               <CalendarClock size={24} />
                            </div>
                            <div>
                               <h5 className="font-bold text-white mb-2">Exclusividad en la Fecha</h5>
                               <p className="text-sm text-gray-400 leading-relaxed">
                                  Garantizamos dedicación total. No sobrecargamos nuestra agenda. Cuando reservamos una fecha para Vimume, todos los recursos humanos y técnicos están bloqueados exclusivamente para ese proyecto.
                               </p>
                            </div>
                         </div>
                         <div className="flex gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 h-fit">
                               <Package size={24} />
                            </div>
                            <div>
                               <h5 className="font-bold text-white mb-2">Material y Recursos Diversos</h5>
                               <p className="text-sm text-gray-400 leading-relaxed">
                                  Ponemos a disposición todo nuestro arsenal. Desde equipos de sonido de alta fidelidad hasta personal de apoyo emocional, sin costes ocultos ni sorpresas de última hora.
                               </p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* 2.12 CONTENT PLAN TABLE (Renumbered) */}
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 pt-8 border-t border-white/10">
                <div>
                   <h3 className="text-3xl font-display font-bold text-white">11. Plan de Contenidos</h3>
                   <p className="text-gray-400 text-sm mt-2">Ejecución táctica multicanal para "Viaje Musical por la Memoria".</p>
                </div>
                <button className="flex items-center gap-2 text-pink-400 text-xs font-bold border border-pink-400/30 px-4 py-3 rounded-lg hover:bg-pink-400/10 transition-colors uppercase tracking-widest">
                   <FileText size={16} /> Descargar PDF Estratégico
                </button>
             </div>

             <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-2xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-gray-400 uppercase tracking-wider">
                         <th className="p-6">Contenido</th>
                         <th className="p-6">Formato</th>
                         <th className="p-6">Objetivo</th>
                         <th className="p-6">Público Objetivo</th>
                         <th className="p-6">Canal</th>
                         <th className="p-6">Frecuencia</th>
                         <th className="p-6">KPIs</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-sm text-gray-300">
                      
                      {/* 1. Video Testimonios */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Video size={18} /></div>
                            Video Testimonios
                         </td>
                         <td className="p-6">Video (1-2 min)</td>
                         <td className="p-6">Resaltar conexión emocional y legado.</td>
                         <td className="p-6">Familiares, cuidadores, centros.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">RRSS, Web</td>
                         <td className="p-6"><span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">Mensual</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Vistas, Interacción</td>
                      </tr>

                      {/* 2. Mini-documentales */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400"><Video size={18} /></div>
                            Mini-documentales
                         </td>
                         <td className="p-6">Video (3-5 min)</td>
                         <td className="p-6">Mostrar la historia y contribución real.</td>
                         <td className="p-6">Mayores, familiares, inversores.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">YouTube, Web</td>
                         <td className="p-6"><span className="bg-purple-900/40 text-purple-300 px-3 py-1 rounded-full text-xs font-bold">Trimestral</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Visualizaciones</td>
                      </tr>

                      {/* 3. Artículos Blog */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><FileText size={18} /></div>
                            Artículos Blog
                         </td>
                         <td className="p-6">Texto (500-800)</td>
                         <td className="p-6">Educación sobre musicoterapia.</td>
                         <td className="p-6">Cuidadores, terapeutas, fundaciones.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">Blog Web</td>
                         <td className="p-6"><span className="bg-green-900/40 text-green-300 px-3 py-1 rounded-full text-xs font-bold">Quincenal</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Lecturas, Tiempo</td>
                      </tr>

                      {/* 4. Infografías */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Image size={18} /></div>
                            Infografías
                         </td>
                         <td className="p-6">Visual / Gráfico</td>
                         <td className="p-6">Explicar beneficios visualmente.</td>
                         <td className="p-6">Familiares, administración pública.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">RRSS, Email</td>
                         <td className="p-6"><span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">Mensual</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Shares, Descargas</td>
                      </tr>

                      {/* 5. Podcast */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><Mic size={18} /></div>
                            Podcast Expertos
                         </td>
                         <td className="p-6">Audio (10-15 min)</td>
                         <td className="p-6">Debate sobre impacto en salud.</td>
                         <td className="p-6">Profesionales, medios.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">Spotify, Apple</td>
                         <td className="p-6"><span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">Mensual</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Subs, Escuchas</td>
                      </tr>

                      {/* 6. Newsletter */}
                      <tr className="hover:bg-white/5 transition-colors group">
                         <td className="p-6 font-bold text-white flex items-center gap-3">
                            <div className="p-2 bg-ear-gold/20 rounded-lg text-ear-gold"><Mail size={18} /></div>
                            Newsletter
                         </td>
                         <td className="p-6">Email HTML</td>
                         <td className="p-6">Actualización de avances y eventos.</td>
                         <td className="p-6">Todos los públicos.</td>
                         <td className="p-6 text-xs font-bold uppercase text-gray-500">Email Mkt</td>
                         <td className="p-6"><span className="bg-blue-900/40 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">Mensual</span></td>
                         <td className="p-6 text-green-400 font-mono text-xs">Open Rate, Clics</td>
                      </tr>

                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* 3. CAMPAIGNS SHOWCASE */}
        {activeTab === 'campaigns' && (
          <div className="animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                
                {/* Script 7 Card */}
                <div className="bg-[#111] border border-ear-gold/30 p-8 rounded-2xl relative overflow-hidden group hover:border-ear-gold transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <FileText size={80} />
                   </div>
                   <div className="text-xs text-ear-gold font-bold uppercase tracking-widest mb-4">En Producción</div>
                   <h3 className="text-2xl font-display font-bold text-white mb-2">Guion 7: "La Ausencia del Abuelo"</h3>
                   <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      Cortometraje narrativo que explora el vacío silencioso en una cena familiar y cómo una vieja canción de radio trae de vuelta, por un instante, al patriarca.
                   </p>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/10 rounded text-xs text-white">Narrativa Emocional</span>
                      <span className="px-3 py-1 bg-white/10 rounded text-xs text-white">Legado</span>
                   </div>
                </div>

                {/* Mini Doc Card */}
                <div className="bg-[#111] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Video size={80} />
                   </div>
                   <div className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-4">Serie Documental</div>
                   <h3 className="text-2xl font-display font-bold text-white mb-2">"Ecos de Vida"</h3>
                   <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      Testimonios reales de cuidadores y musicoterapeutas. Un vistazo crudo y esperanzador a las sesiones de terapia.
                   </p>
                   <button className="flex items-center gap-2 text-sm font-bold text-white hover:text-ear-gold transition-colors">
                      Ver Teaser <Share2 size={14}/>
                   </button>
                </div>

                {/* Legacy Visuals */}
                <div className="bg-[#111] border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-all">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Heart size={80} />
                   </div>
                   <div className="text-xs text-pink-400 font-bold uppercase tracking-widest mb-4">Campaña Visual</div>
                   <h3 className="text-2xl font-display font-bold text-white mb-2">Historias de Legado</h3>
                   <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      Cápsulas de video de 1 minuto para Reels/TikTok celebrando las contribuciones vitales de nuestros mayores a la sociedad.
                   </p>
                   <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-pink-500"></div>
                   </div>
                   <p className="text-[10px] text-gray-500 mt-2 text-right">Lanzamiento: Noviembre</p>
                </div>

             </div>
          </div>
        )}

        {/* 4. ROADMAP (VIMUME TIMELINE) */}
        {activeTab === 'roadmap' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             
             {/* VIMUME TIMELINE HEADER */}
             <div className="mb-20 text-center">
                <div className="inline-flex p-4 bg-white/5 rounded-full border border-white/10 mb-6">
                   <CalendarClock size={32} className="text-ear-gold" />
                </div>
                <h3 className="text-4xl font-display font-bold text-white mb-4">
                   Cronograma de Ejecución: <span className="text-pink-400">VIMUME</span>
                </h3>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                   Planificación estratégica de 3 meses para el lanzamiento del proyecto "Viaje Musical por la Memoria".
                </p>
             </div>

             <div className="relative border-l-2 border-white/10 pl-8 space-y-16 ml-4 md:ml-0">
                
                {/* MONTH 1 */}
                <div className="relative group">
                   <div className="absolute -left-[43px] top-0 p-3 bg-black rounded-full border-2 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">
                      <Code size={20} />
                   </div>
                   <div className="bg-gradient-to-r from-blue-900/10 to-black border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Layout size={100} />
                      </div>
                      <span className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-2 block">Mes 1</span>
                      <h4 className="text-2xl font-bold text-white mb-4">Desarrollo & Contenido</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-blue-500 mt-1 shrink-0"/>
                               <span><strong>Plataforma Web:</strong> Arquitectura, diseño UX/UI y desarrollo funcional.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-blue-500 mt-1 shrink-0"/>
                               <span><strong>Base de Datos:</strong> Estructuración de perfiles para centros y terapeutas.</span>
                            </li>
                         </ul>
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-blue-500 mt-1 shrink-0"/>
                               <span><strong>Contenido Semilla:</strong> Producción de los primeros videos testimoniales y guías.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-blue-500 mt-1 shrink-0"/>
                               <span><strong>Identidad Visual:</strong> Finalización de branding para redes sociales.</span>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>

                {/* MONTH 2 */}
                <div className="relative group">
                   <div className="absolute -left-[43px] top-0 p-3 bg-black rounded-full border-2 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                      <Users size={20} />
                   </div>
                   <div className="bg-gradient-to-r from-purple-900/10 to-black border border-purple-500/30 p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Search size={100} />
                      </div>
                      <span className="text-purple-400 font-bold uppercase tracking-widest text-xs mb-2 block">Mes 2</span>
                      <h4 className="text-2xl font-bold text-white mb-4">Testeo & Feedback</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-purple-500 mt-1 shrink-0"/>
                               <span><strong>Beta Testing:</strong> Prueba piloto con 3 centros seleccionados.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-purple-500 mt-1 shrink-0"/>
                               <span><strong>Feedback Loop:</strong> Recopilación de datos de uso y satisfacción.</span>
                            </li>
                         </ul>
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-purple-500 mt-1 shrink-0"/>
                               <span><strong>Ajustes Técnicos:</strong> Refinamiento de la interfaz basado en usuarios reales.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-purple-500 mt-1 shrink-0"/>
                               <span><strong>Pre-Campaña:</strong> Teasers en redes sociales para generar expectativa.</span>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>

                {/* MONTH 3 */}
                <div className="relative group">
                   <div className="absolute -left-[43px] top-0 p-3 bg-black rounded-full border-2 border-ear-gold text-ear-gold shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform">
                      <Rocket size={20} />
                   </div>
                   <div className="bg-gradient-to-r from-ear-gold/10 to-black border border-ear-gold/30 p-8 rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                         <Flag size={100} />
                      </div>
                      <span className="text-ear-gold font-bold uppercase tracking-widest text-xs mb-2 block">Mes 3</span>
                      <h4 className="text-2xl font-bold text-white mb-4">Lanzamiento Oficial</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-ear-gold mt-1 shrink-0"/>
                               <span><strong>Go Live:</strong> Apertura pública de la plataforma web.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-ear-gold mt-1 shrink-0"/>
                               <span><strong>Campaña Comunicación:</strong> Difusión masiva en redes y prensa.</span>
                            </li>
                         </ul>
                         <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-ear-gold mt-1 shrink-0"/>
                               <span><strong>Captación de Clientes:</strong> Activación de embudos de conversión.</span>
                            </li>
                            <li className="flex items-start gap-3">
                               <CheckCircle size={16} className="text-ear-gold mt-1 shrink-0"/>
                               <span><strong>Evento Inaugural:</strong> Presentación oficial a medios y stakeholders.</span>
                            </li>
                         </ul>
                      </div>
                   </div>
                </div>

             </div>

             {/* NEXT STEPS CTA */}
             <div className="mt-20 bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                   <h4 className="text-xl font-bold text-white mb-2">Validación de Cronograma</h4>
                   <p className="text-gray-400 text-sm">¿Aprobamos esta hoja de ruta para iniciar la producción?</p>
                </div>
                <div className="flex gap-4">
                   <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold text-sm hover:bg-white hover:text-black transition-colors">
                      Ajustar Fechas
                   </button>
                   <button className="px-6 py-3 bg-ear-gold text-black rounded-xl font-bold text-sm hover:bg-white transition-colors shadow-lg">
                      Aprobar & Iniciar
                   </button>
                </div>
             </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default SocialProjects;
