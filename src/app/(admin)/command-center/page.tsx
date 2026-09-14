'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Flame,
  BrainCircuit,
  Compass,
  FileSearch,
  Cpu,
  ShieldAlert,
  Terminal,
  ExternalLink,
  Play,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Layers,
  Activity,
  Mic2,
  Music
} from 'lucide-react';

interface ToolCard {
  id: string;
  title: string;
  category: 'TELEMARKETING' | 'INTELLIGENCE' | 'AUDIT' | 'HARDWARE';
  icon: any;
  tag: string;
  description: string;
  actionType: 'LINK' | 'IFRAME' | 'TRIGGER';
  targetUrl?: string;
  localPath: string;
  status: 'ONLINE' | 'ACTIVE' | 'STANDBY';
  telemetry: string;
}

const TOOLS: ToolCard[] = [
  {
    id: 'agent-skills-lifecycle',
    title: 'Agent Skills // Ciclo de Vida Senior',
    category: 'INTELLIGENCE',
    icon: Layers,
    tag: 'ADDY OSMANI LIFECYCLE',
    description: 'Framework de ingeniería senior: Spec -> Plan -> Build -> Test -> Review -> Simplify -> Ship.',
    actionType: 'LINK',
    targetUrl: '/agent-skills',
    localPath: 'INSTALAR_AGENT_SKILLS.bat',
    status: 'ACTIVE',
    telemetry: '7 Quality Gates Activas'
  },
  {
    id: 'voice-studio-ai',
    title: 'Voice Studio AI // Canciones & Doblaje',
    category: 'INTELLIGENCE',
    icon: Mic2,
    tag: 'VOICE CLONING S-CLASS',
    description: 'Personalización de canciones con voz clonada de Edwin Agudelo (Bodas y VIMUME) y doblaje multilingüe para vídeos de Higgsfield.',
    actionType: 'LINK',
    targetUrl: '/voice-studio',
    localPath: 'INICIAR_VOICE_STUDIO.bat',
    status: 'ONLINE',
    telemetry: '646 Idiomas // Zero-Shot Clone'
  },
  {
    id: 'sourcing-hub',
    title: 'Sourcing Hub // VIMUME B2G',
    category: 'TELEMARKETING',
    icon: PhoneCall,
    tag: 'SENIOR CARE CRM',
    description: 'Consola de prospección activa y telemarketing para Residencias de Mayores, Centros de Día y Hogares del Jubilado.',
    actionType: 'LINK',
    targetUrl: '/sourcing',
    localPath: 'src/app/(admin)/sourcing/page.tsx',
    status: 'ONLINE',
    telemetry: '63 Centros en Radio Méntrida'
  },
  {
    id: 'call-center',
    title: 'Call Center de Proveedores',
    category: 'TELEMARKETING',
    icon: PhoneCall,
    tag: 'OUTBOUND B2B',
    description: 'Consola táctica de telemarketing con 39.500 fichas, guiones de objeciones y registro de leads en tiempo real.',
    actionType: 'LINK',
    targetUrl: '/proveedores?cat=musica&subcat=solista',
    localPath: 'EAR_CALL_CENTER_PROVEEDORES.html',
    status: 'ONLINE',
    telemetry: '74.824 Proveedores en Bóveda'
  },
  {
    id: 'journey-heatmap',
    title: 'Auditoría Customer Journey S-Class',
    category: 'AUDIT',
    icon: Flame,
    tag: 'GOLDEN PATH',
    description: 'Heatmap de navegación para leads HOT/FIRE (≤3 clics, ≤45s). Medición de fricción y score de eficiencia.',
    actionType: 'LINK',
    targetUrl: '/journey-heatmap',
    localPath: 'EAR_JOURNEY_HEATMAP.html',
    status: 'ONLINE',
    telemetry: '100% Golden Path Compliance'
  },
  {
    id: 'velocity-oracle',
    title: 'Consultora Estratégica Velocity 24H',
    category: 'INTELLIGENCE',
    icon: BrainCircuit,
    tag: 'ORÁCULO 24H',
    description: 'Motor de consulta contra 38 programas y 81 clases de negocios, copywriting, hook marketing y ventas.',
    actionType: 'TRIGGER',
    localPath: 'CONSULTORA_VELOCITY_24H.bat',
    status: 'ONLINE',
    telemetry: '81 Clases en Disco D: (6.02 GB)'
  },
  {
    id: 'omni-training',
    title: 'Omni Training Center',
    category: 'TELEMARKETING',
    icon: Compass,
    tag: 'SIMULADOR PRO',
    description: 'Deck interactivo de entrenamiento táctico para artistas, solistas y cierre de contratos de bodas.',
    actionType: 'LINK',
    targetUrl: '/alquiler',
    localPath: 'EAR_OMNI_TRAINING_CENTER.html',
    status: 'ACTIVE',
    telemetry: 'Split 80/10/10 Homologado'
  },
  {
    id: 'obsidian-indexer',
    title: 'Indexador Maestro Obsidian',
    category: 'INTELLIGENCE',
    icon: Layers,
    tag: 'ZTM KNOWLEDGE',
    description: 'Generador de enlaces atómicos y catálogos visuales en Markdown hacia H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT.',
    actionType: 'TRIGGER',
    localPath: 'INDEXADOR_MAESTRO_OBSIDIAN.bat',
    status: 'ACTIVE',
    telemetry: 'Obsidian S-Class Conectado'
  },
  {
    id: 'obsidian-search',
    title: 'Buscador Forense Obsidian',
    category: 'INTELLIGENCE',
    icon: FileSearch,
    tag: 'DEEP SEARCH',
    description: 'Búsqueda ultrarrápida de contratos menores, expedientes B2G (Art. 118 LCSP) y perlas de consultoría.',
    actionType: 'TRIGGER',
    localPath: 'BUSCADOR_OBSIDIAN.bat',
    status: 'STANDBY',
    telemetry: 'Búsqueda en <0.2s'
  },
  {
    id: 'memanto-memory-bridge',
    title: 'Memanto Agentic Memory (ZTM)',
    category: 'INTELLIGENCE',
    icon: BrainCircuit,
    tag: 'FLEET MEMORY',
    description: 'Control de memoria persistente, resolución de conflictos y reconciliación de doctrina para la flota de agentes.',
    actionType: 'TRIGGER',
    localPath: 'INICIAR_MEMANTO_UI.bat',
    status: 'ACTIVE',
    telemetry: 'Zero-Token Memory Hub'
  },
  {
    id: 'ollama-tuner',
    title: 'Desbloqueador Ollama Pro',
    category: 'HARDWARE',
    icon: Cpu,
    tag: 'RDNA3 24GB',
    description: 'Control de contexto a 49.152 tokens con Flash Attention activo para Qwen 14B Razonador a 80 t/s.',
    actionType: 'TRIGGER',
    localPath: 'DESBLOQUEAR_OLLAMA_PRO.bat',
    status: 'ACTIVE',
    telemetry: 'VRAM: 19.2 / 24.0 GB (Headroom 4.8GB)'
  },
  {
    id: 'security-suite',
    title: 'Búnker de Seguridad & Sign-Out',
    category: 'AUDIT',
    icon: ShieldAlert,
    tag: 'DEFENSA MILITAR',
    description: 'Directivas HSTS, CSP estricto, mitigación de fuerza bruta y destrucción de sesión en cascada.',
    actionType: 'LINK',
    targetUrl: '/admin',
    localPath: 'src/middleware.ts',
    status: 'ONLINE',
    telemetry: 'HSTS 63072000s + CSP Active'
  }
];

export default function AdminCommandCenterPage() {
  const [filter, setFilter] = useState<string>('ALL');
  const [activeQuery, setActiveQuery] = useState('');
  const [oracleOutput, setOracleOutput] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const filteredTools = TOOLS.filter(t => {
    if (filter !== 'ALL' && t.category !== filter) return false;
    if (activeQuery && !t.title.toLowerCase().includes(activeQuery.toLowerCase()) && !t.description.toLowerCase().includes(activeQuery.toLowerCase())) return false;
    return true;
  });

  const handleSimulateConsult = (prompt: string) => {
    setIsConsulting(true);
    setOracleOutput(null);
    setTimeout(() => {
      setIsConsulting(false);
      setOracleOutput(`💎 [ORÁCULO VELOCITY CONSULTORÍA]:
1. Diagnóstico: La retención se pierde en los primeros 3 segundos si usas introducciones genéricas.
2. Marco Mental: El cliente busca certeza y transformación, no características técnicas de producto.
3. Plan de Acción: Aplica el principio de '1.3 La fórmula de 4 pasos para anuncios convincentes'.
📂 Clase Recomendada: file:///D:/00_VELOCITY_MEDIA_VAULT/03_CURSOS/Copywriting/1.3 La fórmula de 4 pasos para que un anuncio funcione y sea convincente.mp4`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Top Bar Militar */}
      <header className="border-b border-white/10 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecb613] to-amber-600 flex items-center justify-center text-black font-black font-mono shadow-[0_0_20px_rgba(236,182,19,0.3)]">
              Ω7
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black font-mono tracking-wider text-white uppercase">
                  CENTRO DE MANDO // <span className="text-[#ecb613]">COMMAND CENTER</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LIVE S-CLASS
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Bóvedas Unificadas: Disco D: (Media) + Disco H: (Cerebro Obsidian)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>GPU: 7900 XTX 24GB</span>
              <span className="text-white/20">|</span>
              <span className="text-zinc-400">74.8k Provs</span>
            </div>
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Banner Consultora Velocity */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black to-zinc-950 border border-[#ecb613]/30 shadow-[0_0_30px_rgba(236,182,19,0.1)] relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ecb613]" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                CONSULTORA ESTRATÉGICA VELOCITY 24H (INTEGRADA)
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Haz una pregunta de negocio, ventas o copywriting a la doctrina Velocity Media
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                placeholder="Ej: ¿Cómo crear una oferta irresistible y captar atención en los primeros 3 segundos?"
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white placeholder:text-zinc-500 outline-none focus:border-[#ecb613] transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSimulateConsult((e.target as HTMLInputElement).value);
                }}
              />
              <button
                onClick={() => handleSimulateConsult("como captar atencion con hook marketing")}
                disabled={isConsulting}
                className="px-5 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isConsulting ? 'Consultando...' : 'Preguntar al Oráculo'}
              </button>
            </div>
            {oracleOutput && (
              <div className="mt-4 p-4 rounded-xl bg-black/80 border border-[#ecb613]/40 text-xs font-mono text-zinc-200 whitespace-pre-wrap animate-fadeIn">
                {oracleOutput}
              </div>
            )}
          </div>
        </div>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
            {['ALL', 'TELEMARKETING', 'AUDIT', 'INTELLIGENCE', 'HARDWARE'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filter === cat ? 'bg-[#ecb613] text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'ALL' ? 'Todas (8)' : cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Filtrar herramientas..."
            value={activeQuery}
            onChange={(e) => setActiveQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white placeholder:text-zinc-500 outline-none focus:border-[#ecb613] w-64"
          />
        </div>

        {/* Rejilla de Herramientas Centralizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map(tool => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="group relative p-5 rounded-2xl bg-[#07070a] hover:bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/50 transition-all duration-200 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:scale-[1.01]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#ecb613]/50 flex items-center justify-center text-[#ecb613] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/5">
                      {tool.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors font-mono">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-3 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                    <span className="truncate max-w-[170px]">{tool.telemetry}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {tool.status}
                    </span>
                  </div>

                  {tool.targetUrl ? (
                    <Link
                      href={tool.targetUrl}
                      className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-xs font-mono font-bold text-zinc-200 transition-all border border-white/10 hover:border-[#ecb613]"
                    >
                      <span>Abrir Herramienta</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-400 truncate text-center">
                      <code>{tool.localPath}</code>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
