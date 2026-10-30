import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/**
 * Sonda de vida Y de procedencia. `buildSha` es el commit que se compiló dentro
 * de la imagen (Docker ARG EAR_BUILD_SHA). Sin este sello el CI no podía
 * distinguir "producción viva" de "producción sirviendo una imagen vieja":
 * un despliegue que nunca se ejecuta seguía pareciendo verde.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    buildSha: process.env.EAR_BUILD_SHA ?? 'unknown',
    buildTime: process.env.EAR_BUILD_TIME ?? 'unknown',
  });
}
