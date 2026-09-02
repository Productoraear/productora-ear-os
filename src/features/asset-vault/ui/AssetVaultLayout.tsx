import React from 'react';
import { ShieldCheck, HardDrive, Lock, Search } from 'lucide-react';
import { MediaKitBento } from './MediaKitBento';

export const AssetVaultLayout: React.FC = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header de la Bóveda Suiza */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Sovereign Infrastructure</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] italic">
              Swiss <br />
              <span className="text-[#D4AF37]">Vault</span>
            </h1>
            <p className="text-white/40 text-sm max-w-md uppercase font-bold tracking-widest leading-relaxed">
              Gestión segura de activos de alta fidelidad, contratos institucionales y riders técnicos certificados por EAR OS.
            </p>
          </div>

          <div className="flex flex-col items-end gap-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-[#D4AF37] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="BUSCAR ACTIVO..." 
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black uppercase tracking-widest focus:border-[#D4AF37] outline-none transition-all w-64 md:w-80"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-white/20">Capacidad Total</span>
                <span className="text-sm font-black text-white italic">2.4 TB / S-CLASS</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase text-white/20">Nivel de Encriptación</span>
                <span className="text-sm font-black text-green-500 italic">AES-256 SOBERANO</span>
              </div>
            </div>
          </div>
        </div>

        {/* El Bento Grid de la Bóveda */}
        <MediaKitBento />

        {/* Footer de Seguridad */}
        <div className="pt-20">
          <div className="glass-panel p-8 rounded-3xl border-white/5 bg-white/[0.01] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <Lock className="text-[#D4AF37]" size={24} />
              <div>
                <h6 className="text-xs font-black uppercase tracking-widest text-white">Protocolo de Auditoría Activo</h6>
                <p className="text-[10px] text-white/40 uppercase font-medium">Cada acceso es registrado en el CommissionLedger forense.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">ID: VAULT-77-EAR</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Nodo: Producción Central</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
