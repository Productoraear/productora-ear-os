/**
 * @file opalEngine.ts
 * @description Micro-servicio Matriz OPAL (Oportunidad, Precio, Autoridad, Legado).
 * Sistema de evaluación algorítmica para la toma de decisiones en EAR-OS.
 */

export interface OpalMetrics {
  opportunity: number; // 0-100
  price: number;       // 0-100
  authority: number;   // 0-100
  legacy: number;      // 0-100
}

export interface OpalScore {
  total: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'F';
  analysis: string;
  recommendations: string[];
}

export class OpalEngine {
  /**
   * @method calculate
   * @description Procesa los 4 pilares para generar un score unificado.
   */
  static calculate(metrics: OpalMetrics): OpalScore {
    const { opportunity, price, authority, legacy } = metrics;
    
    // Pesos estratégicos (S-Class Standard)
    const weights = {
      opportunity: 0.35, // El timing es crítico
      price: 0.25,       // Rentabilidad inmediata
      authority: 0.20,   // Validación social
      legacy: 0.20       // Valor a largo plazo
    };

    const total = (
      opportunity * weights.opportunity +
      price * weights.price +
      authority * weights.authority +
      legacy * weights.legacy
    );

    let grade: OpalScore['grade'] = 'F';
    let analysis = "";
    const recommendations: string[] = [];

    if (total >= 90) {
      grade = 'S';
      analysis = "Dominancia Absoluta. El activo posee una ventaja injusta masiva.";
      recommendations.push("Ejecución inmediata.", "Escalar presupuesto al 200%.");
    } else if (total >= 75) {
      grade = 'A';
      analysis = "Alta Viabilidad. Activo de clase alta con fuerte potencial de retorno.";
      recommendations.push("Asegurar contratos.", "Optimizar embudo de conversión.");
    } else if (total >= 50) {
      grade = 'B';
      analysis = "Riesgo Moderado. Requiere cimentación en autoridad o legado.";
      recommendations.push("Aumentar presencia social.", "Refinar estructura de precios.");
    } else if (total >= 30) {
      grade = 'C';
      analysis = "Inestable. Los fundamentos son débiles.";
      recommendations.push("Pivotar estrategia.", "Auditoría de activos necesaria.");
    } else {
      grade = 'F';
      analysis = "Drenaje de Recursos. No cumple con los estándares EAR.";
      recommendations.push("Descartar proyecto.", "Reasignar capital a verticales HOT.");
    }

    return {
      total: parseFloat(total.toFixed(2)),
      grade,
      analysis,
      recommendations
    };
  }

  /**
   * @method getGlobalHealth
   * @description Simula o recupera la salud global del sistema basada en el consolidado.
   */
  static getGlobalHealth() {
    // Valores estandarizados basados en el estado actual de la productora
    return {
      opportunity: 85, // Alta demanda por EAR OS Alpha
      price: 70,       // Estructura de cobro en fase de test
      authority: 92,   // Legitimidad del Comandante y 52 sesiones
      legacy: 60       // Escalabilidad en construcción
    };
  }
}
