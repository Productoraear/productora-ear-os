'use client';

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
  Mic2,
  ExternalLink,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * 🛡️ EMANAGER STUDIO LAYOUT (BÚNKER OPERATIVO)
 * Vertical: Talent OS
 * Estética: Sovereign Onyx / Industrial Premium.
 */

export default function ArtistStudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30">
      
      {/* 🧬 SIDEBAR: COMANDANCIA TÉCNICA */}
      <aside className="w-80 bg-[#0a0a0a] border-r border-white/5 flex flex-col p-8 justify-between">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]">
                <Signal size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Emanager Studio</span>
            </div>
            <p className="text-[9px] text-white/20 uppercase tracking-widest font-bold">V2.0.6 · Talent OS // Puente Artistas</p>
          </div>

          <nav className="space-y-2">
            <SidebarLink 
              href="/studio/artist" 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={pathname === '/studio/artist'} 
            />
            <SidebarLink 
              href="/studio/artist/perfil" 
              icon={<UserCircle size={18} />} 
              label="Mi Perfil" 
              active={pathname === '/studio/artist/perfil'} 
            />
            <SidebarLink 
              href="/studio/artist/riders" 
              icon={<FileText size={18} />} 
              label="Technical Riders" 
              active={pathname === '/studio/artist/riders'} 
            />
            <SidebarLink 
              href="/studio/artist/bookings" 
              icon={<Calendar size={18} />} 
              label="Bookings & Giras" 
              active={pathname === '/studio/artist/bookings'} 
            />
            <SidebarLink 
              href="/studio/artist/finance" 
              icon={<CreditCard size={18} />} 
              label="Liquidaciones (80%)" 
              active={pathname === '/studio/artist/finance'} 
            />
            <SidebarLink 
              href="/studio/artist/config" 
              icon={<Settings size={18} />} 
              label="Configuración" 
              active={pathname === '/studio/artist/config'} 
            />
          </nav>
        </div>

        {/* Bloque Inferior: Membresía y Salida */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          {/* Card de Membresía del Puente */}
          <div className="p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold text-[#ecb613] uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Plan Élite Anual
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/20 text-[#ecb613]">Activo</span>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed font-mono">
              290 €/año · Pasarela Stripe y Split 80% activos.
            </p>
            <Link
              href="/mariachis"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#ecb613] hover:underline pt-1"
            >
              <span>Ver Escaparate Público</span>
              <ExternalLink size={10} />
            </Link>
          </div>

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-mono font-bold uppercase tracking-wider"
          >
            <LogOut size={14} /> <span>Salir a Productora EAR</span>
          </Link>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT: EL CAMPO DE OPERACIONES */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Top Bar */}
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between relative z-10 bg-[#050505]/70 backdrop-blur-xl">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/10">
               <Mic2 size={18} />
             </div>
             <div>
               <h4 className="text-sm font-black uppercase tracking-tighter">Búnker del Artista</h4>
               <p className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Puente Tecnológico EAR OS // Soberanía 80%</p>
             </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-mono font-bold">
                <ShieldCheck size={12} />
                <span>Pasarela de Clientes Activa</span>
              </div>
              <div className="px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full text-[#ecb613] text-[10px] font-black uppercase tracking-widest font-mono">
                Modo Soberano
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 relative z-10">
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
      className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all text-xs font-black uppercase tracking-widest group ${
        active 
          ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-bold' 
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
