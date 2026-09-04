import * as fs from 'fs';
import * as path from 'path';

interface MunicipalitySeed {
  id: string;
  name: string;
  province: string;
  autonomousCommunity: string;
  population: number;
  tramo: 'A' | 'B' | 'C';
  minorContractLimit: number;
  dualImpactViable: boolean;
  notes: string;
}

const rawMunicipalities = [
  { name: 'Madrid', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid', population: 3332880 },
  { name: 'Toledo', province: 'Toledo', autonomousCommunity: 'Castilla-La Mancha', population: 85085 },
  { name: 'Sevilla', province: 'Sevilla', autonomousCommunity: 'Andalucía', population: 684234 },
  { name: 'Valencia', province: 'Valencia', autonomousCommunity: 'Comunidad Valenciana', population: 807693 },
  { name: 'Barcelona', province: 'Barcelona', autonomousCommunity: 'Cataluña', population: 1620343 },
  { name: 'Méntrida', province: 'Toledo', autonomousCommunity: 'Castilla-La Mancha', population: 5493 },
  { name: 'Navalcarnero', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid', population: 31235 },
  { name: 'Talavera de la Reina', province: 'Toledo', autonomousCommunity: 'Castilla-La Mancha', population: 83296 },
  { name: 'El Escorial', province: 'Madrid', autonomousCommunity: 'Comunidad de Madrid', population: 16599 },
];

export function seedNationalB2GData(): MunicipalitySeed[] {
  const municipalities: MunicipalitySeed[] = rawMunicipalities.map((item, index) => {
    const pop = item.population;
    let tramo: 'A' | 'B' | 'C' = 'A';
    if (pop > 20000) {
      tramo = 'C';
    } else if (pop >= 5000) {
      tramo = 'B';
    }

    const minorContractLimit = 14999.99;
    const dualImpactViable = pop >= 3000;
    const paddedIndex = String(index + 1).padStart(3, '0');

    return {
      id: 'MUN-' + paddedIndex,
      name: item.name,
      province: item.province,
      autonomousCommunity: item.autonomousCommunity,
      population: pop,
      tramo: tramo,
      minorContractLimit: minorContractLimit,
      dualImpactViable: dualImpactViable,
      notes: 'Nodo estratégico B2G - Tramo ' + tramo
    };
  });

  const targetDir = path.join(process.cwd(), 'src', 'data', 'b2g-national');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'national-municipalities.json');
  fs.writeFileSync(targetFile, JSON.stringify(municipalities, null, 2), 'utf-8');

  console.log('[SEEDER] Dataset guardado correctamente en: ' + targetFile);
  return municipalities;
}

seedNationalB2GData();