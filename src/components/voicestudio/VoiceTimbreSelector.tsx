"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Mic2, Check, Sparkles, Radio } from "lucide-react";
import { EAR_VOICE_PROFILES, type VoiceProfile } from "@/lib/audio/voiceStudioEngine";

const SAMPLE_LIMIT_SECONDS = 15;

interface VoiceTimbreOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  sampleAudio?: string;
  accent: "#ecb613" | "#00E5FF";
  profile?: VoiceProfile;
}

const EDWIN_PROFILE = EAR_VOICE_PROFILES.find((p) => p.id === "edwin_agudelo_gala");
const SOPRANO_PROFILE = EAR_VOICE_PROFILES.find((p) => p.id === "ceremonial_hostess");
const DUO_SAMPLE = EAR_VOICE_PROFILES.find((p) => p.id === "edwin_agudelo_vimume")?.sampleAudio;

const TIMBRE_OPTIONS: VoiceTimbreOption[] = [
  {
    id: "edwin_gala",
    name: "Edwin Agudelo",
    subtitle: "Voz Lírica / Gala",
    description:
      EDWIN_PROFILE?.description ??
      "Timbre soberano de Edwin Agudelo para baladas, boleros y dedicatorias de boda.",
    sampleAudio: EDWIN_PROFILE?.sampleAudio,
    accent: "#ecb613",
    profile: EDWIN_PROFILE,
  },
  {
    id: "duo_armonico",
    name: "Dúo Armónico",
    subtitle: "Edwin + Soprano",
    description:
      "Mezcla estereofónica de la voz líder de Edwin con una soprano ceremonial para un cierre coral inolvidable.",
    sampleAudio: DUO_SAMPLE,
    accent: "#00E5FF",
    profile: SOPRANO_PROFILE,
  },
];

interface VoiceTimbreSelectorProps {
  value?: string;
  onChange: (timbreId: string) => void;
}

export default function VoiceTimbreSelector({ value, onChange }: VoiceTimbreSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(value ?? null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayingId(null);
    setProgress(0);
  };

  const togglePlayback = (option: VoiceTimbreOption) => {
    if (!option.sampleAudio) return;

    if (playingId === option.id) {
      stopAudio();
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = option.sampleAudio;
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => setPlayingId(option.id)).catch(() => setPlayingId(null));
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const ratio = Math.min(audio.currentTime / SAMPLE_LIMIT_SECONDS, 1);
    setProgress(ratio * 100);
    if (audio.currentTime >= SAMPLE_LIMIT_SECONDS) {
      stopAudio();
    }
  };

  const handleSelect = (option: VoiceTimbreOption) => {
    setSelectedId(option.id);
    onChange(option.id);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIMBRE_OPTIONS.map((option) => {
          const isSelected = selectedId === option.id;
          const isPlaying = playingId === option.id;
          const accent = option.accent;

          return (
            <motion.div
              key={option.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`p-5 rounded-2xl border transition-colors cursor-pointer ${
                isSelected ? "bg-[#09090F]" : "bg-[#0D0D15] hover:bg-[#101018]"
              }`}
              style={{
                borderColor: isSelected ? accent : "#1A1A24",
                boxShadow: isSelected ? `0 0 24px ${accent}22` : "none",
              }}
              onClick={() => handleSelect(option)}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${accent}14`, border: `1px solid ${accent}33` }}
                >
                  <Mic2 className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div
                  className="w-6 h-6 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    borderColor: isSelected ? accent : "#262638",
                    backgroundColor: isSelected ? `${accent}1A` : "transparent",
                  }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" style={{ color: accent }} />}
                </div>
              </div>

              <h3 className="font-bold text-white text-lg leading-tight">{option.name}</h3>
              <p className="text-xs font-mono uppercase tracking-wider mt-0.5" style={{ color: accent }}>
                {option.subtitle}
              </p>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{option.description}</p>

              {/* Muestra de audio (máx 15s) */}
              <div className="mt-4 pt-4 border-t border-[#1A1A24]">
                {option.sampleAudio ? (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlayback(option);
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all shrink-0"
                      style={{
                        backgroundColor: isPlaying ? accent : `${accent}1A`,
                        color: isPlaying ? "#050507" : accent,
                        border: `1px solid ${accent}55`,
                      }}
                      aria-label={isPlaying ? "Pausar muestra" : "Reproducir muestra"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[1px]" />}
                    </button>
                    <div className="flex-1 h-1.5 rounded-full bg-[#1A1A24] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${isPlaying || (isSelected && progress > 0) ? progress : 0}%`,
                          backgroundColor: accent,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      15s
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <Radio className="w-3.5 h-3.5" />
                    DAEMON LOCAL REQUERIDO
                  </div>
                )}
              </div>

              {option.profile?.isMasterProfile && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <Sparkles className="w-3 h-3" style={{ color: accent }} />
                  Master Profile
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Reproductor único compartido */}
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={stopAudio} className="hidden" />
    </div>
  );
}