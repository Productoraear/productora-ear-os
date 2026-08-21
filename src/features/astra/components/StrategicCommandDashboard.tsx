"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserRole, Project, ImpactNugget, UserProfileSummary, VisionCardData } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import {
  SparklesIcon,
  PlayIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
  FolderIcon,
  BookmarkIcon,
  PhotoIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface StrategicCommandDashboardProps {
  userRole: UserRole;
  onNavigateToJourney: () => void;
  onLaunchTool: (toolId: string) => void;
  projects: Project[];
  userNuggets: ImpactNugget[];
  userProfile: UserProfileSummary | null;
  dataContextString?: string;
  onUpdateUserProfile?: () => void;
  completedTools: Record<string, any>;
  visions: VisionCardData[];
}

export const StrategicCommandDashboard: React.FC<StrategicCommandDashboardProps> = ({
  userRole,
  onNavigateToJourney,
  onLaunchTool,
  projects,
  userNuggets,
  userProfile,
  completedTools,
  visions
}) => {
  const { t } = useTranslations();

  const roleTools = Object.entries(TOOL_REGISTRY).filter(([_, config]) =>
    config.roles.includes(userRole)
  );

  const completedCount = Object.keys(completedTools).length;

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Archetype Assessment */}
      <div className="bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-blue-950/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-blue-400" />
                {userProfile?.archetype || 'The Strategic Architect'}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                ROLE // {userRole}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Command Nexus: {t(`roles.${userRole}`)}
            </h1>

            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-sans">
              {userProfile?.narrative || t(`role_descriptions.${userRole}`)}
            </p>

            {userProfile?.keyStrengths && userProfile.keyStrengths.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {userProfile.keyStrengths.map((str, idx) => (
                  <span key={idx} className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-zinc-300">
                    ✦ {str}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action: Enter Journey */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToJourney}
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2.5 group"
            >
              <span>Launch 6-Stage Journey</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Tools + Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Launch Tool Hub */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-blue-400" />
              Operational Tool Suite
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              {completedCount} of {roleTools.length} Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roleTools.map(([toolId, config]) => {
              const isDone = Boolean(completedTools[toolId]);
              return (
                <div
                  key={toolId}
                  onClick={() => onLaunchTool(toolId)}
                  className={`bg-zinc-900/60 hover:bg-zinc-900 border rounded-2xl p-5 cursor-pointer transition-all duration-200 group flex flex-col justify-between relative overflow-hidden ${
                    isDone ? 'border-emerald-500/30' : 'border-white/10 hover:border-blue-500/40'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white group-hover:border-blue-500/40 transition-colors">
                        {config.icon}
                      </div>
                      {isDone && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                          <CheckBadgeIcon className="w-3.5 h-3.5" /> COMPLETED
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                        {t(config.titleKey)}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {t(config.descriptionKey)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-semibold group-hover:text-white">
                    <span>Execute Tool</span>
                    <PlayIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Projects & Wisdom Feed */}
        <div className="space-y-6">
          {/* Projects Panel */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-amber-400" />
                Active Strategic Projects
              </h3>
              <span className="text-xs font-mono text-zinc-500">{projects.length} Total</span>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">
                No active projects initialized yet. Link sessions into high-leverage portfolios.
              </p>
            ) : (
              <div className="space-y-2">
                {projects.slice(0, 3).map(p => (
                  <div key={p.id} className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{p.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wisdom Vault Nuggets Feed */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-purple-400" />
                Captured Wisdom Nuggets
              </h3>
              <span className="text-xs font-mono text-zinc-500">{userNuggets.length} Saved</span>
            </div>

            {userNuggets.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">
                Save breakthrough takeaways and contrarian perspectives while running deliberation councils.
              </p>
            ) : (
              <div className="space-y-2">
                {userNuggets.slice(-3).reverse().map((nugget, idx) => (
                  <div key={idx} className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-xs font-semibold text-purple-300 block">{nugget.title}</span>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{nugget.insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vision Board Preview */}
          {visions.length > 0 && (
            <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PhotoIcon className="w-4 h-4 text-pink-400" />
                  Vision Pillars
                </h3>
                <span className="text-xs font-mono text-zinc-500">{visions.length} Active</span>
              </div>
              <div className="space-y-2">
                {visions.slice(0, 2).map(v => (
                  <div key={v.id} className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs text-zinc-300">
                    <strong className="text-white block">{v.title}</strong>
                    <span className="text-zinc-400 text-[11px]">{v.prompt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
