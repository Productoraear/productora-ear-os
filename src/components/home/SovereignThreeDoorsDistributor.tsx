import React from 'react';
import Link from 'next/link';
import { DOORS, DOOR_ORDER } from '@/lib/catalog/ecosystem-ontology';

/** Enrutador frontal: una pregunta, tres puertas. Sin precios ni jerga técnica. */
export function SovereignThreeDoorsDistributor(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <div className="mb-10">
        <p className="text-[12px] text-[#D4AF37]">
          <Link href="/vimume">VIMUME · Acción cultural</Link>
        </p>
        <h1 className="mt-3 text-[18px] font-semibold tracking-[-0.02em] text-white">
          ¿Cuál es tu propósito en EAR OS?
        </h1>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#94A3B8]">
          Elige una puerta. El resto del portal se adapta a tu recorrido.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {DOOR_ORDER.map((id) => {
          const d = DOORS[id];
          return (
            <Link
              key={id}
              href={d.href}
              className="flex flex-col justify-between rounded-xl border border-[#1E1E26] bg-[#0A0A0E] p-5 transition-colors hover:border-[#D4AF37]"
            >
              <div>
                <h2 className="text-[15px] font-medium tracking-[-0.01em] text-white">{d.title}</h2>
                <p className="mt-2 text-[13px] leading-[1.5] text-[#94A3B8]">{d.subtitle}</p>
                <ul className="mt-4 space-y-1 text-[13px] leading-[1.5] text-[#94A3B8]">
                  {d.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <span className="mt-6 text-[13px] font-medium text-[#D4AF37]">{d.cta} →</span>
            </Link>
          );
        })}
      </div>

      <footer className="mt-16 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#1E1E26] pt-6 text-[12px] text-[#94A3B8]">
        <Link href="/fincas" className="hover:text-white">Red Nacional de Fincas &amp; Espacios Homologados</Link>
        <Link href="/proveedores" className="hover:text-white">Directorio Soberano de Proveedores (52 Provincias)</Link>
        <Link href="/centralita-mariachis" className="hover:text-white">Centralita de Mariachis (220 nodos)</Link>
        <Link href="/productora-ear" className="hover:text-white">Red Nacional 52 Provincias (268 nodos)</Link>
        <Link href="/portal/proveedor" className="hover:text-white">Cabina Universal del Proveedor</Link>
        <Link href="/presupuesto" className="hover:text-white">Cotizador &amp; Simulador S-Class</Link>
      </footer>
    </div>
  );
}
