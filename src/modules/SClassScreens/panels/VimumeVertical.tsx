"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VimumeNavigator, { VimumeView } from '../components/VimumeNavigator';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { SovereignSkeleton } from '../components/SovereignSkeleton';

// 🏛️ CARGA DINÁMICA DE PANELES S-CLASS GOLD
const VimumeClinical = dynamic(() => import('./VimumeDashboard'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeCore = dynamic(() => import('./VimumeCorePanel'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeTracker = dynamic(() => import('./VimumeTrackerPanel'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeSocial = dynamic(() => import('./VimumeSocial'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeLegacy = dynamic(() => import('./VimumeLegacy'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeAtlas = dynamic(() => import('./VimumeAtlas'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const VimumeProjects = dynamic(() => import('./VimumeProjectsPanel'), {
  loading: () => <SovereignSkeleton />,
  ssr: false
});

const AstraKPIPanel = dynamic(() => import('../components/AstraKPIPanel'), {
  loading: () => null,
  ssr: false
});

export default function VimumeVertical() {
  const [activeView, setActiveView] = useState<VimumeView>('CORE');

  const renderContent = () => {
    switch (activeView) {
      case 'CORE':
        return <VimumeCore key="core" />;
      case 'TRACKER':
        return <VimumeTracker key="tracker" />;
      case 'SOCIAL':
        return <VimumeSocial key="social" />;
      case 'LEGACY':
        return <VimumeLegacy key="legacy" />;
      case 'ATLAS':
        return <VimumeAtlas key="atlas" />;
      case 'PROJECTS':
        return <VimumeProjects key="projects" />;
      case 'CLINICAL' as any: // Extensión para el nuevo Dashboard Clínico
        return <VimumeClinical key="clinical" />;
      default:
        return <VimumeCore key="core" />;
    }
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col bg-[#050505] overflow-hidden relative font-inter">
      {/* NAVEGACIÓN UNIFICADA */}
      <div className="p-8 pb-0">
        <VimumeNavigator 
          activeView={activeView} 
          onViewChange={setActiveView} 
        />
      </div>

      {/* ÁREA DE CONTENIDO DINÁMICO */}
      <main className="flex-grow relative overflow-hidden flex p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex-1 h-full overflow-y-auto custom-scrollbar rounded-[3.5rem] bg-zinc-950/20 border border-white/5 p-2"
          >
            <div className="p-4 h-full">
                {renderContent()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 🧠 PANEL ASTRA LATERAL (MODO SOBERANO) */}
        <AnimatePresence>
          {(activeView === 'CORE' || activeView === 'TRACKER') && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[450px] h-full p-8 hidden 2xl:block"
            >
              <AstraKPIPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* DECORACIÓN AMBIENTAL S-CLASS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[160px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[160px]" />
      </div>
    </div>
  );
}
