import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Sesión Soberana destruida y purgada con éxito.' 
  });

  // Expiración atómica de todas las cookies administrativas
  const expiredOpts = {
    httpOnly: false,
    path: '/',
    expires: new Date(0), // Expiración inmediata (1970)
    maxAge: 0
  };

  response.cookies.set('ear_session', '', expiredOpts);
  response.cookies.set('ear_admin_token', '', expiredOpts);
  response.cookies.set('ear_role', '', expiredOpts);

  // Inyección de cabeceras para forzar la purga del caché en el navegador
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}
