"use client";

import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Volume2,
  DollarSign,
  ArrowRight,
  Maximize2,
  Flame,
  Award
} from 'lucide-react';

interface ObjectionCase {
  id: string;
  objection: string;
  clientMood: 'Dudoso' | 'Escéptico' | 'Sensible al Precio';
  counterScript: string;
  keyMetric: string;
}

const OBJECTIONS: ObjectionCase[] = [
  {
    id: 'obj-1-precio',
    objection: '"350 € por un solista me parece elevado para un cóctel."',
    clientMood: 'Sensible al Precio',
    counterScript: '"Entiendo perfectamente. La diferencia con un aficionado es que Edwin Agudelo viene con rider Bose F1 homologado de 12 W/pax, seguro de responsabilidad civil de 1.000.000 € y repertorio a la carta sin interrupciones. En un evento de 15.000 €, arriesgar el ambiente por 80 € de diferencia es la causa nº1 de arrepentimiento."',
    keyMetric: 'Garantía Cero Acoples & Bose F1'
  },
  {
    id: 'obj-2-deposito',
    objection: '"¿Por qué tengo que pagar un depósito de 100 € por adelantado en Stripe?"',
    clientMood: 'Dudoso',
    counterScript: '"Ese depósito de 100 € no es un cargo extra: es tu garantía de Price-Lock con hash SHA-256. Bloquea la fecha exclusiva del artista en nuestra agenda y te protege ante cualquier inflación de tarifas durante las próximas 48 horas. Se descuenta íntegramente del total."',
    keyMetric: 'Price-Lock SHA-256 Inmutable'
  },
  {
    id: 'obj-3-fincas-ruido',
    objection: '"En la finca me dicen que no puedo poner música alta después de las 00:00."',
    clientMood: 'Escéptico',
    counterScript: '"Esa es la especialidad de Productora EAR. Trabajamos con limitadores acústicos calibrados estrictamente por debajo de los 75 dB SPL exigidos por las ordenanzas municipales. La música suena nítida, cálida y envolvente para los invitados sin que el dueño de la finca ni la policía tengan motivo de queja."',
    keyMetric: 'Cumplimiento Legal < 75 dB SPL'
  },
  {
    id: 'obj-4-split-artista',
    objection: '"¿Cómo sé que el artista cobrará su dinero íntegro?"',
    clientMood: 'Dudoso',
    counterScript: '"Bajo el Split Soberano Omega, el 80% de cada euro contratado va directo al artista sin intermediarios ocultos. El 10% financia la plataforma EAR OS y el 10% apoya la fundación neuroacústica VIMUME. Transparencia auditada."',
    keyMetric: 'Split Soberano 80 / 10 / 10'
  }
];

export default function TrainingCenterAdminPage() {
  const [selectedObjection, setSelectedObjection] = useState<ObjectionCase>(OBJECTIONS[0]);
  const [simulatedEvents, setSimulatedEvents] = useState<number>(12);
  const [ticketAverage, setTicketAverage] = useState<number>(750);

  const totalRevenue = simulatedEvents * ticketAverage;
  const artistShare = totalRevenue * 0.8;
  const earOsShare = totalRevenue * 0.1;
  const vimumeShare = totalRevenue * 0.1;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1a1a24] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#ecb613]" />
            Academia Táctica S-Class // Cierre de Contratos
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1 font-mono">
            Omni Training Center & Simulador de Cierres
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Entrenamiento intensivo en manejo de objeciones, guiones de alta conversión y cálculo del Split Soberano.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/EAR_OMNI_TRAINING_CENTER.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/40 text-xs font-mono text-[#ecb613] hover:bg-[#ecb613]/20 flex items-center gap-1.5 transition-colors font-semibold"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Deck de Entrenamiento Standalone
          </a>
        </div>
      </div>

      {/* Simulator Section: Split Soberano 80/10/10 */}
      <div className="p-6 rounded-2xl bg-[#050508] border border-[#1a1a24] space-y-6">
        <div className="flex items-center justify-between border-b border-[#1a1a24] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#ecb613]" />
              Simulador de Comisiones & Reparto 80/10/10
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Proyección de ingresos para artistas, comerciales y alianzas estratégicas con fincas.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded-xl">
            Split Inmutable
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                <span>Número de Bodas / Eventos al Año:</span>
                <span className="text-[#ecb613] font-bold">{simulatedEvents}</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={simulatedEvents}
                onChange={e => setSimulatedEvents(Number(e.target.value))}
                className="w-full accent-[#ecb613] bg-zinc-900 h-2 rounded-lg"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                <span>Ticket Medio por Evento:</span>
                <span className="text-emerald-400 font-bold">{ticketAverage} €</span>
              </div>
              <input
                type="range"
                min="350"
                max="2500"
                step="50"
                value={ticketAverage}
                onChange={e => setTicketAverage(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-zinc-900 h-2 rounded-lg"
              />
            </div>
          </div>

          {/* Breakdown Results */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">80% Artista</span>
              <span className="text-xl font-bold text-white font-mono mt-1 block">
                {artistShare.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
              </span>
              <span className="text-[9px] text-zinc-500 mt-1 block">Honorarios directos</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase block">10% EAR OS</span>
              <span className="text-xl font-bold text-[#ecb613] font-mono mt-1 block">
                {earOsShare.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
              </span>
              <span className="text-[9px] text-zinc-500 mt-1 block">Gobierno & Plataforma</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-mono text-cyan-400 uppercase block">10% VIMUME</span>
              <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
                {vimumeShare.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €
              </span>
              <span className="text-[9px] text-zinc-500 mt-1 block">Fondo Neuroacústico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Objection Handling Battle Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Objection Selector (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400" />
            Objeciones Críticas en Vivo
          </h3>
          <div className="space-y-2">
            {OBJECTIONS.map(obj => {
              const isSelected = obj.id === selectedObjection.id;
              return (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjection(obj)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-[#ecb613]/10 border-[#ecb613] text-white'
                      : 'bg-[#050508] border-[#1a1a24] text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-zinc-500">{obj.id}</span>
                    <span className="text-amber-400 bg-amber-950/40 border border-amber-800 px-1.5 py-0.2 rounded">
                      {obj.clientMood}
                    </span>
                  </div>
                  <div className="text-xs font-semibold leading-snug">
                    {obj.objection}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Counter-Script Mastery (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#050508] border border-[#1a1a24] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a1a24] pb-3">
              <span className="text-xs font-mono text-[#ecb613] font-bold uppercase">
                🎯 Respuesta Táctica Homologada
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                {selectedObjection.keyMetric}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Objeción del Cliente:</span>
              <p className="text-sm text-white italic font-serif">
                {selectedObjection.objection}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                Guion de Contraataque (Copiar y Repetir):
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans bg-black/40 p-4 rounded-xl border border-white/5">
                {selectedObjection.counterScript}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1a1a24] text-xs font-mono text-zinc-500">
            <span>Doctrina S-Class Productora EAR</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Award className="w-4 h-4" />
              100% Conversión Validada
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
