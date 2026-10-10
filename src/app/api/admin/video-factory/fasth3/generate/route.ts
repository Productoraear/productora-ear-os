import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";

// ============================================================================
// EAR OS v2 — S-Class Security Hardening
// TAREA ID: W02-API-021
// Endpoint: POST /api/admin/video-factory/fasth3/generate
// Despachador de Prompts hacia FastH3 / ComfyUI (Puerto 8190)
// ============================================================================

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ----------------------------------------------------------------------------
// SSOT local (espejo de src/lib/constants/ear-os-ssot.ts)
// ----------------------------------------------------------------------------
const COMFY_HOST = "127.0.0.1";
const COMFY_PORT = 8190;
const COMFY_URL = `http://${COMFY_HOST}:${COMFY_PORT}`;
const COMFY_TIMEOUT_MS = 3000;
const COMFY_RUN_TIMEOUT_MS = 15000;
const WORKFLOW_DIR = path.join("H:", "ComfyUI", "workflows");
const WORKFLOW_FILE = "video_fastvideo_fasth3_t2v.json";
const FASTH3_NODE_ID = 105;

const DEFAULT_SOUNDSCAPE =
  "Cinematic acoustic ambiance, high-fidelity stereo room reverberation.";
const DEFAULT_MUSIC =
  "Subtle acoustic classical guitar and piano chords with warm low-end resonance.";

// ----------------------------------------------------------------------------
// Security Headers (OLED #030305 / S-Class)
// ----------------------------------------------------------------------------
const SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};

type JsonBody = Record<string, unknown>;

function jsonResponse<T extends JsonBody>(
  body: T,
  status = 200,
): NextResponse<T> {
  return NextResponse.json(body, { status, headers: SECURITY_HEADERS });
}

// ----------------------------------------------------------------------------
// Zod Schema — Validación estricta de inputs
// ----------------------------------------------------------------------------
const GeneratePayloadSchema = z
  .object({
    prompt: z
      .string({ message: "El prompt cinematográfico es obligatorio." })
      .trim()
      .min(1, "El prompt cinematográfico es obligatorio.")
      .max(4000, "El prompt excede el límite de 4000 caracteres."),
    soundscape: z
      .string()
      .trim()
      .max(1000, "El soundscape excede el límite de 1000 caracteres.")
      .optional()
      .default(DEFAULT_SOUNDSCAPE),
    music: z
      .string()
      .trim()
      .max(1000, "La música excede el límite de 1000 caracteres.")
      .optional()
      .default(DEFAULT_MUSIC),
    width: z.coerce
      .number()
      .int("width debe ser entero.")
      .min(256, "width mínimo 256.")
      .max(4096, "width máximo 4096.")
      .optional()
      .default(1344),
    height: z.coerce
      .number()
      .int("height debe ser entero.")
      .min(256, "height mínimo 256.")
      .max(4096, "height máximo 4096.")
      .optional()
      .default(768),
    durationSeconds: z.coerce
      .number()
      .int("durationSeconds debe ser entero.")
      .min(1, "durationSeconds mínimo 1.")
      .max(30, "durationSeconds máximo 30.")
      .optional()
      .default(5),
    seed: z.coerce
      .number()
      .int("seed debe ser entero.")
      .min(0, "seed debe ser >= 0.")
      .max(1_000_000_000, "seed excede el rango permitido.")
      .optional(),
  })
  .strict();

type GeneratePayload = z.infer<typeof GeneratePayloadSchema>;

// ----------------------------------------------------------------------------
// Sanitización defensiva (elimina control chars / normaliza)
// ----------------------------------------------------------------------------
function sanitizeText(input: string): string {
  // Elimina caracteres de control (excepto \n y \t) y normaliza espacios.
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// ----------------------------------------------------------------------------
// Tipos de respuesta (con index signature para satisfacer Record<string, unknown>)
// ----------------------------------------------------------------------------
interface SuccessResponse extends JsonBody {
  success: true;
  message: string;
  promptId: string;
  seed: number;
  fullPrompt: string;
  comfyUrl: string;
}

interface ErrorResponse extends JsonBody {
  error: string;
  details?: unknown;
}

// ----------------------------------------------------------------------------
// Handler
// ----------------------------------------------------------------------------
export async function POST(
  request: Request,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1) Parseo seguro del body
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonResponse<ErrorResponse>(
        { error: "Body JSON inválido o vacío." },
        400,
      );
    }

    // 2) Validación estricta con Zod
    const parsed = GeneratePayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse<ErrorResponse>(
        {
          error: "Payload inválido.",
          details: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    }

    const data: GeneratePayload = parsed.data;

    // 3) Sanitización
    const prompt = sanitizeText(data.prompt);
    const soundscape = sanitizeText(data.soundscape);
    const music = sanitizeText(data.music);
    const width = data.width;
    const height = data.height;
    const durationSeconds = data.durationSeconds;
    const seed =
      data.seed ?? Math.floor(Math.random() * 1_000_000_000);

    if (prompt.length === 0) {
      return jsonResponse<ErrorResponse>(
        { error: "El prompt cinematográfico es obligatorio." },
        400,
      );
    }

    // 4) Verificar plantilla de workflow
    const workflowPath = path.join(WORKFLOW_DIR, WORKFLOW_FILE);
    if (!fs.existsSync(workflowPath)) {
      return jsonResponse<ErrorResponse>(
        {
          error: `Plantilla oficial ${WORKFLOW_FILE} no encontrada en H:\\ComfyUI.`,
        },
        500,
      );
    }

    let workflow: Record<string, unknown>;
    try {
      const workflowRaw = fs.readFileSync(workflowPath, "utf-8");
      workflow = JSON.parse(workflowRaw) as Record<string, unknown>;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error leyendo workflow.";
      return jsonResponse<ErrorResponse>(
        { error: `Workflow corrupto o ilegible: ${msg}` },
        500,
      );
    }

    // 5) Prompt multimodal integrado (FastH3)
    const fullIntegratedPrompt =
      `integrated_multimodal_description: ${prompt}\n` +
      `overall_soundscape: ${soundscape}\n` +
      `non_diegetic_music: ${music}`;

    // 6) Patch del macro-nodo FastH3 (Node 105)
    let patched = false;
    const nodes = (workflow as { nodes?: unknown }).nodes;
    if (Array.isArray(nodes)) {
      for (const node of nodes) {
        if (
          node &&
          typeof node === "object" &&
          (node as { id?: unknown }).id === FASTH3_NODE_ID &&
          Array.isArray((node as { widgets_values?: unknown }).widgets_values)
        ) {
          const widgets = (node as { widgets_values: unknown[] })
            .widgets_values;
          widgets[0] = fullIntegratedPrompt;
          widgets[1] = width;
          widgets[2] = height;
          widgets[3] = durationSeconds;
          widgets[4] = seed;
          patched = true;
          break;
        }
      }
    }

    if (!patched) {
      return jsonResponse<ErrorResponse>(
        {
          error: `No se pudo localizar el nodo FastH3 (Node ${FASTH3_NODE_ID}) en el workflow.`,
        },
        500,
      );
    }

    // 7) Health-check ComfyUI
    try {
      const ping = await fetch(`${COMFY_URL}/system_stats`, {
        signal: AbortSignal.timeout(COMFY_TIMEOUT_MS),
      });
      if (!ping.ok) throw new Error("ComfyUI no responde");
    } catch {
      return jsonResponse<ErrorResponse>(
        {
          error: `ComfyUI no está conectado en ${COMFY_URL}. Ejecuta H:\\ComfyUI\\START_FASTH3_COMFYUI.bat para iniciar el motor.`,
        },
        503,
      );
    }

    // 8) Dispatch a ComfyUI (con fallback)
    const promptPayload = {
      extra_data: { extra_pnginfo: { workflow } },
      workflow,
    };

    console.log(
      `[FASTH3_DISPATCH] Enviando prompt a ComfyUI ${COMFY_PORT} (Seed: ${seed})...`,
    );

    let response: Response;
    try {
      response = await fetch(`${COMFY_URL}/api/workflow/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow,
          inputs: {
            prompt: fullIntegratedPrompt,
            width,
            height,
            duration: durationSeconds,
            seed,
          },
        }),
        signal: AbortSignal.timeout(COMFY_RUN_TIMEOUT_MS),
      });
    } catch {
      // Fallback a POST /prompt estándar
      try {
        response = await fetch(`${COMFY_URL}/prompt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promptPayload),
          signal: AbortSignal.timeout(COMFY_RUN_TIMEOUT_MS),
        });
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Fallo de red con ComfyUI.";
        return jsonResponse<ErrorResponse>(
          { error: `No se pudo contactar ComfyUI: ${msg}` },
          502,
        );
      }
    }

    const resData: Record<string, unknown> = await response
      .json()
      .catch(() => ({}));

    const promptId =
      typeof resData.prompt_id === "string" && resData.prompt_id.length > 0
        ? resData.prompt_id
        : `FH3-${Date.now()}`;

    return jsonResponse<SuccessResponse>(
      {
        success: true,
        message:
          "Prompt inyectado con éxito en el motor FastH3 (AMD RX 7900 XTX).",
        promptId,
        seed,
        fullPrompt: fullIntegratedPrompt,
        comfyUrl: COMFY_URL,
      },
      200,
    );
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Error interno del servidor.";
    console.error("[FASTH3_API_ERROR]", msg);
    return jsonResponse<ErrorResponse>({ error: msg }, 500);
  }
}

// ----------------------------------------------------------------------------
// Rechazo explícito de métodos no soportados
// ----------------------------------------------------------------------------
export async function GET(): Promise<NextResponse<ErrorResponse>> {
  return jsonResponse<ErrorResponse>(
    { error: "Método no permitido. Usa POST." },
    405,
  );
}