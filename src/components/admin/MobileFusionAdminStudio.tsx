'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Sliders, Sparkles, CheckCircle2, 
  Layers, Save, RotateCcw, Zap, Heart, Radio, 
  ShieldCheck, Volume2, ArrowRight, Eye, Play, Award
} from 'lucide-react';

import Archetype1_TinderDeck from '../mobile-fusion/Archetype1_TinderDeck';
import Archetype2_UberRadar from '../mobile-fusion/Archetype2_UberRadar';
import Archetype3_AirbnbBento from '../mobile-fusion/Archetype3_AirbnbBento';
import Archetype4_BodasTimeline from '../mobile-fusion/Archetype4_BodasTimeline';
import Archetype5_CyberGlassDock from '../mobile-fusion/Archetype5_CyberGlassDock';
import Archetype6_FastMatchDispatch from '../mobile-fusion/Archetype6_FastMatchDispatch';
import Archetype7_WeddingMoodboardConcierge from '../mobile-fusion/Archetype7_WeddingMoodboardConcierge';
import Archetype8_AcousticPressureMatrix from '../mobile-fusion/Archetype8_AcousticPressureMatrix';
import Archetype9_StorysellingStream from '../mobile-fusion/Archetype9_StorysellingStream';
import Archetype10_SovereignFusionMaster from '../mobile-fusion/Archetype10_SovereignFusionMaster';

// 5 Combos Maestros Sugeridos
export const PRESET_COMBOS = [
  {
    id: 'combo-wedding-vip',
    name: 'Combo 1: The VIP Wedding Gala 360°',
    badge: 'MÁS RECOMENDADO',
    tagline: 'Dynamic Island + Tinder Swipe + Timeline Bodas.net + Slide-to-Lock 100€',
    config: {
      header: 'dynamic-island',
      discovery: 'tinder-deck',
      logistics: 'bodas-timeline',
      authority: 'superhost-split',
      cta: 'slide-lock'
    },
    color: '#ecb613'
  },
  {
    id: 'combo-b2b-logistics',
    name: 'Combo 2: The Fast B2B & Logistics Dispatcher',
    badge: 'RAPIDEZ UBER',
    tagline: 'Radar GPS + Matriz 12 W/pax + Fast Match + Despacho Directo WhatsApp',
    config: {
      header: 'radar-telemetry',
      discovery: 'fast-match',
      logistics: 'acoustic-matrix',
      authority: 'acoustic-seal',
      cta: 'slide-lock'
    },
    color: '#3b82f6'
  },
  {
    id: 'combo-airbnb-luxe',
    name: 'Combo 3: The Curated Airbnb Luxury Stays',
    badge: 'ESTÉTICA BENTO',
    tagline: 'Bento Glass + Paciente Cero Superhost + Desglose 80/10/10 + Botón Sticky',
    config: {
      header: 'minimal-glass',
      discovery: 'bento-stays',
      logistics: 'moodboard',
      authority: 'superhost-split',
      cta: 'sticky-gold'
    },
    color: '#ec4899'
  },
  {
    id: 'combo-storyselling',
    name: 'Combo 4: The Storyselling Emotion Reel',
    badge: 'ALTA CONVERSIÓN',
    tagline: 'Reel Audiovisual Vertical + Sello 0 Fallos + Drawer de Cotización',
    config: {
      header: 'minimal-glass',
      discovery: 'story-reel',
      logistics: 'acoustic-matrix',
      authority: 'acoustic-seal',
      cta: 'whatsapp-agenda'
    },
    color: '#10b981'
  },
  {
    id: 'combo-all-in-one',
    name: 'Combo 5: The Sovereign Master Fusion 360°',
    badge: 'TODO-EN-UNO',
    tagline: 'Tabs fluidos unificando Tinder + Uber + Bodas + Airbnb en una sola pantalla',
    config: {
      header: 'dynamic-island',
      discovery: 'all-in-one',
      logistics: 'all-in-one',
      authority: 'superhost-split',
      cta: 'sticky-gold'
    },
    color: '#f59e0b'
  }
];

export interface CustomMixerConfig {
  header: 'dynamic-island' | 'radar-telemetry' | 'minimal-glass';
  discovery: 'tinder-deck' | 'bento-stays' | 'story-reel' | 'fast-match' | 'all-in-one';
  logistics: 'bodas-timeline' | 'uber-radar' | 'acoustic-matrix' | 'moodboard' | 'all-in-one';
  authority: 'superhost-split' | 'acoustic-seal';
  cta: 'slide-lock' | 'sticky-gold' | 'whatsapp-agenda';
}

export default function MobileFusionAdminStudio() {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'catalog'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState('combo-wedding-vip');
  
  const [customConfig, setCustomConfig] = useState<CustomMixerConfig>({
    header: 'dynamic-island',
    discovery: 'tinder-deck',
    logistics: 'bodas-timeline',
    authority: 'superhost-split',
    cta: 'slide-lock'
  });

  const [catalogArchetypeIndex, setCatalogArchetypeIndex] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load persisted config from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ear_mobile_fusion_config');
      if (saved) {
        setCustomConfig(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleApplyPreset = (preset: typeof PRESET_COMBOS[0]) => {
    setSelectedPresetId(preset.id);
    setCustomConfig(preset.config as CustomMixerConfig);
    try {
      localStorage.setItem('ear_mobile_fusion_config', JSON.stringify(preset.config));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {}
  };

  const handleSaveCustom = () => {
    try {
      localStorage.setItem('ear_mobile_fusion_config', JSON.stringify(customConfig));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {}
  };

  // Render the hybrid live preview based on config
  const renderCustomPreview = () => {
    if (customConfig.discovery === 'all-in-one') {
      return <Archetype10_SovereignFusionMaster />;
    }
    if (customConfig.discovery === 'tinder-deck') {
      return <Archetype1_TinderDeck />;
    }
    if (customConfig.discovery === 'bento-stays') {
      return <Archetype3_AirbnbBento />;
    }
    if (customConfig.discovery === 'story-reel') {
      return <Archetype9_StorysellingStream />;
    }
    if (customConfig.discovery === 'fast-match') {
      return <Archetype6_FastMatchDispatch />;
    }
    if (customConfig.logistics === 'uber-radar') {
      return <Archetype2_UberRadar />;
    }
    if (customConfig.logistics === 'bodas-timeline') {
      return <Archetype4_BodasTimeline />;
    }
    if (customConfig.logistics === 'acoustic-matrix') {
      return <Archetype8_AcousticPressureMatrix />;
    }
    if (customConfig.logistics === 'moodboard') {
      return <Archetype7_WeddingMoodboardConcierge />;
    }
    return <Archetype10_SovereignFusionMaster />;
  };

  return (
    <div className="bg-[#08080c] border border-white/10 rounded-3xl p-4 sm:p-8 space-y-8 text-white">
      
      {/* 👑 HEADER ADMIN STUDIO */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-widest font-mono">
              ESTUDIO MOBILE-FIRST S-CLASS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              MODO ADMIN ACTIVO
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-syne mt-2">
            Configurador Dinámico de Experiencias Mobile
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            Combina los bloques de Airbnb, Uber, Tinder y Bodas.net según tus preferencias. Guarda cambios y compruébalos en tiempo real.
          </p>
        </div>

        {/* Action Save Status */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold"
            >
              <CheckCircle2 size={14} />
              <span>Configuración Guardada</span>
            </motion.div>
          )}

          <button
            onClick={handleSaveCustom}
            className="py-2.5 px-5 rounded-2xl bg-[#ecb613] hover:bg-[#f5c538] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/25 active:scale-95 transition-all"
          >
            <Save size={16} />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>

      {/* 🎛️ STUDIO SUB-NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-[#111116] p-1.5 rounded-2xl border border-white/10 max-w-xl">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'presets' 
              ? 'bg-[#ecb613] text-black shadow-md' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sparkles size={14} />
          <span>Combos Sugeridos (5)</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'custom' 
              ? 'bg-[#ecb613] text-black shadow-md' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Sliders size={14} />
          <span>Mezclador Lego</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'catalog' 
              ? 'bg-[#ecb613] text-black shadow-md' 
              : 'text-white/60 hover:text-white'
          }`}
        >
          <Layers size={14} />
          <span>Catálogo (10 Diseños)</span>
        </button>
      </div>

      {/* 🚀 MAIN STUDIO GRID: CONTROLS (LEFT) + LIVE MOBILE PREVIEW (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTROLS & SETTINGS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: PRESETS COMBOS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/50 block">
                SELECCIONA UNA COMBINACIÓN MAESTRA PRECONFIGURADA
              </span>
              
              <div className="space-y-3">
                {PRESET_COMBOS.map(preset => {
                  const isSelected = preset.id === selectedPresetId;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-4 rounded-3xl border cursor-pointer transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'bg-gradient-to-r from-[#181822] to-[#121218] border-[#ecb613] shadow-xl shadow-[#ecb613]/10' 
                          : 'bg-[#0e0e13] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#ecb613] text-black text-[9px] font-black font-mono">
                              {preset.badge}
                            </span>
                            <h3 className="text-sm font-black text-white uppercase">{preset.name}</h3>
                          </div>
                          <p className="text-xs text-white/60 font-light">{preset.tagline}</p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-[#ecb613] text-black flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LEGO CUSTOM MIXER */}
          {activeTab === 'custom' && (
            <div className="space-y-5 bg-[#0e0e13] p-5 rounded-3xl border border-white/10">
              <div className="border-b border-white/10 pb-3">
                <h3 className="text-sm font-black uppercase text-white font-syne">
                  Personalización Bloque a Bloque
                </h3>
                <p className="text-xs text-white/50">
                  Modifica cada componente de la interfaz y observa el cambio en el simulador en vivo.
                </p>
              </div>

              {/* 1. Header Block */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-[#ecb613] block">
                  1. Bloque de Cabecera (Header)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dynamic-island', label: 'Dynamic Island iOS 18' },
                    { id: 'radar-telemetry', label: 'Telemetría Radar GPS' },
                    { id: 'minimal-glass', label: 'Minimal Glass Bar' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCustomConfig({ ...customConfig, header: opt.id as any })}
                      className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                        customConfig.header === opt.id 
                          ? 'bg-[#ecb613] text-black font-bold border-[#ecb613]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Discovery Block */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-[#ecb613] block">
                  2. Descubrimiento de Artistas & Formatos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'tinder-deck', label: 'Tinder Swipe Deck (Alt 1)' },
                    { id: 'bento-stays', label: 'Bento Glass Airbnb (Alt 3)' },
                    { id: 'story-reel', label: 'Reel Audiovisual (Alt 9)' },
                    { id: 'fast-match', label: 'Fast Speed Match (Alt 6)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCustomConfig({ ...customConfig, discovery: opt.id as any })}
                      className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                        customConfig.discovery === opt.id 
                          ? 'bg-[#ecb613] text-black font-bold border-[#ecb613]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Logistics Block */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-[#ecb613] block">
                  3. Motor de Logística & Presupuesto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bodas-timeline', label: 'Timeline Nupcial Bodas.net (Alt 4)' },
                    { id: 'uber-radar', label: 'Radar KM & ETA Uber (Alt 2)' },
                    { id: 'acoustic-matrix', label: 'Matriz 12 W/pax Bose (Alt 8)' },
                    { id: 'moodboard', label: 'Moodboard Estético (Alt 7)' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCustomConfig({ ...customConfig, logistics: opt.id as any })}
                      className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                        customConfig.logistics === opt.id 
                          ? 'bg-[#ecb613] text-black font-bold border-[#ecb613]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Action CTA Block */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-[#ecb613] block">
                  4. Gatillo de Cierre & Reserva (CTA)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'slide-lock', label: 'Slide-to-Lock 100€' },
                    { id: 'sticky-gold', label: 'Botón Dorado Sticky' },
                    { id: 'whatsapp-agenda', label: 'Exportar a WhatsApp' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setCustomConfig({ ...customConfig, cta: opt.id as any })}
                      className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                        customConfig.cta === opt.id 
                          ? 'bg-[#ecb613] text-black font-bold border-[#ecb613]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RAW 10 ARCHETYPES CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/50 block">
                EXPLORA LOS 10 ARQUETIPOS EN BRUTO
              </span>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 1, name: '1. Neural Tinder-Deck' },
                  { id: 2, name: '2. Uber-Dispatch Radar' },
                  { id: 3, name: '3. Airbnb Bento Stays' },
                  { id: 4, name: '4. Bodas.net Timeline' },
                  { id: 5, name: '5. Cyber-Luxe Glass Dock' },
                  { id: 6, name: '6. Fast Match & Dispatch' },
                  { id: 7, name: '7. Moodboard Concierge' },
                  { id: 8, name: '8. Acoustic Matrix 12W' },
                  { id: 9, name: '9. Storyselling Reel' },
                  { id: 10, name: '10. Sovereign Master 360°' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setCatalogArchetypeIndex(item.id)}
                    className={`p-3 rounded-2xl border text-xs font-mono font-bold text-left transition-all ${
                      catalogArchetypeIndex === item.id 
                        ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-md' 
                        : 'bg-[#0e0e13] border-white/10 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: LIVE SIMULATOR PREVIEW (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-2 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-[#ecb613]" /> Previsualización en Vivo
            </span>
            <span className="text-emerald-400">● S-Class Simulator</span>
          </div>

          {/* iPhone Pro Frame Simulator */}
          <div className="relative w-full max-w-[360px] h-[720px] rounded-[3rem] bg-[#0c0c12] border-[7px] border-[#20202a] shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Dynamic Island Bar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#181822] mr-1.5" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d0d14]" />
            </div>

            {/* Screen Content */}
            <div className="flex-1 overflow-hidden pt-5 relative flex flex-col bg-[#050505]">
              {activeTab === 'catalog' ? (
                catalogArchetypeIndex === 1 ? <Archetype1_TinderDeck /> :
                catalogArchetypeIndex === 2 ? <Archetype2_UberRadar /> :
                catalogArchetypeIndex === 3 ? <Archetype3_AirbnbBento /> :
                catalogArchetypeIndex === 4 ? <Archetype4_BodasTimeline /> :
                catalogArchetypeIndex === 5 ? <Archetype5_CyberGlassDock /> :
                catalogArchetypeIndex === 6 ? <Archetype6_FastMatchDispatch /> :
                catalogArchetypeIndex === 7 ? <Archetype7_WeddingMoodboardConcierge /> :
                catalogArchetypeIndex === 8 ? <Archetype8_AcousticPressureMatrix /> :
                catalogArchetypeIndex === 9 ? <Archetype9_StorysellingStream /> :
                <Archetype10_SovereignFusionMaster />
              ) : (
                renderCustomPreview()
              )}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
          </div>
        </div>

      </div>

    </div>
  );
}
