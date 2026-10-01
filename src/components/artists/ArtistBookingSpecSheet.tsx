'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Volume2,
  Sparkles,
  ShieldCheck,
  Lock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import ArtistAvailabilityCalendar from './ArtistAvailabilityCalendar';

interface ArtistBookingSpecSheetProps {
  artistId: string;
  artistName: string;
  artistProvince: string;
  basePrice: number;
  slug?: string;
  onClose?: () => void;
}

const SHOW_FORMATS = [
  { id: 'solista', name: 'Solista Acústico / Dúo', members: '1 - 2 pax', multiplier: 1.0, desc: 'Íntimo con pistas master y sonido Bose F1 / S1 Pro.' },
  { id: 'agrupacion_4', name: 'Agrupación Reducida', members: '3 - 5 pax', multiplier: 1.7, desc: 'Instrumentación en directo con armonía y percusión viva.' },
  { id: 'banda_completa', name: 'Formato Completo de Gala', members: '6 - 9 pax', multiplier: 2.5, desc: 'Despliegue escénico completo, metales y cuerdas de concierto.' },
  { id: 'gran_ensamble', name: 'Gran Ensamble Monumental', members: '10 - 13+ pax', multiplier: 3.7, desc: 'Máxima solemnidad para grandes eventos y protocolo de élite.' }
];

const TIME_SLOTS = [
  { id: 'ceremonia', label: 'Ceremonia Religiosa / Civil', duration: '45 - 60 min', supplement: 0 },
  { id: 'coctel', label: 'Cóctel de Bienvenida', duration: '60 - 90 min', supplement: 50 },
  { id: 'banquete', label: 'Banquete & Sobremesa', duration: '60 min', supplement: 50 },
  { id: 'barra_libre', label: 'Fiesta & Barra Libre', duration: '120 - 180 min', supplement: 150 },
  { id: 'jornada_doble', label: 'Pase Doble (Cóctel + Barra Libre)', duration: 'Doble pase (60+90 min)', supplement: 250 }
];

const EVENT_TYPES = [
  { id: 'boda', label: 'Boda S-Class Diamond', icon: '💍' },
  { id: 'aniversario', label: 'Aniversario / Fiesta Privada', icon: '🎉' },
  { id: 'corporativo', label: 'Gala Corporativa / Empresa', icon: '💼' },
  { id: 'publico', label: 'Festejo Público / B2G (Art. 118)', icon: '🏛️' }
];

const PAX_RANGES = [
  { id: 'pax_50', label: '< 50 invitados (Íntimo)', pax: 40, factorW: 12 },
  { id: 'pax_150', label: '50 - 150 invitados (Estándar)', pax: 100, factorW: 12 },
  { id: 'pax_300', label: '150 - 300 invitados (Gran Gala)', pax: 220, factorW: 18 },
  { id: 'pax_max', label: '> 300 invitados (Macroevento)', pax: 400, factorW: 18 }
];

const ACOUSTIC_RIDERS = [
  { id: 'interior', label: 'Interior / Salón Acústico', dba: '80 - 85 dBA', rider: 'Bose F1 Model 812 (12 W/pax)' },
  { id: 'exterior', label: 'Exterior / Finca Jardines', dba: '85 - 90 dBA', rider: 'Bose F1 Dual + Subs (18 W/pax)' },
  { id: 'plaza', label: 'Plaza Pública / Escenario Abierto', dba: '90 - 102 dBA', rider: 'Sistema Line Array + Limitador Telemático' }
];

export default function ArtistBookingSpecSheet({
  artistId,
  artistName,
  artistProvince,
  basePrice = 350,
  slug,
  onClose
}: ArtistBookingSpecSheetProps) {
  // 1. Estados de contratación específicos
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState(SHOW_FORMATS[0].id);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1].id); // Cóctel por defecto
  const [selectedEventType, setSelectedEventType] = useState(EVENT_TYPES[0].id); // Boda
  const [selectedPax, setSelectedPax] = useState(PAX_RANGES[1].id); // 50-150 pax
  const [selectedAcoustic, setSelectedAcoustic] = useState(ACOUSTIC_RIDERS[0].id); // Interior
  const [eventMunicipality, setEventMunicipality] = useState(artistProvince || 'Madrid');
  const [distanceKm, setDistanceKm] = useState(35);
  const [finHoraTardia, setFinHoraTardia] = useState(false);
  const [necesitaMicroDiscurso, setNecesitaMicroDiscurso] = useState(true);
  const [temaPersonalizado, setTemaPersonalizado] = useState('');

  // 2. Cálculos económicos SSOT S-Class
  const formatObj = SHOW_FORMATS.find((f) => f.id === selectedFormat) || SHOW_FORMATS[0];
  const timeSlotObj = TIME_SLOTS.find((t) => t.id === selectedTimeSlot) || TIME_SLOTS[0];
  const acousticObj = ACOUSTIC_RIDERS.find((a) => a.id === selectedAcoustic) || ACOUSTIC_RIDERS[0];
  const paxObj = PAX_RANGES.find((p) => p.id === selectedPax) || PAX_RANGES[0];

  // Tarifa artística base ajustada por formato y pase
  const tarifaArtistica = Math.round(basePrice * formatObj.multiplier) + timeSlotObj.supplement;

  // Logística S-Class: 50 km de cortesía; 1,50 €/km adicional
  const kmFacturables = Math.max(0, distanceKm - 50);
  const costeKm = kmFacturables * 1.5;
  const suplementoHotel = (distanceKm > 200 || finHoraTardia) ? 120 : 0;
  const totalLogistica = costeKm + suplementoHotel;

  // Total Presupuesto
  const totalNeto = tarifaArtistica + totalLogistica;
  const iva = totalNeto * 0.21;
  const totalPresupuesto = totalNeto + iva;

  // Split Soberano 80/10/10
  const splitArtista = tarifaArtistica * 0.8;
  const splitEarOs = tarifaArtistica * 0.1;
  const splitVimume = tarifaArtistica * 0.1;

  // Mensaje para WhatsApp Directo
  const whatsappText = useMemo(() => {
    const lines = [
      `¡Hola Edwin! Deseo coordinar la contratación oficial del artista *${artistName}* con la siguiente especificación técnica:`,
      ``,
      `📅 *Fecha Seleccionada:* ${selectedDate || 'Por definir con el artista'}`,
      `🎭 *Formato:* ${formatObj.name} (${formatObj.members})`,
      `⏰ *Franja Horaria:* ${timeSlotObj.label} (${timeSlotObj.duration})`,
      `🥂 *Tipo de Evento:* ${EVENT_TYPES.find((e) => e.id === selectedEventType)?.label}`,
      `👥 *Aforo Estimado:* ${paxObj.label}`,
      `🔊 *Presión Acústica:* ${acousticObj.label} (${acousticObj.dba})`,
      `📍 *Ubicación:* ${eventMunicipality} (${distanceKm} km)`,
      temaPersonalizado ? `🎵 *Tema Especial Solicitado:* ${temaPersonalizado}` : null,
      ``,
      `💶 *Presupuesto Estimado:* ${totalPresupuesto.toFixed(2)} € (IVA incl.)`,
      `🔒 *Bloqueo de Fecha:* 100,00 € en Stripe (Price-Lock SHA-256)`,
      `🤝 *Split Soberano Aplicado:* 80% Artista / 10% EAR OS / 10% VIMUME`,
      ``,
      `Por favor confirmadme disponibilidad final para formalizar el cierre.`
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  }, [
    artistName,
    selectedDate,
    formatObj,
    timeSlotObj,
    selectedEventType,
    paxObj,
    acousticObj,
    eventMunicipality,
    distanceKm,
    temaPersonalizado,
    totalPresupuesto
  ]);

  return (
    <div className="w-full bg-[#050508] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 font-sans space-y-8">
      {/* CABECERA DE CONTRATACIÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider mb-1 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Ficha de Contratación Homologada · EAR OS S-Class</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase">
            Contratar a <span className="text-[#ecb613]">{artistName}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {artistProvince} · Base homologada desde {basePrice} € · Split Soberano 80/10/10
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Reserva con solo 100 €</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 1: CALENDARIO DE DISPONIBILIDAD Y BLOQUEO DE FECHAS
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-[#ecb613]" />
            <span>1. Fecha del Evento & Calendario en Tiempo Real</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {selectedDate ? `Seleccionada: ${selectedDate}` : 'Haz clic en un día disponible para bloquear'}
          </span>
        </div>

        <ArtistAvailabilityCalendar
          artistId={artistId}
          artistName={artistName}
          selectedDate={selectedDate}
          onSelectDate={(date) => setSelectedDate(date)}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 2: FORMATO DEL SHOW & TAMAÑO DE LA FORMACIÓN
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <label className="text-xs font-mono text-slate-300 uppercase font-bold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#ecb613]" />
          <span>2. Formato Escénico & Integrantes</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {SHOW_FORMATS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            const cost = Math.round(basePrice * fmt.multiplier);
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#ecb613]/15 border-[#ecb613] shadow-[0_0_15px_rgba(236,182,19,0.25)]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-white font-syne uppercase">{fmt.name}</span>
                    <span className="text-[10px] text-[#ecb613] font-bold">{fmt.members}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-tight">{fmt.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 text-right">
                  <span className="text-xs font-black text-[#ecb613]">~{cost} €</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 3: FRANJA HORARIA, TIPO DE EVENTO Y AFORO
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80 font-mono text-xs">
        {/* FRANJA HORARIA */}
        <div className="space-y-2">
          <label className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>3. Franja Horaria</span>
          </label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          >
            {TIME_SLOTS.map((ts) => (
              <option key={ts.id} value={ts.id}>
                {ts.label} ({ts.duration})
              </option>
            ))}
          </select>
        </div>

        {/* TIPO DE EVENTO */}
        <div className="space-y-2">
          <label className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>4. Tipo de Celebración</span>
          </label>
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          >
            {EVENT_TYPES.map((et) => (
              <option key={et.id} value={et.id}>
                {et.icon} {et.label}
              </option>
            ))}
          </select>
        </div>

        {/* AFORO ESTIMADO */}
        <div className="space-y-2">
          <label className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>5. Aforo Estimado (Pax)</span>
          </label>
          <select
            value={selectedPax}
            onChange={(e) => setSelectedPax(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          >
            {PAX_RANGES.map((pr) => (
              <option key={pr.id} value={pr.id}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 4: ACÚSTICA, PRESIÓN SONORA Y LOGÍSTICA KM 0
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 font-mono text-xs">
        {/* RIDER ACÚSTICO LEY 37/2003 */}
        <div className="space-y-2">
          <label className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>6. Rider Acústico & Espacio (Ley 37/2003)</span>
          </label>
          <select
            value={selectedAcoustic}
            onChange={(e) => setSelectedAcoustic(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          >
            {ACOUSTIC_RIDERS.map((ar) => (
              <option key={ar.id} value={ar.id}>
                {ar.label} · {ar.dba}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-slate-500 block">
            Equipamiento sugerido: {acousticObj.rider}
          </span>
        </div>

        {/* LOGÍSTICA Y KILOMETRAJE */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-slate-300 uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ecb613]" />
              <span>7. Logística Km 0 (Distancia)</span>
            </label>
            <span className="text-[#ecb613] font-bold">{distanceKm} km</span>
          </div>
          <input
            type="range"
            min={0}
            max={350}
            step={5}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full accent-[#ecb613] bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0 km (Radio local)</span>
            <span>50 km (Cortesía incl.)</span>
            <span>+50 km (1,50 €/km)</span>
          </div>
        </div>
      </div>

      {/* EXTRAS Y PERSONALIZACIÓN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 font-mono text-xs">
        <div className="space-y-1.5">
          <label className="text-slate-400 uppercase text-[11px] block">
            Canción Especial / Vals Nupcial Personalizado
          </label>
          <input
            type="text"
            value={temaPersonalizado}
            onChange={(e) => setTemaPersonalizado(e.target.value)}
            placeholder="Ej: Si nos dejan, Bésame mucho, Vals Vienés..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ecb613]"
          />
        </div>

        <div className="flex flex-col justify-end space-y-2">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
            <input
              type="checkbox"
              checked={necesitaMicroDiscurso}
              onChange={(e) => setNecesitaMicroDiscurso(e.target.checked)}
              className="accent-[#ecb613] w-4 h-4 rounded"
            />
            <span>Incluir microfonía inalámbrica Shure Beta para discursos</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-xs">
            <input
              type="checkbox"
              checked={finHoraTardia}
              onChange={(e) => setFinHoraTardia(e.target.checked)}
              className="accent-[#ecb613] w-4 h-4 rounded"
            />
            <span>Hora de finalización después de las 03:00 AM (+120 € hotel)</span>
          </label>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 5: DESGLOSE ECONÓMICO TRANSPARENTE & SPLIT SOBERANO 80/10/10
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="p-5 rounded-2xl bg-black/60 border border-[#ecb613]/40 space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <span className="font-bold text-white uppercase flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#ecb613]" />
            <span>Desglose Económico Transparente (Split Soberano 80/10/10)</span>
          </span>
          <span className="text-[#ecb613] font-bold text-sm">
            Total Estimado: {totalPresupuesto.toFixed(2)} €
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] pt-1">
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">80% Artista Neto</span>
            <span className="font-bold text-white">{splitArtista.toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">10% EAR OS Telemetría</span>
            <span className="font-bold text-white">{splitEarOs.toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">10% VIMUME (Deducible)</span>
            <span className="font-bold text-emerald-400">{splitVimume.toFixed(2)} €</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Logística Km + Hotel</span>
            <span className="font-bold text-[#ecb613]">{totalLogistica.toFixed(2)} €</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
          <span>* Aportación a VIMUME genera certificado de donación deducible hasta el 80% (Ley 49/2002).</span>
          <span className="text-emerald-400 font-bold">Depósito de Cierre: 100,00 € en Stripe</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN 6: BOTONES DE ACCIÓN Y CIERRE INMEDIATO
         ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 font-mono">
        <a
          href={`/checkout/presupuesto?artista=${encodeURIComponent(artistName)}&fecha=${selectedDate || ''}&formato=${selectedFormat}&precio=${totalPresupuesto.toFixed(0)}`}
          className="flex-1 bg-[#ecb613] hover:bg-white text-black font-black uppercase text-xs py-4 px-6 rounded-2xl text-center transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.3)]"
        >
          <Lock className="w-4 h-4 fill-black" />
          <span>Bloquear Fecha con 100 € en Stripe</span>
        </a>

        <a
          href={`https://wa.me/34693693048?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-[#25D366] hover:bg-emerald-400 text-black font-extrabold uppercase text-xs py-4 px-6 rounded-2xl text-center transition flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageSquare className="w-4 h-4 fill-black" />
          <span>Enviar Especificación por WhatsApp</span>
        </a>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-2xl border border-slate-700 transition"
          >
            Cerrar Ficha
          </button>
        )}
      </div>
    </div>
  );
}
