console.log("=== 🏛️ AUDITORÍA DE WEBHOOKS STRIPE PARA 5 PAGOS DE 0.50 € ===");

const TEST_EVENTS = [
  {
    sessionId: "cs_test_a1OWfaWEEll4bGoEaDJQ63v4YRHkhv8MK4JxlsFzK7VAFgE0ksipfC3VgJ",
    amount: 50,
    concept: "Reserva Inventario: Bose F1 Model 812 (2026-09-15)",
    email: "weddingplanner.madrid@vip.com",
    metadata: {
      source: "EAR_OS_GOLD_V141",
      concept: "Reserva Inventario: Bose F1 Model 812 (2026-09-15)",
      venue_id: "Finca_La_Gaivota_Madrid",
      is_b2g: "false",
      artist_tier: "TIER_ZERO_HARDWARE",
      split_platform: "5",
      split_affiliate: "5",
      split_provider: "40"
    }
  },
  {
    sessionId: "cs_test_a1rIGjYC5Ngt0a3Hpq08p1EGM3DwQajvaAmiOnzfjLSGoGBxIrLw8UDl0I",
    amount: 50,
    concept: "Reserva Iluminación DMX & Guirnaldas 50m (2026-09-20)",
    email: "agencia.eventos@barcelona.com",
    metadata: {
      source: "EAR_OS_GOLD_V141",
      concept: "Reserva Iluminación DMX & Guirnaldas 50m (2026-09-20)",
      venue_id: "Mas_de_Sant_Llei_Barcelona",
      is_b2g: "false",
      artist_tier: "CHAUVET_CAMEO_PRO",
      split_platform: "5",
      split_affiliate: "5",
      split_provider: "40"
    }
  },
  {
    sessionId: "cs_test_a1mYTVCJlIPoZdttkXTwxqIMtxjykOrWB2walCtUcxE8zzDQRi2goK8Qw2",
    amount: 50,
    concept: "Bloqueo Caché: Mariachi Imperial 6 Integrantes (2026-10-05)",
    email: "novios.valencia@luxuryweddings.com",
    metadata: {
      source: "EAR_OS_GOLD_V141",
      concept: "Bloqueo Caché: Mariachi Imperial 6 Integrantes (2026-10-05)",
      venue_id: "Huerto_Santa_Maria_Valencia",
      is_b2g: "false",
      artist_tier: "MASTER_ARTIST_DIRECT",
      split_platform: "5",
      split_affiliate: "5",
      split_provider: "40"
    }
  },
  {
    sessionId: "cs_test_a1U6q4AoCvZogRzE78FgBVT3aPTCq3ByK1wEoc39CSIhRSKUGEhmqrzCvv",
    amount: 50,
    concept: "Bloqueo Roster Integral: Wedding Planner Valladolid (2026-10-18)",
    email: "planners.valladolid@bodascastilla.com",
    metadata: {
      source: "EAR_OS_GOLD_V141",
      concept: "Bloqueo Roster Integral: Wedding Planner Valladolid (2026-10-18)",
      venue_id: "Palacio_Villagomez_Valladolid",
      is_b2g: "false",
      artist_tier: "FULL_ROSTER_PACK",
      split_platform: "5",
      split_affiliate: "5",
      split_provider: "40"
    }
  },
  {
    sessionId: "cs_test_a1kFhlc9QXcddm4189FsF2Vri7gLNnIT7PaeLSyYSfGjr16iuIFxVWD5dm",
    amount: 50,
    concept: "Garantía Reserva: L-Acoustics Syva Array + X32 (2026-11-01)",
    email: "ayuntamiento.festejos@sevilla.es",
    metadata: {
      source: "EAR_OS_GOLD_V141",
      concept: "Garantía Reserva: L-Acoustics Syva Array + X32 (2026-11-01)",
      venue_id: "Hacienda_Los_Angeles_Sevilla",
      is_b2g: "true",
      artist_tier: "CONCIERTO_B2G_GALA",
      split_platform: "5",
      split_affiliate: "5",
      split_provider: "40"
    }
  }
];

async function testWebhooks() {
  let processedCount = 0;

  for (let i = 0; i < TEST_EVENTS.length; i++) {
    const item = TEST_EVENTS[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`⚡ PROCESANDO WEBHOOK ${i + 1}/5: [${item.sessionId.substring(0, 20)}...]`);
    console.log(`   Importe: ${item.amount / 100} € | Cliente: ${item.email}`);
    console.log(`   Concepto: ${item.concept}`);

    const payload = {
      id: `evt_test_${Date.now()}_${i}`,
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: item.sessionId,
          object: "checkout.session",
          amount_total: item.amount,
          currency: "eur",
          customer_details: { email: item.email },
          payment_status: "paid",
          status: "complete",
          metadata: item.metadata
        }
      }
    };

    try {
      const res = await fetch("http://localhost:3007/api/webhooks/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      console.log(`   HTTP Status: ${res.status}`);
      console.log(`   Webhook Response:`, JSON.stringify(json));

      if (res.status === 200) {
        processedCount++;
        console.log(`   ✅ Webhook procesado con éxito.`);
      } else {
        console.log(`   ⚠️ Webhook devuelto con status: ${res.status}`);
      }
    } catch (e) {
      console.log(`   ❌ Error conectando a webhook:`, e.message);
    }
  }

  console.log(`\n============================================================`);
  console.log(`📊 BALANCE DE PRUEBAS: ${processedCount} de 5 eventos de pago procesados.`);
  console.log(`============================================================\n`);
}

testWebhooks();
