'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, MapPin, Clock, ShieldCheck, Zap, 
  Play, RefreshCw, AlertTriangle, CheckCircle2, 
  Users, DollarSign, Compass, ArrowRight
} from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { runHighTrafficMariachiSimulation, MariachiSimulationReport } from '@/lib/matchmaker/mariachiHighTrafficSimulator';
import { LiveCommandCenter } from '@/features/tour-logistics/ui/LiveCommandCenter';

export default function SimulacionMariachisPage() {
  const [injectOvertime, setInjectOvertime] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const simulation: MariachiSimulationReport = useMemo(() => {
    return runHighTrafficMariachiSimulation(injectOvertime);
  }, [injectOvertime]);

  const handleStartSimulation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1200);
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
              Métricas y posicionamiento GPS real en directo. Salida oficial desde <strong className="text-white">Plaza Elíptica, Madrid</strong>. Verificación en tiempo real de franjas horarias y cascada de relevo.
            </p>

            {/* Simulation Control Buttons Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 font-syne text-xs">
              <button
                onClick={handleStartSimulation}
                disabled={isRunning}
                className="px-6 py-3.5 rounded-2xl bg-[#ecb613] text-black font-black uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center gap-2 shadow-xl shadow-[#ecb613]/20 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                <span>{isRunning ? 'Ejecutando Simulación...' : '▶ Iniciar Simulación 32 Bolos'}</span>
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

          {/* 📋 32 MARIACHI SQUAD SCHEDULE DISPATCH GRID */}
          <div className="bg-[#030305]/90 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music size={20} className="text-[#ecb613]" />
                <h2 className="text-lg font-bold font-syne uppercase text-white">
                  Rejilla de Despacho de 32 Actuaciones (Sábado)
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Potencia Acústica Total Cumplida: <strong className="text-amber-400">{simulation.totalAcousticWatts.toLocaleString('es-ES')} W RMS</strong>
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
                  className={`p-4 rounded-2xl border space-y-3 relative overflow-hidden ${
                    b.status === 'UBER_REASSIGNED'
                      ? 'bg-rose-500/10 border-rose-500/40 shadow-lg shadow-rose-500/10'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      #{idx + 1} • {b.timeSlot}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                      {b.distanceFromPlazaElipticaKm} km desde Plaza Elíptica
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-white font-syne text-sm">{b.municipality}</h3>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {b.status === 'UBER_REASSIGNED' ? (
                        <span className="text-rose-300 font-bold">⚡ {b.reassignedToName}</span>
                      ) : (
                        <span>{b.squadName}</span>
                      )}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1 text-[10px] text-zinc-400">
                    <div className="flex justify-between">
                      <span>Base + IVA 21%:</span>
                      <span className="text-zinc-200">{b.basePrice} € + {b.vatAmount} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logística:</span>
                      <span className="text-zinc-200">+{b.logisticsFee} €</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10 text-white font-bold font-syne text-xs">
                      <span>TOTAL BRUTO:</span>
                      <span className="text-[#ecb613]">{b.totalGrossPrice} €</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-400 italic leading-tight pt-1">
                    {b.logNotes}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

          {/* TELEMETRÍA EN VIVO (MAPA REAL) */}
          <div className="pt-8">
            <LiveCommandCenter tourId="GLOBAL_MARIACHI_FLEET" />
          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}
