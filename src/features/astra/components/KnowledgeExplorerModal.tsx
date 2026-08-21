"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeCategory, ImpactNugget } from '../types';
import { knowledgeBase } from '../data/knowledgeBase';
import { useTranslations } from '../contexts/LanguageContext';
import {
  LightBulbIcon,
  XMarkIcon,
  BookmarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface KnowledgeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNugget?: (nugget: ImpactNugget) => void;
  knowledgeBase?: any[];
  onConfirmSelection?: (selected: any) => void;
  initiallySelectedIds?: any[];
}

export const KnowledgeExplorerModal: React.FC<KnowledgeExplorerModalProps> = ({
  isOpen,
  onClose,
  onSaveNugget
}) => {
  const { t } = useTranslations();
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  const filtered = knowledgeBase.filter(item => {
    const matchesCat = selectedCat === 'ALL' || item.category === selectedCat;
    const matchesSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.insight || '').toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleSave = (item: any) => {
    if (onSaveNugget) {
      onSaveNugget({
        title: item.title || 'Knowledge Nugget',
        insight: item.insight || '',
        category: item.category,
        date: new Date().toISOString()
      });
      setSavedIds(prev => ({ ...prev, [item.id]: true }));
    }
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
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-yellow-950/30">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                  <LightBulbIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Astra Strategic Knowledge Base</h3>
                  <p className="text-xs text-zinc-400">Curated mental models, legal principles, and business heuristics</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Controls */}
            <div className="p-6 pb-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search mental models, keywords, or topics..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <select
                  value={selectedCat}
                  onChange={e => setSelectedCat(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Knowledge Domains</option>
                  {Object.values(KnowledgeCategory).map(cat => (
                    <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(item => {
                const isSaved = savedIds[item.id];
                return (
                  <div
                    key={item.id}
                    className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                          {item.category.replace('_', ' ')}
                        </span>
                        <button
                          onClick={() => handleSave(item)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                            isSaved
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <BookmarkIcon className="w-3.5 h-3.5" />
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-2">{item.title}</h4>
                      <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">{item.insight}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2 border-t border-white/5">
                      {item.tags.map((tg, i) => (
                        <span key={i} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
