/**
 * ════════════════════════════════════════════════════════════════════════════
 * STRESS_UI_ARTIST_360.TS — EMPIRICAL ADVERSARIAL STRESS TEST FOR ARTIST 360
 * ════════════════════════════════════════════════════════════════════════════
 * Executed by Teamwork Challenger 2 (UI & Audio Stress Challenger)
 * Tests:
 * 1. AST Static Inspection for Dead Clicks, Unhandled Handlers & Route Promises
 * 2. ISRC Pathological Inputs, ReDoS resistance, and XSS/SQL robustness
 * 3. Audio Player Fallback logic & Web Audio resilience
 * 4. Contract edge-case resilience (extreme values, negative inputs)
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import {
  calculateArtistQuote,
  settleArtistSplit,
  validateIsrc,
  generateCanonicalIsrc,
  ARTIST_360_TRACKS,
} from '../src/lib/artists/artist-360-contract';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assertTest(name: string, condition: boolean, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${name}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${name} -> ${detail || 'Condition false'}`);
  }
}

console.log('════════════════════════════════════════════════════════════════');
console.log('🔥 EMPIRICAL ADVERSARIAL CHALLENGER 2: UI & AUDIO STRESS SUITE');
console.log('════════════════════════════════════════════════════════════════\n');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: AST & INTERACTION AUDIT (ZERO DEAD CLICKS / ORPHANED CONTROLS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('📋 SUITE 1: AST / Interactive Controls & Dead Clicks Audit');

const panelFile = path.join(process.cwd(), 'src/components/artists/ArtistPanel360.tsx');
const slugPageFile = path.join(process.cwd(), 'src/app/(public)/artistas/[slug]/page.tsx');
const edwinPageFile = path.join(process.cwd(), 'src/app/(public)/artistas/edwin-agudelo/page.tsx');
const adminTabFile = path.join(process.cwd(), 'src/app/(admin)/admin/control/tabs/ArtistasTab.tsx');

const panelSrc = fs.readFileSync(panelFile, 'utf-8');
const slugPageSrc = fs.readFileSync(slugPageFile, 'utf-8');
const edwinPageSrc = fs.readFileSync(edwinPageFile, 'utf-8');
const adminTabSrc = fs.readFileSync(adminTabFile, 'utf-8');

// 1.1 Verify all buttons in ArtistPanel360 have onClick or type="submit"
const buttonMatches = panelSrc.match(/<button[\s\S]*?<\/button>/g) || [];
console.log(`  Found ${buttonMatches.length} <button> tags in ArtistPanel360.tsx`);

let unhandledButtons = 0;
buttonMatches.forEach((btn, i) => {
  const hasOnClick = /onClick=\{/.test(btn);
  const isSubmit = /type=["']submit["']/.test(btn);
  if (!hasOnClick && !isSubmit) {
    unhandledButtons++;
    console.error(`    Button #${i + 1} has no onClick or submit handler: ${btn.slice(0, 80)}...`);
  }
});
assertTest('All buttons in ArtistPanel360 have active onClick or submit handler', unhandledButtons === 0, `${unhandledButtons} orphaned buttons`);

// 1.2 Verify all range inputs in ArtistPanel360 have onChange and aria-label
const rangeMatches = panelSrc.match(/<input[\s\S]*?type=["']range["'][\s\S]*?\/>/g) || [];
console.log(`  Found ${rangeMatches.length} range sliders in ArtistPanel360.tsx`);
let unhandledSliders = 0;
rangeMatches.forEach((slider, i) => {
  const hasOnChange = /onChange=\{/.test(slider);
  const hasAria = /aria-label=/.test(slider);
  if (!hasOnChange || !hasAria) {
    unhandledSliders++;
    console.error(`    Slider #${i + 1} missing onChange or aria-label: ${slider}`);
  }
});
assertTest('All range sliders in ArtistPanel360 have active onChange and aria-label', unhandledSliders === 0);

// 1.3 Verify no dead links (href="#" or href="")
const allLinks = (panelSrc + slugPageSrc + edwinPageSrc + adminTabSrc).match(/href=["'](#|"|'|\s*)["']/g) || [];
assertTest('Zero empty or dummy href="#" in review files', allLinks.length === 0, `Found ${allLinks.length} dummy hrefs`);

// 1.4 Next.js 16 dynamic params resolution in /artistas/[slug]/page.tsx
const hasAwaitParams = /const\s*\{\s*slug\s*\}\s*=\s*await\s+params/.test(slugPageSrc);
const hasPromiseParamType = /params:\s*Promise<\{\s*slug:\s*string\s*\}>/.test(slugPageSrc);
assertTest('Next.js 16: params is Promise<{ slug: string }>', hasPromiseParamType);
assertTest('Next.js 16: params is resolved with await params', hasAwaitParams);

// 1.5 Admin tab navigation link to /artistas/[slug]
const hasAdminLinkToArtist = /href=\{`\/artistas\/\$\{encodeURIComponent\(row\.slug\)\}`\}/.test(adminTabSrc);
assertTest('ArtistasTab links correctly to /artistas/${slug}', hasAdminLinkToArtist);


// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: ISRC ADVERSARIAL PATHOLOGICAL STRESS & REDOS AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔒 SUITE 2: ISRC Validation & Pathological Input Suite');

const pathologicalStrings = [
  '',
  ' ',
  '    \t\r\n   ',
  'A'.repeat(5000), // extreme length
  'ES-EAR-26-00001' + 'A'.repeat(5000),
  'ES-EAR-' + '9'.repeat(10000),
  'ES-EAR-XX-YYYYY',
  'ES-EAR-26-0000', // too short
  'ES-EAR-26-000001', // too long sequence
  'ES-EAR-260-00001', // too long year
  '<script>alert("xss")</script>',
  '"><img src=x onerror=alert(1)>',
  "'; DROP TABLE artists; --",
  "ES-EAR-26-00001' OR '1'='1",
  'ES-EAR-26-00001\0NULLBYTE',
  'ES\u202EEAR-26-00001', // Bidirectional override
  'ES-EAR-26-00001🚀',
  'es-ear-26-00001', // lowercase (should be normalized or accepted if trimmed/uppercased)
  '  ES-EAR-26-00001  ', // whitespace padded
  'undefined',
  'null',
  '[object Object]',
  String(NaN),
  String(Infinity),
];

let isrcErrors = 0;
pathologicalStrings.forEach((input, idx) => {
  const start = performance.now();
  let result;
  try {
    result = validateIsrc(input);
  } catch (err) {
    isrcErrors++;
    console.error(`    Crash on input #${idx} (${input.slice(0, 30)}):`, err);
    return;
  }
  const duration = performance.now() - start;
  if (duration > 50) {
    isrcErrors++;
    console.error(`    Potential ReDoS on input #${idx} took ${duration.toFixed(2)}ms!`);
  }
  if (typeof result.valid !== 'boolean') {
    isrcErrors++;
    console.error(`    Invalid return type on input #${idx}:`, result);
  }
});
assertTest('ISRC validator survives 24 pathological inputs with zero crashes or ReDoS (>50ms)', isrcErrors === 0);

// Canonical valid ISRC check
const validCheck = validateIsrc('  es-ear-26-00042  ');
assertTest('ISRC validator normalizes whitespace and lowercase for canonical codes', validCheck.valid === true && validCheck.country === 'ES' && validCheck.designation === '00042');

// Generator pathological checks
let genErrors = 0;
try {
  const g1 = generateCanonicalIsrc(26, 1);
  if (g1 !== 'ES-EAR-26-00001') genErrors++;

  const g2 = generateCanonicalIsrc(2026, 99999);
  if (g2 !== 'ES-EAR-26-99999') genErrors++;

  // Extreme / edge values
  const g3 = generateCanonicalIsrc(0, 0);
  if (!g3.startsWith('ES-EAR-00-00000')) genErrors++;

  const g4 = generateCanonicalIsrc(-5, -10);
  if (typeof g4 !== 'string' || g4.length === 0) genErrors++;
} catch (err) {
  genErrors++;
  console.error('    Crash in generateCanonicalIsrc:', err);
}
assertTest('Canonical ISRC generator handles edge values deterministically', genErrors === 0);


// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: AUDIO ENGINE RESILIENCE & FAILURE RECOVERY AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🎧 SUITE 3: Audio Engine Resilience & Procedural Fallback Audit');

// 3.1 Verify ARTIST_360_TRACKS integrity
assertTest('Tracklist has at least 2 certified tracks', ARTIST_360_TRACKS.length >= 2);
let brokenTrack = false;
ARTIST_360_TRACKS.forEach((track, i) => {
  if (!track.id || !track.title || !track.isrc || !track.durationSeconds || track.durationSeconds <= 0) {
    brokenTrack = true;
    console.error(`    Track #${i} invalid structure:`, track);
  }
  const isrcCheck = validateIsrc(track.isrc);
  if (!isrcCheck.valid) {
    brokenTrack = true;
    console.error(`    Track #${i} has non-conforming ISRC: ${track.isrc}`);
  }
});
assertTest('All official tracks have valid metadata and conforming ISRC codes', !brokenTrack);

// 3.2 Verify ArtistPanel360 audio error handler code inspection
const hasAudioErrorHandler = /audio\.addEventListener\(['"]error['"],\s*handleError\)/.test(panelSrc);
const hasOfflineSimulatedState = /setIsOfflineSimulated\(true\)/.test(panelSrc);
const hasProceduralFallback = /triggerProceduralChime/.test(panelSrc);
const hasAutoplayCatch = /playPromise\.catch\(/.test(panelSrc);
const hasTimerCleanup = /clearInterval\(simulationIntervalRef\.current\)/.test(panelSrc);

assertTest('HTML5 audio attaches error event listener (offline resilience)', hasAudioErrorHandler);
assertTest('Audio error switches to local offline simulation mode', hasOfflineSimulatedState);
assertTest('Procedural Web Audio chime fallback implemented', hasProceduralFallback);
assertTest('Browser autoplay rejection handled with catch()', hasAutoplayCatch);
assertTest('Simulation timer interval properly cleaned up on unmount/pause', hasTimerCleanup);


// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: CONTRACT FINANCIAL & ACOUSTIC BOUNDARY CONDITIONS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n💰 SUITE 4: Financial Boundary & Acoustic Rider Stress');

// 4.1 Devaluation attempt on Solista (must enforce 350 € minimum)
const devalQuote = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 0,
  customBaseCacheEur: 50, // Hostile attempt to set base to 50 €
});
assertTest('Hostile devaluation to 50 € rejected; base remains 350 €', devalQuote.baseCacheEur === 350 && devalQuote.totalEventEur === 350);

// 4.2 Negative distance handling
const negDistQuote = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: -100,
});
assertTest('Negative distance (-100 km) clamped to 0 chargeable km and 0 € logistics', negDistQuote.chargeableKm === 0 && negDistQuote.logisticsTotalEur === 0);

// 4.3 High distance (> 200 km) hotel trigger
const dist205Quote = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 205,
  endHour24: 1, // before 3am, but > 200km
});
assertTest('Distance 205 km (> 200 km) triggers 120 € hotel supplement regardless of hour', dist205Quote.hotelSupplementEur === 120);

// 4.4 Hour >= 3:00 hotel trigger
const hour3Quote = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 30, // within 50km
  endHour24: 3, // 3:00 AM
});
assertTest('Hour 3:00 AM triggers 120 € hotel supplement regardless of distance', hour3Quote.hotelSupplementEur === 120);

// 4.5 B2G Ceiling threshold (14.250 €)
const normalQuote = calculateArtistQuote({ format: 'ORQUESTA', distanceKm: 50 });
assertTest('Normal quote (1800 €) does NOT trigger B2G alert', normalQuote.b2gCeilingAlert === false);

const b2gExceededQuote = calculateArtistQuote({
  format: 'ORQUESTA',
  distanceKm: 10000, // 9950 km * 1.50 = 14925 €
});
assertTest('Massive quote exceeding 14.250 € triggers B2G ceiling alert', b2gExceededQuote.b2gCeilingAlert === true);

// 4.6 Acoustic Rider calculation
const acoustic50pax = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 0, audiencePax: 50 });
assertTest('Acoustic rider calculates 12 W/pax (50 pax = 600 W)', acoustic50pax.acousticRider.wattsTotal === 600);
assertTest('Acoustic rider enforces Ley 37/2003 SPL ceiling (<= 75 dB SPL)', acoustic50pax.acousticRider.maxSplDb <= 75 && acoustic50pax.acousticRider.compliant);

// 4.7 Integer Cents Invariant on Split 80/10/10 across 100 random amounts
let splitInequalities = 0;
for (let euro = 100; euro <= 10000; euro += 73.37) {
  const s = settleArtistSplit(euro, 100);
  if (s.artistCents + s.earOsCents + s.vimumeCents !== s.totalCents) {
    splitInequalities++;
  }
}
assertTest('Integer Cents Invariant holds across 135 continuous price points', splitInequalities === 0);

console.log('\n════════════════════════════════════════════════════════════════');
console.log(`📊 TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('════════════════════════════════════════════════════════════════');

if (failedTests > 0) {
  console.error('\n❌ STRESS TEST FAILED');
  process.exit(1);
} else {
  console.log('\n🏆 ALL STRESS TESTS PASSED WITH ZERO FAILURES (EXIT CODE 0)');
  process.exit(0);
}
