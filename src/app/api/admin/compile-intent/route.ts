import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import { compileIntentToDAG } from '@/lib/compiler/omega-intent-compiler';
import type { CompileEngine, CompileMode } from '@/lib/compiler/omega-intent-compiler';
import { refineQueryWithOracle, type OraclePersona } from '@/lib/oracle/quantum-oracle-engine';
import { forgeMasterPrompt, type ForgeMode, type ForgedMasterPrompt } from '@/lib/compiler/prompt-maestro-forge';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_INTENT_LENGTH = 20_000;
const MAX_PROMPT_LENGTH = 20_000;
const MAX_MODEL_LENGTH = 128;

const ORACLE_PERSONAS = ['CEO', 'CTO', 'CFO', 'CMO', 'COO', 'LEGAL', 'ENGINEER'] as const;
const COMPILE_MODES = [
  'OMEGA_FULLSTACK',
  'QUIRURGICO',
  'ARCHIVAL_SWEEP',
  'SURGICAL',
  'FULL_STACK'
] as const;
const COMPILE_ENGINES = ['OLLAMA', 'CLOUD', 'LOCAL_OLLAMA', 'CLOUD_EDGE'] as const;

const CompileIntentSchema = z
  .object({
    intent: z.string().trim().min(1).max(MAX_INTENT_LENGTH).optional(),
    prompt: z.string().trim().min(1).max(MAX_PROMPT_LENGTH).optional(),
    mode: z.enum(COMPILE_MODES).optional(),
    engine: z.enum(COMPILE_ENGINES).optional(),
    oraclePersona: z.enum(ORACLE_PERSONAS).optional(),
    model: z.string().trim().min(1).max(MAX_MODEL_LENGTH).optional(),
    forge: z.boolean().optional()
  })
  .strict()
  .refine((data) => Boolean(data.intent || data.prompt), {
    message: 'Campo "intent" es requerido',
    path: ['intent']
  });

type CompileIntentBody = z.infer<typeof CompileIntentSchema>;

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function jsonResponse(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

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

function resolveOraclePersona(value: CompileIntentBody['oraclePersona']): OraclePersona {
  if (!value) return 'CEO';
  return value as OraclePersona;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return jsonResponse({ error: 'Content-Type debe ser application/json' }, 415);
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return jsonResponse({ error: 'JSON inválido' }, 400);
    }

    const parsed = CompileIntentSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse(
        {
          error: 'Payload inválido',
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message
          }))
        },
        400
      );
    }

    const body = parsed.data;
    const rawIntent = (body.intent ?? body.prompt ?? '').trim();
    if (!rawIntent) {
      return jsonResponse({ error: 'Campo "intent" es requerido' }, 400);
    }

    const persona: OraclePersona = resolveOraclePersona(body.oraclePersona);
    const oracleResult = refineQueryWithOracle(rawIntent, persona);

    const mode = resolveMode(body.mode);
    const engine = resolveEngine(body.engine);
    const options = {
      mode,
      engine,
      model: body.model && body.model.trim() ? body.model : undefined
    };

    const startedAt = performance.now();

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

    const dagSource = masterPrompt?.masterPrompt || oracleResult.refinedPrompt;
    const compiled = await compileIntentToDAG(dagSource, {
      ...options,
      skipOllamaArchitect: masterPrompt !== null,
      masterPromptOverride: masterPrompt?.masterPrompt ?? undefined
    });
    const latencyMs = Math.round((performance.now() - startedAt) * 100) / 100;

    return jsonResponse({
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
    return jsonResponse({ error: message }, 500);
  }
}

export async function GET(): Promise<NextResponse> {
  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}