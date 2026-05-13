"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { SovereignSkeleton } from '@/modules/SClassScreens/components/SovereignSkeleton';

const OmnibusVertical = dynamic(() => import('@/modules/SClassScreens/panels/OmnibusVertical'), {
  ssr: false,
  loading: () => <SovereignSkeleton />
});

export default function FlotaPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Suspense fallback={<SovereignSkeleton />}>
        <OmnibusVertical />
      </Suspense>
    </div>
  );
}
