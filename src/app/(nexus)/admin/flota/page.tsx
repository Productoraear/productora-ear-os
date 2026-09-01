'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Truck, 
  MapPin, 
  Users, 
  Radio, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Phone, 
  Layers, 
  Clock, 
  Navigation, 
  Award, 
  Volume2, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Flame,
  Home,
  Heart,
  Check,
  Calendar,
  DollarSign,
  Search
} from 'lucide-react';
import { LiveSonometryGuard } from '@/components/vimume/LiveSonometryGuard';
import { B2GTenderFeedCard } from '@/components/admin/B2GTenderFeedCard';
import { FiturDiplomaticViewer } from '@/components/admin/FiturDiplomaticViewer';
import { 
  matchOptimalArtist, 
  ArtistCandidate, 
  EventDispatchRequirement, 
  MatchResult 
} from '@/lib/dispatch/hungarian-matchmaker';

interface CuadrillaFleetItem {
  id: string;
  name: string;
  leader: string;
  format: 'Solista' | 'Dúo' | 'Trío' | 'Cuarteto' | 'Quinteto' | 'Imperial';
  status: 'EN_RUTA' | 'EN_TARIMA' | 'DISPONIBLE' | 'COMPLETADO';
  venueName: string;
  city: string;
  distanceFromMentridaKm: number;
  eta: string;
  soundSystem: string;
  totalBudgetEuro: number;
  musiciansPayoutEuro: number; // 80%
  contactPhone: string;
}

// Candidatos del Roster Soberano para el Matchmaker Húngaro
const ROSTER_CANDIDATES: ArtistCandidate[] = [
  {
    id: 'ART-01',
    name: 'Edwin Agudelo (Solista de Gala)',
    category: 'solista',
    baseRateEur: 350,
    location: { lat: 40.2372, lng: -4.1953, province: 'Méntrida (Toledo)' }, // Hub Central
    reliabilityScore: 100,
    hasBoseRider: true
  },
  {
    id: 'ART-02',
    name: 'Marco Aurelio / Vihuela & Mariachi',
    category: 'trio',
    baseRateEur: 550,
    location: { lat: 40.4168, lng: -3.7038, province: 'Madrid Capital' },
    reliabilityScore: 96,
    hasBoseRider: true
  },
  {
    id: 'ART-03',
    name: 'Carlos Mendoza / Quinteto Imperial',
    category: 'mariachi',
    baseRateEur: 850,
    location: { lat: 40.1632, lng: -3.8765, province: 'Illescas (Toledo)' },
    reliabilityScore: 94,
    hasBoseRider: true
  },
  {
    id: 'ART-04',
    name: 'Dúo Terapéutico VIMUME',
    category: 'trio',
    baseRateEur: 420,
    location: { lat: 40.3082, lng: -3.7327, province: 'Getafe (Madrid)' },
    reliabilityScore: 98,
    hasBoseRider: true
  }
];

// Eventos entrantes para simular el emparejamiento logístico
const INCOMING_EVENTS: EventDispatchRequirement[] = [
  {
    eventId: 'EVT-FITUR-01',
    eventType: 'institucional_fitur',
    location: { lat: 40.4655, lng: -3.6186 }, // IFEMA Madrid
    budgetEur: 14250,
    requiresBoseRider: true
  },
  {
    eventId: 'EVT-BODA-REGAJAL',
    eventType: 'boda',
    location: { lat: 40.0333, lng: -3.6000 }, // Aranjuez
    budgetEur: 750,
    requiresBoseRider: true
  },
  {
    eventId: 'EVT-CONCIERTO-MORALEJA',
    eventType: 'concierto',
    location: { lat: 40.5186, lng: -3.6492 }, // Alcobendas
    budgetEur: 1200,
    requiresBoseRider: true
  }
];

export default function AdminFlotaPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'FLEET' | 'MATCHMAKER' | 'SONOMETRY' | 'B2G' | 'FITUR'>('FLEET');
  
  // Estado para el Matchmaker interactivo (Tinder + Uber)
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [assignedMessage, setAssignedMessage] = useState<string | null>(null);

  // Cuadrillas activas de la flota EAR OS
  const [cuadrillas] = useState<CuadrillaFleetItem[]>([
    {
      id: 'FL-001',
      name: 'Cuadrilla 1 — Solista de Gala',
      leader: 'Edwin Agudelo',
      format: 'Solista',
      status: 'EN_RUTA',
      venueName: 'Finca El Regajal',
      city: 'Aranjuez (Madrid)',
      distanceFromMentridaKm: 65,
      eta: '18:30 (En Hora)',
      soundSystem: 'Bose F1 Model 812 + Shure Beta 87A',
      totalBudgetEuro: 372.50,
      musiciansPayoutEuro: 298.00, // 80%
      contactPhone: '+34 693 693 048'
    },
    {
      id: 'FL-002',
      name: 'Cuadrilla 2 — Trío Tradicional',
      leader: 'Marco Aurelio / Vihuela',
      format: 'Trío',
      status: 'EN_TARIMA',
      venueName: 'Hotel Santo Mauro',
      city: 'Madrid Capital',
      distanceFromMentridaKm: 52,
      eta: 'En Tarima (Finaliza 21:15)',
      soundSystem: 'Bose F1 Model 812 Array',
      totalBudgetEuro: 603.00,
      musiciansPayoutEuro: 482.40, // 80%
      contactPhone: '+34 611 223 344'
    },
    {
      id: 'FL-003',
      name: 'Cuadrilla 3 — Quinteto Imperial',
      leader: 'Carlos Mendoza / Trompeta',
      format: 'Quinteto',
      status: 'DISPONIBLE',
      venueName: 'Base de Operaciones',
      city: 'Méntrida (Toledo)',
      distanceFromMentridaKm: 0,
      eta: 'Listo para despacho inmediato',
      soundSystem: 'Bose F1 812 + Subwoofer Array',
      totalBudgetEuro: 900.00,
      musiciansPayoutEuro: 720.00, // 80%
      contactPhone: '+34 622 334 455'
    },
    {
      id: 'FL-004',
      name: 'Cuadrilla 4 — Ensamble VIMUME',
      leader: 'Dúo Terapéutico VIMUME',
      format: 'Dúo',
      status: 'COMPLETADO',
      venueName: 'Residencia Los Nogales',
      city: 'Madrid (Distrito Centro)',
      distanceFromMentridaKm: 48,
      eta: 'Bolo Finalizado con Éxito (<75 dB)',
      soundSystem: 'Bose S1 Pro Compact (Atenuado)',
      totalBudgetEuro: 480.00,
      musiciansPayoutEuro: 384.00, // 80%
      contactPhone: '+34 633 445 566'
    }
  ]);

  // Métricas Consolidadas de la Flota
  const totalActiveGigs = cuadrillas.filter(c => c.status === 'EN_RUTA' || c.status === 'EN_TARIMA').length;
  const totalFleetRevenue = cuadrillas.reduce((acc, c) => acc + c.totalBudgetEuro, 0);
  const totalMusiciansPayout = cuadrillas.reduce((acc, c) => acc + c.musiciansPayoutEuro, 0); // 80%
  const totalEarInfrastructure = totalFleetRevenue * 0.10;
  const totalVimumeFund = totalFleetRevenue * 0.10;

  const filteredCuadrillas = cuadrillas.filter(c => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  // Ejecución en tiempo real del Matchmaker Húngaro para el evento seleccionado
  const currentEvent = INCOMING_EVENTS[selectedEventIndex];
  const optimalMatch: MatchResult | null = useMemo(() => {
    return matchOptimalArtist(currentEvent, ROSTER_CANDIDATES);
  }, [currentEvent]);

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* 1. HEADER INTEGRAL S-CLASS: UBER + TINDER + AIRBNB + BODAS.NET */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0a0a10] via-[#12121c] to-[#0a0a10] border border-[#ecb613]/30 p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Uber Fleet Dispatch
              </span>
              <span className="px-3 py-1 bg-purple-950/80 text-purple-300 border border-purple-500/30 rounded-full text-xs font-mono flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" /> Tinder Matchmaker (Munkres)
              </span>
              <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-emerald-400" /> Airbnb 80/10/10 Escrow
              </span>
              <span className="px-3 py-1 bg-blue-950/80 text-blue-300 border border-blue-500/30 rounded-full text-xs font-mono flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-400" /> Bodas & FITUR B2G
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-serif">
              Centro de Mando Logístico & Despacho Soberano
            </h1>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Fusión de geolocalización en tiempo real, emparejamiento algorítmico determinista (Haversine),
              retención de pagos Hold & Ping (100 €) y liquidación de contratos públicos (Art. 118 LCSP).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/checkout/presupuesto"
              className="py-3 px-5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Nuevo Despacho S-Class
            </Link>
          </div>
        </div>
      </div>

      {/* 2. TARJETAS DE MÉTRICAS OPERATIVAS (AIRBNB ESCROW LEDGER) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Cuadrillas Activas</span>
          <div className="text-3xl font-black text-white font-mono">{totalActiveGigs} / {cuadrillas.length}</div>
          <span className="text-[10px] text-emerald-400 font-mono">100% puntualidad y geolocalización</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Facturación Flota</span>
          <div className="text-3xl font-black text-[#ecb613] font-mono">
            {totalFleetRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-gray-400 font-mono">4 eventos ejecutados hoy</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Split Artistas (80% Neto)</span>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {totalMusiciansPayout.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Liquidación soberana garantizada</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#09090d] border border-white/10 space-y-1">
          <span className="text-[11px] font-mono text-gray-400 uppercase">Fondo EAR (10%) + VIMUME (10%)</span>
          <div className="text-3xl font-black text-[#258DCD] font-mono">
            {(totalEarInfrastructure + totalVimumeFund).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <span className="text-[10px] text-blue-300 font-mono">Infraestructura & Terapias Clínicas</span>
        </div>
      </div>

      {/* 3. PESTAÑAS DE VANGUARDIA */}
      <div className="flex border-b border-white/10 gap-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('FLEET')}
          className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'FLEET'
              ? 'text-[#ecb613] border-[#ecb613]'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          🚗 Flota & Cuadrillas ({cuadrillas.length})
        </button>

        <button
          onClick={() => setActiveTab('MATCHMAKER')}
          className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'MATCHMAKER'
              ? 'text-purple-400 border-purple-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          🔥 Matchmaker Munkres (Tinder B2B)
        </button>

        <button
          onClick={() => setActiveTab('FITUR')}
          className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'FITUR'
              ? 'text-amber-400 border-amber-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          🌍 FITUR 2026 · Embajadores Culturales (217)
        </button>

        <button
          onClick={() => setActiveTab('SONOMETRY')}
          className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'SONOMETRY'
              ? 'text-emerald-400 border-emerald-400'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          🔊 Telemetría Acústica & Sonometría
        </button>

        <button
          onClick={() => setActiveTab('B2G')}
          className={`pb-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'B2G'
              ? 'text-[#ecb613] border-[#ecb613]'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
        >
          🏛️ Licitaciones B2G · PLACSP
        </button>
      </div>

      {/* 4. CONTENIDOS DINÁMICOS POR PESTAÑA */}

      {/* PESTAÑA 1: UBER FLEET COMMAND */}
      {activeTab === 'FLEET' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {['ALL', 'EN_RUTA', 'EN_TARIMA', 'DISPONIBLE', 'COMPLETADO'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-[#ecb613] text-black font-bold shadow-md'
                      : 'bg-[#0e0e14] border border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-mono">
              Tarifa km logístico: 1,50 €/km (desde Méntrida, km &gt; 50)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCuadrillas.map((c) => (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-[#09090f] border border-white/10 hover:border-[#ecb613]/40 transition-all space-y-4 relative group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-[#ecb613] font-bold">{c.id} · {c.format}</span>
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ecb613] transition-colors">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">Líder: {c.leader}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                    c.status === 'EN_RUTA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    c.status === 'EN_TARIMA' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse' :
                    c.status === 'DISPONIBLE' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-gray-800 text-gray-400'
                  }`}>
                    ● {c.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#050508] border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-[#ecb613]" /> Destino:
                    </span>
                    <span className="font-bold text-white">{c.venueName} ({c.city})</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Navigation className="w-3.5 h-3.5 text-blue-400" /> Distancia Hub:
                    </span>
                    <span className="font-mono text-white">{c.distanceFromMentridaKm} km</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> ETA:
                    </span>
                    <span className="font-mono text-amber-300 font-bold">{c.eta}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Rider Acústico:
                    </span>
                    <span className="font-mono text-purple-300 text-[11px]">{c.soundSystem}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono">BOLO TOTAL</span>
                    <span className="text-base font-bold font-mono text-white">{c.totalBudgetEuro.toFixed(2)} €</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 block font-mono">SPLIT MÚSICOS (80%)</span>
                    <span className="text-base font-bold font-mono text-emerald-400">{c.musiciansPayoutEuro.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`https://wa.me/${c.contactPhone.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(c.leader)},%20te%20enviamos%20la%20hoja%20de%20ruta%20para%20${encodeURIComponent(c.venueName)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                  >
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Cuadrilla
                  </a>

                  <button
                    onClick={() => alert(`Hoja de ruta digital re-emitida y certificada para ${c.name}`)}
                    className="py-2.5 px-3 rounded-xl bg-[#14141e] hover:bg-[#1e1e2c] border border-white/10 text-gray-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#ecb613]" /> Hoja de Ruta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 2: TINDER MATCHMAKER (ALGORITMO HÚNGARO DE MUNKRES) */}
      {activeTab === 'MATCHMAKER' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#0e0e18] to-purple-950/20 border border-purple-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-xs font-mono font-bold uppercase mb-2">
                  <Zap size={14} /> Algoritmo Húngaro (Munkres) + Haversine Geodésico
                </div>
                <h2 className="text-2xl font-bold text-white font-syne">
                  Simulador de Emparejamiento B2B en Tiempo Real
                </h2>
                <p className="text-xs text-gray-400 max-w-2xl">
                  Cruza la posición geodésica del evento, el caché base y la certificación del rider Bose F1
                  para encontrar el artista con mayor compatibilidad matemática.
                </p>
              </div>

              {/* Selector de Evento */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">Evento:</span>
                <select
                  value={selectedEventIndex}
                  onChange={(e) => {
                    setSelectedEventIndex(Number(e.target.value));
                    setAssignedMessage(null);
                  }}
                  aria-label="Seleccionar evento para emparejamiento"
                  className="px-3 py-2 rounded-xl bg-[#09090f] border border-purple-500/30 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                >
                  <option value={0}>🏛️ FITUR IFEMA Madrid (14.250 €)</option>
                  <option value={1}>💍 Boda Finca El Regajal (750 €)</option>
                  <option value={2}>🎙️ Concierto Privado La Moraleja (1.200 €)</option>
                </select>
              </div>
            </div>

            {/* Tarjeta de Match Result (Estilo Tinder + Airbnb) */}
            {optimalMatch ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-purple-500/20">
                {/* Visual Match Card */}
                <div className="p-6 rounded-2xl bg-[#07070c] border border-purple-500/40 relative overflow-hidden flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-purple-300">Candidato Óptimo</span>
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white font-mono font-bold text-xs shadow-lg shadow-purple-600/30 animate-pulse">
                      🔥 {optimalMatch.dispatchScore}% Match
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white font-serif">
                      {optimalMatch.assignedArtist.name}
                    </h3>
                    <p className="text-xs font-mono text-purple-300 mt-1">
                      {optimalMatch.assignedArtist.location.province} · {optimalMatch.distanceKm} km del evento
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fiabilidad Escénica:</span>
                      <span className="text-emerald-400 font-bold">{optimalMatch.assignedArtist.reliabilityScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rider Acústico Bose:</span>
                      <span className="text-emerald-400 font-bold">✓ Homologado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Coste Kilometraje:</span>
                      <span className="text-amber-400 font-bold">{optimalMatch.travelCostEur.toFixed(2)} €</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setAssignedMessage(`¡Bolo ${currentEvent.eventId} asignado con éxito a ${optimalMatch.assignedArtist.name}!`)}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold uppercase transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Asignar y Notificar Artista
                  </button>
                </div>

                {/* Desglose Económico Soberano (Airbnb Ledger) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#07070c] border border-white/10 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-white">Liquidación de Escrow Soberano (80/10/10)</h4>
                      <p className="text-xs text-gray-400 font-mono">Presupuesto del Evento: {currentEvent.budgetEur.toLocaleString('es-ES')} €</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs rounded-full">
                      Price-Lock SHA-256 Validado
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">Artista (80%)</span>
                      <div className="text-2xl font-black text-white font-mono">
                        {optimalMatch.split80_10_10.artist.toLocaleString('es-ES')} €
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono">Dignificación pura</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                      <span className="text-[10px] font-mono text-[#ecb613] uppercase">EAR OS (10%)</span>
                      <div className="text-2xl font-black text-[#ecb613] font-mono">
                        {optimalMatch.split80_10_10.earOs.toLocaleString('es-ES')} €
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono">Margen de plataforma</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                      <span className="text-[10px] font-mono text-blue-400 uppercase">VIMUME (10%)</span>
                      <div className="text-2xl font-black text-blue-400 font-mono">
                        {optimalMatch.split80_10_10.vimume.toLocaleString('es-ES')} €
                      </div>
                      <span className="text-[9px] text-gray-500 font-mono">Fondo Musicoterapia</span>
                    </div>
                  </div>

                  {assignedMessage && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{assignedMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 font-mono text-xs">
                No se encontraron candidatos con rider acústico que se ajusten al presupuesto.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: FITUR 2026 · EMBAJADORES CULTURALES (217 DESPACHOS) */}
      {activeTab === 'FITUR' && (
        <div className="space-y-6">
          <FiturDiplomaticViewer />
        </div>
      )}

      {/* PESTAÑA 4: SONOMETRÍA Y TELEMETRÍA EN VIVO */}
      {activeTab === 'SONOMETRY' && (
        <div className="space-y-6">
          <LiveSonometryGuard />
        </div>
      )}

      {/* PESTAÑA 5: LICITACIONES B2G · PLACSP */}
      {activeTab === 'B2G' && (
        <div className="space-y-6">
          <B2GTenderFeedCard />
        </div>
      )}
    </div>
  );
}
