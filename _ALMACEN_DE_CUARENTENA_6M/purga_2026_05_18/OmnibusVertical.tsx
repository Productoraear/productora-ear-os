'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import OmnibusTracker from './panels/OmnibusTracker';
// import OriginalOmnibusDataHub from './OmnibusTracker';
import { Truck, Database, Globe, Zap } from 'lucide-react';

/**
 * 🏛️ MODULE: OMNIBUS VERTICAL (S-Class v5.0 GOLD)
 * Unified Logistics, CRM & Market Matrix for "Omnibus".
 * Switches between Fleet Tracking (Tactical) and Data Hub (CRM/Market).
 */

export default function OmnibusVertical() {
    const [activePanel, setActivePanel] = useState<'FLEET' | 'HUB'>('FLEET');

    const panels = {
        FLEET: { component: <div className="p-4 text-white/50">Telemetría de Flota en cuarentena.</div>, icon: Truck, label: 'Telemetría de Flota' },
        HUB: { component: <div className="p-4 text-white/50">Bóveda CRM & Market en cuarentena.</div>, icon: Database, label: 'Bóveda CRM & Market' }
    };

    return (
        <div className="flex flex-col gap-6 h-full min-h-screen bg-[#050505] p-8 rounded-[4rem] border border-white/5 relative overflow-hidden">
            {/* Navigation Overlay */}
            <div className="flex items-center gap-4 mb-8 bg-zinc-900/50 backdrop-blur-3xl p-3 rounded-full border border-white/5 w-fit self-center z-50">
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

            <div className="flex-1 min-h-0 relative z-10">
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
                <h2 className="text-8xl font-black italic text-white uppercase tracking-tighter">OMNIBUS</h2>
            </div>
        </div>
    );
}
