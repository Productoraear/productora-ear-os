import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
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
 * ----------------------------------------------------------------------------
 */

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

type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

type InjectTaskInput = {
  id?: unknown;
  title?: unknown;
  description?: unknown;
  action?: unknown;
  files?: unknown;
  filesToTouch?: unknown;
  scaffold?: unknown;
  macroScript?: unknown;
  doneWhen?: unknown;
  done_when?: unknown;
  validation?: unknown;
  status?: unknown;
  queue?: unknown;
  task?: unknown;
};

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function sanitizeId(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'omega-task'
  );
}

function resolveQueuePath(): string {
  const cwd = process.cwd();
  return path.join(cwd, '.antigravity', 'tasks_queue.json');
}

async function readQueue(queuePath: string): Promise<OmegaQueue> {
  try {
    const raw = await fs.readFile(queuePath, 'utf8');
    const parsed = JSON.parse(raw) as OmegaQueue;
    if (!Array.isArray(parsed.tasks)) {
      parsed.tasks = [];
    }
    return parsed;
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

/**
 * Normaliza cualquier carga entrante (del compilador o de una inyección directa)
 * a una tarea Omega canónica.
 */
function normalizeTask(input: InjectTaskInput): OmegaTask | null {
  // El compilador envía { task: {...} } con la forma jsonTask/compiled.jsonTask.
  const nested =
    input.task && typeof input.task === 'object' ? (input.task as InjectTaskInput) : input;

  const title = toTrimmedString(nested.title) ?? toTrimmedString(nested.description);
  if (!title) {
    return null;
  }

  const rawFiles = nested.files ?? nested.filesToTouch;
  const files = toStringArray(rawFiles);

  const action = toTrimmedString(nested.action) ?? toTrimmedString(nested.description) ?? title;

  const scaffold =
    toTrimmedString(nested.scaffold) ??
    toTrimmedString(nested.macroScript) ??
    'Sigue el scaffold del compilador. Valida con npx tsc --noEmit.';

  const statusRaw = toTrimmedString(nested.status)?.toUpperCase();
  const allowedStatuses: OmegaTaskStatus[] = ['QUEUED', 'BACKLOG', 'COMPLETED', 'FAILED'];
  const status: OmegaTaskStatus =
    statusRaw && (allowedStatuses as string[]).includes(statusRaw)
      ? (statusRaw as OmegaTaskStatus)
      : 'QUEUED';

  return {
    id: toTrimmedString(nested.id) ?? '',
    title,
    status,
    files,
    action,
    scaffold,
    done_when: toTrimmedString(nested.done_when) ?? toTrimmedString(nested.doneWhen) ?? 'npx tsc --noEmit = Exit Code 0.',
    validation: toTrimmedString(nested.validation) ?? 'npx tsc --noEmit'
  };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const queuePath = resolveQueuePath();
  const queue = await readQueue(queuePath);
  const summary = {
    queued: queue.tasks.filter((t) => t.status === 'QUEUED').length,
    backlog: queue.tasks.filter((t) => t.status === 'BACKLOG').length,
    completed: queue.tasks.filter((t) => t.status === 'COMPLETED').length,
    failed: queue.tasks.filter((t) => t.status === 'FAILED').length
  };
  return NextResponse.json({
    ok: true,
    endpoint: '/api/admin/tasks/inject',
    method: 'POST',
    queuePath,
    summary,
    tasks: queue.tasks
  });
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'El cuerpo debe ser JSON válido.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ ok: false, error: 'El cuerpo debe ser un objeto JSON.' }, { status: 400 });
  }

  const task = normalizeTask(body as InjectTaskInput);
  if (!task) {
    return NextResponse.json({ ok: false, error: 'title/description es requerido.' }, { status: 400 });
  }

  const queuePath = resolveQueuePath();

  try {
    const queue = await readQueue(queuePath);

    const finalId = sanitizeId(task.id || task.title) + '-' + Date.now().toString().slice(-4);
    const idExists = queue.tasks.some((t) => t.id === finalId);
    task.id = idExists ? `${finalId}-${Math.random().toString(36).slice(2, 6)}` : finalId;

    queue.tasks.push(task);
    await writeQueue(queuePath, queue);

    return NextResponse.json(
      {
        ok: true,
        persisted: true,
        queuePath,
        task,
        total: queue.tasks.length
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al escribir la cola.';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
