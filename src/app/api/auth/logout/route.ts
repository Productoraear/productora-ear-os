import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Sesión cerrada y purgada.' });
  const cookieOpts = { path: '/', maxAge: 0, expires: new Date(0) };
  response.cookies.set('ear_session', '', cookieOpts);
  response.cookies.set('ear_admin_token', '', cookieOpts);
  response.cookies.set('ear_role', '', cookieOpts);
  return response;
}