"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CharroHatIcon from "@/components/ui/icons/CharroHatIcon";
import InternationalFlightBadge from "@/components/booking/InternationalFlightBadge";
import { EVENT_OCCASIONS } from "@/lib/taxonomy/eventsAndGeo";
import { createSecureMariachiBooking } from "@/app/actions/mariachiLeadActions";
import { createStripeBookingCheckoutSession } from "@/app/actions/stripeBookingActions";

// Formatos Artísticos Oficiales con Espacio Visual y Transparencia
interface EnsambleFormat {
  id: string;
  musicians: number;
  name: string;
  subtitle: string;
  price: number;
  recommended?: boolean;
  idealFor: string;
  youtubeId?: string;
  features: string[];
}

const ENSAMBLE_FORMATS: EnsambleFormat[] = [
  {
    id: "solista",
    musicians: 1,
    name: "Solista de Gala · Edwin Agudelo",
    subtitle: "Voz principal, guitarra y traje charro de máxima etiqueta",
    price: 550,
    recommended: true,
    idealFor: "Serenatas íntimas, aniversarios, pedidas de mano y sorpresas de alto impacto",
    youtubeId: "dQw4w9WgXcQ", // Vídeo oficial de muestra
    features: [
      "Voz líder en directo con repertorio clásico y ranchero",
      "Sonido autónomo inalámbrico sin necesidad de cables ni enchufes",
      "Entrada por sorpresa coordinada al milímetro",
      "Dedicatoria personalizada y entrega de flores",
    ],
  },
  {
    id: "duo",
    musicians: 2,
    name: "Dúo Tradicional",
    subtitle: "Voz solista acompañada de trompeta o vihuela",
    price: 450,
    idealFor: "Reuniones familiares, bodas civiles y celebraciones de hasta 40 personas",
    features: [
      "Armonía tradicional y brillo instrumental en acústico",
      "Entrada sorpresa e interacción cercana con el homenajeado",
      "Sonido autónomo de apoyo incluido",
    ],
  },
  {
    id: "trio",
    musicians: 3,
    name: "Trío Clásico Romántico",
    subtitle: "Voz, guitarra/vihuela y trompeta charra",
    price: 550,
    idealFor: "Cumpleaños, bodas de plata/oro y comidas de celebración",
    features: [
      "La sonoridad completa del mariachi tradicional",
      "Repertorio de fiesta, corridos y serenatas inolvidables",
      "Ronda fotográfica de gala incluida",
    ],
  },
  {
    id: "sexteto",
    musicians: 6,
    name: "Sexteto de Gran Gala",
    subtitle: "Voz líder (Edwin Agudelo), 2 trompetas, 2 violines y guitarrón",
    price: 1150,
    idealFor: "Grandes bodas, banquetes, eventos corporativos y fiestas patronales",
    features: [
      "Presencia escénica imponente y sonido orquestal en directo",
      "Repertorio de gala para grandes auditorios o recintos abiertos",
      "Dirección musical y coordinación protocolaria presencial",
    ],
  },
];

interface Props {
  municipio?: string;
  initialTemp?: string;
}

export default function UniversalPricingEngine({
  municipio = "Madrid",
  initialTemp = "hot",
}: Props) {
  const searchParams = useSearchParams();
  const temp = (searchParams.get("temp") || initialTemp).toLowerCase();

  // Estados de Configuración del Evento
  const [selectedFormat, setSelectedFormat] = useState<EnsambleFormat>(ENSAMBLE_FORMATS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState(EVENT_OCCASIONS[0].slug);
  const [isInternational, setIsInternational] = useState(false);
  const [targetCity, setTargetCity] = useState(municipio);

  // Datos de Contacto y Reserva
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [eventDate, setEventDate] = useState("2026-11-28");
  const [eventTime, setEventTime] = useState("18:00");
  const [arrivalNotes, setArrivalNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Detección automática si la ciudad es europea/internacional
  useEffect(() => {
    const intlCities = ["bruselas", "paris", "londres", "ginebra", "roma"];
    if (intlCities.includes(targetCity.toLowerCase())) {
      setIsInternational(true);
    }
  }, [targetCity]);

  // Cálculos Económicos
  const totalPrice = selectedFormat.price;
  const depositPrice = Math.round(totalPrice * 0.5);

  // Adaptación de Textos de Conversión según la Temperatura del Lead
  const getCtaLabel = () => {
    switch (temp) {
      case "cold":
        return `Descubrir Disponibilidad para ${targetCity}`;
      case "warm":
        return `Verificar Agenda y Reservar sin Compromiso`;
      case "emergency":
        return `🚨 Activar Llegada Inmediata para Hoy (${depositPrice} €)`;
      case "hot":
      default:
        return `Asegurar Fecha con Depósito Protegido (${depositPrice} €)`;
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const activeOccasionObj = EVENT_OCCASIONS.find((o) => o.slug === selectedOccasion);

      // 1. Guardar Lead Seguro
      const res = await createSecureMariachiBooking({
        clientName,
        clientEmail,
        clientPhone,
        address,
        municipio: targetCity,
        eventDate,
        eventTime,
        formatId: selectedFormat.id,
        formatLabel: selectedFormat.name,
        ocasionSlug: selectedOccasion,
        ocasionLabel: activeOccasionObj?.name || "Celebración",
        calculatedPrice: totalPrice,
        depositAmount: depositPrice,
        arrivalInstructions: arrivalNotes,
      });

      if (res.success) {
        // 2. Redirigir a Pasarela Oficial de Pago
        const stripeRes = await createStripeBookingCheckoutSession({
          leadId: res.leadHash,
          clientEmail,
          clientName,
          eventName: `${selectedFormat.name} · ${activeOccasionObj?.name}`,
          depositAmountEUR: depositPrice,
          totalEventPriceEUR: totalPrice,
          city: targetCity,
          eventDate,
        });

        if (stripeRes?.url) {
          window.location.href = stripeRes.url;
          return;
        }

        setBookingSuccess(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 py-8 px-4 sm:px-6">
      {/* =========================================================================
          ACTO I: CABECERA DE GALA Y SELECCIÓN DE OCASIÓN (RESPIRACIÓN VISUAL)
          ========================================================================= */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
          <CharroHatIcon className="w-4 h-4 text-amber-400" />
          <span>Contratación Directa y Oficial · {targetCity}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          La Emoción del Mariachi en Directo, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            con Tarifa Cerrada y Cero Sorpresas
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400 leading-relaxed">
          Sin intermediarios, sin cobros en efectivo sobre la marcha y con puntualidad garantizada por contrato.
        </p>

        {/* Selector de Ocasión Espacioso */}
        <div className="pt-4 max-w-md mx-auto">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
            ¿Qué motivo celebramos?
          </label>
          <select
            value={selectedOccasion}
            onChange={(e) => setSelectedOccasion(e.target.value)}
            className="w-full py-3.5 px-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium text-sm focus:border-amber-400 focus:outline-none transition shadow-inner"
          >
            {EVENT_OCCASIONS.map((oc) => (
              <option key={oc.slug} value={oc.slug}>
                {oc.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Si es Destino Europeo/Internacional: Desglose Aéreo Resuelto */}
      {isInternational && (
        <section>
          <InternationalFlightBadge
            cityKey={targetCity}
            artistName="Edwin Agudelo"
            musicianCount={selectedFormat.musicians}
            eventDate={eventDate}
          />
        </section>
      )}

      {/* =========================================================================
          ACTO II: CATÁLOGO DE FORMATOS (TARJETAS INDEPENDIENTES CON AIRE)
          ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            1. Elige el Ensamble a la Medida de tu Espacio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Todos los formatos incluyen vestimenta de gala completa y repertorio a la carta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ENSAMBLE_FORMATS.map((fmt) => {
            const isSelected = selectedFormat.id === fmt.id;
            return (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-8 transition-all duration-300 relative border flex flex-col justify-between ${
                  isSelected
                    ? "bg-zinc-950 border-amber-400 ring-2 ring-amber-400/30 shadow-2xl scale-[1.01]"
                    : "bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950"
                }`}
              >
                {fmt.recommended && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md">
                    ★ Formato Más Elegido
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{fmt.name}</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">{fmt.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-amber-400">{fmt.price} €</span>
                      <span className="text-[10px] text-zinc-500 block">Total cerrado</span>
                    </div>
                  </div>

                  <p className="text-xs text-amber-300/90 font-medium italic">
                    Ideal para: {fmt.idealFor}
                  </p>

                  <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-900">
                    {fmt.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-400">✔</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Anticipo en custodia (50%):</span>
                  <span className="font-bold text-white">{Math.round(fmt.price * 0.5)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          ACTO III: ESCAPARATE DE REGALOS Y CORTESÍAS INCLUIDAS (VALOR TANGIBLE)
          ========================================================================= */}
      <section className="p-8 sm:p-10 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6 shadow-xl">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
            Detalles Exclusivos Sin Coste Adicional
          </span>
          <h2 className="text-2xl font-black text-white">Todo lo que Recibes con tu Actuación</h2>
          <p className="text-xs text-zinc-400">
            Cuidamos cada detalle para que no tengas que preocuparte de nada durante la fiesta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <span className="text-2xl">💐</span>
            <h4 className="text-xs font-bold text-white uppercase">Flores en Mano</h4>
            <p className="text-[11px] text-zinc-400">
              Ramo de cortesía entregado a la persona homenajeada al iniciar la serenata.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <span className="text-2xl">🔊</span>
            <h4 className="text-xs font-bold text-white uppercase">Sonido Autónomo</h4>
            <p className="text-[11px] text-zinc-400">
              Equipo profesional portátil a batería para exteriores, jardines o salones sin enchufes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <span className="text-2xl">📸</span>
            <h4 className="text-xs font-bold text-white uppercase">Recuerdo Fotográfico</h4>
            <p className="text-[11px] text-zinc-400">
              Sesión de fotos de alta resolución con los músicos enviada en digital tras el evento.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-2">
            <span className="text-2xl">🎩</span>
            <h4 className="text-xs font-bold text-white uppercase">Sombreros de Gala</h4>
            <p className="text-[11px] text-zinc-400">
              Sombreros charros tradicionales disponibles para fotos inolvidables con los invitados.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ACTO IV: FORMULARIO DE BLOQUEO DE FECHA Y PAGO PROTEGIDO
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-amber-500/40 space-y-8 shadow-2xl relative">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Reserva Oficial Blindada
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            2. Coordenadas y Aseguramiento de Agenda
          </h2>
          <p className="text-xs text-zinc-400">
            Introduce los datos del lugar y abona el depósito seguro para bloquear a los artistas.
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-6 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Nombre Completo</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Carmen García"
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">WhatsApp de Contacto</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Correo Electrónico (Para Factura y Fotos)</label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="carmen@ejemplo.com"
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Municipio / Población</label>
              <input
                type="text"
                required
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Dirección del Recinto o Finca</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número o nombre del restaurante"
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Hora de Sorpresa</label>
              <input
                type="time"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">
              Instrucciones de Llegada Secreta (Opcional)
            </label>
            <textarea
              rows={2}
              value={arrivalNotes}
              onChange={(e) => setArrivalNotes(e.target.value)}
              placeholder="Ej. Entrar por el jardín trasero cuando suene la tarta, preguntar por Carmen..."
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Caja Resumen de Liquidación */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div>
              <span className="text-zinc-400 block">Formato seleccionado:</span>
              <strong className="text-white text-sm">{selectedFormat.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 block">Tarifa Oficial: {totalPrice} €</span>
              <span className="text-amber-400 font-bold text-sm">
                Anticipo a Pagar Hoy: {depositPrice} €
              </span>
            </div>
          </div>

          {/* Botón Principal Adaptado a la Temperatura */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black uppercase tracking-wider text-sm transition shadow-2xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Generando Enlace Seguro..." : getCtaLabel()}
          </button>

          <p className="text-[11px] text-zinc-500 text-center">
            🔒 <strong>Pago 100% Protegido:</strong> Tu depósito queda custodiado en garantía. El 50% restante se abona únicamente tras la realización satisfactoria de la actuación. Cero pagos en mano a pie de calle.
          </p>
        </form>
      </section>
    </div>
  );
}