import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dbVendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
    });

    let catalogueVendors: Array<{ id: string; name: string; category: string; phone?: string; email?: string }> = [];
    const ssotPath = path.join(process.cwd(), 'src/data/vampirized_providers.json');

    if (fs.existsSync(ssotPath)) {
      try {
        const raw = fs.readFileSync(ssotPath, 'utf-8');
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : (parsed.providers || []);
        
        catalogueVendors = list.slice(0, 300).map((v: any) => ({
          id: v.id || v.slug || String(Math.random()),
          name: v.name || 'Proveedor Verificado EAR',
          category: v.category || v.vertical || 'General',
          phone: v.phone || undefined,
          email: v.email || undefined,
          notes: 'Homologado en Catálogo EAR OS'
        }));
      } catch (e) {
        console.error('Error reading vampirized providers for budget:', e);
      }
    }

    const merged = [
      ...dbVendors,
      ...catalogueVendors.filter(cv => !dbVendors.some(dv => dv.name.toLowerCase() === cv.name.toLowerCase()))
    ];

    return NextResponse.json(merged);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json([], { status: 200 });
  }
}
