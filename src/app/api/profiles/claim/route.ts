export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { profileId, userId } = await request.json();

    if (!profileId || !userId) {
      return NextResponse.json(
        { error: 'Missing profileId or userId in request body' },
        { status: 400 }
      );
    }

    // 1. Verificar existencia del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: `User with ID "${userId}" not found in database` },
        { status: 404 }
      );
    }

    // 2. Verificar existencia del perfil de proveedor
    const profile = await prisma.providerProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) {
      return NextResponse.json(
        { error: `Provider profile with ID "${profileId}" not found` },
        { status: 404 }
      );
    }

    // 3. Comprobar si ya está reclamado
    if (profile.userId) {
      if (profile.userId === userId) {
        return NextResponse.json(
          { message: 'You have already claimed this profile.', profile },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: 'This profile has already been claimed by another user.' },
        { status: 409 }
      );
    }

    // 4. Ejecución atómica y segura de la reclamación en una transacción Prisma
    const updatedProfile = await prisma.$transaction(async (tx) => {
      // Enlazar perfil
      const updated = await tx.providerProfile.update({
        where: { id: profileId },
        data: { userId: userId }
      });

      // Ascender rol del usuario a PROVIDER (solo si no es ya ADMIN o COMMANDER)
      const rolesToRetain = ['ADMIN', 'COMMANDER', 'OPERADOR', 'FLEET_OPERATOR'];
      if (!rolesToRetain.includes(user.role)) {
        await tx.user.update({
          where: { id: userId },
          data: { 
            role: 'PROVIDER' as Role,
            rank: 'NIVEL_1_PROVEEDOR' // Ascenso en rango S-Class
          }
        });
      }

      return updated;
    });

    console.log(`✅ [PROFILE_CLAIM_ENGINE] Perfil "${profile.name}" reclamado con éxito por el usuario ${user.email || userId}`);

    return NextResponse.json({
      success: true,
      message: `Profile "${profile.name}" successfully claimed!`,
      profile: updatedProfile
    }, { status: 200 });

  } catch (error: any) {
    console.error('🛑 [PROFILE_CLAIM_CRITICAL_ERROR]:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({
      error: 'Internal Server Error during profile claim process',
      details: error.message
    }, { status: 500 });
  }
}
