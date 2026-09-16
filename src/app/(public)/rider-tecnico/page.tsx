'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Music, 
  Volume2, 
  ArrowLeft, 
  Sparkles, 
  Sliders, 
  Radio,
  Cpu,
  Mic,
  Headphones,
  SlidersHorizontal,
  CheckCircle2,
  FileDown,
  Info,
  Filter,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { 
  generateOrchestra, 
  calculateAcoustics, 
  MusicianPosition, 
  VenueType,
  MIXER_CATALOG,
  MICROPHONE_CATALOG,
  MONITOR_CATALOG,
  MicrophoneOption,
  getRecommendedMixerId
} from '@/lib/audio/symphonicRiderEngine';
import { InteractiveStageCanvas } from '@/components/audio/InteractiveStageCanvas';

export default function SymphonicRiderPage() {
  const [orchestraSize, setOrchestraSize] = useState<number>(12);
  const [venue, setVenue] = useState<VenueType>('OPEN_AIR');
  const [cameraAngle, setCameraAngle] = useState<'TOP_DOWN' | 'FOH_PERSPECTIVE' | 'STAGE_LEFT' | 'STAGE_RIGHT'>('TOP_DOWN');
  const [selectedMixerId, setSelectedMixerId] = useState<string>('allen-cq18t');
  const [selectedMusician, setSelectedMusician] = useState<MusicianPosition | null>(null);

  // Filtro por categoría para microfonía profesional
  const [micCategoryFilter, setMicCategoryFilter] = useState<string>('ALL');

  // Personalización por canal
  const [customGear, setCustomGear] = useState<Record<string, { micId: string; monitorId: string }>>({});

  const baseMusicians = useMemo(() => generateOrchestra(orchestraSize), [orchestraSize]);

  // Aplicar personalización de equipo sobre los músicos
  const musicians = useMemo(() => {
    return baseMusicians.map((m) => {
      const custom = customGear[m.id];
      if (!custom) return m;
      return {
        ...m,
        micId: custom.micId || m.micId,
        monitorId: custom.monitorId || m.monitorId
      };
    });
  }, [baseMusicians, customGear]);

  // Músico seleccionado activo
  const activeSelected = useMemo(() => {
    if (!selectedMusician) return musicians[0] || null;
    return musicians.find((m) => m.id === selectedMusician.id) || selectedMusician;
  }, [selectedMusician, musicians]);

  const selectedMixer = useMemo(() => {
    return MIXER_CATALOG.find((m) => m.id === selectedMixerId) || MIXER_CATALOG[0];
  }, [selectedMixerId]);

  const acoustics = useMemo(() => calculateAcoustics(orchestraSize, venue), [orchestraSize, venue]);

  // Filtrar microfonía según categoría seleccionada o afinidad de sección
  const filteredMicrophones = useMemo(() => {
    if (micCategoryFilter === 'ALL') return MICROPHONE_CATALOG;
    return MICROPHONE_CATALOG.filter((mic) => mic.category === micCategoryFilter);
  }, [micCategoryFilter]);

  // Cálculo de valoración de rider y presupuesto de microfonía
  const riderFinancials = useMemo(() => {
    let micBudget = 0;
    let monitorBudget = 0;
    musicians.forEach((m) => {
      const mic = MICROPHONE_CATALOG.find((x) => x.id === m.micId);
      const mon = MONITOR_CATALOG.find((x) => x.id === m.monitorId);
      micBudget += mic?.referencePriceEur || 250;
      monitorBudget += mon?.referencePriceEur || 600;
    });
    const mixerPrice = selectedMixer.referencePriceEur;
    const totalAssetValuation = mixerPrice + micBudget + monitorBudget;
    return {
      mixerPrice,
      micBudget,
      monitorBudget,
      totalAssetValuation
    };
  }, [musicians, selectedMixer]);

  const handleMicChange = (micId: string) => {
    if (!activeSelected) return;
    setCustomGear((prev) => ({
      ...prev,
      [activeSelected.id]: {
        ...prev[activeSelected.id],
        micId,
        monitorId: prev[activeSelected.id]?.monitorId || activeSelected.monitorId
      }
    }));
  };

  const handleMonitorChange = (monitorId: string) => {
    if (!activeSelected) return;
    setCustomGear((prev) => ({
      ...prev,
      [activeSelected.id]: {
        ...prev[activeSelected.id],
        micId: prev[activeSelected.id]?.micId || activeSelected.micId,
        monitorId
      }
    }));
  };

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Top S-Class Status Bar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin" 
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#ecb613]/50 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-[#ecb613]" />
                Simulador de Rider Sinfónico & Acústico
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-semibold">
                Thomann S-Class Architecture
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              14 Consolas &bull; 26 Cápsulas Thomann Pro &bull; In-Ears &bull; 1 a 100 Músicos &bull; Límite &lt; 75 dB SPL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Valor Rider: {riderFinancials.totalAssetValuation.toLocaleString()} €</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 font-bold">{acoustics.targetSPL} dB SPL</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#ecb613]">
            <Radio className="w-3.5 h-3.5" />
            <span>{acoustics.totalWatts.toLocaleString()} W (12 W/pax)</span>
          </div>
          <button 
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-[#ecb613] text-black font-bold text-xs font-mono flex items-center gap-1.5 hover:bg-[#ffe066] transition shadow-lg shadow-[#ecb613]/10"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar Rider PDF</span>
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Interactive Canvas & Perspective Switcher */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col gap-4 shadow-2xl">
            {/* Viewport Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ecb613]" />
                <span className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">Perspectiva Escenario:</span>
              </div>
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                {(['TOP_DOWN', 'FOH_PERSPECTIVE', 'STAGE_LEFT', 'STAGE_RIGHT'] as const).map(angle => (
                  <button
                    key={angle}
                    onClick={() => setCameraAngle(angle)}
                    className={'px-3 py-1.5 text-[11px] font-mono rounded-lg transition ' + (cameraAngle === angle ? 'bg-[#ecb613] text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white')}
                  >
                    {angle === 'TOP_DOWN' ? 'Cenital' : angle === 'FOH_PERSPECTIVE' ? 'FOH Frente' : angle === 'STAGE_LEFT' ? 'Escuela Izq' : 'Escuela Der'}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Canvas Container */}
            <div className="h-[500px] w-full relative">
              <InteractiveStageCanvas
                musicians={musicians}
                venue={venue}
                cameraAngle={cameraAngle}
                onSelectMusician={setSelectedMusician}
                selectedId={activeSelected?.id}
                activeMixerName={selectedMixer.brand + ' ' + selectedMixer.name.split(' ')[0]}
              />
            </div>

            {/* Real-Time Acoustic Telemetry Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Reverberación RT60</span>
                <span className="text-zinc-200 font-bold">{acoustics.rt60}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Filtro Notch de Seguridad</span>
                <span className="text-amber-400 font-bold">{acoustics.criticalNotch}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Mesa FOH Activa</span>
                <span className="text-[#ecb613] font-bold">{selectedMixer.brand} {selectedMixer.channels} Ch</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">Normativa B2G / LCMP</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Aprobado (&lt; 75 dB)
                </span>
              </div>
            </div>
          </div>

          {/* Section Hardware Legend */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] inline-block" /> Voz Edwin Agudelo
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] inline-block" /> Mariachi
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7] inline-block" /> Cuerdas
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] inline-block" /> Metales
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" /> Maderas
              </span>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" /> Percusión
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Info className="w-3.5 h-3.5" />
              <span>Haz clic en un músico para modificar microfonía o monitor</span>
            </div>
          </div>
        </div>

        {/* Right Col: Pro FOH Controls & Desplegables de Hardware Thomann */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Hardware Selector: Mesa de Mezclas con Grupos Thomann */}
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ecb613]" />
                Mesa de Mezclas FOH / Monitores
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">14 Modelos Thomann</span>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 mb-1.5 block">
                Consola Digital Seleccionada:
              </label>
              <select
                value={selectedMixerId}
                onChange={(e) => setSelectedMixerId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-[#ecb613] font-bold focus:outline-none focus:border-[#ecb613] cursor-pointer"
              >
                <optgroup label="🌟 Flagships de Gira & Sinfónicas (96 kHz FPGA)">
                  {MIXER_CATALOG.filter(m => m.tier === 'TOURING_FLAGSHIP').map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id === getRecommendedMixerId(orchestraSize) ? '⭐ [SUGERIDA] ' : ''}{m.brand} - {m.name} ({m.channels} Ch)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🎚️ Conciertos Profesionales & Teatros">
                  {MIXER_CATALOG.filter(m => m.tier === 'PRO_CONCERT').map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id === getRecommendedMixerId(orchestraSize) ? '⭐ [SUGERIDA] ' : ''}{m.brand} - {m.name} ({m.channels} Ch)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="⚡ Digitales Compactas, Bodas & Mariachi">
                  {MIXER_CATALOG.filter(m => m.tier === 'COMPACT_DIGITAL').map(m => (
                    <option key={m.id} value={m.id}>
                      {m.id === getRecommendedMixerId(orchestraSize) ? '⭐ [SUGERIDA FORMATO] ' : ''}{m.brand} - {m.name} ({m.channels} Ch)
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono space-y-1.5 text-zinc-400">
              <div className="flex justify-between">
                <span>Capacidad de Canales:</span>
                <span className="text-white font-bold">{selectedMixer.channels} Ch Físicos ({selectedMixer.buses} Buses / {selectedMixer.dca} DCA)</span>
              </div>
              <div className="flex justify-between">
                <span>Latencia DSP / Muestreo:</span>
                <span className="text-emerald-400 font-bold">{selectedMixer.latencyMs} ms &bull; {selectedMixer.sampleRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Protocolo de Red:</span>
                <span className="text-cyan-400">{selectedMixer.dspProtocol}</span>
              </div>
              <div className="flex justify-between">
                <span>Valor de Referencia:</span>
                <span className="text-[#ecb613] font-bold">{selectedMixer.referencePriceEur.toLocaleString()} €</span>
              </div>
              <p className="text-zinc-500 text-[10px] pt-1.5 border-t border-zinc-900 leading-relaxed">
                {selectedMixer.description}
              </p>
            </div>
          </div>

          {/* Escenario & Aforo */}
          <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col gap-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Sliders className="w-4 h-4 text-[#ecb613]" />
              Configuración de Orquesta & Espacio
            </h3>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-zinc-400">Músicos en Tarima:</span>
                <span className="text-[#ecb613] font-bold">{orchestraSize} Músicos</span>
              </div>
              <input
                type="range"
                min="3"
                max="100"
                value={orchestraSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setOrchestraSize(newSize);
                  // Auto-sugerencia inteligente de consola según formación
                  setSelectedMixerId(getRecommendedMixerId(newSize));
                }}
                className="w-full accent-[#ecb613] cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                <span>Trío (3) &bull; FLOW 8</span>
                <span>Mariachi (6-12) &bull; CQ-18T</span>
                <span>Sinfónica (100) &bull; dLive / SD12</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 mb-1.5 block">
                Entorno Acústico del Evento:
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value as VenueType)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#ecb613] cursor-pointer"
              >
                <option value="OPEN_AIR">Aire Libre (Parques, Plazas y Fincas)</option>
                <option value="GLASS_DOME">Cúpula Acristalada (Alta Reflexión)</option>
                <option value="THEATER_HALL">Teatro / Auditorio Cerrado</option>
                <option value="TENT">Carpa Tensada para Eventos</option>
              </select>
            </div>
          </div>

          {/* Canal FOH y Selector de Microfonía / Monitor Dinámico con Categorías */}
          {activeSelected && (
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-md flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                  Canal {activeSelected.channel}: {activeSelected.instrument}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                  {activeSelected.section}
                </span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase mb-1">Músico / Asignación:</span>
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold flex items-center gap-2">
                    <span className="text-base">{activeSelected.avatarIcon}</span>
                    <span>{activeSelected.name}</span>
                  </div>
                </div>

                {/* Filtro de Categoría de Microfonía */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-bold">
                      <Mic className="w-3.5 h-3.5 text-[#ecb613]" />
                      Microfonía & Cápsula FOH:
                    </label>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                      <Filter className="w-3 h-3" />
                      <select 
                        value={micCategoryFilter}
                        onChange={(e) => setMicCategoryFilter(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                      >
                        <option value="ALL">Todas las Categorías ({MICROPHONE_CATALOG.length})</option>
                        <option value="VOZ">Voces Principales & Coros</option>
                        <option value="CUERDAS_ACUSTICAS">Cuerdas & Mariachi</option>
                        <option value="METALES_BRASS">Metales & Trompetas</option>
                        <option value="MADERAS">Maderas & Vientos</option>
                        <option value="DI_BOXES">Cajas de Inyección (DI)</option>
                        <option value="PERCUSION_BATERIA">Percusión Sinfónica</option>
                      </select>
                    </div>
                  </div>

                  {/* Desplegable de Microfonía por Categorías Thomann */}
                  <select
                    value={activeSelected.micId}
                    onChange={(e) => handleMicChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-[#ecb613] font-bold focus:outline-none focus:border-[#ecb613] cursor-pointer"
                  >
                    {filteredMicrophones.map((mic) => (
                      <option key={mic.id} value={mic.id}>
                        {mic.brand} - {mic.name} ({mic.polarPattern}) &bull; {mic.referencePriceEur} €
                      </option>
                    ))}
                  </select>

                  <div className="flex justify-between text-[10px] text-zinc-500 mt-1 px-1">
                    <span>Alimentación: {MICROPHONE_CATALOG.find(m => m.id === activeSelected.micId)?.phantom48V ? '+48V Phantom ON' : 'Dinámico / Pasivo'}</span>
                    <span>Soporte: {activeSelected.standType}</span>
                  </div>
                  <p className="text-[10px] text-[#ecb613]/90 mt-1 px-1 italic">
                    Idoneidad: {MICROPHONE_CATALOG.find(m => m.id === activeSelected.micId)?.idealFor}
                  </p>
                </div>

                {/* Desplegable de Monitores (In-Ear vs Cuña) con Categorías Thomann */}
                <div>
                  <label className="text-zinc-400 text-[11px] mb-1 flex items-center gap-1.5 font-bold">
                    <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                    Sistema de Monitoreo:
                  </label>
                  <select
                    value={activeSelected.monitorId}
                    onChange={(e) => handleMonitorChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
                  >
                    <optgroup label="🎧 Sistemas In-Ear Inalámbricos (IEM)">
                      {MONITOR_CATALOG.filter(m => m.type === 'IN_EAR').map(mon => (
                        <option key={mon.id} value={mon.id}>
                          {mon.brand} - {mon.name} &bull; {mon.referencePriceEur} €
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="🔊 Cuñas de Suelo Coaxiales (Stage Wedges)">
                      {MONITOR_CATALOG.filter(m => m.type === 'WEDGE_FLOOR').map(mon => (
                        <option key={mon.id} value={mon.id}>
                          {mon.brand} - {mon.name} ({mon.powerWatts} W) &bull; {mon.referencePriceEur} €
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="⚡ Side-Fills & Cobertura Escenario">
                      {MONITOR_CATALOG.filter(m => m.type === 'SIDE_FILL').map(mon => (
                        <option key={mon.id} value={mon.id}>
                          {mon.brand} - {mon.name} ({mon.powerWatts} W) &bull; {mon.referencePriceEur} €
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-[10px] text-zinc-500 mt-1 px-1">
                    {MONITOR_CATALOG.find(m => m.id === activeSelected.monitorId)?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
