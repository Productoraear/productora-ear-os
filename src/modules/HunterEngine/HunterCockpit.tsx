"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

/**
 * 🛰️ EL CAZADOR: Hunter Engine 
 * Directiva 05: Scraping de guerrilla y Alertas BOE / Plenos
 */

export function HunterCockpit() {
  const [activeTab, setActiveTab] = useState<'vimume' | 'guerrilla'>('vimume');

  const vimumeAlerts = [
    { id: 1, type: 'BOE', title: 'Resolución de ayudas a corporaciones locales (Tercera Edad)', amount: '120.000€', deadline: 'Vence en 14 Días', match: 94 },
    { id: 2, type: 'Pleno', title: 'Ayuntamiento de Madrid: Licitación de eventos de distrito', amount: '85.500€', deadline: 'Vence en 5 Días', match: 88 },
    { id: 3, type: 'BOJA', title: 'Subvenciones para desarrollo cultural y Alzheimer', amount: '220.000€', deadline: 'Vence en 30 Días', match: 97 },
  ];

  const guerrillaAlerts = [
    { id: 1, type: 'Wallapop', query: '"boda djs"', target: 'Novios buscando DJ barato', location: 'Madrid', action: 'Interceptar' },
    { id: 2, type: 'Eventbrite', query: '"fiesta patronal"', target: 'Organizador buscando logística', location: 'Andalucía', action: 'Hackear Presupuesto' },
    { id: 3, type: 'Bodas.net', query: '"foro finca"', target: 'Pareja dudando con Finca X', location: 'Barcelona', action: 'Desviar a Finca Y (EAR)' },
  ];

  return (
    <div className="bg-zinc-950/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 h-full">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            <Icons.Crosshair className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display tracking-tight text-white flex items-center gap-2">
              El Cazador <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] uppercase font-bold">Activo</span>
            </h2>
            <p className="text-xs text-zinc-500">Inteligencia Oportunista Autoguiada</p>
          </div>
        </div>

        <div className="flex gap-2 bg-black border border-white/10 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('vimume')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'vimume' ? 'bg-[#d4af37] text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Vimume / BOE
          </button>
          <button 
            onClick={() => setActiveTab('guerrilla')}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'guerrilla' ? 'bg-red-500 text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Guerrilla
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4"
        >
          {activeTab === 'vimume' ? (
            vimumeAlerts.map(alert => (
              <div key={alert.id} className="bg-black border border-[#d4af37]/20 rounded-xl p-4 flex justify-between items-center group hover:border-[#d4af37] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#d4af37]/10 flex items-center justify-center rounded-lg border border-[#d4af37]/30">
                    <Icons.FileText className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#d4af37] font-black uppercase tracking-widest">{alert.type} - {alert.deadline}</span>
                    <h4 className="font-bold text-white text-sm mt-1 group-hover:text-[#d4af37] transition-colors">{alert.title}</h4>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-zinc-500 uppercase">Volumen</span>
                    <div className="font-mono font-black text-white">{alert.amount}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-zinc-500">Match</span>
                    <span className="text-green-500 font-black">{alert.match}%</span>
                  </div>
                  <button className="h-10 px-4 flex items-center justify-center bg-white text-black font-black uppercase text-xs rounded hover:bg-[#d4af37] transition-colors">
                    Generar Proyecto
                  </button>
                </div>
              </div>
            ))
          ) : (
            guerrillaAlerts.map(alert => (
              <div key={alert.id} className="bg-black border border-red-500/20 rounded-xl p-4 flex justify-between items-center group hover:border-red-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 flex items-center justify-center rounded-lg border border-red-500/30">
                    <Icons.Radar className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">{alert.type} - {alert.location}</span>
                    <h4 className="font-bold text-white text-sm mt-1">{alert.target}</h4>
                    <span className="text-xs text-zinc-500 font-mono italic">Query: {alert.query}</span>
                  </div>
                </div>
                <button className="h-10 px-6 flex items-center justify-center bg-red-500/10 border border-red-500/50 text-red-500 font-black uppercase text-xs rounded hover:bg-red-500 hover:text-white transition-colors">
                  {alert.action}
                </button>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
