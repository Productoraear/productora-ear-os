"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Target, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Database, FileText, Activity, Lock, Unlock, AlertOctagon } from 'lucide-react';

interface MissionState {
  isImplemented: boolean;
  isValidated: boolean;
  isDocumented: boolean;
}

/**
 * 🏛️ V101 GOVERNANCE CORE
 * Fórmula ponderada para el cálculo de la deriva (Drift).
 */
export const calculateDriftScore = (state: MissionState): number => {
  const weights = { implemented: 0.4, validated: 0.4, documented: 0.2 };
  let score = 0;
  if (state.isImplemented) score += weights.implemented;
  if (state.isValidated) score += weights.validated;
  if (state.isDocumented) score += weights.documented;
  return score * 100;
};

interface Milestone extends MissionState {
  phase: number;
  title: string;
  progress: number;
  status: 'HECHO' | 'EN_PROCESO' | 'PENDIENTE' | 'BLOQUEADO' | 'CUARENTENA';
  risk?: string;
  nextAction?: string;
  evidence?: string;
  impactScore: number;
  source: 'SSOT' | 'RUNTIME';
  isNecrosisFixed?: boolean;
}

const milestones: Milestone[] = [
  { phase: 0, title: "Blindaje", progress: 100, status: 'HECHO', isImplemented: true, isValidated: true, isDocumented: true, impactScore: 100, source: 'SSOT' },
  { phase: 1, title: "Soberanía de Datos", progress: 100, status: 'HECHO', isImplemented: true, isValidated: true, isDocumented: true, impactScore: 100, source: 'SSOT' },
  { phase: 2, title: "Purificación Estructural", progress: 100, status: 'HECHO', isImplemented: true, isValidated: true, isDocumented: true, impactScore: 100, source: 'SSOT' },
  { phase: 3, title: "Absorción Heredada", progress: 98, status: 'EN_PROCESO', isImplemented: true, isValidated: false, isDocumented: true, impactScore: 90, source: 'RUNTIME', risk: "Falta Smoke Test funcional de CategoryRouter", nextAction: "Validar Toggles / Kill Switches", isNecrosisFixed: true },
  { phase: 4, title: "Motor Financiero", progress: 35, status: 'EN_PROCESO', isImplemented: true, isValidated: false, isDocumented: false, impactScore: 80, source: 'RUNTIME', risk: "Estado: PREPARED_NOT_AUTHORIZED", nextAction: "Bloqueado por Drift Gate de Fase 3" },
  { phase: 5, title: "UX / Checkout", progress: 5, status: 'PENDIENTE', isImplemented: false, isValidated: false, isDocumented: false, impactScore: 70, source: 'SSOT' },
  { phase: 6, title: "RAG & Astra", progress: 25, status: 'PENDIENTE', isImplemented: true, isValidated: false, isDocumented: false, impactScore: 85, source: 'SSOT' },
  { phase: 7, title: "SEO & Release", progress: 10, status: 'PENDIENTE', isImplemented: false, isValidated: false, isDocumented: false, impactScore: 95, source: 'SSOT' }
];

const DriftDetector: React.FC = () => {
    return (
        <div className="bg-[#d4a855]/5 border border-[#d4a855]/20 rounded-[1.5rem] p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#d4a855] animate-pulse" />
            <div className="flex items-center gap-5 relative z-10">
                <div className="p-3 bg-[#d4a855]/10 rounded-xl text-[#d4a855] shadow-[0_0_20px_rgba(212,168,85,0.1)]">
                    <Zap size={22} className="animate-pulse" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">V101 Drift Detector</h4>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
                        SSOT Alignment: <span className="text-green-400">98.4%</span>
                    </p>
                </div>
            </div>
            <div className="flex gap-3 relative z-10">
                {[
                    { label: 'SSOT', ok: true },
                    { label: 'TSC', ok: true },
                    { label: 'LINT', ok: true },
                    { label: 'BUILD', ok: true }
                ].map(gate => (
                    <div key={gate.label} className="flex items-center gap-2 px-3 py-2 bg-black/60 rounded-xl border border-white/5 hover:border-[#d4a855]/30 transition-all">
                        <div className={`w-1.5 h-1.5 rounded-full ${gate.ok ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'} animate-pulse`} />
                        <span className="text-[9px] font-black text-white/60 tracking-tighter uppercase">{gate.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StateIndicator: React.FC<{ active: boolean; icon: LucideIcon; label: string }> = ({ active, icon: Icon, label }) => (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border transition-all ${active ? 'bg-[#d4a855]/10 border-[#d4a855]/30 text-[#d4a855]' : 'bg-black/20 border-white/5 text-white/10'}`}>
        <Icon size={10} className={active ? 'text-[#d4a855]' : ''} />
        <span className="text-[7px] font-black uppercase tracking-widest">{label}</span>
    </div>
);

export const NexusMissionTracker: React.FC = () => {
  const totalProgress = Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length);

  return (
    <div className="glass-pane p-8 border-[#d4a855]/10 backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#d4a855]/5 blur-[120px] rounded-full pointer-events-none" />

      <DriftDetector />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck size={16} className="text-[#d4a855]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855]">SSOT Deterministic Engine</h2>
          </div>
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">
            Governance V101 <span className="text-white/10 font-serif italic lowercase tracking-normal">omega</span>
          </h3>
        </div>
        <div className="flex items-center gap-8 bg-black/40 p-5 rounded-2xl border border-white/5">
            <div className="text-right">
                <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.3em] mb-2">Global Authority</p>
                <div className="text-5xl font-black text-white tracking-tighter leading-none">{totalProgress}%</div>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-[#d4a855] flex items-center justify-center relative">
                <Activity size={16} className="text-[#d4a855] animate-pulse" />
            </div>
        </div>
      </div>

      <div className="space-y-12 relative z-10">
        {milestones.map((m) => {
          const driftScore = calculateDriftScore({ isImplemented: m.isImplemented, isValidated: m.isValidated, isDocumented: m.isDocumented });
          const isBlocked = m.phase === 4 && milestones[3].isValidated === false;

          return (
            <div key={m.phase} className={`group relative ${isBlocked ? 'opacity-50' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-5">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <span className="text-[14px] font-black text-white/10 w-8 font-mono tracking-tighter block">0{m.phase}</span>
                    {isBlocked && <Lock size={10} className="absolute top-0 -right-2 text-red-500 animate-pulse" />}
                  </div>
                  <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-[#d4a855] transition-colors">{m.title}</h4>
                          {m.status === 'HECHO' && <CheckCircle2 className="text-[#d4a855]" size={16} />}
                          {m.isNecrosisFixed && (
                              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-[7px] text-green-400 font-black uppercase tracking-widest">
                                  Necrosis Saneada
                              </div>
                          )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[8px] text-white/20 uppercase font-black tracking-[0.2em]">Source: {m.source}</span>
                          <span className="text-[8px] text-[#d4a855]/40 uppercase font-black tracking-[0.2em]">Impact: {m.impactScore}</span>
                      </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Drift Score Display */}
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                      <div className="text-[8px] font-black text-white/30 uppercase tracking-widest">Drift Score:</div>
                      <div className={`text-[10px] font-black ${driftScore === 100 ? 'text-green-400' : 'text-[#d4a855]'}`}>{driftScore}%</div>
                  </div>
                  {/* Triple State Matrix */}
                  <div className="flex gap-2">
                    <StateIndicator active={m.isImplemented} icon={Database} label="Imp" />
                    <StateIndicator active={m.isValidated} icon={Zap} label="Val" />
                    <StateIndicator active={m.isDocumented} icon={FileText} label="Doc" />
                  </div>
                </div>
              </div>
              
              <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${m.progress}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={`h-full ${m.status === 'HECHO' ? 'bg-[#d4a855]' : 'bg-[#d4a855]/60'} relative`}
                  >
                      {m.status === 'EN_PROCESO' && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      )}
                  </motion.div>
              </div>

              {m.status === 'EN_PROCESO' && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 pl-14 border-l border-white/5 ml-[46px]">
                      {m.risk && (
                          <div className="space-y-2">
                              <p className="text-[9px] text-red-400/40 uppercase font-black tracking-[0.3em] flex items-center gap-2">
                                  <AlertOctagon size={10} /> Forensic Warning
                              </p>
                              <p className="text-[11px] text-white/40 font-bold tracking-tight leading-relaxed italic">"{m.risk}"</p>
                          </div>
                      )}
                      {m.nextAction && (
                          <div className="space-y-2">
                              <p className="text-[9px] text-blue-400/40 uppercase font-black tracking-[0.3em] flex items-center gap-2">
                                  <Target size={10} /> Deterministic Directive
                              </p>
                              <p className="text-[11px] text-white/70 font-black uppercase tracking-tighter leading-tight">{m.nextAction}</p>
                          </div>
                      )}
                  </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 opacity-40">
            <ShieldCheck size={14} className="text-[#d4a855]" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
                SSOT AUTHORITY RECONCILED • V101 OMEGA
            </p>
        </div>
        <div className="glass-pane px-6 py-2 border-[#d4a855]/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Fase 4: Prepared / Not Authorized</span>
        </div>
      </div>
    </div>
  );
};
