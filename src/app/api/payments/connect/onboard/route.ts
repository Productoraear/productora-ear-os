import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

/**
 * 🏦 STRIPE CONNECT ONBOARDING API ROUTE (P1-12)
 * 
 * Wrapper REST para la lógica de onboarding de Stripe Connect Express.
 * La Server Action canónica vive en stripeConnectActions.ts.
 * Este endpoint permite acceso desde el panel /admin/nexus para onboarding manual.
 * 
 * ⚠️ NO activa transferencias ni dispersión de fondos.
 *    Solo genera el enlace de onboarding KYC de Stripe.
 */

export async function POST(req: NextRequest) {
  try {
    const { providerId, email } = await req.json();

    if (!providerId || !email) {
      return NextResponse.json(
        { error: 'Se requiere providerId y email para onboarding de Stripe Connect' },
        { status: 400 }
      );
    }

    // 1. Verificar que el proveedor existe y está verificado
    const provider = await prisma.providerProfile.findUnique({
      where: { id: providerId },
      select: {
        id: true,
        name: true,
        isVerified: true,
        stripeAccountId: true,
        stripeConnected: true,
      },
    });

    if (!provider) {
      return NextResponse.json({ error: 'Proveedor no encontrado' }, { status: 404 });
    }

    if (!provider.isVerified) {
      logger.warn({ event: 'CONNECT_ONBOARD_REJECTED_UNVERIFIED', providerId });
      return NextResponse.json(
        { error: 'VETO: Solo proveedores verificados pueden iniciar onboarding bancario.' },
        { status: 403 }
      );
    }

    // 2. Si ya tiene cuenta Stripe, reusar
    let stripeAccountId = provider.stripeAccountId;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email,
        country: 'ES',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          earProviderId: providerId,
          providerName: provider.name,
        },
      });

      stripeAccountId = account.id;

      // Persistir el accountId en el perfil
      await prisma.providerProfile.update({
        where: { id: providerId },
        data: { stripeAccountId },
      });

      logger.info({
        event: 'CONNECT_ACCOUNT_CREATED',
        stripeAccountId,
        providerId,
      });
    }

    // 3. Generar Account Link para onboarding KYC
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.productoraear.com';

    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${baseUrl}/admin/nexus?connect=refresh`,
      return_url: `${baseUrl}/admin/nexus?connect=success&account_id=${stripeAccountId}`,
      type: 'account_onboarding',
    });

    logger.info({
      event: 'CONNECT_ONBOARDING_LINK_GENERATED',
      providerId,
      stripeAccountId,
    });

    return NextResponse.json({
      success: true,
      accountId: stripeAccountId,
      url: accountLink.url,
    });
  } catch (error: any) {
    logger.error({
      event: 'CONNECT_ONBOARD_ERROR',
      error: error.message,
    });
    return NextResponse.json(
      { error: error.message || 'Fallo interno en pasarela Connect' },
      { status: 500 }
    );
  }
}
