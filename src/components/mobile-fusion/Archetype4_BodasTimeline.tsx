'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, Crown, Music, Clock, 
  Check, Plus, Trash2, Calendar, Users, 
  Share2, ArrowRight, ShieldCheck, Volume2
} from 'lucide-react';
import { ARTIST_FORMATS, WEDDING_MILESTONES_DEFAULT, SOVEREIGN_ARTIST } from './types';

export default function Archetype4_BodasTimeline() {
  const [milestones, setMilestones] = useState(WEDDING_MILESTONES_DEFAULT);
  const [paxCount, setPaxCount] = useState(140);
  const [includePhotocall, setIncludePhotocall] = useState(true);

  const toggleMilestone = (id: string, formatId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          selectedFormatId: m.selectedFormatId === formatId ? null : formatId
        };
      }
      return m;
    }));
  };

  // Calculate live multi-milestone wedding total
  const selectedMilestones = milestones.filter(m => m.selectedFormatId !== null);
  const totalBase = selectedMilestones.reduce((acc, m) => {
    const fmt = ARTIST_FORMATS.find(f => f.id === m.selectedFormatId);
    return acc + (fmt ? fmt.basePrice : 0);
  }, 0);

  // Bundle discount if 2 or more milestones booked
  const bundleDiscount = selectedMilestones.length >= 2 ? Math.round(totalBase * 0.15) : 0;
  const photocallCost = includePhotocall ? 80 : 0;
  const grandTotal = Math.max(350, totalBase - bundleDiscount + photocallCost);

  const handleWhatsAppExport = () => {
    const agendaText = selectedMilestones.map(m => {
      const fmt = ARTIST_FORMATS.find(f => f.id === m.selectedFormatId);
      return `• ${m.name} (${m.timeSlot}): ${fmt?.name} [${fmt?.basePrice}€]`;
    }).join('\n');

    const text = encodeURIComponent(
      `💍 PLANIFICADOR NUPCIAL 360° BODAS.NET / EAR OS\nInvitados: ${paxCount} pax\n\nCRONOGRAMA DE ACTUACIÓN:\n${agendaText}\n\nPhotocall Sombreros: ${includePhotocall ? 'SÍ' : 'NO'}\nDescuento Pack 360°: -${bundleDiscount}€\nTOTAL ESTIMADO: ${grandTotal}€\nDepósito Stripe: 100€\n¿Podemos agendar llamada de protocolo?`
    );
    window.open(`https://wa.me/${SOVEREIGN_ARTIST.phoneClean}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] text-white p-4 select-none relative overflow-y-auto no-scrollbar space-y-4 pb-24">
      
      {/* 👰 TOP BODAS.NET HEADER & PACK BADGE */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-black uppercase font-mono tracking-widest">
            BODAS.NET S-CLASS ARCHITECT
          </span>
          <span className="text-[10px] font-mono text-[#ecb613] font-bold">
            {selectedMilestones.length} Hitos Asignados
          </span>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-white font-syne">
          Orquestador de Protocolo Nupcial
        </h2>
        <p className="text-xs text-white/50">
          Personaliza la música en directo para cada momento clave de tu boda.
        </p>
      </div>

      {/* 👥 GUESTS & VENUE SUMMARY BAR */}
      <div className="grid grid-cols-2 gap-2 bg-[#111116] p-3 rounded-2xl border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-[#ecb613]" />
          <div>
            <span className="text-[9px] text-white/40 block">INVITADOS</span>
            <span className="font-bold text-white">{paxCount} personas</span>
          </div>
        </div>
        <div className="flex items-center gap-2 border-l border-white/10 pl-3">
          <Volume2 size={14} className="text-emerald-400" />
          <div>
            <span className="text-[9px] text-white/40 block">POTENCIA RECOMENDADA</span>
            <span className="font-bold text-emerald-400">{paxCount * 12}W (Bose F1)</span>
          </div>
        </div>
      </div>

      {/* ⏳ INTERACTIVE WEDDING TIMELINE STAGES */}
      <div className="space-y-3">
        {milestones.map((milestone, idx) => {
          const isAssigned = milestone.selectedFormatId !== null;
          const assignedFormat = ARTIST_FORMATS.find(f => f.id === milestone.selectedFormatId);

          return (
            <div 
              key={milestone.id}
              className={`p-3.5 rounded-3xl border transition-all ${
                isAssigned 
                  ? 'bg-gradient-to-r from-[#181822] to-[#101016] border-[#ecb613]/50 shadow-lg shadow-[#ecb613]/5' 
                  : 'bg-[#0d0d12] border-white/10 opacity-80'
              }`}
            >
              {/* Milestone Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#ecb613]">
                      {idx + 1}
                    </span>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">
                      {milestone.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock size={10} /> {milestone.timeSlot}
                    </span>
                    <span>· Máx {milestone.volumeLimitDb} dB</span>
                  </div>
                </div>

                {isAssigned && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                    ACTIVO
                  </span>
                )}
              </div>

              {/* Format Switcher per Milestone */}
              <div className="grid grid-cols-2 gap-1.5 mt-3">
                {ARTIST_FORMATS.slice(0, 2).map(fmt => {
                  const isSelected = milestone.selectedFormatId === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => toggleMilestone(milestone.id, fmt.id)}
                      className={`p-2 rounded-xl border text-left text-[10px] transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold' 
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      <span className="truncate">{fmt.name}</span>
                      <span className="font-mono font-bold shrink-0 ml-1">{fmt.basePrice}€</span>
                    </button>
                  );
                })}
              </div>

              {/* Milestone Specific Note */}
              <p className="text-[10px] text-white/50 italic mt-2 bg-black/40 p-2 rounded-xl border border-white/5">
                💡 {milestone.notes}
              </p>
            </div>
          );
        })}
      </div>

      {/* 🎁 COMPLEMENTARY SERVICES ADD-ON */}
      <div className="p-3.5 rounded-3xl bg-[#111116] border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles size={16} className="text-[#ecb613]" />
          <div>
            <span className="text-xs font-bold text-white block">Photocall & Sombreros Charros</span>
            <span className="text-[10px] text-white/50">Sesión de fotos y atrezzo de gala (+80€)</span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={includePhotocall}
          onChange={(e) => setIncludePhotocall(e.target.checked)}
          className="w-5 h-5 accent-[#ecb613] rounded cursor-pointer"
        />
      </div>

      {/* 🏷️ STICKY TOTAL WEDDING PACK BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-black/90 backdrop-blur-2xl border-t border-white/15 z-40 max-w-[420px] mx-auto flex items-center justify-between">
        <div>
          {bundleDiscount > 0 && (
            <span className="text-[9px] text-emerald-400 font-mono block">
              Descuento Pack 360° (-{bundleDiscount}€)
            </span>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{grandTotal}€</span>
            <span className="text-[10px] text-white/50 font-mono">Pack Completo</span>
          </div>
        </div>

        <button
          onClick={handleWhatsAppExport}
          className="py-3 px-4 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all"
        >
          <span>Exportar a WhatsApp</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
