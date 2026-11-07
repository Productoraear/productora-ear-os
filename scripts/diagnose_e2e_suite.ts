import { TestExecutionTracker } from '../tests/e2e/investor-showcase/contracts';
import { runTier1FeatureCoverageTests } from '../tests/e2e/investor-showcase/tier1-features.test';
import { runTier2BoundaryAndCornerTests } from '../tests/e2e/investor-showcase/tier2-boundaries.test';
import { runTier3CrossFeatureTests } from '../tests/e2e/investor-showcase/tier3-pairwise.test';
import { runTier4RealWorldScenariosTests } from '../tests/e2e/investor-showcase/tier4-scenarios.test';

async function diagnose() {
  console.log('=== FULL E2E SUITE DIAGNOSTIC RUNNER ===\n');

  console.log('--- Testing Tier 1 ---');
  const tracker1 = new TestExecutionTracker();
  try {
    await runTier1FeatureCoverageTests(tracker1);
  } catch (err: any) {
    console.log('Tier 1 unhandled throw:', err.message);
  }
  tracker1.printSummary();

  console.log('\n--- Testing Tier 2 ---');
  const tracker2 = new TestExecutionTracker();
  try {
    await runTier2BoundaryAndCornerTests(tracker2);
  } catch (err: any) {
    console.log('Tier 2 unhandled throw:', err.message);
  }
  tracker2.printSummary();

  console.log('\n--- Testing Tier 3 ---');
  const tracker3 = new TestExecutionTracker();
  try {
    await runTier3CrossFeatureTests(tracker3);
  } catch (err: any) {
    console.log('Tier 3 unhandled throw:', err.message);
  }
  tracker3.printSummary();

  console.log('\n--- Testing Tier 4 ---');
  const tracker4 = new TestExecutionTracker();
  try {
    await runTier4RealWorldScenariosTests(tracker4);
  } catch (err: any) {
    console.log('Tier 4 unhandled throw:', err.message);
  }
  tracker4.printSummary();
}

diagnose().catch(console.error);
