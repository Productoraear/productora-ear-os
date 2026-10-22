'use client';

import { useMemo, useState } from 'react';
import { create } from 'qrcode';

type SongVerdict = 'bloqueada' | 'aprobada';

interface CanonicalSong {
  id: string;
  title: string;
  artist: string;
  reason: string;
  alternative: string;
}

interface CustomSong {
  id: string;
  title: string;
  artist: string;
}

interface ProhibitedEntry {
  id: string;
  title: string;
  artist: string;
  reason: string;
  alternative: string;
}

interface GuestRequestResult {
  verdict: SongVerdict;
  requested: string;
  matched: ProhibitedEntry | null;
}

const CANONICAL_SONGS: CanonicalSong[] = [
  { id: 'macarena', title: 'La Macarena', artist: 'Los del Río', reason: 'Coreografía saturada y previsible', alternative: 'Valerie — Amy Winehouse' },
  { id: 'paquito-chocolatero', title: 'Paquito el Chocolatero', artist: 'King África', reason: 'Asociado a verbenas masivas', alternative: 'Bésame Mucho — Consuelo Velázquez' },
  { id: 'despacito', title: 'Despacito', artist: 'Luis Fonsi', reason: 'Sobreexposición mediática', alternative: 'Thinking Out Loud — Ed Sheeran' },
  { id: 'chiringuito', title: 'El Chiringuito', artist: 'Georgie Dann', reason: 'Estética de karaoke de playa', alternative: 'Fly Me to the Moon — Frank Sinatra' },
  { id: 'asereje', title: 'Aserejé', artist: 'Las Ketchup', reason: 'Letra sin profundidad de gala', alternative: 'Smooth — Santana' },
  { id: 'la-bomba', title: 'La Bomba', artist: 'King África', reason: 'Ritmo de verbena', alternative: 'Corazón Espinado — Maná' },
  { id: 'gangnam-style', title: 'Gangnam Style', artist: 'PSY', reason: 'Baile viral agotado', alternative: 'Get Lucky — Daft Punk' },
  { id: 'ai-se-eu-te-pego', title: 'Ai Se Eu Te Pego', artist: 'Michel Teló', reason: 'Moda efímera', alternative: 'La Flaca — Jarabe de Palo' },
  { id: 'danza-kuduro', title: 'Danza Kuduro', artist: 'Don Omar', reason: 'Cliché de fiesta popular', alternative: 'Vivir Mi Vida — Marc Anthony' },
  { id: 'waka-waka', title: 'Waka Waka', artist: 'Shakira', reason: 'Himno deportivo sobreutilizado', alternative: 'Africa — Toto' },
  { id: 'el-tiburon', title: 'El Tiburón', artist: 'Proyecto Uno', reason: 'Lírica festiva de tono bajo', alternative: 'Oye Cómo Va — Santana' },
  { id: 'mi-nina-bonita', title: 'Mi Niña Bonita', artist: 'Chino & Nacho', reason: 'Reguetón genérico', alternative: 'Eres Tú — Mocedades' },
  { id: 'levantando-manos', title: 'Levantando las Manos', artist: 'El Símbolo', reason: 'Coreografía de gimnasio', alternative: 'September — Earth, Wind & Fire' },
  { id: 'la-mayonesa', title: 'La Mayonesa', artist: 'Chocolate', reason: 'Tono cómico no apto para gala', alternative: 'Stand by Me — Ben E. King' },
  { id: 'mueve-colita', title: 'Mueve la Colita', artist: 'Sociedad Anónima', reason: 'Lírica inapropiada', alternative: 'Sultans of Swing — Dire Straits' },
];

const GALA_SAFE_FALLBACK =
  'Un clásico atemporal de gala: «At Last» — Etta James o «La Vie en Rose» — Édith Piaf.';

const DEFAULT_REQUEST_URL = 'https://productoraear.com/musica/canciones-prohibidas';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findProhibitedMatch(query: string, list: ProhibitedEntry[]): ProhibitedEntry | null {
  const needle = normalize(query);
  if (needle.length === 0) return null;
  for (const song of list) {
    const haystack = normalize(song.title);
    if (haystack.length > 0 && (haystack.includes(needle) || needle.includes(haystack))) {
      return song;
    }
  }
  return null;
}

function renderQrSvg(data: string): string {
  const qr = create(data, { errorCorrectionLevel: 'M' });
  const moduleCount = qr.modules.size;
  const quietZone = 4;
  const cellSize = 5;
  const dimension = (moduleCount + quietZone * 2) * cellSize;
  const blocks: string[] = [];
  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.modules.get(row, col) === 1) {
        const x = (col + quietZone) * cellSize;
        const y = (row + quietZone) * cellSize;
        blocks.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="0.6"/>`);
      }
    }
  }
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dimension} ${dimension}" role="img" aria-label="Código QR de peticiones musicales" shape-rendering="crispEdges">`,
    `<rect width="${dimension}" height="${dimension}" fill="#050505"/>`,
    `<g fill="#ecb613">${blocks.join('')}</g>`,
    `</svg>`,
  ].join('');
}

export default function ProhibitedSongsVault() {
  const [prohibitedIds, setProhibitedIds] = useState<Set<string>>(
    () => new Set(CANONICAL_SONGS.map((song) => song.id)),
  );
  const [customSongs, setCustomSongs] = useState<CustomSong[]>([]);
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [requestUrl, setRequestUrl] = useState<string>(DEFAULT_REQUEST_URL);
  const [guestQuery, setGuestQuery] = useState('');
  const [guestResult, setGuestResult] = useState<GuestRequestResult | null>(null);

  const prohibitedList = useMemo<ProhibitedEntry[]>(() => {
    const canonical: ProhibitedEntry[] = CANONICAL_SONGS.filter((song) => prohibitedIds.has(song.id)).map(
      (song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        reason: song.reason,
        alternative: song.alternative,
      }),
    );
    const customs: ProhibitedEntry[] = customSongs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      reason: 'Tema añadido por los anfitriones',
      alternative: GALA_SAFE_FALLBACK,
    }));
    return [...canonical, ...customs];
  }, [prohibitedIds, customSongs]);

  const qrSvg = useMemo<string>(() => {
    const url = requestUrl.trim();
    if (url.length === 0) return '';
    try {
      return renderQrSvg(url);
    } catch {
      return '';
    }
  }, [requestUrl]);

  const liveMatch = useMemo<ProhibitedEntry | null>(
    () => findProhibitedMatch(guestQuery, prohibitedList),
    [guestQuery, prohibitedList],
  );

  const toggleSong = (id: string): void => {
    setProhibitedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addCustomSong = (): void => {
    const title = customTitle.trim();
    if (title.length === 0) return;
    setCustomSongs((previous) => [
      ...previous,
      { id: `custom-${Date.now()}-${previous.length}`, title, artist: customArtist.trim() },
    ]);
    setCustomTitle('');
    setCustomArtist('');
  };

  const removeCustomSong = (id: string): void => {
    setCustomSongs((previous) => previous.filter((song) => song.id !== id));
  };

  const submitGuestRequest = (): void => {
    const requested = guestQuery.trim();
    if (requested.length === 0) return;
    const matched = findProhibitedMatch(requested, prohibitedList);
    setGuestResult({ verdict: matched ? 'bloqueada' : 'aprobada', requested, matched });
  };

  const downloadQr = (): void => {
    if (qrSvg.length === 0) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'qr-peticiones-dj.svg';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const printQr = (): void => {
    if (qrSvg.length === 0) return;
    const printWindow = window.open('', '_blank', 'width=820,height=980');
    if (!printWindow) return;
    const markup = [
      '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>QR Peticiones DJ</title>',
      '<style>body{margin:0;padding:40px;background:#050505;color:#fff;font-family:system-ui,sans-serif;text-align:center}',
      'h1{font-size:20px;letter-spacing:.2em;color:#ecb613;text-transform:uppercase}',
      'p{font-size:14px;color:#a1a1aa;margin:8px 0 24px}',
      '.qr{max-width:360px;margin:0 auto}</style></head><body>',
      '<h1>Peticiones musicales</h1>',
      `<p>Escanea para solicitar tu canción al DJ · ${requestUrl.trim()}</p>`,
      `<div class="qr">${qrSvg}</div>`,
      '</body></html>',
    ].join('');
    printWindow.document.open();
    printWindow.document.write(markup);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
  };

  return (
    <section aria-labelledby="boveda-titulo" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 ease-out hover:border-[#ecb613]/30">
          <div className="flex items-center justify-between mb-5">
            <h2 id="boveda-titulo" className="font-syne text-2xl font-bold tracking-tight text-white">
              Bóveda de Canciones Prohibidas
            </h2>
            <span className="rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1 text-xs font-mono text-[#ecb613]">
              {prohibitedList.length} vetadas
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Marca o desmarca los temas que jamás deben sonar en tu celebración. Cada veto activa un
            filtro en tiempo real para el DJ.
          </p>

          <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {CANONICAL_SONGS.map((song) => {
              const active = prohibitedIds.has(song.id);
              return (
                <li key={song.id}>
                  <label
                    htmlFor={song.id}
                    className={`flex items-start gap-3 rounded-2xl border p-3 transition-all duration-300 ease-out cursor-pointer ${
                      active
                        ? 'bg-[#FF2B44]/10 border-[#FF2B44]/30'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'
                    }`}
                  >
                    <input
                      id={song.id}
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleSong(song.id)}
                      className="mt-1 h-4 w-4 accent-[#ecb613]"
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-white">
                        {song.title}{' '}
                        <span className="text-zinc-500 font-normal">— {song.artist}</span>
                      </span>
                      <span className="block text-xs text-zinc-500 mt-0.5">{song.reason}</span>
                      <span className="block text-xs text-[#ecb613] mt-0.5">
                        Alternativa: {song.alternative}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              addCustomSong();
            }}
            className="mt-6 border-t border-white/10 pt-5"
          >
            <h3 className="font-syne text-base font-semibold text-white mb-3">
              Añadir canción personalizada
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={customTitle}
                onChange={(event) => setCustomTitle(event.target.value)}
                placeholder="Título (ej. Mi canción)"
                aria-label="Título de la canción personalizada"
                className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613]/50 transition-all"
              />
              <input
                value={customArtist}
                onChange={(event) => setCustomArtist(event.target.value)}
                placeholder="Artista (opcional)"
                aria-label="Artista de la canción personalizada"
                className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613]/50 transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#ecb613] text-black px-4 py-2 text-sm font-bold hover:brightness-110 transition-all duration-300 ease-out"
              >
                Añadir
              </button>
            </div>
            {customSongs.length > 0 && (
              <ul className="mt-3 space-y-2">
                {customSongs.map((song) => (
                  <li
                    key={song.id}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2"
                  >
                    <span className="text-sm text-white">
                      {song.title}{' '}
                      {song.artist ? <span className="text-zinc-500">— {song.artist}</span> : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeCustomSong(song.id)}
                      aria-label={`Quitar ${song.title} de la lista negra`}
                      className="text-zinc-500 hover:text-[#FF2B44] transition-colors text-xs"
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 ease-out hover:border-[#ecb613]/30">
            <h2 className="font-syne text-2xl font-bold tracking-tight text-white mb-2">
              QR de peticiones para las mesas
            </h2>
            <p className="text-sm text-zinc-400 mb-5">
              Apunta a la URL donde los invitados solicitan canciones. El código se regenera en
              tiempo real.
            </p>
            <label
              htmlFor="request-url"
              className="block text-xs text-zinc-500 uppercase tracking-widest mb-1"
            >
              URL de peticiones
            </label>
            <input
              id="request-url"
              value={requestUrl}
              onChange={(event) => setRequestUrl(event.target.value)}
              className="w-full rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#ecb613]/50 transition-all mb-5"
            />
            <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 flex items-center justify-center min-h-[200px]">
              {qrSvg ? (
                <div className="w-full max-w-[240px]" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              ) : (
                <p className="text-sm text-zinc-500">Introduce una URL válida</p>
              )}
            </div>
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={downloadQr}
                className="flex-1 rounded-xl bg-[#ecb613] text-black px-4 py-2.5 text-sm font-bold hover:brightness-110 transition-all duration-300 ease-out"
              >
                Descargar QR
              </button>
              <button
                type="button"
                onClick={printQr}
                className="flex-1 rounded-xl bg-white/[0.05] border border-white/10 text-white px-4 py-2.5 text-sm font-bold hover:bg-white/[0.1] transition-all duration-300 ease-out"
              >
                Imprimir QR
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 transition-all duration-300 ease-out hover:border-[#ecb613]/30">
            <h2 className="font-syne text-2xl font-bold tracking-tight text-white mb-2">
              Simulador de petición para invitados
            </h2>
            <p className="text-sm text-zinc-400 mb-5">
              Escribe un tema y comprueba el filtro en vivo: si está vetado, el sistema lo bloquea
              con elegancia y propone una alternativa de gala.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitGuestRequest();
              }}
              className="flex flex-col sm:flex-row gap-2 mb-3"
            >
              <input
                value={guestQuery}
                onChange={(event) => setGuestQuery(event.target.value)}
                placeholder="Ej. La Macarena"
                aria-label="Canción solicitada por el invitado"
                className="flex-1 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#ecb613]/50 transition-all"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#00E5FF] text-black px-4 py-2 text-sm font-bold hover:brightness-110 transition-all duration-300 ease-out"
              >
                Solicitar
              </button>
            </form>

            <div aria-live="polite">
              {guestQuery.trim().length > 0 && liveMatch ? (
                <p className="text-sm text-[#FF2B44] font-medium">
                  ⛔ «{guestQuery.trim()}» está en la lista negra.
                </p>
              ) : guestQuery.trim().length > 0 ? (
                <p className="text-sm text-emerald-400 font-medium">
                  ✓ Tema libre: el DJ puede aceptarlo.
                </p>
              ) : null}

              {guestResult ? (
                <div
                  className={`mt-3 rounded-2xl border p-4 transition-all duration-300 ease-out ${
                    guestResult.verdict === 'bloqueada'
                      ? 'bg-[#FF2B44]/10 border-[#FF2B44]/40'
                      : 'bg-emerald-400/10 border-emerald-400/40'
                  }`}
                >
                  {guestResult.verdict === 'bloqueada' && guestResult.matched ? (
                    <>
                      <p className="text-sm font-bold text-white mb-1">
                        Pedido bloqueado con elegancia
                      </p>
                      <p className="text-sm text-zinc-300">
                        «{guestResult.requested}» coincide con{' '}
                        <span className="text-[#FF2B44]">{guestResult.matched.title}</span>
                        {guestResult.matched.artist ? ` (${guestResult.matched.artist})` : ''} y está
                        vetado por los anfitriones.
                      </p>
                      <p className="text-sm text-zinc-400 mt-2">
                        Motivo: {guestResult.matched.reason}.
                      </p>
                      <p className="text-sm text-[#ecb613] mt-2 font-medium">
                        Recomendación de alta gama:{' '}
                        {guestResult.matched.alternative || GALA_SAFE_FALLBACK}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-white mb-1">Petición aceptada</p>
                      <p className="text-sm text-zinc-300">
                        «{guestResult.requested}» no está vetado y se ha enviado al DJ.
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
