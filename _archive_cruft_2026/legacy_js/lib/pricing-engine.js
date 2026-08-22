export async function calculateMariachiRate(params) {
    // Implementar lógica para calcular el precio
    let basePrice = params.distanciaKm * 0.5;
    if (params.esPremium) {
        basePrice *= 1.2; // Aumento de 20% para clientes premium
    }
    const discount = params.horaFin > 18 ? 5 : 0; // Descuento nocturno
    return { total: basePrice - discount };
}
