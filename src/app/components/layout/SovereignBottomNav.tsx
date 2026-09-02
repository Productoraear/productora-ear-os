"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutGrid, Music, Briefcase, Wallet, Home, FileText, Brain, CalendarClock } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SovereignBottomNav = () => {
  const pathname = usePathname();
  const isVimumeContext = pathname.startsWith('/vimume');

  const navItems = isVimumeContext 
    ? [
        { name: 'Protocolo', href: '/vimume/protocolo', icon: <FileText className="w-5 h-5" /> },
        { name: 'Fundación', href: '/vimume/fundacion', icon: <Brain className="w-5 h-5" /> },
        { name: 'Vimume', href: '/vimume', icon: <LayoutGrid className="w-5 h-5" /> },
        { name: 'Roadmap', href: '/vimume/roadmap', icon: <CalendarClock className="w-5 h-5" /> },
        { name: 'Contacto', href: '/contacto', icon: <Wallet className="w-5 h-5" /> },
      ]
    : [
        { name: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
        { name: 'Producción', href: '/eventos', icon: <Briefcase className="w-5 h-5" /> },
        { name: 'Artistas', href: '/artistas', icon: <Music className="w-5 h-5" /> },
        { name: 'Vimume', href: '/vimume', icon: <LayoutGrid className="w-5 h-5" /> },
        { name: 'Panel', href: '/dashboard', icon: <Wallet className="w-5 h-5" /> },
      ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm">
      <nav className="bg-[#050505]/60 backdrop-blur-2xl border border-[#ecb613]/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center p-2">
            <div className={pathname === item.href ? 'text-[#ecb613]' : 'text-white/50'}>{item.icon}</div>
            <span className="text-[8px] mt-1 text-white/30">{item.name.toUpperCase()}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
export default SovereignBottomNav;