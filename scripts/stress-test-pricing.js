import { calculateMariachiRate } from '../src/lib/pricing-engine';
const scenarios = [
    { distanciaKm: 50, time: '14:00', esPremium: false },
    { distanciaKm: 250, time: '23:00', esPremium: false },
    { distanciaKm: 10, time: '02:00', esPremium: false },
    { distanciaKm: 75, time: '09:30', esPremium: false },
    { distanciaKm: 120, time: '18:45', esPremium: false },
    { distanciaKm: 300, time: '11:15', esPremium: false },
    { distanciaKm: 20, time: '05:00', esPremium: false },
    { distanciaKm: 90, time: '16:20', esPremium: false },
    { distanciaKm: 150, time: '21:30', esPremium: false },
    { distanciaKm: 40, time: '07:45', esPremium: false }
];
async function runStressTest() {
    console.log('| Escenario | Precio Esperado | Precio Obtenido | Resultado (PASS/FAIL) |');
    console.log('|-----------|-----------------|-----------------|-----------------------|');
    for (let i = 0; i < scenarios.length; i++) {
        const { distanciaKm, time, esPremium } = scenarios[i];
        const expectedPrice = calculateExpectedPrice(distanciaKm, time);
        const actualPrice = await calculateMariachiRate({ distanciaKm, horaFin: parseInt(time.split(':')[0]), esPremium });
        if (actualPrice.total === expectedPrice) {
            console.log(`| ${i + 1}         | ${expectedPrice.toFixed(2)}        | ${actualPrice.total.toFixed(2)}        | PASS               |`);
        }
        else {
            console.log(`| ${i + 1}         | ${expectedPrice.toFixed(2)}        | ${actualPrice.total.toFixed(2)}        | FAIL               |`);
        }
    }
}
export function calculateExpectedPrice(distanciaKm, time) {
    // Implementar lógica para calcular el precio esperado
    // Aquí se usa una fórmula simplificada como ejemplo
    return distanciaKm * 0.5 + (time.startsWith('23') ? 10 : 0);
}
runStressTest();
