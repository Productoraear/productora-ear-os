import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * 🔒 RECLAMACIÓN S-CLASS DE PERFIL SOMBRA (CLAIM VERIFICATION)
 * Verifica un claimToken, asocia el Perfil Sombra al proveedor registrado y emite el escaparate.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { claimToken, userId, newEmail, companyName } = body;

    if (!claimToken) {
      return NextResponse.json({ error: 'Falta parámetro obligatorio: claimToken' }, { status: 400 });
    }

    const shadowProfile = await prisma.vendorShadowProfile.findUnique({
      where: { claimToken }
    });

    if (!shadowProfile) {
      return NextResponse.json({ error: 'Token de reclamación no encontrado o inválido.' }, { status: 404 });
    }

    if (shadowProfile.status === 'VERIFIED_ACTIVE') {
      return NextResponse.json({ error: 'Este perfil ya ha sido reclamado por su propietario.' }, { status: 400 });
    }

    // 1. Marcar Perfil Sombra como Reclamado (VERIFIED_ACTIVE)
    const updatedShadow = await prisma.vendorShadowProfile.update({
      where: { claimToken },
      data: {
        status: 'VERIFIED_ACTIVE',
      }
    });

    // 2. Crear o actualizar providerProfile en el ecosistema principal
    const providerSlug = shadowProfile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let provider = null;
    try {
      provider = await prisma.providerProfile.upsert({
        where: { slug: providerSlug },
        update: {
          name: shadowProfile.name,
          companyName: companyName || shadowProfile.name,
          isVerified: true,
          claimStatus: 'VERIFIED_ACTIVE',
          email: newEmail || null,
          userId: userId || null,
        },
        create: {
          slug: providerSlug,
          name: shadowProfile.name,
          companyName: companyName || shadowProfile.name,
          isVerified: true,
          claimStatus: 'VERIFIED_ACTIVE',
          email: newEmail || null,
          userId: userId || null,
          claimToken,
        }
      });
    } catch (err) {
      console.warn('⚠️ [CLAIM API] Provider Profile sync fallback:', err);
    }

    console.log(`✅ [CLAIM SUCCESS] Perfil ${shadowProfile.name} (${providerSlug}) reclamado con éxito.`);

    return NextResponse.json({
      success: true,
      claimedProfile: {
        slug: providerSlug,
        rawName: shadowProfile.name,
        isClaimed: true,
        status: 'VERIFIED_ACTIVE',
        providerId: provider?.id || null,
        redirectUrl: `/nexus/provider/${providerSlug}`
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('❌ [CLAIM VERIFY ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Error durante la reclamación de perfil' }, { status: 500 });
  }
}
