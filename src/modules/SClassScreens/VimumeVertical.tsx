'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VimumeDashboard from './panels/VimumeDashboard';
import VimumeTrackerPanel from './panels/VimumeTrackerPanel';
import VimumeCorePanel from './panels/VimumeCorePanel';
import { Activity, Brain, Database, Layers } from 'lucide-react';

/**
 * 🏛️ MODULE: VIMUME VERTICAL (S-Class v5.0 GOLD)
 * Unified Clinical & Operational Matrix for "Viaje Musical por la Memoria".
 * Switches between Clinical Dashboard, Tracker, and Core RAG.
 */

export default function VimumeVertical() {
    const [activePanel, setActivePanel] = useState<'CLINICAL' | 'TRACKER' | 'CORE'>('CLINICAL');

    const panels = {
        CLINICAL: { component: <VimumeDashboard />, icon: Activity, label: 'Panel Clínico' },
        TRACKER: { component: <VimumeTrackerPanel />, icon: Layers, label: 'Rastreador Táctico' },
        CORE: { component: <VimumeCorePanel />, icon: Database, label: 'Bóveda RAG' }
    };

    return (
        <div className="flex flex-col gap-6 h-full min-h-screen bg-[#050505] p-8 rounded-[4rem] border border-white/5 relative overflow-hidden">
            {/* Navigation Overlay */}
            <div className="flex items-center gap-4 mb-8 bg-zinc-900/50 backdrop-blur-3xl p-3 rounded-full border border-white/5 w-fit self-center">
                {(Object.keys(panels) as Array<keyof typeof panels>).map((key) => {
                    const Panel = panels[key];
                    const isActive = activePanel === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setActivePanel(key)}
                            className={`flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                isActive 
                                ? 'bg-[#d4a855] text-black shadow-[0_0_30px_rgba(212,168,85,0.3)] scale-105' 
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Panel.icon size={16} />
                            {Panel.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex-1 min-h-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePanel}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full"
                    >
                        {panels[activePanel].component}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Global S-Class Watermark */}
            <div className="absolute bottom-12 right-12 opacity-5 pointer-events-none">
                <h2 className="text-8xl font-black italic text-white uppercase tracking-tighter">VIMUME</h2>
            </div>
        </div>
    );
}
