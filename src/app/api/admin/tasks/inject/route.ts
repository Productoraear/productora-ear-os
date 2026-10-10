import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 📥 INYECCIÓN REAL A .antigravity/tasks_queue.json
 * ----------------------------------------------------------------------------
 * Antes esta ruta era una FACHADA VACÍA: devolvía 201 pero NO escribía nada en
 * disco, por lo que `node .antigravity/omega.js next` nunca veía las tareas del
 * compilador. Ahora persiste la tarea con el formato canónico que consume el
 * Omega Engine (id, title, status, files, action, scaffold, done_when).
 *
 * W02-API-016 · SECURITY HARDENING
 * - Validación estricta con Zod (schemas estrictos, sin `any`).
 * - Sanitización de strings y arrays (longitud, control chars, path traversal).
 * - try/catch global + headers de seguridad en todas las respuestas.
 * - Respuestas tipadas (discriminated unions) para GET y POST.
 * ----------------------------------------------------------------------------
 */

// ─────────────────────────────────────────────────────────────────────────────
// Tipos canónicos
// ─────────────────────────────────────────────────────────────────────────────

type OmegaTaskStatus = 'QUEUED' | 'BACKLOG' | 'COMPLETED' | 'FAILED';

interface OmegaTask {
  id: string;
  title: string;
  status: OmegaTaskStatus;
  files: string[];
  action: string;
  scaffold: string;
  done_when: string;
  validation: string;
}

interface OmegaQueue {
  _meta?: Record<string, unknown>;
  _instructions_for_cline?: string;
  tasks: OmegaTask[];
}

interface QueueSummary {
  queued: number;
  backlog: number;
  completed: number;
  failed: number;
}

type GetSuccessResponse = {
  ok: true;
  endpoint: '/api/admin/tasks/inject';
  method: 'POST';
  queuePath: string;
  summary: QueueSummary;
  tasks: OmegaTask[];
};

type PostSuccessResponse = {
  ok: true;
  persisted: true;
  queuePath: string;
  task: OmegaTask;
  total: number;
};

type ErrorResponse = {
  ok: false;
  error: string;
  details?: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Constantes de hardening
// ─────────────────────────────────────────────────────────────────────────────

const MAX_TITLE_LEN = 240;
const MAX_ACTION_LEN = 2000;
const MAX_SCAFFOLD_LEN = 8000;
const MAX_VALIDATION_LEN = 500;
const MAX_DONE_WHEN_LEN = 500;
const MAX_FILES = 64;
const MAX_FILE_PATH_LEN = 512;
const MAX_BODY_BYTES = 256 * 1024; // 256 KB

const ALLOWED_STATUSES: readonly OmegaTaskStatus[] = [
  'QUEUED',
  'BACKLOG',
  'COMPLETED',
  'FAILED'
] as const;

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de respuesta
// ─────────────────────────────────────────────────────────────────────────────

function jsonResponse<T extends object>(payload: T, status: number): NextResponse {
  return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

function errorResponse(error: string, status: number, details?: string[]): NextResponse {
  const body: ErrorResponse = details && details.length > 0 ? { ok: false, error, details } : { ok: false, error };
  return jsonResponse(body, status);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanitización
// ─────────────────────────────────────────────────────────────────────────────

/** Elimina caracteres de control y normaliza espacios. */
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

function sanitizeText(value: string, maxLen: number): string {
  const cleaned = stripControlChars(value).replace(/\s+/g, ' ').trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

function sanitizeMultiline(value: string, maxLen: number): string {
  const cleaned = stripControlChars(value).replace(/\r\n/g, '\n').trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) : cleaned;
}

/** Bloquea path traversal y rutas absolutas en entradas de `files`. */
function sanitizeFilePath(value: string): string | null {
  const cleaned = stripControlChars(value).trim();
  if (cleaned.length === 0 || cleaned.length > MAX_FILE_PATH_LEN) return null;
  if (cleaned.includes('\0')) return null;
  if (cleaned.startsWith('/') || cleaned.startsWith('\\')) return null;
  if (/^[a-zA-Z]:[\\/]/.test(cleaned)) return null; // Windows absolute
  if (cleaned.split(/[\\/]/).some((seg) => seg === '..')) return null;
  return cleaned;
}

function sanitizeId(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return normalized.length > 0 ? normalized : 'omega-task';
}

// ─────────────────────────────────────────────────────────────────────────────
// Schemas Zod (estrictos, sin `any`)
// ─────────────────────────────────────────────────────────────────────────────

const statusSchema = z.enum(['QUEUED', 'BACKLOG', 'COMPLETED', 'FAILED']);

const taskShapeSchema = z
  .object({
    id: z.unknown().optional(),
    title: z.unknown().optional(),
    description: z.unknown().optional(),
    action: z.unknown().optional(),
    files: z.unknown().optional(),
    filesToTouch: z.unknown().optional(),
    scaffold: z.unknown().optional(),
    macroScript: z.unknown().optional(),
    doneWhen: z.unknown().optional(),
    done_when: z.unknown().optional(),
    validation: z.unknown().optional(),
    status: z.unknown().optional()
  })
  .passthrough();

const injectBodySchema = z
  .object({
    task: taskShapeSchema.optional()
  })
  .passthrough();

type TaskShape = z.infer<typeof taskShapeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Normalización
// ─────────────────────────────────────────────────────────────────────────────

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string') continue;
    const safe = sanitizeFilePath(item);
    if (safe) out.push(safe);
    if (out.length >= MAX_FILES) break;
  }
  return out;
}

function normalizeTask(input: TaskShape): OmegaTask | null {
  const nested: TaskShape =
    input.task && typeof input.task === 'object' ? (input.task as TaskShape) : input;

  const rawTitle = toTrimmedString(nested.title) ?? toTrimmedString(nested.description);
  if (!rawTitle) return null;
  const title = sanitizeText(rawTitle, MAX_TITLE_LEN);
  if (title.length === 0) return null;

  const rawFiles = nested.files ?? nested.filesToTouch;
  const files = toStringArray(rawFiles);

  const rawAction =
    toTrimmedString(nested.action) ?? toTrimmedString(nested.description) ?? title;
  const action = sanitizeMultiline(rawAction, MAX_ACTION_LEN);

  const rawScaffold =
    toTrimmedString(nested.scaffold) ??
    toTrimmedString(nested.macroScript) ??
    'Sigue el scaffold del compilador. Valida con npx tsc --noEmit.';
  const scaffold = sanitizeMultiline(rawScaffold, MAX_SCAFFOLD_LEN);

  const statusRaw = toTrimmedString(nested.status)?.toUpperCase();
  const statusParsed = statusSchema.safeParse(statusRaw);
  const status: OmegaTaskStatus = statusParsed.success ? statusParsed.data : 'QUEUED';

  const rawDoneWhen =
    toTrimmedString(nested.done_when) ??
    toTrimmedString(nested.doneWhen) ??
    'npx tsc --noEmit = Exit Code 0.';
  const done_when = sanitizeText(rawDoneWhen, MAX_DONE_WHEN_LEN);

  const rawValidation = toTrimmedString(nested.validation) ?? 'npx tsc --noEmit';
  const validation = sanitizeText(rawValidation, MAX_VALIDATION_LEN);

  const rawId = toTrimmedString(nested.id) ?? '';

  return {
    id: rawId,
    title,
    status,
    files,
    action,
    scaffold,
    done_when,
    validation
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistencia
// ─────────────────────────────────────────────────────────────────────────────

function resolveQueuePath(): string {
  const cwd = process.cwd();
  return path.join(cwd, '.antigravity', 'tasks_queue.json');
}

function isOmegaTask(value: unknown): value is OmegaTask {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.status === 'string' &&
    Array.isArray(t.files) &&
    typeof t.action === 'string' &&
    typeof t.scaffold === 'string' &&
    typeof t.done_when === 'string' &&
    typeof t.validation === 'string'
  );
}

async function readQueue(queuePath: string): Promise<OmegaQueue> {
  try {
    const raw = await fs.readFile(queuePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { _meta: { version: '7.1-MVP-RELEASE' }, tasks: [] };
    }
    const candidate = parsed as { tasks?: unknown; _meta?: unknown; _instructions_for_cline?: unknown };
    const tasks = Array.isArray(candidate.tasks) ? candidate.tasks.filter(isOmegaTask) : [];
    const queue: OmegaQueue = { tasks };
    if (candidate._meta && typeof candidate._meta === 'object') {
      queue._meta = candidate._meta as Record<string, unknown>;
    }
    if (typeof candidate._instructions_for_cline === 'string') {
      queue._instructions_for_cline = candidate._instructions_for_cline;
    }
    return queue;
  } catch {
    return {
      _meta: { version: '7.1-MVP-RELEASE' },
      tasks: []
    };
  }
}

async function writeQueue(queuePath: string, data: OmegaQueue): Promise<void> {
  await fs.mkdir(path.dirname(queuePath), { recursive: true });
  await fs.writeFile(queuePath, JSON.stringify(data, null, 2), 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const queuePath = resolveQueuePath();
    const queue = await readQueue(queuePath);

    const summary: QueueSummary = {
      queued: queue.tasks.filter((t) => t.status === 'QUEUED').length,
      backlog: queue.tasks.filter((t) => t.status === 'BACKLOG').length,
      completed: queue.tasks.filter((t) => t.status === 'COMPLETED').length,
      failed: queue.tasks.filter((t) => t.status === 'FAILED').length
    };

    const payload: GetSuccessResponse = {
      ok: true,
      endpoint: '/api/admin/tasks/inject',
      method: 'POST',
      queuePath,
      summary,
      tasks: queue.tasks
    };

    return jsonResponse(payload, 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor.';
    return errorResponse(message, 500);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    // Guard de tamaño antes de parsear.
    const contentLengthHeader = request.headers.get('content-length');
    if (contentLengthHeader) {
      const contentLength = Number.parseInt(contentLengthHeader, 10);
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        return errorResponse('Payload demasiado grande.', 413);
      }
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return errorResponse('El cuerpo debe ser JSON válido.', 400);
    }

    if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
      return errorResponse('El cuerpo debe ser un objeto JSON.', 400);
    }

    const parsed = injectBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`);
      return errorResponse('Payload inválido.', 400, details);
    }

    const task = normalizeTask(parsed.data as TaskShape);
    if (!task) {
      return errorResponse('title/description es requerido.', 400);
    }

    const queuePath = resolveQueuePath();
    const queue = await readQueue(queuePath);

    const baseId = sanitizeId(task.id || task.title);
    const suffix = Date.now().toString().slice(-4);
    let finalId = `${baseId}-${suffix}`;
    if (queue.tasks.some((t) => t.id === finalId)) {
      finalId = `${finalId}-${Math.random().toString(36).slice(2, 6)}`;
    }
    task.id = finalId;

    queue.tasks.push(task);
    await writeQueue(queuePath, queue);

    const payload: PostSuccessResponse = {
      ok: true,
      persisted: true,
      queuePath,
      task,
      total: queue.tasks.length
    };

    return jsonResponse(payload, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al escribir la cola.';
    return errorResponse(message, 500);
  }
}