"use client";

import React from 'react';
import { ArrowRight, ArrowLeft, BookOpen, LayoutGrid, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

interface RelatedLink {
  title: string;
  href: string;
  label: string;
}

interface SubPageNavigationProps {
  relatedLinks: RelatedLink[];
  nextStep: {
    title: string;
    href: string;
    label: string;
  };
}

export function SubPageNavigation({ relatedLinks, nextStep }: SubPageNavigationProps) {
  return (
    <section className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* 📚 ARTÍCULOS RELACIONADOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.href}
              className="group p-10 bg-white/5 border border-white/5 rounded-3xl hover:border-[#ecb613]/30 transition-all space-y-4"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#ecb613]/60">{link.label}</span>
              <h4 className="text-xl font-black uppercase tracking-tighter italic group-hover:text-white transition-colors">{link.title}</h4>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/20 group-hover:text-[#ecb613] transition-all">
                Leer más <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* 🚀 SIGUIENTE PASO & RETORNO */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 p-16 bg-[#ecb613]/5 border border-[#ecb613]/10 rounded-[4rem]">
          <div className="space-y-4 text-center lg:text-left">
            <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              Siguiente <span className="text-[#ecb613]">Paso</span>
            </h3>
            <p className="text-white/40 text-lg italic max-w-xl">"{nextStep.title}"</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <Link 
              href={nextStep.href}
              className="px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-widest text-[11px] rounded-full hover:scale-105 transition-all shadow-[0_15px_40px_rgba(236,182,19,0.2)] flex items-center gap-3"
            >
              {nextStep.label} <ArrowRight size={14} />
            </Link>
            <Link 
              href={ROUTES.vimume}
              className="px-10 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-white/5 transition-all flex items-center gap-3"
            >
              <LayoutGrid size={14} /> Volver al Hub
            </Link>
          </div>
        </div>

        {/* 🔗 RETORNO AL ECOSISTEMA GLOBAL */}
        <div className="flex justify-center pt-8">
          <Link 
            href="/"
            className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-[#ecb613] transition-all"
          >
            <ArrowLeft size={14} /> Retornar al Ecosistema EAR
          </Link>
        </div>
      </div>
    </section>
  );
}
