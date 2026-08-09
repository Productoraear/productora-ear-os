"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Radio as RadioIcon, Menu as MenuIcon, X as XIcon } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { Mail, Phone, Globe, Radio } from "lucide-react"; // Importing missing icons

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

/**
 * 🏛️ PUBLIC NAVBAR - VIMUME-FIRST LUMINOUS REFACTOR
 * Context-aware navigation that adapts to the new inspirational VIMUME theme.
 */
export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isVimumeContext = pathname.startsWith('/vimume');

  const navItems = isVimumeContext 
    ? [
        { label: "Inicio", href: ROUTES.vimume, isPill: false },
        { label: "Investigación", href: ROUTES.vimumeInvestigacion, isPill: false },
        { label: "Inversión", href: ROUTES.vimumeInversion, isPill: false },
        { label: "Roadmap", href: ROUTES.roadmap, isPill: false },
        { label: "Centros", href: ROUTES.vimumeCentros, isPill: false },
        { label: "Eventos", href: ROUTES.vimumeEventos, isPill: false },
        { label: "Nosotros", href: ROUTES.vimumeNosotros, isPill: false },
        { label: "FAQ", href: ROUTES.vimumeFaq, isPill: false },
      ]
    : [
        { label: "Artistas", href: ROUTES.artistas, isPill: false },
        { label: "Cotizador", href: ROUTES.cotizador, isPill: false },
        { label: "VIMUME", href: ROUTES.vimume, isPill: true },
        { label: "Empresas", href: ROUTES.empresarios, isPill: false },
        { label: "Dossier", href: ROUTES.dossier, isPill: false },
        { label: "Contacto", href: ROUTES.contacto, isPill: false },
      ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Theme constants
  const headerBg = isVimumeContext 
    ? (scrolled ? "bg-white/80 backdrop-blur-3xl border-b border-black/5" : "bg-transparent")
    : (scrolled ? "bg-black/60 backdrop-blur-3xl border-b border-white/5" : "bg-transparent");

  const textColor = isVimumeContext ? "text-[#1a1a1a]" : "text-white";
  const sublineColor = isVimumeContext ? "text-black/30" : "text-white/20";
  const navColor = isVimumeContext ? "text-[#1a1a1a]/60 hover:text-[#1a1a1a]" : "text-white/60 hover:text-white";
  const activeNavColor = "text-[#ecb613]";

  return (
    <header className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 py-4 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* 🏛️ BRAND BLOCK */}
        <Link href="/" className="group flex items-center gap-5">
          <div className="w-10 h-10 bg-[#ecb613] rounded-full flex items-center justify-center group-hover:scale-110 transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)]">
            <span className="text-black font-black text-xl italic leading-none">E</span>
          </div>
          
          <div className="flex flex-col justify-center">
            {isVimumeContext ? (
              <>
                <img 
                  src="/brand/vimume-logo-horizontal-light-blue.svg" 
                  alt="VIMUME" 
                  className="h-10 w-auto object-contain brightness-0 contrast-200" // Darken for ivory bg
                />
                <span className={`${sublineColor} text-[11px] font-black uppercase tracking-[0.3em] mt-1.5 ml-0.5`}>
                  por Productora EAR
                </span>
              </>
            ) : (
              <>
                <span className={`${textColor} font-black text-xl tracking-tighter italic uppercase`}>
                  PRODUCTORAEAR
                </span>
                <span className={`${sublineColor} text-[11px] font-black uppercase tracking-[0.4em] mt-1`}>
                  Infraestructura Pública
                </span>
              </>
            )}
          </div>
        </Link>

        {/* 🧭 NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[11px] uppercase tracking-[0.25em] font-black transition-all ${
                item.isPill 
                  ? "bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] px-4 py-2 rounded-full hover:bg-[#ecb613] hover:text-black shadow-[0_0_20px_rgba(236,182,19,0.1)]"
                  : pathname === item.href 
                    ? activeNavColor 
                    : navColor
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* ⚡ CTA */}
          <div className="flex items-center gap-4 ml-6">
            <ThemeToggle isVimumeContext={isVimumeContext} />
            <Link
              href={isVimumeContext ? ROUTES.vimumeContacto : ROUTES.contacto}
              className={`group relative px-7 py-3 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all overflow-hidden ${
                isVimumeContext 
                  ? "bg-[#1a1a1a] text-white hover:bg-[#ecb613] hover:text-black"
                  : "bg-white text-black hover:bg-[#ecb613] hover:text-black"
              }`}
            >
              <RadioIcon size={14} className={isVimumeContext ? "text-[#ecb613]" : "text-[#ecb613]"} />
              <span>{isVimumeContext ? "Solicitar Información" : "Activar"}</span>
              <div className="absolute inset-0 bg-[#ecb613] opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
            </Link>
          </div>
        </nav>

        {/* 📱 MOBILE TOGGLE */}
        <div className="flex items-center gap-4 lg:hidden">
          <ThemeToggle isVimumeContext={isVimumeContext} />
          <button
            className="transition-colors"
            style={{ color: isVimumeContext ? '#1a1a1a' : 'white' }}
            onClick={() => setOpen(!open)}
          >
            {open ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden backdrop-blur-3xl border-t border-black/5 overflow-hidden ${isVimumeContext ? 'bg-white/98' : 'bg-black/98'}`}
          >
            <div className="px-8 py-16 flex flex-col gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`text-3xl font-black italic uppercase tracking-tighter ${
                    pathname === item.href 
                      ? "text-[#ecb613]" 
                      : (isVimumeContext ? "text-black/30" : "text-white/30")
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              <Link
                href={isVimumeContext ? ROUTES.vimumeContacto : ROUTES.contacto}
                onClick={() => setOpen(false)}
                className="mt-4 px-8 py-5 bg-[#ecb613] text-black text-lg font-black uppercase italic tracking-tighter rounded-full text-center"
              >
                {isVimumeContext ? "Solicitar Información" : "Activar"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
