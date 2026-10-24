"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Globe, CheckCircle2, ArrowRight,
  Send, Sparkles, Award, Check, Lock, Music
} from 'lucide-react';

type SubscriptionPlan = 'MENSUAL' | 'ANUAL';

export default function MariachiJoinNetwork() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('ANUAL');
  const [groupName, setGroupName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [membersCount, setMembersCount] = useState('4');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !phone || !city) return;

    const planLabel = selectedPlan === 'ANUAL' 
      ? 'Plan Élite Anual (290€/año — 2 meses de ahorro)' 
      : 'Plan Pro Mensual (29€/mes — sin permanencia)';

    const msg = encodeURIComponent(
      `🎺 ¡HOLA! SOLICITUD DE ALTA EN EL PUENTE DE ARTISTAS (EAR OS)\n\n` +
      `• Agrupación: ${groupName}\n` +
      `• Director / Portavoz: ${leaderName}\n` +
      `• Teléfono WhatsApp: ${phone}\n` +
      `• Ciudad / Base: ${city}\n` +
      `• Integrantes: ${membersCount}\n` +
      `• Plan Seleccionado: ${planLabel}\n` +
      `• Modelo Aceptado: Split Soberano 80% neto directo a la agrupación\n` +
      `• Pasarela de Clientes: Depósito 100€ Stripe asegurado en Escrow por bolo\n\n` +
      `Solicito validación de audio/vídeo y activación de mi Área Privada de Artista.`
    );
    window.open(`https://wa.me/34693693048?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16 min-h-screen overflow-x-hidden py-4">
      {/* 1. HERO HEADER: EL PUENTE SOBERANO */}
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[11px] font-mono uppercase tracking-[0.3em]">
          <Globe size={14} className="text-[#ecb613]" />
          EL PUENTE TECNOLÓGICO SOBERANO // ARTISTAS &amp; MARIACHIS
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase font-syne tracking-tight leading-tight">
          Nosotros Somos el Puente. <br />
          <span className="text-[#ecb613]">Tus Clientes Pagan Seguro</span> y Tú Gestionas Tu Carrera.
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          Olvida los portales anticuados de clasificados donde los mariachis se canibalizan a 150€. En EAR OS cobramos una <strong className="text-white">mensualidad o anualidad accesible</strong> y te entregamos un <strong className="text-[#ecb613]">Área Privada completa</strong>, pasarela de cobro blindada con depósito de 100€ en Stripe y el <strong className="text-white">80% neto</strong> de cada actuación directo a tu cuenta.
        </p>

        {/* Acceso Rápido al Área Privada para Miembros Activos */}
        <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono">
          <Link
            href="/studio/artist"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white transition-all group"
          >
            <Lock size={13} className="text-[#ecb613]" />
            <span>¿Ya eres miembro? Entrar al Área Privada</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#planes-membresia"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/30 text-[#ecb613] transition-all"
          >
            <Sparkles size={13} />
            <span>Ver Planes: 29 €/mes o 290 €/año</span>
          </a>
        </div>
      </div>

      {/* 2. BENCHMARK DEMOLEDOR: MARIACHIS.ES VS PRODUCTORA EAR OS */}
      <div className="rounded-3xl border border-white/10 bg-[#07070b] p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            AUDITORÍA COMPARATIVA // EL SALTO CUÁNTICO
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white">
            Por Qué los Músicos Profesionales Dejan los Clasificados
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Compara el modelo obsoleto de directorios como mariachis.es frente a la infraestructura integral de Productora EAR.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Clasificados Tradicionales (ej. mariachis.es) */}
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Directorios Antiguos (mariachis.es)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300">Modelo 2010</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300">
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Canibalización de precios:</strong> Promocionan &quot;mariachis desde 150€&quot;, devaluando la profesión en una carrera al fondo.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Cero pasarela de cobro:</strong> El cliente llena un formulario genérico; nadie asegura fianza y los plantones de última hora son comunes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Sin software de gestión:</strong> No hay calendario en tiempo real, ni contratos digitales, ni cálculo acústico ni área privada.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-400 font-bold">✕</span>
                <span><strong>Sin seguro de RC:</strong> Si la finca o el ayuntamiento exige seguro de 1.000.000€ o limitador dBA, el artista queda desprotegido.</span>
              </li>
            </ul>
          </div>

          {/* Productora EAR OS (El Puente Soberano) */}
          <div className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/5 p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase tracking-wider rounded-bl-xl">
              Estándar S-Class
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#ecb613] uppercase tracking-wider">Productora EAR OS (Puente Soberano)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/20 text-[#ecb613]">Ecosistema 2026</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-200">
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-400 shrink-0" size={16} />
                <span><strong>Caché digno asegurado:</strong> Solista desde 350€ (Edwin Agudelo), agrupaciones de gala desde 600€ a 1.200€.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-400 shrink-0" size={16} />
                <span><strong>Pasarela Stripe con fianza de 100€:</strong> Todo cliente deposita 100€ deducibles en Escrow antes de bloquear la fecha. Cero plantones.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-400 shrink-0" size={16} />
                <span><strong>Área Privada de Artista (`/studio/artist`):</strong> Calendario ACID, contratos con seguro RC 1.000.000€ y calculadora de sonido Ley 37/2003.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="text-emerald-400 shrink-0" size={16} />
                <span><strong>Split Soberano 80%:</strong> El 80% neto va directo a ti. Sin comisiones usureras del 30-50% de intermediarios clásicos.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. PLANES DE MEMBRESÍA: EL COBRO DEL PUENTE (MENSUAL / ANUAL) */}
      <div id="planes-membresia" className="space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            TARIFAS DEL PUENTE TECNOLÓGICO
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-syne uppercase text-white">
            Elige Tu Membresía de Gestión y Despacho
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Sin comisiones abusivas por bolo. Una suscripción plana que te da acceso a toda la infraestructura tecnológica y clientes cualificados.
          </p>
        </div>

        {/* Toggle Mensual / Anual */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSelectedPlan('MENSUAL')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all ${
                selectedPlan === 'MENSUAL'
                  ? 'bg-white text-black shadow-lg'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Plan Pro Mensual (29 €/mes)
            </button>
            <button
              type="button"
              onClick={() => setSelectedPlan('ANUAL')}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                selectedPlan === 'ANUAL'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span>Plan Élite Anual (290 €/año)</span>
              <span className="px-2 py-0.5 rounded-md bg-black text-[#ecb613] text-[9px] font-black uppercase">
                Ahorra 2 Meses
              </span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan Pro Mensual */}
          <div
            onClick={() => setSelectedPlan('MENSUAL')}
            className={`rounded-3xl p-8 border transition-all cursor-pointer space-y-6 ${
              selectedPlan === 'MENSUAL'
                ? 'bg-white/[0.04] border-white/40 ring-2 ring-white/20'
                : 'bg-[#050508] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Flexibilidad Total</span>
                <h3 className="text-2xl font-black font-syne uppercase text-white mt-1">Plan Pro Mensual</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 text-white">
                <Music size={20} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-syne text-white">29 €</span>
              <span className="text-xs font-mono text-zinc-400">/ mes (IVA no incl.)</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ideal para solistas y mariachis que desean activar el puente mes a mes sin permanencia.
            </p>

            <ul className="space-y-3 text-xs text-zinc-300 border-t border-white/10 pt-6">
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Perfil verificado en Productora EAR y ArtistasEuropa.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Pasarela de cobro Stripe: Clientes pagan fianza de 100€</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Split Soberano: 80% neto directo a tu cuenta bancaria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Área Privada con Calendario de bolos y contratos estándar</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Despacho Swarm por WhatsApp en menos de 15 segundos</span>
              </li>
            </ul>

            <button
              type="button"
              className={`w-full py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition ${
                selectedPlan === 'MENSUAL'
                  ? 'bg-white text-black'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {selectedPlan === 'MENSUAL' ? 'Plan Seleccionado' : 'Elegir Plan Mensual'}
            </button>
          </div>

          {/* Plan Élite Anual */}
          <div
            onClick={() => setSelectedPlan('ANUAL')}
            className={`rounded-3xl p-8 border transition-all cursor-pointer space-y-6 relative overflow-hidden ${
              selectedPlan === 'ANUAL'
                ? 'bg-[#ecb613]/10 border-[#ecb613] ring-2 ring-[#ecb613]/30 shadow-2xl shadow-[#ecb613]/10'
                : 'bg-[#050508] border-white/10 hover:border-[#ecb613]/40'
            }`}
          >
            <div className="absolute top-0 right-0 px-4 py-1 bg-[#ecb613] text-black text-[9px] font-mono font-black uppercase tracking-wider rounded-bl-xl">
              Recomendado // Ahorro Máximo
            </div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">Máxima Rentabilidad</span>
                <h3 className="text-2xl font-black font-syne uppercase text-white mt-1">Plan Élite Anual</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-[#ecb613]/20 text-[#ecb613]">
                <Award size={20} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-syne text-[#ecb613]">290 €</span>
              <span className="text-xs font-mono text-zinc-300">/ año (Equivale a 24,16 €/mes)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Para agrupaciones profesionales que quieren dominar su provincia y recibir contratos de gala todo el año.
            </p>

            <ul className="space-y-3 text-xs text-zinc-200 border-t border-white/10 pt-6">
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span><strong>Todo lo del Plan Pro Mensual</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span><strong>Insignia &quot;Diamante Oro&quot;</strong> y posición prioritaria en el mapa</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Despacho preferente en bodas de alto caché y eventos de ayuntamientos (B2G)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Seguro de Responsabilidad Civil de 1.000.000€ incluido</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check size={14} className="text-[#ecb613]" />
                <span>Ficha acústica visada para fincas exclusivas (Ley 37/2003)</span>
              </li>
            </ul>

            <button
              type="button"
              className={`w-full py-3.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition ${
                selectedPlan === 'ANUAL'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {selectedPlan === 'ANUAL' ? 'Plan Seleccionado' : 'Elegir Plan Anual'}
            </button>
          </div>
        </div>
      </div>

      {/* 4. FORMULARIO DE ADHESIÓN AL PUENTE */}
      <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#030305] border border-[#ecb613]/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              ALTA INMEDIATA EN 60 SEGUNDOS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-syne text-white uppercase">
              Registra Tu Agrupación y Conéctate al Puente
            </h2>
            <p className="text-xs text-zinc-400">
              Plan seleccionado: <strong className="text-[#ecb613]">{selectedPlan === 'ANUAL' ? 'Élite Anual (290€/año)' : 'Pro Mensual (29€/mes)'}</strong>. Dirección artística revisará tu material de audio en menos de 24 horas para darte acceso a tu Área Privada.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613] text-center space-y-4">
              <CheckCircle2 size={40} className="text-[#ecb613] mx-auto" />
              <h3 className="text-xl font-bold text-white font-syne">¡Solicitud de Puente Enviada!</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Se ha generado tu ficha y se ha abierto el canal oficial de WhatsApp con la centralita artística de Productora EAR. Puedes explorar tu búnker privado mientras completamos la activación.
              </p>
              <div className="pt-2">
                <Link
                  href="/studio/artist"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg shadow-[#ecb613]/20"
                >
                  <Lock size={14} />
                  <span>Ir al Área Privada de Artista (`/studio/artist`)</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1">Nombre de la Agrupación o Solista *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariachi Los Gavilanes / Mariachi Imperial"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Director o Portavoz Artístico *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellidos"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1">Teléfono Móvil / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Ciudad Base *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Madrid, Valencia, Toledo..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 mb-1">Formación Habitual</label>
                  <select
                    value={membersCount}
                    onChange={(e) => setMembersCount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white focus:border-[#ecb613] focus:outline-none"
                  >
                    <option value="1">Solista (1)</option>
                    <option value="3">Trío Tradicional (3)</option>
                    <option value="4">Cuarteto Familiar (4)</option>
                    <option value="5-6">Ensemble Gala (5-6)</option>
                    <option value="7+">Mariachi Monumental (7 o más)</option>
                  </select>
                </div>
              </div>

              {/* Selector de Plan en Formulario */}
              <div className="pt-2">
                <label className="block text-zinc-300 mb-1">Membresía Seleccionada</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('MENSUAL')}
                    className={`py-3 px-4 rounded-xl border text-center transition ${
                      selectedPlan === 'MENSUAL'
                        ? 'bg-white/10 border-white text-white font-bold'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Plan Pro Mensual (29 €/mes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('ANUAL')}
                    className={`py-3 px-4 rounded-xl border text-center transition ${
                      selectedPlan === 'ANUAL'
                        ? 'bg-[#ecb613]/20 border-[#ecb613] text-[#ecb613] font-bold'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Plan Élite Anual (290 €/año)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 min-h-[50px] rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-black font-syne uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#ecb613]/20 cursor-pointer"
              >
                <Send size={16} aria-hidden="true" />
                <span>Activar Membresía y Conectar con la Centralita</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 px-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  Split Soberano 80% garantizado
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock size={14} className="text-[#ecb613]" />
                  Depósito 100€ de clientes en Escrow
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
