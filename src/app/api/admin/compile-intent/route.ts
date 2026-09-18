import { NextRequest, NextResponse } from 'next/server';
import { compileIntentToDAG } from '@/lib/compiler/omega-intent-compiler';
import type { CompileEngine, CompileMode } from '@/lib/compiler/omega-intent-compiler';
import { refineQueryWithOracle, type OraclePersona } from '@/lib/oracle/quantum-oracle-engine';

type CompileIntentBody = {
  intent: string;
  mode?: CompileMode | 'SURGICAL' | 'FULL_STACK' | 'ARCHIVAL_SWEEP';
  engine?: CompileEngine | 'LOCAL_OLLAMA' | 'CLOUD_EDGE';
  prompt?: string;
  oraclePersona?: OraclePersona;
};

function resolveEngine(value: CompileIntentBody['engine']): CompileEngine {
  if (value === 'CLOUD' || value === 'CLOUD_EDGE') return 'CLOUD';
  return 'OLLAMA';
}

function resolveMode(value: CompileIntentBody['mode']): CompileMode | 'SURGICAL' | 'ARCHIVAL_SWEEP' {
  if (value === 'QUIRURGICO' || value === 'SURGICAL') return 'QUIRURGICO';
  if (value === 'FULL_STACK') return 'OMEGA_FULLSTACK';
  if (value === 'ARCHIVAL_SWEEP') return 'ARCHIVAL_SWEEP';
  return 'OMEGA_FULLSTACK';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompileIntentBody;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Cuerpo JSON requerido' }, { status: 400 });
    }

    const rawIntent = body.intent ?? body.prompt;
    if (!rawIntent || typeof rawIntent !== 'string' || !rawIntent.trim()) {
      return NextResponse.json({ error: 'Campo "intent" es requerido' }, { status: 400 });
    }

    const persona = body.oraclePersona || 'CEO';
    const oracleResult = refineQueryWithOracle(rawIntent, persona);

    const options = {
      mode: resolveMode(body.mode),
      engine: resolveEngine(body.engine)
    };

    const startedAt = performance.now();
    // Compilar usando la intención enriquecida por el Oráculo
    const compiled = await compileIntentToDAG(oracleResult.refinedPrompt, options);
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;

    return NextResponse.json({
      success: true,
      latencyMs,
      modo: options.mode,
      motor: options.engine,
      protocolo: compiled.protocol,
      oracle: oracleResult,
      compiled
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

