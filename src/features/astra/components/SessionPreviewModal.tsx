"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from '../types';
import { XMarkIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface SessionPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onLoadSession?: () => void;
}

export const SessionPreviewModal: React.FC<SessionPreviewModalProps> = ({
  isOpen,
  onClose,
  session,
  onLoadSession
}) => {
  if (!session) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">{session.title || 'Strategic Session'}</h3>
                <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                  <span className="flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400" /> {session.userRole}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" /> {new Date(session.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs text-zinc-300">
              {session.params?.problem && (
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-1">
                  <span className="font-bold text-blue-400 uppercase tracking-wider text-[10px]">Problem Statement</span>
                  <p className="text-sm text-zinc-200">{session.params.problem}</p>
                </div>
              )}

              {session.results && (
                <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 space-y-2">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Session Data</span>
                  <pre className="font-mono text-[11px] text-zinc-400 whitespace-pre-wrap overflow-x-auto max-h-60">
                    {JSON.stringify(session.results, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
