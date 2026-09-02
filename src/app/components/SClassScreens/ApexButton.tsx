'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/app/components/ui/MagneticButton';
import Link from 'next/link';

export const ApexButton: React.FC = () => {
  return (
    <Link href="/the-signal" className="block cursor-none">
      <MagneticButton>
        <div className="group relative px-12 py-6 bg-white text-black font-black uppercase tracking-[0.5em] text-[11px] rounded-full overflow-hidden transition-all duration-700 hover:bg-[#d4a855] hover:text-white">
          <span className="relative z-10 flex items-center gap-4">
            Iniciar Inmersión 
            <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-3 transition-transform duration-500" />
          </span>
          
          {/* Kinetic Fill Effect */}
          <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]" />
        </div>
      </MagneticButton>
    </Link>
  );
};
