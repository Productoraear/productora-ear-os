import { NextResponse } from "next/server";
import { verifySsotIntegrity } from "@/lib/security/ssotIntegrityGuard";
import { execFile } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";

// Endpoint S-Class Blindado: Orquestador del Motor de Video Remotion a 60 FPS
// Blindaje contra inyección de comandos mediante execFile con paso de argumentos atómico
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { 
      props, 
      outDir = path.join(os.homedir(), 'Desktop'), 
      filename = `EAR_OS_MASTER_${Date.now()}.mp4` 
    } = payload;

    // Validación atómica de invariantes SSOT (Cero Simulaciones)
    const integrityCheck = verifySsotIntegrity();
    if (!integrityCheck.intact) {
      return NextResponse.json({ error: "Violación de Invariantes SSOT. Bloqueo Atómico." }, { status: 403 });
    }

    // Sanitización estricta de nombres y rutas (Blindaje S-Class Regla 14 & 15)
    const baseName = typeof filename === "string" ? filename.replace(/\.mp4$/i, "") : `EAR_OS_${Date.now()}`;
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_\-\.]/g, "_");
    const safeFilename = `${sanitizedBase}.mp4`;

    const rawOutDir = typeof outDir === "string" ? outDir : path.join(os.homedir(), 'Desktop');
    const safeOutDir = path.resolve(rawOutDir);

    const scriptPath = path.resolve(/*turbopackIgnore: true*/ '.', 'scripts', 'render_remotion_promo.cjs');
    const tempPropsPath = path.join(os.tmpdir(), `remotion_job_${Date.now()}_${Math.random().toString(36).slice(2)}.json`);
    fs.writeFileSync(tempPropsPath, JSON.stringify(props || {}), "utf-8");

    const targetFilePath = path.join(safeOutDir, safeFilename);

    console.log(`[VIDEO_FACTORY_API] Disparando renderizado seguro hacia: ${targetFilePath}`);

    // Ejecución segura sin shell (evita inyección de comandos)
    execFile(
      "node",
      [scriptPath, "--propsFile", tempPropsPath, "--outDir", safeOutDir, "--filename", safeFilename],
      { timeout: 600000 },
      (error, stdout, stderr) => {
        try {
          if (fs.existsSync(tempPropsPath)) fs.unlinkSync(tempPropsPath);
        } catch (_) {}

        if (error) {
          console.error("[VIDEO_FACTORY_RENDER_FAIL]", error, stderr);
          return;
        }
        console.log("[VIDEO_FACTORY_RENDER_SUCCESS]", stdout);
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Renderizado Remotion S-Class disparado a 60 FPS en background.", 
      ticketId: `VF-${Date.now()}`,
      outputFile: targetFilePath
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("[VIDEO_FACTORY_API_ERROR]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
