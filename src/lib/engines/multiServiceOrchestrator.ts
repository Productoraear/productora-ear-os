import { prisma } from '@/lib/prisma';
import { PriceLockEngine } from '@/features/finance/engine/PriceLockEngine';
import { ServiceCategory } from '@/types/multi-service';

export interface OrchestrationRequest {
  title: string;
  eventDate: string;
  clientEmail: string;
  clientName: string;
  location: string;
  services: {
    category: ServiceCategory;
    basePrice: number;
    name: string;
    requirements: string[];
    providerId?: string; // opcional, si ya se seleccionó uno
  }[];
}

export class MultiServiceOrchestrator {
  /**
   * Crea un ProductionEvent y las líneas de servicio asociadas dentro de una transacción ACID.
   * La bala de plata: Si alguna parte falla, nada se guarda.
   */
  public static async orchestrateProduction(req: OrchestrationRequest) {
    // 1. Calculamos el presupuesto total iterando por cada servicio y utilizando PriceLockEngine para coherencia,
    // aunque aquí solo queremos los splits y los montos base.
    let totalBudget = 0;
    const serviceLines = req.services.map(srv => {
      // Usamos el motor de pricing para calcular el split
      // Nota: Asumiremos valores por defecto para no requerir todos los params del price lock
      const quote = PriceLockEngine.generateQuote({
        baseAmount: srv.basePrice,
        eventDate: req.eventDate,
        clientEmail: req.clientEmail,
        location: req.location
      });

      totalBudget += quote.pricing.totalAmount;

      return {
        id: `srv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        category: srv.category,
        providerId: srv.providerId || null,
        name: srv.name,
        basePrice: srv.basePrice,
        providerSplit: quote.split.provider80,
        platformSplit: quote.split.earOs10,
        vimumeSplit: quote.split.vimume10,
        status: 'DRAFT',
        requirements: srv.requirements,
      };
    });

    // 2. Ejecutar Transacción ACID
    // La creación del evento de producción envuelve la inserción de las lógicas
    // En Prisma JSON fields, podemos guardar serviceLines como un JSON array.
    const result = await prisma.$transaction(async (tx) => {
      const production = await tx.productionEvent.create({
        data: {
          title: req.title,
          eventDate: new Date(req.eventDate),
          clientEmail: req.clientEmail,
          clientName: req.clientName,
          location: req.location,
          totalBudget: totalBudget,
          serviceLines: JSON.stringify(serviceLines), // Guardamos el array de servicios directamente en el JSON
          status: 'PENDING_PAYMENT',
        }
      });
      
      // Si el presupuesto requiriera sincronización con el Budget model existente:
      // (Podríamos crear un budget record aquí si fuera necesario)
      // Pero de acuerdo a las balas de plata, la transacción garantiza atomicity.
      
      return production;
    });

    return {
      success: true,
      productionId: result.id,
      totalBudget: result.totalBudget,
      servicesCount: serviceLines.length
    };
  }
}
