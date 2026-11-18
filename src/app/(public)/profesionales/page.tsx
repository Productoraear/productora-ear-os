import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DoorShell } from '@/components/home/DoorShell';

export const metadata: Metadata = {
  title: 'Profesionales, creadores y afiliados · EAR OS',
  description: 'Alta de ficha, alquiler técnico y red de afiliados con cobro garantizado.',
  alternates: { canonical: 'https://productoraear.com/profesionales' },
};

export default function ProfesionalesPage(): React.JSX.Element {
  return (
    <DoorShell door="profesionales">
      <section className="mx-auto max-w-5xl px-5 pb-12" id="publicar">
        <Link
          href="/alquiler-equipos-sonido-audiovisuales"
          className="inline-block rounded-xl border border-[#D4AF37] px-4 py-3 text-[13px] font-medium text-[#D4AF37]"
        >
          Alquiler técnico
        </Link>
        <Link href="/afiliados" className="ml-3 inline-block px-4 py-3 text-[13px] text-[#94A3B8] hover:text-white">
          Red de afiliados
        </Link>
      </section>
    </DoorShell>
  );
}
