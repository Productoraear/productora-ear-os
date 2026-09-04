'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Terminal, 
  Brain, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Layers, 
  Cpu, 
  Database,
  ArrowLeft,
  FileText,
  Flame,
  Activity
} from 'lucide-react';

interface VampireUnit {
  id: string;
  name: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'READY';
  target: string;
  count: string;
  type: string;
}

export default function OraculoEntrenamientoPage() {
  const [activeTab, setActiveTab] = useState<'vampires' | 'objections' | 'biography' | 'rag'>('vampires');
  const [isTriggering, setIsTriggering] = useState(false);

  const vampireUnits: VampireUnit[] = [
    {
      id: 'UNIT_HTML_MASSIVE',
      name: 'Vampirizador HTMLs Proveedores H: & I:',
      status: 'READY',
      target: 'src/data/bodas-vendors-harvested.json',
      count: '27.079 Proveedores',
      type: 'B2C / B2B'
    },
    {
      id: 'UNIT_LIGHTING_B2G',
      name: 'Ingestor Alumbrado Navideño CPV 31522000',
      status: 'READY',
      target: 'src/data/admin/christmas_lighting_b2g.json',
      count: '530 Modelos LED',
      type: 'B2G Art. 118 LCSP'
    },
    {
      id: 'UNIT_DEMETRIO_CATALOG',
      name: 'Vampirización Total Catálogo Demetrio 2026',
      status: 'READY',
      target: 'src/data/demetrio_luces_navidad_2025.json',
      count: '150 Páginas PDF',
      type: 'Catálogo Oficial'
    },
    {
      id: 'UNIT_BIO_OBJECTIONS',
      name: 'Omni-Drive Miner (Bio Edwin & Objeciones)',
      status: 'READY',
      target: 'src/data/edwin-true-bio-ssot_draft.json',
      count: '300 Objeciones',
      type: 'Cerebro RAG'
    },
    {
      id: 'UNIT_ORACLE_RAG',
      name: 'Oráculo Estratégico High-Density Distiller',
      status: 'READY',
      target: 'src/data/oraculo-rag-ssot.json',
      count: 'Poda ≥ 85%',
      type: 'Memoria Cognitiva'
    },
    {
      id: 'UNIT_B2G_TENDER_HUNTER',
      name: 'Cazador B2G PLACE/TED Licitaciones Menores',
      status: 'READY',
      target: 'src/data/b2g/b2g_doble_impacto_municipal.json',
      count: '9 Expedientes Activos',
      type: 'Contratación Pública'
    },
    {
      id: 'UNIT_FORENSIC_SWEEPER',
      name: 'Barrido Forense ZTM Omni-Drive PC Total',
      status: 'READY',
      target: 'src/data/ear-rag-database.json',
      count: 'C:, D:, H:, I:, L:',
      type: 'Absorbed Vault'
    }
  ];

  const objectionSamples = [
    {
      id: 'OBJ-01',
      trigger: 'Es que un mariachi o grupo similar me cobra 250 €...',
      refutacion: 'El precio base de Edwin Agudelo (350 € solista) incluye Rider Bose F1/S1 Pro calibrado a 12 W/pax, microfonía Shure Beta 87A y garantía 0 fallos acústicos. La diferencia de 100 € es el seguro de que tu boda no tendrá acoples ni sonido distorsionado.',
      categoria: 'Anclaje de Precio / Dignidad Artística'
    },
    {
      id: 'OBJ-02',
      trigger: '¿Por qué exigís 100 € de señal inmediata con Price-Lock?',
      refutacion: 'El depósito de 100 € bloquea la agenda con firma criptográfica SHA-256 válida por 24h a 72h. Protege la fecha de la pareja frente a otras peticiones concurrentes y asegura la logística desde el Hub Central en Méntrida.',
      categoria: 'Transaccionalidad & Bloqueo de Agenda'
    },
    {
      id: 'OBJ-03',
      trigger: 'En el geriátrico municipal nos preocupa el volumen de la música...',
      refutacion: 'Protocolo VIMUME certificado: presión estrictamente acotada a < 75 dB SPL, frecuencias isocrónicas calibradas a 40 Hz para estimulación cognitiva en Alzheimer sin estrés sensorial.',
      categoria: 'VIMUME / Cumplimiento B2G'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-24 pb-32 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Barra superior de navegación */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <Link 
            href="/admin/oraculo" 
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-[#ecb613] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Oráculo Core
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              BARE-METAL QWEN WORKER LISTO
            </span>
          </div>
        </div>

        {/* Cabecera Principal */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#12121d] to-[#0a0a0f] border border-[#ecb613]/25 p-8 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Brain className="w-64 h-64 text-[#ecb613]" />
          </div>

          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs uppercase tracking-wider font-semibold">
              <Zap className="w-3.5 h-3.5" /> Cockpit de Ingesta & Entrenamiento Cognitivo
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              ENTRENAMIENTO DEL ORÁCULO & ENJAMBRE VAMPÍRICO
            </h1>
            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              Supervisa la actividad concurrente de las 7 unidades de extracción de datos, la ingesta del banco de 300 objeciones de venta y el perfeccionamiento continuo de la centralita 24/7 Astra bajo protocolo Zero-Token Memory (ZTM).
            </p>
          </div>
        </div>

        {/* Navegación por pestañas */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('vampires')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'vampires'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Flame className="w-4 h-4" /> Enjambre Vampírico ({vampireUnits.length} Unidades)
          </button>
          <button
            onClick={() => setActiveTab('objections')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'objections'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Banco de 300 Objeciones
          </button>
          <button
            onClick={() => setActiveTab('biography')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'biography'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Biografía SSOT Edwin Agudelo
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'rag'
                ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_20px_rgba(236,182,19,0.3)]'
                : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Database className="w-4 h-4" /> Memoria RAG Omni-Drive
          </button>
        </div>

        {/* CONTENIDO PESTAÑA: ENJAMBRE VAMPÍRICO */}
        {activeTab === 'vampires' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900/50 p-5 rounded-2xl border border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#ecb613]" /> Estado de Flota Vampírica Simultánea
                </h2>
                <p className="text-xs text-neutral-400">
                  Coordinada vía <code className="text-[#ecb613]">scripts/vampire_swarm_orchestrator.py</code> y lanzada por el daemon bare-metal.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-neutral-400">
                  Cola SSOT: <strong className="text-white">TAREA_13_VAMPIRE_SWARM_PARALLEL</strong>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vampireUnits.map((u) => (
                <div 
                  key={u.id}
                  className="bg-neutral-900/70 border border-neutral-800 hover:border-[#ecb613]/50 rounded-2xl p-5 space-y-3 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-black border border-neutral-700 text-[#ecb613]">
                      {u.id}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {u.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#ecb613] transition-colors">
                      {u.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1 truncate">
                      Salida: {u.target}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs text-neutral-400">
                    <span>Volumen: <strong className="text-white font-mono">{u.count}</strong></span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-neutral-300">
                      {u.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Comando de Terminal de Ignición Directa */}
            <div className="bg-black/80 rounded-2xl border border-neutral-800 p-6 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" /> DISPARADOR BARE-METAL (POWERSHELL 7 NATIVO)
                </span>
                <span className="text-neutral-500">Zero-Token Memory</span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Para disparar las 7 unidades de forma simultánea con paralelismo real en tu GPU RX 7900 XTX:
              </p>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-emerald-400 text-xs select-all">
                .\scripts\run_all_vampires_swarm.ps1
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA: BANCO DE OBJECIONES */}
        {activeTab === 'objections' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 p-5 rounded-2xl border border-neutral-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ecb613]" /> Muestrario de Refutación Táctica (Dani Aragón)
              </h2>
              <p className="text-xs text-neutral-400">
                Alimentando automáticamente las respuestas de Astra AI ante objeciones de precio, agenda y riders técnicos.
              </p>
            </div>

            <div className="space-y-4">
              {objectionSamples.map((obj) => (
                <div 
                  key={obj.id} 
                  className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#ecb613] font-bold">{obj.id}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 font-mono">
                      {obj.categoria}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-red-400 bg-red-950/20 p-3 rounded-xl border border-red-900/30">
                    🔴 Objeción del Cliente: &quot;{obj.trigger}&quot;
                  </div>
                  <div className="text-xs md:text-sm text-neutral-200 bg-neutral-950/60 p-4 rounded-xl border border-neutral-800 leading-relaxed">
                    🟢 <strong className="text-emerald-400">Refutación Inmediata Astra:</strong> {obj.refutacion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA: BIOGRAFÍA SSOT */}
        {activeTab === 'biography' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ecb613]" /> Perfil y Trayectoria Verificada: Edwin Agudelo
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fuente: <code className="text-[#ecb613]">src/data/edwin-true-bio-ssot_draft.json</code> consolidado tras el barrido forense ZTM.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase font-mono">Registro Vocal</span>
                  <p className="text-base font-bold text-white">Tenor Lírico / Ranchera</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase font-mono">Tarifa Base Solista</span>
                  <p className="text-base font-bold text-[#ecb613]">350,00 € (Inmutable)</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-1">
                  <span className="text-[11px] text-neutral-400 uppercase font-mono">Rider Certificado</span>
                  <p className="text-base font-bold text-emerald-400">Bose F1 / Shure Beta 87A</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENIDO PESTAÑA: MEMORIA RAG */}
        {activeTab === 'rag' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#ecb613]" /> Bóveda RAG & Telemetría Cognitiva
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Base central: <code className="text-[#ecb613]">src/data/ear-rag-database.json</code> (5.236.452 bytes). Nodos procesados bajo protocolo ZTM con condensados menores de 300 tokens para garantizar latencia ultra-baja en respuestas de Astra.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">Nodos Activos</span>
                  <p className="text-2xl font-bold text-white mt-1">30.139</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">Coste Inferencia</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">0,00 €</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">Split Soberano</span>
                  <p className="text-2xl font-bold text-[#ecb613] mt-1">80/10/10</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">Latencia Media</span>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">&lt; 25 ms</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
