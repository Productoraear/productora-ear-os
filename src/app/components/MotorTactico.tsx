import React from 'react';
import { TrendingUp, ShieldAlert } from 'lucide-react';

export const MotorTactico = () => (
  <div className="col-span-2 glass-pane p-8 border-l-4 border-ear-gold relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      <TrendingUp size={120} />
    </div>
    <div className="flex justify-between items-start mb-12">
      <div className="space-y-1">
        <span className="text-[10px] font-black text-ear-gold uppercase tracking-[0.4em]">Flujo de Capital Real</span>
        <h2 className="text-5xl font-black text-white italic tracking-tighter">€128,450<span className="text-lg text-gray-600">.00</span></h2>
      </div>
      <div className="bg-[#d4a855]/10 p-4 rounded-2xl border border-[#d4a855]/20">
        <TrendingUp className="text-ear-gold" size={24} />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Impacto VIMUME</p>
        <p className="text-white font-black text-xl">+42% <span className="text-[10px] text-green-500 font-normal">S-Class</span></p>
      </div>
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Infraestructura B2G</p>
        <p className="text-white font-black text-xl">18 <span className="text-[10px] text-ear-gold font-normal">Leads</span></p>
      </div>
      <div>
        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-1">Seguridad Nexus</p>
        <p className="text-white font-black text-xl flex items-center gap-2">99.9% <ShieldAlert size={14} className="text-blue-500" /></p>
      </div>
    </div>
  </div>
);
