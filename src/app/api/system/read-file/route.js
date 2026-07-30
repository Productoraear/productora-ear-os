import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("file");
    if (!fileName)
        return NextResponse.json({ content: "Archivo no especificado." }, { status: 400 });
    // Busca en la raíz del proyecto
    const filePath = path.join(process.cwd(), fileName);
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            return NextResponse.json({ content });
        }
        else {
            return NextResponse.json({ content: "Archivo clasificado o inexistente." }, { status: 404 });
        }
    }
    catch (error) {
        return NextResponse.json({ content: "Error de lectura forense." }, { status: 500 });
    }
}
