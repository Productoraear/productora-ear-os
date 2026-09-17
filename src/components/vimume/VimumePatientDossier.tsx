'use client';

import React, { useMemo, useState } from 'react';
import {
  UserRound,
  HeartPulse,
  TrendingDown,
  Trophy,
  Music4,
  Activity,
  CalendarClock,
  Brain,
  ShieldCheck,
  type LucideIcon
} from 'lucide-react';
import {
  VimumePatientRecord,
  computeDescalationAnalytics,
  isGammaAligned,
  VIMUME_SENIOR_SSOT,
  ClinicalMilestoneType
} from '@/lib/vimume/vimumePatientEngine';

interface VimumePatientDossierProps {
  patient: VimumePatientRecord;
  className?: string;
}

const MILESTONE_META: Record<ClinicalMilestoneType, { label: string; icon: LucideIcon; accent: string }> = {
  SPEECH_RECOVERY: { label: 'Habla Recuperada', icon: Brain, accent: '#00E5FF' },
  CMAI_REDUCTION: { label: 'Reducción Agitación', icon: TrendingDown, accent: '#8b5cf6' },
  PSYCHOTROPIC_DESCALATION: { label: 'Desescalada Fármacos', icon: ShieldCheck, accent: '#10B981' },
  MOTOR_REACTIVATION: { label: 'Reactivación Motora', icon: Activity, accent: '#ecb613' },
  SOCIAL_RECONNECTION: { label: 'Reconexión Social', icon: HeartPulse, accent: '#FF2B44' },
  SLEEP_REGULATION: { label: 'Regulación del Sueño', icon: CalendarClock, accent: '#AAD6CD' },
  EMOTIONAL_WELLBEING: { label: 'Bienestar Emocional', icon: HeartPulse, accent: '#ecb613' },
  COGNITIVE_STIMULATION: { label: 'Estimulación Cognitiva', icon: Brain, accent: '#00E5FF' }
};

/**
 * 📋 VIMUME PATIENT DOSSIER
 * Ficha clínica interactiva con dashboard de progreso, timeline de hitos
 * y reproductor de la Banda Sonora Vital™ (10 temas biográficos anclados
 * a 40 Hz gamma y a la franja biográfica de 15-25 años).
 */
export default function VimumePatientDossier({ patient, className = '' }: VimumePatientDossierProps) {
  const analytics = useMemo(() => computeDescalationAnalytics(patient), [patient]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(
    patient.vitalSoundtrack[0]?.id ?? null
  );

  const activeTrack = patient.vitalSoundtrack.find((t) => t.id === selectedTrack) ?? null;

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-[#8b5cf6]/25 bg-[#030305] p-6 text-white ${className}`}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#8b5cf6]/10 blur-[120px] pointer-events-none" />
      <div className="relative z-10 space-y-6">
        {/* Cabecera del paciente */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30">
              <UserRound className="w-8 h-8 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-[#8b5cf6] font-bold">
                Expediente Clínico Anonimizado
              </p>
              <h3 className="text-2xl font-black font-syne tracking-tight">{patient.patientAlias}</h3>
              <p className="text-xs text-zinc-400 font-sans">
                {patient.age} años · {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'No binario'} · {patient.centerName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Estadio</p>
              <p className="text-sm font-mono font-bold text-[#ecb613]">{patient.stage.replace(/_/g, ' ')}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/40 flex items-center justify-center">
              <span className="font-mono font-black text-[#ecb613]">{analytics.treatmentProgressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Dashboard de progreso */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="CMAI Basal" value={String(analytics.baselineCmai)} suffix="/100" accent="#ecb613" icon={Activity} />
          <MetricCard label="CMAI Actual" value={String(analytics.currentCmai)} suffix="/100" accent="#00E5FF" icon={TrendingDown} />
          <MetricCard label="Reducción Agitación" value={`${analytics.cmaiDeltaPercent}%`} accent="#10B981" icon={ShieldCheck} />
          <MetricCard label="Retorno SROI" value={`${analytics.sroiReturn}x`} accent="#8b5cf6" icon={HeartPulse} />
        </div>

        {/* Timeline de hitos */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-zinc-300 font-bold mb-3">
            <Trophy className="w-4 h-4 text-[#ecb613]" />
            Hitos Clínicos Mayores
          </h4>
          {patient.milestones.length === 0 ? (
            <p className="text-xs text-zinc-500 font-mono">Sin hitos registrados todavía. Graba la primera evidencia de recuperación desde la consola del terapeuta.</p>
          ) : (
            <div className="space-y-2">
              {patient.milestones.map((milestone) => {
                const meta = MILESTONE_META[milestone.type] ?? MILESTONE_META.CMAI_REDUCTION;
                const Icon = meta.icon;
                return (
                  <div key={milestone.id} className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/10">
                    <div className="p-2 rounded-xl border" style={{ borderColor: `${meta.accent}40`, background: `${meta.accent}10` }}>
                      <Icon className="w-4 h-4" style={{ color: meta.accent }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-mono font-bold text-white">{milestone.title}</span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {new Date(milestone.achievedAt).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Banda Sonora Vital */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-zinc-300 font-bold mb-3">
            <Music4 className="w-4 h-4 text-[#00E5FF]" />
            Banda Sonora Vital™ · {VIMUME_SENIOR_SSOT.VITAL_SOUNDTRACK_TRACKS} temas · {VIMUME_SENIOR_SSOT.VITAL_SOUNDTRACK_AGE_RANGE} años
          </h4>

          {activeTrack ? (
            <div className="rounded-2xl bg-gradient-to-b from-[#0b0b14] to-[#030305] border border-[#00E5FF]/20 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white font-sans">{activeTrack.title}</p>
                  <p className="text-[11px] text-zinc-400 font-sans">{activeTrack.artist} · {activeTrack.genre}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-mono font-bold">
                  {activeTrack.frequencyHz} Hz · {activeTrack.bpm} BPM
                </span>
              </div>

              {activeTrack.sourceUrl ? (
                <audio controls className="w-full h-9" src={activeTrack.sourceUrl}>
                  Tu navegador no soporta el elemento de audio.
                </audio>
              ) : (
                <p className="text-[11px] font-mono text-[#ecb613]">
                  Pista biográfica pendiente de activo de audio (catálogo maestro VIMUME).
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {patient.vitalSoundtrack.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => setSelectedTrack(track.id)}
                    title={track.title}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-colors ${
                      track.id === selectedTrack
                        ? 'bg-[#00E5FF]/20 border border-[#00E5FF]/50 text-white'
                        : 'bg-white/[0.02] border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {String(track.position).padStart(2, '0')}
                    {isGammaAligned(track) ? ' ⚡' : ''}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono">
              Banda Sonora Vital™ pendiente de generación para {patient.patientAlias}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  accent,
  icon: Icon
}: {
  label: string;
  value: string;
  suffix?: string;
  accent: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">{label}</span>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="text-2xl font-mono font-black" style={{ color: accent }}>
        {value}
        {suffix && <span className="text-xs font-normal text-zinc-500"> {suffix}</span>}
      </div>
    </div>
  );
}