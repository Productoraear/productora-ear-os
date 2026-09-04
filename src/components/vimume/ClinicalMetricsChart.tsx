'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Microscope, 
  Award, 
  Download 
} from 'lucide-react';

interface MetricDataPoint {
  id: string;
  name: string;
  shortName: string;
  baseline: number;
  intervention: number;
  unit: string;
  deltaPct: number;
  isReductionPositive: boolean;
  pValue: string;
  instrument: string;
  clinicalSignificance: string;
}

const CLINICAL_DATA: MetricDataPoint[] = [
  {
    id: 'cmai',
    name: 'Agitación Psicomotriz (CMAI)',
    shortName: 'Agitación (CMAI)',
    baseline: 48.2,
    intervention: 29.8,
    unit: 'puntos',
    deltaPct: -38.2,
    isReductionPositive: true,
    pValue: 'p < 0.001',
    instrument: 'Inventario de Cohen-Mansfield',
    clinicalSignificance: 'Desaparición de deambulación errante y agresividad verbal en el 82% de la cohorte.'
  },
  {
    id: 'drugs',
    name: 'Fármacos de Rescate Psicotrópico',
    shortName: 'Fármacos Rescate',
    baseline: 0.85,
    intervention: 0.22,
    unit: 'tomas/día',
    deltaPct: -74.1,
    isReductionPositive: true,
    pValue: 'p < 0.05',
    instrument: 'Registro Clínico Farmacológico',
    clinicalSignificance: 'Erradicación del Síndrome del Ocaso (Sundowning) sin necesidad de sujeción química.'
  },
  {
    id: 'social',
    name: 'Conexión Social y Sonrisa Espontánea',
    shortName: 'Conexión Social',
    baseline: 18.4,
    intervention: 74.6,
    unit: '% respuesta',
    deltaPct: +305.4,
    isReductionPositive: false,
    pValue: 'p < 0.01',
    instrument: 'Escala DCM de Demencia',
    clinicalSignificance: 'Reactivación de la mirada, seguimiento rítmico y reconocimiento familiar.'
  },
  {
    id: 'sroi',
    name: 'Retorno Social Inversión (SROI)',
    shortName: 'Ratio SROI',
    baseline: 1.0,
    intervention: 4.85,
    unit: '€ por 1€',
    deltaPct: +385.0,
    isReductionPositive: false,
    pValue: 'p < 0.001',
    instrument: 'Marco Metodológico SROI Global',
    clinicalSignificance: '4.85 € de ahorro en cuidados intensivos y fármacos por cada euro invertido.'
  }
];

export const ClinicalMetricsChart: React.FC = () => {
  const [activeMetricId, setActiveMetricId] = useState<string>('cmai');
  const [viewMode, setViewMode] = useState<'comparison' | 'normalized'>('comparison');

  const activeMetric = CLINICAL_DATA.find((m) => m.id === activeMetricId) || CLINICAL_DATA[0];

  // Datos normalizados a base 100 para comparar todo en una sola vista
  const normalizedData = CLINICAL_DATA.map((item) => ({
    name: item.shortName,
    'Antes de VIMUME': 100,
    'Tras VIMUME': Math.round(100 + item.deltaPct),
    unit: '% relativo',
    rawItem: item
  }));

  // Datos absolutos de la métrica individual seleccionada
  const singleMetricData = [
    {
      name: 'Estado Previo',
      valor: activeMetric.baseline,
      fill: '#AAD6CD',
      unit: activeMetric.unit
    },
    {
      name: 'Protocolo VIMUME',
      valor: activeMetric.intervention,
      fill: '#8b5cf6',
      unit: activeMetric.unit
    }
  ];

  return (
    <div className="rounded-[2.5rem] bg-gradient-to-b from-[#08080d] via-[#050508] to-black border border-[#AAD6CD]/30 p-6 sm:p-10 space-y-8 shadow-[0_0_80px_rgba(170,214,205,0.08)] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#AAD6CD]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[#AAD6CD] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Microscope size={13} />
            <span>ESTUDIO CLÍNICO PILOTO N = 45 // 5 CENTROS RESIDENCIALES</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
            Dashboard Clínico <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#AAD6CD] via-[#8b5cf6] to-[#ecb613]">Interactible (Recharts)</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
            Visualización estadística de alta resolución. Comprueba empíricamente el impacto del protocolo de 40 Hz Gamma frente al tratamiento estándar.
          </p>
        </div>

        {/* Selector de Modo de Vista */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode('comparison')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              viewMode === 'comparison'
                ? 'bg-[#AAD6CD] text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Foco Clínico Individual
          </button>
          <button
            type="button"
            onClick={() => setViewMode('normalized')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold ${
              viewMode === 'normalized'
                ? 'bg-[#8b5cf6] text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Visión Comparativa Global
          </button>
        </div>
      </div>

      {/* Quick Selectors Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {CLINICAL_DATA.map((item) => {
          const isSelected = activeMetricId === item.id;
          const isPositiveChange = item.isReductionPositive ? item.deltaPct < 0 : item.deltaPct > 0;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveMetricId(item.id);
                setViewMode('comparison');
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#8b5cf6]/20 to-black border-[#8b5cf6] shadow-[0_0_30px_rgba(139,92,246,0.25)] scale-[1.02]'
                  : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                  {item.instrument.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#AAD6CD] font-bold">
                  {item.pValue}
                </span>
              </div>

              <div className="text-sm font-black text-white font-syne mb-1 truncate">
                {item.shortName}
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-mono font-black ${isPositiveChange ? 'text-emerald-400' : 'text-[#8b5cf6]'}`}>
                  {item.deltaPct > 0 ? `+${item.deltaPct.toFixed(1)}%` : `${item.deltaPct.toFixed(1)}%`}
                </span>
                {item.deltaPct < 0 ? (
                  <TrendingDown size={16} className="text-emerald-400 inline" />
                ) : (
                  <TrendingUp size={16} className="text-[#8b5cf6] inline" />
                )}
              </div>

              <div className="text-[10px] text-zinc-400 mt-2 line-clamp-1">
                {item.baseline} {item.unit} → {item.intervention} {item.unit}
              </div>
            </button>
          );
        })}
      </div>

      {/* Recharts Canvas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pt-2">
        
        {/* Gráfico Recharts (7 cols) */}
        <div className="lg:col-span-7 bg-black/60 border border-white/10 p-5 sm:p-6 rounded-3xl h-[340px] flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 pb-2 border-b border-white/5">
            <span>
              {viewMode === 'comparison'
                ? `Métrica: ${activeMetric.name}`
                : 'Comparativa Normalizada (Base 100)'}
            </span>
            <span className="text-[#AAD6CD] font-bold">INTERVALO CONFIANZA 95%</span>
          </div>

          <div className="w-full h-[260px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'comparison' ? (
                <BarChart data={singleMetricData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#a1a1aa" 
                    fontSize={11} 
                    fontFamily="monospace" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    fontSize={11} 
                    fontFamily="monospace" 
                    tickLine={false} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 rounded-xl bg-black/90 border border-white/20 shadow-2xl text-xs font-mono">
                            <span className="text-zinc-400 block">{data.name}</span>
                            <span className="text-lg font-bold text-white block mt-0.5">
                              {data.valor} {data.unit}
                            </span>
                            <span className="text-[10px] text-[#AAD6CD] block mt-1 font-sans">
                              {activeMetric.instrument}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="valor" radius={[12, 12, 0, 0]} barSize={58}>
                    {singleMetricData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill} 
                        style={{ filter: `drop-shadow(0px 0px 8px ${entry.fill}66)` }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart data={normalizedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#a1a1aa" 
                    fontSize={10} 
                    fontFamily="monospace" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#a1a1aa" 
                    fontSize={11} 
                    fontFamily="monospace" 
                    tickLine={false} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const raw = payload[0].payload.rawItem as MetricDataPoint;
                        return (
                          <div className="p-3.5 rounded-xl bg-black/95 border border-[#8b5cf6]/40 shadow-2xl text-xs font-mono space-y-1">
                            <span className="text-white font-bold block">{raw.name}</span>
                            <div className="text-[#AAD6CD]">Pre-VIMUME: {raw.baseline} {raw.unit}</div>
                            <div className="text-[#8b5cf6]">Post-VIMUME: {raw.intervention} {raw.unit}</div>
                            <div className="text-emerald-400 font-bold pt-1 border-t border-white/10">
                              Variación: {raw.deltaPct > 0 ? `+${raw.deltaPct}%` : `${raw.deltaPct}%`} ({raw.pValue})
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} 
                  />
                  <Bar dataKey="Antes de VIMUME" fill="#AAD6CD" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="Tras VIMUME" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ficha Clínica Detallada (5 cols) */}
        <div className="lg:col-span-5 space-y-5 rounded-3xl bg-black/50 border border-white/10 p-6 sm:p-7">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold tracking-widest">
              DICTAMEN TERAPÉUTICO
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
              {activeMetric.pValue} (Estadísticamente Significativo)
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xl sm:text-2xl font-black text-white font-syne uppercase">
              {activeMetric.name}
            </h4>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              {activeMetric.clinicalSignificance}
            </p>
          </div>

          {/* Comparativa Numérica Destacada */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase block">Sin Estimulación</span>
              <span className="text-lg font-mono font-bold text-[#AAD6CD]">
                {activeMetric.baseline} <span className="text-xs font-normal text-zinc-400">{activeMetric.unit}</span>
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-zinc-500 uppercase block">Con VIMUME (40Hz)</span>
              <span className="text-lg font-mono font-bold text-[#8b5cf6]">
                {activeMetric.intervention} <span className="text-xs font-normal text-zinc-400">{activeMetric.unit}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2 text-[11px] font-mono text-zinc-400 pt-1">
            <div className="flex items-center justify-between">
              <span>Instrumento Validador:</span>
              <span className="text-white font-bold">{activeMetric.instrument}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Muestra Homologada:</span>
              <span className="text-white font-bold">N=45 Pacientes (GDS 4 a 6)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Duración del Ciclo:</span>
              <span className="text-white font-bold">8 Semanas (2 sesiones/semana)</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#portal"
              className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Award size={14} className="text-[#ecb613]" />
              <span>Solicitar Dossier Clínico Completo</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
