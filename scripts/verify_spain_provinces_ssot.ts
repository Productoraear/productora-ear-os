/**
 * 🔒 GUARDIÁN DEL SSOT GEOGRÁFICO — 52 PROVINCIAS DE ESPAÑA
 * Valida censo, códigos oficiales, alias cooficiales y CERO cruces entre provincias.
 * Uso: npx tsx scripts/verify_spain_provinces_ssot.ts
 */
import fs from 'fs';
import path from 'path';
import {
  ALL_SPANISH_PROVINCES,
  SPAIN_PROVINCES,
  getProvinceSearchVariants,
  isProvinceMatch,
  normalizeProvinceName,
  resolveProvince,
} from '../src/lib/constants/spain-regions-and-categories';

const failures: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) failures.push(message);
};

// 1. Censo: 50 provincias + Ceuta y Melilla
check(SPAIN_PROVINCES.length === 52, `Censo incompleto: ${SPAIN_PROVINCES.length}/52`);
check(new Set(SPAIN_PROVINCES.map((p) => p.code)).size === 52, 'Códigos provinciales duplicados');
check(new Set(SPAIN_PROVINCES.map((p) => normalizeProvinceName(p.name))).size === 52, 'Nombres duplicados');
check(ALL_SPANISH_PROVINCES.length === 52, 'ALL_SPANISH_PROVINCES no expone 52 entradas');

// 2. Resolución por nombre, código y acentos
for (const province of SPAIN_PROVINCES) {
  check(resolveProvince(province.name)?.code === province.code, `Nombre no resuelve: ${province.name}`);
  check(resolveProvince(province.code)?.code === province.code, `Código no resuelve: ${province.code}`);
  check(
    resolveProvince(normalizeProvinceName(province.name))?.code === province.code,
    `Nombre sin tildes no resuelve: ${province.name}`
  );
  check(isProvinceMatch(province.name, province.name), `Auto-coincidencia fallida: ${province.name}`);
}

// 3. CERO cruces: ninguna provincia puede coincidir con otra
for (const target of SPAIN_PROVINCES) {
  for (const candidate of SPAIN_PROVINCES) {
    if (target.code === candidate.code) continue;
    check(
      !isProvinceMatch(target.name, candidate.name),
      `CRUCE PROHIBIDO: ${target.name} coincide con ${candidate.name}`
    );
  }
}

// 4. Alias y cooficialidades
const aliasCases: Array<[string, string]> = [
  ['A Coruña', 'La Coruña'],
  ['Bizkaia', 'Vizcaya'],
  ['Girona', 'Gerona'],
  ['Araba', 'Álava'],
  ['Illes Balears', 'Islas Baleares'],
  ['Castelló', 'Castellón'],
  ['Oviedo', 'Asturias'],
  ['Méntrida', 'Toledo'],
  ['Marbella', 'Málaga'],
  ['Tenerife', 'Santa Cruz de Tenerife'],
  ['Alacant', 'Alicante'],
  ['Donostia', 'Guipúzcoa'],
];
for (const [alias, canonical] of aliasCases) {
  check(isProvinceMatch(alias, canonical), `Alias no resuelve: ${alias} -> ${canonical}`);
  check(isProvinceMatch(canonical, alias), `Alias inverso no resuelve: ${canonical} -> ${alias}`);
}

// 5. Variantes Prisma: sin códigos de 1-2 letras (evita `contains` contaminante)
for (const province of SPAIN_PROVINCES) {
  const variants = getProvinceSearchVariants(province.name);
  check(variants.length > 0, `Sin variantes Prisma: ${province.name}`);
  check(
    variants.every((v) => v.length >= 3),
    `Variante demasiado corta para contains: ${province.name} -> ${variants.join(',')}`
  );
}

// 6. Data Lake: 10 gremios oficiales y censo real
const dataDir = path.join(process.cwd(), 'public', 'data', 'providers');
const categories = ['finca', 'catering', 'foto', 'musica', 'decoracion', 'wedding', 'moda', 'transporte', 'sonido', 'servicios'];
let directoryTotal = 0;

if (fs.existsSync(path.join(dataDir, 'manifest.json'))) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, 'manifest.json'), 'utf8')) as Record<
    string,
    { chunks?: string[]; count?: number }
  >;
  for (const category of categories) {
    const entry = manifest[category];
    check(Boolean(entry), `Gremio ausente en manifest: ${category}`);
    if (!entry?.chunks?.length) continue;
    let loaded = 0;
    for (const chunk of entry.chunks) {
      const file = path.join(dataDir, chunk);
      if (!fs.existsSync(file)) {
        failures.push(`Chunk ausente: ${chunk}`);
        continue;
      }
      const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(rows)) loaded += rows.length;
    }
    check(loaded === entry.count, `Descuadre ${category}: manifest=${entry.count} real=${loaded}`);
    directoryTotal += loaded;
  }
  check(directoryTotal >= 12000, `Directorio por debajo del censo esperado: ${directoryTotal}`);
}

if (failures.length > 0) {
  console.error(`❌ SSOT GEOGRÁFICO INVALIDADO (${failures.length} fallos)`);
  for (const failure of failures.slice(0, 40)) console.error(' - ' + failure);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      provinces: SPAIN_PROVINCES.length,
      crossChecks: SPAIN_PROVINCES.length * (SPAIN_PROVINCES.length - 1),
      categories: categories.length,
      directoryTotal,
      status: 'OK',
    },
    null,
    2
  )
);
