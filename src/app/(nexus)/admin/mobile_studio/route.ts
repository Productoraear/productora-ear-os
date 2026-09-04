import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/mobile-studio';
  return NextResponse.redirect(url, { status: 307 });
}
