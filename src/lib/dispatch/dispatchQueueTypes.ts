/**
 * 🚖 DISPATCH QUEUE TYPES — CONTRATO TIPADO ÚNICO DEL DISPATCHER UBER/AIRBNB
 * -------------------------------------------------------------------------
 * Fuente de verdad del "Mando de Asignación de Artistas, Portes y Rutas".
 * La cola se materializa en `GET /api/admin/dispatch` leyendo de PostgreSQL:
 *   - `ProductionEvent` → producciones selladas/confirmadas.
 *   - `VendorBooking`   → reservas gestionadas por proveedores homologados.
 *
 * Regla S-Class: cero `any`. Los campos que la BD no registra se marcan `null`
 * (jamás se inventa un valor) y la UI los representa como "N/D".
 */

export type DispatchStatus =
  | 'DISPATCHED'
  | 'PENDING_ASSIGNMENT'
  | 'EN_RUTA'
  | 'LOCKED_ACID';

export type DispatchQueueSource = 'PRODUCTION' | 'VENDOR_BOOKING';

export interface DispatchQueueItem {
  /** Identificador estable de la fila origen (ProductionEvent.id | VendorBooking.id). */
  id: string;
  /** Origen de la fila para trazabilidad forense. */
  source: DispatchQueueSource;
  eventName: string;
  clientName: string;
  clientPhone: string;
  /** Fecha ISO 8601 del evento. */
  eventDate: string;
  location: string;
  /** Distancia desde Hub Méntrida (km 0). `null` si la BD no la registra. */
  distanceKmFromMentrida: number | null;
  assignedArtist: string;
  status: DispatchStatus;
  totalEur: number;
  depositPaidEur: number;
  /** Presión sonora esperada en dBA. `null` si no consta en origen. */
  soundDba: number | null;
  hotelRequired: boolean;
}

export interface DispatchQueueResponse {
  success: boolean;
  count: number;
  items: DispatchQueueItem[];
  error?: string;
}
