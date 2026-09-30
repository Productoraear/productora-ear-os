import { NextResponse } from "next/server";

type InstitutionalLeadInput = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Institutional leads endpoint is available.",
  });
}

export async function POST(request: Request) {
  let payload: InstitutionalLeadInput = {};

  try {
    const body: unknown = await request.json();

    if (isRecord(body)) {
      payload = {
        name: toOptionalString(body.name),
        email: toOptionalString(body.email),
        phone: toOptionalString(body.phone),
        company: toOptionalString(body.company),
        message: toOptionalString(body.message),
      };
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!payload.name || !payload.email) {
    return NextResponse.json(
      { ok: false, message: "name and email are required." },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      message: "Institutional lead received.",
      data: payload,
    },
    { status: 201 }
  );
}