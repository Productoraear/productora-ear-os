"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import {
  FolderIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface ProjectsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  sessions?: any[];
  onAddProject?: (project?: any) => any;
  onCreateProject?: (project: Partial<Project>) => void;
  onUpdateProject?: (project: any) => void;
  onDeleteProject?: (projectId: string) => void;
  onSelectProject?: (projectId: string) => void;
  onLoadSession?: (sessionId: string) => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  isOpen,
  onClose,
  projects = [],
  onAddProject,
  onCreateProject,
  onDeleteProject
}) => {
  const { t } = useTranslations();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const createFn = onCreateProject || onAddProject;
    if (createFn) {
      createFn({
        name: name.trim(),
        description: description.trim() || 'Strategic venture initiatives and milestones.',
        status: 'ACTIVE' as any,
        sessions: [],
        sessionIds: [],
        createdAt: new Date().toISOString()
      });
    }
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <FolderIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Strategic Project Portfolios</h3>
                  <p className="text-xs text-zinc-400">Group deliberations, sessions, and tool outputs into cohesive ventures</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-400">{projects.length} Total Projects</span>
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <PlusIcon className="w-4 h-4" /> New Project
                </button>
              </div>

              {isCreating && (
                <div className="bg-black/40 border border-blue-500/30 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase text-blue-400">Initialize Project Portfolio</h4>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Project Name (e.g. Master Release Global Campaign)"
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description & primary strategic objectives..."
                    rows={2}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsCreating(false)}
                      className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-white/5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={!name.trim()}
                      className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg disabled:opacity-50"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map(proj => (
                  <div
                    key={proj.id}
                    className="bg-black/30 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all space-y-3"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(proj.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      {onDeleteProject && (
                        <button
                          onClick={() => onDeleteProject(proj.id)}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
