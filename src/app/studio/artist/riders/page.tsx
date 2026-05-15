import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Upload, 
  Download, 
  History, 
  ShieldCheck, 
  MoreHorizontal,
  Plus,
  Zap,
  ArrowRight
} from 'lucide-react';

/**
 * 🛰️ EMANAGER STUDIO — TECHNICAL RIDERS (GESTIÓN DE ACTIVOS)
 * Vertical: Talent OS
 */

export default function ArtistRidersPage() {
  return (
    <div className="space-y-12">
      
      {/* 🏁 HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Technical <span className="text-white/20">Riders</span></h1>
          <p className="text-white/40 text-sm font-medium italic">Gestión de requisitos técnicos y hospitalidad para cada ejecución.</p>
        </div>
        <button className="bg-white text-black px-10 py-5 rounded-2xl flex items-center gap-4 group hover:bg-[#ecb613] transition-all">
          <Plus size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nueva Versión</span>
        </button>
      </div>

      {/* 🧬 UPLOAD AREA: THE DROPZONE */}
      <div className="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[3.5rem] p-20 text-center space-y-8 hover:border-[#ecb613]/40 transition-all cursor-pointer group relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#ecb613]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative z-10 space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-white/20 group-hover:bg-[#ecb613] group-hover:text-black transition-all">
            <Upload size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Arrastra tu Rider (.pdf)</h3>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Tamaño máximo: 25MB · Versión 2.2 sugerida</p>
          </div>
          <div className="pt-4">
             <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ecb613] border-b border-[#ecb613]/20 pb-1">o busca en tu búnker local</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        
        {/* 📑 RECENT RIDERS */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter">Historial de Emisiones</h3>
          
          <div className="space-y-4">
             <RiderRow 
              version="2.1" 
              date="14/05/2026" 
              name="Rider Oficial - Gira 2026" 
              status="ACTIVO"
              isCurrent
             />
             <RiderRow 
              version="2.0" 
              date="02/02/2026" 
              name="Rider Acústico / Corporativo" 
              status="ARCHIVADO"
             />
             <RiderRow 
              version="1.8" 
              date="12/12/2025" 
              name="Rider - Festivales 2025" 
              status="ARCHIVADO"
             />
          </div>
        </div>

        {/* 🛡️ PROTOCOL / GUIDELINES */}
        <div className="space-y-8">
           <h3 className="text-2xl font-black uppercase italic tracking-tighter italic">Protocolo Técnico</h3>
           <div className="bg-[#0d0d0d] border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-white/[0.02]">
                <Zap size={160} />
              </div>
              
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3 text-[#ecb613]">
                   <ShieldCheck size={20} />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Estándar de Calidad</span>
                 </div>
                 <ul className="space-y-4">
                    <ProtocolItem text="Incluir plano de escenario (Stage Plot)" />
                    <ProtocolItem text="Listado detallado de microfonía (Patch List)" />
                    <ProtocolItem text="Requisitos de PA y Monitores" />
                    <ProtocolItem text="Sección de hospitalidad y catering" />
                 </ul>
                 <div className="pt-6 border-t border-white/5">
                    <Link href="#" className="flex items-center justify-between group/link">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover/link:text-white transition-colors">Descargar Plantilla EAR</span>
                      <ArrowRight size={14} className="text-[#ecb613] group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function RiderRow({ version, date, name, status, isCurrent = false }: { version: string, date: string, name: string, status: string, isCurrent?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl border flex items-center justify-between transition-all group ${
      isCurrent ? 'bg-[#ecb613]/5 border-[#ecb613]/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
    }`}>
      <div className="flex items-center gap-10">
         <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#ecb613]">
            <FileText size={28} />
         </div>
         <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[9px] font-black text-[#ecb613] uppercase tracking-widest">Versión {version}</span>
              <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest italic">{date}</span>
            </div>
            <h4 className="font-black uppercase italic tracking-tighter text-xl">{name}</h4>
         </div>
      </div>
      <div className="flex items-center gap-6">
         <div className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all cursor-pointer">
           <Download size={20} />
         </div>
         <div className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-all cursor-pointer">
           <MoreHorizontal size={20} />
         </div>
      </div>
    </div>
  );
}

function ProtocolItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-1 w-1.5 h-1.5 bg-[#ecb613] rounded-full shrink-0" />
      <span className="text-[11px] text-white/50 font-medium leading-relaxed">{text}</span>
    </li>
  );
}
