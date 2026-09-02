"use client";
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Zap, Layers, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────
// DATOS DEL ROADMAP — Sincronizado con IMPERIUM_OMEGA_ROADMAP.md
// ─────────────────────────────────────────────────────
interface NivelCascada {
  nivel: number;
  nombre: string;
  anchor: string;
  estado: 'ONLINE' | 'EN_PROGRESO' | 'PENDIENTE';
  descripcion: string;
  archivosClave: string[];
}

const NIVELES_CASCADA: NivelCascada[] = [
  { nivel: 1, nombre: 'Soberanía', anchor: 'auth_nexus_sovereignty', estado: 'ONLINE', descripcion: 'Firebase Auth + Sincronización Supabase JWT', archivosClave: ['auth_nexus.ts', 'AuthContext.tsx'] },
  { nivel: 2, nombre: 'Inteligencia', anchor: 'vampire_rag_intelligence', estado: 'ONLINE', descripcion: 'Extracción competitiva + RAG semántico (25MB ZK)', archivosClave: ['ghost_hunter.ts', 'ear-rag-database.json'] },
  { nivel: 3, nombre: 'Nervio Central', anchor: 'command_center_nerve', estado: 'ONLINE', descripcion: 'Centro de Mando Fénix (Hub del CEO)', archivosClave: ['EarCommandCenter.tsx', 'NexusRealCockpit.tsx'] },
  { nivel: 4, nombre: 'Logística', anchor: 'logistics_bespoke_fleet', estado: 'ONLINE', descripcion: 'Configurador Bespoke + Gestión de Flota VIP', archivosClave: ['BespokeConfigurator.tsx', 'FleetTracker.tsx'] },
  { nivel: 5, nombre: 'CRM & Dominancia', anchor: 'crm_expansion_dominance', estado: 'ONLINE', descripcion: 'Matriz de Soberanos + Tripwire Ledger', archivosClave: ['ExpansionDashboard.tsx', 'FinancialPanel.tsx'] },
  { nivel: 6, nombre: 'Seguimiento Táctico', anchor: 'tactical_progress_tracker', estado: 'ONLINE', descripcion: 'Gobernanza visual con Puntos de Anclaje', archivosClave: ['TacticalTracker.tsx'] },
  { nivel: 7, nombre: 'Generación Demanda', anchor: 'demand_generation_autonomous', estado: 'ONLINE', descripcion: 'Campañas y funnels autónomos (AEO & Hummingbird)', archivosClave: ['HummingbirdFlight.tsx', 'NeuralJourneyApex.tsx'] },
  { nivel: 8, nombre: 'Red de Alianzas', anchor: 'alliance_affiliate_network', estado: 'ONLINE', descripcion: 'Red de proveedores y catálogo nacional ZK', archivosClave: ['vampire_public_catalog_zk.json'] },
  { nivel: 9, nombre: 'IA Predictiva', anchor: 'predictive_analytics_astra', estado: 'ONLINE', descripcion: 'Gemelo Neural Astra & Telemetría Acústica', archivosClave: ['weddingMatchEngine.ts', 'pricing-engine.ts'] },
  { nivel: 10, nombre: 'Dominancia Total', anchor: 'total_dominance_autonomous', estado: 'ONLINE', descripcion: 'Imperio autónomo operando en piloto automático', archivosClave: ['SovereignNavbar.tsx', 'ThreeDoors.tsx'] },
];

const configuracionEstado = {
  ONLINE: { icono: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', borde: 'border-green-500/30', etiqueta: 'ONLINE', brillo: 'shadow-green-500/20' },
  EN_PROGRESO: { icono: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', borde: 'border-amber-500/30', etiqueta: 'EN PROGRESO', brillo: 'shadow-amber-500/20' },
  PENDIENTE: { icono: Circle, color: 'text-white/20', bg: 'bg-white/[0.02]', borde: 'border-white/5', etiqueta: 'PENDIENTE', brillo: '' },
};

function NodoNivel({ nivel, indice }: { nivel: NivelCascada; indice: number }) {
  const config = configuracionEstado[nivel.estado];
  const IconoEstado = config.icono;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: indice * 0.06, duration: 0.4 }}
      className={`relative p-4 rounded-xl ${config.bg} border ${config.borde} ${config.brillo} shadow-lg group hover:scale-[1.02] transition-transform cursor-pointer`}
    >
      {/* Línea conectora */}
      {indice < NIVELES_CASCADA.length - 1 && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-px h-4 bg-white/10" />
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-lg ${config.bg}`}>
            <IconoEstado size={14} className={config.color} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-white/20 tracking-widest">NIVEL {nivel.nivel}</span>
              <ChevronRight size={8} className="text-white/10" />
              <span className={`text-xs font-black uppercase tracking-wider ${config.color}`}>
                {nivel.nombre}
              </span>
            </div>
            <p className="text-[10px] text-white/30 mt-0.5">{nivel.descripcion}</p>
            {nivel.archivosClave.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {nivel.archivosClave.map((f, i) => (
                  <span key={i} className="text-[8px] font-mono bg-white/[0.03] px-1.5 py-0.5 rounded text-white/20">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
          {config.etiqueta}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL: SEGUIMIENTO TÁCTICO
// ─────────────────────────────────────────────────────
export function TacticalTracker() {
  const progreso = useMemo(() => {
    const online = NIVELES_CASCADA.filter(l => l.estado === 'ONLINE').length;
    const enProgreso = NIVELES_CASCADA.filter(l => l.estado === 'EN_PROGRESO').length;
    const total = NIVELES_CASCADA.length;
    const pct = Math.round(((online + enProgreso * 0.5) / total) * 100);
    return { online, enProgreso, pendiente: total - online - enProgreso, total, pct };
  }, []);

  return (
    <div className="glass-pane p-6 space-y-6">
      {/* Cabecera */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={16} className="text-[#d4a855]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4a855] font-black">Imperio Omega</span>
          </div>
          <h3 className="text-lg font-black uppercase tracking-tight">
            SEGUIMIENTO <span className="text-[#d4a855]">TÁCTICO</span>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-[#d4a855]">{progreso.pct}%</p>
          <p className="text-[9px] text-white/30 uppercase tracking-wider">Dominancia Global</p>
        </div>
      </div>

      {/* Barra de Progreso Soberana */}
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progreso.pct}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full relative"
            style={{ background: 'linear-gradient(90deg, #d4a855, #f0d78c, #d4a855)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />
          </motion.div>
        </div>
        <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/20">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>{progreso.online} Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{progreso.enProgreso} En Progreso</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span>{progreso.pendiente} Pendientes</span>
          </div>
        </div>
      </div>

      {/* Árbol de Cascada */}
      <div className="space-y-3">
        {NIVELES_CASCADA.map((nivel, indice) => (
          <NodoNivel key={nivel.nivel} nivel={nivel} indice={indice} />
        ))}
      </div>

      {/* Pie Forense */}
      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
        <p className="text-[8px] text-white/15 uppercase tracking-widest">
          Fuente: IMPERIUM_OMEGA_ROADMAP.md
        </p>
        <div className="flex items-center gap-1.5">
          <Zap size={10} className="text-[#d4a855]" />
          <span className="text-[8px] text-[#d4a855] font-bold uppercase tracking-wider">
            Sincronización: Tiempo Real
          </span>
        </div>
      </div>
    </div>
  );
}

export default TacticalTracker;
