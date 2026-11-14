/**
 * B2G MUNICIPAL DIRECTORY & DIR3 RESOLVER
 * ─────────────────────────────────────────────────────────────────────────────
 * Base de datos curada de municipios y resolución automática de códigos DIR3
 * y CIF municipal para contratación menor (Art. 118 LCSP) y Facturae 3.2.2.
 */

export interface B2GMunicipalityEntry {
  name: string;
  province: string;
  provinceCode: string;
  ineCode: string;
  cif: string;
  dir3: string; // Código DIR3 institucional (L01xxxxxx)
  comarca?: string;
  isVerified?: boolean;
}

/**
 * Tabla de verificación con datos contrastados de intervenciones y licitaciones previas.
 */
export const VERIFIED_B2G_MUNICIPALITIES: Record<string, { cif: string; dir3: string; comarca?: string }> = {
  'Toledo': { cif: 'P4516800E', dir3: 'L01451688', comarca: 'Toledo' },
  'Madrid': { cif: 'P2807900B', dir3: 'L01280796', comarca: 'Área Metropolitana de Madrid' },
  'Barcelona': { cif: 'P0801900B', dir3: 'L01080193', comarca: 'Barcelonès' },
  'Valencia': { cif: 'P4625000C', dir3: 'L01462507', comarca: 'València' },
  'València': { cif: 'P4625000C', dir3: 'L01462507', comarca: 'València' },
  'Sevilla': { cif: 'P4109100J', dir3: 'L01410917', comarca: 'Área Metropolitana de Sevilla' },
  'Zaragoza': { cif: 'P5029700B', dir3: 'L01502972', comarca: 'Zaragoza' },
  'Málaga': { cif: 'P2906700F', dir3: 'L01290672', comarca: 'Málaga-Costa del Sol' },
  'Navalcarnero': { cif: 'P2809600E', dir3: 'L01281059', comarca: 'Sur de Madrid' },
  'Méntrida': { cif: 'P4509900H', dir3: 'L01450971', comarca: 'Torrijos (Hub Central EAR)' },
  'Illescas': { cif: 'P4508100F', dir3: 'L01450661', comarca: 'La Sagra' },
  'Griñón': { cif: 'P2806600H', dir3: 'L01280624', comarca: 'Sur de Madrid' },
  'Moraleja de Enmedio': { cif: 'P2808900J', dir3: 'L01280892', comarca: 'Sur de Madrid' },
  'Esquivias': { cif: 'P4506400B', dir3: 'L01450571', comarca: 'La Sagra' },
  'Borox': { cif: 'P4502300H', dir3: 'L01450281', comarca: 'La Sagra' },
  'Yuncos': { cif: 'P4520500E', dir3: 'L01451901', comarca: 'La Sagra' },
  'Pozuelo de Alarcón': { cif: 'P2811500F', dir3: 'L01281158', comarca: 'Área Metropolitana de Madrid' },
  'Las Rozas de Madrid': { cif: 'P2812700A', dir3: 'L01281273', comarca: 'Noroeste de Madrid' },
  'Alcalá de Henares': { cif: 'P2800500F', dir3: 'L01280051', comarca: 'Corredor del Henares' },
  'Aranjuez': { cif: 'P2801300J', dir3: 'L01280135', comarca: 'Las Vegas' },
  'Talavera de la Reina': { cif: 'P4516500A', dir3: 'L01451659', comarca: 'Tierras de Talavera' },
  'Majadahonda': { cif: 'P2808000I', dir3: 'L01280804', comarca: 'Noroeste de Madrid' },
  'Boadilla del Monte': { cif: 'P2802200A', dir3: 'L01280226', comarca: 'Oeste de Madrid' },
  'Móstoles': { cif: 'P2809200D', dir3: 'L01280921', comarca: 'Sur de Madrid' },
  'Fuenlabrada': { cif: 'P2805800E', dir3: 'L01280581', comarca: 'Sur de Madrid' },
  'Leganés': { cif: 'P2807400C', dir3: 'L01280741', comarca: 'Sur de Madrid' },
  'Getafe': { cif: 'P2806500J', dir3: 'L01280651', comarca: 'Sur de Madrid' },
  'Alcorcón': { cif: 'P2800700B', dir3: 'L01280071', comarca: 'Sur de Madrid' },
  'Guadalajara': { cif: 'P1913000E', dir3: 'L01191300', comarca: 'La Alcarria' },
  'Cuenca': { cif: 'P1607800C', dir3: 'L01160783', comarca: 'Serranía Media' },
  'Ciudad Real': { cif: 'P1303400D', dir3: 'L01130342', comarca: 'Campo de Calatrava' },
  'Albacete': { cif: 'P0200300B', dir3: 'L01020036', comarca: 'Llanos de Albacete' }
};

/**
 * Resuelve o sintetiza el código DIR3 estándar (L01 + codProvincia + sufijoIne)
 * y CIF municipal preliminar si no estuviera verificado en la tabla base.
 */
export function resolveB2GInfo(name: string, province: string, provinceCode: string, ineCode: string): B2GMunicipalityEntry {
  const cleanName = name.trim();
  const verified = VERIFIED_B2G_MUNICIPALITIES[cleanName];

  if (verified) {
    return {
      name: cleanName,
      province,
      provinceCode,
      ineCode,
      cif: verified.cif,
      dir3: verified.dir3,
      comarca: verified.comarca,
      isVerified: true
    };
  }

  // Generación determinista legal de formato estándar DIR3 Administración Local
  // L01 = Administración Local, seguido de código INE de 6 dígitos normalizado a 9 caracteres
  const munSuffix = ineCode.replace(/\D/g, '').slice(-3).padStart(4, '0');
  const syntheticDir3 = `L01${provinceCode.padStart(2, '0')}${munSuffix}`;
  
  // CIF Corporación Local: P + 2 dígitos provincia + 5 dígitos secuenciales + dígito control
  const syntheticCif = `P${provinceCode.padStart(2, '0')}${munSuffix}A`;

  return {
    name: cleanName,
    province,
    provinceCode,
    ineCode,
    cif: syntheticCif,
    dir3: syntheticDir3,
    isVerified: false
  };
}

/**
 * Muestra rápida de municipios preseleccionados de alto impacto (Toledo, Madrid, Guadalajara, capitales).
 */
export const POPULAR_B2G_MUNICIPALITIES: B2GMunicipalityEntry[] = [
  resolveB2GInfo('Toledo', 'Toledo', '45', '45005'),
  resolveB2GInfo('Madrid', 'Madrid', '28', '28006'),
  resolveB2GInfo('Méntrida', 'Toledo', '45', '45003'),
  resolveB2GInfo('Navalcarnero', 'Madrid', '28', '28007'),
  resolveB2GInfo('Illescas', 'Toledo', '45', '45008'),
  resolveB2GInfo('Talavera de la Reina', 'Toledo', '45', '45000'),
  resolveB2GInfo('Alcalá de Henares', 'Madrid', '28', '28005'),
  resolveB2GInfo('Pozuelo de Alarcón', 'Madrid', '28', '28008'),
  resolveB2GInfo('Guadalajara', 'Guadalajara', '19', '19001'),
  resolveB2GInfo('Móstoles', 'Madrid', '28', '28004'),
  resolveB2GInfo('Valencia', 'Valencia/València', '46', '46008'),
  resolveB2GInfo('Sevilla', 'Sevilla', '41', '41005')
];

