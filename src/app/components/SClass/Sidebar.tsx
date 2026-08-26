'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  Target, 
  Users, 
  Truck, 
  Sparkles, 
  Megaphone, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Smartphone
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { name: 'CENTRO DE MANDO', icon: LayoutDashboard, path: '/admin' },
  { name: 'MOBILE FUSION STUDIO', icon: Smartphone, path: '/admin/mobile-studio' },
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
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Fallback logout cleanup:', error);
    }
    try {
      localStorage.removeItem('ear_admin_auth');
      localStorage.removeItem('ear_user_role');
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0 overflow-hidden z-[60] pointer-events-auto shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* LOGO S-CLASS */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
        <Link href="/admin" className="flex flex-col gap-0.5 group">
          <div className="font-serif italic font-black text-2xl tracking-tighter text-[#d4a855] group-hover:text-[#ecb613] transition-colors">
            S-CLASS
          </div>
          <div className="font-mono uppercase text-[0.65rem] tracking-[0.2rem] text-white/40">
            OPERATOR 01
          </div>
        </Link>
      </div>

      {/* NAVEGACIÓN */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div className={`
                group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300
                ${isActive 
                  ? 'bg-[#d4a855]/15 text-[#d4a855] font-bold shadow-md' 
                  : 'text-white/40 hover:text-white hover:bg-white/[0.04]'}
              `}>
                <item.icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-[#d4a855] scale-110' : 'group-hover:scale-110'}`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300 ${isActive ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'}`}>
                  {item.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute right-0 w-[3px] h-4 bg-[#d4a855] rounded-l-full shadow-[0_0_10px_#d4a855]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER / PERFIL & LOGOUT */}
      <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-xl space-y-3">
        <div className="px-1">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-400/80 uppercase tracking-widest">Sistema Seguro</span>
          </div>
          <p className="text-[7px] font-mono text-white/30 uppercase tracking-[0.15em]">Admin Autenticado</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 font-mono text-[9px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Cerrar Sesión (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
