import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/security/adminGuard';
import { compileIntentToDAG } from '@/lib/compiler/omega-intent-compiler';
import type { CompileEngine, CompileMode } from '@/lib/compiler/omega-intent-compiler';
import { refineQueryWithOracle, type OraclePersona } from '@/lib/oracle/quantum-oracle-engine';
import { forgeMasterPrompt, type ForgeMode, type ForgedMasterPrompt } from '@/lib/compiler/prompt-maestro-forge';

type CompileIntentBody = {
  intent: string;
  mode?: CompileMode | 'SURGICAL' | 'FULL_STACK' | 'ARCHIVAL_SWEEP';
  engine?: CompileEngine | 'LOCAL_OLLAMA' | 'CLOUD_EDGE';
  prompt?: string;
  oraclePersona?: OraclePersona;
  /** Modelo GPU seleccionado (32B architect / 27B 3.8 fast / 27B flow / 14B speed). */
  model?: string;
  /** Forja del Prompt Maestro (por defecto activada). */
  forge?: boolean;
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

function resolveForgeMode(mode: CompileMode | 'SURGICAL' | 'ARCHIVAL_SWEEP'): ForgeMode {
  return mode === 'QUIRURGICO' ? 'QUIRURGICO' : 'ARQUITECTO';
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

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

    const mode = resolveMode(body.mode);
    const engine = resolveEngine(body.engine);
    const options = {
      mode,
      engine,
      // El 32B se usa para razonamiento profundo; el resto se propaga tal cual.
      model: typeof body.model === 'string' && body.model.trim() ? body.model : undefined
    };

    const startedAt = performance.now();

    // 1. Forjar el PROMPT MAESTRO (nivel Claude Opus High) sobre la intención cruda.
    //    La GPU local lo eleva; si falla, un compilador determinístico lo garantiza.
    let masterPrompt: ForgedMasterPrompt | null = null;
    const forgeEnabled = body.forge !== false;
    if (forgeEnabled) {
      try {
        masterPrompt = await forgeMasterPrompt({
          intent: rawIntent,
          mode: resolveForgeMode(mode),
          model: options.model
        });
      } catch {
        masterPrompt = null;
      }
    }

    // 2. Compilar a DAG usando el Prompt Maestro si existe (máxima calidad) o el Oráculo.
    //    Si la forja ya produjo el prompt maestro con la GPU, NO se vuelve a consultar
    //    a Ollama (una única pasada de inferencia = máxima velocidad, sin doble cold-start).
    //    El prompt maestro forjado se inyecta como macro-script maestro del DAG, para que
    //    la tarea inyectada en tasks_queue.json arrastre la instrucción S-Class completa.
    const dagSource = masterPrompt?.masterPrompt || oracleResult.refinedPrompt;
    const compiled = await compileIntentToDAG(dagSource, {
      ...options,
      skipOllamaArchitect: masterPrompt !== null,
      masterPromptOverride: masterPrompt?.masterPrompt ?? undefined
    });
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;

    return NextResponse.json({
      success: true,
      latencyMs,
      modo: options.mode,
      motor: options.engine,
      protocolo: compiled.protocol,
      oracle: oracleResult,
      forge: masterPrompt,
      masterPrompt: masterPrompt?.masterPrompt ?? null,
      forgeEngine: masterPrompt?.forgeEngine ?? 'DISABLED',
      reasoningEngineUsed: compiled.extractedEntities.reasoningEngineUsed ?? null,
      compiled
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
