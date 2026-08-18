'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Fingerprint, Activity, Globe, Boxes, Truck, Wallet, BrainCircuit, 
  BarChart3, Crown, DollarSign, Award, Bot, CheckCircle2, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function NexusWarRoom() {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'SPLIT_CALC' | 'COUNCIL'>('TELEMETRY');
  const [cachePrice, setCachePrice] = useState<number>(2500);
  const [hasHomologatedRider, setHasHomologatedRider] = useState<boolean>(true);
  
  // Fake real-time hydration state to avoid hydration errors
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const calculateSplit = (total: number) => {
    return {
      artistAmount: total * 0.80,
      platformAmount: total * 0.10,
      socialAmount: total * 0.10
    };
  };

  const split = calculateSplit(cachePrice);

  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ecb613]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      {/* HEADER TÁCTICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#ecb613] to-[#ffd471] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(236,182,19,0.3)] hover:rotate-3 transition-all duration-300">
            <Fingerprint className="text-black w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none italic text-white">
              NEXUS <span className="text-[#ecb613]">WAR ROOM</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-[9px] font-black text-[#ecb613] uppercase tracking-widest bg-[#ecb613]/10 px-2.5 py-1 rounded border border-[#ecb613]/20">
                <Activity size={10} className="animate-pulse" /> Sistema Operativo S-Class
              </span>
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">
                Sovereign Control
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3 flex flex-col items-end">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Live GMV Proyectado</span>
            <span className="text-xl font-black text-[#ecb613] flex items-center gap-2">
              €1.245.890
            </span>
          </div>
          <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3 flex flex-col items-end">
            <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">Cotizaciones Activas</span>
            <span className="text-xl font-black text-white flex items-center gap-2">
              <Boxes size={16} /> 142
            </span>
          </div>
        </div>
      </header>

      {/* TABS DE CONTROL CENTRAL */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        <button
          onClick={() => setActiveTab('TELEMETRY')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'TELEMETRY' 
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Activity className="w-4 h-4" /> Telemetría Global
        </button>

        <button
          onClick={() => setActiveTab('SPLIT_CALC')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'SPLIT_CALC' 
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Arbitraje Soberano 80/10/10
        </button>

        <button
          onClick={() => setActiveTab('COUNCIL')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
            activeTab === 'COUNCIL' 
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          <Bot className="w-4 h-4" /> Oráculo RAG (516 Nodos)
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* === TAB 1: TELEMETRÍA GLOBAL === */}
        {activeTab === 'TELEMETRY' && (
          <motion.div
            key="TELEMETRY"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10"
          >
            {/* Panel Principal */}
            <div className="lg:col-span-2 p-8 bg-[#09090d] border border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <Globe className="text-[#ecb613] w-6 h-6" />
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Dominios y Tráfico Orgánico</h2>
                  <p className="text-xs text-slate-400 font-light">Matriz Relacional de 52 Provincias (CAC = 0€)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/50 border border-white/5 p-6 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">Unicidad Semántica</span>
                  <div className="text-4xl font-black font-mono text-white">88.4%</div>
                  <p className="text-[11px] text-slate-400 font-light">Libre de penalización Panda/Penguin en 1.560 rutas.</p>
                </div>
                <div className="bg-black/50 border border-white/5 p-6 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block font-bold">Ahorro Anual Proyectado (Ads)</span>
                  <div className="text-4xl font-black font-mono text-white">€182.500</div>
                  <p className="text-[11px] text-slate-400 font-light">Capital liberado de pujas PPC gracias a dominancia SEO.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">Licitaciones B2G Recientes (Art. 118 LCSP)</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20">Hunter Agent ACTIVO</span>
                </div>
                <div className="space-y-3">
                  {[
                    { ayto: 'Ayto. de Méntrida', fecha: 'Hace 2 horas', importe: '€14.500', status: 'MEMORIA ENVIADA' },
                    { ayto: 'Diputación de Toledo', fecha: 'Hace 5 horas', importe: '€8.200', status: 'PROCESANDO' },
                    { ayto: 'Ayto. de Alcobendas', fecha: 'Ayer', importe: '€12.000', status: 'ADJUDICADO' },
                  ].map((lic, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-4 h-4 ${lic.status === 'ADJUDICADO' ? 'text-emerald-400' : 'text-[#ecb613]'}`} />
                        <div>
                          <div className="text-xs font-bold text-white">{lic.ayto}</div>
                          <div className="text-[10px] font-mono text-slate-500">{lic.fecha}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-black text-white">{lic.importe}</div>
                        <div className="text-[8px] font-black uppercase text-[#ecb613] tracking-widest">{lic.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar KPIs */}
            <div className="p-8 bg-[#09090d] border border-white/5 rounded-[3rem] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <h2 className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 italic text-white">
                  <BarChart3 className="text-[#ecb613]" size={20} /> Conversión Global
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-white/40">Tasa de Cierre Stripe (0.50€)</span>
                      <span className="text-emerald-400">32.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '32.4%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-white/40">Retención de Proveedores (B2B)</span>
                      <span className="text-[#ecb613]">94.2%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#ecb613] to-[#ffd471]" style={{ width: '94.2%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block mb-1">Múltiplo M&A Estimado</span>
                <div className="text-3xl font-black font-mono text-white">9.5x <span className="text-sm text-slate-500">ARR</span></div>
                <p className="text-[10px] text-slate-400 mt-2 font-light">Basado en el crecimiento del CAC = 0 y flujos recurrentes B2G.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* === TAB 2: ARBITRAJE SOBERANO 80/10/10 === */}
        {activeTab === 'SPLIT_CALC' && (
          <motion.div
            key="SPLIT_CALC"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#09090d] border border-[#ecb613]/20 p-8 md:p-12 rounded-[3rem] space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#ecb613]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div>
                <h3 className="text-3xl font-black uppercase text-white tracking-tight">Ledger Atómico 80/10/10</h3>
                <p className="text-sm text-slate-400 font-light mt-1">
                  Distribución soberana del capital sin pasivos laborales ni intermediarios.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Caché Total del Contrato</span>
                <span className="text-4xl font-black font-mono text-[#ecb613]">{cachePrice} €</span>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <input 
                type="range" min="500" max="15000" step="100" value={cachePrice}
                onChange={(e) => setCachePrice(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                <span>500 €</span>
                <span>7.500 €</span>
                <span>15.000 €</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 relative z-10">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-8 rounded-3xl space-y-2 hover:bg-emerald-950/40 transition-colors">
                <span className="text-xs font-mono uppercase text-emerald-400 font-black block tracking-wider">80% • Proveedor / Artista</span>
                <div className="text-4xl font-black font-mono text-white">{split.artistAmount.toFixed(0)} €</div>
                <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
                  Liquidación directa protegida por Stripe Connect. Cero retenciones laborales.
                </p>
              </div>

              <div className="bg-[#ecb613]/10 border border-[#ecb613]/40 p-8 rounded-3xl space-y-2 hover:bg-[#ecb613]/20 transition-colors shadow-[0_0_30px_rgba(236,182,19,0.1)]">
                <span className="text-xs font-mono uppercase text-[#ecb613] font-black block tracking-wider">10% • Margen EAR OS</span>
                <div className="text-4xl font-black font-mono text-white">{split.platformAmount.toFixed(0)} €</div>
                <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
                  Beneficio neto atómico. Sin inventario, sin almacenes, sin mermas.
                </p>
              </div>

              <div className="bg-blue-950/20 border border-blue-500/30 p-8 rounded-3xl space-y-2 hover:bg-blue-950/40 transition-colors">
                <span className="text-xs font-mono uppercase text-blue-400 font-black block tracking-wider">10% • Fondo VIMUME</span>
                <div className="text-4xl font-black font-mono text-white">{split.socialAmount.toFixed(0)} €</div>
                <p className="text-xs text-slate-400 font-light mt-2 leading-relaxed">
                  Reinversión en terapia neuroacústica e impacto social auditado.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end pt-6 relative z-10">
                <Link href="/cotizador" target="_blank" className="bg-[#ecb613] text-black font-black uppercase text-xs px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white transition-colors">
                    Ver Cotizador S-Class en Vivo <ArrowRight size={14} />
                </Link>
            </div>
          </motion.div>
        )}

        {/* === TAB 3: ORÁCULO RAG & MENTORES === */}
        {activeTab === 'COUNCIL' && (
          <motion.div
            key="COUNCIL"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#09090d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-[#ecb613]" />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase text-white tracking-tight">Consejo Estratégico Sintético</h3>
                <p className="text-sm text-slate-400 font-light mt-1">
                  Oráculo RAG (Retrieval-Augmented Generation) con 516 nodos cognitivos de negociación.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-white/[0.02] border border-white/10 hover:border-[#ecb613]/30 p-8 rounded-3xl space-y-4 transition-all group">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block bg-[#ecb613]/10 w-fit px-2 py-1 rounded">Mentor: Los Ganadores</span>
                <h4 className="font-black text-lg text-white group-hover:text-[#ecb613] transition-colors">Disciplina y Estándar de Ejecución</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  "No compitas por precio. Compite asegurando puntualidad militar, rider impecable (Bose F1/Axient) y SLA 99.9%. El cliente premium paga por la certidumbre, no por la música."
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 hover:border-[#ecb613]/30 p-8 rounded-3xl space-y-4 transition-all group">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block bg-[#ecb613]/10 w-fit px-2 py-1 rounded">Mentor: El Mentalista</span>
                <h4 className="font-black text-lg text-white group-hover:text-[#ecb613] transition-colors">Neurobranding y Anclaje</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  "Muestra primero la propuesta de Gran Producción de 5.000€ antes de ofrecer la formación base. El anclaje cognitivo hace que la tarifa de 1.850€ parezca una oportunidad ineludible."
                </p>
              </div>

              <div className="bg-white/[0.02] border border-white/10 hover:border-[#ecb613]/30 p-8 rounded-3xl space-y-4 transition-all group">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block bg-[#ecb613]/10 w-fit px-2 py-1 rounded">Mentor: El Club 10X</span>
                <h4 className="font-black text-lg text-white group-hover:text-[#ecb613] transition-colors">Apalancamiento de Software</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  "Deja que los 1.560 activos indexados capten clientes 24/7 mientras duermes. Tú solo debes aparecer para firmar la validación y cobrar el depósito criptográfico."
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-black/50 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">Base Vectorial RAG Activa (516/516 Nodos)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Última sincronización: Hace 4 minutos</span>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
