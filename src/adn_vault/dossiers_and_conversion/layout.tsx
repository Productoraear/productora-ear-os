import React from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  FileText, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  Signal,
  Mic2
} from 'lucide-react';
import Link from 'next/link';

/**
 * 🛡️ EMANAGER STUDIO LAYOUT (BÚNKER OPERATIVO)
 * Vertical: Talent OS
 * Estética: Sovereign Onyx / Industrial Premium.
 */

export default function ArtistStudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30">
      
      {/* 🧬 SIDEBAR: COMANDANCIA TÉCNICA */}
      <aside className="w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-8">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]">
              <Signal size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Emanager Studio</span>
          </div>
          <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">V2.0.6 · Talent OS</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink href="/studio/artist" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarLink href="/studio/artist/perfil" icon={<UserCircle size={18} />} label="Mi Perfil" />
          <SidebarLink href="/studio/artist/riders" icon={<FileText size={18} />} label="Technical Riders" />
          <SidebarLink href="/studio/artist/bookings" icon={<Calendar size={18} />} label="Bookings & Giras" />
          <SidebarLink href="/studio/artist/finance" icon={<CreditCard size={18} />} label="Liquidaciones" />
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <SidebarLink href="/studio/artist/config" icon={<Settings size={18} />} label="Configuración" />
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-white/40 hover:text-red-500 hover:bg-red-500/5 transition-all text-xs font-black uppercase tracking-widest group">
            <LogOut size={18} /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT: EL CAMPO DE OPERACIONES */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Top Bar */}
        <header className="h-24 border-b border-white/5 px-12 flex items-center justify-between relative z-10 bg-[#050505]/50 backdrop-blur-xl">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10">
               <Mic2 size={18} />
             </div>
             <div>
               <h4 className="text-sm font-black uppercase tracking-tighter">Búnker del Artista</h4>
               <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Soberanía de Datos Activa</p>
             </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-white/5 flex items-center justify-center text-[10px] font-black uppercase">EA</div>
                 ))}
              </div>
              <div className="px-4 py-2 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full text-[#ecb613] text-[9px] font-black uppercase tracking-widest">
                Modo Auditoría
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-xs font-black uppercase tracking-widest group ${
        active 
          ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/10' 
          : 'text-white/40 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`${active ? 'text-black' : 'text-[#ecb613] opacity-60 group-hover:opacity-100 transition-opacity'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
