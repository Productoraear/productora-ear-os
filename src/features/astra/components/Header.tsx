"use client";

import React, { useState } from 'react';
import { UserRole } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import {
  SparklesIcon,
  FolderIcon,
  ClockIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  LightBulbIcon,
  BookmarkSquareIcon,
  ChevronDownIcon,
  ArrowLeftIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onSave?: () => void;
  onExport?: () => void;
  onToggleHistory: () => void;
  onToggleSettings: () => void;
  onToggleAIAssistant: () => void;
  onToggleKnowledgeExplorer: () => void;
  onToggleProjectsDashboard: () => void;
  onToggleWisdomVault: () => void;
  onToggleAbout: () => void;
  onDemoCalibration?: () => void;
  hasAnalysis?: boolean;
  activeRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  onNavigateBack?: () => void;
  currentToolName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  onToggleSettings,
  onToggleAIAssistant,
  onToggleKnowledgeExplorer,
  onToggleProjectsDashboard,
  onToggleWisdomVault,
  onToggleAbout,
  activeRole,
  onRoleSelect,
  onNavigateBack,
  currentToolName
}) => {
  const { t, language, setLanguage } = useTranslations();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const allRoles = Object.values(UserRole);

  return (
    <header className="fixed top-0 left-0 w-full h-[72px] bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 z-40 px-4 md:px-6 flex items-center justify-between">
      {/* Left: Brand & Navigation */}
      <div className="flex items-center gap-4">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 text-sm">
            ✦
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">ASTRA OS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800/40">
                v2.5
              </span>
            </div>
            {currentToolName && (
              <span className="text-xs text-zinc-400 block truncate max-w-[200px] md:max-w-xs">
                {currentToolName}
              </span>
            )}
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative hidden sm:block ml-2">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t(`roles.${activeRole}`)}</span>
            <ChevronDownIcon className="w-3.5 h-3.5 text-zinc-500" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-500">
                Switch Operational Lens
              </div>
              {allRoles.map(r => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleSelect(r);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    r === activeRole
                      ? 'bg-blue-600/20 text-blue-300 font-semibold'
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span>{t(`roles.${r}`)}</span>
                  {r === activeRole && <span className="text-blue-400 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Action Modals & Tools */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Language switch */}
        <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-0.5" title="Conmutar Idioma / Switch Language">
          <button
            onClick={() => setLanguage('es')}
            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              language === 'es'
                ? 'bg-[#ecb613] text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#ecb613] text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            EN
          </button>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onToggleAIAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-500/40 text-blue-300 text-xs font-semibold shadow-sm transition-all"
        >
          <SparklesIcon className="w-4 h-4 text-blue-400" />
          <span className="hidden md:inline">Astra AI</span>
        </button>

        {/* Knowledge Explorer */}
        <button
          onClick={onToggleKnowledgeExplorer}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="Knowledge Explorer"
        >
          <LightBulbIcon className="w-4 h-4" />
        </button>

        {/* Wisdom Vault */}
        <button
          onClick={onToggleWisdomVault}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="Wisdom Vault"
        >
          <BookmarkSquareIcon className="w-4 h-4" />
        </button>

        {/* Projects Dashboard */}
        <button
          onClick={onToggleProjectsDashboard}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="Projects Dashboard"
        >
          <FolderIcon className="w-4 h-4" />
        </button>

        {/* History / Sessions */}
        <button
          onClick={onToggleHistory}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="Session History"
        >
          <ClockIcon className="w-4 h-4" />
        </button>

        {/* About Modal */}
        <button
          onClick={onToggleAbout}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="About Astra"
        >
          <InformationCircleIcon className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onToggleSettings}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
          title="System Settings"
        >
          <Cog6ToothIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
