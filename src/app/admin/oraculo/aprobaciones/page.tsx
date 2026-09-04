'use client';
import { useState, useContext } from 'react';
import { SparringContext } from '@/components/neural/SparringProvider';

export default function BandejaCuarentenaSClass() {
  const sparring = useContext(SparringContext);
  
  const [items, setItems] = useState([
    { id: 1, text: 'Edwin Agudelo, Tenor Lírico especialista en Rancheras...', selected: false },
    { id: 2, text: 'Táctica Takeaway: Si el cliente pide descuento, retirar la oferta de 3.800€...', selected: false }
  ]);

  const toggleSelect = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, selected: !item.selected } : item));
  };

  const updateText = (id: number, newText: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text: newText } : item));
  };

  return (
    <div className="p-8 bg-neutral-950 min-h-screen text-neutral-200 font-sans">
      <header className="mb-8 border-b border-amber-500/30 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">MATRIZ DE APROBACIÓN S-CLASS</h1>
          <p className="text-sm text-neutral-400">Edición granular, selección por lotes y entrenamiento proactivo.</p>
        </div>
        {/* BOTÓN DE EMERGENCIA TÁCTICA PARA DISPARAR EL SPARRING */}
        <button 
          onClick={() => sparring?.triggerSparring()}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all animate-pulse flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          ⚔️ Activar Sparring de Combate
        </button>
      </header>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-neutral-900 border border-neutral-800 p-4 rounded-xl items-start transition-colors hover:border-amber-500/50">
            <input 
              type="checkbox" 
              checked={item.selected} 
              onChange={() => toggleSelect(item.id)}
              className="mt-2 w-5 h-5 accent-amber-500 rounded bg-neutral-800 border-neutral-700 cursor-pointer"
            />
            <div className="flex-1">
              <textarea 
                value={item.text}
                onChange={(e) => updateText(item.id, e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-sm text-neutral-300 focus:outline-none focus:border-amber-500 resize-none"
                rows={3}
              />
              <div className="mt-2 text-xs text-amber-500/80 italic">
                💡 <strong>Sugerencia del Oráculo:</strong> "Utiliza este fragmento para defender la norma acústica de 12 W/pax ante comisiones de festejos."
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button className="bg-amber-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-amber-400 transition-colors">
          APROBAR SELECCIONADOS EN LOTE
        </button>
        <button className="bg-neutral-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-700 transition-colors">
          DESCARTAR RUIDO
        </button>
      </div>
    </div>
  );
}
