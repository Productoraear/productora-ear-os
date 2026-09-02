"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, ShieldCheck } from 'lucide-react';

export const VimumeHeader = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const NAV_ITEMS = [
    { label: 'Inicio', href: '/vimume' },
    { label: 'Sobre Nosotros', href: '/vimume/sobre-nosotros' },
    { label: 'Servicios', href: '/vimume/servicios' },
    { label: 'Contacto', href: '/vimume/contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/vimume" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#ecb613] rounded-lg flex items-center justify-center text-black font-black transition-transform group-hover:rotate-12">
            V
          </div>
          <div>
            <span className="text-xl font-cinzel font-black tracking-widest text-white">VIMUME</span>
            <span className="block text-[8px] font-mono text-[#ecb613] uppercase tracking-[0.3em]">Viaje Musical Por La Memoria</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#ecb613] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/vimume/contacto">
            <button className="px-6 py-3 bg-[#ecb613] text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              Suscripción Vital
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-24 left-0 right-0 bg-black border-b border-white/10 p-10 flex flex-col gap-6 text-center"
        >
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-cinzel text-white/70 hover:text-[#ecb613]"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
};
