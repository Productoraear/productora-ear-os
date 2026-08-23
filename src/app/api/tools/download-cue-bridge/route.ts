import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), "scripts", "install-ear-cue-bridge.ps1");
    
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json(
        { error: "Instalador no encontrado en el servidor." },
        { status: 404 }
      );
    }

    const fileBuffer = fs.readFileSync(scriptPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="install-ear-cue-bridge.ps1"',
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al descargar el instalador", details: error.message },
      { status: 500 }
    );
  }
}
