// app/api/budget/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/prisma';

export async function GET() {
  try {
    const budget = await prisma.budget.findFirst({
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
      // Create default budget with categories
      const defaultCategories = [
        { name: 'Ceremonia', estimatedCost: 1225, order: 1, icon: '💍', color: '#F59E0B' },
        { name: 'Banquete', estimatedCost: 139338, order: 2, icon: '🍽️', color: '#EF4444' },
        { name: 'Música', estimatedCost: 10663, order: 3, icon: '🎵', color: '#8B5CF6' },
        { name: 'Invitaciones', estimatedCost: 3112, order: 4, icon: '💌', color: '#EC4899' },
        { name: 'Detalles de boda', estimatedCost: 3275, order: 5, icon: '🎁', color: '#14B8A6' },
        { name: 'Flores y Decoración', estimatedCost: 7775, order: 6, icon: '🌸', color: '#F472B6' },
        { name: 'Foto y Vídeo', estimatedCost: 18038, order: 7, icon: '📸', color: '#6366F1' },
        { name: 'Transporte', estimatedCost: 8188, order: 8, icon: '🚗', color: '#3B82F6' },
        { name: 'Joyería', estimatedCost: 5488, order: 9, icon: '💎', color: '#A855F7' },
        { name: 'Novia y Complementos', estimatedCost: 14513, order: 10, icon: '👰', color: '#EC4899' },
        { name: 'Novio y Complementos', estimatedCost: 7972, order: 11, icon: '🤵', color: '#3B82F6' },
        { name: 'Belleza y Salud', estimatedCost: 1726, order: 12, icon: '💄', color: '#F59E0B' },
        { name: 'Viaje de Novios', estimatedCost: 28687, order: 13, icon: '✈️', color: '#10B981' },
      ];

      const newBudget = await prisma.budget.create({
        data: {
          totalBudget: 250000,
          categories: {
            create: defaultCategories,
          },
        },
        include: {
          categories: true,
        },
      });

      return NextResponse.json(newBudget);
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
      data: { totalBudget },
      include: {
        categories: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Error al actualizar presupuesto' }, { status: 500 });
  }
}