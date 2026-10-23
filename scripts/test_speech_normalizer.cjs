const fs = require('fs');

function normalizeCurrencyAndNumbers(text) {
  if (!text) return '';

  return (
    text
      // 1. Caso de números con puntos y coma decimal: 179.000,54 €
      .replace(/(\d+)\.000,(\d{1,2})\s*(?:€|euros?)/gi, (_m, entero, dec) => {
        const cents = parseInt(dec, 10);
        return cents > 0
          ? `${entero} euros con ${cents} céntimos`
          : `${entero} euros`;
      })
      // 2. Importe con decimales en coma o punto: 179,50 € o 179.50 €
      .replace(/(\d+)[\.,](\d{1,2})\s*(?:€|euros?)/gi, (_m, entero, dec) => {
        const cents = parseInt(dec, 10);
        return cents > 0
          ? `${entero} euros con ${cents} céntimos`
          : `${entero} euros`;
      })
      // 3. Importe entero con símbolo de euro: 350 € o 100€
      .replace(/(\d+)\s*(?:€|euros?)\b/gi, '$1 euros')
      // 4. Decimales vacíos sueltos: 350.00 o 350,00 -> 350
      .replace(/(\d+)[\.,]00\b/g, '$1')
      // 5. Unidades de distancia: 50 km -> 50 kilómetros
      .replace(/(\d+)\s*km\b/gi, '$1 kilómetros')
      // 6. Unidades de aforo: 150 pax -> 150 invitados
      .replace(/(\d+)\s*pax\b/gi, '$1 invitados')
      // 7. Horas: 22:00 -> las 22 horas
      .replace(/\b(\d{1,2}):00\b/g, 'las $1')
      // 8. Teléfono centralita: +34 693 693 048
      .replace(/(?:\+34\s*)?693[\s\.-]?693[\s\.-]?048/g, 'seis nueve tres, seis nueve tres, cero cuatro ocho')
  );
}

const tests = [
  'El precio final es de 179.000,54 € con todo incluido.',
  'La tarifa para Edwin Agudelo es 350.00 € base.',
  'El depósito de reserva es de 100 €.',
  'La distancia es de 50 km desde Méntrida para 150 pax.',
  'Finaliza a las 22:00 de la noche.',
  'Contacta al WhatsApp +34 693 693 048 para dudas.'
];

console.log('--- TEST NORMALIZADOR FONÉTICO ---');
for (const t of tests) {
  console.log('INPUT: ', t);
  console.log('OUTPUT:', normalizeCurrencyAndNumbers(t));
  console.log('-----------------------------------');
}
