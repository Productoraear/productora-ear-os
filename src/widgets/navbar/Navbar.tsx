"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Radio, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = () => setMobileMenuOpen(false);

  const menuItems = [
    { name: "Artistas", path: "/artistas" },
    { name: "Eventos", path: "/eventos" },
    { name: "Bodas", path: "/bodas" },
    { name: "Arsenal", path: "/arsenal" },
    { name: "Business", path: "/business" },
    { name: "Dossier", path: "/dossier" },
    { name: "Social", path: "/social" },
    { name: "Calculadora", path: "/calculadora" },
  ];

  return (
    <nav 
      className={`fixed w-full z-[100] transition-all duration-700 ${
        isScrolled 
          ? 'bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' 
          : 'bg-transparent border-b border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" onClick={closeMenus} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#ecb613] rounded-xl flex items-center justify-center text-black group-hover:rotate-6 transition-transform shadow-[0_0_20px_rgba(236,182,19,0.3)]">
              <Shield size={20} />
            </div>
            <span className={`font-display text-xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-[#ecb613]' : 'text-white'} group-hover:text-[#ecb613]`}>
              EAR <span className="text-white/40 font-light">OS</span>
            </span>
          </Link>

          <div className="hidden xl:flex space-x-1 items-center font-body text-[10px] tracking-[0.3em] uppercase font-black">
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                className="px-4 py-2 text-white/60 hover:text-[#ecb613] hover:bg-white/5 rounded-lg transition-all"
              >
                {item.name}
              </Link>
            ))}
            
            <Link href="/the-signal" className="ml-6 px-6 py-2.5 bg-[#ecb613] text-black hover:shadow-[0_0_25px_rgba(236,182,19,0.4)] transition-all duration-500 font-black flex items-center gap-2 rounded-xl text-[9px]">
              <Radio size={14} className="animate-pulse"/> THE SIGNAL
            </Link>
          </div>

          <div className="xl:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              className="p-2 text-white hover:bg-white/5 rounded-xl transition-all"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden fixed inset-0 top-[70px] bg-[#050505] backdrop-blur-3xl p-8 flex flex-col space-y-6 z-50 h-screen border-t border-white/5"
          >
            {menuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path} 
                onClick={closeMenus} 
                className="text-white text-3xl font-black uppercase tracking-tighter border-b border-white/5 pb-4 hover:text-[#ecb613] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            <Link 
              href="/the-signal" 
              onClick={closeMenus} 
              aria-label="Acceder a The Signal"
              className="w-full py-5 bg-[#ecb613] text-black font-black uppercase tracking-widest mt-12 flex items-center justify-center gap-3 rounded-2xl shadow-[0_0_30px_rgba(236,182,19,0.3)] text-sm"
            >
               <Radio size={20} className="animate-pulse" /> THE SIGNAL
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
