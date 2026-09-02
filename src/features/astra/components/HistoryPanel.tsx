"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import {
  XMarkIcon,
  ClockIcon,
  EyeIcon,
  TrashIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  onLoad?: (session: Session) => void;
  onDelete?: (id: string) => void;
  onPreview: (session: Session) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  sessions,
  onDelete,
  onPreview
}) => {
  const { t } = useTranslations();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Strategic Sessions</h2>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sessions.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 space-y-2">
                  <DocumentTextIcon className="w-10 h-10 mx-auto text-zinc-600" />
                  <p className="text-sm">No saved sessions in this workspace.</p>
                  <p className="text-xs text-zinc-600">Saved deliberation councils and tool outputs will appear here.</p>
                </div>
              ) : (
                sessions.map(s => (
                  <div
                    key={s.id}
                    className="bg-black/40 border border-white/10 hover:border-blue-500/40 rounded-xl p-4 space-y-2 transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {s.title || 'Untitled Strategic Session'}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {new Date(s.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {s.params?.problem || 'Strategic analysis deliberation session'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                        {s.userRole}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onPreview(s)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg text-xs flex items-center gap-1 transition-all"
                        >
                          <EyeIcon className="w-3.5 h-3.5" /> Preview
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(s.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 text-[10px] font-mono text-zinc-500 text-center">
              ASTRA LOCAL PERSISTENCE PROTOCOL
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
