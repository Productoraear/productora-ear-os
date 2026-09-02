"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const AstraAppRoot = dynamic(
  () => import('@/features/astra/AstraAppRoot'),
  { ssr: false, loading: () => <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#ecb613] font-mono">Iniciando Suite Estratégica Astra...</div> }
);

export default function AstraAdminPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <AstraAppRoot />
    </div>
  );
}
