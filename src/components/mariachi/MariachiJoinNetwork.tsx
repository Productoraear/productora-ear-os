"use client";

import React, { useState } from 'react';
import { 
  Users, DollarSign, ShieldCheck, Zap, Globe, 
  CheckCircle2, ArrowRight, Phone, MessageSquare, Send
} from 'lucide-react';

export default function MariachiJoinNetwork() {
  const [groupName, setGroupName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [membersCount, setMembersCount] = useState('4');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || !phone || !city) return;

    const msg = encodeURIComponent(
      `🎺 ¡HOLA! SOLICITUD DE ADHESIÓN A RED GLOBAL DE MARIACHIS (EAR OS)\n\n` +
      `• Agrupación: ${groupName}\n` +
      `• Representante: ${leaderName}\n` +
      `• Teléfono: ${phone}\n` +
      `• Sede / Ciudad: ${city} (${province || 'España / Internacional'})\n` +
      `• Integrantes habituales: ${membersCount}\n` +
      `• Split Aceptado: 80% neto directo a la agrupación / 0€ cuotas de entrada\n\n` +
      `Solicito auditoría de audio/vídeo para homologación y activación en el mapa de despacho.`
    );
    window.open(`https://wa.me/34693693048?text=${msg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
          <Globe size={14} />
          CONVOCATORIA INTERNACIONAL // EL UBER DE LOS MARIACHIS
        </div>
        <h1 className="text-4xl sm:text-6xl font-black uppercase font-syne tracking-tight leading-tight">
          Gana Más Bolos. <br />
          <span className="text-[#ecb613]">Cobra el 80% Neto.</span> Sin Fricción.
        </h1>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          Basta de pagar cuotas mensuales fijas en portales publicitarios. En EAR OS los clientes te reservan con precio cerrado, fianza asegurada en Stripe y tú recibes los clientes en tu zona con despacho geolocalizado.
        </p>
      </div>

      {/* 3 Pilares Soberanos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="p-6 rounded-3xl bg-[#050508] border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-[#ecb613]/10 text-[#ecb613]">
            <DollarSign size={24} />
          </div>
          <h3 className="text-base font-bold text-white font-syne">Split Soberano 80%</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            El 80% del valor del bolo va íntegro a tu agrupación. EAR OS solo retiene el 10% por tecnología y el 10% por impacto social VIMUME.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#050508] border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-[#00E5FF]/10 text-[#00E5FF]">
            <Zap size={24} />
          </div>
          <h3 className="text-base font-bold text-white font-syne">Despacho Uber Cercano</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Nuestro motor geodésico calcula distancias y te asigna las actuaciones más próximas a tu base, ahorrándote kilómetros y gasolina.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#050508] border border-white/10 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-base font-bold text-white font-syne">Cero Cancelaciones Fantasma</h3>
          <p className="text-xs text-white/50 leading-relaxed">
            Todo cliente debe ingresar un depósito de 100 € en Stripe antes de que el bolo quede confirmado. Cero plantones y seriedad absoluta.
          </p>
        </div>
      </div>

      {/* Formulario de Solicitud */}
      <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#030305] border border-[#ecb613]/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-syne text-white uppercase">
              Registra Tu Agrupación en 60 Segundos
            </h2>
            <p className="text-xs text-white/50">
              Equipo de selección revisará tu material sonoro y te habilitará en el radar en menos de 24 horas.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613] text-center space-y-3">
              <CheckCircle2 size={36} className="text-[#ecb613] mx-auto" />
              <h3 className="text-lg font-bold text-white font-syne">¡Solicitud Enviada a Centralita!</h3>
              <p className="text-xs text-white/70">
                Se ha abierto tu conversación oficial de WhatsApp con la dirección artística de EAR OS. Estaremos en contacto de inmediato.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">Nombre de la Agrupación *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mariachi Los Gavilanes"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Director o Portavoz *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellidos"
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-1">Teléfono Móvil / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Ciudad Base *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valencia / Madrid / Bogotá"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-[#ecb613] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-1">Nº Integrantes Habitual</label>
                  <select
                    value={membersCount}
                    onChange={(e) => setMembersCount(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white focus:border-[#ecb613] focus:outline-none"
                  >
                    <option value="3">Trío (3)</option>
                    <option value="4">Cuarteto (4)</option>
                    <option value="5-6">Ensemble 5-6</option>
                    <option value="7+">Monumental (7 o más)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-black font-syne uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#ecb613]/20 cursor-pointer"
              >
                <Send size={16} />
                <span>Enviar Solicitud y Hablar con la Centralita</span>
              </button>

              <p className="text-[10px] text-center text-white/40 pt-2">
                Sin compromiso ni exclusividad forzada. Mantienes tu libertad y agendas adicionales.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
