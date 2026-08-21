"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import {
  MusicalNoteIcon,
  BriefcaseIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  MegaphoneIcon,
  BookOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

interface RoleCardData {
  role: UserRole;
  titleKey: string;
  descKey: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  borderAccent: string;
  badge: string;
}

const ROLES: RoleCardData[] = [
  {
    role: UserRole.ARTIST,
    titleKey: 'roles.ARTIST',
    descKey: 'role_descriptions.ARTIST',
    icon: MusicalNoteIcon,
    accentColor: 'from-amber-500/20 to-orange-500/10',
    borderAccent: 'hover:border-amber-500/50',
    badge: 'CREATIVE SOVEREIGNTY'
  },
  {
    role: UserRole.MANAGER,
    titleKey: 'roles.MANAGER',
    descKey: 'role_descriptions.MANAGER',
    icon: BriefcaseIcon,
    accentColor: 'from-blue-500/20 to-indigo-500/10',
    borderAccent: 'hover:border-blue-500/50',
    badge: 'TALENT & CAPITAL'
  },
  {
    role: UserRole.PROJECT_MANAGER,
    titleKey: 'roles.PROJECT_MANAGER',
    descKey: 'role_descriptions.PROJECT_MANAGER',
    icon: CommandLineIcon,
    accentColor: 'from-emerald-500/20 to-teal-500/10',
    borderAccent: 'hover:border-emerald-500/50',
    badge: 'EXECUTION CADENCE'
  },
  {
    role: UserRole.ENTREPRENEUR,
    titleKey: 'roles.ENTREPRENEUR',
    descKey: 'role_descriptions.ENTREPRENEUR',
    icon: RocketLaunchIcon,
    accentColor: 'from-purple-500/20 to-pink-500/10',
    borderAccent: 'hover:border-purple-500/50',
    badge: 'VENTURE SCALE'
  },
  {
    role: UserRole.STRATEGIC_COMMUNICATOR,
    titleKey: 'roles.STRATEGIC_COMMUNICATOR',
    descKey: 'role_descriptions.STRATEGIC_COMMUNICATOR',
    icon: MegaphoneIcon,
    accentColor: 'from-cyan-500/20 to-sky-500/10',
    borderAccent: 'hover:border-cyan-500/50',
    badge: 'NARRATIVE MOATS'
  },
  {
    role: UserRole.BOOK_AUTHOR,
    titleKey: 'roles.BOOK_AUTHOR',
    descKey: 'role_descriptions.BOOK_AUTHOR',
    icon: BookOpenIcon,
    accentColor: 'from-rose-500/20 to-red-500/10',
    borderAccent: 'hover:border-rose-500/50',
    badge: 'THOUGHT LEADERSHIP'
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  const { t } = useTranslations();

  return (
    <div className="h-full w-full overflow-y-auto p-6 md:p-12 flex flex-col justify-between max-w-7xl mx-auto">
      {/* Top Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wider uppercase"
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Astra OS Adaptive Architecture
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Select Your Strategic Lens
        </h1>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
          Astra dynamically reconfigures its reasoning engines, tool registry, and multi-persona councils around your professional operating role.
        </p>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-8">
        {ROLES.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onRoleSelect(item.role)}
              className={`bg-zinc-900/60 hover:bg-zinc-900/90 border border-white/10 ${item.borderAccent} rounded-2xl p-6 cursor-pointer transition-all duration-200 group flex flex-col justify-between relative overflow-hidden backdrop-blur-md hover:scale-[1.02] shadow-xl`}
            >
              <div className={`absolute -right-10 -bottom-10 w-36 h-36 bg-gradient-to-br ${item.accentColor} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-all duration-500`} />
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white group-hover:border-white/20 transition-all">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-400 mt-2 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-zinc-400 group-hover:text-white relative z-10">
                <span>Initialize Workspace</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer System Status */}
      <div className="text-center text-xs text-zinc-500 pb-4 font-mono">
        ASTRA OPERATING SYSTEM • PERSISTENT WORKSPACE READY • GEMINI INTELLIGENCE ACTIVE
      </div>
    </div>
  );
};
