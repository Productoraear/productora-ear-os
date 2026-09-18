import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    // Telemetría Soberana: Registra intención de lead desde clones espejo
    console.log('[EAR OS TELEMETRY] Lead Intent Intercepted:', {
      event: body.event,
      url: body.url,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ success: true, status: 'RECORDED_SSOT' });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
