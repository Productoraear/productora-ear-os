'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic2,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Zap,
  Radio,
  Sliders,
  Cpu,
  Layers,
  Search,
  Filter
} from 'lucide-react';

interface VoiceCatalogItem {
  id: string;
  name: string;
  artist: string;
  language: string;
  gender: string;
  tone: string;
  description: string;
  isMasterProfile: boolean;
  assignedAgentsCount: number;
  providers: Array<{ provider: string; available: boolean }>;
}

interface AgentAssignment {
  agentId: string;
  voiceId: string;
  voiceName: string;
  artist: string;
  language: string;
  isCustom: boolean;
}

interface AgentCardMeta {
  id: string;
  name: string;
  division: 'comercial' | 'tecnica' | 'juridica' | 'vimume' | 'sector';
  divisionLabel: string;
  samplePhrase: string;
}

const FLEET_AGENTS: AgentCardMeta[] = [
  // ── División 1 · Comercial, Voz & Cierre Cuántico (8) ──
  {
    id: 'voice-concierge',
    name: 'Voice Concierge',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Hola, bienvenido a Productora EAR. Estoy coordinando la experiencia musical para tu evento exclusivo.',
  },
  {
    id: 'lead-intake-dispatcher',
    name: 'Lead Intake Dispatcher',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Hemos recibido tu solicitud de cotización. Permíteme canalizarte con la opción técnica perfecta.',
  },
  {
    id: 'sales-closer',
    name: 'Sales Closer S-Class',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'El bloqueo de fecha con fianza deducible garantiza la exclusividad total de Edwin Agudelo en tu enlace.',
  },
  {
    id: 'logistics-pricer',
    name: 'Logistics Pricer',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Tarifa base de 350 euros verificada más kilometraje oficial auditado por GPS.',
  },
  {
    id: 'retention-reactivator',
    name: 'Retention Reactivator',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Reactivamos tu propuesta con condiciones preferentes para las fechas de temporada.',
  },
  {
    id: 'finca-negotiator',
    name: 'Finca Negotiator',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Acuerdo estratégico de colaboración mutua con el Split soberano ochenta diez diez.',
  },
  {
    id: 'cross-sell-orchestrator',
    name: 'Cross-Sell Orchestrator',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Podemos complementar tu ceremonia con el pase acústico de gala y barra libre premium.',
  },
  {
    id: 'vip-concierge-escalation',
    name: 'VIP Concierge Escalation',
    division: 'comercial',
    divisionLabel: 'División 1 · Comercial',
    samplePhrase: 'Atención protocolaria de alta distinción para clientes y fincas de categoría superior.',
  },

  // ── División 2 · Técnica, Rider, Logística & Flota (8) ──
  {
    id: 'acoustic-rider-guard',
    name: 'Acoustic Rider Guard',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Presión sonora calibrada bajo la Ley 37 del Ruido. Menos de setenta y cinco decibelios en interior.',
  },
  {
    id: 'equipment-allocator',
    name: 'Equipment Allocator',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Columna Bose L1 Pro dieciséis y microfonía Shure inalámbrica asignadas para el convoy.',
  },
  {
    id: 'convoy-telemetry-sentinel',
    name: 'Convoy Telemetry Sentinel',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Telemetría de ruta en tiempo real activa desde Méntrida hacia la finca del evento.',
  },
  {
    id: 'soundcheck-auditor',
    name: 'Soundcheck Auditor',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Prueba de sonido completada. Curva de ecualización adaptada a la acústica de la sala.',
  },
  {
    id: 'procurement-inventory',
    name: 'Procurement Inventory',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Stock de cableado balanceado y unidades de reserva verificado para el fin de semana.',
  },
  {
    id: 'subcontract-dispatcher',
    name: 'Subcontract Dispatcher',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Coordinación con los técnicos locales homologados en la comarca del bolo.',
  },
  {
    id: 'route-optimizer',
    name: 'Route Optimizer',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Ruta optimizada con margen de seguridad de sesenta minutos antes del cóctel.',
  },
  {
    id: 'venue-profiler',
    name: 'Venue Profiler',
    division: 'tecnica',
    divisionLabel: 'División 2 · Técnica',
    samplePhrase: 'Perfil acústico de la finca registrado: jardines exteriores y salón acristalado.',
  },

  // ── División 3 · Jurídica, B2G & Financiera (8) ──
  {
    id: 'smart-contract-engine',
    name: 'Smart Contract Engine',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Contrato de producción blindado con hash SHA doscientos cincuenta y seis y fianza en custodia.',
  },
  {
    id: 'b2g-tender-hunter',
    name: 'B2G Tender Hunter',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Licitación menor detectada bajo el artículo ciento dieciocho de la Ley de Contratos del Sector Público.',
  },
  {
    id: 'b2g-pliego-compiler',
    name: 'B2G Pliego Compiler',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Pliego administrativo compilado con memorias técnicas y acreditación de solvencia artística.',
  },
  {
    id: 'split-settlement-dispatcher',
    name: 'Split Settlement Dispatcher',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Liquidación automática: ochenta por ciento artista, diez por ciento EAR OS y diez por ciento VIMUME.',
  },
  {
    id: 'modelo-182-tax-shield',
    name: 'Modelo 182 Tax Shield',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Certificado de donación fiscal emitido para deducción del ochenta por ciento en el IRPF.',
  },
  {
    id: 'invoice-treasury-agent',
    name: 'Invoice Treasury Agent',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Facturación electrónica generada con retención y desglose de IVA homologado.',
  },
  {
    id: 'vendor-compliance-auditor',
    name: 'Vendor Compliance Auditor',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Cumplimiento normativo y póliza de responsabilidad civil del proveedor auditados.',
  },
  {
    id: 'dispute-escrow-arbitrator',
    name: 'Dispute Escrow Arbitrator',
    division: 'juridica',
    divisionLabel: 'División 3 · Jurídica/B2G',
    samplePhrase: 'Custodia garantizada. La fianza se libera exclusivamente ante la ejecución impecable del repertorio.',
  },

  // ── División 4 · VIMUME Clínica & Expansión B2B (8) ──
  {
    id: 'vimume-protocol-sentinel',
    name: 'VIMUME Protocol Sentinel',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Protocolo de neuro-musicoterapia a cuarenta hercios iniciado para estimulación cognitiva no invasiva.',
  },
  {
    id: 'clinical-report-generator',
    name: 'Clinical Report Generator',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Informe de impacto social generado: reducción del setenta y cuatro por ciento en agitación y fármacos.',
  },
  {
    id: 'dental-clinic-coordinator',
    name: 'Dental Clinic Coordinator',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Ambiente acústico de baja ansiedad calibrado para el área de odontopediatría y cirugía.',
  },
  {
    id: 'veterinary-care-agent',
    name: 'Veterinary Care Agent',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Diseño sono-terapéutico para reducir el estrés animal en clínicas veterinarias.',
  },
  {
    id: 'hospitality-table-agent',
    name: 'Hospitality Table Agent',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Interacción de mesa y bienvenida musical para comensales en bodegas y eventos gastronómicos.',
  },
  {
    id: 'real-estate-event-liaison',
    name: 'Real Estate Event Liaison',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Ambientación sonora de lujo para presentaciones de fincas rústicas y propiedades singulares.',
  },
  {
    id: 'corporate-experience-agent',
    name: 'Corporate Experience Agent',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Producción de gala corporativa con acústica adaptada a discursos y networking.',
  },
  {
    id: 'omni-supervisor-daemon',
    name: 'Omni Supervisor Daemon',
    division: 'vimume',
    divisionLabel: 'División 4 · VIMUME',
    samplePhrase: 'Omni-Supervisor central activo. Supervisando la orquestación soberana de los agentes en el bus.',
  },
];

export default function VoiceCommandCenterPage(): React.JSX.Element {
  const [voices, setVoices] = useState<VoiceCatalogItem[]>([]);
  const [assignments, setAssignments] = useState<Record<string, AgentAssignment>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingAgentId, setSavingAgentId] = useState<string | null>(null);
  const [saveSuccessAgentId, setSaveSuccessAgentId] = useState<string | null>(null);
  const [playingAgentId, setPlayingAgentId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const loadData = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [voicesRes, assignmentsRes] = await Promise.all([
        fetch('/api/voices'),
        fetch('/api/voices/assignments'),
      ]);

      if (voicesRes.ok) {
        const data = (await voicesRes.json()) as { voices?: VoiceCatalogItem[] };
        setVoices(data.voices || []);
      }

      if (assignmentsRes.ok) {
        const data = (await assignmentsRes.json()) as { assignments?: Record<string, AgentAssignment> };
        setAssignments(data.assignments || {});
      }
    } catch (err: unknown) {
      console.error('Error al cargar datos del Voice Command Center:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    return () => {
      stopAudio();
    };
  }, []);

  const stopAudio = (): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingAgentId(null);
    setIsSynthesizing(false);
  };

  const handleVoiceChange = async (agentId: string, newVoiceId: string): Promise<void> => {
    setSavingAgentId(agentId);
    setSaveSuccessAgentId(null);

    // Actualización optimista local
    setAssignments((prev) => ({
      ...prev,
      [agentId]: {
        agentId,
        voiceId: newVoiceId,
        voiceName: voices.find((v) => v.id === newVoiceId)?.name || newVoiceId,
        artist: voices.find((v) => v.id === newVoiceId)?.artist || 'Productora EAR',
        language: 'es-ES',
        isCustom: true,
      },
    }));

    try {
      const res = await fetch('/api/voices/assignments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          voiceProfileId: newVoiceId,
        }),
      });

      if (res.ok) {
        setSaveSuccessAgentId(agentId);
        setTimeout(() => setSaveSuccessAgentId(null), 3000);
      }
    } catch (err) {
      console.error('Error al guardar asignación de voz:', err);
    } finally {
      setSavingAgentId(null);
    }
  };

  const handleTestVoice = async (agent: AgentCardMeta): Promise<void> => {
    if (playingAgentId === agent.id) {
      stopAudio();
      return;
    }

    stopAudio();
    setPlayingAgentId(agent.id);
    setIsSynthesizing(true);

    const targetVoiceId = assignments[agent.id]?.voiceId || 'edwin_agudelo_gala';

    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: agent.samplePhrase,
          voiceId: targetVoiceId,
        }),
      });

      if (!res.ok) {
        fallbackToWebSpeech(agent.samplePhrase);
        return;
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('audio') || contentType.includes('mpeg')) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onended = () => {
          setPlayingAgentId(null);
          setIsSynthesizing(false);
          if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            audioUrlRef.current = null;
          }
        };

        audio.onerror = () => {
          fallbackToWebSpeech(agent.samplePhrase);
        };

        setIsSynthesizing(false);
        await audio.play();
      } else {
        const data = (await res.json()) as { normalizedText?: string };
        fallbackToWebSpeech(data.normalizedText || agent.samplePhrase);
      }
    } catch {
      fallbackToWebSpeech(agent.samplePhrase);
    }
  };

  const fallbackToWebSpeech = (text: string): void => {
    setIsSynthesizing(false);
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setPlayingAgentId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-ES';
    u.rate = 1.0;
    u.onend = () => setPlayingAgentId(null);
    u.onerror = () => setPlayingAgentId(null);
    window.speechSynthesis.speak(u);
  };

  const filteredAgents = FLEET_AGENTS.filter((agent) => {
    const matchesDivision = selectedDivision === 'all' || agent.division === selectedDivision;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDivision && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030305] text-white">
      {/* HEADER S-CLASS */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060609]/95 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/command-center"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-all hover:border-[#ecb613]/50 hover:bg-[#ecb613]/10 hover:text-white"
              title="Volver al Command Center"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-wider text-white">
                  VOICE COMMAND CENTER
                </span>
                <span className="rounded border border-[#ecb613]/40 bg-[#ecb613]/10 px-2 py-0.5 font-mono text-[10px] text-[#ecb613]">
                  WAVE 31 · TITAN FLEET
                </span>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  POSTGRES RESILIENTE
                </span>
              </div>
              <p className="mt-0.5 font-mono text-xs text-white/40">
                Orquestación vocal de 32 agentes autónomos en caliente · Failover multi-proveedor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => void loadData()}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/80 transition-all hover:bg-white/10"
              title="Recargar catálogo y asignaciones"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#ecb613]' : ''}`} />
              <span>Sincronizar</span>
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 font-mono text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>32 Agentes Calibrados</span>
            </div>
          </div>
        </div>
      </header>

      {/* SUBNAV DE FILTROS & BÚSQUEDA */}
      <section className="border-b border-white/10 bg-[#08080c] px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Todos (32)' },
              { id: 'comercial', label: '1 · Comercial (8)' },
              { id: 'tecnica', label: '2 · Técnica (8)' },
              { id: 'juridica', label: '3 · Jurídica (8)' },
              { id: 'vimume', label: '4 · VIMUME (8)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedDivision(tab.id)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                  selectedDivision === tab.id
                    ? 'border border-[#ecb613] bg-[#ecb613]/15 font-bold text-[#ecb613]'
                    : 'border border-white/10 bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar agente por nombre..."
              className="w-full rounded-xl border border-white/10 bg-black/50 py-1.5 pl-9 pr-3 font-mono text-xs text-white placeholder-white/30 focus:border-[#ecb613] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* GRID DE AGENTES */}
      <main className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => {
            const currentVoiceId = assignments[agent.id]?.voiceId || 'edwin_agudelo_gala';
            const isSaving = savingAgentId === agent.id;
            const isSaved = saveSuccessAgentId === agent.id;
            const isPlaying = playingAgentId === agent.id;

            return (
              <div
                key={agent.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#09090d]/80 p-5 backdrop-blur-md transition-all hover:border-[#ecb613]/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#ecb613]">
                        {agent.divisionLabel}
                      </span>
                      <h3 className="mt-1 font-mono text-sm font-bold text-white">
                        {agent.name}
                      </h3>
                      <p className="font-mono text-[11px] text-white/40">{agent.id}</p>
                    </div>
                    {isSaved && (
                      <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Guardado</span>
                      </span>
                    )}
                    {isSaving && (
                      <span className="flex items-center gap-1 rounded bg-[#ecb613]/20 px-2 py-0.5 font-mono text-[10px] text-[#ecb613] animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Guardando...</span>
                      </span>
                    )}
                  </div>

                  <div className="my-3 rounded-xl border border-white/5 bg-black/40 p-3">
                    <span className="font-mono text-[10px] text-white/40">Frase de Locución:</span>
                    <p className="mt-1 font-sans text-xs italic leading-relaxed text-white/80">
                      "{agent.samplePhrase}"
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-white/50 mb-1">
                      Voz Asignada (Persistencia DB):
                    </label>
                    <select
                      value={currentVoiceId}
                      onChange={(e) => void handleVoiceChange(agent.id, e.target.value)}
                      disabled={isSaving}
                      className="w-full rounded-xl border border-white/15 bg-black/70 px-3 py-2 font-mono text-xs text-white focus:border-[#ecb613] focus:outline-none cursor-pointer"
                    >
                      {voices.length > 0 ? (
                        voices.map((v) => (
                          <option key={v.id} value={v.id} className="bg-[#0e0e16] text-white">
                            {v.name} ({v.tone})
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="edwin_agudelo_gala" className="bg-[#0e0e16] text-white">
                            Edwin Agudelo (Directo Gala)
                          </option>
                          <option value="edwin_agudelo_vimume" className="bg-[#0e0e16] text-white">
                            Edwin Agudelo (VIMUME 40 Hz)
                          </option>
                          <option value="ceremonial_hostess" className="bg-[#0e0e16] text-white">
                            Ceremonial Hostess VIP
                          </option>
                          <option value="higgsfield_cinematic_narrator" className="bg-[#0e0e16] text-white">
                            Higgsfield Narrador Cinematográfico
                          </option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => void handleTestVoice(agent)}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 font-mono text-xs font-bold transition-all ${
                        isPlaying
                          ? 'border-[#FF2B44] bg-[#FF2B44]/20 text-[#FF2B44]'
                          : 'border-white/15 bg-white/5 text-white/90 hover:border-[#ecb613] hover:text-[#ecb613]'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-3.5 w-3.5 fill-current" />
                          <span>Detener</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>{isSynthesizing && playingAgentId === agent.id ? 'Sintetizando...' : 'Probar Locución'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
