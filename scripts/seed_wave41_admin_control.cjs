#!/usr/bin/env node
/**
 * SEMBRADOR DE COLA — WAVE 41: ADMIN CONTROL DOMINANCE
 * ============================================================================
 * Inyecta en .antigravity/tasks_queue.json las tareas atómicas de reconstrucción
 * del panel /admin/control. Idempotente: no duplica IDs ya presentes.
 *
 * Uso: node scripts/seed_wave41_admin_control.cjs
 */
'use strict';

const fs = require('fs');
const path = require('path');

const QUEUE = path.join(__dirname, '..', '.antigravity', 'tasks_queue.json');

const TASKS = [
    {
        id: 'W41_T01_ADMIN_FETCH_CORE',
        title: 'Núcleo de red admin: adminFetch con Bearer Firebase y errores tipados',
        priority: 'P0',
        files: ['src/lib/admin/adminFetch.ts', 'src/lib/admin/adminTypes.ts'],
        action: 'Crear el cliente de red ÚNICO del panel. Hoy ningún componente envía Authorization; por eso /api/admin/* responde 401 y las pestañas muestran 0. Todo fetch de administración pasa por adminFetch: obtiene el ID token de Firebase (auth de src/lib/firebase) y lo inyecta como Bearer. Prohibido any y prohibido fetch directo en módulos admin.',
        scaffold: `adminTypes.ts:
export type AdminErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'VALIDATION' | 'SERVER' | 'CONFIG';
export type AdminApiError = { status: number; code: AdminErrorCode; message: string };
export type AdminApiResult<T> = { ok: true; data: T; total?: number } | { ok: false; error: AdminApiError };
export type AdminListResponse<T> = { rows: T[]; total: number };

adminFetch.ts (sin 'use client', cliente-agnóstico):
export class AdminHttpError extends Error { readonly status: number; readonly code: AdminErrorCode; constructor(e: AdminApiError) }
export async function getAdminIdToken(): Promise<string>
  - auth nulo -> throw AdminHttpError({ status:0, code:'CONFIG', message:'Firebase no configurado' })
  - auth.currentUser nulo -> throw AdminHttpError({ status:401, code:'UNAUTHORIZED', message:'Sesion no iniciada' })
  - return auth.currentUser.getIdToken()
export async function adminFetch<T>(path: string, init?: { method?: 'GET'|'POST'|'PATCH'|'PUT'|'DELETE'; body?: unknown; signal?: AbortSignal }): Promise<T>
  - headers: Authorization Bearer <token>; Content-Type application/json SOLO si body
  - fetch(path, { cache:'no-store', credentials:'same-origin', signal })
  - status -> code (401 UNAUTHORIZED, 403 FORBIDDEN, 404 NOT_FOUND, 409 CONFLICT, 400 VALIDATION, >=500 SERVER)
  - si el JSON no respeta { ok:true, data } -> throw SERVER
export async function adminFetchList<T>(path: string): Promise<AdminListResponse<T>>
  - const payload = await adminFetch<{ data: T[]; total?: number }>(path); return { rows: payload.data ?? [], total: payload.total ?? payload.data?.length ?? 0 }`,
        done_when: 'Los 2 ficheros exportan las firmas exactas; cero any implícito; cero fetch fuera de adminFetch; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T02_ADMIN_GUARD_RBAC_FIX',
        title: 'Blindar requireAdmin: lookup por firebaseUid y guard para Server Actions',
        priority: 'P0',
        files: ['src/lib/security/adminGuard.ts', 'src/lib/services/UserService.ts', 'src/app/actions/admin-providers.ts'],
        action: 'Corregir la cadena de autorización: (1) UserService.hasRole busca por id, pero el JWT trae el UID de Firebase, que vive en User.firebaseUid -> todo admin real cae en 403. Resolver por id OR firebaseUid. (2) admin-providers.ts llama requireAdmin(new Request("http://localhost")), un Request sin cabeceras: el alta de proveedores es un 401 permanente. Añadir requireAdminFromHeaders() que lea next/headers y sustituir la llamada.',
        scaffold: `UserService.hasRole(id: string, requiredRole: Role): Promise<boolean>
  const user = await prisma.user.findFirst({ where: { OR: [{ id }, { firebaseUid: id }] }, select: { role: true } });

adminGuard.ts — AÑADIR (sin tocar la firma de requireAdmin):
export async function requireAdminFromHeaders(): Promise<AdminAuthResult> {
  const h = await headers(); // import { headers } from 'next/headers'
  const bearer = h.get('authorization');
  return requireAdmin(new Request('https://productoraear.com', { headers: { authorization: bearer ?? '' } }));
}

admin-providers.ts — en create/update/delete:
  const auth = await requireAdminFromHeaders();
  if (!auth.ok) throw new Error('UNAUTHORIZED_ACCESS');
  catch (err: unknown) con narrowing: err instanceof Error ? err.message : 'Error al crear el proveedor'.
  Eliminar los tres 'err: any'.`,
        done_when: 'hasRole resuelve por firebaseUid; cero new Request("http://localhost") en src/; cero any en admin-providers.ts; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T03_ADMIN_SESSION_BRIDGE',
        title: 'Puente de sesión: cookies de middleware, /login real y bridge de token',
        priority: 'P0',
        files: [
            'src/app/api/admin/session/route.ts',
            'src/components/admin/AdminSessionBridge.tsx',
            'src/app/login/page.tsx',
            'src/app/(admin)/admin/layout.tsx',
        ],
        action: 'Cerrar el punto muerto de acceso: src/middleware.ts redirige /admin a /login cuando falta __session o ear_admin_token, pero /login NO EXISTE (404). Crear el login real, el endpoint de sesión que emite las cookies que el middleware valida, y un bridge que renueve el token al arrancar el shell.',
        scaffold: `api/admin/session/route.ts (runtime nodejs, dynamic force-dynamic). POST sin requireAdmin:
  const token = (request.headers.get('authorization') ?? '').replace('Bearer ', '').trim();
  POST: token vacío -> 401; await adminAuth.verifyIdToken(token) -> si lanza, 401;
        const ok = await UserService.hasRole(decoded.uid, Role.ADMIN); si !ok -> 403;
        respuesta 200 con cookies:
          __session=<token> HttpOnly, sameSite 'lax', secure process.env.NODE_ENV==='production', path '/', maxAge 3600
          ear_role=admin (NO HttpOnly), path '/', maxAge 3600
  DELETE: limpia __session y ear_role con maxAge 0 -> 200 { ok:true }
  GET: { ok:true, authenticated: Boolean(cookies().get('__session')?.value) }
  Cabeceras no-store en todas las respuestas.

components/admin/AdminSessionBridge.tsx ('use client'):
  export function AdminSessionBridge(): React.ReactElement | null
  useEffect -> onAuthStateChanged(auth, async (u) => {
    if (!u) { await fetch('/api/admin/session', { method:'DELETE' }); return; }
    const t = await u.getIdToken();
    await fetch('/api/admin/session', { method:'POST', headers:{ Authorization: 'Bearer ' + t } });
  })
  Se monta una sola vez y no pinta DOM.

app/login/page.tsx ('use client'): card rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md,
  botón Google con signInWithPopup(auth, new GoogleAuthProvider()) y useRouter().replace(searchParams.get('from') ?? '/admin/control').
  Prohibido w-screen y gradientes violeta/azul.

layout.tsx: importar AdminSessionBridge y montarlo justo antes de {children} (línea ~517).`,
        done_when: '/login renderiza y autentica; POST/DELETE emiten y limpian cookies; el bridge se monta una sola vez; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T04_API_ARTISTS_POST',
        title: 'Alta real de artistas: POST /api/admin/artists con transacción Prisma',
        priority: 'P0',
        files: ['src/app/api/admin/artists/route.ts'],
        action: 'El endpoint solo tiene GET y PATCH: es imposible dar de alta un artista. Añadir POST con Zod estricto, creación de User (si el email no existe) + artistProfile en una sola transacción ACID, slug único normalizado y 409 ante duplicados.',
        scaffold: `Añadir a src/app/api/admin/artists/route.ts:

const ARTIST_STATUSES = ['DRAFT', 'PUBLISHED', 'PAUSED'] as const;

const CreateBodySchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120).optional(),
  stageName: z.string().trim().min(2).max(120),
  displayName: z.string().trim().min(1).max(120).optional(),
  slug: z.string().trim().min(1).max(120).regex(SLUG_REGEX).optional(),
  genres: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  status: z.enum(ARTIST_STATUSES).default('PUBLISHED'),
}).strict();

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120) || 'artista';
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(req); if (!auth.ok) return auth.response;
  const raw = await req.json().catch(() => null);
  const parsed = CreateBodySchema.safeParse(raw);
  if (!parsed.success) return jsonResponse({ ok:false, error:'Payload inválido', issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }, { status: 400 });

  const body = parsed.data;
  const baseSlug = body.slug ?? slugify(body.stageName);

  try {
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: body.email },
        update: { name: body.name ?? undefined },
        create: { email: body.email, name: body.name ?? body.stageName, role: 'ARTIST' },
      });
      const existing = await tx.artistProfile.findUnique({ where: { userId: user.id } });
      if (existing) throw new Error('ARTIST_PROFILE_EXISTS');
      return tx.artistProfile.create({
        data: { userId: user.id, stageName: body.stageName, displayName: body.displayName ?? body.stageName, slug: baseSlug, genres: body.genres, status: body.status },
        include: { user: { select: { email: true, name: true } } },
      });
    });
    return jsonResponse({ ok: true, data: created }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === 'ARTIST_PROFILE_EXISTS') return jsonResponse({ ok:false, error:'El artista ya tiene perfil' }, { status: 409 });
    if (typeof err === 'object' && err !== null && 'code' in err && (err as { code?: string }).code === 'P2002') return jsonResponse({ ok:false, error:'slug o email duplicado' }, { status: 409 });
    console.error('[admin/artists][POST]', err);
    return jsonResponse({ ok:false, error:'Internal error' }, { status: 500 });
  }
}`,
        done_when: 'POST crea User+artistProfile en transacción, devuelve 201 y 409 ante duplicado; GET y PATCH intactos; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T05_API_THERAPISTS_POST',
        title: 'Alta real de terapeutas: POST /api/admin/therapists (pestaña mostraba HTTP 401)',
        priority: 'P0',
        files: ['src/app/api/admin/therapists/route.ts'],
        action: 'La pestaña Terapeutas del panel muestra 0 y HTTP 401 y solo existe GET/PATCH. Añadir POST que cree User + TherapistProfile en transacción, con especialidad validada y estado por defecto ACTIVE.',
        scaffold: `Añadir a src/app/api/admin/therapists/route.ts:

const SPECIALTIES = ['musicoterapia', 'neuroacustica', 'estimulacion_cognitiva', 'ocupacional'] as const;

const createBodySchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120).optional(),
  specialty: z.enum(SPECIALTIES),
  credentials: z.string().trim().max(4000).optional(),
  bio: z.string().trim().max(4000).optional(),
  status: statusSchema.default('ACTIVE'),
  isActive: z.boolean().default(true),
}).strict();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(request); if (!auth.ok) return auth.response;
  const rawBody = await request.json().catch(() => null);
  const parsed = createBodySchema.safeParse(rawBody);
  if (!parsed.success) return jsonResponse({ ok:false, error:'Datos de entrada no válidos' }, 400);
  const body = parsed.data;

  try {
    const created = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email: body.email },
        update: {},
        create: { email: body.email, name: body.name ?? body.email.split('@')[0], role: 'THERAPIST' },
      });
      const existing = await tx.therapistProfile.findUnique({ where: { userId: user.id } });
      if (existing) throw new Error('THERAPIST_EXISTS');
      return tx.therapistProfile.create({
        data: { userId: user.id, specialty: body.specialty, credentials: body.credentials, bio: body.bio, status: body.status, isActive: body.isActive },
        include: { user: { select: { email: true, name: true } } },
      });
    });
    return jsonResponse({ ok: true, data: created }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'THERAPIST_EXISTS') return jsonResponse({ ok:false, error:'El terapeuta ya existe' }, 409);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return jsonResponse({ ok:false, error:'Email duplicado' }, 409);
    console.error('[admin/therapists] POST error', error);
    return jsonResponse({ ok:false, error:'Error interno del servidor' }, 500);
  }
}`,
        done_when: 'POST crea User+TherapistProfile con 201 y 409 correctos; GET/PATCH intactos; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T06_API_PROVIDERS_POST',
        title: 'Alta real de proveedores: POST /api/admin/providers con doctrina verified',
        priority: 'P0',
        files: ['src/app/api/admin/providers/route.ts'],
        action: 'Solo existe GET/PATCH: el panel no puede dar de alta proveedores, y la server action de altas está muerta (401 fijo). Añadir POST con Zod sobre el enum VendorCategory, slug derivado del nombre y regla de oro: isVerified SOLO si hay teléfono real distinto de la centralita +34 693 693 048.',
        scaffold: `Añadir a src/app/api/admin/providers/route.ts:

const CENTRALITA = '+34693693048';

function normalizePhone(raw?: string): string | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/[^0-9+]/g, '');
  return cleaned.length >= 9 ? cleaned : undefined;
}

const CreateBodySchema = z.object({
  name: z.string().trim().min(2).max(160),
  companyName: z.string().trim().max(160).optional(),
  category: z.enum(VENDOR_CATEGORIES),
  city: z.string().trim().max(120).optional(),
  province: z.string().trim().min(2).max(120).default('Madrid / Toledo'),
  phone: z.string().trim().max(24).optional(),
  email: z.string().trim().email().max(180).optional(),
  description: z.string().trim().max(4000).optional(),
  claimStatus: z.enum(CLAIM_STATUSES).default('GHOST_UNCLAIMED'),
  status: StatusSchema.default('DRAFT'),
}).strict();

export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(request); if (!auth.ok) return auth.response;
  const parsed = CreateBodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ ok:false, error:'Payload inválido', issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }, { status: 400 });

  const body = parsed.data;
  const phone = normalizePhone(body.phone);
  const realPhone = phone !== undefined && phone !== CENTRALITA;
  const slug = body.name.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) return jsonResponse({ ok:false, error:'Nombre no genera slug válido' }, { status: 400 });

  try {
    const created = await prisma.providerProfile.create({
      data: {
        name: body.name, slug, companyName: body.companyName ?? '', category: body.category,
        city: body.city, province: body.province, phone,
        email: body.email, description: body.description,
        claimStatus: body.claimStatus, status: body.status,
        isVerified: realPhone && body.claimStatus === 'VERIFIED_ACTIVE',
      },
    });
    return jsonResponse({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return jsonResponse({ ok:false, error:'Nombre o slug ya registrado' }, { status: 409 });
    console.error('[admin/providers][POST]', error);
    return jsonResponse({ ok:false, error:'Internal error' }, { status: 500 });
  }
}`,
        done_when: 'POST crea providerProfile con slug único, isVerified false si el teléfono es la centralita o está vacío; 409 ante duplicado; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T07_API_FLEET_POST',
        title: 'Alta real de flota: POST /api/admin/fleet con unidad única',
        priority: 'P1',
        files: ['src/app/api/admin/fleet/route.ts'],
        action: 'La pestaña Flota solo puede leer y parchear. Añadir POST para dar de alta unidades (fleetUnit) con unitCode único, estado validado y ubicación; respuesta 201 y 409 ante duplicado.',
        scaffold: `Añadir a src/app/api/admin/fleet/route.ts (mantener el guard requireAdmin existente):

const FLEET_STATUSES = ['IDLE', 'EN_ROUTE', 'ON_SITE', 'MAINTENANCE'] as const;

const CreateBodySchema = z.object({
  unitCode: z.string().trim().min(2).max(40),
  code: z.string().trim().min(2).max(40).optional(),
  status: z.enum(FLEET_STATUSES).default('IDLE'),
  currentLocation: z.string().trim().max(160).optional(),
}).strict();

export async function POST(request: Request): Promise<Response> {
  const auth = await requireAdmin(request); if (!auth.ok) return auth.response;
  const parsed = CreateBodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok:false, error:'Payload inválido', issues: parsed.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) }, { status: 400 });

  try {
    const created = await prisma.fleetUnit.create({ data: parsed.data });
    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ ok:false, error:'unitCode o code ya registrado' }, { status: 409 });
    console.error('[admin/fleet][POST]', error);
    return NextResponse.json({ ok:false, error:'Internal error' }, { status: 500 });
  }
}`,
        done_when: 'POST crea fleetUnit, 201 y 409 correctos, GET/PATCH intactos; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T08_API_AFFILIATES_CRUD',
        title: 'Red de afiliados real: nueva API /api/admin/affiliates (GET/POST/PATCH)',
        priority: 'P0',
        files: ['src/app/api/admin/affiliates/route.ts'],
        action: 'La pestaña Afiliados del panel es un LinkCard vacío. Crear la API con listado real, alta con código de referido único y parcheo de tier/comisión/estado. La comisión por defecto nace del motor de afiliados (10% SSOT), nunca hardcodeada en la UI.',
        scaffold: `NUEVO src/app/api/admin/affiliates/route.ts (runtime nodejs, dynamic force-dynamic, cabeceras no-store):

import { NextRequest, NextResponse } from 'next/server';
import { Prisma, KycStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';
import { AFFILIATE_TIER_CONFIG, resolveTier } from '@/lib/affiliate/affiliateCommissionEngine';

const TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;

const CreateSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120).optional(),
  companyName: z.string().trim().max(160).optional(),
  cifNif: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(24).optional(),
  category: z.string().trim().max(40).default('PRESCRIPTOR'),
  tier: z.enum(TIERS).default('BRONZE'),
}).strict();

const PatchSchema = z.object({
  id: z.string().trim().min(1).max(64),
  tier: z.enum(TIERS).optional(),
  isActive: z.boolean().optional(),
  kycStatus: z.enum(['NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
}).strict();

function makeCode(seed: string): string {
  const base = seed.toUpperCase().normalize('NFD').replace(/[^A-Z0-9]/g, '').slice(0, 12);
  return (base || 'EAR') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
}

GET: requireAdmin -> prisma.affiliateProfile.findMany({ include:{ user:{ select:{ email:true, name:true } } }, orderBy:{ updatedAt:'desc' }, take:200 }) +
     prisma.affiliateProfile.count() -> { ok:true, data, total }.

POST: requireAdmin -> validar -> transacción:
  const user = await tx.user.upsert({ where:{ email }, update:{}, create:{ email, name, role:'AFFILIATE' } });
  const existing = await tx.affiliateProfile.findUnique({ where:{ userId: user.id } }); if (existing) throw new Error('AFFILIATE_EXISTS');
  const tierConfig = AFFILIATE_TIER_CONFIG.find((t) => t.tier === body.tier) ?? resolveTier(0); // TierConfig real del motor
  return tx.affiliateProfile.create({ data:{ userId:user.id, affiliateCode: makeCode(body.companyName ?? body.name ?? body.email), companyName: body.companyName, cifNif: body.cifNif, phone: body.phone, category: body.category, tier: tierConfig.tier, commissionRate: tierConfig.commissionRate }, include:{ user:{ select:{ email:true, name:true } } } });
  -> 201; P2002 -> 409; AFFILIATE_EXISTS -> 409.

PATCH: requireAdmin -> validar -> update con data tipado Prisma.AffiliateProfileUpdateInput (sin any) -> 200; P2025 -> 404.`,
        done_when: 'GET devuelve afiliados con usuario; POST crea User+AffiliateProfile con código único y comisión del motor; PATCH actualiza tier/estado; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T09_API_TREASURY_PRICE_LOCK',
        title: 'Registro de depósito 100 € Price-Lock: POST idempotente en /api/admin/treasury',
        priority: 'P0',
        files: ['src/app/api/admin/treasury/route.ts'],
        action: 'La tesorería solo lee, y su GET inventa clientName/serviceName porque commissionLedger no tiene esos campos (fachada de datos). Añadir POST idempotente que registre el depósito con referencia única PRICELOCK:<stripeSessionId>, split 80/10/10 desde el SSOT y hash de origen; y corregir el mapeo del GET a campos reales.',
        scaffold: `En src/app/api/admin/treasury/route.ts:

const PriceLockSchema = z.object({
  stripeSessionId: z.string().trim().min(8).max(120),
  amountEur: z.coerce.number().min(EAR_OS_SSOT.DEPOSITO_STRIPE_EUR).max(50_000),
  clientName: z.string().trim().min(2).max(120),
  clientEmail: z.string().trim().email().max(180).optional(),
  serviceName: z.string().trim().min(2).max(160),
  paidAt: z.string().datetime().optional(),
}).strict();

export async function POST(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request); if (!auth.ok) return auth.response;
  const parsed = PriceLockSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return errorResponse('INVALID_BODY', parsed.error.issues[0]?.message ?? 'Payload inválido', 400);
  const body = parsed.data;

  const reference = 'PRICELOCK:' + body.stripeSessionId;           // clave de idempotencia ACID
  const split = {
    artist: Number((body.amountEur * SPLIT_ARTIST).toFixed(2)),
    earOs: Number((body.amountEur * SPLIT_EAR_OS).toFixed(2)),
    vimume: Number((body.amountEur * SPLIT_VIMUME).toFixed(2)),
    rule: SPLIT_RULE,
    depositDeductible: true,
  };

  try {
    const row = await prisma.commissionLedger.upsert({
      where: { reference },
      update: {},                                                    // N retries -> 1 fila
      create: {
        reference,
        amount: body.amountEur,
        currency: 'EUR',
        sourceEvent: 'STRIPE_PRICE_LOCK',
        description: body.clientName + ' · ' + body.serviceName,
        notes: JSON.stringify({ ...split, clientEmail: body.clientEmail ?? null, paidAt: body.paidAt ?? new Date().toISOString() }),
      },
    });
    return jsonResponse({ ok: true, data: { id: row.id, reference: row.reference, amount: row.amount, split } }, reference === row.reference ? 201 : 200);
  } catch (err) {
    console.error('[TREASURY API] POST error', err);
    return errorResponse('INTERNAL_ERROR', 'Error interno del servidor', 500);
  }
}

GET (corregir mapeo a campos reales de commissionLedger):
  client: t.description ?? 'Sin descripción';  service: t.sourceEvent ?? 'STRIPE_PRICE_LOCK';
  deposit: t.amount.toFixed(2) + ' €';  hash: t.reference ?? 'NO_HASH';  status: t.status;  date: formatDate(t.createdAt);
  y eliminar readRecordField sobre campos inexistentes (clientName/serviceName/priceLockHash).`,
        done_when: 'POST con la misma stripeSessionId devuelve SIEMPRE una única fila (upsert por reference); split calculado desde EAR_OS_SSOT; GET sin campos inventados; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T10_CONTROL_SHELL',
        title: 'Shell del panel: hook useAdminResource, KPIs reales y fin de las fachadas',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/useAdminResource.ts', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Reescribir el shell del panel sobre el nuevo núcleo de red: eliminar fetchList local (que provocaba los 401), añadir KPIs reales por entidad, buscador global y sustituir los dos LinkCard vacíos (Afiliados y Tesorería) por listados reales conectados a sus APIs.',
        scaffold: `NUEVO useAdminResource.ts ('use client'):
export interface ResourceState<T> { status: 'idle'|'loading'|'success'|'error'; rows: T[]; total: number; error: AdminApiError | null; busy: boolean }
export function useAdminResource<T>(path: string): ResourceState<T> & {
  reload: () => Promise<void>;
  create: (body: unknown) => Promise<void>;
  patch: (body: unknown) => Promise<void>;
}
  - import { adminFetch, adminFetchList, AdminHttpError } from '@/lib/admin/adminFetch'
  - load(): status loading -> const { rows, total } = await adminFetchList<T>(path) -> success
            catch -> error: e instanceof AdminHttpError ? { status: e.status, code: e.code, message: e.message } : { status:0, code:'SERVER', message:'Error de red' }
  - create: setBusy -> adminFetch(path, { method:'POST', body }) -> await load()
  - patch:  setBusy -> adminFetch(path, { method:'PATCH', body }) -> await load()
  - useCallback con [path]; prohibido fetch directo; cero any.

ControlDashboard.tsx:
  - borrar fetchList y useEntityData locales; cada panel usa useAdminResource
  - banner si error.code === 'UNAUTHORIZED': "Sesión caducada" + <Link href="/login?from=/admin/control">
  - KPIs: grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 con el total real de cada pestaña
  - <input aria-label="Buscar entidad" /> que filtre filas en cliente
  - Afiliados -> useAdminResource<AffiliateRow>('/api/admin/affiliates') (tabla: código, empresa, tier, comisión, estado)
  - Tesorería -> adminFetch<{ metrics, transactions }>('/api/admin/treasury') (KPIs split 80/10/10 desde la API)
  - se elimina el componente LinkCard (cero fachadas)
  - estética OLED intacta: rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md`,
        done_when: 'Cero fetch directo en el panel; los 6 contadores muestran datos reales o error honesto; ninguna pestaña es un enlace vacío; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T11_TAB_ARTISTAS',
        title: 'Pestaña Artistas: alta, edición de estado y búsqueda reales',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/tabs/ArtistasTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Convertir la pestaña Artistas en un espacio de trabajo real: alta con formulario validado contra POST /api/admin/artists, cambio de estado con PATCH y feedback accesible. Cero estados inventados.',
        scaffold: `NUEVO tabs/ArtistasTab.tsx ('use client'):
export function ArtistasTab(): React.ReactElement
const { status, rows, total, error, reload, create, patch, busy } = useAdminResource<ArtistRow>('/api/admin/artists?size=100');

Alta (<form onSubmit={...}>): email* (type=email required), stageName* (required, min 2), displayName, genres (texto separado por comas)
  submit -> create({ email, stageName, displayName: displayName || undefined, genres: genres.split(',').map(t => t.trim()).filter(Boolean) })

Tabla: Artista (stageName/displayName), Email (user.email), Slug, Estado (badge), Actualizado
Acción por fila: botón "Publicar" si status !== 'PUBLISHED' -> patch({ id, status: 'PUBLISHED' }); "Pausar" si es PUBLISHED.

Accesibilidad y UX: cada input con <label htmlFor>, aria-busy={busy}, aria-live="polite" en el contenedor de mensajes,
  errores 409 -> "Ese email o slug ya existe"; 400 -> pintar issues; UNAUTHORIZED -> enlace /login.
Modal OLED: rounded-3xl border border-white/10 bg-[#09090d]/80 backdrop-blur-md, transition-all duration-300 ease-out, focus visible.

ControlDashboard.tsx: sustituir el panel read-only de artistas por {activeTab === 'artistas' && <ArtistasTab />} y eliminar su tabla duplicada.`,
        done_when: 'Alta de artista persiste en PostgreSQL y aparece en la tabla tras reload; PATCH de estado funciona; errores legibles; npx tsc --noEmit y npx eslint en Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T12_TAB_PROVEEDORES',
        title: 'Pestaña Proveedores: alta homologada y control de rating/estado',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/tabs/ProveedoresTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Alta de proveedores desde el propio panel con el enum real de categorías, y control de rating/estado por fila. La UI jamás envía isVerified: la verificación la decide el servidor según el teléfono real.',
        scaffold: `NUEVO tabs/ProveedoresTab.tsx ('use client'):
export function ProveedoresTab(): React.ReactElement
const { status, rows, total, error, create, patch, busy } = useAdminResource<ProviderRow>('/api/admin/providers');

const CATEGORIES = ['FINCA_ALQUILER','CATERING','DJ_DISCOMOVIL','BARRA_LIBRE','FOTOGRAFIA_VIDEO','FLORISTERIA','TRANSPORTE_AUTOBUS','DECORACION_ILUMINACION'] as const;

Alta: name*, companyName, category (select required), province (default 'Madrid / Toledo'), city, phone, email, description
  submit -> create({ name, companyName: companyName || undefined, category, province, city: city || undefined, phone: phone || undefined, email: email || undefined, description: description || undefined })
  PROHIBIDO incluir isVerified o claimStatus='VERIFIED_ACTIVE' sin teléfono real en el payload del cliente.

Tabla: Proveedor, Categoría, Provincia/Ciudad, Teléfono, Claim, Estado, Rating, Verificado (badge "Real" / "No verificado")
Acciones: rating 1-5 (input number step 0.1) -> patch({ id, rating }); estado -> patch({ id, status }) con opciones DRAFT/ACTIVE_VERIFIED/SUSPENDED.

UX: <label> por campo, aria-busy, aria-live="polite", errores 409 "Ese proveedor ya existe" y 400 con issues.
Estilo OLED rounded-3xl / bg-[#09090d]/80 / border-white/10 / backdrop-blur-md.

ControlDashboard.tsx: {activeTab === 'proveedores' && <ProveedoresTab />} y borrar el panel duplicado.`,
        done_when: 'Alta y PATCH persisten; isVerified solo puede venir a true del servidor con teléfono real; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T13_TAB_TERAPEUTAS',
        title: 'Pestaña Terapeutas: alta VIMUME y activación de profesionales',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/tabs/TerapeutasTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Dar de alta terapeutas del vertical VIMUME desde el panel (la pestaña mostraba 0 y HTTP 401) y permitir activar o suspender perfiles sin salir del panel.',
        scaffold: `NUEVO tabs/TerapeutasTab.tsx ('use client'):
export function TerapeutasTab(): React.ReactElement
const { status, rows, total, error, create, patch, busy } = useAdminResource<TherapistRow>('/api/admin/therapists');

const SPECIALTIES = ['musicoterapia','neuroacustica','estimulacion_cognitiva','ocupacional'] as const;

Alta: email*, name, specialty (select required), credentials (textarea, max 4000), bio (textarea, max 4000)
  submit -> create({ email, name: name || undefined, specialty, credentials: credentials || undefined, bio: bio || undefined })

Tabla: Terapeuta (user.name), Email, Especialidad, Activo (sí/no), Estado (ACTIVE/SUSPENDED/INACTIVE), Actualizado
Acciones: "Activar"/"Suspender" -> patch({ id, isActive, status: isActive ? 'ACTIVE' : 'SUSPENDED' })

UX: labels accesibles, aria-busy, aria-live="polite", 409 "El terapeuta ya existe".
Estilo OLED rounded-3xl / bg-[#09090d]/80 / border-white/10 / backdrop-blur-md, transiciones duration-300 ease-out.

ControlDashboard.tsx: {activeTab === 'terapeutas' && <TerapeutasTab />} y borrar el panel duplicado.`,
        done_when: 'Alta y suspensión persisten; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T14_TAB_FLOTA',
        title: 'Pestaña Flota: alta de unidades y control de estado operativo',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/tabs/FlotaTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Permitir dar de alta unidades de la flota y cambiar su estado operativo desde el panel, mostrando el último GPS real y sin inventar coordenadas cuando no existen.',
        scaffold: `NUEVO tabs/FlotaTab.tsx ('use client'):
export function FlotaTab(): React.ReactElement
const { status, rows, total, error, create, patch, busy } = useAdminResource<FleetRow>('/api/admin/fleet');

const FLEET_STATUSES = ['IDLE','EN_ROUTE','ON_SITE','MAINTENANCE'] as const;

Alta: unitCode* (min 2), code, status (select, default IDLE), currentLocation
  submit -> create({ unitCode, code: code || undefined, status, currentLocation: currentLocation || undefined })

Tabla: Unidad (unitCode/code), Estado, Ubicación, GPS (positions[0] -> "lat, lng" o "—"), Actualizado
Acciones: select de estado por fila -> patch({ id, status })

Regla de honestidad: si positions está vacío se muestra "—", nunca 0.0000, 0.0000.
UX: labels accesibles, aria-busy, aria-live="polite", 409 "unitCode ya registrado".
Estilo OLED rounded-3xl / bg-[#09090d]/80 / border-white/10 / backdrop-blur-md.

ControlDashboard.tsx: {activeTab === 'flota' && <FlotaTab />} y borrar el panel duplicado.`,
        done_when: 'Alta y cambio de estado persisten; sin coordenadas inventadas; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T15_TAB_AFILIADOS',
        title: 'Pestaña Afiliados: alta con código de referido y comisión del motor',
        priority: 'P1',
        files: ['src/app/(admin)/admin/control/tabs/AfiliadosTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Sustituir el LinkCard vacío de Afiliados por la mesa real de la red: alta de afiliado con código único copiable, tier del motor de comisiones y activación/suspensión. La tarifa la dicta el motor, no el formulario.',
        scaffold: `NUEVO tabs/AfiliadosTab.tsx ('use client'):
export function AfiliadosTab(): React.ReactElement
const { status, rows, total, error, create, patch, busy } = useAdminResource<AffiliateRow>('/api/admin/affiliates');

Alta: email*, name, companyName, cifNif, phone, tier (select BRONZE/SILVER/GOLD/PLATINUM, default BRONZE)
  submit -> create({ email, name: name || undefined, companyName: companyName || undefined, cifNif: cifNif || undefined, phone: phone || undefined, tier })

Tabla: Código (affiliateCode + botón copiar a portapapeles), Empresa (companyName) / Email (user.email), Tier, Comisión (commissionRate %),
        Ventas generadas (totalSalesGenerated), Estado (isActive)
Enlace de atribución mostrado por fila: https://productoraear.com/f/<affiliateCode> (solo lectura, botón copiar con navigator.clipboard).

Acciones: "Activar"/"Suspender" -> patch({ id, isActive }); cambio de tier -> patch({ id, tier }).
La comisión mostrada es SIEMPRE la que devuelve la API (motor de comisiones), nunca una constante de la UI.

UX: labels accesibles, aria-busy, aria-live="polite", 409 "El afiliado ya existe".
Estilo OLED rounded-3xl / bg-[#09090d]/80 / border-white/10 / backdrop-blur-md.

ControlDashboard.tsx: {activeTab === 'afiliados' && <AfiliadosTab />} y borrar la tarjeta-enlace.`,
        done_when: 'Alta crea afiliado con código único y comisión del motor; enlace /f/<code> copiable; activación persiste; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T16_TAB_TESORERIA',
        title: 'Pestaña Tesorería: split 80/10/10 en vivo y registro de depósito 100 €',
        priority: 'P0',
        files: ['src/app/(admin)/admin/control/tabs/TesoreriaTab.tsx', 'src/app/(admin)/admin/control/ControlDashboard.tsx'],
        action: 'Convertir la tesorería en mesa de dinero real: KPIs del split desde la API (que nace del SSOT SHA-256), libro de movimientos y alta de depósito Price-Lock de 100 € deducible con su referencia criptográfica visible.',
        scaffold: `NUEVO tabs/TesoreriaTab.tsx ('use client'):
export function TesoreriaTab(): React.ReactElement

type TreasuryPayload = { metrics: { totalDepositsAmount: string; totalDepositsCount: number; artistSplit: string; earOsSplit: string; vimumeSplit: string; rule: string }, transactions: { id: string; client: string; service: string; deposit: string; hash: string; status: string; date: string }[] };
estado local: const [payload, setPayload] = useState<TreasuryPayload | null>(null); const [error, setError] = useState<AdminApiError | null>(null);

Carga: adminFetch<{ metrics: TreasuryPayload['metrics']; transactions: TreasuryPayload['transactions'] }>('/api/admin/treasury?limit=50')
  -> setPayload({ metrics: res.metrics, transactions: res.transactions })
KPIs (4 tarjetas): Total depósitos, 80% Artista, 10% EAR OS, 10% VIMUME. Mostrar la regla devuelta por la API (no hardcodear textos de porcentaje).

Alta de depósito (<form>): stripeSessionId* (min 8), amountEur* (number, min 100, default 100), clientName*, serviceName*
  submit -> adminFetch('/api/admin/treasury', { method:'POST', body:{ stripeSessionId, amountEur, clientName, serviceName } })
  -> recargar y mostrar la referencia PRICELOCK:<id> devuelta + etiqueta "100% deducible del total del evento".

Tabla: Cliente, Servicio, Depósito, Referencia (hash), Estado, Fecha.
Errores: 401 -> enlace /login; 400 -> pintar issues; 503 -> aviso de servicio no configurado.

Estilo OLED rounded-3xl / bg-[#09090d]/80 / border-white/10 / backdrop-blur-md; acento ORO #ecb613 exclusivamente.

ControlDashboard.tsx: {activeTab === 'tesoreria' && <TesoreriaTab />} y borrar la tarjeta-enlace.`,
        done_when: 'Los 4 KPIs muestran cifras de la API; registrar el mismo stripeSessionId dos veces no duplica la fila; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T17_GOOGLE_ADS_COCKPIT',
        title: 'Cockpit Google Ads (addwords): conector server-only y panel honesto',
        priority: 'P2',
        files: ['src/lib/ads/googleAdsClient.ts', 'src/app/api/admin/ads/route.ts', 'src/app/(admin)/admin/ads/page.tsx'],
        action: 'Añadir el vertical de adquisición de pago: conector Google Ads por REST (sin SDK nuevo) que lea métricas reales de campañas. Sin credenciales NO se inventan datos: el endpoint devuelve 503 ADS_NOT_CONFIGURED y el panel muestra el checklist de configuración.',
        scaffold: `NUEVO src/lib/ads/googleAdsClient.ts (server-only, import 'server-only'):
export interface AdsCampaignMetric { campaignId: string; campaignName: string; status: string; impressions: number; clicks: number; costEur: number; conversions: number; ctr: number }
export function isGoogleAdsConfigured(): boolean  // exige GOOGLE_ADS_DEVELOPER_TOKEN, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, CUSTOMER_ID
async function getAccessToken(): Promise<string>
  POST https://oauth2.googleapis.com/token  (application/x-www-form-urlencoded: client_id, client_secret, refresh_token, grant_type=refresh_token)
  -> access_token; si falla -> throw new Error('GOOGLE_ADS_AUTH_FAILED')
export async function fetchCampaignMetrics(days = 30): Promise<AdsCampaignMetric[]>
  const cid = (process.env.GOOGLE_ADS_CUSTOMER_ID ?? '').replace(/-/g, '');
  POST https://googleads.googleapis.com/v19/customers/\${cid}/googleAds:search
  headers: Authorization Bearer, developer-token, login-customer-id (si existe), Content-Type application/json
  GAQL: SELECT campaign.id, campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr FROM campaign WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC
  map: costEur = cost_micros / 1_000_000; ctr = Number(metrics.ctr) * 100
  PROHIBIDO any y PROHIBIDO exponer secretos al cliente.

NUEVO src/app/api/admin/ads/route.ts (nodejs, force-dynamic, no-store):
  const auth = await requireAdmin(request); if (!auth.ok) return auth.response;
  if (!isGoogleAdsConfigured()) return NextResponse.json({ ok:false, code:'ADS_NOT_CONFIGURED', error:'Google Ads sin configurar' }, { status: 503 });
  const days = Number(new URL(request.url).searchParams.get('days') ?? '30'); clamp 1..90
  return NextResponse.json({ ok:true, data: await fetchCampaignMetrics(days) });

NUEVO src/app/(admin)/admin/ads/page.tsx (Server Component, export const dynamic='force-dynamic'):
  const auth = await requireAdminFromHeaders(); if (!auth.ok) redirect('/login?from=/admin/ads');
  si !isGoogleAdsConfigured() -> checklist de las 5 variables de entorno (nombres, jamás valores) y estado "Sin configurar".
  si configurado -> tabla de campañas (nombre, estado, impresiones, clics, CTR, coste €, conversiones) y totales.
  Estética OLED: rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md, acento Cyan #00E5FF.
  Añadir submenú en MASTER_TABS (prospeccion) -> { id:'ads', name:'Google Ads', href:'/admin/ads', badge:'ADS' }.`,
        done_when: 'Sin credenciales el panel muestra el checklist y la API responde 503 tipado (cero datos falsos); con credenciales devuelve campañas reales; npx tsc --noEmit Exit Code 0.',
        test: 'npx tsc --noEmit',
    },
    {
        id: 'W41_T18_CONTRACT_GATE',
        title: 'Cierre W41: convertir el auditor forense en gate de CI (0 fachadas)',
        priority: 'P0',
        files: ['scripts/audit_admin_control_forensics.cjs', 'package.json'],
        action: 'Sellar la ola: el auditor que detectó las 22 fachadas debe pasar a ser un gate ejecutable que impida la regresión. Al cerrar esta tarea el panel no puede volver a tener endpoints sin guard, POST sin escritura, Server Actions con Request vacío ni fetch directo desde la UI.',
        scaffold: `Extender scripts/audit_admin_control_forensics.cjs (ya existe, no reescribir desde cero) con 5 aserciones en modo --strict:
  A) Toda ruta src/app/api/admin/**/route.ts tiene requireAdmin, SALVO src/app/api/admin/session/route.ts (usa adminAuth.verifyIdToken + UserService.hasRole).
  B) Todo route con verbo POST importa zod Y ejecuta prisma.<modelo>.create|createMany|upsert|update.
  C) Cero ocurrencias de new Request('http://localhost') en src/.
  D) Cero llamadas fetch( directas en src/app/(admin) — debe usarse adminFetch.
  E) Cero ': any' / 'as any' en src/app/(admin) y src/lib/admin.
Cada aserción fallida imprime la lista de rutas/ficheros y fuerza process.exit(1). Se mantiene la emisión del reporte markdown en .antigravity/reports/ADMIN_CONTROL_MATRIX.md.

package.json:
  "audit:admin": "node scripts/audit_admin_control_forensics.cjs --strict --write"
  añadir " && npm run audit:admin" al final de "gate:prepush".

Validación de cierre (obligatoria antes del complete):
  node scripts/audit_admin_control_forensics.cjs --strict --write   -> Exit Code 0
  npx tsc --noEmit                                                  -> Exit Code 0
  npx eslint "src/app/(admin)/admin/control" src/lib/admin src/app/api/admin --max-warnings=0 -> Exit Code 0`,
        done_when: 'El gate devuelve Exit Code 0 con 0 fachadas (partiendo de 22), tsc y eslint limpios, y gate:prepush incluye audit:admin. Scorecard 20/20 sin TODO ni any.',
        test: 'node scripts/audit_admin_control_forensics.cjs --strict --write',
    },
];

/* ────────────────────────────── INYECCIÓN IDEMPOTENTE ────────────────────── */
const REQUIRED = ['id', 'title', 'files', 'action', 'scaffold', 'done_when', 'test'];

function main() {
    for (const task of TASKS) {
        const missing = REQUIRED.filter((key) => {
            const value = task[key];
            return value === undefined || value === null || (Array.isArray(value) ? value.length === 0 : value === '');
        });
        if (missing.length > 0) {
            throw new Error(`Tarea ${task.id ?? '(sin id)'} incompleta: faltan ${missing.join(', ')}`);
        }
        if (!Array.isArray(task.files) || task.files.length === 0) {
            throw new Error(`Tarea ${task.id} sin archivos asignados`);
        }
    }

    const data = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
    data.tasks = Array.isArray(data.tasks) ? data.tasks : [];
    data.completed = Array.isArray(data.completed) ? data.completed : [];

    const known = new Set([...data.tasks, ...data.completed].map((t) => t.id));
    const injected = [];
    const now = new Date().toISOString();

    for (const task of TASKS) {
        if (known.has(task.id)) continue;
        data.tasks.push({ ...task, status: 'QUEUED', created_at: now });
        injected.push(task.id);
    }

    const pending = data.tasks.filter((t) => t.status === 'QUEUED').length;

    // Normalización del validador: 'npx tsc' resuelve al paquete impostor si falta node_modules/.bin/tsc.
    const TSC_CMD = 'node ./node_modules/typescript/bin/tsc --noEmit';
    for (const task of data.tasks) {
        if (task.test === 'npx tsc --noEmit') task.test = TSC_CMD;
        if (typeof task.done_when === 'string' && task.done_when.includes('npx tsc --noEmit')) {
            task.done_when = task.done_when.split('npx tsc --noEmit').join(TSC_CMD);
        }
        if (typeof task.scaffold === 'string' && task.scaffold.includes('npx tsc --noEmit')) {
            task.scaffold = task.scaffold.split('npx tsc --noEmit').join(TSC_CMD);
        }
    }

    data._meta = {
        version: '9.9-OMEGA-WAVE-41-ADMIN-CONTROL-DOMINANCE',
        doctrine: 'WAVE 41: el panel /admin/control pasa de fachada (22 enlaces rotos) a mesa de mando enterprise. Toda alta escribe en PostgreSQL, todo endpoint exige Bearer ADMIN, toda cifra nace del SSOT SHA-256.',
        wave: 41,
        total_tasks: data.tasks.length,
    };
    data.metadata = {
        ...(data.metadata ?? {}),
        last_updated: now,
        total_pending: pending,
        current_sprint: 'WAVE_41_ADMIN_CONTROL_DOMINANCE',
        ceo_mandate: 'Reconstruir /admin/control al 100%: altas reales de artistas, proveedores, terapeutas, flota, afiliados y tesorería; sesión Bearer unificada; cero fachadas verificadas por scripts/audit_admin_control_forensics.cjs --strict.',
    };
    data._instructions_for_worker =
        "Ejecuta SOLO via: node .antigravity/omega.js next -> lee .antigravity/MISSION_ACTIVE.json -> edita SOLO 'files' -> ejecuta 'test' -> node .antigravity/omega.js complete <ID>. 1 tarea por sesion.";

    fs.writeFileSync(QUEUE, JSON.stringify(data, null, 2) + '\n', 'utf8');

    console.log(JSON.stringify({ injected: injected.length, ids: injected, pending, total: data.tasks.length }, null, 2));
    if (injected.length === 0) console.log('[SEED] Wave 41 ya estaba inyectada (idempotente).');
}

main();
