'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Sliders, ShieldCheck, ShieldAlert, Volume2, 
  Users, Music, Tv, Zap, Phone, ArrowRight, CheckCircle2, 
  Bot, Send, HelpCircle, Lock
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export default function OraculoPage() {
  // Estado de los Sliders del Simulador
  const [invitados, setInvitados] = useState<number>(150);
  const [wPerPax, setWPerPax] = useState<number>(14);
  const [visualsTier, setVisualsTier] = useState<number>(2); // 1: Básico, 2: Torres LED + Foco, 3: Pantalla LED P2 + Truss
  const [talentTier, setTalentTier] = useState<number>(2); // 1: Pistas, 2: Solista Edwin Agudelo, 3: Mariachi Imperial 6+
  const [hours, setHours] = useState<number>(5);

  // Chat con el Oráculo en vivo dentro de la página
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'oraculo',
      text: 'Bienvenido a The Oracle S-Class. Ajusta los controles interactivos para auditar en tiempo real la probabilidad de éxito acústico de tu evento o consúltame cualquier parámetro técnico.'
    }
  ]);

  // Cálculos predictivos del Oráculo
  const calculation = useMemo(() => {
    const totalWatts = invitados * wPerPax;
    const isUnderpowered = wPerPax < 10;
    const isOptimal = wPerPax >= 12 && wPerPax <= 18;
    const isUltra = wPerPax > 18;

    // Probabilidad de Éxito Acústico (0 a 100%)
    let score = 50;
    if (wPerPax >= 12) score += 30;
    else if (wPerPax >= 10) score += 15;
    else score -= 25;

    if (visualsTier === 2) score += 10;
    if (visualsTier === 3) score += 15;

    if (talentTier === 2) score += 10;
    if (talentTier === 3) score += 15;

    score = Math.min(Math.max(score, 15), 99.8);

    // Presupuesto Base Estimado
    let base = 450;
    base += talentTier === 2 ? 350 : talentTier === 3 ? 950 : 0;
    base += visualsTier === 2 ? 300 : visualsTier === 3 ? 800 : 0;
    base += (wPerPax - 8) * 15;
    base += (hours - 3) * 60;

    return {
      totalWatts,
      score: Math.round(score * 10) / 10,
      isUnderpowered,
      isOptimal,
      isUltra,
      estimatedPrice: Math.round(base)
    };
  }, [invitados, wPerPax, visualsTier, talentTier, hours]);

  const handleAskOracle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, { sender: 'user', text: userText }];

    let reply = '';
    if (/precio|cuanto cuesta|tarifa/i.test(userText)) {
      reply = `Según los parámetros configurados (${invitados} pax, ${wPerPax} W/pax y formato artístico), la cotización S-Class recomendada es de aproximadamente ${calculation.estimatedPrice} € con Price-Lock 72h garantizado.`;
    } else if (/potencia|w\/pax|bose|fallo/i.test(userText)) {
      reply = `Para ${invitados} asistentes, necesitas un mínimo de ${invitados * 12} W de potencia para garantizar un sonido nítido sin distorsión. Recomendamos sistema Bose F1 Model 812 bi-amplificado.`;
    } else if (/edwin|artista|solista/i.test(userText)) {
      reply = `Edwin Agudelo (Paciente Cero) garantiza repertorio lírico y ranchero de alta fidelidad, con microfonía Shure Beta 87A y ecualización de sala anti-acoples.`;
    } else {
      reply = `El simulador predice un ${calculation.score}% de probabilidad de éxito. Para formalizar la reserva con depósito transaccional de 100 €, puedes contactar directamente al +34 693 693 048.`;
    }

    setChatMessages([...newMsgs, { sender: 'oraculo', text: reply }]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-amber-500 selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado Soberano */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Oracle · Gemelo Neural & Simulador S-Class</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase font-serif">
            The <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Oracle</span>
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed">
            Simulador predictivo de presupuesto, cálculo de probabilidad acústica y auditoría de eventos en tiempo real.
          </p>
        </div>

        {/* ── CUADRÍCULA PRINCIPAL: SIMULADOR + MONITOR PREDICTIVO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Columna Izquierda: Los Controles / Sliders del Oráculo */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white font-mono uppercase">
                  Parámetros del Evento
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-500 uppercase">
                Auditoría en Vivo
              </span>
            </div>

            {/* Slider 1: Invitados */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-zinc-300 uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Aforo / Invitados Previstos</span>
                </label>
                <span className="text-sm font-bold font-mono text-white bg-zinc-800 px-3 py-1 rounded-lg border border-zinc-700">
                  {invitados} pax
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={500}
                step={10}
                value={invitados}
                onChange={(e) => setInvitados(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>30 (Íntimo)</span>
                <span>200 (Boda Estándar)</span>
                <span>500+ (Gran Gala)</span>
              </div>
            </div>

            {/* Slider 2: Ratio Acústico W/pax */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono text-zinc-300 uppercase flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>Presión Sonora por Persona (W/pax)</span>
                </label>
                <span className={`text-sm font-bold font-mono px-3 py-1 rounded-lg border ${
                  calculation.isUnderpowered 
                    ? 'text-rose-400 bg-rose-950/50 border-rose-500/50' 
                    : 'text-emerald-400 bg-emerald-950/50 border-emerald-500/50'
                }`}>
                  {wPerPax} W/pax ({calculation.totalWatts} W totales)
                </span>
              </div>
              <input
                type="range"
                min={6}
                max={24}
                step={1}
                value={wPerPax}
                onChange={(e) => setWPerPax(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span className="text-rose-400">&lt; 10 W (Riesgo Asfixia)</span>
                <span className="text-emerald-400">12 W (Estándar EAR S-Class)</span>
                <span className="text-cyan-400">20+ W (Potencia Concierto)</span>
              </div>
            </div>

            {/* Selector 3: Nivel de Talento */}
            <div>
              <label className="text-xs font-mono text-zinc-300 uppercase flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span>Formato Musical & Roster de Artistas</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTalentTier(1)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    talentTier === 1 
                      ? 'bg-purple-500/20 border-purple-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Pistas / DJ</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Básico</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTalentTier(2)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    talentTier === 2 
                      ? 'bg-amber-500/20 border-amber-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Edwin Agudelo</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">Solista S-Class</div>
                </button>
                <button
                  type="button"
                  onClick={() => setTalentTier(3)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    talentTier === 3 
                      ? 'bg-purple-500/20 border-purple-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Mariachi (6+)</div>
                  <div className="text-[10px] text-purple-400 mt-0.5">Gran Ensamble</div>
                </button>
              </div>
            </div>

            {/* Selector 4: Iluminación & Visuales */}
            <div>
              <label className="text-xs font-mono text-zinc-300 uppercase flex items-center gap-2 mb-2">
                <Tv className="w-4 h-4 text-blue-400" />
                <span>Arsenal Visual & Pantallas LED</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setVisualsTier(1)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    visualsTier === 1 
                      ? 'bg-blue-500/20 border-blue-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Focos LED Par</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">Básico</div>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualsTier(2)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    visualsTier === 2 
                      ? 'bg-blue-500/20 border-blue-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Torres + Cabezas</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">DMX Móvil</div>
                </button>
                <button
                  type="button"
                  onClick={() => setVisualsTier(3)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    visualsTier === 3 
                      ? 'bg-blue-500/20 border-blue-400 text-white' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xs font-bold font-mono">Pantalla LED P2</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">Truss Monumental</div>
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Monitor del Oráculo & Predicción */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 shadow-2xl relative overflow-hidden ${
              calculation.isUnderpowered 
                ? 'bg-gradient-to-b from-rose-950/40 via-zinc-900 to-black border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.2)]'
                : 'bg-gradient-to-b from-amber-500/15 via-zinc-900 to-black border-amber-500/50 shadow-[0_0_40px_rgba(245,197,56,0.2)]'
            }`}>
              {/* Alerta si el nivel de sonido es peligroso */}
              {calculation.isUnderpowered ? (
                <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-start gap-3 mb-6 animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-rose-300 uppercase font-mono">
                      ⚠️ RIESGO ACÚSTICO DETECTADO
                    </div>
                    <div className="text-[11px] text-rose-200 mt-0.5">
                      Menos de 10 W/pax provocará "asfixia sónica". La música en directo no se escuchará con claridad al fondo de la sala. Aumenta a 12 W/pax.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300 uppercase font-mono">
                      BLINDAJE ACÚSTICO S-CLASS ACTIVO
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-0.5">
                      Cobertura sonora homologada. Coeficiente anti-feedback 100% verificado.
                    </div>
                  </div>
                </div>
              )}

              {/* Indicador de Probabilidad de Éxito */}
              <div className="text-center py-4 border-y border-zinc-800 my-4">
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">
                  Probabilidad de Éxito del Evento
                </div>
                <div className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${
                  calculation.score >= 80 ? 'text-amber-400' : calculation.score >= 50 ? 'text-amber-200' : 'text-rose-400'
                }`}>
                  {calculation.score}%
                </div>
                <div className="text-[11px] text-zinc-500 font-mono mt-1">
                  Algoritmo predictivo de fidelidad sónica y solvencia escénica
                </div>
              </div>

              {/* Cotización Estimada */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="text-xs font-mono text-zinc-400 uppercase">Presupuesto Sugerido</div>
                  <div className="text-2xl font-bold font-mono text-white mt-0.5">
                    {calculation.estimatedPrice} € <span className="text-xs text-zinc-500 font-normal">estimado</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                  Price-Lock 72h
                </span>
              </div>

              {/* Botón CTA Bloqueo */}
              <Link
                href={`/contacto?tipo=oraculo&pax=${invitados}&precio=${calculation.estimatedPrice}`}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Bloquear Esta Tarifa con Depósito 100€</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tarjeta de Centralita de Contingencia */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs font-bold text-white font-mono">¿Dudas Técnicas?</div>
                <div className="text-[11px] text-zinc-400">Habla con Dirección de Audio</div>
              </div>
              <a
                href={CENTRALITA.href}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{CENTRALITA.display}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN INFERIOR: CONSULTORIO EN PANTALLA COMPLETA ── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-mono uppercase">
                Consultorio Inteligente The Oracle
              </h3>
              <p className="text-xs text-zinc-400">
                Resuelve dudas específicas sobre riders técnicos, cláusulas LCSP o contratos nupciales.
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-2">
            {chatMessages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                  m.sender === 'user'
                    ? 'ml-auto bg-amber-500 text-black font-medium'
                    : 'bg-zinc-950 border border-zinc-800 text-zinc-200'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskOracle} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ej: ¿Qué incluye el pack de Mariachi para 150 personas en Pozuelo?"
              className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Consultar</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
