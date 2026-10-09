import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Endpoint S-Class Blindado: Stream de Medios (Videos MP4/WEBM, Audio MP3/WAV)
// Soporta HTTP 206 Partial Content, scrubbing Remotion, whitelisting de rutas y cabeceras de seguridad
const ALLOWED_ROOTS = [
  path.normalize(path.join("H:", "ComfyUI", "output")),
  path.normalize(path.join("D:", "BRUTOS_AUDIO")),
  path.normalize(path.join("D:", "01_PRODUCCION_AUDIO")),
  path.normalize(path.join(process.cwd(), "public")),
  path.normalize(path.join(process.cwd(), "src", "remotion")),
];

const ALLOWED_EXTENSIONS = new Set([
  ".mp4", ".webm", ".mov", ".mkv",
  ".mp3", ".wav", ".ogg", ".flac", ".aac",
  ".png", ".jpg", ".jpeg", ".webp"
]);

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePathParam = searchParams.get("file");

    if (!filePathParam) {
      return NextResponse.json({ error: "Parámetro 'file' es requerido" }, { status: 400 });
    }

    // Resolver ruta segura
    let targetPath = path.isAbsolute(filePathParam)
      ? filePathParam
      : path.join("H:", "ComfyUI", "output", filePathParam);

    targetPath = path.resolve(targetPath);

    // Fallback relativo a public si no existe en la ruta primaria
    if (!fs.existsSync(targetPath)) {
      const publicPath = path.resolve(process.cwd(), "public", filePathParam);
      if (fs.existsSync(publicPath)) {
        targetPath = publicPath;
      } else {
        return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
      }
    }

    // 1. Blindaje S-Class: Comprobación de Whitelist de Directorios (Anti-Path Traversal)
    const isAllowedRoot = ALLOWED_ROOTS.some((root) => targetPath.toLowerCase().startsWith(root.toLowerCase()));
    if (!isAllowedRoot) {
      console.warn(`[SECURITY_BLINDAJE] Acceso denegado fuera de raíces permitidas: ${targetPath}`);
      return NextResponse.json({ error: "Acceso no autorizado al recurso solicitado" }, { status: 403 });
    }

    // 2. Blindaje S-Class: Whitelist de Extensiones Multimedia
    const ext = path.extname(targetPath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: `Tipo de archivo '${ext}' no admitido para streaming` }, { status: 403 });
    }

    const stat = fs.statSync(targetPath);
    const fileSize = stat.size;
    const range = request.headers.get("range");

    // Determinar Content-Type
    let contentType = "application/octet-stream";
    if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".webm") contentType = "video/webm";
    else if (ext === ".mov") contentType = "video/quicktime";
    else if (ext === ".mp3") contentType = "audio/mpeg";
    else if (ext === ".wav") contentType = "audio/wav";
    else if (ext === ".ogg") contentType = "audio/ogg";
    else if (ext === ".flac") contentType = "audio/flac";
    else if (ext === ".aac") contentType = "audio/aac";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".webp") contentType = "image/webp";

    const baseHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=3600",
    };

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      const fileStream = fs.createReadStream(targetPath, { start, end });
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
        },
      });
    } else {
      const fileStream = fs.createReadStream(targetPath);
      const stream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          ...baseHeaders,
          "Content-Length": fileSize.toString(),
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
        },
      });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al transmitir archivo";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
