import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let budget = await prisma.budget.findFirst({
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            expenses: {
              orderBy: { date: 'desc' },
            },
          },
        },
        expenses: {
          orderBy: { date: 'desc' },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
        },
      },
    });

    if (!budget) {
      const cleanCategories = [
        { name: 'Ceremonia & Protocolo', estimatedCost: 0, order: 1, icon: '💍', color: '#ecb613' },
        { name: 'Espacio / Finca', estimatedCost: 0, order: 2, icon: '🏰', color: '#a855f7' },
        { name: 'Catering & Banquete', estimatedCost: 0, order: 3, icon: '🍽️', color: '#f59e0b' },
        { name: 'Música & Sonorización Bose', estimatedCost: 0, order: 4, icon: '🎙️', color: '#ecb613' },
        { name: 'Foto & Vídeo Cinematográfico', estimatedCost: 0, order: 5, icon: '📸', color: '#3b82f6' },
        { name: 'Flores & Decoración', estimatedCost: 0, order: 6, icon: '🌸', color: '#ec4899' },
        { name: 'Iluminación & Efectos Especiales', estimatedCost: 0, order: 7, icon: '✨', color: '#8b5cf6' },
        { name: 'Novia & Complementos', estimatedCost: 0, order: 8, icon: '👰', color: '#f43f5e' },
        { name: 'Novio & Sastrería', estimatedCost: 0, order: 9, icon: '🤵', color: '#06b6d4' },
        { name: 'Joyería & Alianzas', estimatedCost: 0, order: 10, icon: '💎', color: '#10b981' },
        { name: 'Invitaciones & Papelería', estimatedCost: 0, order: 11, icon: '💌', color: '#eab308' },
        { name: 'Transporte VIP / Cuadrillas', estimatedCost: 0, order: 12, icon: '🚗', color: '#6366f1' },
        { name: 'Luna de Miel & Experiencias', estimatedCost: 0, order: 13, icon: '✈️', color: '#14b8a6' },
      ];

      budget = await prisma.budget.create({
        data: {
          totalBudget: 0,
          finalCost: 0,
          paidAmount: 0,
          pendingAmount: 0,
          categories: {
            create: cleanCategories,
          },
        },
        include: {
          categories: {
            include: {
              expenses: true,
            },
          },
          expenses: true,
          payments: true,
        },
      });
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Error al obtener presupuesto' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { budgetId, totalBudget } = body;

    const budget = await prisma.budget.update({
      where: { id: budgetId },
      data: { totalBudget: Number(totalBudget) },
      include: {
        categories: {
          include: { expenses: true }
        },
        expenses: true,
        payments: true
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Error al actualizar presupuesto' }, { status: 500 });
  }
}
