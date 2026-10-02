import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const TENDERS_PATH = path.join(process.cwd(), 'src', 'data', 'b2g', 'placsp_harvested_tenders.json');

export async function GET() {
  try {
    if (fs.existsSync(TENDERS_PATH)) {
      const data = JSON.parse(fs.readFileSync(TENDERS_PATH, 'utf-8'));
      return NextResponse.json({
        success: true,
        total: data.length,
        tenders: data
      });
    }
    return NextResponse.json({ success: true, total: 0, tenders: [] });
  } catch (error: unknown) {
    console.error('PLACSP_BIDS_ERROR:', error);
    return NextResponse.json({ success: false, error: 'No se pudieron cargar las licitaciones.' }, { status: 500 });
  }
}
