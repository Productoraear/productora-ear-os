import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

type InjectTaskInput = {
  title?: unknown;
  description?: unknown;
  priority?: unknown;
  dueAt?: unknown;
  assigneeId?: unknown;
  tags?: unknown;
};

type InjectedTask = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueAt: string | null;
  assigneeId: string | null;
  tags: string[];
  createdAt: string;
  source: 'admin-inject';
};

const PRIORITIES: readonly TaskPriority[] = ['low', 'medium', 'high', 'critical'];

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toPriority(value: unknown): TaskPriority {
  if (typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value)) {
    return value as TaskPriority;
  }

  return 'medium';
}

function toTags(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function toIsoDate(value: unknown): string | null {
  const text = toTrimmedString(value);

  if (!text) {
    return null;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function createId(): string {
  return `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/admin/tasks/inject',
    method: 'POST',
    description: 'Inject an admin task into the EAR OS task queue.',
  });
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Request body must be valid JSON.',
      },
      { status: 400 },
    );
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Request body must be a JSON object.',
      },
      { status: 400 },
    );
  }

  const input = body as InjectTaskInput;
  const title = toTrimmedString(input.title);

  if (!title) {
    return NextResponse.json(
      {
        ok: false,
        error: 'title is required.',
      },
      { status: 400 },
    );
  }

  const task: InjectedTask = {
    id: createId(),
    title,
    description: toTrimmedString(input.description) ?? '',
    priority: toPriority(input.priority),
    dueAt: toIsoDate(input.dueAt),
    assigneeId: toTrimmedString(input.assigneeId),
    tags: toTags(input.tags),
    createdAt: new Date().toISOString(),
    source: 'admin-inject',
  };

  return NextResponse.json(
    {
      ok: true,
      task,
    },
    { status: 201 },
  );
}