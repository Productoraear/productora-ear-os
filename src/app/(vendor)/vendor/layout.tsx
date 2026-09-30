import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Speaker,
  CalendarDays,
  WalletCards,
  LogOut,
  SlidersHorizontal,
  Tag,
  Inbox,
  Store,
  ShieldAlert,
  Star
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { getVendorSessionAction } from '@/app/actions/vendorAuthActions';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await getVendorSessionAction();
  const isImpersonated = session?.isImpersonated || false;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row selection:bg-[#ecb613] selection:text-black font-sans">

      {/* ⚠️ BANNER DE SUPLANTACIÓN ASISTIDA ADMIN */}
      {isImpersonated && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-mono text-amber-300 font-bold flex items-center justify-center gap-2 fixed top-0 w-full z-[100] backdrop-blur-md">
          <ShieldAlert size={14} className="text-[#ecb613]" />
          <span>MODO SOPORTE ADMIN ACTIVO — SUPLANTANDO CON AUDITORÍA A: <strong className="text-white uppercase">{session?.vendorSlug}</strong></span>
        </div>
      )}

      {/* 📱 Mobile Header */}
      <header className={`lg:hidden w-full bg-[#09090d]/90 backdrop-blur-2xl border-b border-white/10 p-4 flex items-center justify-between sticky z-50 ${isImpersonated ? 'top-8' : 'top-0'}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black font-syne text-white tracking-tighter">
            EAR<span className="text-[#ecb613]">.OS</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-bold">
            VENDOR
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/vendor/dashboard"
            className="text-xs font-mono text-[#ecb613] px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-xl"
          >
            Dashboard
          </Link>
          <Link
            href="/vendor/login"
            className="text-xs text-zinc-400 hover:text-white p-1.5"
          >
            <LogOut size={18} />
          </Link>
        </div>
      </header>

      {/* 🖥️ Desktop Sidebar S-Class (OLED Dark Glass) */}
      <aside className={`hidden lg:flex w-72 bg-[#09090d]/80 backdrop-blur-2xl border-r border-white/10 flex-col fixed h-full z-50 justify-between ${isImpersonated ? 'top-8 pt-0 pb-8' : 'top-0'}`}>
        <div>
          {/* Logo & Status */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="text-2xl font-black font-syne text-white tracking-tighter block">
              EAR<span className="text-[#ecb613]">.OS</span>
            </Link>
            <div className="text-[10px] text-emerald-400 font-mono mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WORKSPACE ACTIVO S-CLASS</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="py-6 px-4 space-y-1.5 font-mono text-xs">
            <div className="text-[10px] font-bold text-zinc-500 mb-3 px-3 uppercase tracking-widest">
              Gestión de Proveedor
            </div>

            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-bold transition-all hover:scale-[1.02]"
            >
              <LayoutDashboard className="w-4 h-4 text-[#ecb613]" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/vendor/inbox"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Inbox className="w-4 h-4 text-blue-400" />
              <span>Bandeja de Leads</span>
            </Link>

            <Link
              href="/vendor/promociones"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Ofertas & Regalos</span>
            </Link>

            <Link
              href="/vendor/escaparate"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Store className="w-4 h-4 text-purple-400" />
              <span>Escaparate Público</span>
            </Link>

            <Link
              href="/vendor/media"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <ImageIcon className="w-4 h-4 text-zinc-400" />
              <span>Galería Multimedia</span>
            </Link>

            <Link
              href="/vendor/rider"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Speaker className="w-4 h-4 text-zinc-400" />
              <span>Rider S-Class</span>
            </Link>

            <Link
              href="/vendor/calendar"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <CalendarDays className="w-4 h-4 text-zinc-400" />
              <span>Disponibilidad (iCal)</span>
            </Link>

            <Link
              href="/vendor/billing"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <WalletCards className="w-4 h-4 text-zinc-400" />
              <span>Split 80/10/10</span>
            </Link>

            <Link
              href="/vendor/resenas"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all"
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Reseñas Verificadas</span>
            </Link>
          </nav>
        </div>

        {/* Footer Support & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-[10px] font-mono text-zinc-400 space-y-1">
            <span className="text-zinc-500 uppercase block font-bold">Centralita Técnica</span>
            <span className="text-[#ecb613] font-bold block">{CENTRALITA.display}</span>
          </div>

          <Link
            href="/vendor/login"
            className="flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 text-xs font-mono transition-colors"
          >
            <span>Cerrar Sesión</span>
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* 🌟 Main Content Area */}
      <main className={`flex-1 lg:ml-72 min-h-screen ${isImpersonated ? 'pt-8' : ''}`}>
        <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
