"use client";
import React, { useState } from 'react';
import { useEmpireStore } from '@/stores/useEmpireStore';
import { useTripwire } from '@/hooks/useTripwire';
import { api } from '@/lib/api';
import { Settings, Plus, Minus, ShieldCheck, Zap, Euro, CreditCard } from 'lucide-react';

const ITEMS_PREMIUM = [
  { id: 1, name: 'Logística Flota VIP (Mercedes-Maybach)', price: 4500 },
  { id: 2, name: 'Seguridad Privada S-Class (4 Agentes)', price: 2800 },
  { id: 3, name: 'Ingeniería Audiovisual & Mapping', price: 12500 },
  { id: 4, name: 'Catering Gourmet (Sello EAR)', price: 15000 },
];

export function ConfiguradorBespoke() {
  const { addSoberano } = useEmpireStore();
  const { igniteTripwire } = useTripwire();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [clientName, setClientName] = useState('');

  const total = selectedItems.reduce((acc, item) => acc + item.price, 0);

  const toggleItem = (item: any) => {
    const isSelected = selectedItems.find(i => i.id === item.id);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
      // Telemetría silenciosa al seleccionar item
      igniteTripwire('bespoke_item_select', { item: item.name, price: item.price });
    }
  };

  const handleCerrarAcuerdo = async () => {
    if (!clientName || total === 0) return;
    
    // Inyectamos el presupuesto en el sistema nervioso (Zustand + Firebase)
    const quoteData: any = {
      id: `bespoke_${Date.now()}`,
      client: clientName,
      concept: 'Proyecto Bespoke Custom',
      amount: total,
      type: 'bespoke_production',
      currency: 'EUR',
      breakdown: selectedItems,
      timestamp: new Date().toISOString(),
      items: selectedItems.map(i => i.name)
    };

    // Disparo de telemetría de alto nivel
    igniteTripwire('bespoke_conversion', quoteData);
    
    // Persistencia financiera real
    await api.submitQuote(quoteData);

    addSoberano({
      id: quoteData.id,
      nombre: clientName,
      valor: total,
      etapa: 'Cierre',
      probabilidad: 100
    });

    alert(`CONTRATO FIRMADO: €${total.toLocaleString()} inyectados en el Pipeline.`);
    setSelectedItems([]);
    setClientName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 bg-black/40 p-8 rounded-3xl border border-white/5 font-inter">
      <div className="flex justify-between items-center border-b border-[#d4a855]/20 pb-6">
        <div>
          <h2 className="text-2xl font-black uppercase text-white tracking-tighter flex items-center gap-3">
            <Settings className="text-[#d4a855]" size={28} /> INGENIERÍA <span className="text-[#d4a855]">BESPOKE</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-bold">Configurador de Experiencias de Alto Ticket</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PANEL DE SELECCIÓN */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="NOMBRE DEL SOBERANO / CLIENTE"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold text-white focus:border-[#d4a855]/50 focus:outline-none placeholder:text-white/20"
          />
          
          <div className="space-y-2">
            {ITEMS_PREMIUM.map(item => (
              <div 
                key={item.id}
                onClick={() => toggleItem(item)}
                className={`p-5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  selectedItems.find(i => i.id === item.id) 
                  ? 'border-[#d4a855] bg-[#d4a855]/10 shadow-[0_0_20px_rgba(212,168,85,0.1)]' 
                  : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold text-white/80">{item.name}</span>
                <span className="text-xs font-black text-[#d4a855]">€{item.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DE CIERRE */}
        <div className="glass-pane p-10 border-[#d4a855]/20 bg-black flex flex-col justify-between rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <Euro size={150} className="text-[#d4a855]" />
          </div>
          
          <div>
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Inversión Total Proyectada</p>
            <p className="text-6xl font-black text-white tracking-tighter">€{total.toLocaleString()}</p>
          </div>

          <div className="space-y-6 mt-12 relative z-10">
            <div className="flex items-center gap-3 text-green-400/70">
              <ShieldCheck size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">Garantía de Soberanía EAR v2</p>
            </div>
            
            <button 
              onClick={handleCerrarAcuerdo}
              disabled={!clientName || total === 0}
              className="w-full py-5 rounded-2xl bg-[#d4a855] text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(212,168,85,0.3)] disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
            >
              <CreditCard size={16} /> CERRAR ACUERDO TÁCTICO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguradorBespoke;
