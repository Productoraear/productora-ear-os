import { NextResponse } from "next/server";
import * as fs from "fs/promises";
import * as path from "path";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("file");
  
  if (!fileName) return NextResponse.json({ content: "Archivo no especificado." }, { status: 400 });

  // Busca en el directorio de datos estático
  const filePath = path.join(process.cwd(), 'src/app/api/system/data', fileName);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: "Archivo clasificado o inexistente." }, { status: 404 });
  }
}