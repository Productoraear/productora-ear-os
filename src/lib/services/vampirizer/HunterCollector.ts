import { astraService } from '../ai/AstraService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🧛 HUNTER-COLLECTOR PROTOCOL (V121)
 * Motor de absorción de precios y dominancia geográfica.
 */
export class HunterCollector {
  /**
   * Procesa un fragmento de texto extraído de la competencia y devuelve un precio numérico puro.
   * Utiliza el oráculo Astra (Gemini 1.5) para eliminar el ruido.
   */
  async normalizePrice(rawText: string): Promise<number> {
    const prompt = `
      Analiza el siguiente texto de un proveedor de eventos: "${rawText}".
      Extrae el precio base en formato numérico puro (EUR). 
      Si el texto contiene un rango o frase como "Desde 1200€", extrae el valor mínimo.
      Si no se detecta ningún precio, devuelve 0.
      
      Responde EXCLUSIVAMENTE en JSON: {"price": number}
    `;
    
    try {
      const response = await astraService.generateResponse(prompt);
      return response.price || 0;
    } catch (error) {
      console.error("❌ PRICE_NORMALIZATION_ERROR:", error);
      return 0;
    }
  }

  /**
   * Ejecuta la vampirización sistemática por provincia.
   * Cruza el multiplicador de zona con el precio detectado en el mercado.
   */
  async vampirizeByProvince(provinceId: string) {
    const province = await prisma.province.findUnique({ 
      where: { id: provinceId.toUpperCase() } 
    });
    
    if (!province) {
      throw new Error(`PROVINCE_NOT_FOUND: ${provinceId}`);
    }

    const products = await prisma.marketService.findMany({
      where: { provinceGeoId: province.id }
    });

    console.log(`🧛 Iniciando vampirización en ${province.name} (${products.length} productos)...`);

    for (const product of products) {
      // [HUNTER MODO PREDADOR]: Simulación de extracción de tabla de precios
      // En producción, este texto vendría del crawler de Bodas.net/Manifiesto 005
      const rawCompetitorText = `Servicio ${product.name} en ${province.name} - Tarifas desde 1.450€ + IVA`; 
      
      const marketPrice = await this.normalizePrice(rawCompetitorText);
      
      // Aplicación del Multiplicador de Zona (Madrid x1.2, etc.)
      const earPrice = marketPrice * province.priceMultiplier;

      await prisma.marketService.update({
        where: { id: product.id },
        data: {
          marketAveragePrice: marketPrice,
          earDynamicPrice: earPrice,
          lastVampirized: new Date()
        }
      });
    }

    return { 
      status: "SUCCESS", 
      province: province.name, 
      productsProcessed: products.length 
    };
  }

  /**
   * Sincronización del Ledger de Stripe.
   * Detecta conceptos sin precio de mercado y ordena la búsqueda.
   */
  async syncStripeCatalog(stripeProducts: any[]) {
    console.log("🔗 Sincronizando catálogo de Stripe con el Marketplace Soberano...");
    
    for (const sp of stripeProducts) {
      await prisma.marketService.upsert({
        where: { stripeConceptId: sp.id },
        update: {
          name: sp.name,
        },
        create: {
          name: sp.name,
          stripeConceptId: sp.id,
          earDynamicPrice: sp.price || 0,
          category: sp.metadata?.category || "UNCATEGORIZED",
          provinceGeoId: "MADRID"
        }
      });
    }
  }
}

export const hunterCollector = new HunterCollector();
