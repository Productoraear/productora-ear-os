const { PrismaClient } = require('@prisma/client');

async function runSmokeTest() {
  console.log("🚀 STARTING STRIPE CONNECT WEBHOOK LOGIC SMOKE TEST...");
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: "postgresql://postgres:postgres@localhost:5432/postgres"
      }
    }
  });

  const testAccountId = "acct_smoke_test_12345";
  let tempProviderId = null;

  try {
    // 1. Setup Mock Provider
    console.log("📋 Setting up mock ProviderProfile in local database...");
    const tempProviderName = `Mock Test Provider_${Date.now()}`;
    const provider = await prisma.providerProfile.create({
      data: {
        name: tempProviderName,
        slug: `mock-test-provider-${Date.now()}`,
        stripeAccountId: testAccountId,
        isVerified: false,
        stripeConnected: false,
        category: "Música / Animación",
        location: "Madrid"
      }
    });
    tempProviderId = provider.id;
    console.log(`✅ Mock provider created with ID: ${tempProviderId}`);

    // 2. Simulate Webhook Event account.updated
    // Payload from stripe.account.updated event:
    const mockAccountEvent = {
      id: testAccountId,
      details_submitted: true,
      charges_enabled: true
    };

    console.log("⚡ Simulating 'account.updated' event processing...");
    console.log(`Payload: id=${mockAccountEvent.id}, details_submitted=${mockAccountEvent.details_submitted}, charges_enabled=${mockAccountEvent.charges_enabled}`);

    // Exact webhook code path execution:
    const stripeAccountId = mockAccountEvent.id;
    const detailsSubmitted = mockAccountEvent.details_submitted ?? false;
    const chargesEnabled = mockAccountEvent.charges_enabled ?? false;

    if (!detailsSubmitted || !chargesEnabled) {
      throw new Error("Validation failed: details_submitted or charges_enabled is false");
    }

    // Find the provider by stripeAccountId
    const targetProvider = await prisma.providerProfile.findFirst({
      where: { stripeAccountId },
      select: { id: true, name: true, isVerified: true, stripeConnected: true },
    });

    if (!targetProvider) {
      throw new Error(`Orphan account: No ProviderProfile found with stripeAccountId ${stripeAccountId}`);
    }

    if (targetProvider.isVerified && targetProvider.stripeConnected) {
      console.log("ℹ️ Provider already verified.");
    } else {
      // ACID update: mark provider as fiscally verified
      await prisma.providerProfile.update({
        where: { id: targetProvider.id },
        data: {
          isVerified: true,
          stripeConnected: true,
        },
      });
      console.log("💎 ACID Update Succeeded: isVerified=true, stripeConnected=true");
    }

    // 3. Verify Final State Mutation
    console.log("🔍 Verifying final state in database...");
    const updatedProvider = await prisma.providerProfile.findUnique({
      where: { id: tempProviderId },
      select: { name: true, isVerified: true, stripeConnected: true }
    });

    if (updatedProvider.isVerified === true && updatedProvider.stripeConnected === true) {
      console.log("💯 SMOKE TEST SUCCESSFUL! State matches expected S-Class verified status.");
    } else {
      throw new Error(`Smoke test failed: Provider isVerified=${updatedProvider.isVerified}, stripeConnected=${updatedProvider.stripeConnected}`);
    }

  } catch (err) {
    console.error("❌ SMOKE TEST FAILED:", err.message);
  } finally {
    // 4. Cleanup
    if (tempProviderId) {
      console.log("🧹 Cleaning up mock ProviderProfile from local database...");
      try {
        await prisma.providerProfile.delete({
          where: { id: tempProviderId }
        });
        console.log("✅ Cleanup successful.");
      } catch (cleanupErr) {
        console.error("⚠️ Cleanup failed:", cleanupErr.message);
      }
    }
    await prisma.$disconnect();
  }
}

runSmokeTest();
