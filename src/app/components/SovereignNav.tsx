import React from 'react';
import { LayoutDashboard, Zap, Users, Music, Database, Search } from 'lucide-react';
import Link from 'next/link';

export const SovereignNav = () => (
  <nav className="fixed left-0 top-0 h-full w-20 bg-[#050505] border-r border-white/5 flex flex-col items-center py-8 gap-8 z-50">
    <div className="w-12 h-12 bg-ear-gold rounded-2xl flex items-center justify-center shadow-lg shadow-ear-gold/20 mb-4">
      <Zap size={24} className="text-black fill-current" />
    </div>
    <div className="flex flex-col gap-6">
      {[
        { icon: LayoutDashboard, href: '/dashboard', label: 'Centro de Mando' },
        { icon: Music, href: '/artistas', label: 'Flota Artística' },
        { icon: Zap, href: '/infraestructura', label: 'Infraestructura S-Class' },
        { icon: Database, href: '/vimume', label: 'Vimume' },
        { icon: Search, href: '/oracle', label: 'El Oráculo' }
      ].map((item, i) => (
        <Link key={i} href={item.href} title={item.label} className="p-3 text-gray-500 hover:text-ear-gold hover:bg-white/5 rounded-xl transition-all group">
          <item.icon size={22} className="group-hover:scale-110 transition-transform" />
        </Link>
      ))}
    </div>
  </nav>
);
