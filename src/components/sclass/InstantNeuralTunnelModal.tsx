'use client';

import React from 'react';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';
import { ThermodynamicNeuralTunnel } from '@/features/bodas/ui/ThermodynamicNeuralTunnel';
import { X, Sparkles, Sliders } from 'lucide-react';
import Image from 'next/image';

export type TunnelProfile = 'solista' | 'mariachi' | 'productora' | 'vimume' | 'b2b' | string;

export interface InstantNeuralTunnelModalProps {
  activeProfile?: TunnelProfile;
  isOpen?: boolean;
  onClose?: () => void;
}

export function InstantNeuralTunnelModal({
  activeProfile = 'solista',
  isOpen: propIsOpen,
  onClose: propOnClose
}: InstantNeuralTunnelModalProps = {}) {
  const { isOpen: storeIsOpen, closeTunnel } = useNeuralTunnelStore();
  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const handleClose = propOnClose || closeTunnel;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-6 md:p-8 animate-in fade-in duration-300">
      {/* Modal Top Sovereign Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between pb-4 border-b border-white/10 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.3)]">
            <Sliders size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-[#ecb613] uppercase tracking-[0.25em] bg-[#ecb613]/10 px-2 py-0.5 rounded border border-[#ecb613]/25">
                IGNICIÓN S-CLASS // TÚNEL NEURAL
              </span>
            </div>
            <h3 className="font-syne font-black text-white text-base md:text-xl uppercase tracking-tight mt-1">
              Atmósferas Sensoriales & Deslizadores Acústicos
            </h3>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white/80 hover:text-white transition-all border border-white/10 flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer"
        >
          <span className="hidden sm:inline">Cerrar Túnel</span>
          <X size={18} />
        </button>
      </div>

      {/* Main Thermodynamic Neural Tunnel Container */}
      <div className="w-full max-w-6xl pb-16">
        <ThermodynamicNeuralTunnel initialProvince="Madrid" initialService="Experiencia Integral" />
      </div>
    </div>
  );
}

export default InstantNeuralTunnelModal;