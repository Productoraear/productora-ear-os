// app/api/budget/expenses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, categoryId, description, amount, date, vendorId, notes } = body;

    const expense = await prisma.expense.create({
      data: {
        budgetId,
        categoryId,
        description,
        amount,
        date: new Date(date),
        vendorId,
        notes,
      },
      include: {
        category: true,
      },
    });

    // Update category totals
    await prisma.budgetCategory.update({
      where: { id: categoryId },
      data: {
        finalCost: {
          increment: amount,
        },
      },
    });

    // Update budget totals
    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        finalCost: {
          increment: amount,
        },
      },
    });

    revalidatePath('/budget');
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 });
  }
}