'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Tick { source: string; platform: string; totals: Record<string, number> }
interface Item { id: string; kind: string; name: string; size: number; distribution: Record<string, string> }

export default function CarreraPage(): React.ReactElement {
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [last, setLast] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const es = new EventSource('/api/artist/career/metrics');
    es.onmessage = (e: MessageEvent<string>) => {
      const t = JSON.parse(e.data) as Tick;
      setTotals(t.totals);
      setLast(t.platform);
    };
    return () => es.close();
  }, []);

  async function upload(files: FileList | null): Promise<void> {
    if (!files?.length) return;
    setBusy(true); setErr('');
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', f);
      const r = await fetch('/api/artist/career/upload', { method: 'POST', body: fd });
      const j = (await r.json()) as Item & { error?: string };
      if (!r.ok) setErr(j.error ?? 'Error'); else setItems((p) => [j, ...p]);
    }
    setBusy(false);
  }

  const sum = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] min-h-screen p-8 text-white space-y-10">
      <header>
        <h1 className="text-3xl font-black tracking-tight">Mi Carrera · Centro de Mando</h1>
        <p className="text-xs text-white/40 mt-1">Métricas en vivo (demo hasta conectar OAuth de plataformas)</p>
      </header>

      <section aria-label="Métricas en tiempo real">
        <div className="font-mono text-5xl text-[#ecb613] min-h-[3.5rem]">{sum.toLocaleString('es-ES')}</div>
        <p className="text-xs text-white/40">reproducciones totales</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {(Object.keys(totals).length ? Object.entries(totals) : [['…', 0]]).map(([k, v]) => (
            <div key={k} className={`rounded-xl border p-4 h-24 ${k === last ? 'border-[#ecb613]' : 'border-white/10'}`}>
              <div className="text-[10px] uppercase tracking-widest text-white/50">{k}</div>
              <div className="font-mono text-xl mt-2">{Number(v).toLocaleString('es-ES')}</div>
            </div>
          ))}
        </div>
      </section>

      <section aria-label="Subir canciones y vídeos" className="space-y-4">
        <h2 className="text-lg font-bold">Subir canciones y vídeos</h2>
        <input ref={input} type="file" multiple accept="audio/*,video/*" className="hidden"
          onChange={(e) => void upload(e.target.files)} />
        <button type="button" disabled={busy} onClick={() => input.current?.click()}
          className="px-6 py-3 rounded-lg bg-[#ecb613] text-black font-bold disabled:opacity-50">
          {busy ? 'Subiendo…' : 'Seleccionar archivos (≤100 MB)'}
        </button>
        {err && <p className="text-[#FF2B44] text-sm">{err}</p>}
        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="rounded-lg border border-white/10 p-3 text-sm">
              <span className="font-bold">{i.name}</span>{' '}
              <span className="text-white/40 font-mono">{i.kind} · {(i.size / 1048576).toFixed(1)} MB</span>
              <div className="text-[11px] text-white/40 mt-1">
                {Object.entries(i.distribution).map(([p, s]) => `${p}: ${s.replace('_', ' ')}`).join(' · ')}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

