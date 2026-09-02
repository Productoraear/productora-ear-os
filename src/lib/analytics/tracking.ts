
// src/lib/analytics/tracking.ts

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  console.log(`[EAR-ANALYTICS] Event: ${eventName}`, params);
  
  // Integración con GA4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }

  // Integración con Firebase Analytics (si está configurado)
  // logEvent(analytics, eventName, params);
};

export const trackPageView = (url: string) => {
  trackEvent('page_view', { page_path: url });
};

export class EARTracker {
  static trackConversion(value: number, currency: string = 'EUR') {
    trackEvent('purchase', { value, currency });
  }

  static trackLead(type: string) {
    trackEvent('generate_lead', { lead_type: type });
  }
}
