// app/api/budget/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, expenseId, categoryId, amount, paymentDate, dueDate, status, notes } = body;

    const payment = await prisma.payment.create({
      data: {
        budgetId,
        expenseId,
        categoryId,
        amount,
        paymentDate: new Date(paymentDate),
        dueDate: dueDate ? new Date(dueDate) : null,
        status,
        notes,
      },
      include: {
        expense: true,
      },
    });

    if (status === 'COMPLETED') {
      // Update category paid amount
      if (categoryId) {
        await prisma.budgetCategory.update({
          where: { id: categoryId },
          data: {
            paidAmount: { increment: amount },
            pendingAmount: { decrement: amount },
          },
        });
      }

      // Update budget totals
      await prisma.budget.update({
        where: { id: budgetId },
        data: {
          paidAmount: { increment: amount },
          pendingAmount: { decrement: amount },
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