import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function clearAuthCookies(response: NextResponse): void {
  const cookieOpts = { path: '/', maxAge: 0, expires: new Date(0) };
  for (const name of [
    '__session',
    'ear_session',
    'ear_admin_token',
    'ear_role',
    'ear_user_email',
    'ear_user_name',
    'ear_otp_challenge',
  ]) {
    response.cookies.set(name, '', cookieOpts);
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada y purgada.' });
  clearAuthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  const fwdProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const fwdHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const hostHeader = fwdHost || request.headers.get('host')?.trim() || request.nextUrl.host;
  const proto =
    fwdProto ||
    (hostHeader.startsWith('localhost') || hostHeader.startsWith('127.0.0.1')
      ? 'http'
      : request.nextUrl.protocol.replace(':', '') || 'https');
  const safeHost = hostHeader.replace(/^0\.0\.0\.0(?=[:/]|$)/, 'localhost');
  const origin = `${proto}://${safeHost}`;

  const response = NextResponse.redirect(new URL('/login/respaldo', origin));
  clearAuthCookies(response);
  return response;
}
