import React from 'react';
import { ArtistContract } from '@/lib/artists/schema';
import { FileText, ShieldCheck, Download, Calendar, DollarSign } from 'lucide-react';

interface ArtistContractsPanelProps {
  contracts: ArtistContract[];
}

export const ArtistContractsPanel: React.FC<ArtistContractsPanelProps> = ({ contracts }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Contratos y Acuerdos Legales</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold mt-1">Estatus legal de la relación del artista con el sello</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contracts.map((c) => {
          return (
            <div key={c.id} className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full" />
              
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/5 rounded-2xl text-white group-hover:bg-[#ecb613] group-hover:text-black transition-colors">
                  <FileText size={20} />
                </div>
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {c.status}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-black uppercase text-white tracking-tight">{c.title}</h4>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block font-mono">
                  REF: {c.id}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 text-xs">
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block">
                    Comisión del Sello
                  </span>
                  <span className="text-sm font-black text-white font-mono">{c.commissionRate}% Net</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block">
                    Anticipo Consolidado
                  </span>
                  <span className="text-sm font-black text-white font-mono">
                    {c.advanceAmount.toLocaleString()} EUR
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest pt-4">
                <Calendar size={12} className="text-[#ecb613]" /> Vigencia: {c.startDate} al {c.endDate}
              </div>

              <button className="w-full bg-white/5 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 border border-white/5">
                Descargar Contrato Firmado (PDF) <Download size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
