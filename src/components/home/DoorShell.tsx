import React from 'react';
import Link from 'next/link';
import { CONNECTORS, DOORS, ECOSYSTEM_SECTORS } from '@/lib/catalog/ecosystem-ontology';
import type { DoorId } from '@/lib/catalog/ecosystem-ontology';

/**
 * Cabecera adaptativa + cuerpo de vertical. Tipografía global:
 * H1 18px/600, H2 15px/500, cuerpo 13px (mínimo), etiquetas 12px.
 */
export function DoorShell({ door, children }: { door: DoorId; children?: React.ReactNode }): React.JSX.Element {
  const def = DOORS[door];
  const sectors = ECOSYSTEM_SECTORS.filter((s) => s.primaryDoor === door);

  return (
    <main className="min-h-screen bg-[#030305] text-white">
      <header className="border-b border-[#1E1E26]">
        <nav
          aria-label="Menú de sección"
          className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-[13px] text-[#94A3B8]"
        >
          <Link href="/" className="font-medium text-white">EAR OS</Link>
          <Link href="/vimume" className="text-[#D4AF37]">VIMUME</Link>
          {def.menu.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-12">
        <h1 className="text-[18px] font-semibold tracking-[-0.02em]">{def.title}</h1>
        <p className="mt-2 text-[13px] leading-[1.5] text-[#94A3B8]">{def.subtitle}</p>
        <ul className="mt-6 space-y-2 text-[13px] leading-[1.5] text-[#94A3B8]">
          {def.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-12">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Categorías de esta puerta</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {sectors.map((s) => (
            <div key={s.id} className="rounded-xl border border-[#1E1E26] bg-[#0A0A0E] p-4">
              <h3 className="text-[15px] font-medium tracking-[-0.01em]">{s.label}</h3>
              <ul className="mt-2 space-y-1 text-[13px] leading-[1.5] text-[#94A3B8]">
                {s.categories.map((cat) => (
                  <li key={cat.id}>{cat.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {children}

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Cómo puede participar</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CONNECTORS.map((k) => (
            <div key={k.id} className="rounded-xl border border-[#1E1E26] bg-[#0A0A0E] p-4">
              <span className="text-[12px] text-[#D4AF37]">{k.label}</span>
              <p className="mt-1 text-[13px] leading-[1.5] text-[#94A3B8]">{k.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
