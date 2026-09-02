/**
 * 🛰️ MARKETPLACE FEEDBACK SERVICE - S-CLASS SIGNAL COLLECTOR
 */

import { MarketplaceEvent, MarketplaceEventType } from '@/types/marketplace';

class MarketplaceFeedbackService {
  private static instance: MarketplaceFeedbackService;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): MarketplaceFeedbackService {
    if (!MarketplaceFeedbackService.instance) {
      MarketplaceFeedbackService.instance = new MarketplaceFeedbackService();
    }
    return MarketplaceFeedbackService.instance;
  }

  private generateSessionId(): string {
    if (typeof window === 'undefined') return 'server-side';
    let id = localStorage.getItem('ear_os_market_session');
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('ear_os_market_session', id);
    }
    return id;
  }

  public track(type: MarketplaceEventType, payload: Partial<MarketplaceEvent['payload']>) {
    const event: MarketplaceEvent = {
      type,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      payload: {
        path: typeof window !== 'undefined' ? window.location.pathname : '',
        ...payload
      }
    };

    // 🔬 Debug Log
    if (process.env.NODE_ENV === 'development') {
      console.log(`[MARKETPLACE_FEEDBACK] ${type}:`, event);
    }
    
    // 🛰️ REAL-TIME INGESTION (Fire & Forget)
    if (typeof window !== 'undefined') {
      fetch('/api/telemetry/marketplace', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event) 
      }).catch(err => console.error("Signal Ingestion Failed", err));
    }
  }
}

export const marketplaceFeedback = MarketplaceFeedbackService.getInstance();
