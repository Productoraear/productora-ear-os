import React from 'react';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { ChristmasLightingB2GPanel } from '@/components/admin/ChristmasLightingB2GPanel';

export const metadata: Metadata = {
  title: 'Radar B2G Iluminación Navideña & Licitaciones | EAR OS Admin',
  robots: { index: false, follow: false },
};

export default async function AdminIluminacionPage() {
  const filePath = path.join(process.cwd(), 'src/data/admin/christmas_lighting_b2g.json');
  let providers = [];

  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      providers = parsed.proveedores_iluminacion || [];
    } catch (e) {
      console.error('Error reading lighting database:', e);
    }
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      <ChristmasLightingB2GPanel initialData={providers} />
    </div>
  );
}
