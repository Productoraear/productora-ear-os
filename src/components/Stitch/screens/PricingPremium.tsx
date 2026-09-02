'use client';
import React from 'react';

export default function PricingPremium() {
  return (
    <div className="bg-[#221d10] min-h-screen text-white font-sans p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Invierte en <span className="text-[#ecb613]">Calidad</span></h2>
        <p className="text-gray-400">Estándares premium para artistas y marcas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Emanager', price: '$500', tier: 'Popular' },
          { title: 'Eventos', price: '$1,200', tier: 'Standard' },
          { title: 'Producción', price: 'Cotizar', tier: 'Premium' }
        ].map((plan, i) => (
          <div key={i} className="bg-[#332d19] border border-[#675a32] p-8 rounded-[30px] flex flex-col gap-6 relative overflow-hidden group hover:border-[#ecb613]/50 transition-all">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl">{plan.title}</h3>
              {plan.tier === 'Premium' && <span className="bg-[#ecb613] text-black text-[10px] font-black px-2 py-1 rounded-full uppercase">S-Class</span>}
            </div>
            <div className="text-4xl font-black text-[#ecb613]">{plan.price}</div>
            <button className="mt-4 w-full py-4 bg-white/5 border border-white/10 rounded-full font-bold uppercase text-xs tracking-widest group-hover:bg-[#ecb613] group-hover:text-black transition-all">
              Consultar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
