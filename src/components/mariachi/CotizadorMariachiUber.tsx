"use client";

import React, { useState } from "react";
import { createSecureMariachiBooking } from "@/app/actions/mariachiLeadActions";

interface Props {
  userSession?: { id: string; email: string; name?: string } | null;
}

export default function CotizadorMariachiUber({ userSession }: Props) {
  const [format, setFormat] = useState("Trío Clásico (3 Músicos)");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("20:00");
  const [durationHours, setDurationHours] = useState(1);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [postalCode, setPostalCode] = useState("28001");
  const [city, setCity] = useState("Madrid");
  const [arrivalNotes, setArrivalNotes] = useState("");
  const [phone, setPhone] = useState("+34");
  const [antiFraudAccepted, setAntiFraudAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ trackingUrl: string; message: string } | null>(null);

  // Tarifas canónicas base
  const formatPrices: Record<string, number> = {
    "Solista Edwin Agudelo": 550,
    "Dúo Romancero": 450,
    "Trío Clásico (3 Músicos)": 550,
    "Cuarteto Imperial (4 Músicos)": 690,
    "Quinteto Monumental (5 Músicos)": 850,
  };

  const basePrice = formatPrices[format] || 550;
  const totalPrice = Math.round(basePrice * (durationHours > 1 ? 1 + (durationHours - 1) * 0.75 : 1));
  const depositPrice = Math.round(totalPrice * 0.5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!userSession?.id) {
      setErrorMsg("Debe iniciar sesión para formalizar la reserva y activar la garantía militar.");
      return;
    }

    if (!phone.startsWith("+") || phone.length < 10) {
      setErrorMsg("Introduzca un número de WhatsApp internacional válido (+34...)");
      return;
    }

    if (!street || !city || !postalCode) {
      setErrorMsg("Debe completar la dirección del evento (calle, código postal y localidad).");
      return;
    }

    if (!antiFraudAccepted) {
      setErrorMsg("Debe aceptar la cláusula antipicaresca de cobro cero en metálico.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createSecureMariachiBooking({
        userId: userSession.id,
        userEmail: userSession.email,
        clientName: userSession.name || "Cliente EAR",
        clientPhone: phone,
        eventAddress: {
          street,
          number,
          postalCode,
          city,
          notes: arrivalNotes,
        },
        eventDate,
        startTime,
        durationHours,
        format,
        acceptsAntiFraudPolicy: antiFraudAccepted,
      });

      if (res.success) {
        setBookingResult({ trackingUrl: res.trackingUrl, message: res.message });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error procesando el despacho blindado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="cotizador-uber" className="my-12 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-2xl text-white">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
        <div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-widest">
            S-Class Dispatch
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2 text-white">
            Cotizador Geodésico y Despacho Blindado
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-zinc-400 block">Tarifa Oficial Canónica</span>
          <span className="text-2xl md:text-3xl font-extrabold text-amber-400">{totalPrice} €</span>
        </div>
      </div>

      {bookingResult ? (
        <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-4">
          <div className="text-3xl">🛡️</div>
          <h3 className="text-lg font-bold text-amber-400">¡Despacho Blindado Registrado!</h3>
          <p className="text-sm text-zinc-300">{bookingResult.message}</p>
          <a
            href={bookingResult.trackingUrl}
            className="inline-block px-6 py-3 rounded-xl bg-amber-400 text-black font-black uppercase text-xs tracking-wider hover:bg-amber-300 transition"
          >
            Acceder a la Sala de Control y Radar GPS
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Formato y Duración */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Formato Musical</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              >
                {Object.keys(formatPrices).map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt} ({formatPrices[fmt]} €)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Fecha del Evento</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Hora Inicio (Flexible)</label>
              <input
                type="time"
                step="900"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              Duración del Servicio: <span className="text-amber-400 font-bold">{durationHours} hora(s)</span>
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={durationHours}
              onChange={(e) => setDurationHours(parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Dirección Exacta */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Calle / Avenida / Finca</label>
              <input
                type="text"
                required
                placeholder="Ej: Paseo de la Castellana"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Nº / Portal / Finca</label>
              <input
                type="text"
                placeholder="Ej: 14, Finca San José"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Código Postal</label>
              <input
                type="text"
                required
                placeholder="28001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Señas e Instrucciones de Llegada */}
          <div>
            <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              📍 Señas e Instrucciones de Llegada al Recinto (Crítico)
            </label>
            <textarea
              rows={2}
              value={arrivalNotes}
              onChange={(e) => setArrivalNotes(e.target.value)}
              placeholder="Ej: Entrada trasera de servicio para no arruinar la sorpresa. Preguntar por Carmen en recepción."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Teléfono E.164 */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">
              WhatsApp Móvil de Contacto Directo (Formato Internacional E.164)
            </label>
            <input
              type="tel"
              required
              placeholder="+34693693048"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Cláusula Antipicaresca */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-red-500/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="antiFraud"
              checked={antiFraudAccepted}
              onChange={(e) => setAntiFraudAccepted(e.target.checked)}
              className="mt-1 accent-amber-400"
            />
            <label htmlFor="antiFraud" className="text-[11px] text-zinc-300 leading-relaxed cursor-pointer">
              <strong className="text-amber-400">CLÁUSULA DE BLINDAJE ANTIPICARESCA:</strong> Acepto que cualquier pago o sobreprecio en metálico no registrado en la plataforma está terminantemente prohibido y conlleva la rescisión inmediata del servicio, pérdida de fianza y expulsión permanente de la plataforma.
            </label>
          </div>

          {/* Botón de Pago / Despacho */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold uppercase text-xs md:text-sm tracking-widest shadow-lg hover:from-amber-300 hover:to-amber-400 transition disabled:opacity-50"
            >
              {isSubmitting ? "Verificando Despacho Blindado..." : `Reservar con Depósito Blindado (50%: ${depositPrice} €)`}
            </button>
            <p className="text-center text-[10px] text-zinc-500 mt-2">
              * El 50% restante se liquida únicamente a través de la pasarela segura tras verificar la llegada in situ del mariachi.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
