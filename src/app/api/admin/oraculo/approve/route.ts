import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { target } = await req.json();
        
        if (!['bio', 'obj'].includes(target)) {
            return NextResponse.json({ error: 'Target no válido' }, { status: 400 });
        }
        
        const basePath = path.join(process.cwd(), 'src', 'data');
        
        let draftPath = '';
        let prodPath = '';
        
        if (target === 'bio') {
            draftPath = path.join(basePath, 'edwin-true-bio-ssot_draft.json');
            prodPath = path.join(basePath, 'edwin-true-bio-ssot.json');
        } else {
            draftPath = path.join(basePath, 'oraculo-300-objeciones-ssot_draft.json');
            prodPath = path.join(basePath, 'oraculo-300-objeciones-ssot.json');
        }
        
        try {
            await fs.access(draftPath);
        } catch {
            return NextResponse.json({ error: 'Borrador no encontrado' }, { status: 404 });
        }
        
        const raw = await fs.readFile(draftPath, 'utf-8');
        const data = JSON.parse(raw);
        data.status = 'PRODUCTION';
        
        await fs.writeFile(prodPath, JSON.stringify(data, null, 2), 'utf-8');
        await fs.unlink(draftPath);
        
        revalidatePath('/artistas/edwin-agudelo');
        revalidatePath('/vimume');
        revalidatePath('/admin/oraculo/aprobaciones');
        
        return NextResponse.json({ success: true, message: `Borrador ${target} sellado a Producción.` });
        
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
