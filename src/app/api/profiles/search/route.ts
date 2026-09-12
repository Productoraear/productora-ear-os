export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const province = searchParams.get('province');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '24', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category && category !== 'ALL') where.category = { contains: category, mode: 'insensitive' };
    if (province && province !== 'ALL') where.province = { contains: province, mode: 'insensitive' };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { municipality: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [total, providers] = await Promise.all([
      prisma.vendorShadowProfile.count({ where }),
      prisma.vendorShadowProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { reviewsCount: 'desc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      providers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error en búsqueda' },
      { status: 500 }
    );
  }
}
