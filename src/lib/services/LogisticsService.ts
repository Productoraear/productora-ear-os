import { prisma } from '@/lib/prisma';

export interface EventLogistics {
  id: string;
  type: string;
  status: string;
  location: string;
  geoCoords: any;
  techArsenal: any[];
}

export class LogisticsService {
  /**
   * Obtiene todos los eventos activos con su equipamiento asociado.
   */
  static async getActiveEvents() {
    try {
      return await prisma.event.findMany({
        include: {
          techArsenal: true,
        },
        orderBy: {
          id: 'desc'
        }
      });
    } catch (error) {
      console.error('🛑 [LOGISTICS_SERVICE] Error al obtener eventos:', error);
      return [];
    }
  }

  /**
   * Obtiene el inventario global de equipamiento (Gear).
   */
  static async getGearInventory() {
    try {
      return await prisma.gear.findMany({
        include: {
          event: true
        }
      });
    } catch (error) {
      console.error('🛑 [LOGISTICS_SERVICE] Error al obtener inventario:', error);
      return [];
    }
  }

  /**
   * Actualiza el estatus de un evento.
   */
  static async updateEventStatus(eventId: string, status: string) {
    return await prisma.event.update({
      where: { id: eventId },
      data: { status }
    });
  }
}
