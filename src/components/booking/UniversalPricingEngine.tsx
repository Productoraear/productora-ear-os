"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSecureMariachiBooking } from "@/app/actions/mariachiLeadActions";
import { EVENT_OCCASIONS, MUNICIPIOS_ESPANA, resolveLeadTemperature } from "@/lib/taxonomy/eventsAndGeo";
import CharroHatIcon from "@/components/ui/icons/CharroHatIcon";

interface Props {
  categorySlug?: string;
  title?: string;
  initialMunicipio?: string;
  initialOcasion?: string;
  userSession?: { id: string; email: string; name?: string } | null;
}

export const INTEGRANTES_OPCIONES = [
  {
    id: "solista-edwin",
    label: "👑 Solista Premium Edwin Agudelo",
    musicos: 1,
    price: 550,
    hasEdwin: true,
    isHormoziFeatured: true,
    videoUrl: "https://youtu.be/fLT4-kqfdI4?feature=shared",
    desc: "Voz estelar de Edwin Agudelo, traje de gala charro, sonorización Bose y la experiencia cumbre garantizada.",
  },
  {
    id: "duo",
    label: "Dúo Romancero (2 Músicos)",
    musicos: 2,
    price: 450,
    hasEdwin: false,
    desc: "Armonía de voces, guitarra y vihuela para serenatas íntimas.",
  },
  {
    id: "trio",
    label: "Trío Clásico (3 Músicos)",
    musicos: 3,
    price: 550,
    hasEdwin: false,
    desc: "El formato más popular: trompeta, guitarra y vihuela.",
  },
  {
    id: "cuarteto",
    label: "Cuarteto Imperial (4 Músicos)",
    musicos: 4,
    price: 690,
    hasEdwin: false,
    desc: "Sonoridad plena: trompeta, violín, guitarra y guitarrón.",
  },
  {
    id: "quinteto",
    label: "Quinteto Monumental (5 Músicos)",
    musicos: 5,
    price: 850,
    hasEdwin: false,
    desc: "2 violines, trompeta, guitarra y guitarrón de gala.",
  },
  {
    id: "sexteto-edwin",
    label: "⭐ Sexteto de Gala con Edwin Agudelo (6 Músicos)",
    musicos: 6,
    price: 1150,
    hasEdwin: true,
    isHormoziFeatured: true,
    videoUrl: "https://youtu.be/DjJ9hIpPH04?si=WH4XlnSqmlkieRmQ",
    desc: "Edwin Agudelo al frente con ensamble completo: 2 trompetas, 2 violines, vihuela y guitarrón.",
  },
  {
    id: "octeto-edwin",
    label: "Octeto Magistral con Edwin Agudelo (8 Músicos)",
    musicos: 8,
    price: 1650,
    hasEdwin: true,
    videoUrl: "https://youtu.be/DjJ9hIpPH04?si=WH4XlnSqmlkieRmQ",
    desc: "Gran Mariachi de concierto para bodas de lujo, aniversarios y grandes recepciones.",
  },
  {
    id: "sinfonico-edwin",
    label: "Ensamble Real Sinfónico (10-12 Músicos)",
    musicos: 12,
    price: 2450,
    hasEdwin: true,
    videoUrl: "https://youtu.be/DjJ9hIpPH04?si=WH4XlnSqmlkieRmQ",
    desc: "Despliegue total con sección de cuerdas ampliada, trompetas y dirección artística de Edwin Agudelo.",
  },
];

export default function UniversalPricingEngine({
  title = "Diseñador de Espectáculo y Reserva Oficial",
  initialMunicipio = "Chinchón",
  initialOcasion = "cumpleanos-sorpresa",
  userSession,
}: Props) {
  const searchParams = useSearchParams();

  const paramTemp = searchParams.get("temp");
  const paramStep = searchParams.get("step");
  const paramOcasion = searchParams.get("ocasion") || initialOcasion;
  const paramCity = searchParams.get("city") || searchParams.get("municipio") || initialMunicipio;

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(
    resolveLeadTemperature(paramTemp, paramStep)
  );

  // Por defecto: Solista Premium Edwin Agudelo (Índice 0)
  const [formatIndex, setFormatIndex] = useState(0);
  const [selectedOcasionId, setSelectedOcasionId] = useState(paramOcasion);

  const [eventDate, setEventDate] = useState("2026-11-28");
  const [startTime, setStartTime] = useState("17:00");
  const [durationHours, setDurationHours] = useState(1);
  const [street, setStreet] = useState("Plaza Mayor");
  const [number, setNumber] = useState("1");
  const [postalCode, setPostalCode] = useState("28370");
  const [city, setCity] = useState(paramCity);
  const [cityQuery, setCityQuery] = useState(paramCity);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [clientName, setClientName] = useState(userSession?.name || "Cliente Exclusivo");
  const [clientEmail, setClientEmail] = useState(userSession?.email || "cliente@ejemplo.com");
  const [phone, setPhone] = useState("+34659116376");
  const [arrivalNotes, setArrivalNotes] = useState("Sorpresa para el homenajeado");

  const [antiFraudAccepted, setAntiFraudAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ trackingUrl: string; message: string } | null>(null);

  const activeFormat = INTEGRANTES_OPCIONES[formatIndex] || INTEGRANTES_OPCIONES[0];
  const activeOcasion = EVENT_OCCASIONS.find((o) => o.id === selectedOcasionId) || EVENT_OCCASIONS[0];
  const basePrice = activeFormat.price;
  const totalPrice = Math.round(basePrice * (durationHours > 1 ? 1 + (durationHours - 1) * 0.75 : 1));
  const depositPrice = Math.round(totalPrice * 0.5);

  const handleCitySearch = (query: string) => {
    setCityQuery(query);
    setCity(query);
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const allCities = Object.values(MUNICIPIOS_ESPANA).flat();
    const filtered = allCities
      .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
    setCitySuggestions(filtered);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalización no soportada.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await fetch(`[suspicious link removed]{lat}&lon=${lon}`);
          const data = await res.json();
          if (data?.address) {
            setStreet(data.address.road || "Ubicación detectada");
            setNumber(data.address.house_number || "");
            setPostalCode(data.address.postcode || "");
            const detected = data.address.city || data.address.town || data.address.village || "";
            setCity(detected);
            setCityQuery(detected);
          }
        } catch {
          setArrivalNotes((p) => `${p} [GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}]`);
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setGpsLoading(false);
        alert("No se pudo obtener la posición GPS.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!clientName || !clientEmail) {
      setErrorMsg("Nombre y correo son obligatorios.");
      return;
    }

    if (!phone.startsWith("+") || phone.length < 10) {
      setErrorMsg("WhatsApp internacional requerido (+34...)");
      return;
    }

    if (!antiFraudAccepted) {
      setErrorMsg("Debes aceptar la garantía de pago protegido.");
      return;
    }

    setIsSubmitting(true);
    try {
      const notesCompletas = `Ocasión: ${activeOcasion.name} | Formato: ${activeFormat.label} | Pack Hormozi Incluido | Señas: ${arrivalNotes}`;
      const res = await createSecureMariachiBooking({
        userId: userSession?.id,
        userEmail: clientEmail,
        clientName: clientName,
        clientPhone: phone,
        eventAddress: { street, number, postalCode, city, notes: notesCompletas },
        eventDate,
        startTime,
        durationHours,
        format: activeFormat.label,
        acceptsAntiFraudPolicy: antiFraudAccepted,
      });

      if (res.success) {
        setBookingResult({ trackingUrl: res.trackingUrl, message: res.message });
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Error procesando reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="my-8 p-6 md:p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 shadow-2xl text-white">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-widest">
              S-Class Grand Slam Offer
            </span>
            {paramTemp && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                ⚡ {paramTemp.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-black mt-2 text-white">{title}</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Zona oficial: <strong className="text-amber-400">{city}</strong> • {activeOcasion.name}
          </p>
        </div>
        <div className="md:text-right bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase font-bold block">Tarifa Oficial Cerrada</span>
          <span className="text-2xl md:text-3xl font-black text-amber-400">{totalPrice} €</span>
          <span className="text-[10px] text-zinc-400 block mt-0.5">Anticipo Fianza: {depositPrice} € (50%)</span>
        </div>
      </div>

      {/* Pestañas de Progresión */}
      <div className="grid grid-cols-4 gap-2 border-b border-zinc-800 pb-4 mb-6 text-center text-xs font-bold">
        {[
          { step: 1, label: "1. Ensamble y Oferta" },
          { step: 2, label: "2. Coordenadas y Hora" },
          { step: 3, label: "3. Contacto y Señas" },
          { step: 4, label: "4. Reserva Blindada" },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => setCurrentStep(item.step as any)}
            className={`py-2 px-1 rounded-xl transition ${
              currentStep === item.step
                ? "bg-amber-400 text-black font-extrabold shadow-lg"
                : "text-zinc-400 hover:text-white bg-zinc-900/50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {bookingResult ? (
        <div className="p-8 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-amber-400">¡Fecha Blindada y Asignada!</h3>
          <p className="text-sm text-zinc-300 max-w-md mx-auto">
            {activeFormat.label} confirmado para {city}. Despacho oficial y radar en tiempo real activados.
          </p>
          <a
            href={bookingResult.trackingUrl}
            className="inline-block px-8 py-4 rounded-xl bg-amber-400 text-black font-black uppercase text-xs tracking-wider hover:bg-amber-300 transition shadow-xl"
          >
            Abrir Sala de Control y Radar GPS
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500 text-xs text-red-200">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* FASE 1: Oferta Hormozi, Ensambles Expandidos y Ruleta */}
          {currentStep === 1 && (
            <div className="space-y-6">
              
              {/* Bloque Hormozi Grand Slam Offer (Todo Incluido) */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    🎁 Pack Hormozi "Experiencia Legendaria" Incluido de Cortesía (Valorado en 380 €)
                  </span>
                  <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded font-black uppercase">
                    0 € Adicionales
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px] text-zinc-300">
                  <div className="flex items-center gap-2">🌸 <strong>Ramo de Flores</strong> al homenajeado</div>
                  <div className="flex items-center gap-2">🔊 <strong>Sonido Autónomo Pro</strong> Bose/JBL</div>
                  <div className="flex items-center gap-2">✍️ <strong>Dedicatoria Personalizada</strong></div>
                  <div className="flex items-center gap-2">📸 <strong>Sesión de Fotos Email HD</strong> (sin compresión)</div>
                  <div className="flex items-center gap-2"><CharroHatIcon size={18} className="text-amber-400 shrink-0" /> <strong>Sombreros Charros de Gala</strong> (Cortesía en sesión)</div>
                  <div className="flex items-center gap-2">🔒 <strong>Exclusividad de Fecha 100%</strong></div>
                </div>
                <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/90 font-medium">
                  🛡️ <strong>Garantía Incondicional de Emoción:</strong> Si el homenajeado no se emociona y la fiesta no vibra como prometemos, <u>solo abonas el 50% de la tarifa</u>.
                </div>
              </div>

              {/* Selector de Integrantes Expandido (Hasta 12 Músicos) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    👥 Formato del Ensamble Musical (De 1 a 12 Músicos)
                  </label>
                  <span className="text-[11px] text-zinc-400">Edwin Agudelo en grupos solo a partir de 6</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {INTEGRANTES_OPCIONES.map((opt, idx) => (
                    <div
                      key={opt.id}
                      onClick={() => setFormatIndex(idx)}
                      className={`p-4 rounded-2xl cursor-pointer border transition relative ${
                        formatIndex === idx
                          ? "bg-amber-400/10 border-amber-400 text-white ring-1 ring-amber-400 shadow-xl"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {opt.isHormoziFeatured && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-amber-400 text-black">
                          Más Vendido
                        </span>
                      )}
                      <div className="flex justify-between items-center pr-20 mb-1">
                        <span className="text-xs font-bold text-white">{opt.label}</span>
                        <span className="text-xs font-black text-amber-400">{opt.price} €</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug mb-2">{opt.desc}</p>
                      
                      {opt.videoUrl && (
                        <a
                          href={opt.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-[10px] text-amber-400 hover:underline font-bold"
                        >
                          ▶️ Ver Vídeo de Muestra Oficial en YouTube
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Ruleta Inercial Apple de Ocasiones */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    🎡 Ruleta Inercial de Ocasiones ({EVENT_OCCASIONS.length} Tipos de Evento)
                  </label>
                  <span className="text-[11px] text-zinc-400">Gira con rueda o dedo</span>
                </div>
                <div className="relative h-44 bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-y-auto snap-y snap-mandatory scroll-smooth p-2 scrollbar-thin">
                  <div className="sticky top-1/2 -translate-y-1/2 pointer-events-none h-10 border-y border-amber-400/60 bg-amber-400/10 rounded-lg" />
                  {EVENT_OCCASIONS.map((ocasion) => (
                    <div
                      key={ocasion.id}
                      onClick={() => setSelectedOcasionId(ocasion.id)}
                      className={`snap-center h-10 flex items-center justify-between px-4 cursor-pointer rounded-lg transition ${
                        selectedOcasionId === ocasion.id
                          ? "text-amber-400 font-extrabold text-sm bg-zinc-800"
                          : "text-zinc-500 hover:text-zinc-300 text-xs"
                      }`}
                    >
                      <span>{ocasion.name}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400">
                        {ocasion.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition shadow-lg"
                >
                  Continuar a Coordenadas y Hora →
                </button>
              </div>
            </div>
          )}

          {/* FASE 2: Coordenadas, Fecha, Hora y Posición GPS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-400">Municipio o Población en España</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsLoading}
                    className="text-[11px] text-amber-400 font-bold hover:underline"
                  >
                    {gpsLoading ? "Detectando..." : "🎯 Usar mi GPS actual"}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={cityQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
                {citySuggestions.length > 0 && (
                  <div className="absolute z-30 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden">
                    {citySuggestions.map((sug) => (
                      <div
                        key={sug}
                        onClick={() => {
                          setCity(sug);
                          setCityQuery(sug);
                          setCitySuggestions([]);
                        }}
                        className="p-2.5 text-xs text-white hover:bg-amber-400 hover:text-black cursor-pointer transition font-semibold"
                      >
                        📍 {sug}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Calle, Avenida o Finca</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Nº / Finca</label>
                  <input
                    type="text"
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
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Hora Inicio (Flexible 24h)</label>
                  <input
                    type="time"
                    step="900"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Duración: <strong className="text-amber-400">{durationHours} hora(s)</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 mt-2 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold"
                >
                  ← Volver a Ensamble
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition"
                >
                  Continuar a Contacto y Señas →
                </button>
              </div>
            </div>
          )}

          {/* FASE 3: Contacto y Señas */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Tu Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Correo Electrónico (para el Radar y Fotos HD)</label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">WhatsApp de Contacto Directo</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  🤫 Señas de Llegada y Modo Sorpresa
                </label>
                <textarea
                  rows={2}
                  value={arrivalNotes}
                  onChange={(e) => setArrivalNotes(e.target.value)}
                  placeholder="Ej: Entrar por el jardín lateral para no arruinar la sorpresa."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold"
                >
                  ← Volver a Coordenadas
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-300 transition"
                >
                  Revisar Resumen y Blindaje →
                </button>
              </div>
            </div>
          )}

          {/* FASE 4: Resumen, Cláusula Antipicaresca y Depósito */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                  <span className="text-zinc-400">Espectáculo / Formato:</span>
                  <span className="font-bold text-white">{activeFormat.label}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                  <span className="text-zinc-400">Ocasión:</span>
                  <span className="font-bold text-amber-300">{activeOcasion.name}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                  <span className="text-zinc-400">Pack Hormozi Incluido:</span>
                  <span className="font-bold text-emerald-400">Flores + Fotos HD + Sombreros + Sonido Pro + Garantía</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                  <span className="text-zinc-400">Fecha y Hora:</span>
                  <span className="font-bold text-white">{eventDate} a las {startTime} ({durationHours} h)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800/60 pb-2">
                  <span className="text-zinc-400">Lugar y Municipio:</span>
                  <span className="font-bold text-white">{street} {number}, {postalCode} {city}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-zinc-300">Depósito Requerido (50%):</span>
                  <span className="text-amber-400">{depositPrice} €</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/90 border border-amber-500/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="antiFraud"
                  checked={antiFraudAccepted}
                  onChange={(e) => setAntiFraudAccepted(e.target.checked)}
                  className="mt-1 accent-amber-400 cursor-pointer"
                />
                <label htmlFor="antiFraud" className="text-[11px] text-zinc-300 leading-relaxed cursor-pointer">
                  <strong className="text-amber-400">PAGO PROTEGIDO Y CERO PAGOS EN MANO:</strong> Acepto el pago oficial asegurado a través de Productora EAR para garantizar la asistencia puntual, el radar en vivo y la fianza de mi show.
                </label>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white text-xs font-bold"
                >
                  ← Editar Datos
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs md:text-sm tracking-widest shadow-xl hover:from-amber-300 hover:to-amber-400 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Asegurando Reserva..." : `Asegurar Fecha con Depósito Protegido (${depositPrice} €)`}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}