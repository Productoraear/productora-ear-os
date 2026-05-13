import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Simulación de protección de rutas admin
  // En Next.js 16 con Firebase, la verificación ideal es via cookies o tokens de sesión.
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const session = request.cookies.get("session");
    // Si no hay sesión y no estamos en login, redirigir
    // Nota: El manejo de sesiones por cookies requiere Firebase Admin SDK (Fase 2)
    // Por ahora, activamos la redirección lógica de cliente en las páginas
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/omega/:path*"],
};
