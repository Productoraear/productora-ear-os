import React, { useState } from 'react';
import { Lock, PlayCircle, FileText, TrendingUp, Shield, Layout, BookOpen, Download, LogOut, DollarSign, Music, Users, Copy, Share2, Gift, Activity, Zap, Cpu, Server, Globe } from 'lucide-react';
import { ACADEMY_LESSONS, ACADEMY_TOOLS } from '../../data/academy';

const ArtistPortal: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'academy' | 'tools' | 'infrastructure'>('dashboard');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ear-purple/30 via-black to-black"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ear-gold to-transparent opacity-50"></div>

        <div className="relative z-10 w-full max-w-md p-8 animate-fade-in-up">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(212,175,55,0.1)] group">
              <Lock className="text-ear-gold group-hover:scale-110 transition-transform" size={36} />
            </div>
            <h1 className="text-4xl font-display font-black text-white mb-2 uppercase tracking-tight">CENTRO DE <span className="text-ear-gold">MANDO</span></h1>
            <p className="text-gray-500 font-body text-[10px] font-black uppercase tracking-[0.3em]">Acceso Restringido: Protocolo EAR</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-6">
            <div className="space-y-2">
              <input type="email" placeholder="ID de Artista / Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-ear-gold outline-none transition-all text-center placeholder-gray-700 font-bold" />
            </div>
            <div className="space-y-2">
              <input type="password" placeholder="Clave Biométrica" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white focus:border-ear-gold outline-none transition-all text-center placeholder-gray-700 font-bold" />
            </div>
            <button className="w-full py-5 bg-ear-gold text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_40px_rgba(212,175,55,0.2)] rounded-2xl transform active:scale-95">
              Iniciar Despliegue
            </button>
          </form>
          <div className="mt-8 text-center">
            <button className="text-xs text-gray-600 hover:text-ear-gold transition-colors font-bold uppercase tracking-widest underline decoration-ear-gold/20 underline-offset-4">Solicitar Acreditación</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex pt-20 font-body">
      {/* SIDEBAR TÁCTICO */}
      <aside className="w-20 lg:w-72 border-r border-white/5 flex flex-col fixed h-full bg-black/50 backdrop-blur-3xl z-40">
        <div className="p-6 border-b border-white/5 hidden lg:block">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ear-gold/20 border border-ear-gold/30 flex items-center justify-center">
                <Activity size={20} className="text-ear-gold animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Status del Ecosistema</p>
                <p className="text-sm font-bold text-green-500 uppercase mt-1">ONLINE / ACTIVE</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 py-8 space-y-2 px-3">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Layout },
            { id: 'infrastructure', label: 'Infraestructura', icon: Cpu },
            { id: 'academy', label: 'Librería Estratégica', icon: BookOpen },
            { id: 'tools', label: 'Arsenal Digital', icon: Zap },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-ear-gold text-black shadow-xl shadow-ear-gold/10 font-black' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              <span className="hidden lg:block text-xs uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-1.5 h-1.5 bg-black rounded-full hidden lg:block"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
           <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
              <LogOut size={20} />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Cerrar Sesión</span>
           </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-20 lg:ml-72 p-6 lg:p-12 overflow-y-auto">
        
        <header className="flex justify-between items-end mb-12 border-b border-white/5 pb-8">
           <div>
              <h2 className="text-xs font-black uppercase text-ear-gold tracking-[0.4em] mb-2">Bienvenido, Comandante</h2>
              <h1 className="text-4xl font-display font-black uppercase tracking-tighter">Edwin Agudelo</h1>
           </div>
           <div className="hidden md:flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Autoridad Nivel</p>
                <p className="text-xl font-display font-bold text-white uppercase">Master Strategist</p>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-ear-gold shadow-lg shadow-ear-gold/20">
                <img src="https://picsum.photos/id/453/100/100" className="w-full h-full object-cover" />
              </div>
           </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Widget */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { l: 'ROI Proyectado', v: '245%', i: TrendingUp, c: 'text-green-500' },
                 { l: 'Proyectos Activos', v: '12', i: Server, c: 'text-blue-500' },
                 { l: 'Autoridad Global', v: 'Master', i: Globe, c: 'text-ear-gold' },
                 { l: 'Nivel Patrimonio', v: 'A+', i: Shield, c: 'text-purple-500' }
               ].map((s, idx) => (
                 <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors">
                    <s.i size={20} className={`${s.c} mb-4`} />
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">{s.l}</p>
                    <p className="text-2xl font-display font-bold text-white">{s.v}</p>
                 </div>
               ))}
            </div>

            {/* Notification Center */}
            <div className="bg-ear-purple/20 border border-ear-gold/20 p-8 rounded-[2.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10"><Zap size={100} className="text-ear-gold"/></div>
               <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6">Alertas Estratégicas</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-black/40 border-l-2 border-ear-gold rounded-r-xl">
                     <p className="text-xs text-white font-bold">Oportunidad de Branding Detectada</p>
                     <p className="text-[10px] text-gray-500 mt-1">Nuevas métricas sugieren expansión en Sector 3.</p>
                  </div>
                  <div className="p-4 bg-black/40 border-l-2 border-blue-500 rounded-r-xl">
                     <p className="text-xs text-white font-bold">Actualización de Infraestructura</p>
                     <p className="text-[10px] text-gray-500 mt-1">Nodos de IFEMA optimizados para 10G.</p>
                  </div>
               </div>
            </div>

            {/* Main Progress Area */}
            <div className="lg:col-span-3 bg-white/5 border border-white/5 p-10 rounded-[3rem]">
               <h3 className="text-xl font-display font-black uppercase mb-8 flex items-center gap-3">
                  <Activity className="text-ear-gold" /> Proyección de Legado 2025
               </h3>
               <div className="h-64 flex items-end gap-2 md:gap-4 px-4">
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                       <div 
                         className="w-full bg-gradient-to-t from-ear-purple to-ear-gold rounded-t-xl transition-all duration-1000 group-hover:brightness-125" 
                         style={{ height: `${h}%` }}
                       ></div>
                       <span className="text-[9px] font-black uppercase text-gray-600 tracking-tighter">Mes {i+1}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
            {ACADEMY_LESSONS.map((lesson, i) => (
              <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] hover:bg-white/[0.08] transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-ear-gold/20 text-ear-gold border border-ear-gold/30">{lesson.status}</span>
                  <div className="p-2 bg-black rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} className="text-ear-gold" />
                  </div>
                </div>
                <h4 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-tight leading-tight">{lesson.title}</h4>
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-black uppercase text-gray-500 tracking-widest">
                      <span>Nivel de Absorción</span>
                      <span>{lesson.progress}%</span>
                   </div>
                   <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
                     <div className="h-full bg-gradient-to-r from-ear-purple to-ear-gold shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-all duration-1000" style={{ width: `${lesson.progress}%` }}></div>
                   </div>
                </div>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-ear-gold transition-colors">
                   Acceder al Módulo <TrendingUp size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMY_TOOLS.map((tool, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-[#0a0a0a] border border-white/5 rounded-3xl hover:border-ear-gold/50 transition-all group shadow-xl">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-ear-gold group-hover:text-black transition-all">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{tool.name}</p>
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">{tool.cat}</p>
                  </div>
                </div>
                <button className="p-3 text-gray-600 hover:text-ear-gold transition-colors">
                  <Download size={22} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="animate-fade-in">
             <div className="bg-[#111] border border-white/5 p-12 rounded-[3rem] text-center max-w-4xl mx-auto">
                <Cpu size={48} className="text-ear-gold mx-auto mb-8 animate-spin-slow" />
                <h3 className="text-3xl font-display font-black text-white mb-4 uppercase">Mapeo de Infraestructura</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-12 italic">
                   "Visualiza los nodos críticos de tu arsenal técnico en tiempo real. La arquitectura al servicio de la precisión."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                   <div className="p-6 bg-black border border-white/5 rounded-2xl">
                      <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest border-b border-white/5 pb-2">Nodo IFEMA A1</h4>
                      <p className="text-[10px] text-green-500 font-bold uppercase mt-2">Status: Fully Functional</p>
                      <p className="text-[10px] text-gray-600 uppercase mt-1">Last Audit: 12h ago</p>
                   </div>
                   <div className="p-6 bg-black border border-white/5 rounded-2xl">
                      <h4 className="text-white font-bold mb-2 uppercase text-xs tracking-widest border-b border-white/5 pb-2">Reserva Arsenal LED</h4>
                      <p className="text-[10px] text-yellow-500 font-bold uppercase mt-2">Status: Reserved (Event Code #44)</p>
                      <p className="text-[10px] text-gray-600 uppercase mt-1">Montaje: 24.10.2023</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtistPortal;
