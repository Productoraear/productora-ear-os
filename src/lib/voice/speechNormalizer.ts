/**
 * Productora EAR OS :: Universal Speech & Phonetic Normalizer (S-Class)
 * -----------------------------------------------------------------------
 * Transforma números, divisas, unidades técnicas y markdown en español hablado
 * natural, cálido y fluido.
 *
 * ERRADICA POR COMPLETO aberraciones fonéticas como:
 *   "179.000,54" -> "179 euros con 54 céntimos"
 *   "350.00 €"   -> "350 euros"
 *   "100 €"      -> "100 euros"
 *   "+34 693 693 048" -> "6 9 3, 6 9 3, 0 4 8"
 *   "50 km"      -> "50 kilómetros"
 *   "150 pax"    -> "150 invitados"
 */

/**
 * Normaliza cantidades monetarias y números en el texto para su locución natural.
 */
export function normalizeCurrencyAndNumbers(text: string): string {
  if (!text) return '';

  return (
    text
      // 1. Caso de números aberrantes como 179.000,54 € o 179.000,00 €
      .replace(/(\d+)\.000,(\d{1,2})\s*(?:€|euros?)(?=[\s\.,!?;:]|$)/gi, (_m, entero, dec) => {
        const cents = parseInt(dec, 10);
        return cents > 0
          ? `${entero} euros con ${cents} céntimos`
          : `${entero} euros`;
      })
      // 2. Importe con decimales en coma o punto: ej. 179,50 € o 179.50 €
      .replace(/(\d+)[\.,](\d{1,2})\s*(?:€|euros?)(?=[\s\.,!?;:]|$)/gi, (_m, entero, dec) => {
        const cents = parseInt(dec, 10);
        return cents > 0
          ? `${entero} euros con ${cents} céntimos`
          : `${entero} euros`;
      })
      // 3. Decimales vacíos sueltos con símbolo de euro: 350.00 € -> 350 euros
      .replace(/(\d+)[\.,]00\s*(?:€|euros?)(?=[\s\.,!?;:]|$)/gi, '$1 euros')
      // 4. Importe entero con símbolo de euro: ej. 350 € o 100€
      .replace(/(\d+)\s*(?:€|euros?)(?=[\s\.,!?;:]|$)/gi, '$1 euros')
      // 5. Decimales vacíos sueltos sin divisa: 350.00 o 350,00 -> 350
      .replace(/(\d+)[\.,]00\b/g, '$1')
      // 6. Unidades de distancia: 50 km / 50km -> 50 kilómetros
      .replace(/(\d+)\s*km\b/gi, '$1 kilómetros')
      // 7. Unidades de aforo: 150 pax -> 150 invitados
      .replace(/(\d+)\s*pax\b/gi, '$1 invitados')
      // 8. Horas: "a las 22:00" -> "a las 22:00" o "22:00" -> "a las 22"
      .replace(/(?:a\s+las\s+)?\b(\d{1,2}):00\b/gi, 'a las $1')
      // 9. Teléfono centralita: +34 693 693 048 -> "seis nueve tres, seis nueve tres, cero cuatro ocho"
      .replace(/(?:\+34\s*)?693[\s\.-]?693[\s\.-]?048/g, 'seis nueve tres, seis nueve tres, cero cuatro ocho')
  );
}

/**
 * Limpia el texto de artefactos de Markdown, URLs, emojis y caracteres de control
 * para generar un libreto limpio apto para Web Speech API, ElevenLabs o TTS.
 */
export function toConversationalSpeech(rawText: string): string {
  if (!rawText) return '';

  return (
    normalizeCurrencyAndNumbers(rawText)
      // Enlaces markdown [texto](url) -> texto
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Quitar URLs directas
      .replace(/https?:\/\/\S+/g, '')
      // Encabezados markdown (# H1, ## H2, etc.)
      .replace(/^#{1,6}\s+/gm, '')
      // Negritas y cursivas (**, *, __, _)
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      // Viñetas y listas
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Emojis y caracteres visuales no pronunciables
      .replace(
        /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}]/gu,
        ''
      )
      // Flechas y símbolos especiales
      .replace(/[➔→←↑↓🔒🛡️🎁📅💰🎩•]/g, ' ')
      // Pausas naturales en saltos de línea
      .replace(/\n+/g, '. ')
      // Normalizar espacios múltiples
      .replace(/\s+/g, ' ')
      // Normalizar puntos suspensivos o múltiples
      .replace(/\.{2,}/g, '.')
      .trim()
  );
}
