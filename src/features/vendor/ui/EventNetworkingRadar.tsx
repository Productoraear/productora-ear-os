'use client';

import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Clock,
  MessageCircle,
  Sparkles,
  Camera,
  Music,
  Wine,
  Flower2,
  ShieldCheck,
} from 'lucide-react';
import { playHapticClick } from '@/lib/audio/AuraAudioSynth';

interface NearbyColleague {
  id: string;
  name: string;
  profession: string;
  category: 'foto' | 'dj' | 'flores' | 'coordinacion' | 'catering';
  venue: string;
  zone: string;
  status: 'hora_muerta' | 'montaje' | 'disponible_relevo';
  statusText: string;
  freeUntil: string;
  phone: string;
  avatar: string;
}

const NEARBY_COLLEAGUES: NearbyColleague[] = [
  {
    id: 'col-1',
    name: 'Carlos Méndez',
    profession: 'Fotografía Editorial & Dron',
    category: 'foto',
    venue: 'Finca Las Tenadas',
    zone: 'Madrid Norte (Algete)',
    status: 'hora_muerta',
    statusText: 'Hora muerta entre cóctel y banquete',
    freeUntil: '1h 15m libre',
    phone: '34659116376',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'col-2',
    name: 'David Ramos (DJ Dave)',
    profession: 'DJ Set & Iluminación Robótica',
    category: 'dj',
    venue: 'Finca El Campillo',
    zone: 'San Lorenzo de El Escorial',
    status: 'montaje',
    statusText: 'Prueba de sonido terminada, esperando apertura',
    freeUntil: 'Disponible hasta 20:30h',
    phone: '34693693048',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'col-3',
    name: 'Lucía Alarcón',
    profession: 'Wedding Planner & Diseño Floral',
    category: 'coordinacion',
    venue: 'Palacio de Galiana',
    zone: 'Toledo Capital',
    status: 'hora_muerta',
    statusText: 'Banquete en marcha bajo cronograma impecable',
    freeUntil: '45 min libres para networking',
    phone: '34693693048',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'col-4',
    name: 'Javier Santos (Maître)',
    profession: 'Coordinador de Finca & Protocolo',
    category: 'catering',
    venue: 'El Olivar de Santa Teresa',
    zone: 'Torrijos / Toledo',
    status: 'disponible_relevo',
    statusText: 'Buscando saxofonista o solista para recena sorpresa',
    freeUntil: 'Presupuesto asignado 350€',
    phone: '34693693048',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
];

export function EventNetworkingRadar() {
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [myStatus, setMyStatus] = useState<'hora_muerta' | 'montaje' | 'relevo'>('hora_muerta');
  const [selectedColleague, setSelectedColleague] = useState<NearbyColleague | null>(null);

  const getCategoryIcon = (cat: NearbyColleague['category']) => {
    switch (cat) {
      case 'foto':
        return <Camera className="w-3.5 h-3.5 text-[#00E5FF]" />;
      case 'dj':
        return <Music className="w-3.5 h-3.5 text-purple-400" />;
      case 'flores':
        return <Flower2 className="w-3.5 h-3.5 text-pink-400" />;
      case 'coordinacion':
        return <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />;
      case 'catering':
        return <Wine className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const handleToggleBroadcast = () => {
    playHapticClick(850, 0.03);
    setIsBroadcasting((prev) => !prev);
  };

  const openWhatsAppConnection = (colleague: NearbyColleague) => {
    playHapticClick(900, 0.04);
    const msg = encodeURIComponent(
      `Hola ${colleague.name}, te he visto en el Radar de Horas Muertas de EAR OS en ${colleague.venue}. Estoy de evento cerca en la misma zona. ¿Te apetece conectar para futuras recomendaciones y alianzas de Split Soberano?`
    );
    window.open(`https://wa.me/${colleague.phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="rounded-3xl bg-[#09090d]/90 border border-[#00E5FF]/20 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,229,255,0.08)]">
      {/* Background Radar Pulse Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#00E5FF]/5 blur-3xl pointer-events-none" />

      {/* Header & Status Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isBroadcasting ? 'bg-[#00E5FF]' : 'bg-zinc-600'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isBroadcasting ? 'bg-[#00E5FF]' : 'bg-zinc-500'}`} />
            </span>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#00E5FF]">
              RADAR DE EVENTOS EN VIVO · HORAS MUERTAS B2B
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
            Networking de Fincas & Horas Muertas
          </h2>
          <p className="text-xs text-white/60 font-light max-w-xl">
            Aprovecha los tiempos de espera entre el cóctel y la recena. Conecta con otros profesionales
            en bodas cercanas para crear alianzas de recomendación y traspaso de bolos.
          </p>
        </div>

        {/* Toggle my presence button */}
        <button
          onClick={handleToggleBroadcast}
          className={`px-4 py-2.5 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 transition-all ${
            isBroadcasting
              ? 'bg-[#00E5FF]/15 border-[#00E5FF]/40 text-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.2)]'
              : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
          }`}
        >
          <Radio className={`w-4 h-4 ${isBroadcasting ? 'animate-pulse' : ''}`} />
          <span>{isBroadcasting ? 'Visible en Radar' : 'Radar Pausado'}</span>
        </button>
      </div>

      {/* Status Selector for My Event */}
      {isBroadcasting && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <span className="text-white/40 text-[11px] uppercase tracking-wider pl-1">Mi Estado Actual:</span>
          {(
            [
              { id: 'hora_muerta', label: '⏳ En Hora Muerta (Disponible)' },
              { id: 'montaje', label: '🛠️ En Montaje / Soundcheck' },
              { id: 'relevo', label: '🚨 Busco / Ofrezco Relevo Urgente' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => {
                playHapticClick(700, 0.02);
                setMyStatus(s.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                myStatus === s.id
                  ? 'bg-[#00E5FF] text-black font-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Nearby Colleagues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEARBY_COLLEAGUES.map((col) => {
          const isSelected = selectedColleague?.id === col.id;
          return (
            <div
              key={col.id}
              onClick={() => setSelectedColleague(col)}
              className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.15)]'
                  : 'bg-[#0c0c12]/90 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={col.avatar}
                    alt={col.name}
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      {getCategoryIcon(col.category)}
                      <h3 className="text-sm font-bold text-white font-syne">{col.name}</h3>
                    </div>
                    <span className="text-xs text-white/60 block">{col.profession}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {col.freeUntil}
                </span>
              </div>

              {/* Location & Status description */}
              <div className="space-y-1.5 text-xs text-white/70">
                <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                  <span className="font-mono text-white/80">{col.venue}</span>
                  <span>·</span>
                  <span>{col.zone}</span>
                </div>
                <p className="text-[11px] text-white/80 font-light italic bg-white/[0.02] p-2 rounded-xl border border-white/5">
                  "{col.statusText}"
                </p>
              </div>

              {/* Connect Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openWhatsAppConnection(col);
                }}
                className="w-full py-2.5 rounded-xl bg-[#00E5FF]/15 hover:bg-[#00E5FF] text-[#00E5FF] hover:text-black border border-[#00E5FF]/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4" /> Conectar por WhatsApp B2B
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust & Split Shield */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-white/40 border-t border-white/10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" /> Red de Confianza EAR OS · Cero Intermediarios
        </span>
        <span>Alianzas y Relevos bajo Split Soberano Pactado</span>
      </div>
    </div>
  );
}

export default EventNetworkingRadar;
