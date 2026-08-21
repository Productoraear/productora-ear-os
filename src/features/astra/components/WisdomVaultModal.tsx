"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImpactNugget } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import {
  BookmarkSquareIcon,
  XMarkIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface WisdomVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  nuggets: ImpactNugget[];
  onDeleteNugget?: (index: number) => void;
  onExportNuggets?: () => void;
}

export const WisdomVaultModal: React.FC<WisdomVaultModalProps> = ({
  isOpen,
  onClose,
  nuggets = [],
  onDeleteNugget
}) => {
  const { t } = useTranslations();
  const [filterCat, setFilterCat] = useState('ALL');

  const categories = Array.from(new Set(nuggets.map(n => n.category || 'GENERAL')));

  const filtered = nuggets.filter(n => filterCat === 'ALL' || n.category === filterCat);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nuggets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `astra_wisdom_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-pink-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                  <BookmarkSquareIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Astra Wisdom Vault</h3>
                  <p className="text-xs text-zinc-400">Personalized archive of captured strategic insights and breakthroughs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {nuggets.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-zinc-300 flex items-center gap-1.5"
                  >
                    <ArrowDownTrayIcon className="w-3.5 h-3.5" /> Export JSON
                  </button>
                )}
                <button onClick={onClose} className="text-zinc-500 hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {categories.length > 1 && (
              <div className="px-6 py-3 border-b border-white/5 flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilterCat('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    filterCat === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  All ({nuggets.length})
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      filterCat === cat ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {cat.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 space-y-2">
                  <BookmarkSquareIcon className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="text-sm">No nuggets saved in this category yet.</p>
                  <p className="text-xs text-zinc-600">Save insights from the Council of Minds, SWOT matrices, and knowledge base.</p>
                </div>
              ) : (
                filtered.map((nugget, idx) => (
                  <div
                    key={idx}
                    className="bg-black/30 border border-white/10 rounded-2xl p-4 flex justify-between items-start hover:border-purple-500/30 transition-all gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                          {nugget.category || 'INSIGHT'}
                        </span>
                        <h4 className="font-bold text-white text-sm">{nugget.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed pt-1 pl-1">
                        {nugget.insight}
                      </p>
                      {nugget.date && (
                        <span className="text-[10px] font-mono text-zinc-500 block pt-1">
                          Captured {new Date(nugget.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {onDeleteNugget && (
                      <button
                        onClick={() => onDeleteNugget(idx)}
                        className="text-zinc-500 hover:text-rose-400 p-1 shrink-0"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
