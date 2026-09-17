"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import MariachiJoinNetwork from '@/components/mariachi/MariachiJoinNetwork';

export default function MariachiJoinPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          href="/mariachis"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al Contratador de Mariachis
        </Link>

        <MariachiJoinNetwork />
      </div>
    </main>
  );
}
