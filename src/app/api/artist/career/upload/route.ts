import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const runtime = 'nodejs';

const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED = new Set([
  'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/mp4',
  'video/mp4', 'video/quicktime', 'video/webm',
]);

export async function POST(req: Request): Promise<NextResponse> {
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Falta archivo' }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: 'Formato no soportado' }, { status: 415 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Máx 100 MB' }, { status: 413 });

  const id = randomUUID();
  const ext = path.extname(file.name).replace(/[^.\w]/g, '').slice(0, 8);
  const dir = path.join(process.cwd(), '.data', 'artist-uploads');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}${ext}`), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    id,
    kind: file.type.startsWith('video') ? 'video' : 'audio',
    name: file.name,
    size: file.size,
    // Distribución real requiere OAuth/API de cada plataforma: estado honesto.
    distribution: { Spotify: 'pendiente_conexion', YouTube: 'pendiente_conexion', TikTok: 'pendiente_conexion', 'Apple Music': 'pendiente_conexion' },
  });
}

