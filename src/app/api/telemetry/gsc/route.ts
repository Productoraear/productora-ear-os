import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const jsonPath = path.join(process.cwd(), 'src', 'data', 'telemetry', 'gsc-performance-data.json');
    
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({
        success: false,
        error: 'No se ha encontrado el dataset de GSC. Ejecuta "npm run gsc:ingest".'
      }, { status: 404 });
    }

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const dataset = JSON.parse(rawData);

    return NextResponse.json({
      success: true,
      data: dataset
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [GSC TELEMETRY API ERROR]:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Error interno al leer telemetría de GSC' 
    }, { status: 500 });
  }
}
