"use client";

// Ruta: src/app/components/layout/EarBottomNav.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, SlidersHorizontal, Users, Shield, Terminal } from 'lucide-react';
import { useEventCart } from '@/context/EventCartContext';

const EarBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { cart } = useEventCart();

  // En la raíz inicial (Gateway Soberano) no se muestra ningún menú
  if (pathname === '/') {
    return null;
  }

  const items = [
    { id: 'servicios', label: 'MATCHMAKER', href: '/servicios', icon: Sparkles },
    { id: 'cotizador', label: 'COTIZADOR', href: '/cotizador', icon: SlidersHorizontal },
    { id: 'artistas', label: 'ARTISTAS', href: '/artistas', icon: Users },
    { id: 'arsenal', label: 'ARSENAL', href: '/arsenal', icon: Shield },
    { id: 'admin', label: 'NEXUS', href: '/admin/nexus', icon: Terminal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/20 px-6 py-2.5 flex justify-between items-center z-40 rounded-t-2xl shadow-2xl">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href);
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${
              isActive ? 'text-[#F2CA50] scale-105 font-black' : 'text-[#C6C6C6] opacity-50 hover:opacity-100'
            }`}
          >
            <div className="relative">
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.id === 'servicios' && cart.length > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 text-black text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold tracking-widest uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default EarBottomNav;