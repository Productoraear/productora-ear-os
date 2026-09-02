'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Sparkles, Award, ShieldCheck, ArrowRight, 
  CheckCircle2, DollarSign, Send, Zap, Bot, RefreshCw, Lock, Unlock
} from 'lucide-react';

interface TheSignalOnboardingProps {
  onQualified: () => void;
}

export const TheSignalOnboarding: React.FC<TheSignalOnboardingProps> = ({ onQualified }) => {
  // Formulario de Audición Express
  const [artistName, setArtistName] = useState('');
  const [genre, setGenre] = useState('Mariachi / Música Lírica');
  const [demoLink, setDemoLink] = useState('');
  
  // Test de Nivel
  const [q1Rider, setQ1Rider] = useState(true); // ¿Dispones de Rider o estás dispuesto a homologar Bose/Shure?
  const [q2Puntuality, setQ2Puntuality] = useState(true); // ¿Aceptas el SLA militar T-120min?
  const [q3Mercantile, setQ3Mercantile] = useState(true); // ¿Operas con alta en SS y factura oficial?

  // Calculadora de Soberanía
  const [traditionalBoloPrice, setTraditionalBoloPrice] = useState(350);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qualificationScore, setQualificationScore] = useState<number | null>(null);

  const calculateScore = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      let score = 70;
      if (q1Rider) score += 10;
      if (q2Puntuality) score += 10;
      if (q3Mercantile) score += 10;
      setQualificationScore(score);
    }, 1000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto font-sans">
      
      {/* HEADER THE SIGNAL */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-950/60 border border-purple-500/30 rounded-full text-purple-300 text-[10px] font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> THE SIGNAL // PROGRAMA DE ALTO RENDIMIENTO ARTÍSTICO
        </div>
        <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white font-syne">
          De Músico de Garaje a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#ecb613] to-white">Atleta Cultural</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
          Postula a la red soberana de EAR OS. Evaluamos tu propuesta escénica, eliminamos intermediarios y te garantizamos acceso al Split Soberano 80/10/10 y a la Suite E-Manager de Dani Aragón.
        </p>
      </div>

      {/* CALCULADORA DE SOBERANÍA FINANCIERA */}
      <section className="bg-[#09090d] border border-purple-500/30 rounded-[2.5rem] p-6 sm:p-10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase font-bold">
            <DollarSign size={16} /> Calculadora de Soberanía Financiera
          </div>
          <span className="text-[10px] font-mono text-zinc-400">Comparativa: Tradicional vs EAR OS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label className="text-xs font-mono text-zinc-300 block">Tu Caché Bruto Actual por Bolo (Promedio Tradicional)</label>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-500">Músico Suelto:</span>
              <span className="text-xl font-bold font-mono text-zinc-400">{traditionalBoloPrice} €</span>
            </div>
            <input
              type="range" min="150" max="800" step="50"
              value={traditionalBoloPrice}
              onChange={(e) => setTraditionalBoloPrice(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <p className="text-[11px] text-zinc-500 font-light leading-relaxed">
              En el modelo tradicional, el intermediario o sala se queda con el 60-80% del valor, dejándote sin margen para reinvertir en sonido ni equipo.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-950/40 via-[#0e0e14] to-black border border-purple-500/40 p-6 rounded-3xl space-y-4 shadow-xl">
            <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">Tu Rendimiento Bajo Split 80/10/10</span>
            <div className="text-3xl font-black font-mono text-white">1.250 € <span className="text-xs text-zinc-400 font-light font-sans">(Tarifa Gala Base)</span></div>
            
            <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/5">
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Tu Liquidación Neta (80%):</span>
                <span>1.000 € / bolo</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Plataforma & Rider Bose (10%):</span>
                <span>125 €</span>
              </div>
              <div className="flex justify-between text-blue-400">
                <span>Fondo VIMUME (10%):</span>
                <span>125 €</span>
              </div>
            </div>

            <div className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/40 p-2 rounded-xl text-center">
              +{(1000 - traditionalBoloPrice)} € de Margen Extra por Bolo
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE AUDICIÓN EXPRESS & TEST DE NIVEL */}
      <section className="bg-[#09090d] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <Compass className="w-5 h-5 text-[#ecb613]" />
          <h3 className="text-lg font-bold uppercase text-white font-syne">Formulario de Admisión Express & Test de Nivel</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300">Nombre Artístico / Ensamble</label>
            <input
              type="text"
              placeholder="Ej: Trío Imperial de Madrid"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-300">Enlace a Demo / Muestra de Audio (YouTube / Drive / Spotify)</label>
            <input
              type="text"
              placeholder="https://..."
              value={demoLink}
              onChange={(e) => setDemoLink(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-xs font-mono focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* 3 PREGUNTAS DE AUDITORÍA MILITAR */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <span className="text-xs font-mono text-purple-400 uppercase font-bold block">Auditoría de Idoneidad S-Class</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setQ1Rider(!q1Rider)}
              className={`p-4 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                q1Rider ? 'bg-purple-950/40 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-zinc-500'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>1. Rider Homologado</span>
                <span>{q1Rider ? '✓ SÍ' : '✗ NO'}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light">Dispones o estás dispuesto a usar Bose F1 y Shure Axient.</p>
            </button>

            <button
              onClick={() => setQ2Puntuality(!q2Puntuality)}
              className={`p-4 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                q2Puntuality ? 'bg-purple-950/40 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-zinc-500'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>2. SLA Militar T-120</span>
                <span>{q2Puntuality ? '✓ SÍ' : '✗ NO'}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light">Aceptas montar y ensayar sonido 120 minutos antes de cada evento.</p>
            </button>

            <button
              onClick={() => setQ3Mercantile(!q3Mercantile)}
              className={`p-4 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                q3Mercantile ? 'bg-purple-950/40 border-purple-500/50 text-white' : 'bg-white/5 border-white/5 text-zinc-500'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span>3. Factura Mercantil</span>
                <span>{q3Mercantile ? '✓ SÍ' : '✗ NO'}</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-light">Operas con alta legal, seguro de RC y facturación oficial.</p>
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={calculateScore}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analizando ADN Artístico con Oráculo Astra...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Evaluar Postulación & Calcular Score
              </>
            )}
          </button>
        </div>

        {/* RESULTADO DEL SCORE & DESBLOQUEO DE ASTRA OS */}
        <AnimatePresence>
          {qualificationScore !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#0e0e14] border border-emerald-500/40 rounded-3xl space-y-4 text-center shadow-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/60 text-emerald-400 text-xs font-mono font-bold rounded-full">
                ★ SCORE OBTENIDO: {qualificationScore} / 100
              </div>

              {qualificationScore >= 80 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-black uppercase text-white font-syne">
                    ¡Felicidades! Has sido Pre-Aprobado como Atleta Cultural S-Class
                  </h4>
                  <p className="text-xs text-zinc-300 max-w-xl mx-auto font-light leading-relaxed">
                    Cumples con los estándares técnicos y de soberanía financiera. Has desbloqueado el acceso completo a la <strong>Suite E-Manager de Dani Aragón</strong> y a la <strong>Rueda de la Vida Artística</strong> en Astra OS.
                  </p>
                  
                  <button
                    onClick={onQualified}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
                  >
                    <Unlock size={16} /> Entrar a la Suite Privada Astra OS →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-lg font-bold uppercase text-amber-400 font-syne">
                    Puntos Ciegos Detectados
                  </h4>
                  <p className="text-xs text-zinc-400 max-w-xl mx-auto font-light">
                    Para acceder a la suite privada necesitas homologar tu rider y protocolo de puntualidad militar.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </section>

    </div>
  );
};

export default TheSignalOnboarding;
