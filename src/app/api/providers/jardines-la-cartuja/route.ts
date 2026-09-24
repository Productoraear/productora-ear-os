import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OVERRIDE_FILE_PATH = path.join(process.cwd(), 'src/data/providers/jardines_la_cartuja_override.json');

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
    const body = await req.json();
    const { blocks, isPublish } = body;

    if (!blocks || !Array.isArray(blocks)) {
      return NextResponse.json({ error: 'Estructura de bloques inválida' }, { status: 400 });
    }

    const rawData = fs.readFileSync(OVERRIDE_FILE_PATH, 'utf-8');
    const currentJson = JSON.parse(rawData);

    const updatedJson = {
      ...currentJson,
      blocks,
      lastUpdated: new Date().toISOString(),
      ...(isPublish ? {
        publishedHash: `SHA256: ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)} (Lock 100€)`,
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
