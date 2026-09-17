"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Music2, Guitar, Mic2, Disc3, Check } from "lucide-react";

export interface GenreOption {
  id: string;
  name: string;
  tempo: number;
  mood: string;
  description: string;
  accent: "oro" | "cyan";
}

export const EAR_SONG_GENRES: GenreOption[] = [
  {
    id: "balada_romantica",
    name: "Balada Romántica",
    tempo: 72,
    mood: "Íntimo",
    description: "Piano y cuerda cálida para un abrazo a media luz.",
    accent: "oro",
  },
  {
    id: "mariachi_tradicional",
    name: "Mariachi Tradicional",
    tempo: 110,
    mood: "Festivo",
    description: "Trompetas y guitarrón para encender la pista.",
    accent: "oro",
  },
  {
    id: "pop_acustico",
    name: "Pop Acústico",
    tempo: 95,
    mood: "Brillante",
    description: "Guitarras luminosas con pulso contemporáneo.",
    accent: "cyan",
  },
  {
    id: "bolero_gala",
    name: "Bolero Gala",
    tempo: 80,
    mood: "Elegante",
    description: "Ritmo cadencioso para un baile de etiqueta.",
    accent: "oro",
  },
  {
    id: "vals_matrimonial",
    name: "Vals Matrimonial",
    tempo: 68,
    mood: "Orquestal",
    description: "El compás clásico de la primera danza nupcial.",
    accent: "oro",
  },
];

interface GenreSelectorProps {
  value?: string;
  onChange: (genreId: string) => void;
}

export default function GenreSelector({ value, onChange }: GenreSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(value ?? null);

  const handleSelect = (genreId: string) => {
    setSelectedId(genreId);
    onChange(genreId);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EAR_SONG_GENRES.map((genre) => {
          const isSelected = selectedId === genre.id;
          const isCyan = genre.accent === "cyan";
          const accentColor = isCyan ? "#00E5FF" : "#ecb613";

          const Icon = isCyan ? Mic2 : genre.id === "mariachi_tradicional" ? Guitar : genre.id === "vals_matrimonial" ? Disc3 : Music2;

          return (
            <motion.button
              key={genre.id}
              type="button"
              onClick={() => handleSelect(genre.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`relative p-5 rounded-2xl border text-left transition-colors ${
                isSelected
                  ? "bg-[#09090F]"
                  : "bg-[#0D0D15] hover:bg-[#101018]"
              }`}
              style={{
                borderColor: isSelected ? accentColor : "#1A1A24",
                boxShadow: isSelected ? `0 0 24px ${accentColor}22` : "none",
              }}
            >
              {/* Indicador de selección */}
              <div
                className="absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-all"
                style={{
                  borderColor: isSelected ? accentColor : "#262638",
                  backgroundColor: isSelected ? `${accentColor}1A` : "transparent",
                }}
              >
                {isSelected && <Check className="w-3.5 h-3.5" style={{ color: accentColor }} />}
              </div>

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accentColor}14`, border: `1px solid ${accentColor}33` }}
              >
                <Icon className="w-5 h-5" style={{ color: accentColor }} />
              </div>

              <h3 className="font-bold text-white text-base leading-tight">{genre.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{genre.description}</p>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#1A1A24]">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Tempo
                  </span>
                  <span className="text-sm font-mono font-bold text-white">{genre.tempo} BPM</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Carácter
                  </span>
                  <span className="text-sm font-medium" style={{ color: accentColor }}>
                    {genre.mood}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}