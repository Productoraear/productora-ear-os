import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51O...'; // or from env

console.log("=== 🏛️ EJECUCIÓN DE 5 PRUEBAS DE COBRO E2E (0.50 € GARANTÍA) ===");

const TEST_SCENARIOS = [
  {
    id: 1,
    name: "PRUEBA 1: Reserva Pack Acústico Bose F1 (Salón 50m² / 60 pax)",
    amount: 0.50,
    concept: "Reserva Inventario: Bose F1 Model 812 (2026-09-15)",
    metadata: {
      venue_id: "Finca_La_Gaivota_Madrid",
      is_b2g: "false",
      artist_tier: "TIER_ZERO_HARDWARE",
      m2: "50",
      pax: "60"
    }
  },
  {
    id: 2,
    name: "PRUEBA 2: Reserva Pack Iluminación Beam 7R + Festoon Vintage",
    amount: 0.50,
    concept: "Reserva Iluminación DMX & Guirnaldas 50m (2026-09-20)",
    metadata: {
      venue_id: "Mas_de_Sant_Llei_Barcelona",
      is_b2g: "false",
      artist_tier: "CHAUVET_CAMEO_PRO",
      m2: "150",
      pax: "120"
    }
  },
  {
    id: 3,
    name: "PRUEBA 3: Cotización Bespoke Mariachi Imperial Edwin Agudelo (6 Músicos)",
    amount: 0.50,
    concept: "Bloqueo Caché: Mariachi Imperial 6 Integrantes (2026-10-05)",
    metadata: {
      venue_id: "Huerto_Santa_Maria_Valencia",
      is_b2g: "false",
      artist_tier: "MASTER_ARTIST_DIRECT",
      m2: "200",
      pax: "200"
    }
  },
  {
    id: 4,
    name: "PRUEBA 4: Túnel Neural Wedding Planner Valladolid (10 Pantallas)",
    amount: 0.50,
    concept: "Bloqueo Roster Integral: Wedding Planner Valladolid (2026-10-18)",
    metadata: {
      venue_id: "Palacio_Villagomez_Valladolid",
      is_b2g: "false",
      artist_tier: "FULL_ROSTER_PACK",
      m2: "180",
      pax: "160"
    }
  },
  {
    id: 5,
    name: "PRUEBA 5: Sonorización Masiva L-Acoustics Syva Gala B2B (500 pax)",
    amount: 0.50,
    concept: "Garantía Reserva: L-Acoustics Syva Array + X32 (2026-11-01)",
    metadata: {
      venue_id: "Hacienda_Los_Angeles_Sevilla",
      is_b2g: "true",
      artist_tier: "CONCIERTO_B2G_GALA",
      m2: "400",
      pax: "500"
    }
  }
];

async function runTests() {
  let successCount = 0;

  for (const t of TEST_SCENARIOS) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`🚀 ${t.name}`);
    console.log(`   Importe: ${t.amount} € (${t.amount * 100} céntimos)`);
    console.log(`   Concepto: ${t.concept}`);
    console.log(`   Split 80/10/10: Artista/Proveedor 80% (0.40 €) | Plataforma EAR 10% (0.05 €) | Afiliado 10% (0.05 €)`);

    try {
      const res = await fetch('http://localhost:3007/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: t.amount,
          concept: t.concept,
          metadata: t.metadata
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.log(`   ❌ Error en API local (Status ${res.status}): ${errText}`);
      } else {
        const data = await res.json();
        console.log(`   ✅ SESIÓN STRIPE CHECKOUT CREADA CON ÉXITO`);
        console.log(`   🔗 URL de Pago: ${data.url}`);
        successCount++;
      }
    } catch (e) {
      console.log(`   ❌ Excepción: ${e.message}`);
    }
  }

  console.log(`\n============================================================`);
  console.log(`📊 RESULTADO AUDITORÍA: ${successCount} de ${TEST_SCENARIOS.length} sesiones de 0.50 € generadas con éxito.`);
  console.log(`============================================================\n`);
}

runTests();
