"use client";

import React, { useState } from 'react';
import { UserRole, VisionCardData, ImpactNugget } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { 
  PhotoIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface VisionBoardToolProps {
  userRole: UserRole;
  onComplete: (data?: any) => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
  initialVisions?: VisionCardData[];
}

export const VisionBoardTool: React.FC<VisionBoardToolProps> = ({
  userRole,
  onComplete,
  initialVisions = []
}) => {
  const { t } = useTranslations();
  const [cards, setCards] = useState<VisionCardData[]>(() => {
    if (initialVisions && initialVisions.length > 0) return initialVisions;
    return [
      {
        id: 'v-1',
        title: 'Estética North Star / Apex de Marca',
        prompt: 'Tipografía editorial de alto contraste, modo oscuro OLED (#050505) y acentos en Oro Imperial (#ecb613).'
      },
      {
        id: 'v-2',
        title: 'Transformación Emocional del Cliente',
        prompt: 'De parejas abrumadas por la incertidumbre a bodas legendarias con sonido Bose 2.000W y satisfacción garantizada por escrito.'
      },
      {
        id: 'v-3',
        title: 'Hitos Estratégicos Clave',
        prompt: '52 fechas nupciales de gala completadas, adjudicaciones B2G en ayuntamientos estratégicos y Split Soberano 80/10/10.'
      }
    ];
  });

  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');

  const handleAddCard = () => {
    if (!newTitle.trim()) return;
    const newCard: VisionCardData = {
      id: `v-${Date.now()}`,
      title: newTitle,
      prompt: newPrompt || 'Hito estratégico y visión a largo plazo.'
    };
    setCards(prev => [...prev, newCard]);
    setNewTitle('');
    setNewPrompt('');
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="h-full overflow-y-auto p-6 max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-purple-950/30 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ecb613] text-sm font-semibold tracking-wide uppercase font-mono">
            <PhotoIcon className="w-5 h-5" />
            {t('tools.visionBoard_title', 'Tablero de Visión Estratégica')}
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 font-syne">Estética & Estrella Polar Estratégica</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Sintetiza tus hitos no negociables, la resonancia emocional de la marca y la visión rectora para este ciclo de crecimiento.
          </p>
        </div>
        <button
          onClick={() => onComplete(cards)}
          className="px-5 py-2.5 bg-[#ecb613] hover:bg-white text-black font-black rounded-xl text-sm transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer font-mono"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Guardar Tablero
        </button>
      </div>

      {/* Add Card Form */}
      <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1 font-mono">Pilar de Visión / Título</label>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Ej: Calibración Acústica de Gala"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1 font-mono">Descripción / Manifiesto Visual</label>
          <input
            type="text"
            value={newPrompt}
            onChange={e => setNewPrompt(e.target.value)}
            placeholder="Ej: Elegancia sin estridencias y protocolo impecable."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
          />
        </div>
        <div>
          <button
            onClick={handleAddCard}
            disabled={!newTitle.trim()}
            className="w-full py-2.5 bg-white/10 hover:bg-[#ecb613] hover:text-black border border-white/10 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-mono disabled:opacity-50"
          >
            <PlusIcon className="w-4 h-4" />
            Añadir Tarjeta
          </button>
        </div>
      </div>

      {/* Vision Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map(card => (
          <div
            key={card.id}
            className="bg-zinc-900/80 border border-white/10 hover:border-[#ecb613]/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all group"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded border border-[#ecb613]/20 uppercase">
                  Pilar Estratégico
                </span>
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Eliminar Tarjeta"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-[#ecb613] transition-colors font-syne">
                {card.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "{card.prompt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
