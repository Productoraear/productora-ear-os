import React from 'react';
import { Briefcase, TrendingUp, Target, FileText, CheckCircle, Calendar, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const BusinessServices: React.FC = () => {
  return (
    <div className="pt-20 bg-black min-h-screen font-body">
      {/* Hero */}
      <div className="relative py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auhref=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Briefcase size={12} /> División Empresarial
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase">Acompañamiento <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Estratégico & Táctico</span></h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            No solo diseñamos la estrategia; bajamos al barro contigo para implementarla. Resultados que superan expectativas con <strong className="text-white">ROI garantizado por escrito</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Plan Básico */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-10 flex flex-col hover:border-blue-500/50 transition-all group">
            <div className="mb-8">
                <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Plan Ejecución</span>
                <h3 className="text-3xl font-display font-bold text-white mt-2">EMPRESARIOS</h3>
                <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">€1000</span>
                    <span className="text-gray-500 uppercase text-xs font-bold">/ Mensual</span>
                </div>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-start gap-3 text-gray-400"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Implementación de tácticas de marketing.</li>
                <li className="flex items-start gap-3 text-gray-400"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Acompañamiento estratégico semanal.</li>
                <li className="flex items-start gap-3 text-gray-400"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Auditoría continua de procesos.</li>
                <li className="flex items-start gap-3 text-gray-400"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Garantía de resultados por escrito.</li>
            </ul>
            <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2">
                <Calendar size={18} /> Agenda cita de 30 min <span className="opacity-50">(Gratis)</span>
            </button>
          </div>

          {/* Plan Premium */}
          <div className="bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/40 rounded-3xl p-10 flex flex-col shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Zap size={120} /></div>
            <div className="mb-8 relative z-10">
                <span className="text-ear-gold font-bold uppercase tracking-widest text-xs">Escalado Máximo</span>
                <h3 className="text-3xl font-display font-bold text-white mt-2">PREMIUM BUSINESS</h3>
                <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-gray-400 text-sm">Desde</span>
                    <span className="text-5xl font-black text-white">€3000</span>
                    <span className="text-gray-500 uppercase text-xs font-bold">/ Mensual</span>
                </div>
            </div>
            <ul className="space-y-4 mb-12 flex-1 relative z-10">
                <li className="flex items-start gap-3 text-gray-300 font-bold"><ShieldCheck className="text-ear-gold mt-1 shrink-0" size={18}/> Todo lo del plan Empresarios.</li>
                <li className="flex items-start gap-3 text-gray-300"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Gestión de activos digitales full-service.</li>
                <li className="flex items-start gap-3 text-gray-300"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Estructura de ingeniería emocional para ventas.</li>
                <li className="flex items-start gap-3 text-gray-300"><CheckCircle className="text-blue-400 mt-1 shrink-0" size={18}/> Reportes forenses mensuales de ROI.</li>
            </ul>
            <button className="w-full py-5 bg-blue-500 text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 relative z-10 shadow-lg shadow-blue-500/20">
                <Target size={18} /> Auditoría Estratégica 30 min
            </button>
          </div>

        </div>

        {/* Closing Promise */}
        <div className="mt-20 bg-white/5 border border-white/10 p-12 rounded-3xl text-center max-w-4xl mx-auto">
            <h4 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-widest">Nuestra Promesa</h4>
            <p className="text-gray-400 text-lg italic leading-relaxed">
                "A través de nuestra metodología te acercamos a un nivel de conciencia superior desde la neutralidad profesional. No queremos solo tu presupuesto, queremos tu transformación empresarial."
            </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessServices;
