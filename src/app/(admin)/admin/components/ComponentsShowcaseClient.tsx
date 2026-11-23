'use client';

import React, { useState } from 'react';
import { Gauge, Smartphone } from 'lucide-react';
import { VANGUARDIA_THEMES, VANGUARDIA_VARIANTS } from '@/components/vanguardia/vanguardia-theme';
import type { VanguardiaVariant } from '@/components/vanguardia/vanguardia-theme';
import CopySnippetButton from './CopySnippetButton';
import ShowcasePreview from './ShowcasePreview';
import { SHOWCASE_ENTRIES } from './showcase-registry';
import type { ShowcaseEntry } from './showcase-registry';

function EntryCard({ entry, variant }: { entry: ShowcaseEntry; variant: VanguardiaVariant }) {
  const snippet = entry.buildSnippet(variant);
  return (
    <article className="space-y-4 rounded-3xl border border-white/10 bg-[#090910] p-4 sm:p-5" id={entry.id}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-white">{entry.name}</h2>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{entry.file}</p>
          <p className="mt-1 text-xs text-zinc-400">Uso: {entry.usage}</p>
        </div>
        <CopySnippetButton text={snippet} />
      </header>

      <ShowcasePreview id={entry.id} variant={variant} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ecb613]">
            <Gauge className="h-3.5 w-3.5" />
            Coste estimado: {entry.cost}
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">{entry.technique}</p>
          <p className="mt-1.5 font-mono text-[10px] text-zinc-600">
            Estimacion por analisis de la tecnica, no una medicion (SIN_EVIDENCIA hasta pasar audit_cls_budget).
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
          <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ecb613]">
            <Smartphone className="h-3.5 w-3.5" />
            Movil
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">{entry.mobile}</p>
        </div>
      </div>

      <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-zinc-300">
        <code>{snippet}</code>
      </pre>
    </article>
  );
}

export default function ComponentsShowcaseClient() {
  const [variant, setVariant] = useState<VanguardiaVariant>('oro');

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#06060a]/95 p-3">
        <p className="text-xs text-zinc-400">
          Biblioteca viva: 5 componentes de <span className="font-mono text-zinc-200">src/components/vanguardia/</span>
        </p>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Variante visual">
          {VANGUARDIA_VARIANTS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setVariant(key)}
              aria-pressed={variant === key}
              className={`min-h-[36px] rounded-xl border px-3.5 font-mono text-xs font-bold transition-colors ${
                variant === key
                  ? 'border-[#ecb613] bg-[#ecb613] text-black'
                  : 'border-white/10 bg-zinc-900/80 text-zinc-300 hover:text-white'
              }`}
            >
              {VANGUARDIA_THEMES[key].label}
            </button>
          ))}
        </div>
      </div>

      {SHOWCASE_ENTRIES.map((entry) => (
        <EntryCard key={entry.id} entry={entry} variant={variant} />
      ))}
    </div>
  );
}
