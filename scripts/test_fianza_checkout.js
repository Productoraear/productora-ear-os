async function testMultiItemCheckout() {
  try {
    const res = await fetch('http://localhost:3007/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 270,
        concept: 'Alquiler + Fianza 50%: Bose F1 Model 812',
        metadata: {
          type: 'FIANZA_ALQUILER',
          isFianza: true,
          includeRental: true,
          itemId: 'spk-bose-f1',
          itemName: 'Bose F1 Model 812 + Subwoofer F1',
          dailyPrice: 180,
          fianzaAmount: 90,
          eventDate: '2026-09-26'
        }
      })
    });
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Result:', data.url ? 'SUCCESS: Stripe URL generated with Itemized Rental + Fianza' : data);
  } catch (err) {
    console.error('Error:', err);
  }
}
testMultiItemCheckout();
