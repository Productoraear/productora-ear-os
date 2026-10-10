import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIG_PATH = path.join(process.cwd(), 'src/data/admin/mobile-studio-config.json');

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const ALLOWED_MODES = [
  'SOVEREIGN_HUD_V5',
  'SOVEREIGN_HUD_V4',
  'CLASSIC',
  'MINIMAL',
] as const;

const ALLOWED_ROLES = [
  'novios',
  'corporativo',
  'artistas',
  'b2g_institucional',
] as const;

const FeaturesSchema = z
  .object({
    showRoleSwitcher: z.boolean(),
    showJourneyBar: z.boolean(),
    showAIConciergeFloating: z.boolean(),
    showDirectWhatsAppButton: z.boolean(),
    ambientGlow: z.boolean(),
  })
  .strict();

const ConfigSchema = z
  .object({
    activeMode: z.enum(ALLOWED_MODES),
    features: FeaturesSchema,
    rolesEnabled: z
      .array(z.enum(ALLOWED_ROLES))
      .min(1)
      .max(ALLOWED_ROLES.length)
      .refine(
        (roles) => new Set(roles).size === roles.length,
        { message: 'rolesEnabled must not contain duplicates' },
      ),
  })
  .strict();

const PartialConfigSchema = ConfigSchema.partial();

type MobileStudioConfig = z.infer<typeof ConfigSchema>;

const DEFAULT_CONFIG: MobileStudioConfig = {
  activeMode: 'SOVEREIGN_HUD_V5',
  features: {
    showRoleSwitcher: true,
    showJourneyBar: true,
    showAIConciergeFloating: false,
    showDirectWhatsAppButton: false,
    ambientGlow: true,
  },
  rolesEnabled: ['novios', 'corporativo', 'artistas', 'b2g_institucional'],
};

interface ConfigResponse extends MobileStudioConfig {
  updatedAt: string;
}

interface PostSuccessResponse {
  success: true;
  config: ConfigResponse;
}

interface PostErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

function withSecurityHeaders<T>(response: NextResponse<T>): NextResponse<T> {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function jsonResponse<T>(body: T, init?: ResponseInit): NextResponse<T> {
  return withSecurityHeaders(NextResponse.json<T>(body, init));
}

function safeParseConfig(raw: string): MobileStudioConfig | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = ConfigSchema.safeParse(parsed);
    if (!result.success) {
      console.warn('[MOBILE_STUDIO_CONFIG_INVALID]', result.error.flatten());
      return null;
    }
    return result.data;
  } catch (error) {
    console.error('[MOBILE_STUDIO_CONFIG_PARSE_ERROR]', error);
    return null;
  }
}

function readConfigFromDisk(): MobileStudioConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return DEFAULT_CONFIG;
    }
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    const parsed = safeParseConfig(raw);
    return parsed ?? DEFAULT_CONFIG;
  } catch (error) {
    console.error('[MOBILE_STUDIO_READ_ERROR]', error);
    return DEFAULT_CONFIG;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return withSecurityHeaders(auth.response);
    }

    const config = readConfigFromDisk();
    const payload: ConfigResponse = {
      ...config,
      updatedAt: new Date().toISOString(),
    };

    return jsonResponse<ConfigResponse>(payload);
  } catch (error) {
    console.error('[MOBILE_STUDIO_GET_FATAL]', error);
    return jsonResponse<ConfigResponse>(
      { ...DEFAULT_CONFIG, updatedAt: new Date().toISOString() },
      { status: 200 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return withSecurityHeaders(auth.response);
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      const errorBody: PostErrorResponse = {
        success: false,
        error: 'INVALID_JSON_BODY',
      };
      return jsonResponse<PostErrorResponse>(errorBody, { status: 400 });
    }

    const parsed = PartialConfigSchema.safeParse(rawBody);
    if (!parsed.success) {
      const errorBody: PostErrorResponse = {
        success: false,
        error: 'VALIDATION_FAILED',
        details: parsed.error.flatten(),
      };
      return jsonResponse<PostErrorResponse>(errorBody, { status: 422 });
    }

    const current = readConfigFromDisk();
    const merged: MobileStudioConfig = {
      activeMode: parsed.data.activeMode ?? current.activeMode,
      features: {
        ...current.features,
        ...(parsed.data.features ?? {}),
      },
      rolesEnabled: parsed.data.rolesEnabled ?? current.rolesEnabled,
    };

    const validated = ConfigSchema.safeParse(merged);
    if (!validated.success) {
      const errorBody: PostErrorResponse = {
        success: false,
        error: 'MERGED_CONFIG_INVALID',
        details: validated.error.flatten(),
      };
      return jsonResponse<PostErrorResponse>(errorBody, { status: 422 });
    }

    const updatedConfig: ConfigResponse = {
      ...validated.data,
      updatedAt: new Date().toISOString(),
    };

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      CONFIG_PATH,
      JSON.stringify(updatedConfig, null, 2),
      'utf-8',
    );

    const successBody: PostSuccessResponse = {
      success: true,
      config: updatedConfig,
    };

    const response = jsonResponse<PostSuccessResponse>(successBody);
    response.cookies.set('ear_mobile_mode', updatedConfig.activeMode, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('[MOBILE_STUDIO_POST_FATAL]', error);
    const errorBody: PostErrorResponse = {
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
    };
    return jsonResponse<PostErrorResponse>(errorBody, { status: 500 });
  }
}