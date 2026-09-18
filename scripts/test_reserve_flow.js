async function testReserveFlow() {
  console.log('Testing reserve flow for pack-gala-100m2...');
  try {
    const invRes = await fetch('http://localhost:3007/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: 'pack-gala-100m2',
        units: 1,
        eventDate: '2026-09-25',
        customerEmail: 'cliente-vip@earos.com'
      })
    });
    console.log('Inventory API Status:', invRes.status);
    const invData = await invRes.json();
    console.log('Inventory API Data:', invData);

    const fianzaAmount = Math.max(50, Math.round(420 * 0.5));
    console.log('Fianza calculated:', fianzaAmount);

    const payRes = await fetch('http://localhost:3007/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: fianzaAmount,
        concept: `Fianza Reembolsable de Alquiler (50%): Pack Gala VIP (2026-09-25)`,
        metadata: {
          type: 'FIANZA_ALQUILER',
          isFianza: true,
          itemId: 'pack-gala-100m2',
          itemName: 'Pack Gala VIP',
          dailyPrice: 420,
          fianzaAmount,
          m2: 100,
          pax: 100,
          eventDate: '2026-09-25',
          deposit: fianzaAmount
        }
      })
    });
    console.log('Payments API Status:', payRes.status);
    const payData = await payRes.json();
    console.log('Payments API Data URL:', payData.url ? 'URL GENERATED SUCCESSFULLY' : payData);
  } catch (err) {
    console.error('Error in flow:', err);
  }
}

testReserveFlow();
