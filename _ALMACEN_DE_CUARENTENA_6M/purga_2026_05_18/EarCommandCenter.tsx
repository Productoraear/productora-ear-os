"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { syncSClassAuth } from '@/lib/services/auth_nexus';
import { User } from 'firebase/auth';
import { MotorTactico } from './components/MotorTactico';
import { ConfiguradorBespoke as BespokeConfigurator } from './ConfiguradorBespoke';
import { SimuladorEscenarios } from './components/SimuladorEscenarios';
import { BucleAprendizaje } from './components/BucleAprendizaje';
import { SovereignSkeleton } from './components/SovereignSkeleton';
import { DemandEngine } from './DemandEngine';
import { AllianceNetwork } from './AllianceNetwork';
import { AstraNeuralTwin } from './AstraNeuralTwin';
import { AutonomousOrchestrator } from './AutonomousOrchestrator';
// import OmnibusTracker from './OmnibusTracker';

export default function EarCommandCenter() {
  const [user, setUser] = useState<User | null>(null);
  const [estaInicializando, setEstaInicializando] = useState(true);

  useEffect(() => {
    const unsubscribe = syncSClassAuth((currentUser) => {
      setUser(currentUser);
      setEstaInicializando(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (estaInicializando) {
    return <SovereignSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-[var(--color-on-surface)] p-8">
      {/* CABECERA TÁCTICA SOBERANA */}
      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            CENTRO DE MANDO <span className="text-[#d4a855]">FÉNIX</span>
          </h1>
          <p className="text-sm text-white/40 uppercase tracking-[0.3em] mt-2 font-bold">
            Protocolo S-Class Gold Activo • Productora de Eventos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#d4a855] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[#d4a855] font-black">Sincronización Nexus: Activa</span>
          </div>
          <div className="glass-pane px-4 py-2 text-[10px] uppercase tracking-wider font-black border-[#d4a855]/20">
            {user ? user.email : 'ACCESO INVITADO (NO SEGURO)'}
          </div>
        </div>
      </header>

      {/* CUADRÍCULA DE ALTA DENSIDAD FUNCIONAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Suspense fallback={<SovereignSkeleton />}>
          <MotorTactico />
        </Suspense>
        <Suspense fallback={<SovereignSkeleton />}>
          <SimuladorEscenarios />
        </Suspense>
        <Suspense fallback={<SovereignSkeleton />}>
          <BucleAprendizaje />
        </Suspense>
      </div>

      {/* OMNIBUS TRACKER (Reemplaza a los 4 paneles fragmentados) */}
      <div className="mt-12">
        <Suspense fallback={<SovereignSkeleton />}>
          {/* <OmnibusTracker /> */}
          <div className="p-8 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">Omnibus Tracker en cuarentena.</div>
        </Suspense>
      </div>

      {/* CAPA LOGÍSTICA & DESPLIEGUE */}
      <div className="mt-12 space-y-12">
        <Suspense fallback={<SovereignSkeleton />}>
          <BespokeConfigurator />
        </Suspense>
      </div>

      {/* CAPA DE DOMINANCIA, DEMANDA & ALIANZAS */}
      <div className="mt-12 space-y-12">
        <Suspense fallback={<SovereignSkeleton />}>
          <DemandEngine />
        </Suspense>

        <Suspense fallback={<SovereignSkeleton />}>
          <AllianceNetwork />
        </Suspense>
        
        <Suspense fallback={<SovereignSkeleton />}>
          <AstraNeuralTwin />
        </Suspense>

        <Suspense fallback={<SovereignSkeleton />}>
          <AutonomousOrchestrator />
        </Suspense>
      </div>

    </div>
  );
}

