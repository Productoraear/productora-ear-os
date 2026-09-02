"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PlayIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTool: (toolId: string) => void;
  userRole: UserRole;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onLaunchTool,
  userRole
}) => {
  const { t } = useTranslations();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  const filteredTools = Object.entries(TOOL_REGISTRY).filter(([_, config]) => {
    const title = t(config.titleKey).toLowerCase();
    const desc = t(config.descriptionKey).toLowerCase();
    const q = query.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
              <MagnifyingGlassIcon className="w-5 h-5 text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands, tools, or press ESC to close..."
                className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm"
              />
              <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-500">
                Executable Frameworks
              </div>
              {filteredTools.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No matching tools found.
                </div>
              ) : (
                filteredTools.map(([toolId, config]) => (
                  <button
                    key={toolId}
                    onClick={() => {
                      onLaunchTool(toolId);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/5 text-zinc-300 group-hover:text-blue-400 transition-colors">
                        {config.icon}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white group-hover:text-blue-300 block">
                          {t(config.titleKey)}
                        </span>
                        <span className="text-xs text-zinc-400 line-clamp-1">
                          {t(config.descriptionKey)}
                        </span>
                      </div>
                    </div>
                    <PlayIcon className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/40 flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span>ASTRA COMMAND PALETTE</span>
              <span>ESC TO DISMISS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
