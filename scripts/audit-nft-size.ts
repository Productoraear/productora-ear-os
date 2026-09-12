import fs from 'fs';
import path from 'path';

const HEAVY = [
  'puppeteer',
  'playwright',
  '@sparticuz',
  'pdfjs-dist',
  'chromium-bidi',
  'better-sqlite3',
  '.prisma',
  'prisma',
  'engines',
  'libquery',
  'schema-engine',
  'firebase',
  '@firebase',
  'firebase-admin',
  'three',
  '@react-three',
  'sharp',
  'libvips',
  'stripe',
  '@img',
  '@google',
];

function walk(d: string, out: string[], filter?: string) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d)) {
    const f = path.join(d, e);
    let st;
    try {
      st = fs.statSync(f);
    } catch {
      continue;
    }
    if (st.isDirectory()) walk(f, out, filter);
    else if (!filter || f.endsWith(filter)) out.push(f);
  }
}

const nftFiles: string[] = [];
walk('.next', nftFiles, '.nft.json');

const canonicalSet = new Map<string, number>();
const relOf = new Map<string, string>();
let misses = 0;

for (const nft of nftFiles) {
  let j;
  try {
    j = JSON.parse(fs.readFileSync(nft, 'utf8'));
  } catch {
    continue;
  }
  const base = path.dirname(nft);
  for (const f of (j.files || [])) {
    const abs = path.resolve(base, f);
    let real;
    try {
      real = fs.realpathSync(abs);
    } catch {
      misses++;
      continue;
    }
    const norm = real.replace(/\\/g, '/');
    if (canonicalSet.has(norm)) continue;
    try {
      canonicalSet.set(norm, fs.statSync(real).size);
      relOf.set(norm, real);
    } catch {
      misses++;
    }
  }
}

let total = 0;
for (const s of canonicalSet.values()) total += s;

const bigFiles = [...canonicalSet.entries()]
  .filter(([, s]) => s > 3 * 1048576)
  .sort((a, b) => b[1] - a[1]);

console.log('NFT files scanned:', nftFiles.length);
console.log('Unique canonical files:', canonicalSet.size, ' misses:', misses);
console.log('UNION TOTAL MB (canonical dedup):', (total / 1048576).toFixed(1));
console.log('');
console.log('TOP individual files > 3 MB:');
for (const [f, s] of bigFiles.slice(0, 50)) {
  const nm = f.split('node_modules/').pop() || f.split('/').pop();
  console.log('  ' + (s / 1048576).toFixed(1).padStart(8) + ' MB  ' + nm);
}
