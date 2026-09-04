'use client';
import React, { useState } from 'react';
import { QUICK_LEAD_PRESETS, generarEnlaceWhatsApp } from '@/modules/whatsapp/whatsapp_engine';

export default function WhatsAppConverterWidget() {
  const [selectedPreset, setSelectedPreset] = useState(QUICK_LEAD_PRESETS[0]);
  const [customServicio, setCustomServicio] = useState(selectedPreset.servicio);
  const [customImporte, setCustomImporte] = useState(selectedPreset.importe);
  const [customZona, setCustomZona] = useState(selectedPreset.zona);

  const handleSelectChange = (index: number) => {
    const preset = QUICK_LEAD_PRESETS[index];
    setSelectedPreset(preset);
    setCustomServicio(preset.servicio);
    setCustomImporte(preset.importe);
    setCustomZona(preset.zona);
  };

  const urlWhatsApp = generarEnlaceWhatsApp({
    servicio: customServicio,
    importe: customImporte,
    zona: customZona
  });

  return (
    <div className="p-8 bg-neutral-950 min-h-screen text-neutral-100 font-sans">
      <header className="mb-8 border-b border-amber-500/30 pb-4">
        <h1 className="text-3xl font-extrabold text-amber-500 tracking-tight">PASARELA DE CONVERSIÓN WHATSAPP (EAR OS)</h1>
        <p className="text-sm text-neutral-400 mt-1">Canal directo de cierre comercial con pre-cálculo de rider y presupuesto integrado.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-4">⚡ Plantillas de Cierre Rápido</h2>
          <div className="space-y-3 mb-6">
            {QUICK_LEAD_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChange(idx)}
                className="w-full text-left bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 p-4 rounded-xl transition-all flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-amber-400 text-sm">{p.servicio}</div>
                  <div className="text-xs text-neutral-400 mt-1">{p.zona}</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm">{p.importe} €</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">💬 Generador de Enlace Directo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Servicio:</label>
                <input 
                  type="text" 
                  value={customServicio} 
                  onChange={(e) => setCustomServicio(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Importe (€):</label>
                  <input 
                    type="number" 
                    value={customImporte} 
                    onChange={(e) => setCustomImporte(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white font-mono text-sm focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Zona:</label>
                  <input 
                    type="text" 
                    value={customZona} 
                    onChange={(e) => setCustomZona(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a 
              href={urlWhatsApp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-extrabold py-3 px-6 rounded-xl shadow-lg transition-all text-sm tracking-wide"
            >
              📲 Abrir Chat WhatsApp (+34 693 693 048)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
