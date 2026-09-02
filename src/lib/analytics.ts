
/**
 * EAR OS - ANALYTICS NEURAL
 * Configuración de tracking para optimización de conversiones S-Class.
 */

// NOTA: Requiere instalación de 'react-ga4'
// npm install react-ga4

import ReactGA from 'react-ga4';

export const EVENTS = {
  JOURNEY_STARTED: 'journey_started',
  JOURNEY_STEP_COMPLETED: 'journey_step_completed',
  MATCH_VIEWED: 'match_viewed',
  CONTACT_CLICKED: 'contact_clicked',
  SCLASS_MODAL_OPENED: 'sclass_modal_opened',
  ROLE_SELECTED: 'role_selected',
  CHECKOUT_INITIATED: 'checkout_initiated', // Inyectado para control S-Class
  PURCHASE_COMPLETED: 'purchase_completed',  // Inyectado para control S-Class
};

/**
 * Inicializa el motor de analytics.
 */
export const initAnalytics = (id: string = 'G-XXXXXXXXXX') => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(id);
    console.log("[ANALYTICS] Motor activado: Status Online.");
  }
};

/**
 * Envía un evento personalizado al War Room.
 */
export const trackNeuralEvent = (event: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    ReactGA.event({
      category: 'EAR_OS_NEURAL',
      action: event,
      label: params.label || 'Default',
      ...params
    });
    console.log(`[NEURAL_EVENT] Transmisión enviada: ${event}`, params);
  }
};
