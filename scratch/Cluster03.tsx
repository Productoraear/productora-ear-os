// Ruta: src/app/pages/EmanagerCurriculum.tsx
import React from 'react';
import { ArrowLeft, CheckCircle2, Lock, Play, MoreHorizontal } from 'lucide-react';

const EmanagerCurriculum: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
        <button className="text-white hover:text-[#D4AF37] transition-colors"><ArrowLeft size={24} /></button>
        <span className="text-[#D4AF37] font-['Cinzel'] font-bold tracking-[0.3em] uppercase text-[10px]">Emanager Studio</span>
        <button className="text-gray-500"><MoreHorizontal size={24} /></button>
      </header>

      <div className="p-6">
        <div className="mb-10">
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Currículum</span>
          <h1 className="text-4xl font-['Cinzel'] font-black text-white mb-2">Nivel 1: <br/><span className="text-[#D4AF37]">Cimientos de Soberanía</span></h1>
          <div className="flex justify-between items-end mt-8 mb-3">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Progreso del Módulo</span>
             <span className="text-[#F2CA50] font-black text-lg">65%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
             <div className="h-full bg-[#F2CA50] w-[65%] rounded-full shadow-[0_0_10px_rgba(242,202,80,0.5)]"></div>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">SESIONES DE MENTALIDAD</h3>
          
          {[
            { id: '1.6', t: 'Mentalidad de Tiburón', d: 'Estructura mental para la toma de decisiones.', time: '12 min', status: 'COMPLETADO', done: true },
            { id: '1.7', t: 'Archivos de Riqueza', d: 'Los 17 archivos del libro mental de éxito.', time: '18 min', status: 'DESBLOQUEADO', active: true },
            { id: '1.8', t: 'El Protocolo de Confianza', d: 'Construcción de autoridad y cierre.', time: '25 min', status: 'PENDIENTE DE AUDITORÍA' },
            { id: '1.9', t: 'Estructura de Entrevista', d: 'Diseño de la señal en comunicación personal.', time: '-- min', status: 'BLOQUEADO', locked: true },
          ].map((lesson, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-all ${
              lesson.done ? 'bg-[#0A0A0A] border-[#D4AF37]/20' : 
              lesson.active ? 'bg-gradient-to-br from-[#D4AF37]/10 to-black border-[#D4AF37]/40 shadow-lg' :
              'bg-[#0A0A0A] border-white/5 opacity-40'
            }`}>
              <div className="flex justify-between items-start mb-4">
                 <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest border ${
                   lesson.done ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                   lesson.active ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30' :
                   'bg-gray-800 text-gray-500 border-gray-700'
                 }`}>
                   {lesson.status}
                 </span>
                 <span className="text-[10px] text-gray-600 font-bold uppercase">{lesson.time}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                 <div>
                    <h4 className="text-white font-bold text-lg leading-tight mb-1">{lesson.id} {lesson.t}</h4>
                    <p className="text-gray-500 text-[10px] leading-relaxed max-w-[220px]">{lesson.d}</p>
                 </div>
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                   lesson.done ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                   lesson.active ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' :
                   'bg-white/5 text-gray-700'
                 }`}>
                    {lesson.done ? <CheckCircle2 size={20} /> : lesson.locked ? <Lock size={18} /> : <Play size={20} fill="currentColor" />}
                 </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default EmanagerCurriculum;

// Ruta: src/app/pages/LessonView.tsx
import React from 'react';
import { ArrowLeft, Play, Download, ChevronRight, HelpCircle } from 'lucide-react';

const LessonView: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <button className="text-white"><ArrowLeft size={24} /></button>
        <h2 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Módulo 1.7: Riqueza</h2>
        <div className="w-6"></div>
      </header>

      <div className="p-6">
        <div className="aspect-video w-full bg-white/5 rounded-3xl border border-white/10 mb-8 relative overflow-hidden flex items-center justify-center group cursor-pointer">
           <div className="absolute inset-0 bg-[url('https://picsum.photos/id/158/800/600')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"></div>
           <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] relative z-10 transition-transform active:scale-95">
              <Play size={32} fill="currentColor" />
           </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-8 rounded-3xl mb-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/5 rounded-xl text-[#D4AF37]">
                 <HelpCircle size={24} />
              </div>
              <h3 className="text-xl font-bold font-['Cinzel'] uppercase tracking-widest">Teoría Forense</h3>
           </div>
           <p className="text-gray-400 text-lg leading-relaxed mb-8">
             No estamos ante un curso de finanzas; estamos ante la **Ingeniería del Patrimonio**. El artista que no entiende su flujo de caja es un empleado de su propio ego.
           </p>
           <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3 hover:bg-white/10 transition-colors">
              <Download size={18} /> DESCARGAR GUION TÉCNICO
           </button>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Prueba de Trabajo</h4>
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <p className="text-sm font-medium mb-4 italic">"Define tus 3 áreas de fricción financiera..."</p>
              <textarea className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-[#D4AF37] h-32 resize-none" placeholder="Escribe tu análisis aquí..."></textarea>
              <button className="w-full mt-6 py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg">GUARDAR PROGRESO</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LessonView;

// Ruta: src/app/pages/SeniorMentoring.tsx
import React from 'react';
import { Shield, Clock, FileText, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

const SeniorMentoring: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-sm font-bold uppercase tracking-widest">PROTOCOLO DE MENTORÍA</h1>
        <Shield className="text-[#D4AF37]" size={20} />
      </header>

      <div className="p-6">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-2">Emanager Studio by EAR</p>
          <h2 className="text-3xl font-['Cinzel'] font-black uppercase tracking-widest">TRASPASO DE <br/> AUTORIDAD</h2>
        </div>

        <div className="space-y-4 mb-12">
          {[
            { id: '01', t: 'Generación de Confianza', d: 'Unión de corazón y alineación inicial.' },
            { id: '02', t: 'Situación Actual', d: 'Diagnóstico del momento real del proyecto.' },
            { id: '03', t: 'Feedback Forense', d: 'Retroalimentación técnica sin ruido.' },
            { id: '04', t: 'Visualización de Impacto', d: 'Proyección de metas y expansión.' },
          ].map((step, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-start gap-6 hover:border-[#D4AF37]/30 transition-colors group">
               <span className="text-2xl font-['Cinzel'] font-black text-[#D4AF37] opacity-40 group-hover:opacity-100">{step.id}</span>
               <div>
                  <h4 className="font-bold text-lg leading-tight mb-1">{step.t}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.d}</p>
               </div>
               <ChevronRight className="ml-auto text-gray-700" size={18} />
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-ear-purple/20 to-black border border-[#D4AF37]/20 p-8 rounded-3xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <MessageSquare className="text-[#D4AF37]" size={24} />
                 <h3 className="text-xl font-bold">Punto de Partida</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">Define los hitos clave para el traspaso de autoridad con tu mentor asignado.</p>
              <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-xl flex items-center justify-center gap-2">
                 INICIAR SESIÓN DE MENTORÍA <CheckCircle2 size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SeniorMentoring;

// Ruta: src/app/pages/LiveCommandCenter.tsx
import React from 'react';
import { MapPin, Activity, Zap, ShieldCheck, Phone, ChevronRight } from 'lucide-react';

const LiveCommandCenter: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight">Live Tour Control</h1>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Sincronizado</span>
        </div>
      </header>

      <div className="p-6">
        <div className="w-full aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 mb-8 overflow-hidden relative grayscale opacity-60">
           {/* Mock Map */}
           <div className="absolute top-6 left-6 bg-[#0A0A0A] border border-white/10 p-3 rounded-xl text-[10px] font-mono">
              <p className="text-gray-500">UBICACIÓN ACTUAL:</p>
              <p className="text-white font-bold">MADRID, ESPAÑA</p>
           </div>
        </div>

        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-8">Estado de la Misión</h3>
        
        <div className="space-y-10 relative mb-12">
           <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#D4AF37]/20"></div>
           
           {[
             { h: 'Logística', s: 'Carga y transporte completado', done: true, icon: Activity },
             { h: 'Montaje Arsenal', s: 'Proceso al 75%', active: true, icon: Zap },
             { h: 'Soundcheck', s: 'Programado: 18:00 Local', pending: true, icon: Activity },
           ].map((step, i) => (
             <div key={i} className="flex gap-6 relative">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all ${
                  step.done ? 'bg-green-500 text-black' : 
                  step.active ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' :
                  'bg-white/5 text-gray-700'
                }`}>
                   <step.icon size={20} />
                </div>
                <div>
                   <h4 className={`font-bold ${step.active ? 'text-[#D4AF37]' : 'text-white'}`}>{step.h}</h4>
                   <p className="text-xs text-gray-500 mt-1">{step.s}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <span className="text-[9px] text-gray-500 uppercase font-black">Audiencia Est.</span>
              <div className="text-2xl font-bold mt-1">1.2k</div>
           </div>
           <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
              <span className="text-[9px] text-gray-500 uppercase font-black">Pico Emocional</span>
              <div className="text-2xl font-bold mt-1 text-green-400">94%</div>
           </div>
        </div>

        <button className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-xs rounded-xl flex items-center justify-center gap-3">
           <Phone size={18} fill="currentColor" /> LLAMADA DE AUTORIDAD (EMERGENCIA)
        </button>
      </div>
    </div>
  );
};

export default LiveCommandCenter;

// Ruta: src/app/pages/AssetsVault.tsx
import React from 'react';
import { Search, Folder, ShieldCheck, Download, MoreVertical, Plus } from 'lucide-react';

const AssetsVault: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-lg font-bold tracking-tight">Bóveda de Activos</h1>
        <button className="p-2 text-gray-500"><Search size={24} /></button>
      </header>

      <div className="p-6">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
                 <ShieldCheck size={20} />
              </div>
              <div>
                 <p className="text-xs font-bold">Arquitectura Blindada</p>
                 <p className="text-[10px] text-gray-500 uppercase">12 archivos críticos validados</p>
              </div>
           </div>
           <button className="p-2 text-[#D4AF37] bg-[#D4AF37]/10 rounded-lg"><Plus size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { n: 'Audio Masters', c: '48 kHz / 24 bit', icon: Folder, color: 'text-[#D4AF37]' },
            { n: 'Editorial Photo', c: 'RAW / CMYK', icon: Folder, color: 'text-blue-400' },
            { n: 'Stage Design', c: '3D Assets / CAD', icon: Folder, color: 'text-purple-400' },
            { n: 'Video Assets', c: 'ProRes 422', icon: Folder, color: 'text-red-400' },
          ].map((folder, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl group hover:border-[#D4AF37]/30 transition-all cursor-pointer">
               <folder.icon className={`${folder.color} mb-6`} size={32} />
               <h4 className="font-bold text-sm mb-1">{folder.n}</h4>
               <p className="text-[9px] text-gray-500 uppercase font-medium">{folder.c}</p>
               <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Validado</span>
                  <Download size={14} className="text-gray-500" />
               </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center text-center">
           <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-4">
              <Download className="rotate-180" size={24} />
           </div>
           <h3 className="font-bold mb-2">Subir Nuevo Activo</h3>
           <p className="text-xs text-gray-500 leading-relaxed uppercase font-medium max-w-[200px]">Carga de alta fidelidad con verificación de metadatos.</p>
           <button className="mt-8 px-8 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[10px] rounded-xl">SELECCIONAR ARCHIVOS</button>
        </div>
      </div>
    </div>
  );
};

export default AssetsVault;
