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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
