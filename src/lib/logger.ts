type LogPayload = Record<string, any>;

/**
 * 📊 S-CLASS STRUCTURED LOGGER (FASE 205.GOD_MODE)
 * Proporciona un formato estructurado JSON unificado para el monitoreo forense de logs en Vercel,
 * asegurando cumplimiento de estándares de grado empresarial y erradicando logs amateur.
 */
export const logger = {
  info(payload: LogPayload) {
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp: new Date().toISOString(),
        ...payload,
      })
    );
  },
  warn(payload: LogPayload) {
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp: new Date().toISOString(),
        ...payload,
      })
    );
  },
  error(payload: LogPayload) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp: new Date().toISOString(),
        ...payload,
      })
    );
  },
};
