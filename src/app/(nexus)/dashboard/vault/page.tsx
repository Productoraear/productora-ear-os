'use client';

import React from 'react';
import { AssetVaultLayout } from '@/features/asset-vault/ui/AssetVaultLayout';
import EarBottomNav from '@/components/SClassScreens/EarBottomNav';

export default function VaultPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white relative pb-24">
      <AssetVaultLayout />
      
      {/* Navegación Soberana */}
      <EarBottomNav />
    </div>
  );
}
