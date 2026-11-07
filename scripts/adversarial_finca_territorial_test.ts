/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMPIRICAL ADVERSARIAL STRESS TEST: FINCA TERRITORIAL SCHEMA (CHALLENGER M4-1)
 * ════════════════════════════════════════════════════════════════════════════
 * Direct empirical execution to challenge:
 * 1. Boundary conditions in resolveTerritorialLogistics (0, 49, 50, 51, 200, 201 km, closing times)
 * 2. Phone verification & contact-gate masking (valid Spanish, invalid, centralita preservation)
 * 3. Schema.org EventVenue & Offers generation output (Tier 1 F14, Tier 3 Combo D, price '100.00')
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  isVerifiableSpanishPhone,
  maskPhoneForContactGate,
  verifyVenueTelephone,
  isHubMentridaTerritory,
  formatTerritorialDeclaration,
  resolveTerritorialLogistics,
  generateFincaEventVenueSchema,
  generateFincasCatalogItemListSchema,
  generateFincasLandingSchema,
  serializeSchemaToJsonLd,
} from '../src/lib/fincas/fincaTerritorialSchema';
import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
} from '../src/lib/constants/fincas-catalog';
import {
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '../src/lib/constants/ear-os-ssot';

interface AdversarialTestResult {
  id: string;
  name: string;
  passed: boolean;
  actual?: unknown;
  expected?: unknown;
  error?: string;
}

const results: AdversarialTestResult[] = [];

function assert(id: string, name: string, condition: boolean, actual?: unknown, expected?: unknown) {
  if (condition) {
    results.push({ id, name, passed: true });
    console.log(`[PASS] ${id}: ${name}`);
  } else {
    results.push({ id, name, passed: false, actual, expected, error: `Assertion failed` });
    console.error(`[FAIL] ${id}: ${name} — Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
  }
}

console.log('═'.repeat(80));
console.log('STARTING EMPIRICAL ADVERSARIAL STRESS TESTS: FINCA TERRITORIAL SCHEMA');
console.log('═'.repeat(80));

// -----------------------------------------------------------------------------
// SECTION 1: BOUNDARY CONDITIONS IN resolveTerritorialLogistics
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 1: Territorial Logistics Boundary Conditions ---');

// 1.1: 0 km (Finca Valduerna or base hub)
{
  const res0 = resolveTerritorialLogistics({
    provincia: 'Toledo',
    distanciaHubMentridaKm: 0,
    location: 'Méntrida (Toledo)',
  });
  assert('BND-01A', '0 km: billableKm must be 0', res0.billableKm === 0, res0.billableKm, 0);
  assert('BND-01B', '0 km: kmCostCents must be 0', res0.kmCostCents === 0, res0.kmCostCents, 0);
  assert('BND-01C', '0 km: hotelCostCents must be 0 (no late closing)', res0.hotelCostCents === 0, res0.hotelCostCents, 0);
  assert('BND-01D', '0 km: scope must be HUB_MENTRIDA', res0.scope === 'HUB_MENTRIDA', res0.scope, 'HUB_MENTRIDA');
  assert('BND-01E', '0 km: isWithinExemptRadius must be true', res0.isWithinExemptRadius === true, res0.isWithinExemptRadius, true);
  assert('BND-01F', '0 km: territorialDeclaration contains Base Central Operativa EAR',
    res0.territorialDeclaration.includes('Base Central Operativa EAR'), res0.territorialDeclaration);
}

// 1.2: 49 km (strictly within exempt radius)
{
  const res49 = resolveTerritorialLogistics({
    provincia: 'Madrid',
    distanciaHubMentridaKm: 49,
    location: 'Arroyomolinos (Madrid)',
  });
  assert('BND-02A', '49 km: billableKm must be 0', res49.billableKm === 0, res49.billableKm, 0);
  assert('BND-02B', '49 km: kmCostCents must be 0', res49.kmCostCents === 0, res49.kmCostCents, 0);
  assert('BND-02C', '49 km: isWithinExemptRadius must be true', res49.isWithinExemptRadius === true, res49.isWithinExemptRadius, true);
  assert('BND-02D', '49 km: hotelCostCents must be 0', res49.hotelCostCents === 0, res49.hotelCostCents, 0);
}

// 1.3: 50 km (exact exempt boundary)
{
  const res50 = resolveTerritorialLogistics({
    provincia: 'Madrid',
    distanciaHubMentridaKm: 50,
    location: 'Getafe (Madrid)',
  });
  assert('BND-03A', '50 km: billableKm must be 0', res50.billableKm === 0, res50.billableKm, 0);
  assert('BND-03B', '50 km: kmCostCents must be 0', res50.kmCostCents === 0, res50.kmCostCents, 0);
  assert('BND-03C', '50 km: isWithinExemptRadius must be true', res50.isWithinExemptRadius === true, res50.isWithinExemptRadius, true);
  assert('BND-03D', '50 km: hotelCostCents must be 0', res50.hotelCostCents === 0, res50.hotelCostCents, 0);
}

// 1.4: 51 km (first billable km)
{
  const res51 = resolveTerritorialLogistics({
    provincia: 'Madrid',
    distanciaHubMentridaKm: 51,
    location: 'Madrid Centro',
  });
  assert('BND-04A', '51 km: billableKm must be 1', res51.billableKm === 1, res51.billableKm, 1);
  assert('BND-04B', '51 km: kmCostCents must be 150 cents (1.50 €)', res51.kmCostCents === 150, res51.kmCostCents, 150);
  assert('BND-04C', '51 km: kmCostEur must be 1.50', res51.kmCostEur === 1.5, res51.kmCostEur, 1.5);
  assert('BND-04D', '51 km: isWithinExemptRadius must be false', res51.isWithinExemptRadius === false, res51.isWithinExemptRadius, false);
}

// 1.5: 200 km (exact hotel distance boundary without late closing)
{
  const res200 = resolveTerritorialLogistics(
    {
      provincia: 'Ciudad Real',
      distanciaHubMentridaKm: 200,
      location: 'Valdepeñas (Ciudad Real)',
    },
    { eventEndTime: '02:00' } // before 03:00 AM
  );
  assert('BND-05A', '200 km: billableKm must be 150', res200.billableKm === 150, res200.billableKm, 150);
  assert('BND-05B', '200 km: kmCostCents must be 22500 (150 * 150)', res200.kmCostCents === 22500, res200.kmCostCents, 22500);
  assert('BND-05C', '200 km: requiresHotel must be false (closing at 02:00 AM)', res200.requiresHotel === false, res200.requiresHotel, false);
  assert('BND-05D', '200 km: hotelCostCents must be 0', res200.hotelCostCents === 0, res200.hotelCostCents, 0);
  assert('BND-05E', '200 km: totalLogisticsCents must equal kmCostCents (22500)', res200.totalLogisticsCents === 22500, res200.totalLogisticsCents, 22500);
}

// 1.6: 201 km (exceeds 200 km hotel boundary)
{
  const res201 = resolveTerritorialLogistics(
    {
      provincia: 'Valladolid',
      distanciaHubMentridaKm: 201,
      location: 'Medina del Campo (Valladolid)',
    },
    { eventEndTime: '23:00' }
  );
  assert('BND-06A', '201 km: billableKm must be 151', res201.billableKm === 151, res201.billableKm, 151);
  assert('BND-06B', '201 km: kmCostCents must be 22650 (151 * 150)', res201.kmCostCents === 22650, res201.kmCostCents, 22650);
  assert('BND-06C', '201 km: requiresHotel must be true (> 200 km)', res201.requiresHotel === true, res201.requiresHotel, true);
  assert('BND-06D', '201 km: hotelCostCents must be 12000 (120.00 €)', res201.hotelCostCents === 12000, res201.hotelCostCents, 12000);
  assert('BND-06E', '201 km: totalLogisticsCents must be 34650 (22650 + 12000)', res201.totalLogisticsCents === 34650, res201.totalLogisticsCents, 34650);
}

// 1.7: Late closing at 03:00 AM (triggers hotel regardless of distance)
{
  const resLate0300 = resolveTerritorialLogistics(
    {
      provincia: 'Toledo',
      distanciaHubMentridaKm: 15,
      location: 'Torrijos (Toledo)',
    },
    { eventEndTime: '03:00' }
  );
  assert('BND-07A', '03:00 AM closing at 15 km: requiresHotel must be true', resLate0300.requiresHotel === true, resLate0300.requiresHotel, true);
  assert('BND-07B', '03:00 AM closing at 15 km: hotelCostCents must be 12000', resLate0300.hotelCostCents === 12000, resLate0300.hotelCostCents, 12000);
  assert('BND-07C', '03:00 AM closing at 15 km: kmCostCents must be 0 (15 <= 50)', resLate0300.kmCostCents === 0, resLate0300.kmCostCents, 0);
  assert('BND-07D', '03:00 AM closing at 15 km: totalLogisticsCents must be 12000', resLate0300.totalLogisticsCents === 12000, resLate0300.totalLogisticsCents, 12000);
}

// 1.8: Late closing at 04:30 AM (triggers hotel regardless of distance)
{
  const resLate0430 = resolveTerritorialLogistics(
    {
      provincia: 'Madrid',
      distanciaHubMentridaKm: 0,
      location: 'Méntrida Hub Base',
    },
    { eventEndTime: '04:30' }
  );
  assert('BND-08A', '04:30 AM closing at 0 km: requiresHotel must be true', resLate0430.requiresHotel === true, resLate0430.requiresHotel, true);
  assert('BND-08B', '04:30 AM closing at 0 km: hotelCostCents must be 12000', resLate0430.hotelCostCents === 12000, resLate0430.hotelCostCents, 12000);
}

// 1.9: Edge case: Negative distance clamped to 0
{
  const resNeg = resolveTerritorialLogistics({
    provincia: 'Toledo',
    distanciaHubMentridaKm: -25,
    location: 'Anomalous Point',
  });
  assert('BND-09A', 'Negative distance clamped to 0 km', resNeg.distanceHubKm === 0, resNeg.distanceHubKm, 0);
  assert('BND-09B', 'Negative distance billableKm is 0', resNeg.billableKm === 0, resNeg.billableKm, 0);
}

// 1.10: Edge case: 02:59 closing (does NOT trigger hotel if <= 200 km)
{
  const res0259 = resolveTerritorialLogistics(
    {
      provincia: 'Madrid',
      distanciaHubMentridaKm: 40,
      location: 'Navalcarnero',
    },
    { eventEndTime: '02:59' }
  );
  assert('BND-10A', '02:59 AM closing at 40 km: requiresHotel must be false', res0259.requiresHotel === false, res0259.requiresHotel, false);
  assert('BND-10B', '02:59 AM closing at 40 km: hotelCostCents must be 0', res0259.hotelCostCents === 0, res0259.hotelCostCents, 0);
}

// 1.11: Edge case: Hub scope classification
{
  assert('HUB-01', 'Toledo at 15 km is HUB_MENTRIDA', isHubMentridaTerritory('Toledo', 15) === true, true);
  assert('HUB-02', 'Madrid at 80 km is HUB_MENTRIDA', isHubMentridaTerritory('Madrid', 80) === true, true);
  assert('HUB-03', 'Madrid at 120 km is NOT HUB_MENTRIDA (exceeds 100 km radial limit)', isHubMentridaTerritory('Madrid', 120) === false, false);
  assert('HUB-04', 'Toledo at 150 km is NOT HUB_MENTRIDA', isHubMentridaTerritory('Toledo', 150) === false, false);
  assert('HUB-05', 'Segovia at 45 km is HUB_MENTRIDA (within 50 km exempt radius)', isHubMentridaTerritory('Segovia', 45) === true, true);
  assert('HUB-06', 'Segovia at 60 km is NOT HUB_MENTRIDA', isHubMentridaTerritory('Segovia', 60) === false, false);
}

// -----------------------------------------------------------------------------
// SECTION 2: PHONE VERIFICATION & CONTACT-GATE MASKING
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 2: Phone Verification & Contact-Gate Masking ---');

// 2.1: Valid Spanish phones
const validPhones = [
  '+34 693 693 048',
  '+34 918 090 125',
  '612345678',
  '+34 612 345 678',
  '+34612345678',
  '918090125',
  '712345678',
  '812345678',
  ' 693693048 ', // with leading/trailing spaces
  '+34 918 090 125 ',
];

for (const p of validPhones) {
  assert(`PHN-VAL-${p.trim()}`, `Valid Spanish phone detected: "${p}"`, isVerifiableSpanishPhone(p) === true, isVerifiableSpanishPhone(p), true);
  const verification = verifyVenueTelephone(p);
  assert(`PHN-VRF-${p.trim()}`, `verifyVenueTelephone isVerified: true for "${p}"`, verification.isVerified === true, verification.isVerified, true);
  assert(`PHN-NOERR-${p.trim()}`, `verifyVenueTelephone error is undefined for "${p}"`, verification.error === undefined, verification.error, undefined);
}

// 2.2: Invalid phones
const invalidPhones = [
  '12345',
  '+1 555 123 456',
  '000000000',
  '123456789',
  '+44 7911 123456',
  '+33 6 12 34 56 78',
  'abcde',
  '',
  '   ',
];

for (const p of invalidPhones) {
  assert(`PHN-INV-${p}`, `Invalid phone rejected: "${p}"`, isVerifiableSpanishPhone(p) === false, isVerifiableSpanishPhone(p), false);
  const verification = verifyVenueTelephone(p);
  assert(`PHN-NOTVRF-${p}`, `verifyVenueTelephone isVerified: false for "${p}"`, verification.isVerified === false, verification.isVerified, false);
  assert(`PHN-HASERR-${p}`, `verifyVenueTelephone error is populated for "${p}"`, typeof verification.error === 'string', typeof verification.error, 'string');
}

// 2.3: Contact-Gate masking and Centralita Preservation
{
  const centralita = CENTRALITA_EAR_OS; // '+34 693 693 048'
  // When preserveCentralita is true (default)
  const maskedCentralitaPreserved = maskPhoneForContactGate(centralita, true);
  assert('MSK-01A', 'Centralita preserved intact when preserveCentralita=true',
    maskedCentralitaPreserved === centralita, maskedCentralitaPreserved, centralita);

  // When preserveCentralita is false
  const maskedCentralitaHidden = maskPhoneForContactGate(centralita, false);
  assert('MSK-01B', 'Centralita masked when preserveCentralita=false',
    maskedCentralitaHidden.includes('••• •••') && !maskedCentralitaHidden.endsWith('048'), maskedCentralitaHidden);

  // Standard venue phone must be masked even when preserveCentralita=true
  const venuePhone = '+34 918 090 125';
  const maskedVenue = maskPhoneForContactGate(venuePhone, true);
  assert('MSK-02A', 'Venue phone masked with contact gate: +34 918 ••• •••',
    maskedVenue === '+34 918 ••• •••', maskedVenue, '+34 918 ••• •••');

  // Plain digits venue phone
  const plainPhone = '612345678';
  const maskedPlain = maskPhoneForContactGate(plainPhone, true);
  assert('MSK-02B', 'Plain digits venue phone masked with +34 612 ••• •••',
    maskedPlain === '+34 612 ••• •••', maskedPlain, '+34 612 ••• •••');

  // Degraded inputs
  assert('MSK-03A', 'Empty string masked to ••• ••• •••', maskPhoneForContactGate('') === '••• ••• •••', maskPhoneForContactGate(''), '••• ••• •••');
  assert('MSK-03B', 'Undefined phone masked to ••• ••• •••', maskPhoneForContactGate(undefined as unknown as string) === '••• ••• •••', true);
}

// -----------------------------------------------------------------------------
// SECTION 3: SCHEMA.ORG EVENTVENUE GENERATION OUTPUT
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: Schema.org EventVenue & Offers Generation ---');

// 3.1: Validate against Tier 1 Feature 14 & Tier 3 Combo D expectations
{
  const fincaSample = SCLASS_12_FINCAS_HOMOLOGADAS[0];
  const schema = generateFincaEventVenueSchema(fincaSample, { siteUrl: 'https://productoraear.com' });

  assert('SCM-01', '@context must be "https://schema.org"', schema['@context'] === 'https://schema.org', schema['@context'], 'https://schema.org');
  assert('SCM-02', '@type must be "EventVenue"', schema['@type'] === 'EventVenue', schema['@type'], 'EventVenue');
  assert('SCM-03', 'name matches finca name', schema.name === fincaSample.name, schema.name, fincaSample.name);
  assert('SCM-04', 'url is canonical', schema.url === `https://productoraear.com/fincas/${fincaSample.slug}`, schema.url);
  assert('SCM-05', 'address.@type is "PostalAddress"', schema.address['@type'] === 'PostalAddress', schema.address['@type'], 'PostalAddress');
  assert('SCM-06', 'addressCountry is strictly "ES"', schema.address.addressCountry === 'ES', schema.address.addressCountry, 'ES');
  assert('SCM-07', 'addressRegion is valid', schema.address.addressRegion === fincaSample.provincia, schema.address.addressRegion, fincaSample.provincia);
  assert('SCM-08', 'maximumAttendeeCapacity matches catalog', schema.maximumAttendeeCapacity === fincaSample.capacidadMaxPax, schema.maximumAttendeeCapacity, fincaSample.capacidadMaxPax);
  assert('SCM-09', 'amenityFeature has items', schema.amenityFeature.length > 0, schema.amenityFeature.length);
  assert('SCM-10', 'amenityFeature elements are LocationFeatureSpecification',
    schema.amenityFeature.every((a) => a['@type'] === 'LocationFeatureSpecification' && a.value === true), true);

  // Critical offer assertions:
  assert('SCM-11', 'offers.@type is "Offer"', schema.offers['@type'] === 'Offer', schema.offers['@type'], 'Offer');
  assert('SCM-12', 'offers.price is strictly "100.00"', schema.offers.price === '100.00', schema.offers.price, '100.00');
  assert('SCM-13', 'offers.priceCurrency is strictly "EUR"', schema.offers.priceCurrency === 'EUR', schema.offers.priceCurrency, 'EUR');
  assert('SCM-14', 'offers.availability is "https://schema.org/InStock"', schema.offers.availability === 'https://schema.org/InStock', schema.offers.availability);
  assert('SCM-15', 'offers.category is "B2B Partnership"', schema.offers.category === 'B2B Partnership', schema.offers.category, 'B2B Partnership');
}

// 3.2: Validate dynamic ItemList generation
{
  const fullCatalogCount = SCLASS_12_FINCAS_HOMOLOGADAS.length;
  const itemList = generateFincasCatalogItemListSchema(SCLASS_12_FINCAS_HOMOLOGADAS, {
    siteUrl: 'https://productoraear.com',
  });
  assert('ITM-01', 'ItemList @type is "ItemList"', itemList['@type'] === 'ItemList', itemList['@type'], 'ItemList');
  assert('ITM-02', `ItemList numberOfItems matches catalog length (${fullCatalogCount})`,
    itemList.numberOfItems === fullCatalogCount && itemList.itemListElement.length === fullCatalogCount,
    itemList.itemListElement.length, fullCatalogCount);

  let allPositionsValid = true;
  let allOffersValid = true;
  for (let i = 0; i < itemList.itemListElement.length; i++) {
    const el = itemList.itemListElement[i];
    if (el.position !== i + 1) allPositionsValid = false;
    if (el.item.offers.price !== '100.00' || el.item.offers.priceCurrency !== 'EUR') {
      allOffersValid = false;
    }
  }
  assert('ITM-03', `ItemList positions are 1-indexed (1 to ${fullCatalogCount})`, allPositionsValid, true);
  assert('ITM-04', `All ${fullCatalogCount} items have offer price="100.00" and currency="EUR"`, allOffersValid, true);

  // Custom subset check (e.g. 3 fincas)
  const subset = SCLASS_12_FINCAS_HOMOLOGADAS.slice(0, 3);
  const subsetList = generateFincasCatalogItemListSchema(subset);
  assert('ITM-05', 'Subset ItemList dynamically sets numberOfItems: 3',
    subsetList.numberOfItems === 3 && subsetList.itemListElement.length === 3, subsetList.numberOfItems, 3);
}

// 3.3: Landing Schema generation
{
  const landingSchema = generateFincasLandingSchema({ siteUrl: 'https://productoraear.com' });
  assert('LND-01', 'Landing productSchema @type is "Product"', landingSchema.productSchema['@type'] === 'Product', landingSchema.productSchema['@type'], 'Product');
  assert('LND-02', 'Landing productSchema offer price is "100.00"', landingSchema.productSchema.offers.price === '100.00', landingSchema.productSchema.offers.price, '100.00');
  assert('LND-03', `Landing itemListSchema contains ${SCLASS_12_FINCAS_HOMOLOGADAS.length} fincas`,
    landingSchema.itemListSchema.itemListElement.length === SCLASS_12_FINCAS_HOMOLOGADAS.length,
    landingSchema.itemListSchema.itemListElement.length, SCLASS_12_FINCAS_HOMOLOGADAS.length);

  // Serialization test
  const serialized = serializeSchemaToJsonLd(landingSchema.productSchema);
  let jsonParsesCleanly = false;
  try {
    const parsed = JSON.parse(serialized);
    jsonParsesCleanly = parsed['@type'] === 'Product' && parsed.offers.price === '100.00';
  } catch {
    jsonParsesCleanly = false;
  }
  assert('LND-04', 'serializeSchemaToJsonLd generates valid JSON parseable object', jsonParsesCleanly, true);
}

// -----------------------------------------------------------------------------
// SUMMARY & VERDICT
// -----------------------------------------------------------------------------
console.log('\n═'.repeat(80));
const total = results.length;
const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;
console.log(`TOTAL ADVERSARIAL TESTS: ${total}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log('═'.repeat(80));

if (failed > 0) {
  console.error('\nFAILURE DETAILS:');
  for (const f of results.filter((r) => !r.passed)) {
    console.error(`  - ${f.id} (${f.name}): Expected ${JSON.stringify(f.expected)}, Actual ${JSON.stringify(f.actual)}`);
  }
  process.exitCode = 1;
} else {
  console.log('\nALL ADVERSARIAL STRESS TESTS PASSED WITH 100% SUCCESS.');
}
