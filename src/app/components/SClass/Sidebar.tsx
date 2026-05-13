"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Sliders, 
  Zap, 
  ShieldCheck, 
  LogOut,
  Target,
  Megaphone,
  Sparkles,
  Settings,
  Activity
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { name: 'CENTRO DE MANDO', icon: LayoutDashboard, path: '/admin' },
  { name: 'REACTOR VIMUME', icon: Activity, path: '/admin/vimume' },
  { name: 'CAZADOR FANTASMA', icon: Target, path: '/admin/hunter' },
  { name: 'MATRIZ DE SOBERANOS', icon: Users, path: '/admin/crm' },
  { name: 'CONTROL DE FLOTA', icon: Truck, path: '/admin/flota' },
  { name: 'ORÁCULO ASTRA', icon: Sparkles, path: '/admin/oraculo' },
  { name: 'ARSENAL MARKETING', icon: Megaphone, path: '/arsenal' },
  { name: 'CONFIGURADOR', icon: Settings, path: '/admin/configurador' },
  { name: 'ESTADO TÁCTICO', icon: ShieldCheck, path: '/admin/estado' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0 overflow-hidden z-[60] pointer-events-auto shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* LOGO S-CLASS */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="flex flex-col gap-1">
          <div className="font-serif italic font-black text-2xl tracking-tighter text-[#d4a855]">S-CLASS</div>
          <div className="font-mono uppercase text-[0.65rem] tracking-[0.2rem] text-white/40">OPERATOR 01</div>
        </div>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`
                group relative flex items-center gap-3 px-4 py-3 transition-all duration-500
                ${isActive 
                  ? 'bg-[#d4a855]/10 text-[#d4a855] border-r-2 border-[#d4a855]' 
                  : 'text-white/30 hover:text-white hover:bg-white/[0.02]'}
              `}>
                <item.icon className={`w-4 h-4 transition-transform duration-500 ${isActive ? 'text-[#d4a855] scale-110' : 'group-hover:scale-110'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-0 w-[2px] h-4 bg-[#d4a855] shadow-[0_0_10px_#d4a855]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / PERFIL */}
      <div className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mb-4 px-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-500/70 uppercase tracking-widest">System Online</span>
          </div>
          <p className="text-[7px] font-mono text-white/20 uppercase tracking-[0.2em]">Bóveda: 39MB Ingested</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/20 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Eject System</span>
        </button>
      </div>
    </aside>
  );
}
