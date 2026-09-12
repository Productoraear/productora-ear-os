'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Music, MapPin, Clock, ShieldCheck, Zap, 
  Play, RefreshCw, AlertTriangle, CheckCircle2, 
  Users, DollarSign, Compass, ArrowRight, Phone, MessageSquare, Key, Building
} from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { runHighTrafficMariachiSimulation, MariachiSimulationReport } from '@/lib/matchmaker/mariachiHighTrafficSimulator';
import { UberFleetVisualizer } from '@/components/neural/UberFleetVisualizer';

export default function SimulacionMariachisPage() {
  const [injectOvertime, setInjectOvertime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const simulation: MariachiSimulationReport = useMemo(() => {
    return runHighTrafficMariachiSimulation(injectOvertime);
  }, [injectOvertime]);

  const handleStartSimulation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 60000);
  };

  return (
    <MeshGradientBackground intensity="stage">
      <main className="min-h-screen pt-28 sm:pt-32 pb-40 px-4 md:px-8 text-white font-sans selection:bg-[#ecb613] selection:text-black">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Hero */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(236,182,19,0.15)]">
              <Zap size={14} className="animate-pulse" />
              HIGH-TRAFFIC DISPATCH ENGINE // UBER DE LOS MARIACHIS
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-syne leading-[0.95]">
              TELEMETRÍA GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">UBER MARIACHIS</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Métricas reales y cartografía satélite de alta definición. Salida oficial desde <strong className="text-white">Plaza Elíptica, Madrid</strong>. Señas de acceso minuciosas y contacto telefónico directo con el mariachi tras el pago de fianza.
            </p>

            {/* Simulation Control Buttons Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 font-syne text-xs">
              <button
                onClick={handleStartSimulation}
                disabled={isRunning}
                className="px-6 py-3.5 rounded-2xl bg-[#ecb613] text-black font-black uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-2 shadow-xl shadow-[#ecb613]/20 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                <span>{isRunning ? 'Flota en Tránsito...' : '▶ Desplegar Flota 32 Bolos'}</span>
              </button>

              <button
                onClick={() => setInjectOvertime(!injectOvertime)}
                className={`px-6 py-3.5 rounded-2xl font-bold uppercase tracking-wider transition-all border flex items-center gap-2 cursor-pointer ${
                  injectOvertime 
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30' 
                    : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <AlertTriangle size={16} className={injectOvertime ? 'animate-bounce' : ''} />
                <span>{injectOvertime ? '⚡ Horas Extra Activadas (Relevos Uber Exitosos)' : 'Simular +3h Extra Inesperadas'}</span>
              </button>
            </div>
          </div>

          {/* 📊 HIGH LEVEL METRICS DASHBOARD (4 METRIC CARDS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="bg-[#030305]/90 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Base Oficial Salida</span>
              <strong className="text-sm text-[#00E5FF] font-bold block truncate">Plaza Elíptica (Madrid)</strong>
              <span className="text-[9px] text-zinc-400 block pt-1">40.3847, -3.7183</span>
            </div>

            <div className="bg-[#030305]/90 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Facturación Bruta (Con IVA)</span>
              <strong className="text-xl text-[#ecb613] font-bold block">{simulation.totalGrossRevenue.toLocaleString('es-ES')} €</strong>
              <span className="text-[9px] text-amber-400/80 block pt-1">IVA 21%: {simulation.totalVatAmount.toLocaleString('es-ES')} €</span>
            </div>

            <div className="bg-[#030305]/90 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Cancelaciones / SLA</span>
              <strong className="text-xl text-emerald-400 font-bold block">0% / 100% SLA</strong>
              <span className="text-[9px] text-emerald-400/80 block pt-1">32 / 32 Actuaciones Garantizadas</span>
            </div>

            <div className="bg-[#030305]/90 border border-white/10 p-5 rounded-3xl backdrop-blur-2xl space-y-1">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Relevos Uber Cascada</span>
              <strong className="text-xl text-rose-400 font-bold block">{simulation.successfulReassignments} Reasignaciones</strong>
              <span className="text-[9px] text-zinc-400 block pt-1">Respuesta &lt; 50 ms</span>
            </div>
          </div>

          {/* 🗺️ MAPA TÁCTICO GOOGLE MAPS HD // CENTRO DE MANDO EN VIVO */}
          <div className="pt-2">
            <UberFleetVisualizer 
              report={simulation} 
              isRunning={isRunning}
              onTogglePlay={handleStartSimulation}
              onToggleOvertime={() => setInjectOvertime(!injectOvertime)}
              injectOvertime={injectOvertime}
            />
          </div>

          {/* 📋 32 MARIACHI SQUAD SCHEDULE DISPATCH GRID */}
          <div className="bg-[#030305]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music size={20} className="text-[#ecb613]" />
                <h2 className="text-lg font-bold font-syne uppercase text-white">
                  Rejilla de Despacho de 32 Actuaciones con Señas y Contacto Directo
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Potencia Acústica Total: <strong className="text-amber-400">{simulation.totalAcousticWatts.toLocaleString('es-ES')} W RMS</strong>
              </span>
            </div>

            {/* Grid of 32 Booking Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
              {simulation.bookings.map((b, idx) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`p-5 rounded-2xl border space-y-3 relative overflow-hidden ${
                    b.status === 'UBER_REASSIGNED'
                      ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      #{idx + 1} • {b.timeSlot}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      FIANZA STRIPE OK
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white font-syne text-sm leading-tight flex items-center gap-1.5">
                      <Building size={14} className="text-[#ecb613] shrink-0" />
                      <span>{b.venueName}</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {b.municipality} • {b.distanceFromPlazaElipticaKm} km desde Base
                    </p>
                  </div>

                  {/* Contacto Directo con el Mariachi */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-[10px]">
                    <div className="flex items-center justify-between text-emerald-400 font-bold uppercase tracking-wider text-[9px]">
                      <span>Mariachi Asignado:</span>
                      <span>Canal Directo</span>
                    </div>
                    <p className="text-white font-bold">{b.mariachiLeadName}</p>
                    <p className="text-zinc-400 text-[9px]">Furgoneta: {b.mariachiVehiclePlate}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${b.mariachiPhone}`}
                        className="py-1.5 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-syne font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                      >
                        <Phone size={12} />
                        <span>Llamar</span>
                      </a>
                      <a
                        href={`https://wa.me/${b.mariachiPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(b.mariachiLeadName)}%2C%20contacto%20desde%20EAR%20OS`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-syne font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
                      >
                        <MessageSquare size={12} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Señas de acceso */}
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-[10px] text-zinc-400">
                    <span className="text-[#00E5FF] font-bold text-[9px] flex items-center gap-1">
                      <Key size={11} /> Señas de Acceso del Cliente:
                    </span>
                    <p className="text-zinc-300 italic text-[9.5px] leading-snug">
                      &ldquo;{b.clientAccessNotes}&rdquo;
                    </p>
                    <p className="text-[9px] text-zinc-400 pt-1">
                      Aparcamiento: {b.parkingInstructions}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-white/10 text-[10px]">
                    <span className="text-zinc-400">TOTAL BRUTO:</span>
                    <span className="text-[#ecb613] font-bold font-syne text-xs">{b.totalGrossPrice} €</span>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}
