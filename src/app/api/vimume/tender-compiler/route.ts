import { NextRequest, NextResponse } from 'next/server';
import { generateVimumeTender, B2GTenderInput } from '@/lib/vimume/b2g-tender-engine';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as B2GTenderInput;

    if (!body || !body.entityName) {
      return NextResponse.json(
        { error: 'Falta la entidad municipal proponente (entityName)' },
        { status: 400 }
      );
    }

    const dossier = generateVimumeTender(body);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dossier
    });
  } catch (error) {
    console.error('Error en API Vimume Tender Compiler:', error);
    return NextResponse.json(
      { 
        error: 'Error interno al compilar el expediente B2G',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
