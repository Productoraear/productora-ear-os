// app/api/budget/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, name, estimatedCost, icon, color } = body;

    const category = await prisma.budgetCategory.create({
      data: {
        budgetId,
        name,
        estimatedCost,
        icon,
        color,
        order: 999,
      },
      include: {
        expenses: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}