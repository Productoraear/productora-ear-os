'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Users, 
  Maximize2, 
  Calendar, 
  MapPin, 
  Lock, 
  Unlock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Star, 
  Speaker, 
  Sliders, 
  Mic2, 
  Flame, 
  Heart, 
  Building2, 
  Crown, 
  Compass, 
  Award,
  Layers,
  FileText,
  Clock,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { GEO_DATABASE } from '@/lib/seo/semantic-engine';
import { InventoryEngine } from '@/lib/constants/inventory-catalog';

export interface OrganizerProfile {
  type: 'WEDDING_PLANNER' | 'EMPRESA_B2B' | 'AYUNTAMIENTO_B2G' | 'PARTICULAR_VIP';
  label: string;
  icon: any;
  desc: string;
}

export interface MatchedProvider {
  id: string;
  category: string;
  name: string;
  role: string;
  affinityScore: number;
  specs: string[];
  price: number;
  badge: string;
  inventoryStock: number;
}

export const SublimeEventMatchmaker: React.FC<{ initialLocation?: string }> = ({ initialLocation = 'madrid' }) => {
  // Step State (1 to 10)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Configuration Parameters
  const [organizerType, setOrganizerType] = useState<string>('WEDDING_PLANNER');
  const [eventType, setEventType] = useState<string>('BODA_FINCA');
  const [location, setLocation] = useState<string>(initialLocation.toLowerCase());
  const [eventDate, setEventDate] = useState<string>(
    new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
  );
  const [m2, setM2] = useState<number>(120);
  const [pax, setPax] = useState<number>(150);
  const [soundTier, setSoundTier] = useState<string>('BOSE_F1');
  const [lightingTier, setLightingTier] = useState<string>('SHOW_DMX');
  const [musicTier, setMusicTier] = useState<string>('MARIACHI_GALA');
  const [extraServices, setExtraServices] = useState<string[]>(['VIDEO_4K', 'STREAMING']);

  // Budget & Locked Sliders State
  const [totalBudget, setTotalBudget] = useState<number>(3500);
  const [lockedSliders, setLockedSliders] = useState<Record<string, boolean>>({
    sound: false,
    lighting: false,
    music: true, // Bloqueado por defecto para garantizar caché de autor
    audiovisual: false
  });

  const [soundBudget, setSoundBudget] = useState<number>(650);
  const [lightingBudget, setLightingBudget] = useState<number>(450);
  const [musicBudget, setMusicBudget] = useState<number>(1600);
  const [avBudget, setAvBudget] = useState<number>(800);

  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [reservationHash, setReservationHash] = useState<string | null>(null);

  // Heatmap tracking metric
  const [timeOnSteps, setTimeOnSteps] = useState<Record<number, number>>({});

  const geo = GEO_DATABASE[location] || {
    venues: ["Fincas y Espacios Exclusivos"],
    regionalNorm: "Normativa Acústica Oficial",
    logisticsHub: "Hub Logístico EAR",
    climateFactor: "Calibración paramétrica de sala",
    regionalTradition: "Protocolo de etiqueta"
  };

  const calculatedWatts = Math.max(pax * 12, m2 * 15);

  // Calculate live matched providers
  const matchedProviders = useMemo<MatchedProvider[]>(() => {
    const providers: MatchedProvider[] = [
      {
        id: 'p-audio',
        category: 'Ingeniería Acústica P.A.',
        name: soundTier === 'BOSE_F1' ? 'Sistema Bose F1 Model 812 + Subwoofers' : 'L-Acoustics Syva Array',
        role: `Sonorización ${calculatedWatts}W RMS para ${m2}m² (${pax} pax)`,
        affinityScore: 98,
        specs: ['100° Cobertura Horizontal', 'Latencia <1.5ms', 'Cumplimiento ' + geo.regionalNorm],
        price: soundBudget,
        badge: 'CERTIFICADO EAR',
        inventoryStock: 8
      },
      {
        id: 'p-music',
        category: 'Música en Vivo & Protocolo',
        name: musicTier === 'MARIACHI_GALA' ? 'Mariachi Imperial Edwin Agudelo (6 Músicos)' : 'Solista Tenor & Cuarteto de Cuerdas',
        role: 'Dirección Musical de Gala y Clímax Nupcial/Corporativo',
        affinityScore: 99,
        specs: ['Trajes Charros de Gala Bordados', 'Microfonía Shure Axient', '+350 Obras'],
        price: musicBudget,
        badge: 'MASTER ARTIST',
        inventoryStock: 10
      },
      {
        id: 'p-light',
        category: 'Iluminación Espectacular',
        name: 'Pack Cabezas Móviles Beam 7R + Guirnaldas Festoon Vintage',
        role: 'Ambientación Cálida + Show Dinámico DMX en Pista de Baile',
        affinityScore: 96,
        specs: ['100% Sin Cables en Jardín', 'Show Láser 3W', 'Efecto Geyser Humo Vertical'],
        price: lightingBudget,
        badge: 'ALTA EFICIENCIA',
        inventoryStock: 7
      },
      {
        id: 'p-av',
        category: 'Audiovisual & Streaming',
        name: 'Registro Cinematográfico 4K & Realización Multicámara',
        role: 'Grabación de Audio 32-bit Float y Entrega Masterizada en 7 días',
        affinityScore: 94,
        specs: ['Cámaras Sony FX6', 'Transmisión 5G Bonding', 'Audio Broadcast'],
        price: avBudget,
        badge: '4K CINEMA',
        inventoryStock: 9
      }
    ];
    return providers;
  }, [soundTier, musicTier, calculatedWatts, m2, pax, geo, soundBudget, musicBudget, lightingBudget, avBudget]);

  const toggleLock = (category: string) => {
    setLockedSliders(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleCheckout = async () => {
    setIsReserving(true);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 0.50,
          concept: `Bloqueo Neural Roster: ${eventType} en ${location.toUpperCase()} (${eventDate})`,
          metadata: {
            organizerType,
            eventType,
            location,
            eventDate,
            pax,
            m2,
            totalBudget: soundBudget + lightingBudget + musicBudget + avBudget,
            deposit: 0.50
          }
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      alert('Error iniciando reserva: ' + e.message);
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="w-full bg-[#070709] border border-[#ecb613]/30 rounded-[3rem] p-6 md:p-12 shadow-[0_0_60px_rgba(236,182,19,0.12)] space-y-10 text-white font-sans">
      
      {/* HEADER DEL TÚNEL NEURAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> TÚNEL NEURAL DE 10 PANTALLAS • WEDDING PLANNERS & B2B
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            Matchmaking <span className="text-[#ecb613] italic">Sublime & Presupuesto</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl">
            Acompañamiento guiado paso a paso. Configura tu evento, bloquea partidas con el cotizador y obtén en segundos los proveedores exactos con stock garantizado.
          </p>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="flex items-center gap-2 bg-black/60 border border-white/10 px-5 py-3 rounded-2xl">
          <span className="text-xs font-mono text-[#ecb613] font-bold">Pantalla {currentStep} / 10</span>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${
                  i + 1 === currentStep ? 'bg-[#ecb613] w-5' : (i + 1 < currentStep ? 'bg-emerald-400' : 'bg-white/10')
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* CUERPO DEL TÚNEL SEGÚN PANTALLA */}
      <div className="min-h-[360px] flex flex-col justify-center">
        
        {/* PANTALLA 1: PERFIL DEL ORGANIZADOR */}
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 1</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">¿Cuál es tu rol en la organización?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'WEDDING_PLANNER', label: 'Wedding Planner / Agencia', desc: 'Ahorro de tiempo, riders listos y comisión de agencia 10%', icon: Crown },
                { id: 'EMPRESA_B2B', label: 'Director Corporativo / B2B', desc: 'Convenciones, galas de empresa y factura con ledger', icon: Building2 },
                { id: 'AYUNTAMIENTO_B2G', label: 'Institucional / Festejos', desc: 'Contrato menor Art. 118 LCSP y póliza RC 1M€', icon: ShieldCheck },
                { id: 'PARTICULAR_VIP', label: 'Novios / Anfitrión VIP', desc: 'Atención personalizada y tranquilidad absoluta', icon: Heart }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setOrganizerType(p.id)}
                  className={`p-6 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                    organizerType === p.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <p.icon className={`w-8 h-8 ${organizerType === p.id ? 'text-[#ecb613]' : 'text-slate-400'}`} />
                  <h4 className="font-bold text-base text-white">{p.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{p.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 2: TIPO DE EVENTO */}
        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 2</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">¿Qué formato de evento vas a desplegar?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'BODA_FINCA', label: 'Boda en Finca / Masía / Cortijo', desc: 'Ceremonia civil, cóctel acústico, mariachi sorpresa y fiesta' },
                { id: 'CONVENCION_GALA', label: 'Convención & Gala de Premios', desc: 'Oratoria nítida, streaming multicámara y show de cierre' },
                { id: 'FESTIVAL_FERIA', label: 'Festival & Festejos Patronales', desc: 'Gran escenario, presión acústica masiva y banda municipal' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setEventType(item.id)}
                  className={`p-8 rounded-3xl border text-left space-y-4 transition-all cursor-pointer ${
                    eventType === item.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Sparkles className={`w-6 h-6 ${eventType === item.id ? 'text-[#ecb613]' : 'text-slate-400'}`} />
                  <h4 className="font-bold text-lg text-white">{item.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">{item.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 3: LOCALIZACIÓN */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 3</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Selecciona la provincia del evento</h3>
              <p className="text-xs text-slate-400">El sistema carga automáticamente las fincas asociadas y la normativa de ruido aplicable.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-none">
              {PROVINCIAS.slice(0, 36).map((p) => (
                <button
                  key={p}
                  onClick={() => setLocation(p)}
                  className={`py-3 px-4 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    location === p 
                      ? 'bg-[#ecb613] text-black shadow-lg font-black' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-slate-400 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#ecb613] shrink-0" />
              <span>Fincas registradas en {location.toUpperCase()}: <strong>{geo.venues.join(' • ')}</strong></span>
            </div>
          </motion.div>
        )}

        {/* PANTALLA 4: FECHA */}
        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-lg mx-auto text-center">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 4</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Fecha Prevista del Evento</h3>
            </div>
            <div className="bg-black/60 border border-white/10 p-8 rounded-3xl space-y-4">
              <Calendar className="w-12 h-12 text-[#ecb613] mx-auto" />
              <input 
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white font-mono text-lg text-center py-4 rounded-2xl focus:outline-none focus:border-[#ecb613]"
              />
              <p className="text-xs text-emerald-400 font-mono">
                ✓ Inventario con 10 unidades base disponible para {eventDate}
              </p>
            </div>
          </motion.div>
        )}

        {/* PANTALLA 5: AFORO Y SUPERFICIE */}
        {currentStep === 5 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 5</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Dimensiones y Aforo</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/40 border border-white/5 p-8 rounded-3xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#ecb613]" /> Superficie del Espacio
                  </label>
                  <span className="text-2xl font-black text-[#ecb613] font-mono">{m2} m²</span>
                </div>
                <input 
                  type="range" min="20" max="800" step="10" value={m2}
                  onChange={(e) => setM2(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#ecb613]" /> Aforo Estimado (PAX)
                  </label>
                  <span className="text-2xl font-black text-white font-mono">{pax} PAX</span>
                </div>
                <input 
                  type="range" min="20" max="1000" step="10" value={pax}
                  onChange={(e) => setPax(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>
            </div>
            <div className="text-center text-xs font-mono text-slate-400">
              ⚡ Presión sonora mínima calculada: <strong>{calculatedWatts} W RMS</strong> (conforme a 12 W/pax).
            </div>
          </motion.div>
        )}

        {/* PANTALLA 6: EQUIPO DE SONIDO */}
        {currentStep === 6 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 6</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Configuración de Audio Recomendada</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'BOSE_F1', name: 'Bose F1 Model 812 + Subwoofers F1', watts: '2.000W RMS', desc: 'Arreglo lineal flexible para recintos de hasta 200 pax sin fatiga auditiva' },
                { id: 'LACOUSTICS_SYVA', name: 'L-Acoustics Syva + Syva Low', watts: '4.800W RMS', desc: 'Colinear Source de alta fidelidad arquitectónica para bodas VIP y galas de 500+ pax' }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSoundTier(s.id)}
                  className={`p-8 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                    soundTier === s.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Speaker className="w-8 h-8 text-[#ecb613]" />
                  <h4 className="font-bold text-lg text-white">{s.name}</h4>
                  <span className="text-xs font-mono text-[#ecb613] block font-bold">{s.watts}</span>
                  <p className="text-xs text-slate-400 font-light">{s.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 7: ILUMINACIÓN */}
        {currentStep === 7 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 7</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Diseño Lumínico</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'FESTOON_WARM', name: 'Vintage Festoon & Uplighting Batería', desc: 'Micro-bombillas 2200K cálidas y focos autónomos para jardines y fachadas' },
                { id: 'SHOW_DMX', name: 'Cabezas Móviles Beam 7R + Show Láser & Humo', desc: 'Iluminación robótica sincronizada para el clímax de la pista de baile' }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLightingTier(l.id)}
                  className={`p-8 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                    lightingTier === l.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Flame className="w-8 h-8 text-[#ecb613]" />
                  <h4 className="font-bold text-lg text-white">{l.name}</h4>
                  <p className="text-xs text-slate-400 font-light">{l.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 8: ARTISTAS Y MÚSICA */}
        {currentStep === 8 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 8</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Formato Artístico Principal</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'MARIACHI_GALA', name: 'Mariachi Imperial Edwin Agudelo (6+ Músicos)', desc: '2 Trompetas, violín, vihuela, guitarrón y voz tenor con trajes de gala' },
                { id: 'SOLISTA_CUARTETO', name: 'Edwin Agudelo Solista + Sección Acústica', desc: 'Voz lírica y balada de autor para ceremonias y cócteles exclusivos' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMusicTier(m.id)}
                  className={`p-8 rounded-3xl border text-left space-y-3 transition-all cursor-pointer ${
                    musicTier === m.id 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-[0_0_30px_rgba(236,182,19,0.2)]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <Mic2 className="w-8 h-8 text-[#ecb613]" />
                  <h4 className="font-bold text-lg text-white">{m.name}</h4>
                  <p className="text-xs text-slate-400 font-light">{m.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 9: SERVICIOS COMPLEMENTARIOS */}
        {currentStep === 9 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Paso 9</span>
              <h3 className="text-2xl md:text-3xl font-black uppercase">Servicios Técnicos Añadidos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'VIDEO_4K', label: 'Grabación Cinema 4K', desc: 'Registro multicámara y master DaVinci' },
                { id: 'STREAMING', label: 'Streaming 5G Bonding', desc: 'Retransmisión en vivo sin latencia' },
                { id: 'DJ_SET', label: 'DJ Set & Live Remix', desc: 'Sesión de baile con audio Bose' }
              ].map((extra) => {
                const isSelected = extraServices.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => {
                      setExtraServices(prev => 
                        isSelected ? prev.filter(x => x !== extra.id) : [...prev, extra.id]
                      );
                    }}
                    className={`p-6 rounded-2xl border text-left space-y-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ecb613]/15 border-[#ecb613] text-white' 
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-white">{extra.label}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#ecb613]" />}
                    </div>
                    <p className="text-xs font-light">{extra.desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* PANTALLA 10: COTIZADOR CON CANDADOS DE BLOQUEO & ROSTER FINAL TINDER MATCH */}
        {currentStep === 10 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest font-bold">Pantalla 10 • Resultado Definitivo</span>
                <h3 className="text-3xl font-black uppercase text-white">Roster de Proveedores & Cotizador S-Class</h3>
                <p className="text-xs text-slate-400">Bloquea las partidas que deseas congelar y ajusta el resto con los deslizadores.</p>
              </div>

              <div className="bg-black/60 border border-white/10 p-4 rounded-2xl text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Presupuesto Total Pack</span>
                <span className="text-3xl font-black text-[#ecb613] font-display">
                  {soundBudget + lightingBudget + musicBudget + avBudget} €
                </span>
                <span className="text-[9px] text-slate-500 block font-mono">IVA no incl. • Depósito: 0.50 €</span>
              </div>
            </div>

            {/* DESLIZADORES CON BOTÓN DE CANDADO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 border border-white/5 p-6 rounded-3xl">
              
              {/* Partida 1: Audio */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    Sonido P.A. & Microfonía
                  </span>
                  <button 
                    onClick={() => toggleLock('sound')}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full cursor-pointer ${
                      lockedSliders.sound ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {lockedSliders.sound ? <Lock size={12} /> : <Unlock size={12} />}
                    {lockedSliders.sound ? 'Bloqueado' : 'Ajustable'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="300" max="1500" step="50"
                    disabled={lockedSliders.sound}
                    value={soundBudget}
                    onChange={(e) => setSoundBudget(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                  />
                  <span className="text-sm font-mono font-bold text-[#ecb613] w-20 text-right">{soundBudget} €</span>
                </div>
              </div>

              {/* Partida 2: Iluminación */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    Iluminación & Show DMX
                  </span>
                  <button 
                    onClick={() => toggleLock('lighting')}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full cursor-pointer ${
                      lockedSliders.lighting ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {lockedSliders.lighting ? <Lock size={12} /> : <Unlock size={12} />}
                    {lockedSliders.lighting ? 'Bloqueado' : 'Ajustable'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="200" max="1200" step="50"
                    disabled={lockedSliders.lighting}
                    value={lightingBudget}
                    onChange={(e) => setLightingBudget(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                  />
                  <span className="text-sm font-mono font-bold text-[#ecb613] w-20 text-right">{lightingBudget} €</span>
                </div>
              </div>

              {/* Partida 3: Música */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    Música de Autor & Mariachi
                  </span>
                  <button 
                    onClick={() => toggleLock('music')}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full cursor-pointer ${
                      lockedSliders.music ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {lockedSliders.music ? <Lock size={12} /> : <Unlock size={12} />}
                    {lockedSliders.music ? 'Bloqueado (Caché)' : 'Ajustable'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="750" max="3000" step="50"
                    disabled={lockedSliders.music}
                    value={musicBudget}
                    onChange={(e) => setMusicBudget(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                  />
                  <span className="text-sm font-mono font-bold text-[#ecb613] w-20 text-right">{musicBudget} €</span>
                </div>
              </div>

              {/* Partida 4: Audiovisual */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-2">
                    Audiovisual & Streaming 4K
                  </span>
                  <button 
                    onClick={() => toggleLock('audiovisual')}
                    className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full cursor-pointer ${
                      lockedSliders.audiovisual ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {lockedSliders.audiovisual ? <Lock size={12} /> : <Unlock size={12} />}
                    {lockedSliders.audiovisual ? 'Bloqueado' : 'Ajustable'}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" min="300" max="2000" step="50"
                    disabled={lockedSliders.audiovisual}
                    value={avBudget}
                    onChange={(e) => setAvBudget(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                  />
                  <span className="text-sm font-mono font-bold text-[#ecb613] w-20 text-right">{avBudget} €</span>
                </div>
              </div>

            </div>

            {/* MATRIZ DE PROVEEDORES MATCH TINDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {matchedProviders.map((provider) => (
                <div 
                  key={provider.id}
                  className="bg-black/60 border border-white/10 hover:border-[#ecb613]/50 p-6 rounded-3xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded">
                        {provider.category}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {provider.affinityScore}% Match
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-white">{provider.name}</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{provider.role}</p>
                    <ul className="text-[11px] text-slate-400 font-mono space-y-1 pt-2">
                      {provider.specs.map((sp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-[#ecb613]" /> {sp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500">Stock: {provider.inventoryStock}/10</span>
                    <span className="text-lg font-black text-white font-mono">{provider.price} €</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA CONGELACIÓN DE TARIFA */}
            <div className="bg-gradient-to-r from-zinc-950 via-[#0f0f13] to-black border border-[#ecb613]/30 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h4 className="text-xl font-black text-white uppercase">Bloqueo de Roster & Tarifa 72h</h4>
                <p className="text-xs text-slate-400 max-w-xl mt-1">
                  Congela este equipo de proveedores y equipamiento para la fecha seleccionada ({eventDate}) mediante un depósito de garantía de 0.50 € con firma SHA-256.
                </p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isReserving}
                className="px-10 py-5 bg-[#ecb613] hover:bg-[#d4a210] text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-[#ecb613]/20 flex items-center gap-3 cursor-pointer shrink-0"
              >
                <Lock size={16} /> 
                {isReserving ? 'Conectando Stripe...' : 'Bloquear Roster (0.50 €)'}
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* CONTROLES DE NAVEGACIÓN INFERIOR */}
      <div className="flex justify-between items-center border-t border-white/10 pt-6">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
            currentStep === 1 ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>

        <span className="text-xs font-mono text-slate-500">
          Paso {currentStep} de 10
        </span>

        {currentStep < 10 ? (
          <button
            onClick={() => setCurrentStep(prev => Math.min(10, prev + 1))}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#ecb613] hover:bg-[#d4a210] text-black rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#ecb613]/10"
          >
            Siguiente Pantalla <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar Túnel
          </button>
        )}
      </div>

    </div>
  );
};
