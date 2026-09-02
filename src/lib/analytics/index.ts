
// src/lib/analytics/index.ts

import { trackPageView } from './tracking';

export const initAnalytics = () => {
  console.log('[EAR-ANALYTICS] Inicializando sistema de métricas blindado...');
  
  if (typeof window !== 'undefined') {
    trackPageView(window.location.pathname);
  }
};

export * from './tracking';
export * from './live-feed';
