"use client";

import React from 'react';
import {
  Sparkles,
  Building2,
  Music2,
  Volume2,
  UtensilsCrossed,
  Camera,
  HeartHandshake,
  Bookmark,
  Layers,
  Heart
} from 'lucide-react';

export interface CategoryOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

interface CultDirectoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categories: CategoryOption[];
  onlyBookmarked: boolean;
  onToggleOnlyBookmarked: () => void;
  bookmarkedCount: number;
}

export const CultDirectoryFilterBar: React.FC<CultDirectoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
  onlyBookmarked,
  onToggleOnlyBookmarked,
  bookmarkedCount,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4">
      {/* Scrollable horizontal container */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 no-scrollbar">
        {/* Guardados Pill (Quick Filter) */}
        <button
          type="button"
          onClick={onToggleOnlyBookmarked}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all shrink-0 border ${
            onlyBookmarked
              ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-[0_0_15px_rgba(236,182,19,0.35)]'
              : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-black' : ''}`} />
          <span>Bóveda Guardada</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              onlyBookmarked ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {bookmarkedCount}
          </span>
        </button>

        <div className="h-4 w-px bg-zinc-800 shrink-0 mx-1" />

        {/* Categories List */}
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = !onlyBookmarked && selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (onlyBookmarked) onToggleOnlyBookmarked();
                onSelectCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all shrink-0 border ${
                isSelected
                  ? 'bg-zinc-800 text-[#ecb613] border-[#ecb613]/60 font-bold shadow-[0_0_12px_rgba(236,182,19,0.2)]'
                  : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#ecb613]' : 'text-zinc-400'}`} />
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-[#ecb613]/20 text-[#ecb613]' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {cat.count > 999 ? `${(cat.count / 1000).toFixed(1)}k` : cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
