/**
 * SSE de métricas de carrera del artista.
 * NOTA HONESTA: mientras no haya OAuth con Spotify/YouTube/TikTok/Apple,
 * el flujo emite telemetría de DEMO etiquetada source:"demo".
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PLATFORMS = ['Spotify', 'YouTube', 'TikTok', 'Apple Music', 'Instagram'] as const;

export async function GET(req: Request): Promise<Response> {
  const encoder = new TextEncoder();
  let timer: ReturnType<typeof setInterval> | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const totals: Record<string, number> = {
        Spotify: 18420, YouTube: 9310, TikTok: 52780, 'Apple Music': 3150, Instagram: 7640,
      };
      const push = (): void => {
        const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
        totals[platform] += 1 + Math.floor(Math.random() * 12);
        const payload = { source: 'demo', ts: Date.now(), platform, totals };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };
      push();
      timer = setInterval(push, 1500);
      req.signal.addEventListener('abort', () => {
        if (timer) clearInterval(timer);
        try { controller.close(); } catch { /* ya cerrado */ }
      });
    },
    cancel() { if (timer) clearInterval(timer); },
  });
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' },
  });
}

