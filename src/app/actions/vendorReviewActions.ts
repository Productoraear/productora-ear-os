'use server';

/**
 * ⭐ VENDOR REVIEW ACTIONS — EAR OS S-CLASS
 * Módulo de Reputación Verificada & Generador de Enlaces WhatsApp.
 */

export interface VendorReviewItem {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  rating: number;
  comment: string;
  verified: boolean;
  replyText?: string;
  replyDate?: string;
}

// Store en memoria por proveedor
const reviewStore = new Map<string, VendorReviewItem[]>();

function getOrCreateStore(vendorSlug: string): VendorReviewItem[] {
  if (!reviewStore.has(vendorSlug)) {
    reviewStore.set(vendorSlug, [
      {
        id: 'REV-01',
        clientName: 'María & Carlos',
        eventDate: '2026-09-12',
        eventType: 'Boda en Finca La Gaivota',
        rating: 5,
        comment: 'La actuación de Edwin Agudelo en el cóctel fue sencillamente espectacular. Todos los invitados nos preguntaron por él. Sonido impecable Bose.',
        verified: true,
        replyText: '¡Muchísimas gracias María y Carlos! Fue un absoluto honor acompañaros en un día tan mágico.',
        replyDate: '2026-09-13'
      },
      {
        id: 'REV-02',
        clientName: 'Javier R.',
        eventDate: '2026-08-29',
        eventType: 'Aniversario Bodas de Plata',
        rating: 5,
        comment: 'Contratamos el pase mariachi homenaje y no hubo una sola persona que no se emocionase. Recomendable 100%.',
        verified: true
      }
    ]);
  }
  return reviewStore.get(vendorSlug)!;
}

/**
 * Obtiene el listado de reseñas del proveedor
 */
export async function getVendorReviewsAction(vendorSlug: string) {
  const reviews = getOrCreateStore(vendorSlug);
  const total = reviews.length;
  const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total) : 5.0;

  return {
    reviews,
    avgRating: parseFloat(avgRating.toFixed(1)),
    totalReviews: total
  };
}

/**
 * Genera un enlace directo codificado para pedir opinión por WhatsApp a una pareja
 */
export async function createReviewRequestAction(vendorSlug: string, clientName: string, phone: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://productoraear.com';
  const reviewLink = `${baseUrl}/resenas/nueva?vendor=${vendorSlug}&ref=${encodeURIComponent(clientName)}`;
  
  const text = `Hola ${clientName}, fue un placer actuar en vuestro evento. ¿Nos dejarías 1 minuto tu opinión sobre la música y el sonido? Tu valoración nos ayuda enormemente: ${reviewLink}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;

  return {
    success: true,
    whatsappUrl,
    reviewLink
  };
}

/**
 * Responde a una reseña del proveedor
 */
export async function respondToReviewAction(vendorSlug: string, reviewId: string, replyText: string) {
  const reviews = getOrCreateStore(vendorSlug);
  const review = reviews.find(r => r.id === reviewId);

  if (!review) {
    return { success: false, error: 'Reseña no encontrada.' };
  }

  review.replyText = replyText;
  review.replyDate = new Date().toISOString().split('T')[0];

  return { success: true, reviews };
}
