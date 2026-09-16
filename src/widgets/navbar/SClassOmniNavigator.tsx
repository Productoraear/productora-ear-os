"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { WEDDING_TAXONOMY_SSOT } from '@/config/weddingTaxonomy';
import { ChevronDown, Sparkles, Building2, Briefcase, Users, Crown, Zap } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'lugares-boda': <Building2 size={14} className="text-[#ecb613]" />,
  'proveedores': <Briefcase size={14} className="text-[#ecb613]" />,
  'novias': <Crown size={14} className="text-[#ecb613]" />,
  'novios': <Users size={14} className="text-[#ecb613]" />,
};

const SClassOmniNavigator: React.FC = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className="px-4 py-2 text-white/60 hover:text-[#ecb613] hover:bg-white/5 rounded-lg transition-all font-body text-[10px] tracking-[0.3em] uppercase font-black flex items-center gap-1.5"
      >
        <Sparkles size={13} className="text-[#ecb613]" />
        Explorar Bodas
        <ChevronDown size={13} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(980px,calc(100vw-2rem))] bg-[#050507]/95 backdrop-blur-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] p-6 rounded-2xl">
          {/* Header telemetry */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center">
                <Sparkles size={16} className="text-[#ecb613]" />
              </span>
              <div>
                <p className="font-syne text-sm font-black uppercase tracking-tight text-white">
                  Mirror Taxonomía Bodas.net
                </p>
                <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Banquetes · Proveedores · Novias · Novios · Tools
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                {WEDDING_TAXONOMY_SSOT.mainMenuItems.length} Bloques
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#ecb613]">
                {WEDDING_TAXONOMY_SSOT.tools.length} Tools
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {WEDDING_TAXONOMY_SSOT.mainMenuItems.map((category) => (
              <div key={category.id}>
                <Link
                  href={category.href}
                  onClick={handleClose}
                  className="flex items-center gap-2 text-white font-syne text-xs font-black uppercase tracking-wide hover:text-[#ecb613] transition-colors mb-3 group"
                >
                  {CATEGORY_ICONS[category.id]}
                  <span>{category.title}</span>
                </Link>
                <ul className="space-y-1">
                  {category.items.slice(0, 12).map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={handleClose}
                        className="block px-2 py-1.5 text-white/50 hover:text-[#ecb613] hover:bg-white/[0.04] rounded-lg text-[11px] font-body transition-all"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tools footer */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.3em] mb-3">
              Suite de Herramientas & Acceso Empresas
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/acg"
                onClick={handleClose}
                className="px-3 py-1.5 rounded-lg text-[10px] font-body font-bold uppercase tracking-wide border transition-all border-[#FF2B44]/30 bg-[#FF2B44]/5 text-[#FF2B44] hover:bg-[#FF2B44]/15"
              >
                <span className="flex items-center gap-1.5"><Zap size={12} /> ACG Reserva Directa</span>
              </Link>
              {WEDDING_TAXONOMY_SSOT.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  onClick={handleClose}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-body font-bold uppercase tracking-wide border transition-all ${
                    tool.isB2B
                      ? 'border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] hover:bg-[#ecb613]/15'
                      : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SClassOmniNavigator;