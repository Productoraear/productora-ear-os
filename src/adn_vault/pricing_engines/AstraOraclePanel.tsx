"use client";

import React, { useState } from "react";
import { runAstraPrediction } from "@/app/actions/commandCenterActions";
import { AstraPredictionOutput } from "@/lib/ai/astra/predictive-engine";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  BrainCircuit, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AstraOraclePanelProps {
  userEmail: string;
  isAdmin: boolean;
}

export default function AstraOraclePanel({ userEmail, isAdmin }: AstraOraclePanelProps) {
  const [origin, setOrigin] = useState("Madrid, España");
  const [destination, setDestination] = useState("Ibiza, Islas Baleares");
  const [eventDate, setEventDate] = useState(() => {
    const future = new Date();
    future.setMonth(future.getMonth() + 1);
    return future.toISOString().split("T")[0];
  });

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<AstraPredictionOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await runAstraPrediction(userEmail, {
        origin,
        destination,
        eventDate
      });
      setPrediction(res);
    } catch (err: any) {
      console.error("🛑 [ASTRA_UI] Prediction failed:", err);
      setErrorMsg(err.message || "Fallo en ejecución del oráculo ASTRA.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR"
    }).format(val);
  };

  return (
    <div className="space-y-8">
      {/* Panel Header */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#d4a855] flex items-center gap-2">
          <BrainCircuit className="animate-pulse text-[#d4a855]" size={16} /> ORÁCULO NEURAL ASTRA
        </h3>
        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
          Simulador RAG de tarifas logísticas y riesgo de transporte en España
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Input Simulation Form */}
        <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a855]/3 blur-3xl pointer-events-none rounded-full" />
          
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <MapPin size={12} /> Punto de Origen (Base de Flota)
              </label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#d4a855] transition-colors"
                placeholder="Ej: Madrid, España"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <MapPin size={12} /> Punto de Destino (Lugar del Evento)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#d4a855] transition-colors"
                placeholder="Ej: Ibiza, Islas Baleares"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <Calendar size={12} /> Fecha del Evento VIP
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#d4a855] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#d4a855] to-[#ffd471] text-black font-black py-4 rounded-xl shadow-[0_10px_30px_rgba(212,168,85,0.15)] text-[10px] uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCw size={12} className="animate-spin" /> CANALIZANDO SINAPSIS ASTRA...
                </>
              ) : (
                <>
                  <Sparkles size={12} /> RECALCULAR CON ASTRA
                </>
              )}
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-2">
              <ShieldAlert size={14} />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Right: Diagnostic Dashboard Results */}
        <div className="flex flex-col justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-8 text-center border border-white/5 bg-black/40 rounded-[2.5rem] space-y-6"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-2 border-[#d4a855]/20 rounded-full" />
                  <div className="absolute inset-0 border-2 border-t-[#d4a855] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#d4a855]">
                    <Cpu size={24} className="animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider text-white">Sincronizando Embeddings RAG...</p>
                  <p className="text-[8px] text-white/35 font-black uppercase tracking-[0.2em]">Consultando historial de flotas y wallets</p>
                </div>
              </motion.div>
            ) : prediction ? (
              <motion.div
                key="prediction-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Confidence Warnings (Guardrail FASE 4) */}
                {prediction.warningMessage && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-black uppercase tracking-wider rounded-2xl flex items-center gap-3 shadow-lg"
                  >
                    <AlertTriangle size={16} className="flex-shrink-0 animate-bounce" />
                    <span>{prediction.warningMessage}</span>
                  </motion.div>
                )}

                {/* Main recommended price */}
                <div className="p-6 bg-gradient-to-br from-[#121212] via-[#080808] to-[#1a150b] border border-white/10 rounded-[2.5rem] shadow-[0_15px_40px_rgba(212,168,85,0.08)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4a855]/5 blur-3xl pointer-events-none rounded-full" />
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[8px] text-[#d4a855] font-black uppercase tracking-[0.2em]">Sovereign Pricing Suggestion</span>
                      <h4 className="text-xs font-black text-white/50 uppercase tracking-widest">TARIFA RECOMENDADA</h4>
                    </div>
                    <span className="text-[8px] font-black border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 size={10} /> SECURE
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none italic font-mono mb-4 text-[#ffd471] drop-shadow-[0_0_20px_rgba(212,168,85,0.2)]">
                    {formatCurrency(prediction.recommendedTotalAmount)}
                  </div>

                  <p className="text-[10px] text-white/70 leading-relaxed font-bold border-t border-white/5 pt-3">
                    {prediction.explanation}
                  </p>
                </div>

                {/* Score Indicators Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">Congestión</span>
                    <div className="text-sm font-black text-white font-mono">{Math.round(prediction.baseDemandScore * 100)}%</div>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">Geotarifas</span>
                    <div className="text-sm font-black text-[#d4a855] font-mono">{prediction.geoPriceMultiplier}x</div>
                  </div>
                  <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-[7px] text-white/40 uppercase font-black tracking-widest">Riesgo</span>
                    <div className="text-sm font-black text-red-400 font-mono">{Math.round(prediction.riskScore * 100)}%</div>
                  </div>
                </div>

                {/* Footnote Guardrail warning */}
                <div className="text-[8px] text-white/30 uppercase font-black tracking-widest text-center">
                  ⚠️ NOTA DE CONTROL: EL PRECIO DEL CHECKOUT NO SERÁ ALTERADO AUTOMÁTICAMENTE SIN CONFIRMACIÓN.
                </div>
              </motion.div>
            ) : (
              <div className="p-8 text-center border border-white/5 bg-black/40 rounded-[2.5rem] space-y-4">
                <BrainCircuit className="w-12 h-12 text-white/10 mx-auto" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-tight">Listo para simular</p>
                  <p className="text-[9px] text-white/30 uppercase font-black mt-1">
                    Defina los parámetros de la ruta de flotas y ejecute la calibración neuronal.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
