import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, expenseId, categoryId, amount, paymentDate, dueDate, status, notes } = body;
    const parsedAmount = Number(amount);

    const payment = await prisma.payment.create({
      data: {
        budgetId,
        expenseId: expenseId || null,
        categoryId: categoryId || null,
        amount: parsedAmount,
        paymentDate: new Date(paymentDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'PENDING',
        notes: notes || null,
      },
      include: {
        expense: true,
      },
    });

    if (status === 'COMPLETED') {
      if (categoryId) {
        await prisma.budgetCategory.update({
          where: { id: categoryId },
          data: {
            paidAmount: { increment: parsedAmount },
            pendingAmount: { decrement: parsedAmount },
          },
        });
      }

      await prisma.budget.update({
        where: { id: budgetId },
        data: {
          paidAmount: { increment: parsedAmount },
          pendingAmount: { decrement: parsedAmount },
        },
      });
    }

    revalidatePath('/budget');
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Error al crear pago' }, { status: 500 });
  }
}

