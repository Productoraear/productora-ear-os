// Ruta: src/app/components/EarBottomNav.tsx
import React from 'react';
import { LayoutGrid, Layers, Network, Trophy, Settings } from 'lucide-react';

const EarBottomNav: React.FC = () => {
  const items = [
    { id: 'portal', label: 'PORTAL', icon: LayoutGrid, isActive: true },
    { id: 'modulos', label: 'MÓDULOS', icon: Layers },
    { id: 'red', label: 'RED', icon: Network },
    { id: 'premios', label: 'PREMIOS', icon: Trophy },
    { id: 'ajustes', label: 'AJUSTES', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10 px-4 py-3 flex justify-between items-center z-50 rounded-t-3xl">
      {items.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            item.isActive ? 'text-[#F2CA50] scale-110' : 'text-[#C6C6C6] opacity-40 hover:opacity-100'
          }`}
        >
          <item.icon size={22} strokeWidth={item.isActive ? 2.5 : 2} />
          <span className="text-[8px] font-bold tracking-widest uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default EarBottomNav;

// Ruta: src/app/pages/PortalDashboard.tsx
import React from 'react';
import { CheckCircle2, Lock, Settings as SettingsIcon } from 'lucide-react';

const PortalDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 flex justify-between items-start">
        <div>
          <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em]">Soberanía Digital</span>
          <h1 className="text-2xl font-bold mt-1 tracking-tight">Portal Dashboard</h1>
        </div>
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 overflow-hidden shadow-lg">
          <img src="https://picsum.photos/id/64/200/200" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="px-6 space-y-6">
        <div className="bg-[#0A0A0A] border border-[#D4AF37]/10 p-6 rounded-3xl flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#D4AF37]">
              <SettingsIcon size={20} strokeWidth={1.5} />
            </div>
            <div>
               <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Rango Actual</p>
               <h2 className="text-[#F2CA50] font-black text-lg uppercase tracking-tight">Arquitecto</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Progreso XP</p>
            <p className="text-sm font-bold text-white"><span className="text-[#F2CA50]">850</span> / 1200</p>
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 text-[#F2CA50]">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Estado del Sistema</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
            Tu arquitectura de carrera es <span className="text-[#F2CA50]">estable al 65%</span>.
          </p>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#F2CA50] w-[65%] rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"></div>
          </div>
        </div>

        <div className="pt-6">
           <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Impact Timeline</h3>
           
           <div className="space-y-10 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[#D4AF37]/20"></div>
              
              {[
                { m: 'MÓDULO 01', t: 'Ikigai Musical', d: 'Propósito y razón de ser en la industria.', done: true },
                { m: 'MÓDULO 02', t: 'Pitch & Presentation', d: 'Venta de proyecto y comunicación efectiva.', done: true },
                { m: 'MÓDULO 03', t: 'Metrics & Analysis', d: 'Soberanía de datos y audiencias.', done: true },
                { m: 'BLOQUEADO', t: 'Aspectos Legales', d: 'Contratos, derechos y propiedad intelectual.', done: false },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative group">
                   <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center z-10 transition-all ${
                     item.done ? 'bg-[#050505] border-[#F2CA50] text-[#F2CA50] shadow-[0_0_15px_rgba(242,202,80,0.3)]' : 'bg-[#050505] border-white/10 text-gray-700'
                   }`}>
                      {item.done ? <CheckCircle2 size={16} /> : <Lock size={14} />}
                   </div>
                   
                   <div className={`flex-1 p-6 rounded-2xl border transition-all ${
                     item.done ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20' : 'bg-white/5 border-white/5 opacity-40'
                   }`}>
                      <span className={`text-[8px] font-black tracking-widest uppercase block mb-1 ${item.done ? 'text-[#D4AF37]' : 'text-gray-500'}`}>{item.m}</span>
                      <h4 className="text-white font-bold text-base mb-1">{item.t}</h4>
                      <p className="text-gray-500 text-[10px] leading-relaxed">{item.d}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;

// Ruta: src/app/pages/ForensicDiagnostic.tsx
import React from 'react';
import { Activity, FileText, ChevronRight } from 'lucide-react';

const ForensicDiagnostic: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">Módulo Forense</h1>
        <button className="p-2 text-gray-600 hover:text-white"><Activity size={20}/></button>
      </header>

      <div className="p-6">
        <h2 className="text-4xl font-['Cinzel'] font-black leading-tight mb-4">Radiografía de Fricción</h2>
        
        <div className="flex gap-4 text-[8px] font-black uppercase tracking-widest mb-12 opacity-50">
           <span>Inicio</span>
           <span className="text-[#F2CA50]">Diagnóstico en curso</span>
           <span>Resultado</span>
        </div>

        <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 p-8 rounded-3xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F2CA50]"></div>
           <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-[#F2CA50]/10 rounded-lg text-[#F2CA50]"><FileText size={18} /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mapa de Empatía</span>
           </div>

           <blockquote className="text-2xl font-['Montserrat'] font-light italic leading-relaxed mb-12">
              "¿Cuál es el dolor principal que tu audiencia expresa cuando no consume tu contenido?"
           </blockquote>

           <div className="space-y-4">
              {['Falta de conexión emocional', 'Inconsistencia en el mensaje', 'Calidad técnica deficiente'].map((opt) => (
                <button key={opt} className="w-full p-6 bg-black/40 border border-white/10 rounded-2xl text-left text-sm font-medium hover:border-[#F2CA50] transition-colors group-hover:bg-white/5">
                   {opt}
                </button>
              ))}
           </div>
        </div>

        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-start">
           <div className="p-2 bg-ear-gold/20 rounded-full text-ear-gold"><Activity size={16}/></div>
           <p className="text-[10px] text-gray-500 uppercase font-medium leading-relaxed italic">
              Este diagnóstico analiza las fricciones invisibles entre tu propuesta de valor y la recepción del mercado.
           </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4">
           <button className="py-5 border border-white/10 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-white/5 transition-colors">Anterior</button>
           <button className="py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-full flex items-center justify-center gap-2 shadow-xl shadow-[#D4AF37]/10">
              Siguiente <ChevronRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ForensicDiagnostic;

// Ruta: src/app/pages/AidaSynchronicity.tsx
import React from 'react';
import { Target, Save, ArrowLeft } from 'lucide-react';

const AidaSynchronicity: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">Marketing Psicología</h1>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-600"><Target size={18}/></div>
      </header>

      <div className="p-6">
        <h2 className="text-4xl font-['Cinzel'] font-black leading-tight mb-2">Sincronicidad AIDA</h2>
        <p className="text-gray-500 text-sm italic font-light mb-12">Alinea tu guion editorial con el embudo de conversión.</p>

        {/* Visual Funnel Element */}
        <div className="flex flex-col items-center mb-16 relative">
           <div className="w-64 h-64 relative flex flex-col items-center">
              <div className="w-full h-12 bg-blue-900/40 border border-blue-500/30 clip-path-funnel-1 flex items-center justify-center"><span className="text-[10px] font-black uppercase tracking-widest">Attention</span></div>
              <div className="w-4/5 h-12 bg-blue-700/40 border border-blue-500/30 clip-path-funnel-2 flex items-center justify-center mt-1"><span className="text-[10px] font-black uppercase tracking-widest">Interest</span></div>
              <div className="w-3/5 h-12 bg-[#F2CA50]/40 border border-[#F2CA50]/30 clip-path-funnel-3 flex items-center justify-center mt-1"><span className="text-[10px] font-black uppercase tracking-widest text-[#F2CA50]">Desire</span></div>
              <div className="w-2/5 h-12 bg-red-900/40 border border-red-500/30 clip-path-funnel-4 flex items-center justify-center mt-1"><span className="text-[10px] font-black uppercase tracking-widest">Action</span></div>
           </div>
           <div className="mt-8 p-4 bg-[#F2CA50]/10 rounded-full border border-[#D4AF37]/30 text-[#F2CA50]"><span className="font-bold">€</span></div>
        </div>

        <div className="space-y-12">
          {['Atención', 'Interés', 'Deseo', 'Acción'].map((phase, i) => (
            <div key={phase} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Fase 0{i+1}</span>
                 <h3 className="text-2xl font-['Newsreader'] italic font-bold">Guion Editorial: {phase}</h3>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed italic mb-4">"Describe aquí tu gancho disruptivo para captar al fan ideal..."</p>
              <textarea 
                className="w-full bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl text-white text-sm outline-none focus:border-[#D4AF37] h-32 resize-none placeholder:text-gray-800"
                placeholder={`Tu hook (${phase.toLowerCase()})...`}
              />
            </div>
          ))}
        </div>

        <button className="w-full mt-16 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-3 shadow-xl">
           GUARDAR SINCRONICIDAD <CheckCircle2 size={18} />
        </button>
        <button className="w-full mt-4 py-4 text-gray-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
           Regresar al módulo
        </button>
      </div>
    </div>
  );
};

export default AidaSynchronicity;

// Ruta: src/app/pages/InvestmentCalculator.tsx
import React from 'react';
import { Calculator, MapPin, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

const InvestmentCalculator: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-['Montserrat'] pb-32">
      <header className="p-6 flex justify-between items-center border-b border-white/5">
        <button className="text-white hover:text-[#D4AF37]"><ArrowLeft size={24} /></button>
        <h1 className="text-sm font-bold uppercase tracking-widest">Calculadora EAR 360</h1>
        <div className="w-8 h-8 rounded-full bg-[#F2CA50]/10 flex items-center justify-center text-[#F2CA50]"><Calculator size={18}/></div>
      </header>

      <div className="p-6 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-8">
             <div className="p-2 bg-[#F2CA50]/10 rounded-lg text-[#F2CA50]"><Zap size={20}/></div>
             <h2 className="text-xl font-display font-bold uppercase tracking-tight">Arsenal Técnico</h2>
          </div>
          <div className="space-y-4">
            {[
              { t: 'Sistema Line Array', s: 'Audio Premium L-Acoustics', q: 4, active: true },
              { t: 'Subwoofers 18"', s: 'Refuerzo de baja frecuencia', q: 0, active: false },
              { t: 'Mesa de Mezcla Digital', s: 'Yamaha CL5 / Rivage', q: 1, active: true },
            ].map((item) => (
              <div key={item.t} className={`p-6 rounded-3xl border transition-all ${item.active ? 'bg-white/5 border-[#F2CA50]/30' : 'bg-black border-white/5 opacity-40'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.t}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-medium mt-1">{item.s}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">-</button>
                    <span className="font-mono font-bold">{item.q}</span>
                    <button className="w-8 h-8 rounded-lg bg-[#F2CA50] flex items-center justify-center text-black font-bold">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5"><MapPin size={80}/></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            <MapPin size={14}/> Logística y Destino
          </h3>
          <input 
            type="text" 
            className="w-full bg-black border border-white/20 p-4 rounded-xl text-white font-bold outline-none focus:border-[#D4AF37]"
            defaultValue="Valencia, ES"
          />
          <div className="mt-4 p-4 bg-[#F2CA50]/5 border border-[#F2CA50]/20 rounded-xl flex items-start gap-3">
             <ShieldCheck size={18} className="text-[#F2CA50] shrink-0" />
             <p className="text-[9px] text-gray-400 uppercase font-bold leading-relaxed">
                Plus de distancia detectado. Se han incluido dietas y hospedaje técnico automático.
             </p>
          </div>
        </section>

        <div className="pt-8 border-t border-white/10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2">Inversión Estimada</p>
              <p className="text-5xl font-black text-white">4.280 <span className="text-[#F2CA50] text-2xl font-light">€</span></p>
            </div>
            <div className="text-right space-y-1 text-[9px] font-mono text-gray-500 uppercase font-bold">
               <p>Alquiler: 2.150€</p>
               <p>Staff: 1.200€</p>
               <p>IVA (21%): 930€</p>
            </div>
          </div>
          <button className="w-full py-5 bg-[#F2CA50] text-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 shadow-2xl shadow-[#F2CA50]/20">
             VALIDAR VIABILIDAD TÉCNICA <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;
