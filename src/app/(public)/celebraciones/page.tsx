import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DoorShell } from '@/components/home/DoorShell';

export const metadata: Metadata = {
  title: 'Celebraciones privadas y restauración · EAR OS',
  description: 'Restaurante Otzarreta en Derio, menús oficiales, música de gala y reserva con fianza deducible.',
  alternates: { canonical: 'https://productoraear.com/celebraciones' },
};

export default function CelebracionesPage(): React.JSX.Element {
  return (
    <DoorShell door="celebraciones">
      <section className="mx-auto max-w-5xl px-5 pb-12" id="fincas">
        <Link
          href="/otzarreta"
          className="inline-block rounded-xl border border-[#D4AF37] px-4 py-3 text-[13px] font-medium text-[#D4AF37]"
        >
          Ver Restaurante Otzarreta (Derio)
        </Link>
        <Link href="/artistas" className="ml-3 inline-block px-4 py-3 text-[13px] text-[#94A3B8] hover:text-white">
          Música de gala
        </Link>
      </section>
    </DoorShell>
  );
}
