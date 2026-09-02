import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, categoryId, description, amount, date, vendorId, notes } = body;

    const parsedAmount = Number(amount);

    const expense = await prisma.expense.create({
      data: {
        budgetId,
        categoryId,
        description,
        amount: parsedAmount,
        date: new Date(date),
        vendorId: vendorId || null,
        notes: notes || null,
      },
      include: {
        category: true,
      },
    });

    await prisma.budgetCategory.update({
      where: { id: categoryId },
      data: {
        finalCost: { increment: parsedAmount },
      },
    });

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        finalCost: { increment: parsedAmount },
      },
    });

    revalidatePath('/budget');
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 });
  }
}

