import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MUTATIONS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'editor_mutations.json');

// Asegurar que el directorio y el archivo existen
function getMutationsData(): Record<string, any> {
  try {
    if (!fs.existsSync(MUTATIONS_FILE_PATH)) {
      const dir = path.dirname(MUTATIONS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(MUTATIONS_FILE_PATH, JSON.stringify({}, null, 2), 'utf-8');
      return {};
    }
    const raw = fs.readFileSync(MUTATIONS_FILE_PATH, 'utf-8');
    return JSON.parse(raw || '{}');
  } catch (err) {
    console.error('[Editor API] Error leyendo mutations data:', err);
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pathname, mutations, pageMeta } = body;

    if (!pathname || typeof pathname !== 'string') {
      return NextResponse.json({ error: 'pathname requerido' }, { status: 400 });
    }

    const allData = getMutationsData();
    allData[pathname] = {
      mutations: mutations || {},
      pageMeta: pageMeta || {},
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(MUTATIONS_FILE_PATH, JSON.stringify(allData, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      pathname,
      mutationsCount: Object.keys(mutations || {}).length,
      savedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[Editor API Save] Error:', error);
    return NextResponse.json({ error: error.message || 'Error guardando mutaciones' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pathname = searchParams.get('pathname');

    const allData = getMutationsData();

    if (pathname) {
      return NextResponse.json({
        pathname,
        data: allData[pathname] || { mutations: {}, pageMeta: {} }
      });
    }

    return NextResponse.json({
      totalRoutesWithMutations: Object.keys(allData).length,
      routes: Object.keys(allData)
    });
  } catch (error: any) {
    console.error('[Editor API Get] Error:', error);
    return NextResponse.json({ error: error.message || 'Error obteniendo mutaciones' }, { status: 500 });
  }
}
