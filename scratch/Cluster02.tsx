// Ruta: src/app/pages/AssetAnalytics.tsx
import React from 'react';
import { TrendingUp, PieChart, Activity, ShieldCheck, ChevronRight } from 'lucide-react';

const AssetAnalytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32 p-6">
      <header className="mb-10">
        <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block">Nivel 6</span>
        <h1 className="text-3xl font-bold tracking-tight">Análisis de Royalties y Activos Digitales</h1>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-white/10 p-5 rounded-2xl">
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">Señal de Ingreso</p>
          <p className="text-xl font-bold text-[#F2CA50]">$12,450.00</p>
          <p className="text-green-500 text-[9px] font-bold mt-1">↑ 8.4% mensual</p>
        </div>
        <div className="bg-[#0A0A0A] border border-white/10 p-5 rounded-2xl">
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-1">ROI Promedio</p>
          <p className="text-xl font-bold text-white">18.2%</p>
          <p className="text-gray-500 text-[9px] font-bold mt-1">Anualizado</p>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-[#D4AF37]/20 p-8 rounded-3xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80}/></div>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">Proyección de Valor del Catálogo</p>
        <p className="text-4xl font-black text-white mb-6">$450,000</p>
        <div className="h-32 w-full bg-white/5 rounded-xl flex items-end justify-between p-4 gap-2">
           {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
             <div key={i} className="flex-1 bg-[#F2CA50]/20 rounded-t-sm relative group cursor-pointer">
                <div className="absolute bottom-0 w-full bg-[#F2CA50] rounded-t-sm transition-all duration-700" style={{ height: `${h}%` }}></div>
             </div>
           ))}
        </div>
        <div className="flex justify-between mt-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
           <span>2024</span><span>2026</span><span>2028</span>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold tracking-tight">Digital Assets</h3>
          <button className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Ver Detalles</button>
        </div>
        <div className="space-y-4">
           {[
             { t: 'Sync Rights', d: '42 Licencias Activas', icon: ShieldCheck },
             { t: 'Streaming Signals', d: 'Spotify & Apple Music', icon: TrendingUp },
           ].map((asset, i) => (
             <button key={i} className="w-full bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                    <asset.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">{asset.t}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">{asset.d}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-700 group-hover:text-[#D4AF37]" size={20} />
             </button>
           ))}
        </div>
      </section>
    </div>
  );
};

export default AssetAnalytics;

// Ruta: src/app/pages/ForensicDiagnostic.tsx
import React from 'react';
import { Activity, ShieldCheck, Layers, FileText } from 'lucide-react';

const ForensicDiagnostic: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 border-b border-white/10 flex justify-between items-center">
        <h1 className="text-xs font-black uppercase tracking-[0.3em] text-[#D4AF37]">Arquitectura de Ventas</h1>
        <button className="p-2 text-gray-600 hover:text-white"><Activity size={20}/></button>
      </header>

      <div className="p-6">
        <h2 className="text-4xl font-['Cinzel'] font-black leading-tight mb-4 text-white">Constructor de Embudos EAR</h2>
        <p className="text-gray-500 text-sm font-light italic mb-12">Diseña tu Ducto de Autoridad conectando los pilares estratégicos.</p>

        <div className="space-y-4 relative">
          <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/20 to-transparent"></div>
          
          {[
            { id: 'SEÑAL', d: 'CONTENIDO DE VALOR', status: 'VALIDADO', done: true },
            { id: 'FILTRO', d: 'CUESTIONARIO ESTRATÉGICO', status: 'BORRADOR', done: false },
            { id: 'VÍNCULO', d: 'REUNIÓN DE DIAGNÓSTICO', status: 'PENDIENTE', done: false },
            { id: 'CIERRE', d: 'OFERTA IRRESISTIBLE', status: 'PENDIENTE', done: false },
          ].map((step, i) => (
            <div key={i} className="flex gap-6 items-center relative">
               <div className={`w-20 h-20 rounded-2xl flex items-center justify-center z-10 border-2 transition-all ${
                 step.done ? 'bg-[#0A0A0A] border-[#D4AF37] text-[#D4AF37]' : 'bg-[#0A0A0A] border-white/10 text-gray-700'
               }`}>
                  <FileText size={28} strokeWidth={1.5} />
               </div>
               
               <div className={`flex-1 p-6 rounded-3xl border transition-all ${
                 step.done ? 'bg-[#D4AF37]/5 border-[#D4AF37]/20' : 'bg-white/[0.02] border-white/5 opacity-40'
               }`}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-white font-bold text-lg">{step.id}</h4>
                    <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded border ${
                      step.done ? 'border-green-500/40 text-green-500 bg-green-500/5' : 'border-gray-700 text-gray-700'
                    }`}>{step.status}</span>
                  </div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{step.d}</p>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck size={100}/></div>
           <p className="text-xs text-gray-400 leading-relaxed italic mb-8">
             "Asegúrate de que cada etapa tenga un disparador claro para mantener el flujo del artista sin fugas de autoridad."
           </p>
           <button className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-[#D4AF37]/10">
              VALIDAR DUCTO DE AUTORIDAD <ShieldCheck size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ForensicDiagnostic;

// Ruta: src/app/pages/LegalShield.tsx
import React from 'react';
import { Shield, Lock, FileText, Download, ArrowLeft } from 'lucide-react';

const LegalShield: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      <header className="p-6 flex justify-between items-center">
        <button className="text-white hover:text-[#D4AF37]"><ArrowLeft size={24} /></button>
        <span className="text-white font-bold tracking-tight">Emanager Studio</span>
        <div className="w-6"></div>
      </header>

      <div className="px-6 py-4 flex flex-col items-center">
        <div className="w-48 h-48 bg-[#D4AF37] rounded-3xl flex items-center justify-center text-black mb-12 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
          <Shield size={80} strokeWidth={1.5} />
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-['Cinzel'] font-black leading-tight uppercase tracking-widest mb-4">
            Nivel 4: Blindaje de Infraestructura
          </h2>
          <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">LEGAL & TEAM SECURITY</p>
        </div>

        <div className="w-full bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl mb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-400 font-medium">Nivel de Blindaje Actual</span>
            <span className="text-[#F2CA50] font-black text-xl">65%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-[#F2CA50] w-[65%] rounded-full"></div>
          </div>
          <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">ESTADO: INFRAESTRUCTURA LEGAL & TEAM EN PROCESO</p>
        </div>

        <section className="w-full space-y-4">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Lock size={12} className="text-[#D4AF37]"/> Trust Architecture Documents
          </h3>
          {[
            'Contrato de Management Soberano',
            'Acuerdo de Split de Royalties',
            'NDA de Proyecto Cinematográfico',
          ].map((doc, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-4">
                <FileText className="text-gray-600 group-hover:text-[#D4AF37]" size={20} />
                <span className="text-sm font-bold text-gray-300 group-hover:text-white">{doc}</span>
              </div>
              <Download size={18} className="text-gray-600 group-hover:text-white" />
            </div>
          ))}
        </section>

        <div className="w-full mt-10 p-8 border-2 border-dashed border-[#D4AF37]/20 rounded-3xl flex flex-col items-center text-center">
           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#D4AF37] mb-4">
             <Lock size={24} />
           </div>
           <h4 className="text-xl font-bold mb-2">Bóveda Legal</h4>
           <p className="text-[10px] text-gray-500 uppercase font-medium leading-relaxed mb-8 max-w-[200px]">
             Sube tus contratos firmados para una <span className="text-[#D4AF37]">Forensic Review</span> por parte de los ingenieros de EAR.
           </p>
           <button className="w-full py-4 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-3">
             <Download className="rotate-180" size={18} /> SUBIR CONTRATOS
           </button>
        </div>
      </div>
    </div>
  );
};

export default LegalShield;

// Ruta: src/app/pages/AuthorityCertificate.tsx
import React from 'react';
import { ArrowLeft, Download, Shield, Award } from 'lucide-react';

const AuthorityCertificate: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] py-16 px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-20"></div>
      
      <header className="flex justify-between items-center mb-12">
        <button className="text-white hover:text-[#D4AF37] transition-colors"><ArrowLeft size={24} /></button>
        <span className="text-[#D4AF37] font-['Cinzel'] font-bold tracking-[0.3em] uppercase text-[10px]">Certificación EAR</span>
        <div className="w-6"></div>
      </header>

      <div className="flex flex-col items-center">
        <div className="relative w-full aspect-square max-w-sm mb-12 group">
           <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-full blur-3xl group-hover:bg-[#D4AF37]/10 transition-all duration-1000"></div>
           <div className="relative z-10 w-full h-full border border-[#D4AF37]/20 rounded-3xl p-8 bg-[#0A0A0A]/50 backdrop-blur-xl flex flex-col items-center justify-center text-center">
              <Award className="text-[#D4AF37] mb-6 animate-pulse" size={64} />
              <h2 className="text-2xl font-['Cinzel'] font-black uppercase tracking-widest mb-2">Blueprint de Autoridad</h2>
              <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Emanager Studio Official Release</p>
              <div className="w-16 h-1 bg-[#D4AF37]/20 rounded-full mb-8"></div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-1">RICARDO ALVARADO</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Operador de Sistemas de Impacto</p>
           </div>
        </div>

        <div className="w-full space-y-4">
           <button className="w-full py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3">
              <Download size={18} /> DESCARGAR PLANOS DE CARRERA (PDF)
           </button>
           <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Shield size={16} className="text-[#D4AF37]" /> COMPARTIR EN BÓVEDA ELITE
           </button>
        </div>

        <footer className="mt-16 text-center">
           <p className="text-gray-600 text-[10px] uppercase font-bold tracking-widest mb-2">Hash de Autoridad:</p>
           <p className="text-[#D4AF37] font-mono text-[10px] opacity-40 break-all px-8 uppercase">8f3a2b1c9d4e7f6g5h4i3j2k1l0m</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthorityCertificate;

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