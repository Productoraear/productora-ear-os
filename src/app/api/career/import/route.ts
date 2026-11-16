import { NextRequest, NextResponse } from 'next/server';
import { parseCareerCsv } from '@/lib/career/importers/csv-importer';
import { getPlatform } from '@/lib/career/platform-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CSV_BYTES = 10 * 1024 * 1024; // 10MB

interface JsonImportBody {
  readonly content?: string;
  readonly platformId?: string;
  readonly artistId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let platformId = '';
    let csvContent = '';
    let artistId = 'e78903';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      platformId = String(formData.get('platformId') || '').trim();
      artistId = String(formData.get('artistId') || 'e78903').trim();

      if (!(file instanceof File)) {
        return NextResponse.json(
          { ok: false, error: 'Debe adjuntar un archivo CSV válido en el campo "file"' },
          { status: 400 },
        );
      }

      if (file.size > MAX_CSV_BYTES) {
        return NextResponse.json(
          { ok: false, error: 'El archivo excede el límite máximo de 10MB' },
          { status: 413 },
        );
      }

      csvContent = await file.text();
    } else {
      const body = (await req.json()) as JsonImportBody;
      platformId = String(body.platformId || '').trim();
      csvContent = String(body.content || '');
      artistId = String(body.artistId || 'e78903').trim();

      if (Buffer.byteLength(csvContent, 'utf8') > MAX_CSV_BYTES) {
        return NextResponse.json(
          { ok: false, error: 'El contenido CSV excede el límite máximo de 10MB' },
          { status: 413 },
        );
      }
    }

    if (!platformId) {
      return NextResponse.json(
        { ok: false, error: 'Debe especificar el platformId registrado' },
        { status: 400 },
      );
    }

    const platform = getPlatform(platformId);
    if (!platform) {
      return NextResponse.json(
        { ok: false, error: `Plataforma "${platformId}" no válida o no registrada en el SSOT` },
        { status: 400 },
      );
    }

    if (!csvContent.trim()) {
      return NextResponse.json(
        { ok: false, error: 'El contenido del CSV no puede estar vacío' },
        { status: 400 },
      );
    }

    const result = parseCareerCsv(csvContent, platformId, artistId);

    return NextResponse.json({
      ok: true,
      data: result,
      summary: {
        platform: platform.label,
        acceptedPoints: result.acceptedPoints.length,
        rejectedRows: result.rejectedRows.length,
        duplicatesSkipped: result.duplicatesSkipped,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error interno al procesar el archivo CSV';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
