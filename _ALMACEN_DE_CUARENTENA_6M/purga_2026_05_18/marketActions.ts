'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🌊 MARKETPLACE SERVER ACTIONS (V121)
 * Recuperación dinámica de precios por arbitraje geográfico.
 */

export async function getMarketPrice(serviceName: string, provinceId: string = "MADRID") {
  try {
    const service = await prisma.marketService.findFirst({
      where: {
        name: { contains: serviceName, mode: 'insensitive' },
        provinceGeoId: provinceId.toUpperCase()
      }
    });

    if (!service) {
      // Fallback a precio base si no hay dato vampirizado específico
      return {
        price: 0,
        currency: "EUR",
        status: "FALLBACK"
      };
    }

    return {
      price: service.earDynamicPrice,
      marketAverage: service.marketAveragePrice,
      currency: "EUR",
      status: "S-CLASS_AUTHORITY",
      lastUpdated: service.lastVampirized
    };
  } catch (error) {
    console.error("❌ MARKET_ACTION_ERROR:", error);
    return { error: true, message: "No se pudo recuperar el precio de mercado." };
  }
}

export async function listMarketServices(category: string, provinceId: string = "MADRID") {
  try {
    return await prisma.marketService.findMany({
      where: {
        category: category,
        provinceGeoId: provinceId.toUpperCase()
      },
      orderBy: { earDynamicPrice: 'asc' },
      take: 20
    });
  } catch (error) {
    console.error("❌ MARKET_LIST_ERROR:", error);
    return [];
  }
}
