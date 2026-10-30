import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

/**
 * Sonda de vida Y de procedencia. `buildSha` es el commit que se compiló dentro
 * de la imagen (Docker ARG EAR_BUILD_SHA). Sin este sello el CI no podía
 * distinguir "producción viva" de "producción sirviendo una imagen vieja":
 * un despliegue que nunca se ejecuta seguía pareciendo verde.
 *
 * CORRECCIÓN FORENSE (2026-10-30, medida contra producción): hay DOS
 * constructores posibles de la imagen viva y sólo uno recibe build-args.
 *   · CI → GHCR: `EAR_BUILD_SHA` viaja como `--build-arg` (Dockerfile ARG → ENV).
 *   · Coolify desde Git: compila con su propio Dockerfile y NO pasa build-args,
 *     así que el ARG cae a su valor por defecto `unknown`. Coolify sí declara el
 *     commit desplegado en la variable predefinida `SOURCE_COMMIT`.
 * Con sólo `EAR_BUILD_SHA`, producción servía el fix de voz (buildId nuevo) y aun
 * así publicaba `buildSha=unknown`, lo que se diagnosticó como "deploy no
 * ejecutado". Se publica `buildSource` para que el auditor distinga "no hay
 * sello" de "hay sello sin valor" en vez de adivinar.
 */
function seal(raw: string | undefined): string {
  const value = typeof raw === 'string' ? raw.trim() : '';
  return value.length > 0 && value !== 'unknown' ? value : '';
}

export async function GET() {
  const ciSha = seal(process.env.EAR_BUILD_SHA);
  const platformSha = seal(process.env.SOURCE_COMMIT);
  const buildSha = ciSha || platformSha || 'unknown';
  const buildSource = ciSha ? 'ci-build-arg' : platformSha ? 'coolify-source-commit' : 'none';

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    buildSha,
    buildTime: process.env.EAR_BUILD_TIME ?? 'unknown',
    buildSource,
  });
}
