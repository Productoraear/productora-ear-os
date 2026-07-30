// Ruta: src/app/components/layout/EarBottomNav.tsx
import React from 'react';
import { LayoutGrid, Layers, Network, Trophy, Settings } from 'lucide-react';

const EarBottomNav: React.FC = () => {
  const items = [
    { id: 'portal', label: 'PORTAL', icon: LayoutGrid, isActive: true },
    { id: 'modulos', label: 'MÓDULOS', icon: Layers },
    { id: 'red', label: 'RED', icon: Network },
    { id: 'premios', label: 'PREMIOS', icon: Trophy },
    { id: 'ajustes', label: 'AJUSTES', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#D4AF37]/10 px-4 py-3 flex justify-between items-center z-50 rounded-t-3xl">
      {items.map((item) => (
        <button
          key={item.id}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            item.isActive ? 'text-[#F2CA50] scale-110' : 'text-[#C6C6C6] opacity-40 hover:opacity-100'
          }`}
        >
          <item.icon size={22} strokeWidth={item.isActive ? 2.5 : 2} />
          <span className="text-[8px] font-bold tracking-widest uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default EarBottomNav;