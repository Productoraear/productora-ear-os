import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const OVERRIDE_FILE_PATH = path.join(process.cwd(), 'src/data/providers/jardines_la_cartuja_override.json');

/** Tope de seguridad: la ficha pública no admite payloads arbitrarios. */
const MAX_BLOCKS = 200;

/**
 * SEC-1 · Fail-closed. La escritura de la ficha pública exige token de
 * administrador; si no hay secreto configurado, NADIE puede escribir.
 * Se acepta `x-ear-admin-token` o `Authorization: Bearer <token>`.
 */
function isAuthorizedAdmin(req: NextRequest): boolean {
  const expected = process.env.EAR_ADMIN_TOKEN || process.env.CRON_SECRET;
  if (!expected) return false;

  const headerToken = req.headers.get('x-ear-admin-token');
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const provided = headerToken || bearer;
  if (!provided) return false;

  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

// GET: Cargar configuración activa
export async function GET(req: NextRequest) {
  try {
    if (!fs.existsSync(OVERRIDE_FILE_PATH)) {
      return NextResponse.json({ error: 'Archivo de datos no encontrado' }, { status: 404 });
    }
    const rawData = fs.readFileSync(OVERRIDE_FILE_PATH, 'utf-8');
    const json = JSON.parse(rawData);
    return NextResponse.json({ success: true, data: json });
  } catch (error) {
    return NextResponse.json({ error: 'Error al leer la base de datos del espacio' }, { status: 500 });
  }
}

// POST: Guardar borrador o publicar en vivo con certificación SHA-256
export async function POST(req: NextRequest) {
  try {
    if (!isAuthorizedAdmin(req)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { blocks, isPublish } = body;

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Estructura de bloques inválida' }, { status: 400 });
    }

    if (blocks.length > MAX_BLOCKS) {
      return NextResponse.json(
        { error: `La ficha admite un máximo de ${MAX_BLOCKS} bloques` },
        { status: 413 }
      );
    }

    const rawData = fs.readFileSync(OVERRIDE_FILE_PATH, 'utf-8');
    const currentJson = JSON.parse(rawData);

    // Sello real: SHA-256 del contenido publicado (nunca Math.random).
    const publishedHash = isPublish
      ? `SHA256: ${crypto.createHash('sha256').update(JSON.stringify(blocks)).digest('hex')}`
      : currentJson.publishedHash;

    const updatedJson = {
      ...currentJson,
      blocks,
      lastUpdated: new Date().toISOString(),
      ...(isPublish ? {
        publishedHash,
        lastPublishedAt: new Date().toISOString()
      } : {})
    };

    fs.writeFileSync(OVERRIDE_FILE_PATH, JSON.stringify(updatedJson, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: isPublish ? '¡Cambios publicados en vivo con certificación SHA-256!' : 'Borrador guardado correctamente.',
      publishedHash: updatedJson.publishedHash,
      lastPublishedAt: updatedJson.lastPublishedAt
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar los cambios en la base de datos' }, { status: 500 });
  }
}
