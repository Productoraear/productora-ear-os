'use client';

import React from 'react';
import { Calendar, CheckCircle2, BellRing, Lock, Shield } from 'lucide-react';
import { DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

/**
 * SovereignBookingTimeline
 * Replicación 1:1 de HorizonX Trial / Booking Timeline adaptada a la reserva de Edwin Agudelo.
 * Estructura de lista ordenada (<ol>) completamente accesible para lectores de pantalla.
 * Explica paso a paso con fechas y precios en letras qué sucede tras el depósito.
 */
export function SovereignBookingTimeline() {
  const hoyStr = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  // Fecha estimada de evento a 14 días
  const fechaEvento = new Date();
  fechaEvento.setDate(fechaEvento.getDate() + 14);
  const fechaEventoStr = fechaEvento.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  // Recordatorio 48h antes
  const recordatorio = new Date(fechaEvento);
  recordatorio.setDate(recordatorio.getDate() - 2);
  const recordatorioStr = recordatorio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  const liquidacionRestante = TARIFA_BASE_SOLISTA_EUR - DEPOSITO_STRIPE_EUR;

  return (
    <section aria-label="Cronograma de Reserva y Compromiso" className="my-8 font-sans">
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Cronograma de Blindaje de Fecha & Compromiso
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">100% Sin Sorpresas</span>
        </div>

        {/* Lista ordenada para que los lectores de pantalla cuenten los pasos */}
        <ol className="relative border-l border-zinc-800 ml-3 space-y-8 my-4">
          {/* Paso 1: Hoy */}
          <li className="ml-6 relative">
            <span
              className="absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-zinc-950 font-mono font-bold text-xs ring-4 ring-zinc-950"
              aria-hidden="true"
            >
              1
            </span>
            <div className="text-xs font-mono text-amber-400 font-bold mb-0.5">
              Hoy · {hoyStr}
            </div>
            <h4 className="text-sm font-bold text-white">Bloqueo Atómico de Fecha en Stripe</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Pagas únicamente la fianza deducible de{' '}
              <strong className="text-white font-mono">{DEPOSITO_STRIPE_EUR.toFixed(2)} € (cien euros)</strong> con
              Price-Lock SHA-256. La fecha y hora quedan bloqueadas exclusivamente para tu evento en el calendario de Edwin Agudelo.
            </p>
          </li>

          {/* Paso 2: 48h antes del evento */}
          <li className="ml-6 relative">
            <span
              className="absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-xs ring-4 ring-zinc-950"
              aria-hidden="true"
            >
              2
            </span>
            <div className="text-xs font-mono text-zinc-400 font-bold mb-0.5">
              48h Antes · {recordatorioStr}
            </div>
            <h4 className="text-sm font-bold text-white">Check-in Acústico & Validación de Rider</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Revisamos la distancia GPS final, confirmamos la potencia requerida (12 W/pax) y verificamos que el espacio
              cumple con el límite legal de 75 dB SPL de la Ley 37/2003.
            </p>
          </li>

          {/* Paso 3: Día del evento */}
          <li className="ml-6 relative">
            <span
              className="absolute -left-9 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-zinc-950 font-mono font-bold text-xs ring-4 ring-zinc-950"
              aria-hidden="true"
            >
              3
            </span>
            <div className="text-xs font-mono text-emerald-400 font-bold mb-0.5">
              Día del Evento · {fechaEventoStr}
            </div>
            <h4 className="text-sm font-bold text-white">Directo Solista en Gala & Liquidación</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Edwin Agudelo realiza la actuación en directo. Al finalizar, se liquida el saldo restante de{' '}
              <strong className="text-emerald-400 font-mono">
                {liquidacionRestante.toFixed(2)} € (doscientos cincuenta euros)
              </strong>
              , habiéndose restado íntegramente tu fianza de 100 €.
            </p>
          </li>
        </ol>

        {/* Frase descriptiva de precio en letras y resumen legal */}
        <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="text-zinc-400 text-center sm:text-left">
            <span>Tarifa base total: </span>
            <strong className="text-white">350,00 € (trescientos cincuenta euros)</strong>.
            <span className="block text-[11px] text-zinc-500 mt-0.5">
              Hoy solo abonas 100,00 € de fianza 100% deducible.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sin Cargos Ocultos de Agencia</span>
          </div>
        </div>
      </div>
    </section>
  );
}

