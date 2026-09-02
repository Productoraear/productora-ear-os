/**
 * 🛰️ EAR OS - S-CLASS SYSTEM LOGGER
 * Standardized isomorphic logger for server actions, API routes, and client telemetry.
 */

export const logger = {
  info: (message: any, ...meta: any[]) => {
    console.log(`[INFO] ${new Date().toISOString()} -`, message, ...meta);
  },
  warn: (message: any, ...meta: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} -`, message, ...meta);
  },
  error: (message: any, ...meta: any[]) => {
    console.error(`[ERROR] ${new Date().toISOString()} -`, message, ...meta);
  },
  debug: (message: any, ...meta: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} -`, message, ...meta);
    }
  },
};

export default logger;
