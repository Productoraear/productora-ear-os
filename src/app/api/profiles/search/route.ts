export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';

    if (!q || q.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Buscar perfiles de proveedores que NO estén reclamados todavía (userId === null)
    const profiles = await prisma.providerProfile.findMany({
      where: {
        name: {
          contains: q.trim(),
          mode: 'insensitive'
        },
        userId: null
      },
      select: {
        id: true,
        name: true,
        category: true,
        location: true,
        roiGuaranteeScore: true,
        slug: true
      },
      take: 20,
      orderBy: {
        roiGuaranteeScore: 'desc'
      }
    });

    return NextResponse.json(profiles);
  } catch (error: any) {
    console.error('🛑 [PROFILE_SEARCH_API_ERROR]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during profile search' },
      { status: 500 }
    );
  }
}
