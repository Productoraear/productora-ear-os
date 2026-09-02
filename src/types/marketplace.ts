/**
 * 🏺 MARKETPLACE CONTRACTS - S-CLASS FEEDBACK LOOP
 */

export type MarketplaceEventType = 
  | 'search_submitted' 
  | 'filter_changed' 
  | 'card_impression' 
  | 'card_clicked' 
  | 'shortlist_added' 
  | 'shortlist_removed' 
  | 'lead_started';

export interface MarketplaceEvent {
  type: MarketplaceEventType;
  timestamp: string;
  sessionId: string;
  payload: {
    occasion?: string;
    province?: string;
    date?: string;
    serviceId?: string;
    cardPosition?: number;
    badgeId?: string;
    query?: string;
    priceSnapshot?: number;
    path: string;
    metadata?: any;
  };
}

export interface ShortlistItem {
  id: string;
  serviceId: string;
  title: string;
  price: string;
  addedAt: string;
}

export interface MarketplaceAnalytics {
  topOccasions: { slug: string; count: number }[];
  topProvinces: { slug: string; count: number }[];
  cardPerformance: Record<string, { impressions: number; clicks: number; saves: number }>;
  orphanedHubs: string[]; // Hubs con tráfico pero 0 interacción
}
