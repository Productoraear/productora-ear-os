"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface DynamicHeadlineProps {
  fallbackTitle: string;
  fallbackSubtitle?: string;
  className?: string;
}

/**
 * 🎯 GOOGLE ADS DYNAMIC KEYWORD INSERTION (DKI) & QUALITY SCORE 10/10
 * Detecta parámetros utm_term o kw de la campaña de Google Ads
 * y personaliza el titular en milisegundos para lograr la máxima concordancia de búsqueda.
 */
export const GoogleAdsDynamicHeadline: React.FC<DynamicHeadlineProps> = ({
  fallbackTitle,
  fallbackSubtitle,
  className = ""
}) => {
  const searchParams = useSearchParams();
  const [headline, setHeadline] = useState(fallbackTitle);
  const [isDynamic, setIsDynamic] = useState(false);

  useEffect(() => {
    const rawTerm = searchParams.get('utm_term') || searchParams.get('kw') || searchParams.get('q');
    if (rawTerm && rawTerm.trim().length > 3) {
      // Limpiar y formatear término de búsqueda a Title Case
      const formatted = rawTerm
        .replace(/\+/g, ' ')
        .replace(/%20/g, ' ')
        .trim();

      const capitalized = formatted
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      setHeadline(capitalized);
      setIsDynamic(true);
    }
  }, [searchParams, fallbackTitle]);

  return (
    <div className={`space-y-3 ${className}`}>
      {isDynamic && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/15 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-widest animate-pulse">
          <Sparkles size={12} />
          <span>BÚSQUEDA VERIFICADA S-CLASS</span>
        </div>
      )}
      
      <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-syne leading-none">
        {headline}
      </h1>

      {fallbackSubtitle && (
        <p className="text-sm sm:text-base text-white/70 font-light max-w-2xl leading-relaxed">
          {fallbackSubtitle}
        </p>
      )}
    </div>
  );
};
