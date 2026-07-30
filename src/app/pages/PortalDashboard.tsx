'use client';
import React, { useState } from 'react';
import VerifiedBadge from '../components/ui/VerifiedBadge';

export default function PortalDashboard() {
  const [config, setConfig] = useState({
    theme: 'S-Class Vanguard',
    fontSize: '16px',
    basePrice: 350,
    kmRate: 2
  });

  // Simulación de verificación de Edwin (Viene del Smoke Test de 1€)
  const [isEdwinVerified, setIsEdwinVerified] = useState(true);

  return (
    <div className="p-8 bg-black text-white min-h-screen font-sans">
      <header className="border-b border-green-500 pb-4 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-green-500">EAR OS COMMAND CENTER v2026</h1>
          <p className="text-gray-400">Estado del Sistema: <span className="text-green-400 font-mono">OPERATIVO S-CLASS</span></p>
        </div>
        <div className="bg-zinc-900 px-4 py-2 rounded-full border border-green-900/50">
          <span className="text-xs text-green-500 font-bold">● LIVE ALPHA</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de Configuración Visual */}
        <section className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-green-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🎨</span> Configuración Visual
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Tipografía Global</label>
              <select className="w-full bg-black p-2 rounded border border-zinc-700 text-sm">
                <option>Inter S-Class</option>
                <option>Vanguardist 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Modo de Interfaz</label>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-xs font-bold py-2 rounded">DARK</button>
                <button className="flex-1 bg-zinc-800 text-xs font-bold py-2 rounded">GLASS</button>
              </div>
            </div>
          </div>
        </section>

        {/* Panel de Tarifas (Solista Premium) */}
        <section className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-green-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> Tarifas (Solista Premium)
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Base Madrid</span>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={config.basePrice} 
                  onChange={(e) => setConfig({...config, basePrice: parseInt(e.target.value)})}
                  className="bg-black w-20 text-right px-2 py-1 rounded border border-zinc-700" 
                />
                <span className="text-zinc-500">€</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">KM Adicional</span>
              <span className="font-mono text-green-500">2.00€/km</span>
            </div>
            <div className="pt-4 border-t border-zinc-800">
              <p className="text-[10px] text-zinc-500 italic">Precios calculados con lógica Uber-Style avanzada.</p>
            </div>
          </div>
        </section>

        {/* Gestión de Artistas & Multimedia */}
        <section className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-green-500/30 transition-all">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>👥</span> Directorio de Artistas
          </h2>
          <div className="p-4 bg-black rounded border border-zinc-800 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">Edwin Agudelo</h3>
                <p className="text-xs text-zinc-500">Mariachi Solista Premium</p>
              </div>
              {isEdwinVerified && <VerifiedBadge />}
            </div>
            
            <button className="w-full bg-zinc-800 hover:bg-green-600 p-2 rounded text-xs font-bold transition-colors">
              EDITAR PERFIL & MULTIMEDIA
            </button>
            
            <div className="mt-4 flex gap-2">
               <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">BODAS</span>
               <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">GERIÁTRICOS</span>
               <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">MADRID</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}