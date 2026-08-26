'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Zap, ShieldCheck, Sparkles, Sliders, 
  MapPin, Clock, ArrowRight, CheckCircle2, ChevronRight,
  MessageCircle, Lock, Volume2, Music, Radio, Award
} from 'lucide-react';
import type { CustomMixerConfig } from '../admin/MobileFusionAdminStudio';
import { calculateQuote, ARTIST_FORMATS } from './types';

interface DynamicLegoProps {
  config: CustomMixerConfig;
}

export default function DynamicLegoSimulatorRenderer({ config }: DynamicLegoProps) {
  const [selectedFormatId, setSelectedFormatId] = useState('solista-gala');
  const [km, setKm] = useState(25);
  const [pax, setPax] = useState(120);
  const [locked, setLocked] = useState(false);

  const selectedFormat = ARTIST_FORMATS.find(f => f.id === selectedFormatId) || ARTIST_FORMATS[0];
  const quote = calculateQuote({
    basePrice: selectedFormat.basePrice,
    extraMusicians: 0,
    distanceKm: km,
    pax,
    hasBoseSound: true,
    hasPhotocall: false
  });

  return (
    <div className="w-full h-full min-h-full bg-[#050505] text-white flex flex-col justify-between p-3.5 overflow-x-hidden overflow-y-auto no-scrollbar relative select-none">
      
      {/* ================================================================= */}
      {/* 1. DYNAMIC HEADER BLOCK                                            */}
      {/* ================================================================= */}
      <div className="mb-3">
        {config.header === 'dynamic-island' && (
          <div className="bg-[#121218] border border-white/15 rounded-2xl p-2.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
              <span className="text-[10px] font-mono font-bold text-white uppercase truncate max-w-[140px]">
                {selectedFormat.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {quote.requiredWatts}W RMS
              </span>
              <span className="text-xs font-black text-[#ecb613] font-mono">
                {quote.total} €
              </span>
            </div>
          </div>
        )}

        {config.header === 'radar-telemetry' && (
          <div className="bg-[#0b1329] border border-blue-500/30 rounded-2xl p-2.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-blue-400 animate-spin" />
              <span className="text-[10px] font-mono font-bold text-blue-300 uppercase">
                TELEMETRÍA GPS ACTIVA
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/80">
              ETA: {Math.max(15, Math.round(km * 1.2))} min
            </span>
          </div>
        )}

        {config.header === 'minimal-glass' && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex items-center justify-between">
            <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest">
              S-CLASS MINIMAL
            </span>
            <span className="text-[9px] font-mono text-[#ecb613]">
              ● Price-Lock Activo
            </span>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. DYNAMIC DISCOVERY BLOCK                                         */}
      {/* ================================================================= */}
      <div className="space-y-2 mb-3">
        <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 block px-1">
          Descubrimiento // {config.discovery.toUpperCase()}
        </span>

        {/* Format Selector Chips */}
        <div className="grid grid-cols-2 gap-1.5">
          {ARTIST_FORMATS.slice(0, 4).map(fmt => {
            const isSelected = fmt.id === selectedFormatId;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-md' 
                    : 'bg-[#101016] border-white/10 text-white/70 hover:bg-white/5'
                }`}
              >
                <div className="text-[9px] truncate font-mono uppercase">{fmt.name}</div>
                <div className="text-xs font-black">{fmt.basePrice} €</div>
              </button>
            );
          })}
        </div>

        {/* Discovery Card Preview */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#181824] to-[#0c0c12] border border-white/10 p-3 shadow-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] text-[8px] font-mono font-black uppercase">
                99% Match Nupcial
              </span>
              <h4 className="text-xs font-black uppercase text-white mt-1 font-syne">
                {selectedFormat.name}
              </h4>
            </div>
            <span className="text-xs font-black text-[#ecb613] font-mono">
              {selectedFormat.basePrice} €
            </span>
          </div>

          <p className="text-[9px] text-white/60 font-light leading-relaxed mb-2">
            {selectedFormat.description}
          </p>

          <div className="flex items-center justify-between text-[8px] font-mono text-white/40 pt-1.5 border-t border-white/10">
            <span>● 12 W/pax Homologados</span>
            <span>Split 80/10/10</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. DYNAMIC LOGISTICS BLOCK                                         */}
      {/* ================================================================= */}
      <div className="space-y-2 mb-3 bg-[#0d0d14] p-3 rounded-2xl border border-white/10">
        <span className="text-[9px] font-mono uppercase tracking-widest text-[#ecb613] block">
          Logística & Acústica // {config.logistics.toUpperCase()}
        </span>

        {/* Sliders: KM & Pax */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-[9px] font-mono text-white/70 mb-0.5">
              <span>Distancia Desplazamiento</span>
              <span className="text-[#ecb613] font-bold">{km} KM</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={300} 
              value={km} 
              onChange={e => setKm(Number(e.target.value))}
              className="w-full accent-[#ecb613] h-1 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[9px] font-mono text-white/70 mb-0.5">
              <span>Aforo Invitados (12 W/pax)</span>
              <span className="text-[#ecb613] font-bold">{pax} PAX ({quote.requiredWatts}W)</span>
            </div>
            <input 
              type="range" 
              min={20} 
              max={500} 
              value={pax} 
              onChange={e => setPax(Number(e.target.value))}
              className="w-full accent-[#ecb613] h-1 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. DYNAMIC CTA & CLOSING GATILLO                                   */}
      {/* ================================================================= */}
      <div className="pt-2 border-t border-white/10">
        {config.cta === 'slide-lock' && (
          <div 
            onClick={() => setLocked(!locked)}
            className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all ${
              locked 
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25' 
                : 'bg-gradient-to-r from-[#ecb613] to-[#d99f0b] text-black shadow-lg shadow-[#ecb613]/20 hover:brightness-110 active:scale-95'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Lock size={14} />
              <span>{locked ? '✓ FECHA BLOQUEADA 72H' : 'DESLIZAR PARA BLOQUEAR'}</span>
            </div>
            <span className="font-mono">{quote.deposit} €</span>
          </div>
        )}

        {config.cta === 'sticky-gold' && (
          <button 
            className="w-full py-3 px-4 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/25 active:scale-95 transition-all"
          >
            <Sparkles size={14} />
            <span>RESERVAR AHORA ({quote.total} €)</span>
          </button>
        )}

        {config.cta === 'whatsapp-agenda' && (
          <a
            href={`https://wa.me/34693693048?text=Hola%20Productora%20EAR%2C%20quiero%20cotizar%20${encodeURIComponent(selectedFormat.name)}%20para%20${pax}%20asistentes.`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 active:scale-95 transition-all"
          >
            <MessageCircle size={14} />
            <span>ENVIAR PAYLOAD A WHATSAPP</span>
          </a>
        )}
      </div>

    </div>
  );
}
