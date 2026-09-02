"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Landmark, Music, Calendar } from "lucide-react";
import { NAVIGATION_CONFIG, NavItem } from "@/lib/navigation";

export const GlobalNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname() || "";

  // Detect Active Vertical
  const getActiveVertical = () => {
    if (pathname.startsWith("/vimume")) return "VIMUME";
    if (pathname.startsWith("/artists") || pathname.startsWith("/artistas") || pathname.startsWith("/astra") || pathname.startsWith("/academy")) return "ARTISTAS";
    if (pathname.startsWith("/events") || pathname.startsWith("/eventos") || pathname.startsWith("/weddings") || pathname.startsWith("/rentals")) return "EVENTOS";
    return "GLOBAL";
  };

  const activeVertical = getActiveVertical();
  
  // SAFE ACCESS: Prevent build crashes if NAVIGATION_CONFIG is not fully loaded/defined
  const navLinks = (NAVIGATION_CONFIG && NAVIGATION_CONFIG[activeVertical]) || [];
  
  if (!NAVIGATION_CONFIG) {
    console.error("Critical: NAVIGATION_CONFIG is undefined in GlobalNavbar");
  }

  const getVerticalIcon = () => {
    switch (activeVertical) {
      case "VIMUME": return <Landmark size={14} className="text-[#d4af37]" />;
      case "ARTISTAS": return <Music size={14} className="text-[#d4af37]" />;
      case "EVENTOS": return <Calendar size={14} className="text-[#d4af37]" />;
      default: return null;
    }
  };

  const getLogoHref = () => {
    switch (activeVertical) {
      case "VIMUME": return "/vimume";
      case "ARTISTAS": return "/artists";
      case "EVENTOS": return "/eventos";
      default: return "/";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? "bg-black/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-8"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO (Kamal Style) */}
        <div className="flex items-center gap-4">
          <Link href={getLogoHref()} className="flex flex-col leading-none group">
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white transition-colors group-hover:text-[#d4af37]">
              EAR
            </span>
            <span className="text-[8px] md:text-[10px] font-medium tracking-[0.3em] text-zinc-500 uppercase mt-1 flex items-center gap-2">
              {activeVertical !== "GLOBAL" && getVerticalIcon()}
              {activeVertical === "GLOBAL" ? "EVENTS & PRODUCTIONS" : activeVertical}
            </span>
          </Link>
          
          {activeVertical !== "GLOBAL" && (
            <div className="hidden md:flex items-center gap-2 h-8 px-3 border-l border-white/10 ml-4">
              <Link href="/" className="text-[9px] font-black tracking-widest text-zinc-500 hover:text-white transition-colors uppercase">
                PORTAL HOME
              </Link>
            </div>
          )}
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative group h-full py-2"
              onMouseEnter={() => link.submenu && setActiveSubmenu(link.name)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              <Link 
                href={link.href}
                className={`text-[11px] font-bold tracking-[0.15em] transition-colors flex items-center gap-1 ${
                  pathname === link.href ? "text-[#d4af37]" : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                {link.submenu && <ChevronDown size={12} className={`transition-transform duration-300 ${activeSubmenu === link.name ? "rotate-180" : ""}`} />}
              </Link>

              {/* DASH (Hover effect) */}
              <div className={`absolute -bottom-1 left-0 h-[2px] bg-[#d4af37] transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />

              {/* SUBMENU */}
              <AnimatePresence>
                {link.submenu && activeSubmenu === link.name && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-4 w-64 bg-white py-4 shadow-2xl border-t-2 border-[#d4af37]"
                  >
                    {link.submenu.map((sub) => (
                      <Link 
                        key={sub.name}
                        href={sub.href}
                        className="block px-6 py-3 text-[10px] font-bold tracking-widest text-black hover:bg-zinc-100 hover:text-[#d4af37] transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* MOBILE TRIGGER */}
        <div className="flex items-center gap-4">
          {activeVertical !== "GLOBAL" && (
            <Link href="/" className="xl:hidden text-[10px] font-black tracking-widest text-[#d4af37] border border-[#d4af37]/30 px-3 py-1 rounded-full">
              GLOBAL
            </Link>
          )}
          <button 
            className="xl:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-[110] bg-black p-8 flex flex-col items-center justify-center gap-8 xl:hidden"
          >
            <button 
              className="absolute top-8 right-8 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col items-center gap-6 overflow-y-auto max-h-[80vh] w-full py-10">
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col items-center gap-4">
                  <Link 
                    href={link.href}
                    className={`text-2xl font-black tracking-tighter transition-colors ${
                      pathname === link.href ? "text-[#d4af37]" : "text-white"
                    }`}
                    onClick={() => !link.submenu && setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.submenu && (
                    <div className="flex flex-col items-center gap-2 border-l border-white/10 pl-4 py-2">
                      {link.submenu.map(sub => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="text-sm font-bold tracking-widest text-white/50 hover:text-[#d4af37]"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {activeVertical !== "GLOBAL" && (
                <Link 
                  href="/"
                  className="mt-8 text-xs font-black tracking-[0.3em] text-zinc-500 uppercase border border-white/10 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  VOLVER AL PORTAL GLOBAL
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

