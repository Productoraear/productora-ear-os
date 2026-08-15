import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Sesión finalizada con éxito' });
  
  // Limpieza total de cookies de autenticación de borde y sesión soberana
  response.cookies.set('ear_auth_signal', '', { path: '/', maxAge: 0 });
  response.cookies.set('ear_os_auth_token', '', { path: '/', maxAge: 0 });
  response.cookies.set('ear_os_role', '', { path: '/', maxAge: 0 });
  response.cookies.set('sb-access-token', '', { path: '/', maxAge: 0 });

  return response;
}
