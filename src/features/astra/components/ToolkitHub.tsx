"use client";

import React, { useState } from 'react';
import { UserRole, WorkflowStage } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import {
  WrenchScrewdriverIcon,
  PlayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface ToolkitHubProps {
  userRole: UserRole;
  onLaunchTool: (toolId: string) => void;
}

export const ToolkitHub: React.FC<ToolkitHubProps> = ({ userRole, onLaunchTool }) => {
  const { t } = useTranslations();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  const tools = Object.entries(TOOL_REGISTRY).filter(([_, config]) => {
    const matchesRole = config.roles.includes(userRole);
    const matchesSearch =
      t(config.titleKey).toLowerCase().includes(search.toLowerCase()) ||
      t(config.descriptionKey).toLowerCase().includes(search.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || config.stage === stageFilter;
    return matchesRole && matchesSearch && matchesStage;
  });

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-indigo-950/40 p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <WrenchScrewdriverIcon className="w-4 h-4" />
            Specialized Role Workspace
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Toolkit Hub: {t(`roles.${userRole}`)}
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
            Browse and execute modular strategic frameworks calibrated specifically for your role requirements.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={stageFilter}
          onChange={e => setStageFilter(e.target.value)}
          className="bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Workflow Stages</option>
          {Object.values(WorkflowStage).map(st => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map(([toolId, config]) => (
          <div
            key={toolId}
            onClick={() => onLaunchTool(toolId)}
            className="bg-zinc-900/70 hover:bg-zinc-900 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white group-hover:border-indigo-500/40 transition-colors">
                  {config.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  {config.stage}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                  {t(config.titleKey)}
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-3">
                  {t(config.descriptionKey)}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white">
              <span>Initialize Workspace</span>
              <PlayIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
