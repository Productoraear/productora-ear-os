import { NextResponse } from "next/server";
import { verifySsotIntegrity } from "@/lib/security/ssotIntegrityGuard";
import { execFile } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";
import { z } from "zod";

// Endpoint S-Class Blindado: Orquestador del Motor de Video Remotion a 60 FPS
// Blindaje contra inyección de comandos mediante execFile con paso de argumentos atómico

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-EAR-OS-Hardened": "S-CLASS",
};

const SAFE_FILENAME_REGEX = /^[a-zA-Z0-9_\-\.]{1,180}$/;

const GeneratePayloadSchema = z
  .object({
    props: z.record(z.string(), z.unknown()).optional().default({}),
    outDir: z.string().min(1).max(1024).optional(),
    filename: z.string().min(1).max(200).optional(),
  })
  .strict();

type GeneratePayload = z.infer<typeof GeneratePayloadSchema>;

interface GenerateSuccessResponse {
  success: true;
  message: string;
  ticketId: string;
  outputFile: string;
}

interface GenerateErrorResponse {
  success: false;
  error: string;
  code: string;
}

function jsonResponse<T extends object>(
  body: T,
  status: number,
  extraHeaders?: Record<string, string>
): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: { ...SECURITY_HEADERS, ...(extraHeaders ?? {}) },
  });
}

function sanitizeFilename(raw: string | undefined): string {
  const fallback = `EAR_OS_MASTER_${Date.now()}`;
  const base = typeof raw === "string" && raw.length > 0 ? raw : fallback;
  const withoutExt = base.replace(/\.mp4$/i, "");
  const sanitized = withoutExt.replace(/[^a-zA-Z0-9_\-\.]/g, "_").slice(0, 180);
  const safeBase = sanitized.length > 0 ? sanitized : fallback;
  const finalName = `${safeBase}.mp4`;
  if (!SAFE_FILENAME_REGEX.test(finalName)) {
    return `${fallback}.mp4`;
  }
  return finalName;
}

function resolveSafeOutDir(raw: string | undefined): string {
  const fallback = path.join(os.homedir(), "Desktop");
  const candidate = typeof raw === "string" && raw.trim().length > 0 ? raw : fallback;
  const resolved = path.resolve(candidate);
  // Bloqueo de rutas críticas del sistema
  const forbiddenRoots = ["/etc", "/bin", "/sbin", "/usr", "/var", "/sys", "/proc", "/boot"];
  if (forbiddenRoots.some((root) => resolved === root || resolved.startsWith(`${root}${path.sep}`))) {
    return fallback;
  }
  return resolved;
}

export async function POST(request: Request): Promise<NextResponse> {
  let tempPropsPath: string | null = null;

  try {
    // Validación atómica de invariantes SSOT (Cero Simulaciones)
    const integrityCheck = verifySsotIntegrity();
    if (!integrityCheck.intact) {
      return jsonResponse<GenerateErrorResponse>(
        {
          success: false,
          error: "Violación de Invariantes SSOT. Bloqueo Atómico.",
          code: "SSOT_INTEGRITY_VIOLATION",
        },
        403
      );
    }

    let rawPayload: unknown;
    try {
      rawPayload = await request.json();
    } catch {
      return jsonResponse<GenerateErrorResponse>(
        { success: false, error: "Payload JSON inválido.", code: "INVALID_JSON" },
        400
      );
    }

    const parsed = GeneratePayloadSchema.safeParse(rawPayload);
    if (!parsed.success) {
      return jsonResponse<GenerateErrorResponse>(
        {
          success: false,
          error: "Payload inválido: esquema estricto no satisfecho.",
          code: "SCHEMA_VALIDATION_FAILED",
        },
        422
      );
    }

    const payload: GeneratePayload = parsed.data;

    // Sanitización estricta de nombres y rutas (Blindaje S-Class Regla 14 & 15)
    const safeFilename = sanitizeFilename(payload.filename);
    const safeOutDir = resolveSafeOutDir(payload.outDir);

    const scriptPath = path.resolve(
      /*turbopackIgnore: true*/ ".",
      "scripts",
      "render_remotion_promo.cjs"
    );

    if (!fs.existsSync(scriptPath)) {
      return jsonResponse<GenerateErrorResponse>(
        {
          success: false,
          error: "Script de renderizado Remotion no encontrado.",
          code: "RENDER_SCRIPT_MISSING",
        },
        500
      );
    }

    tempPropsPath = path.join(
      os.tmpdir(),
      `remotion_job_${Date.now()}_${Math.random().toString(36).slice(2)}.json`
    );

    fs.writeFileSync(tempPropsPath, JSON.stringify(payload.props ?? {}), {
      encoding: "utf-8",
      mode: 0o600,
    });

    const targetFilePath = path.join(safeOutDir, safeFilename);
    const capturedTempPath = tempPropsPath;

    console.log(
      `[VIDEO_FACTORY_API] Disparando renderizado seguro hacia: ${targetFilePath}`
    );

    // Ejecución segura sin shell (evita inyección de comandos)
    execFile(
      "node",
      [
        scriptPath,
        "--propsFile",
        capturedTempPath,
        "--outDir",
        safeOutDir,
        "--filename",
        safeFilename,
      ],
      { timeout: 600_000, windowsHide: true, shell: false },
      (error, stdout, stderr) => {
        try {
          if (fs.existsSync(capturedTempPath)) fs.unlinkSync(capturedTempPath);
        } catch {
          /* noop */
        }

        if (error) {
          console.error("[VIDEO_FACTORY_RENDER_FAIL]", error.message, stderr);
          return;
        }
        console.log("[VIDEO_FACTORY_RENDER_SUCCESS]", stdout);
      }
    );

    return jsonResponse<GenerateSuccessResponse>(
      {
        success: true,
        message: "Renderizado Remotion S-Class disparado a 60 FPS en background.",
        ticketId: `VF-${Date.now()}`,
        outputFile: targetFilePath,
      },
      200
    );
  } catch (error: unknown) {
    if (tempPropsPath) {
      try {
        if (fs.existsSync(tempPropsPath)) fs.unlinkSync(tempPropsPath);
      } catch {
        /* noop */
      }
    }
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("[VIDEO_FACTORY_API_ERROR]", message);
    return jsonResponse<GenerateErrorResponse>(
      { success: false, error: message, code: "INTERNAL_ERROR" },
      500
    );
  }
}