"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { XMarkIcon, BookmarkIcon } from '@heroicons/react/24/outline';

interface SaveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title?: string, projectId?: string) => void;
  projects?: Project[];
  onAddProject?: (project?: any) => any;
  currentProblem?: string;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projects = []
}) => {
  const { t } = useTranslations();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState<string>('');

  const handleConfirm = () => {
    if (!title.trim()) return;
    onSave(title.trim(), projectId || undefined);
    setTitle('');
    setProjectId('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Save Current Session</h3>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                  Session Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Q3 Syndicate Restructuring"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {projects.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                    Assign to Project (Optional)
                  </label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">None / Unassigned</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-white/5 border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!title.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-lg"
              >
                Save Session
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
