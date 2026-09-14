import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('ear_session', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
  response.cookies.set('ear_admin_token', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
  response.cookies.set('ear_role', '', { maxAge: 0, httpOnly: true, sameSite: 'strict' });
  return response;
}