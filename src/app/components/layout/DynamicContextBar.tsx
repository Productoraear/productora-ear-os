"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { FileText, MapPin, Calendar, Heart, Shield, Award, Users, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function DynamicContextBar() {
  const pathname = usePathname();
  const { role, isB2G, isArtist } = useSovereignRole();

  // En la raíz, admin y checkout nunca se muestra esta barra flotante
  if (pathname === '/' || pathname?.startsWith('/admin') || pathname?.startsWith('/checkout')) {
    return null;
  }

  // Novia / B2C / Client / Guest
  if (role === 'ROLE_CLIENT' || role === 'ROLE_GUEST') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
        <div className="bg-black/90 backdrop-blur-2xl border border-[#ecb613]/20 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
          <Link href="/cotizador" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">COTIZADOR</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/artistas" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">TINDER-MATCH</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/contacto" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Calendar className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">RESERVAR</span>
          </Link>
        </div>
      </div>
    );
  }

  // Alcalde / Institucional / B2G
  if (isB2G || role === 'ROLE_B2G') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
        <div className="bg-[#050505]/95 backdrop-blur-2xl border border-[#ecb613]/30 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
          <Link href="/vimume/conocimiento" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <FileText className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">PLIEGOS LCSP</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/admin/flota" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <MapPin className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">TRACKING UBER</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/vimume/contacto" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Shield className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">GARANTÍAS B2G</span>
          </Link>
        </div>
      </div>
    );
  }

  // Artista (Edwin / Músicos)
  if (isArtist || role === 'ROLE_ARTIST') {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
        <div className="bg-[#0b0b0b]/95 backdrop-blur-2xl border border-[#ecb613]/40 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          <Link href="/studio/artist/riders" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Volume2 className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">MIS RIDERS</span>
          </Link>
          <div className="h-6 w-[1px] bg-white/10" />
          <Link href="/studio/artist/finance" className="flex flex-col items-center justify-center p-2 text-white/70 hover:text-[#ecb613] transition-colors">
            <Award className="w-5 h-5" />
            <span className="text-[8px] mt-1 font-bold tracking-wider">LEDGER FINANCIERO</span>
          </Link>
        </div>
      </div>
    );
  }

  // Default Fallback
  return null;
}
