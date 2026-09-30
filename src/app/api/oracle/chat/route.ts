import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Role = 'system' | 'user' | 'assistant';

type ChatMessage = {
  role: Role;
  content: string;
};

type ChatRequestBody = {
  messages?: unknown;
  model?: unknown;
};

function isRole(value: unknown): value is Role {
  return value === 'system' || value === 'user' || value === 'assistant';
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as {
    role?: unknown;
    content?: unknown;
  };

  return isRole(candidate.role) && typeof candidate.content === 'string';
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    route: '/api/oracle/chat',
  });
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: 'Invalid JSON body.',
      },
      { status: 400 },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      {
        error: 'Body must be an object.',
      },
      { status: 400 },
    );
  }

  const body = payload as ChatRequestBody;

  if (!Array.isArray(body.messages)) {
    return NextResponse.json(
      {
        error: 'messages must be an array.',
      },
      { status: 400 },
    );
  }

  const messages = body.messages as unknown[];

  if (messages.length === 0) {
    return NextResponse.json(
      {
        error: 'messages must not be empty.',
      },
      { status: 400 },
    );
  }

  const validatedMessages: ChatMessage[] = [];

  for (const message of messages) {
    if (!isChatMessage(message)) {
      return NextResponse.json(
        {
          error: 'Each message must include a valid role and string content.',
        },
        { status: 400 },
      );
    }

    validatedMessages.push(message);
  }

  const lastMessage = validatedMessages[validatedMessages.length - 1];

  if (!lastMessage) {
    return NextResponse.json(
      {
        error: 'messages must not be empty.',
      },
      { status: 400 },
    );
  }

  const reply: ChatMessage = {
    role: 'assistant',
    content: `Oracle: ${lastMessage.content}`,
  };

  return NextResponse.json({
    message: reply,
    messages: [...validatedMessages, reply],
  });
}