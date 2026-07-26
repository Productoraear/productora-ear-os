/**
 * 🔮 ASTRA PREDICTIVE AI ENGINE - SOVEREIGN RAG CORE
 * Evaluates transport risk, pricing dynamics, and local demand splits.
 */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-1.5-flash";
export interface AstraPredictionInput {
  origin: string;
  destination: string;
  eventDate: string | Date;
  providerId?: string;
  historicalWaybills?: any[];
  historicalWalletMoves?: any[];
}
export interface AstraPredictionOutput {
  baseDemandScore: number;
  geoPriceMultiplier: number;
  riskScore: number;
  recommendedTotalAmount: number;
  explanation: string;
  confidenceScore: number;
  warningMessage?: string;
}
/**
 * 🧮 S-CLASS ANALYTICAL FALLBACK
 * Computes a highly reliable, deterministic base estimate when Gemini API is offline.
 */
function runAnalyticalFallback(input: AstraPredictionInput): AstraPredictionOutput {
  const date = new Date(input.eventDate);
  const month = date.getMonth(); // 0-11
  const day = date.getDay(); // 0-6
  // 1. Seasonality Multiplier (Peak: Jun, Jul, Aug, Sep; High: Saturday/Sunday)
  let baseDemandScore = 0.4;
  if ([5, 6, 7, 8].includes(month)) {
    baseDemandScore += 0.3; // Summer peak
  }
  if ([0, 6].includes(day)) {
    baseDemandScore += 0.2; // Weekend high
  }
  // 2. Geographic Price Multiplier (Based on text clues if exact coordinates are missing)
  let geoPriceMultiplier = 1.0;
  const lowercaseDest = input.destination.toLowerCase();
  const lowercaseOrigin = input.origin.toLowerCase();
  // If long distance (different provinces or islands)
  if (
    (lowercaseDest.includes("ibiza") || lowercaseDest.includes("palma") || lowercaseDest.includes("baleares") || lowercaseDest.includes("canarias")) &&
    !(lowercaseOrigin.includes("ibiza") || lowercaseOrigin.includes("palma"))
  ) {
    geoPriceMultiplier = 2.2; // High island tariff multiplier
  } else if (
    (lowercaseDest.includes("madrid") && lowercaseOrigin.includes("barcelona")) ||
    (lowercaseDest.includes("barcelona") && lowercaseOrigin.includes("madrid"))
  ) {
    geoPriceMultiplier = 1.5; // Inter-city highway corridor
  } else if (lowercaseDest !== lowercaseOrigin) {
    geoPriceMultiplier = 1.25; // Inter-provincial standard
  }
  // 3. Logistics Risk Score
  let riskScore = 0.15;
  if (geoPriceMultiplier > 1.8) {
    riskScore += 0.4; // High maritime/aerial transport risk
  }
  if (baseDemandScore > 0.8) {
    riskScore += 0.25; // High congestion / low fleet availability risk
  }
  // 4. Base Heuristic Price Recommendation
  const estimatedKm = geoPriceMultiplier > 2.0 ? 350 : 120;
  const baseCost = 150 + estimatedKm * 1.2;
  const recommendedTotalAmount = Number((baseCost * geoPriceMultiplier * (1 + riskScore * 0.25)).toFixed(2));
  // 5. Confidence Score (based on historical data availability)
  const historyWeight = (input.historicalWaybills?.length || 0) * 0.1;
  const confidenceScore = Math.min(0.5 + historyWeight, 0.95);
  const output: AstraPredictionOutput = {
    baseDemandScore: Number(baseDemandScore.toFixed(2)),
    geoPriceMultiplier: Number(geoPriceMultiplier.toFixed(2)),
    riskScore: Number(riskScore.toFixed(2)),
    recommendedTotalAmount,
    explanation: `Estimación heurística determinista ASTRA en base a distancias zonales aproximadas, estacionalidad del mes (${month + 1}) y el día de la semana (${day}). Alta demanda detectada en temporada de bodas.`,
    confidenceScore: Number(confidenceScore.toFixed(2))
  };
  if (confidenceScore < 0.6) {
    output.warningMessage = "Nivel de confianza predictiva bajo debido al tamaño limitado del historial transaccional de flotas.";
  }
  return output;
}
export class AstraPredictiveEngine {
  async predict(input: AstraPredictionInput): Promise<AstraPredictionOutput> {
    if (!GEMINI_API_KEY) {
      console.warn("⚠️ [ASTRA] GEMINI_API_KEY not configured. Invoking S-Class Heuristic engine.");
      return runAnalyticalFallback(input);
    }
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const dateObj = new Date(input.eventDate);
      const isWeekend = [0, 6].includes(dateObj.getDay());
      const monthLabel = dateObj.toLocaleString("es-ES", { month: "long" });
      const context = {
        origin: input.origin,
        destination: input.destination,
        eventDate: input.eventDate,
        month: monthLabel,
        isWeekend,
        historicalWaybillsCount: input.historicalWaybills?.length || 0,
        historicalWalletMovesCount: input.historicalWalletMoves?.length || 0,
        historicalDataSnippet: input.historicalWaybills?.slice(0, 5).map(w => ({
          status: w.status,
          distance: w.distanceMeters,
          created: w.createdAt
        }))
      };
      const systemPrompt = `
Eres ASTRA, la inteligencia predictiva y oráculo logístico de VIMUME OS.
Tu misión es calcular una predicción de precios y riesgos para un trayecto de flotas VIP de artistas en España.
[INSTRUCCIONES DE CALIBRACIÓN]
1. Genera una respuesta estrictamente estructurada en formato JSON sin Markdown alrededor.
2. La salida JSON debe coincidir exactamente con este esquema:
{
  "baseDemandScore": 0.0 a 1.0 (probabilidad de congestión de reservas en la fecha del evento),
  "geoPriceMultiplier": 1.0 a 2.5 (recargo de distancia o dificultad de la zona geográfica, ej: Islas Baleares 2.0+),
  "riskScore": 0.0 a 1.0 (riesgo logístico de retraso o incidentes en ruta),
  "recommendedTotalAmount": número decimal (cálculo de tarifa óptima combinando distancia, multiplicador y riesgo),
  "explanation": "Explicación breve y senior en español del porqué de este precio, integrando estacionalidad y distancia",
  "confidenceScore": 0.0 a 1.0 (evaluación de la fiabilidad basada en el volumen de datos históricos aportados)
}
3. Reglas de Negocio:
- Los fines de semana de verano (Junio a Septiembre) aumentan el 'baseDemandScore' a 0.85+.
- Las rutas interprovinciales complejas aumentan el 'riskScore' y el 'geoPriceMultiplier'.
- Si hay menos de 2 trayectos históricos, el 'confidenceScore' debe ser inferior a 0.60, en cuyo caso es obligatorio generar una explicación que mencione la escasez de datos.
[DATOS CONTEXTUALES DE ENTRADA]
${JSON.stringify(context)}
`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            temperature: 0.15,
            responseMimeType: "application/json"
          }
        })
      });
      if (!response.ok) {
        throw new Error(`Gemini API HTTP status ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || "Gemini generative language API error");
      }
      const rawText = data.candidates[0].content.parts[0].text;
      const parsed: AstraPredictionOutput = JSON.parse(rawText.trim());
      parsed.baseDemandScore = Number(Number(parsed.baseDemandScore).toFixed(2));
      parsed.geoPriceMultiplier = Number(Number(parsed.geoPriceMultiplier).toFixed(2));
      parsed.riskScore = Number(Number(parsed.riskScore).toFixed(2));
      parsed.recommendedTotalAmount = Number(Number(parsed.recommendedTotalAmount).toFixed(2));
      parsed.confidenceScore = Number(Number(parsed.confidenceScore).toFixed(2));
      if (parsed.confidenceScore < 0.6) {
        parsed.warningMessage = "Nivel de confianza predictiva bajo debido al tamaño limitado del historial transaccional de flotas.";
      }
      return parsed;
    } catch (err: any) {
      console.error("🛑 [ASTRA] Synapse prediction call failed, deploying fallback engine:", err.message);
      return runAnalyticalFallback(input);
    }
  }
}
export const astraPredictiveEngine = new AstraPredictiveEngine();