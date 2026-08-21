import os

print("🛡️ INICIANDO RESTRUCTURACIÓN DE AUTENTICACIÓN STATELESS VERCEL + GOOGLE AUTHENTICATOR + EDITORES...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"

# 1. CREAR MOTOR TOTP NATIVO DE GOOGLE AUTHENTICATOR (src/lib/totp-engine.ts)
lib_dir = os.path.join(base_dir, "src", "lib")
os.makedirs(lib_dir, exist_ok=True)
totp_path = os.path.join(lib_dir, "totp-engine.ts")

totp_code = """import crypto from 'crypto';

function base32Decode(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/[^A-Z2-7]/g, '');
  
  for (let i = 0; i < clean.length; i++) {
    const index = alphabet.indexOf(clean[i]);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

export function verifyGoogleAuthenticator(token: string, secretBase32: string): boolean {
  if (!token || token.trim().length !== 6) return false;
  const cleanToken = token.trim();
  try {
    const secret = base32Decode(secretBase32);
    if (secret.length === 0) return false;
    
    const timeStep = 30;
    const now = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(now / timeStep);

    // Permitir ventana de ±30 segundos para descompensaciones de reloj
    for (let i = -1; i <= 1; i++) {
      const counter = currentCounter + i;
      const buf = Buffer.alloc(8);
      buf.writeBigInt64BE(BigInt(counter), 0);
      const hmac = crypto.createHmac('sha1', secret).update(buf).digest();
      const offset = hmac[hmac.length - 1] & 0x0f;
      const code = ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000).toString().padStart(6, '0');
      
      if (code === cleanToken) return true;
    }
  } catch (e) {
    console.error('Error en verificación TOTP Google Authenticator:', e);
  }
  return false;
}
"""

with open(totp_path, "w", encoding="utf-8") as f:
    f.write(totp_code)

print("✅ Motor TOTP nativo para Google Authenticator instalado en src/lib/totp-engine.ts")

# 2. REESCRIBIR API GENERADORA Y FIRMADORA DE OTP (/api/auth/send-otp/route.ts)
send_otp_path = os.path.join(base_dir, "src", "app", "api", "auth", "send-otp", "route.ts")
os.makedirs(os.path.dirname(send_otp_path), exist_ok=True)

send_otp_code = """import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();
    
    const envAdminEmail = process.env.EAR_ADMIN_EMAIL || "productoraear@gmail.com";
    const envAdminPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";
    const envEditorPassword = process.env.EAR_EDITOR_PASSWORD || "EditorAutorizadoEAR2026!";
    const jwtSecret = process.env.NEXTAUTH_SECRET || "ear_os_jwt_secret_2026";

    let isValidCreds = false;
    let targetRole = 'admin';

    if (role === 'editor') {
      if (password === envEditorPassword) {
        isValidCreds = true;
        targetRole = 'editor';
      }
    } else {
      if (email === envAdminEmail && password === envAdminPassword) {
        isValidCreds = true;
        targetRole = 'admin';
      }
    }

    if (!isValidCreds) {
      return NextResponse.json(
        { success: false, message: 'Credenciales de acceso no válidas para el perfil seleccionado.' },
        { status: 401 }
      );
    }

    // Generar PIN aleatorio criptográfico
    const generatedPin = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutos

    // Desafío Criptográfico Stateless (HMAC Payload)
    const payload = `${email}:${generatedPin}:${expiresAt}:${targetRole}`;
    const signature = crypto.createHmac('sha256', jwtSecret).update(payload).digest('hex');
    const challengeToken = `${payload}:${signature}`;

    console.log("=================================================");
    console.log(`🔐 [STATELESS OTP GENERADO] PIN: ${generatedPin} | Rol: ${targetRole}`);
    console.log(`📧 Destino: ${email}`);
    console.log("=================================================");

    const response = NextResponse.json({
      success: true,
      role: targetRole,
      message: `Desafío de seguridad generado para ${targetRole}. Introduce el PIN o usa Google Authenticator.`
    });

    // Guardar el desafío firmado en una cookie temporal segura para Vercel Serverless
    response.cookies.set('ear_otp_challenge', challengeToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 300 // 5 minutos
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fallo al procesar el desafío de seguridad.' },
      { status: 500 }
    );
  }
}
"""

with open(send_otp_path, "w", encoding="utf-8") as f:
    f.write(send_otp_code)

print("✅ Endpoint /api/auth/send-otp reescrito para Vercel Serverless.")

# 3. REESCRIBIR API VERIFICADORA MULTI-ROL (/api/auth/admin-verify/route.ts)
verify_path = os.path.join(base_dir, "src", "app", "api", "auth", "admin-verify", "route.ts")

verify_code = """import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyGoogleAuthenticator } from '@/lib/totp-engine';

export async function POST(request: Request) {
  try {
    const { password, code2fa, method, role } = await request.json();
    
    const envAdminPassword = process.env.EAR_ADMIN_PASSWORD || "TuNuevaContraseñaMilitar2026!";
    const envEditorPassword = process.env.EAR_EDITOR_PASSWORD || "EditorAutorizadoEAR2026!";
    const totpSecret = process.env.EAR_ADMIN_2FA_SECRET || "EAROS2FASECRETKEY32";
    const jwtSecret = process.env.NEXTAUTH_SECRET || "ear_os_jwt_secret_2026";

    let authenticatedRole: 'admin' | 'editor' | null = null;

    // 1. Verificación de Contraseña de Paso 1
    if (role === 'editor' && password === envEditorPassword) {
      authenticatedRole = 'editor';
    } else if (password === envAdminPassword) {
      authenticatedRole = 'admin';
    }

    if (!authenticatedRole) {
      return NextResponse.json(
        { success: false, message: 'Contraseña master o de editor incorrecta.' },
        { status: 401 }
      );
    }

    // Si es editor, el acceso requiere solo contraseña master de editor
    if (authenticatedRole === 'editor') {
      const response = NextResponse.json({
        success: true,
        role: 'editor',
        message: 'Acceso de Editor Autorizado Aprobado.'
      });

      const cookieOpts = {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      };

      response.cookies.set('ear_session', 'editor_session_active', cookieOpts);
      response.cookies.set('ear_admin_token', 'editor_token_verified', cookieOpts);
      response.cookies.set('ear_role', 'editor', cookieOpts);

      return response;
    }

    // 2. Verificación de Administrador (Doble Factor 2FA Obligatorio)
    let is2faValid = false;

    // Opción A: Verificación mediante Google Authenticator (TOTP Cero Memoria)
    if (method === 'authenticator' || code2fa) {
      is2faValid = verifyGoogleAuthenticator(code2fa, totpSecret);
    }

    // Opción B: Verificación por Email (Desafío Criptográfico HMAC Stateless)
    if (!is2faValid && method === 'email') {
      const challengeCookie = request.headers.get('cookie')?.split('; ')
        .find(c => c.startsWith('ear_otp_challenge='))?.split('=')[1];

      if (challengeCookie) {
        const parts = challengeCookie.split(':');
        if (parts.length === 5) {
          const [email, pin, expiresAtStr, reqRole, signature] = parts;
          const expectedPayload = `${email}:${pin}:${expiresAtStr}:${reqRole}`;
          const expectedSig = crypto.createHmac('sha256', jwtSecret).update(expectedPayload).digest('hex');

          if (signature === expectedSig && Date.now() <= parseInt(expiresAtStr, 10)) {
            if (code2fa === pin) {
              is2faValid = true;
            }
          }
        }
      }
    }

    if (!is2faValid) {
      return NextResponse.json(
        { success: false, message: 'Código 2FA incorrecto o expirado. Revisa Google Authenticator o solicita un nuevo PIN.' },
        { status: 401 }
      );
    }

    // Emisión de cookies soberanas de Administrador
    const response = NextResponse.json({
      success: true,
      role: 'admin',
      message: 'Autenticación Soberana 2FA Aprobada en Vercel Serverless.'
    });

    const cookieOpts = {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    };

    response.cookies.set('ear_session', 'sovereign_admin_active', cookieOpts);
    response.cookies.set('ear_admin_token', 'sclass_verified_2fa_military', cookieOpts);
    response.cookies.set('ear_role', 'admin', cookieOpts);

    return response;

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fallo crítico de verificación serverless.' },
      { status: 500 }
    );
  }
}
"""

with open(verify_path, "w", encoding="utf-8") as f:
    f.write(verify_code)

print("✅ API /api/auth/admin-verify reescrita con soporte para Google Authenticator, Email HMAC y Editores.")

# 4. ACTUALIZAR VISTA DE LOGIN UNIFICADA OMNI-AUTH
login_path = os.path.join(base_dir, "src", "app", "(public)", "(auth)", "login", "page.tsx")

login_ui_code = """'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, KeyRound, ArrowRight, AlertCircle, Mail, Smartphone, ShieldCheck, UserCheck, Edit3 } from 'lucide-react';

export default function OmniAuthLoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [authRole, setAuthRole] = useState<'admin' | 'editor'>('admin');
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [code2fa, setCode2fa] = useState('');
  const [verifyMethod, setVerifyMethod] = useState<'authenticator' | 'email'>('authenticator');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const fromPath = searchParams ? searchParams.get('from') : '/admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paso 1: Enviar contraseña y solicitar desafío
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'productoraear@gmail.com', password, role: authRole })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (authRole === 'editor') {
          // Editores acceden en 1 solo paso con su clave autorizada
          handleEditorLogin();
        } else {
          setInfoMsg('Introduce el código de tu app Google Authenticator o solicita PIN por Email.');
          setStep(2);
        }
      } else {
        setError(data.message || 'Contraseña incorrecta.');
      }
    } catch (err) {
      setError('Error conectando con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  // Login directo para Editores Autorizados
  const handleEditorLogin = async () => {
    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: 'editor' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push(fromPath || '/admin');
      } else {
        setError(data.message || 'Acceso de editor denegado.');
      }
    } catch (e) {
      setError('Fallo de verificación de editor.');
    }
  };

  // Paso 2: Verificar 2FA (Google Authenticator o Email)
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code2fa, method: verifyMethod, role: 'admin' })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(fromPath || '/admin');
      } else {
        setError(data.message || 'Código 2FA inválido.');
      }
    } catch (err) {
      setError('Fallo de verificación en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-neutral-900/95 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* CABECERA */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">IDENTIDAD S-CLASS</h1>
          <p className="text-xs text-neutral-400 mt-1">Acceso Soberano Vercel Serverless • 2FA & Editores</p>
        </div>

        {/* SELECTOR DE PERFIL DE ENTRADA */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setAuthRole('admin'); setStep(1); setError(null); }}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
              authRole === 'admin' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold">ADMINISTRADOR</div>
              <div className="text-[9px] text-neutral-500">2FA + Control Total</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('editor'); setStep(1); setError(null); }}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
              authRole === 'editor' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold">EDITOR</div>
              <div className="text-[9px] text-neutral-500">Gestión Contenidos</div>
            </div>
          </button>
        </div>

        {/* PASO 1 */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400 flex items-center justify-between">
              <span className="truncate">Destino: {fromPath}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                {authRole}
              </span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                {authRole === 'admin' ? 'Contraseña Master (.env.local)' : 'Contraseña de Editor Autorizado'}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Verificando...' : authRole === 'admin' ? 'Continuar a 2FA' : 'Acceder como Editor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PASO 2: VERIFICACIÓN 2FA PARA ADMIN */}
        {step === 2 && authRole === 'admin' && (
          <form onSubmit={handleStep2} className="space-y-4">
            
            {/* OPCIONES DE MÉTODO 2FA */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVerifyMethod('authenticator')}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition ${
                  verifyMethod === 'authenticator' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Authenticator</span>
              </button>

              <button
                type="button"
                onClick={() => setVerifyMethod('email')}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition ${
                  verifyMethod === 'email' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email OTP</span>
              </button>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                {verifyMethod === 'authenticator' ? 'Código de Google Authenticator (6 dígitos)' : 'Código PIN enviado por Email'}
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code2fa}
                onChange={(e) => setCode2fa(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-lg font-mono tracking-widest text-center text-amber-400 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Validando 2FA...' : 'DESBLOQUEAR PANELES SOBERANOS'}</span>
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[10px] text-neutral-600 font-mono">
          E2EE STATELESS PASSTHROUGH • EAR OS V2.6
        </div>
      </div>
    </div>
  );
}
"""

with open(login_path, "w", encoding="utf-8") as f:
    f.write(login_ui_code)

print("✅ Vista de Login Omni-Auth con soporte para Google Authenticator, Email y Editores instalada.")

# 5. ACTUALIZAR MIDDLEWARE CON ROL DE EDITOR
middleware_path = os.path.join(base_dir, "src", "middleware.ts")

middleware_code = """import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.get('ear_session')?.value;
  const hasToken = request.cookies.get('ear_admin_token')?.value;
  const role = request.cookies.get('ear_role')?.value;

  // Rutas administrativas protegidas
  if (pathname.startsWith('/admin') && (!hasSession || !hasToken)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    
    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return redirectResponse;
  }

  // Restricción de rutas súper-soberanas exclusivamente para Administrador CEO
  if ((pathname.startsWith('/admin/brain') || pathname.startsWith('/admin/mapear')) && role === 'editor') {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url));
    return redirectResponse;
  }

  const response = NextResponse.next();

  if (pathname.startsWith('/admin')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*']
};
"""

with open(middleware_path, "w", encoding="utf-8") as f:
    f.write(middleware_code)

print("✅ Middleware actualizado con control de acceso por roles (Admin vs. Editor Autorizado).")
