'use client';

import React from 'react';
import { Mail, Phone, Calendar, UserCheck } from 'lucide-react';

export default function ArtistLeadsPage() {
  const leads = [
    { id: '1', name: 'Laura Gómez', type: 'Boda de Ensueño', date: '2026-06-20', status: 'PENDIENTE', contact: 'laura@email.com' },
    { id: '2', name: 'Ayuntamiento de Madrid', type: 'Fiestas Populares', date: '2026-05-15', status: 'CONFIRMADO', contact: 'ayto@madrid.es' },
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-12">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
            Leads Recibidos
          </span>
          <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
            Leads OS
          </span>
        </div>

        <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-8">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Bandeja de Contrataciones</h3>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-[#ecb613]/10 text-[#ecb613]">
                      {lead.status}
                    </span>
                    <span className="text-xs font-black uppercase text-white">{lead.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                    <span>{lead.type}</span>
                    <span>·</span>
                    <span>{lead.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] font-bold text-white/60">
                  <Mail size={12} /> {lead.contact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
