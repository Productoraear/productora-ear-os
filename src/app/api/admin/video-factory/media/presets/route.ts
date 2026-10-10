import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * W02-API-025 · SECURITY API HARDENING
 * src/app/api/admin/video-factory/media/presets/route.ts
 *
 * Endpoint de solo lectura (GET) que expone la librería SSOT de assets
 * multimedia para el Video Factory. Hardening S-Class:
 *  - Validación estricta de query params con Zod.
 *  - Sanitización de strings (trim + límite de longitud).
 *  - try/catch global con respuesta tipada.
 *  - Headers de seguridad (CSP, no-store, nosniff, etc.).
 *  - Cero `any` implícitos.
 */

// ---------------------------------------------------------------------------
// Tipos & SSOT
// ---------------------------------------------------------------------------

export type StockMediaCategory =
  | "b-roll"
  | "background"
  | "soundtrack"
  | "sfx";

export interface StockMediaAsset {
  readonly id: string;
  readonly name: string;
  readonly category: StockMediaCategory;
  readonly url: string;
  readonly duration?: number;
  readonly previewColor?: string;
  readonly description: string;
}

export interface PresetsSuccessResponse {
  readonly success: true;
  readonly assets: readonly StockMediaAsset[];
  readonly count: number;
  readonly filteredBy: {
    readonly category: StockMediaCategory | null;
    readonly q: string | null;
  };
  readonly timestamp: string;
}

export interface PresetsErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly code:
    | "INVALID_QUERY"
    | "INTERNAL_ERROR";
  readonly details?: readonly string[];
  readonly timestamp: string;
}

export type PresetsResponse = PresetsSuccessResponse | PresetsErrorResponse;

// ---------------------------------------------------------------------------
// Librería SSOT de assets
// ---------------------------------------------------------------------------

export const STOCK_MEDIA_LIBRARY: readonly StockMediaAsset[] = [
  // B-ROLL FOOTAGE & CINEMATIC BACKGROUNDS
  {
    id: "broll-piano-gala",
    name: "Piano de Cola & Iluminación Ámbar",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 15,
    previewColor: "#ecb613",
    description:
      "Plano cinematográfico con iluminación cálida y ambiente de sala de conciertos.",
  },
  {
    id: "broll-concert-crowd",
    name: "Público & Ovación en Vivo",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 15,
    previewColor: "#00E5FF",
    description: "Gran escena de aplausos y emoción en directo.",
  },
  {
    id: "broll-luxury-wedding",
    name: "Finca de Gala & Cóctel VIP",
    category: "b-roll",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 15,
    previewColor: "#FF2B44",
    description:
      "Espacios de alta gama para bodas exclusivas y eventos corporativos.",
  },
  {
    id: "broll-abstract-waves",
    name: "Ondas Acústicas 40Hz (VIMUME)",
    category: "background",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    duration: 15,
    previewColor: "#10b981",
    description:
      "Visualización de bio-frecuencias armónicas y ondas cerebrales.",
  },
  {
    id: "broll-cyber-lights",
    name: "Focos Escénicos & Anamorphic Flares",
    category: "background",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    duration: 15,
    previewColor: "#9333ea",
    description: "Haces de luz volumétrica y flare anamórfico 35mm.",
  },

  // SOUNDTRACKS (MÚSICA DE FONDO)
  {
    id: "track-gala-piano",
    name: "Edwin Agudelo — Solo Piano Gala S-Class",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/ambiences/theatre_crowd_applause.ogg",
    duration: 30,
    previewColor: "#ecb613",
    description: "Interpretación virtuosa acústica con armónicos cálidos.",
  },
  {
    id: "track-cinematic-epic",
    name: "Epic Orchestral Rise (Clímax de Venta)",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/sports/baseball_stadium_organ_cheer.ogg",
    duration: 20,
    previewColor: "#FF2B44",
    description:
      "Crescendo sinfónico con percusión híbrida de alto impacto.",
  },
  {
    id: "track-vimume-40hz",
    name: "VIMUME Protocolo 40Hz Gamma",
    category: "soundtrack",
    url: "https://actions.google.com/sounds/v1/science_fiction/teleport_whoosh.ogg",
    duration: 45,
    previewColor: "#10b981",
    description:
      "Frecuencia terapéutica de neuromodulación no invasiva.",
  },

  // SFX (TRANSICIONES & IMPACTOS)
  {
    id: "sfx-whoosh-cinematic",
    name: "Cinematic Transition Whoosh",
    category: "sfx",
    url: "https://actions.google.com/sounds/v1/science_fiction/space_warp_burst.ogg",
    duration: 1.5,
    previewColor: "#00E5FF",
    description: "Transición rápida de barrido con baja frecuencia.",
  },
  {
    id: "sfx-sub-drop",
    name: "Sub Bass Hit Impact",
    category: "sfx",
    url: "https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg",
    duration: 2,
    previewColor: "#ecb613",
    description: "Impacto seco en graves para resaltar textos clave.",
  },
];

// ---------------------------------------------------------------------------
// Validación estricta de query params (Zod)
// ---------------------------------------------------------------------------

const CATEGORY_VALUES = [
  "b-roll",
  "background",
  "soundtrack",
  "sfx",
] as const satisfies readonly StockMediaCategory[];

const sanitizeString = (value: string): string =>
  value.replace(/[\u0000-\u001F\u007F]/g, "").trim();

const QuerySchema = z
  .object({
    category: z
      .string()
      .trim()
      .max(32, "category excede longitud máxima")
      .optional()
      .transform((v) => (v === undefined || v === "" ? undefined : v))
      .refine(
        (v): v is StockMediaCategory =>
          v === undefined ||
          (CATEGORY_VALUES as readonly string[]).includes(v),
        { message: "category inválida" },
      ),
    q: z
      .string()
      .max(120, "q excede longitud máxima")
      .optional()
      .transform((v) => (v === undefined ? undefined : sanitizeString(v)))
      .transform((v) => (v === "" ? undefined : v)),
  })
  .strict();

type ParsedQuery = z.infer<typeof QuerySchema>;

// ---------------------------------------------------------------------------
// Headers de seguridad
// ---------------------------------------------------------------------------

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Content-Security-Policy":
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
};

const jsonResponse = <T,>(
  body: T,
  status: number,
): NextResponse<T> =>
  NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });

// ---------------------------------------------------------------------------
// Handler GET
// ---------------------------------------------------------------------------

export async function GET(request: Request): Promise<NextResponse<PresetsResponse>> {
  const timestamp = new Date().toISOString();

  try {
    const url = new URL(request.url);
    const rawParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      rawParams[key] = value;
    });

    const parsed = QuerySchema.safeParse(rawParams);

    if (!parsed.success) {
      const details = parsed.error.issues.map(
        (issue) => `${issue.path.join(".") || "query"}: ${issue.message}`,
      );
      const errorBody: PresetsErrorResponse = {
        success: false,
        error: "Parámetros de consulta inválidos.",
        code: "INVALID_QUERY",
        details,
        timestamp,
      };
      return jsonResponse(errorBody, 400);
    }

    const { category, q }: ParsedQuery = parsed.data;

    const normalizedQuery = q?.toLowerCase() ?? null;

    const filtered: readonly StockMediaAsset[] = STOCK_MEDIA_LIBRARY.filter(
      (asset) => {
        if (category && asset.category !== category) return false;
        if (normalizedQuery) {
          const haystack = `${asset.name} ${asset.description} ${asset.id}`.toLowerCase();
          if (!haystack.includes(normalizedQuery)) return false;
        }
        return true;
      },
    );

    const body: PresetsSuccessResponse = {
      success: true,
      assets: filtered,
      count: filtered.length,
      filteredBy: {
        category: category ?? null,
        q: q ?? null,
      },
      timestamp,
    };

    return jsonResponse(body, 200);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido";
    const errorBody: PresetsErrorResponse = {
      success: false,
      error: "Error interno al procesar la solicitud.",
      code: "INTERNAL_ERROR",
      details: [message],
      timestamp,
    };
    return jsonResponse(errorBody, 500);
  }
}

// ---------------------------------------------------------------------------
// Métodos no permitidos → 405 con headers de seguridad
// ---------------------------------------------------------------------------

const methodNotAllowed = (): NextResponse<PresetsErrorResponse> =>
  jsonResponse(
    {
      success: false,
      error: "Método no permitido. Use GET.",
      code: "INVALID_QUERY",
      timestamp: new Date().toISOString(),
    },
    405,
  );

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;