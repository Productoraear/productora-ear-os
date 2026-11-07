/**
 * Empirical Adversarial Test for S-Class Profile Completeness Evaluator
 * Tests 10-point evaluator, 80% draft baseline, 100% auto-complete, and boundary conditions.
 */
import {
  evaluateProfileCompleteness,
  generateCertifiedSClassProfile,
  CertifiedSClassProfileData,
} from '../src/components/help/ProfileInteractiveHelpModal';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`ASSERTION FAILED: ${msg}`);
  }
}

function assertEqual(actual: unknown, expected: unknown, msg: string) {
  if (actual !== expected) {
    throw new Error(`ASSERTION FAILED: ${msg} | Expected ${expected}, got ${actual}`);
  }
}

console.log('=== S-CLASS PROFILE COMPLETENESS EVALUATOR: EMPIRICAL TEST ===\n');

// 1. Test canonical draft profile (8/10 -> exactly 80%)
const draftProfile: Partial<CertifiedSClassProfileData> = {
  verifiedPhone: '+34 693 693 048',
  officialWhatsApp: '+34693693048',
  bioSClass: 'Música en directo de alta fidelidad para bodas exclusivas y fincas de élite en Madrid y Toledo.',
  baseTariffEur: 350,
  depositAcceptedEur: 100,
  audioRider: {
    brand: 'Bose F1 Model 812',
    wattsPerPax: 12,
    maxSplDb: 75,
  },
  powerConnection: 'CETAC_32A',
  hubLocation: {
    address: 'Camino de Méntrida a Aldea del Fresno',
    municipio: 'Méntrida',
    provincia: 'Toledo',
    kmFromMentrida: 0,
  },
  // Missing gallery4kUrls (< 3 or undefined)
  // Missing civilLiabilityInsuranceEur (< 300000 or undefined)
};

const draftReport = evaluateProfileCompleteness(draftProfile);
console.log('[TEST 1] Draft Profile Evaluation:');
console.log(` - Completed fields: ${draftReport.completedFields} / ${draftReport.totalFields}`);
console.log(` - Percentage: ${draftReport.percentage}%`);
console.log(` - isSClassCertified: ${draftReport.isSClassCertified}`);
console.log(` - Missing fields (${draftReport.missingFields.length}):`, draftReport.missingFields);

assertEqual(draftReport.completedFields, 8, 'Draft profile must have exactly 8 completed fields');
assertEqual(draftReport.totalFields, 10, 'Evaluator must check exactly 10 fields');
assertEqual(draftReport.percentage, 80, 'Draft profile must evaluate to exactly 80%');
assertEqual(draftReport.isSClassCertified, false, 'Draft profile must not be certified yet');
assertEqual(draftReport.missingFields.length, 2, 'Must have exactly 2 missing fields');

// 2. Test auto-complete with canonical data (10/10 -> exactly 100% and S_CLASS_GOLD_MASTER)
console.log('\n[TEST 2] Auto-Complete Simulation:');
const canonicalData = generateCertifiedSClassProfile('artist:edwin-agudelo');
const completedProfile: CertifiedSClassProfileData = {
  ...draftProfile,
  ...canonicalData,
};

const completedReport = evaluateProfileCompleteness(completedProfile);
console.log(` - Completed fields: ${completedReport.completedFields} / ${completedReport.totalFields}`);
console.log(` - Percentage: ${completedReport.percentage}%`);
console.log(` - isSClassCertified: ${completedReport.isSClassCertified}`);
console.log(` - Missing fields count: ${completedReport.missingFields.length}`);

assertEqual(completedReport.completedFields, 10, 'Completed profile must have 10 completed fields');
assertEqual(completedReport.percentage, 100, 'Completed profile must evaluate to exactly 100%');
assertEqual(completedReport.isSClassCertified, true, 'Completed profile must be certified');
assertEqual(completedReport.missingFields.length, 0, 'No missing fields when 100% complete');

// Badge unlock verification
const badge = completedReport.isSClassCertified ? 'S_CLASS_GOLD_MASTER' : 'STANDARD_PENDING';
assertEqual(badge, 'S_CLASS_GOLD_MASTER', '100% profile must unlock S_CLASS_GOLD_MASTER badge');
console.log(` - Badge unlocked: ${badge} (PASS)`);

// 3. Adversarial boundary conditions on evaluator
console.log('\n[TEST 3] Adversarial Boundary Testing on 10 Criteria:');

// Boundary: Base Tariff (SSOT floor = 350.00 €)
const failTariff = evaluateProfileCompleteness({ ...completedProfile, baseTariffEur: 349.99 });
assertEqual(failTariff.completedFields, 9, 'Tariff 349.99 must fail baseTariffEur check');
const passTariff = evaluateProfileCompleteness({ ...completedProfile, baseTariffEur: 350.00 });
assertEqual(passTariff.completedFields, 10, 'Tariff 350.00 must pass baseTariffEur check');
console.log(' - Tariff boundary (349.99 € fail vs 350.00 € pass): PASS');

// Boundary: SPL dB (Ley 37/2003 <= 75 dB)
const failSpl = evaluateProfileCompleteness({ ...completedProfile, audioRider: { brand: 'Bose', wattsPerPax: 12, maxSplDb: 75.1 } });
assertEqual(failSpl.completedFields, 9, 'SPL 75.1 must fail acoustic limit');
const passSpl = evaluateProfileCompleteness({ ...completedProfile, audioRider: { brand: 'Bose', wattsPerPax: 12, maxSplDb: 75.0 } });
assertEqual(passSpl.completedFields, 10, 'SPL 75.0 must pass acoustic limit');
console.log(' - SPL boundary (75.1 dB fail vs 75.0 dB pass): PASS');

// Boundary: Insurance (>= 300,000 €)
const failIns = evaluateProfileCompleteness({ ...completedProfile, civilLiabilityInsuranceEur: 299999 });
assertEqual(failIns.completedFields, 9, 'Insurance 299,999 must fail');
const passIns = evaluateProfileCompleteness({ ...completedProfile, civilLiabilityInsuranceEur: 300000 });
assertEqual(passIns.completedFields, 10, 'Insurance 300,000 must pass');
console.log(' - Insurance boundary (299,999 € fail vs 300,000 € pass): PASS');

// Boundary: Gallery 4K (>= 3 photos)
const failGallery = evaluateProfileCompleteness({ ...completedProfile, gallery4kUrls: ['url1', 'url2'] });
assertEqual(failGallery.completedFields, 9, 'Gallery with 2 items must fail');
const passGallery = evaluateProfileCompleteness({ ...completedProfile, gallery4kUrls: ['url1', 'url2', 'url3'] });
assertEqual(passGallery.completedFields, 10, 'Gallery with 3 items must pass');
console.log(' - Gallery boundary (2 items fail vs 3 items pass): PASS');

// Boundary: WhatsApp channel (must start with '+')
const failWa = evaluateProfileCompleteness({ ...completedProfile, officialWhatsApp: '34693693048' });
assertEqual(failWa.completedFields, 9, 'WhatsApp without + must fail');
const passWa = evaluateProfileCompleteness({ ...completedProfile, officialWhatsApp: '+34693693048' });
assertEqual(passWa.completedFields, 10, 'WhatsApp with + must pass');
console.log(' - WhatsApp prefix boundary (without + fail vs with + pass): PASS');

// Boundary: Verified phone length (>= 9)
const failPhone = evaluateProfileCompleteness({ ...completedProfile, verifiedPhone: '12345678' });
assertEqual(failPhone.completedFields, 9, 'Phone with 8 chars must fail');
const passPhone = evaluateProfileCompleteness({ ...completedProfile, verifiedPhone: '123456789' });
assertEqual(passPhone.completedFields, 10, 'Phone with 9 chars must pass');
console.log(' - Phone length boundary (8 chars fail vs 9 chars pass): PASS');

// Boundary: Power connection enum
const failPower = evaluateProfileCompleteness({ ...completedProfile, powerConnection: 'INVALID_PLUG' as any });
assertEqual(failPower.completedFields, 9, 'Invalid power plug must fail');
const passPower = evaluateProfileCompleteness({ ...completedProfile, powerConnection: 'CETAC_32A' });
assertEqual(passPower.completedFields, 10, 'CETAC_32A must pass');
console.log(' - Power plug enum validation: PASS');

console.log('\n=== ALL S-CLASS EVALUATOR EMPIRICAL TESTS PASSED WITH EXIT 0 ===');
