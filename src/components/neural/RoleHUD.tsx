'use client';

import React from 'react';
import Image from 'next/image';
import { RoleKey, ROLE_DEFINITIONS } from '@/types/neural';
import {
  Mic,
  Calendar,
  Building2,
  Landmark,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface RoleHUDProps {
  selectedRole: RoleKey | null;
  onSelectRole: (role: RoleKey | null) => void;
  className?: string;
}

export default function RoleHUD({
  selectedRole,
  onSelectRole,
  className = ''
}: RoleHUDProps) {
  const roles: Array<{
    key: RoleKey;
    icon?: React.ElementType;
    isColibri?: boolean;
    badge: string;
  }> = [
    { key: 'artistas', icon: Mic, badge: 'ROSTER' },
    { key: 'eventos', icon: Calendar, badge: 'B2C' },
    { key: 'empresas', icon: Building2, badge: 'B2B' },
    { key: 'instituciones', icon: Landmark, badge: 'B2G' },
    { key: 'vimume', isColibri: true, badge: '40Hz' },
  ];

  const handleRoleClick = (key: RoleKey) => {
    if (selectedRole === key) {
      onSelectRole(null);
    } else {
      onSelectRole(key);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('ear-role-selected', {
            detail: {
              role: key,
              label: ROLE_DEFINITIONS[key].label
            }
          })
        );
      }
    }
  };

  return (
    <nav
      aria-label="Selector de Taxonomía Neuronal"
      className={`pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-full backdrop-blur-xl bg-black/60 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-w-full overflow-x-auto no-scrollbar transition-all duration-300 ${className}`}
    >
      {/* Botón Core / Reset Vista Global */}
      <button
        type="button"
        onClick={() => onSelectRole(null)}
        title="Restaurar Visión Global"
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono transition-all duration-200 group ${
          !selectedRole
            ? 'bg-white/10 text-white shadow-sm border border-white/15'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <RotateCcw
          size={13}
          className={`transition-transform duration-300 group-hover:rotate-180 ${
            !selectedRole ? 'text-[#ecb613]' : 'text-zinc-500'
          }`}
        />
        <span className="font-semibold tracking-wider text-[11px] uppercase hidden sm:inline">
          GLOBAL
        </span>
      </button>

      <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

      {/* Los 5 Ejes de la Taxonomía */}
      {roles.map(({ key, icon: Icon, isColibri, badge }) => {
        const def = ROLE_DEFINITIONS[key];
        const isSelected = selectedRole === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => handleRoleClick(key)}
            style={{
              borderColor: isSelected ? def.color : 'transparent',
              backgroundColor: isSelected ? def.accentBg : undefined
            }}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs transition-all duration-200 border group whitespace-nowrap ${
              isSelected
                ? 'shadow-[0_0_20px_rgba(0,0,0,0.5)] scale-[1.02]'
                : 'border-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
            }`}
          >
            {/* Pulsing indicator dot */}
            <span
              style={{
                backgroundColor: def.color,
                boxShadow: isSelected ? `0 0 10px ${def.color}` : 'none'
              }}
              className={`w-2 h-2 rounded-full transition-transform duration-200 ${
                isSelected ? 'scale-125 animate-pulse' : 'opacity-70 group-hover:opacity-100'
              }`}
            />

            {isColibri ? (
              <div className="relative w-4 h-4 shrink-0">
                <Image
                  src="/images/brand/colibri_isotipo.png"
                  alt="Colibrí VIMUME"
                  fill
                  className="object-contain"
                />
              </div>
            ) : Icon ? (
              <Icon
                size={14}
                style={{ color: isSelected ? def.color : undefined }}
                className="transition-colors duration-200"
              />
            ) : null}

            <span
              style={{ color: isSelected ? '#ffffff' : undefined }}
              className="font-medium tracking-wide text-[12px]"
            >
              {def.label}
            </span>

            {/* Micro-badge */}
            <span
              style={{
                color: isSelected ? def.color : 'rgba(255, 255, 255, 0.4)',
                backgroundColor: isSelected ? 'rgba(0,0,0,0.5)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: isSelected ? `${def.color}40` : 'transparent'
              }}
              className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border tracking-wider hidden md:inline-block"
            >
              {badge}
            </span>
          </button>
        );
      })}

      <div className="w-[1px] h-5 bg-white/10 mx-0.5 hidden sm:block" />

      {/* Asistente Neural Trigger */}
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('ear-open-assistant'));
          }
        }}
        title="Invocar Asistente Local Neural"
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-zinc-400 hover:text-[#ecb613] hover:bg-[#ecb613]/10 border border-transparent hover:border-[#ecb613]/30 transition-all text-xs font-mono group"
      >
        <Sparkles size={13} className="text-[#ecb613] animate-pulse" />
        <span className="text-[11px] tracking-wider hidden lg:inline">ASISTENTE</span>
      </button>
    </nav>
  );
}
