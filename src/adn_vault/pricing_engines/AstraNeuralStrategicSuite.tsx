'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Crown, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Award, 
  Layers, 
  Lock, 
  Mic2, 
  Speaker, 
  Music, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Sliders,
  DollarSign,
  BarChart3,
  Bot
} from 'lucide-react';
import Link from 'next/link';

export const AstraNeuralStrategicSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ARSENAL' | 'PROFILE_LAB' | 'SPLIT_CALC' | 'COUNCIL'>('ARSENAL');
  
  // Estado para el Simulador de Split 80/10/10
  const [cachePrice, setCachePrice] = useState<number>(2500);

  // Estado para el Laboratorio de Perfil
  const [artistType, setArtistType] = useState<string>('MARIACHI_GALA');
  const [hasHomologatedRider, setHasHomologatedRider] = useState<boolean>(true);
  const [formationLevel, setFormationLevel] = useState<string>('CONSERVATORIO');

  const calculateSplit = (total: number) => {
    const artistAmount = total * 0.80;
    const platformAmount = total * 0.10;
    const socialAmount = total * 0.10;
    return { artistAmount, platformAmount, socialAmount };
  };

  const split = calculateSplit(cachePrice);

  return (
    <div className="w-full space-y-10 text-white font-sans">
      
      {/* CABECERA SUITE NEURAL HIGH-TICKET */}
      <div className="bg-[#070709] border border-[#ecb613]/30 rounded-[3rem] p-8 md:p-12 shadow-[0_0_50px_rgba(236,182,19,0.1)] relative overflow-hidden space-y-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> ASTRA NEURAL STRATEGIC SUITE • HIGH-TICKET ENGINE
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Acelerador de <span className="text-[#ecb613] italic">Autoridad & Caché de Alto Valor</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed font-light">
            Metodología y herramientas cognitivas integradas desde el Astra Neural Engine para transformar agrupaciones en <strong>Atletas Culturales de Alto Rendimiento</strong> bajo el estándar de producción de EAR OS.
          </p>
        </div>

        {/* SELECTOR DE MÓDULOS DE LA SUITE */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => setActiveTab('ARSENAL')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'ARSENAL' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Crown className="w-4 h-4" /> Arsenal High-Ticket
          </button>

          <button
            onClick={() => setActiveTab('SPLIT_CALC')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'SPLIT_CALC' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Split Soberano 80/10/10
          </button>

          <button
            onClick={() => setActiveTab('PROFILE_LAB')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'PROFILE_LAB' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" /> Laboratorio de Perfil
          </button>

          <button
            onClick={() => setActiveTab('COUNCIL')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activeTab === 'COUNCIL' 
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black' 
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Bot className="w-4 h-4" /> Consejo Estratégico
          </button>
        </div>

      </div>

      {/* CONTENIDO INTERACTIVO DE CADA MÓDULO */}
      <AnimatePresence mode="wait">
        
        {/* MÓDULO 1: ARSENAL DE PROPUESTAS DE VALOR HIGH-TICKET */}
        {activeTab === 'ARSENAL' && (
          <motion.div
            key="ARSENAL"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-[#0a0a0d] border border-white/10 hover:border-[#ecb613]/50 p-8 rounded-3xl space-y-4 flex flex-col justify-between group transition-all">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Nivel 1 • Gala Institucional</span>
                <h3 className="text-xl font-black uppercase text-white">Gran Concierto & Mariachi Sinfónico</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Formación de 6 a 8 maestros de conservatorio, trajes charros de alta gala bordados a mano, sonorización Bose F1 y microfonía inalámbrica Shure Axient.
                </p>
                <div className="pt-2 space-y-1 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Cumplimiento Art. 118 LCSP</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Póliza RC 1.000.000 €</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Montaje y prueba T-120min</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xl font-black font-mono text-white">1.250 € - 3.500 €</span>
                <Link href="/cotizador?service=mariachi-imperial" className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1">
                  Cotizar <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="bg-[#0a0a0d] border border-[#ecb613]/40 p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-4 right-4 bg-[#ecb613] text-black text-[9px] font-mono font-black px-2.5 py-0.5 rounded-full uppercase">
                Recomendado
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Nivel 2 • Experiencia B2B / Bodas VIP</span>
                <h3 className="text-xl font-black uppercase text-white">Espectáculo Híbrido Acústico & DJ</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Transición sin interrupción desde música en vivo de alta emoción (ceremonia / cóctel) hasta sesión DJ con robótica DMX e iluminación cálida de ambientación.
                </p>
                <div className="pt-2 space-y-1 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Comisión 10% para Wedding Planner</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> SLA 99.9% Cero llamadas a deshora</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Sonido envolvente no invasivo</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xl font-black font-mono text-white">1.850 € - 4.500 €</span>
                <Link href="/cotizador?service=espectaculo-hibrido" className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1">
                  Cotizar <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            <div className="bg-[#0a0a0d] border border-white/10 hover:border-[#ecb613]/50 p-8 rounded-3xl space-y-4 flex flex-col justify-between group transition-all">
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">Nivel 3 • Gran Escenario & Festivales</span>
                <h3 className="text-xl font-black uppercase text-white">Producción Titan S-Class Completa</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-light">
                  Ingeniería acústica Line Array de alta presión (hasta 5.000 pax), puente de luces truss homologado, realización multicámara 4K y streaming en directo.
                </p>
                <div className="pt-2 space-y-1 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Dirección técnica FOH y monitores</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Certificado de solidez estructural</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#ecb613]" /> Redundancia N+1 en mesa y etapas</div>
                </div>
              </div>
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <span className="text-xl font-black font-mono text-white">3.500 € - 12.000 €</span>
                <Link href="/cotizador?service=produccion-titan" className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1">
                  Cotizar <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* MÓDULO 2: SIMULADOR DE SPLIT SOBERANO 80/10/10 */}
        {activeTab === 'SPLIT_CALC' && (
          <motion.div
            key="SPLIT_CALC"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#0a0a0d] border border-white/10 p-8 md:p-12 rounded-3xl space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-black uppercase text-white">Simulador de Liquidación Soberana 80/10/10</h3>
                <p className="text-xs text-slate-400 font-light">
                  Muestra la soberanía financiera del artista frente a intermediarios abusivos tradicionales.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Caché Total del Evento</span>
                <span className="text-3xl font-black font-mono text-[#ecb613]">{cachePrice} €</span>
              </div>
            </div>

            <div className="space-y-2">
              <input 
                type="range" min="500" max="10000" step="100" value={cachePrice}
                onChange={(e) => setCachePrice(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>500 €</span>
                <span>5.000 €</span>
                <span>10.000 €</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">80% • Artista Soberano</span>
                <div className="text-3xl font-black font-mono text-white">{split.artistAmount.toFixed(0)} €</div>
                <p className="text-[11px] text-slate-300 font-light">
                  Liquidación directa protegida por Escrow en Stripe. Cero comisiones ocultas.
                </p>
              </div>

              <div className="bg-[#ecb613]/10 border border-[#ecb613]/30 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">10% • Infraestructura EAR OS</span>
                <div className="text-3xl font-black font-mono text-white">{split.platformAmount.toFixed(0)} €</div>
                <p className="text-[11px] text-slate-300 font-light">
                  Mantenimiento de software 24/7, soporte técnico, rider Bose y captación programática.
                </p>
              </div>

              <div className="bg-blue-950/30 border border-blue-500/30 p-6 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-blue-400 font-bold block">10% • Fondo Social VIMUME</span>
                <div className="text-3xl font-black font-mono text-white">{split.socialAmount.toFixed(0)} €</div>
                <p className="text-[11px] text-slate-300 font-light">
                  Impacto social y estimulación neuroacústica en residencias de la tercera edad.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* MÓDULO 3: LABORATORIO DE PERFIL & AUTORIDAD */}
        {activeTab === 'PROFILE_LAB' && (
          <motion.div
            key="PROFILE_LAB"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#0a0a0d] border border-white/10 p-8 md:p-12 rounded-3xl space-y-6"
          >
            <h3 className="text-2xl font-black uppercase text-white">Diagnóstico de Autoridad & Valor de Caché</h3>
            <p className="text-xs text-slate-400 font-light">
              Evalúa los factores que justifican una tarifa de 4 cifras por actuación.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-400">Tipo de Formación</label>
                <select 
                  value={artistType}
                  onChange={(e) => setArtistType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
                >
                  <option value="MARIACHI_GALA" className="bg-black">Mariachi de Alta Gala (Edwin Agudelo)</option>
                  <option value="DUO_ACUSTICO" className="bg-black">Dúo Acústico / Solista Lírico</option>
                  <option value="ORQUESTA_GALA" className="bg-black">Orquesta de Cámara / Gala</option>
                  <option value="DJ_HYBRID" className="bg-black">DJ Set Híbrido con Percusión/Saxo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-400">Rider Homologado</label>
                <button
                  onClick={() => setHasHomologatedRider(!hasHomologatedRider)}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-mono font-bold uppercase text-left transition-all ${
                    hasHomologatedRider ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-400' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {hasHomologatedRider ? '✓ Bose F1 + Shure Axient (Homologado)' : '✗ Sin Rider Homologado'}
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-slate-400">Nivel de Formación</label>
                <select 
                  value={formationLevel}
                  onChange={(e) => setFormationLevel(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-[#ecb613]"
                >
                  <option value="CONSERVATORIO" className="bg-black">Músicos de Conservatorio Superior</option>
                  <option value="PRO_EXPERIENCE" className="bg-black">+10 Años de Trayectoria Demostrable</option>
                  <option value="THE_SIGNAL" className="bg-black">Certificado Academia EAR / The Signal</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-black/40 border border-[#ecb613]/20 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#ecb613] uppercase block">Índice de Autoridad Calculado</span>
                <span className="text-2xl font-black text-white font-mono">
                  {hasHomologatedRider ? '98.5 / 100 • S-Class Authority' : '72.0 / 100 • Requiere Homologación'}
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                Tarifa Justificada: 1.250 € - 3.500 €
              </span>
            </div>
          </motion.div>
        )}

        {/* MÓDULO 4: CONSEJO ESTRATÉGICO SINTÉTICO (DELIBERACIÓN IA) */}
        {activeTab === 'COUNCIL' && (
          <motion.div
            key="COUNCIL"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-[#0a0a0d] border border-white/10 p-8 md:p-12 rounded-3xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-[#ecb613]" />
              <div>
                <h3 className="text-2xl font-black uppercase text-white">Consejo Asesor Sintético (516 Nodos RAG)</h3>
                <p className="text-xs text-slate-400 font-light">
                  Consulta de decisiones de alto impacto asistida por los 9 mentores estratégicos de Velocity e Incubadora.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase block">Mentor: Los Ganadores</span>
                <h4 className="font-bold text-sm text-white">Disciplina y Estándar de Ejecución</h4>
                <p className="text-xs text-slate-400 font-light">
                  "No compitas por precio. Compite asegurando puntualidad militar, rider impecable y SLA 99.9%."
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase block">Mentor: El Mentalista</span>
                <h4 className="font-bold text-sm text-white">Neurobranding y Anclaje</h4>
                <p className="text-xs text-slate-400 font-light">
                  "Muestra la propuesta integral de 3.500€ antes de ofrecer el depósito de 0.50€ para asegurar tranquilidad."
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-[#ecb613] uppercase block">Mentor: El Club 10X</span>
                <h4 className="font-bold text-sm text-white">Apalancamiento de Software</h4>
                <p className="text-xs text-slate-400 font-light">
                  "Deja que los 30.823 activos y las landing pages programáticas capten clientes 24/7 para tu agenda."
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default AstraNeuralStrategicSuite;
